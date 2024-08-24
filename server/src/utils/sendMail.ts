import * as nodemailer from 'nodemailer';
import generateToken from './generateToken';
import * as dotenv from 'dotenv';
import { MailTypeEnum, sendMailArgs } from 'src/models';
dotenv.config();

const fromEmail = 'contacto@agustin-ribotta.xyz';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: fromEmail,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async ({
  type,
  email,
}: sendMailArgs): Promise<string | void> => {
  if (type === MailTypeEnum.verifyEmail) {
    const token = await generateToken();
    const url = `${process.env.APP_URL}/verify?token=${token}`;

    transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: 'Verify your email',
      html: `Please click this link to verify your email: <a href=${url}>${url}</a>`,
    });
    return token;
  }
  if (type === MailTypeEnum.welcome) {
    transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: 'Welcome to Poker App',
      html: `Welcome to Poker Online, enjoy with your friends`,
    });
  }
  if (type === MailTypeEnum.resetPassword) {
    const token = await generateToken();
    const url = `${process.env.APP_URL}/reset_password?token=${token}`;

    transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: 'Reset password',
      html: `Reset your password: <a href=${url}>${url}</a>`,
    });
    return token
  }
};

export default sendMail;
