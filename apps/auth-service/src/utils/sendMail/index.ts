import nodemailer from 'nodemailer';
import 'dotenv/config';
import ejs from 'ejs';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Render EJS template
const renderEmailTemplate = async (
  templateName: string,
  data: Record<string, any>
): Promise<string> => {
  const templatePath = path.join(
    process.cwd(),
    'apps',
    'auth-service',
    'src',
    'utils',
    'email-templates',
    `${templateName}.ejs`
  );

  return ejs.renderFile(templatePath, data);
};

// send email using nodemailer
export const sendMail = async (
  to: string,
  subject: string,
  templateName: string,
  templateData: Record<string, any>
): Promise<boolean> => {
  try {
    const htmlContent = await renderEmailTemplate(templateName, templateData);
    const mailOptions = {
      from: 'sushilparajuli2023@gmail.com',
      to,
      subject,
      html: htmlContent,
    };

    console.log(mailOptions, 'mailOPtions');

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
