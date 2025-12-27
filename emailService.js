const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD // Use App Password, not regular password
  }
});

// Function to send birthday email
async function sendBirthdayEmail(user) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: user.email,
    subject: `🎉 Happy Birthday ${user.username}! 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          .header {
            text-align: center;
            color: #667eea;
            margin-bottom: 30px;
          }
          .header h1 {
            font-size: 36px;
            margin: 0;
          }
          .message {
            font-size: 18px;
            line-height: 1.6;
            color: #333;
            text-align: center;
            margin: 30px 0;
          }
          .emoji {
            font-size: 48px;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎂 Happy Birthday! 🎂</h1>
          </div>
          <div class="emoji">
            🎉🎈🎊
          </div>
          <div class="message">
            <p>Dear <strong>${user.username}</strong>,</p>
            <p>On this special day, we want to take a moment to celebrate you!</p>
            <p>May your birthday be filled with joy, laughter, and all the things that make you smile. Here's wishing you a year ahead that's as wonderful as you are!</p>
            <p>Have a fantastic day and an amazing year ahead! 🌟</p>
          </div>
          <div class="footer">
            <p>With warmest wishes,<br>Your Birthday Reminder Team</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Birthday email sent to ${user.email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
    return { success: false, error: error.message };
  }
}

// Function to send birthday emails to multiple users
async function sendBirthdayEmails(users) {
  const results = [];
  for (const user of users) {
    const result = await sendBirthdayEmail(user);
    results.push({ user: user.email, ...result });
    // Add a small delay between emails to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return results;
}

module.exports = {
  sendBirthdayEmail,
  sendBirthdayEmails
};

