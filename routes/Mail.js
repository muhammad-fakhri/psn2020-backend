const nodemailer = require('nodemailer');
let environment = process.env;

const SMTPTransporter = nodemailer.createTransport({
    host: environment.SMTP_SERVICE_HOST,
    secure: false,
    port: environment.SMTP_SERVICE_PORT,
    auth: {
        user: environment.SMTP_USER_NAME,
        pass: environment.SMTP_PASSWORD
    }
});

const GmailTransporter = nodemailer.createTransport({
    service: environment.GMAIL_SERVICE_NAME,
    auth: {
        user: environment.GMAIL_USER_NAME,
        pass: environment.GMAIL_USER_PASSWORD
    }
});

const transporter = environment.MAIL_SERVICE === 'gmail' ? GmailTransporter : SMTPTransporter;

class Mail {
    static async sendVerifyEmail(name, email, token) {
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Pesta Sains Nasional 2020" <admin@psn.ipb.ac.id>',
            to: email,
            subject: "Verify Your Email",
            text: "Please verify your email",
            html: `
                <h2>Hello ${name}</h2>
                <h3>Thank you for registering at Pesta Sains Nasional 2020<h3> 
                <p>Before you can continue please verify your email first by clicking the link below.</p>
                <a target="_blank" href="${environment.BASE_URL}/auth/email/verify?email=${email}&token=${token}">Click this link to verify your email</a>
            `,
        }, function (error, info) {
            if (error) {
                console.log(error);
            }
            console.log("email is send");
            console.log(info);
        });
    }

    static async sendForgotPasswordEmail(name, email, token) {
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Pesta Sains Nasional 2020" <admin@psn.ipb.ac.id>',
            to: email,
            subject: "Reset Password",
            text: "You can reset your password by click the link in this email",
            html: `
                <h2>Hello ${name}</h2>
                <h3>You are requesting a password reset<h3> 
                <p>You can reset your password by clicking the link below</p>
                <a target="_blank" href="${environment.FRONT_END_URL}/password/reset?email=${email}&token=${token}">Click this link to reset your password</a>
            `,
        }, function (error, info) {
            if (error) {
                console.log(error);
            }
            console.log("email is send");
            console.log(info);
        });
    }
}

module.exports = Mail;