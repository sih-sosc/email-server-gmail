const nodemailer = require("nodemailer");
const Handlebars = require('handlebars');
const axios = require("axios");
const sendLogs = require('./sendLogs');


async function sendMail(req) {

    let emailBody = req.body.email_body;
    let emailSubject = req.body.email_subject;
    let senderEmail = req.body.sender_email;

    console.log("Request Body")
    console.log(req.body)

    let recievers = req.body.user_details;
    console.log()


    let smtpTransport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: req.body.email || process.env.SMTP_EMAIL,
            pass: req.body.pass || process.env.SMTP_PASSWORD
        }
    });
    let template = Handlebars.compile(emailBody.toString());
    let recieved = [];
    let notRecieved = [];

    for (let i = 0; i < recievers.length; i++) {
        try {
            let res = await axios(`https://emailverification.whoisxmlapi.com/api/v1?apiKey=at_EGgoaOpT1WEkuXomX6yLR2rqhPaLK&emailAddress=${recievers[i].email}`);
            recieved.push(recievers[i]);
            console.log(recievers[i].name + " Done");
        } catch (err) {
            notRecieved.push(recievers[i]);
            console.log("Error: ");
            //console.log(err)
        }
    }

    console.log('recieved', recieved);
    console.log('Not recieved', notRecieved);


    sendLogs(senderEmail,recieved, notRecieved);

    for (var i = 0; i < recievers.length; i++) {
        let data = recievers[i];
        let text = template(data);
        var mailOptions = {
            to: recievers[i].email,
            subject: emailSubject,
            dsn: {
                id: recievers[i].id,
                return: 'headers',
                notify: ['failure', 'delay'],
                recipient: senderEmail
            },
            html: text
        }
        console.log(mailOptions);


        smtpTransport.sendMail(mailOptions)
            .then(data => {
                //  console.log(data)
            }).catch(err => {
                // console.log(err)
                console.log("errorsmtptransport")
            });

    }
}

module.exports = sendMail;