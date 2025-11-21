import nodemailer from "nodemailer"
import 'dotenv/config'

export const verifyEmail = (token , email)=>{


let sender = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

let mail = {
    from: process.env.MAIL_USER,
    to:email,
    subject: 'Email verification',
    text: `Hi! There,you have recently visited our website and entered your email.
    Plese follow this given link to verify your email
    http://localhost:5173/verify/${token}
    Thanks`

};

sender.sendMail(mail, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent successfully: '
            + info.response);
    }
});



}





