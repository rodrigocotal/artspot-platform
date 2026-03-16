import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { config } from '../config/environment';

const ses = new SESClient({ region: config.email.awsRegion });

const isConfigured = !!config.email.fromEmail && config.nodeEnv !== 'test';

async function sendEmail(to: string, subject: string, text: string, html: string) {
  if (!isConfigured) return;

  try {
    await ses.send(
      new SendEmailCommand({
        Source: config.email.fromEmail,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject },
          Body: {
            Text: { Data: text },
            Html: { Data: html },
          },
        },
      })
    );
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
}

interface InquiryEmailData {
  inquiryId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  message: string;
  artworkTitle: string;
  artworkSlug: string;
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ title: string; artistName: string; price: string; currency: string }>;
  subtotal: string;
  currency: string;
}

export class EmailService {
  async sendNewInquiryNotification(data: InquiryEmailData) {
    if (!config.email.staffEmail) return;

    const text = [
      `New inquiry received for "${data.artworkTitle}".`,
      '',
      `From: ${data.customerName} (${data.customerEmail})`,
      data.customerPhone ? `Phone: ${data.customerPhone}` : '',
      '',
      'Message:',
      data.message,
      '',
      `Manage: ${config.apiUrl.replace(/\/api$/, '')}/admin/inquiries`,
    ]
      .filter(Boolean)
      .join('\n');

    const html = `
      <h2>New Inquiry: ${data.artworkTitle}</h2>
      <p><strong>From:</strong> ${data.customerName} &lt;${data.customerEmail}&gt;</p>
      ${data.customerPhone ? `<p><strong>Phone:</strong> ${data.customerPhone}</p>` : ''}
      <hr />
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br />')}</p>
    `;

    await sendEmail(config.email.staffEmail, `New Inquiry: ${data.artworkTitle}`, text, html);
  }

  async sendInquiryResponseNotification(data: InquiryEmailData & { response: string }) {
    const text = [
      `Dear ${data.customerName},`,
      '',
      `Thank you for your interest in "${data.artworkTitle}". Our team has responded to your inquiry:`,
      '',
      data.response,
      '',
      'Best regards,',
      'The ArtAldo Team',
    ].join('\n');

    const html = `
      <p>Dear ${data.customerName},</p>
      <p>Thank you for your interest in &ldquo;${data.artworkTitle}&rdquo;. Our team has responded to your inquiry:</p>
      <blockquote style="border-left: 3px solid #ccc; padding-left: 12px; margin: 16px 0; color: #555;">
        ${data.response.replace(/\n/g, '<br />')}
      </blockquote>
      <p>Best regards,<br />The ArtAldo Team</p>
    `;

    await sendEmail(data.customerEmail, `Re: Your Inquiry About "${data.artworkTitle}"`, text, html);
  }

  async sendWelcomeEmail(email: string, name: string) {
    const siteUrl = config.apiUrl.replace(/\/api$/, '').replace(':4000', ':3000');

    const text = [
      `Hi ${name},`,
      '',
      'Welcome to ArtAldo! Your account has been created successfully.',
      '',
      'Here\'s what you can do:',
      '- Browse and discover curated artworks',
      '- Save your favorites',
      '- Inquire about pieces you love',
      '- Purchase directly from our gallery',
      '',
      `Start exploring: ${siteUrl}`,
      '',
      'Best regards,',
      'The ArtAldo Team',
    ].join('\n');

    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif;">
        <h2>Welcome to ArtAldo!</h2>
        <p>Hi ${name},</p>
        <p>Your account has been created successfully. We're excited to have you!</p>
        <p><strong>Here's what you can do:</strong></p>
        <ul>
          <li>Browse and discover curated artworks</li>
          <li>Save your favorites</li>
          <li>Inquire about pieces you love</li>
          <li>Purchase directly from our gallery</li>
        </ul>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${siteUrl}" style="background: #1a1a1a; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; display: inline-block;">Start Exploring</a>
        </p>
        <p>Best regards,<br />The ArtAldo Team</p>
      </div>
    `;

    await sendEmail(email, 'Welcome to ArtAldo!', text, html);
  }

  async sendPasswordResetEmail(email: string, token: string, name: string) {
    const resetUrl = `${config.apiUrl.replace(/\/api$/, '').replace(':4000', ':3000')}/reset-password?token=${token}`;

    const text = `Hi ${name},\n\nYou requested a password reset. Visit this link:\n\n${resetUrl}\n\nThis link expires in 1 hour.\n\nThe ArtAldo Team`;

    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif;">
        <h2>Reset Your Password</h2>
        <p>Hi ${name},</p>
        <p>You requested a password reset. Click the button below:</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: #1a1a1a; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </p>
        <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
      </div>
    `;

    await sendEmail(email, 'Reset Your Password — ArtAldo', text, html);
  }

  async sendOrderConfirmationEmail(data: OrderEmailData) {
    const itemRows = data.items.map(i =>
      `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.title}<br/><span style="color:#666;font-size:12px">by ${i.artistName}</span></td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${i.currency} ${i.price}</td></tr>`
    ).join('');

    const text = `Thank you!\n\nOrder: ${data.orderNumber}\n${data.items.map(i => `- ${i.title}: ${i.currency} ${i.price}`).join('\n')}\nTotal: ${data.currency} ${data.subtotal}`;

    const html = `<div style="max-width:600px;margin:0 auto;font-family:sans-serif"><h2>Thank You!</h2><p>Hi ${data.customerName}, your order <strong>${data.orderNumber}</strong> is confirmed.</p><table style="width:100%;border-collapse:collapse;margin:24px 0"><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #333">Item</th><th style="text-align:right;padding:8px;border-bottom:2px solid #333">Price</th></tr></thead><tbody>${itemRows}</tbody><tfoot><tr><td style="padding:12px 8px;font-weight:bold">Total</td><td style="padding:12px 8px;text-align:right;font-weight:bold">${data.currency} ${data.subtotal}</td></tr></tfoot></table></div>`;

    await sendEmail(data.customerEmail, `Order Confirmation — ${data.orderNumber}`, text, html);
  }

  async sendNewOrderNotification(data: OrderEmailData) {
    if (!config.email.staffEmail) return;

    const text = `New order!\nOrder: ${data.orderNumber}\nCustomer: ${data.customerName} (${data.customerEmail})\n${data.items.map(i => `- ${i.title}: ${i.currency} ${i.price}`).join('\n')}\nTotal: ${data.currency} ${data.subtotal}`;

    const html = `<h2>New Order: ${data.orderNumber}</h2><p><strong>Customer:</strong> ${data.customerName} &lt;${data.customerEmail}&gt;</p><ul>${data.items.map(i => `<li>${i.title} — ${i.currency} ${i.price}</li>`).join('')}</ul><p><strong>Total:</strong> ${data.currency} ${data.subtotal}</p>`;

    await sendEmail(config.email.staffEmail, `New Order: ${data.orderNumber}`, text, html);
  }
}

export const emailService = new EmailService();
