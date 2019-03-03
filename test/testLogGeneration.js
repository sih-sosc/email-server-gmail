require('dotenv').config();
const nodemailer = require("nodemailer");
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');


let logMail = "musthu.gm@gmail.com";
let sentList = ["mmm@gmail.com", "blah@gmail.com", "bleh@gmail.com"];
let unsentList = ["haha@gmail.com"];

let smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

let htmlTemplate = fs.readFileSync(path.join(__dirname, 'logMail.html'));
let mailTemplate = Handlebars.compile(htmlTemplate.toString());

let logData = {
    campaign_id: '19991991',
    campaign_name: 'Sample temlpate'
};

if (sentList) {
    let sentMailTemplate = '';
    for (let mail in sentList) {
        sentMailTemplate += `${sentList[mail]} <br/>`
    }
    logData.sentMails = sentMailTemplate;
} else {
    logData.sentMails = `No Mails Sent <br/>`;
}

if (unsentList) {
    let unsentMailTemplate = '';
    for (let mail in unsentList) {
        unsentMailTemplate += `${unsentList[mail]} <br/>`
    }
    logData.unsentMails = unsentMailTemplate;
} else {
    logData.unsentMails = `All Mails Sent <br/>`;
}


let mailOptions = {
    to: logMail || process.env.LOG_MAIL,
    subject: "Log generation",
    dsn: {
        id: process.env.LOG_MAIL,
        return: 'headers',
        notify: ['failure', 'delay'],
        recipient: process.env.LOG_MAIL
    },
    html: mailTemplate(logData)
}

smtpTransport.sendMail(mailOptions)
    .then(data => {
        console.log(data)
    }).catch(err => {
        // console.log(err)
        console.log("errorsmtptransport")
    });