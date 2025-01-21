import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.example.com', // Replace with your SMTP server
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'your-email@example.com', // Your email
        pass: 'your-email-password', // Your email password
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `http://your-frontend-url/reset-password?token=${token}`;
    const mailOptions = {
      from: '"Your App" <no-reply@example.com>', // Sender address
      to: email, // List of receivers
      subject: 'Password Reset Request', // Subject line
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`, // Plain text body
      html: `<p>You requested a password reset. Click the link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`, // HTML body
    };

    await this.transporter.sendMail(mailOptions);
  }
}