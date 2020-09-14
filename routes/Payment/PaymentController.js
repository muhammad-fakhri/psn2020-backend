let PaymentModel = require("./PaymentModel");
let TeamModel = require("../Team/TeamModel");
let SchoolModel = require("../School/SchoolModel");
let PaymentEncription = require("../Midleware/PaymentEncription");
let axios = require("axios");
let mongoose = require("mongoose");
const { ClientId, SecretKey } = require("../../config/PaymentCredential");
let ParamModel = require("../Params/ParamModel");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

class PaymentController {
  static async getAllPayment(req, res) {
    try {
      let payments = await PaymentModel.find({})
        .populate(
          "school",
          "-password -createdAt -updatedAt -verifyEmailToken -__v"
        )
        .populate("teams");
      return res.status(200).json({ payments });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getPaymentDetail(req, res) {
    let { paymentId } = req.params;
    try {
      await PaymentModel.exists({ _id: paymentId }, async (err, result) => {
        if (!result) {
          return res.status(404).json({ message: "Payment not found" });
        }
        let payment = await PaymentModel.findById(paymentId)
          .populate(
            "school",
            "-password -createdAt -updatedAt -verifyEmailToken -__v"
          )
          .populate("teams");
        return res.status(200).json({ payment });
      });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  static async create(req, res) {
    try {
      let { school, teams } = req.value.body,
        totalPrice = 0,
        trx_id = mongoose.Types.ObjectId();

      // check the teams, already final or not
      for (let index = 0; index < teams.length; index++) {
        let teamData = await TeamModel.findById(teams[index]);
        if (teamData.isFinal)
          return res.status(400).json({ message: "The given team is final" });
      }

      // Generate virtual account number
      let lastVA = await ParamModel.findOne({ code: "LAST_VA" });
      let firstVA = Math.floor(1000 + Math.random() * 9000);
      let virtual_account =
        "988" + ClientId.toString() + firstVA.toString() + lastVA.value;

      // update last VA value
      let nextValue = (parseInt(lastVA.value) + 1).toString();
      lastVA.value = "0".repeat(4 - nextValue.length) + nextValue;
      lastVA.save();

      console.log("VANumber : " + virtual_account);

      // get school data
      let schoolData = await SchoolModel.findById({ _id: school });

      // if no team provided, send 400
      if (teams.length == 0)
        return res.status(400).json({ message: "No team ID provided" });

      // calculate price
      for (let index = 0; index < teams.length; index++) {
        let teamData = await TeamModel.findById(teams[index]).populate(
          "contest"
        );
        let price =
          teamData.students.length * parseInt(teamData.contest.pricePerStudent);

        totalPrice += price;
      }

      // Administration fee
      totalPrice += 5000;

      // prepare encrypted data
      let data = {
        type: "createbilling",
        trx_amount: totalPrice,
        customer_name: schoolData.name,
        customer_email: schoolData.email,
        description: "Pembayaran Kompetisi PSN 2020",
        trx_id,
        virtual_account,
        billing_type: "c",
        client_id: ClientId,
      };

      console.log(data);

      let encryptedData = PaymentEncription.encrypt(data, ClientId, SecretKey),
        response = await axios({
          method: "post",
          headers: { "Content-Type": "application/json" },
          url: process.env.PAYMENT_GATEWAY_API,
          data: {
            client_id: ClientId,
            data: encryptedData,
          },
        });

      response = response.data;
      console.log(response);

      // create payment
      let payment = await PaymentModel.create({
        _id: trx_id,
        totalPrice,
        VANumber: virtual_account,
        school,
        teams,
        status: "waiting",
        createdDate: Date.now(),
      });
      await payment
        .populate(
          "school",
          "-password -createdAt -updatedAt -verifyEmailToken -__v"
        )
        .populate("teams")
        .execPopulate();

      // set isFinal to true
      teams.forEach(async (team) => {
        await TeamModel.findOneAndUpdate({ _id: team }, { isFinal: true });
      });

      return res.status(201).json({ payment });
    } catch (e) {
      console.log("Payment: Create payment fail");
      if (e.response.status == 400) {
        res.status(400).json({
          message:
            "There is an error when creating the payment, please contact the committee",
        });
      } else {
        res.status(500).json({ message: e.message });
      }
    }
  }

  static async updatePayment(req, res) {
    try {
      let { paymentId, status } = req.body;
      await PaymentModel.exists({ _id: paymentId }, async (err, result) => {
        if (!result)
          return res.status(404).json({ message: "Payment not found" });

        let payment = await PaymentModel.findById(paymentId).populate("teams");

        if (payment.status === "paid") {
          if (status === "waiting") {
            for (let index = 0; index < payment.teams.length; index++) {
              payment.teams[index].isPaid = false;
              payment.teams[index].save();
            }
            payment.paidDate = null;
            payment.status = "waiting";
            payment.save();
          }
        } else if (payment.status === "waiting") {
          if (status === "paid") {
            for (let index = 0; index < payment.teams.length; index++) {
              payment.teams[index].isPaid = true;
              payment.teams[index].save();
            }
            payment.paidDate = Date.now();
            payment.status = "paid";
            payment.save();
          }
        }

        return res.status(200).json({ message: "Payment updated" });
      });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  static async uploadReceipt(req, res) {
    let { paymentId } = req.value.body;

    try {
      if (!req.files)
        return res
          .status(400)
          .json({ message: "Payment receipt image is required" });
      let image = req.files.paymentReceipt;
      await PaymentModel.exists({ _id: paymentId }, async (err, result) => {
        if (!result)
          return res.status(404).json({ message: "Payment not found" });

        let extension = path.extname(image.name);
        if (extension !== ".jpg" && extension !== ".png") {
          return res
            .status(400)
            .json({ message: "Please use .jpg or .png image" });
        }
        image.name = uuidv4() + extension;
        image.mv("./uploads/payment/" + image.name);
        let imgPath = "/payment/" + image.name;
        PaymentModel.findByIdAndUpdate(
          paymentId,
          { paymentReceipt: imgPath },
          (err, payment) => {
            if (err) {
              return res.status(500).json({ message: err.message });
            } else {
              return res
                .status(200)
                .json({ message: "Payment receipt uploaded" });
            }
          }
        );
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // static async callback(req, res, next) {
  //     // urus lagi nanti, update bill ke database
  //     try {
  //         let { client_id, data } = req.body,
  //             decryptedData = PaymentEncription.decrypt(data, cid, sck);
  //         // let bill = await BillModel.findByIdAndUpdate({_id:decryptedData.trx_id},{payment:{status:'paid',data:Date.now()}});
  //         console.log(data, decryptedData);
  //         let bill = await PaymentModel.findById({ _id: decryptedData.trx_id });
  //         if (bill == null || bill == undefined) {
  //             throw new Error(`Bill with id ${decryptedData.trx_id} not found`);
  //         }
  //         bill.payment.status = 'paid';
  //         bill.payment.date = Date.now();
  //         if (bill.type == 'accommodation') {
  //             for (let i = 0; i < bill.accommodation.bookings.length; i++) {
  //                 let booking = await BookingModel.findByIdAndUpdate({ _id: bill.accommodation.bookings[i] }, { isPaid: true });
  //                 // console.log(booking);
  //             }
  //         }
  //         if (bill.type == 'registration') {
  //             for (let i = 0; i < bill.registration.teams.length; i++) {
  //                 await TeamModel.findByIdAndUpdate({ _id: bill.registration.teams[i] }, {
  //                     isPaid2: true
  //                 });
  //             }
  //             for (let i = 0; i < bill.registration.teachers.length; i++) {
  //                 await TeacherModel.findByIdAndUpdate({ _id: bill.registration.teachers[i] }, {
  //                     isPaid2: true
  //                 });
  //             }
  //         }
  //         await bill.save();
  //         console.log({ trx: data.trx_id, message: "Bill berhasil diupdate" });
  //         return res.json({ trx: data.trx_id, message: "Bill berhasil diupdate", status: "000" });
  //     } catch (e) {
  //         return res.json({ message: e.message });
  //     }
  // }

  static async listBySchool(req, res) {
    let { schoolId } = req.params;
    try {
      let school = await SchoolModel.findById(
        schoolId,
        "-password -createdAt -updatedAt -verifyEmailToken -__v"
      );
      let payments = await PaymentModel.find({ school: schoolId }).populate(
        "teams"
      );
      return res.json({ school, payments });
    } catch (e) {
      return res.json({ message: e.message });
    }
  }

  //   static async count(req, res) {
  //     try {
  //       let { school } = req.params,
  //         totalBill = await PaymentModel.count({ school });
  //       return res.status(200).json({ totalBill });
  //     } catch (e) {
  //       return res.status(400).json({ message: e.message, totalBill: null });
  //     }
  //   }
  //   static async findByVA(req, res, next) {
  //     try {
  //       let { vaNumber } = req.body;
  //       let bills = await PaymentModel.find({
  //         VANumber: { $regex: vaNumber, $options: "i" },
  //       }).populate("school");
  //       return res.status(200).json(bills);
  //     } catch (e) {
  //       return res.status(400).json({ message: e.message });
  //     }
  //   }
}

module.exports = PaymentController;
