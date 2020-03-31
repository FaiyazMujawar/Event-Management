require("dotenv").config();
const Mailer = require("nodemailer");

class Mail {
    constructor() {
        this.mailer = Mailer.createTransport({
            service: "yahoo",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
    }

    sendConfirmation(email, eventName) {
        const options = {
            from: process.env.EMAIL,
            to: email,
            subject: "Confirmation email",
            text: `You have been succesfully registered for the event ${eventName}.\n\nThank you for your participation!`
        };
        this.mailer.sendMail(options, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                if (info) {
                    console.log(info);
                }
            }
        });
    }
}

module.exports = new Mail();
