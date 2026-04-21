import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, htmlContent: string) {
  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    
    // If credentials aren't provided, just console log it (so local dev doesn't break)
    if (!user || !pass) {
      console.log('--- EMAIL MOCK ---');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('HTML length:', htmlContent.length);
      console.log('Please add EMAIL_USER and EMAIL_PASS to .env.local to send actual emails.');
      return true;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: `"Zaybaash Orders" <${user}>`,
      to,
      subject,
      html: htmlContent
    });
    
    return true;
  } catch (err) {
    console.error('Failed to send email:', err);
    return false;
  }
}
