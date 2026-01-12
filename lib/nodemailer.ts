import nodemailer from 'nodemailer';

// Configure email transporter
export const transporter = process.env.NODE_ENV === 'production' 
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.skylimittravels.co.uk',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER || 'noreply@skylimittravels.co.uk',
        pass: process.env.EMAIL_PASS || '',
      },
    })
  : // In development, use a preview account from Ethereal
    nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal_pass',
      },
    });

// Default mail options
export const mailOptions = {
  from: process.env.EMAIL_FROM || 'website@skylimittravels.co.uk',
  to: process.env.EMAIL_TO || 'Flightbookings@skylimittravels.co.uk',
};

// Helper function to send email with error handling
export const sendEmail = async (
  subject: string, 
  text: string, 
  html?: string
): Promise<boolean> => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Development mode: Email would be sent with subject:', subject);
      console.log('Email content:', text);
      return true;
    }
    
    await transporter.sendMail({
      ...mailOptions,
      subject,
      text,
      html,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}; 