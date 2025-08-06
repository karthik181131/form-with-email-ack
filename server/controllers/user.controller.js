const User = require("../models/user.model");
const nodemailer = require("nodemailer");

const sendConfirmationEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Karthik" <${process.env.MAIL_USER}>`,
    to: user.personalEmail,
    subject: "Registration Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #333; margin: 0; font-size: 24px;">Registration Confirmation</h2>
            <h3 style="color: #666; margin: 10px 0; font-size: 18px;">Thank you for registering!</h3>
          </div>
          
          <div style="border-top: 2px solid #e0e0e0; padding-top: 20px;">
            <p style="font-size: 16px; color: #333; margin-bottom: 25px;">
              Dear <strong>${user.name}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Thank you for submitting your registration form. We have successfully received your details.
            </p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Submitted Details:</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555; width: 40%;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${user.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Date of Submission:</td>
                  <td style="padding: 8px 0; color: #333;">${user.date}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Programme:</td>
                  <td style="padding: 8px 0; color: #333;">${user.programme}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Roll Number:</td>
                  <td style="padding: 8px 0; color: #333;">${user.rollNumber || "Not provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Department/Field:</td>
                  <td style="padding: 8px 0; color: #333;">${user.branch}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email Address:</td>
                  <td style="padding: 8px 0; color: #333;">${user.personalEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone Number:</td>
                  <td style="padding: 8px 0; color: #333;">${user.mobile}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Emergency Contact:</td>
                  <td style="padding: 8px 0; color: #333;">${user.emergencyContactName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Emergency Phone:</td>
                  <td style="padding: 8px 0; color: #333;">${user.emergencyContactPhone}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #4caf50;">
              <p style="margin: 0; color: #2e7d32; font-weight: bold;">
                ✓ Your application has been successfully submitted and is under review.
              </p>
            </div>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 15px;">
              <strong>Next Steps:</strong>
            </p>
            <ul style="color: #555; line-height: 1.6;">
              <li>Your registration will be processed</li>
              <li>You will receive further instructions via email</li>
              <li>Please keep this confirmation for your records</li>
            </ul>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Best regards,</strong><br>
                Registration Team<br>
                <a href="karthik9505866@gmail.com"style="color: #333;">Contact Support</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

exports.submitForm = async (req, res) => {
  try {
    console.log("Request body:", req.body);  // log incoming data
    const user = new User(req.body);
    await user.save();

    // Log Mailtrap config for debugging
    console.log("Mailtrap config:", process.env.MAILTRAP_SMTP_HOST, process.env.MAILTRAP_SMTP_PORT, process.env.MAILTRAP_SMTP_USER);
    await sendConfirmationEmail(user);

    res.status(201).json({ message: "Form submitted successfully." });
  } catch (error) {
    console.error("Submit form error:", error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.personalEmail) {
      // Duplicate email error
      return res.status(409).json({ message: "Email is already registered." });
    }
    res.status(500).json({ message: "Submission failed", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};
