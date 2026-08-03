const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    family: 4, // 👈 IPv4 force karta hai, IPv6 ka ENETUNREACH issue fix karta hai
});

module.exports = transporter;