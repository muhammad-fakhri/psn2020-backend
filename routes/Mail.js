const nodemailer = require('nodemailer');
let environment = process.env;
const googleAuth = require('../config/googleAuth');

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
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'Gmail',

    auth: {
        type: 'OAuth2',
        user: environment.GMAIL_USER_NAME,
        clientId: googleAuth.credentials.web.client_id,
        clientSecret: googleAuth.credentials.web.client_secret,
        refreshToken: googleAuth.tokens.refresh_token,
        accessToken: googleAuth.tokens.access_token,
        expires: googleAuth.tokens.expiry_date
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
            text: `
                Hello ${name} 
                Thank you for registering at Pesta Sains Nasional 2020 
                Before you can continue please verify your email first by accessing the link below.
                
                ${environment.BASE_URL}/auth/email/verify?email=${email}&token=${token}`,
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
            text: `
                Hello ${name}
                You are requesting a password reset
                You can reset your password by accessing the link below
                
                ${environment.FRONT_END_URL}/password/reset?email=${email}&token=${token}
            `,
            html: `
                <h2>Hello ${name}</h2>
                <h3>You are requesting a password reset<h3> 
                <p>You can reset your password by clicking the lin k below</p>
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