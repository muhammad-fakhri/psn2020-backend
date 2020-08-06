const nodemailer = require('nodemailer');
const transport = {
    host: "smtp.mailtrap.io",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'ffe5397366b1e1',
        pass: '5d0ef7a12c3b97',
    },
};

class Mail {
    static async sendVerifyEmail(name, email, token) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport(transport);

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Pesta Sains Nasional 2020" <admin@psn.ipb.ac.id>',
            to: email,
            subject: "Verify Your Email",
            text: "Please verify your email",
            html: `
                <h2>Hai ${name}</h2>
                <h3>Thank you for registering at PSN 2020<h3> 
                <p>Before you can continue please verify your email first by clicking the link below.</p>
                <a target="_blank" href="http://localhost:3000/auth/email/verify?email=${email}&token=${token}">Click this link to verify your email</a>
            `,
        });
    }
}

module.exports = Mail;