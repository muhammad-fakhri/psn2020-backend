const nodemailer = require('nodemailer');
const transport = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
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
                <h2>Hello ${name}</h2>
                <h3>Thank you for registering at PSN 2020<h3> 
                <p>Before you can continue please verify your email first by clicking the link below.</p>
                <a target="_blank" href="${process.env.BASE_URL}/auth/email/verify?email=${email}&token=${token}">Click this link to verify your email</a>
            `,
        });
    }

    static async sendForgotPasswordEmail(name, email, token) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport(transport);

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Pesta Sains Nasional 2020" <admin@psn.ipb.ac.id>',
            to: email,
            subject: "Reset Password",
            text: "You can reset your password by click the link in this email",
            // TODO: set link to open frontend page for set new password
            html: `
                <h2>Hello ${name}</h2>
                <h3>You are requesting a password reset<h3> 
                <p>You can reset your password by clicking the link below</p>
                <a target="_blank" href="${process.env.BASE_URL}?email=${email}&token=${token}">Click this link to reset your password</a>
            `,
        });
    }
}

module.exports = Mail;