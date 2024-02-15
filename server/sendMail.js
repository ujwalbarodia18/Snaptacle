require("dotenv").config();
const nodemailer = require('nodemailer');

// Create a transporter using SMTP or other transport mechanisms
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ujwalbarodia@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = (userEmailId) => {
    const OTP = Math.floor(1000 + Math.random() * 9000);
    console.log('OTP: ', OTP);
    const mailOptions = {
        from: 'ujwal.b@darwinbox.io',
        to: userEmailId,
        subject: 'OTP for login',
        text: `Your OTP for login is ${OTP}`,
    };
      
      // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    
    return OTP;
}

module.exports = sendMail;

