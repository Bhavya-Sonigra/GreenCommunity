import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    // Remove spaces from Gmail App Password (they work better without spaces)
    const cleanPassword = process.env.EMAIL_PASS?.replace(/\s+/g, '') || '';
    
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: cleanPassword
      }
    });
  }

  /**
   * Verify email service configuration
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      return { success: true, message: 'Email service connected successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Send email verification
   * @param {string} email - Recipient email
   * @param {string} token - Verification token
   * @param {string} clientUrl - Client URL for verification link
   */
  async sendEmailVerification(email, token, clientUrl) {
    const verificationUrl = `${clientUrl}/verify-email?token=${token}`;
    
    const mailOptions = {
      to: email,
      subject: 'Email Verification - GreenCommunity',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Welcome to GreenCommunity!</h2>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}" style="
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          ">Verify Email</a>
          <p style="color: #666;">This link will expire in 24 hours.</p>
          <p style="color: #666;">If you didn't create this account, please ignore this email.</p>
        </div>
      `
    };

    return await this.transporter.sendMail(mailOptions);
  }

  /**
   * Send password reset email with verification code
   * @param {string} email - Recipient email
   * @param {string} resetCode - 6-digit verification code
   */
  async sendPasswordReset(email, resetCode) {
    const mailOptions = {
      to: email,
      subject: 'Password Reset - GreenCommunity',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #f44336; text-align: center;">Password Reset Request</h2>
          
          <p>Hello,</p>
          
          <p>You requested a password reset for your GreenCommunity account. Please use the verification code below to reset your password:</p>
          
          <div style="
            background-color: #f8f9fa;
            border: 2px dashed #f44336;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          ">
            <h3 style="color: #f44336; margin: 0 0 10px 0;">Verification Code</h3>
            <div style="
              font-size: 32px;
              font-weight: bold;
              color: #f44336;
              letter-spacing: 8px;
              font-family: monospace;
            ">${resetCode}</div>
          </div>
          
          <p><strong>Instructions:</strong></p>
          <ol>
            <li>Go to the password reset page</li>
            <li>Enter this verification code</li>
            <li>Set your new password</li>
          </ol>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            <strong>Important:</strong> This code will expire in 10 minutes for security reasons.
          </p>
          
          <p style="color: #666; font-size: 14px;">
            If you didn't request this password reset, please ignore this email and your password will remain unchanged.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated message from GreenCommunity. Please do not reply to this email.
          </p>
        </div>
      `
    };

    return await this.transporter.sendMail(mailOptions);
  }

  /**
   * Send welcome email after successful registration
   * @param {string} email - Recipient email
   * @param {string} name - User's name
   */
  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      to: email,
      subject: 'Welcome to GreenCommunity!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Welcome to GreenCommunity, ${name}!</h2>
          <p>Thank you for joining our community of environmentally conscious individuals.</p>
          <p>You can now start exploring and contributing to our green initiatives.</p>
          <p style="color: #666;">Happy contributing!</p>
          <p style="color: #666;">The GreenCommunity Team</p>
        </div>
      `
    };

    return await this.transporter.sendMail(mailOptions);
  }
}

export default new EmailService();
