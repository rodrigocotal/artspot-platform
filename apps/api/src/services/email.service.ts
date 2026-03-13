import sgMail from '@sendgrid/mail';
import { config } from '../config/environment';

const isConfigured = !!config.email.sendgridApiKey;

if (isConfigured) {
  sgMail.setApiKey(config.email.sendgridApiKey);
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
  /**
   * Notify staff about a new inquiry.
   * Skips silently when SendGrid is not configured (safe for dev).
   */
  async sendNewInquiryNotification(data: InquiryEmailData) {
    if (!isConfigured || !config.email.staffEmail) return;

    const msg = {
      to: config.email.staffEmail,
      from: config.email.fromEmail,
      subject: `New Inquiry: ${data.artworkTitle}`,
      text: [
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
        .join('\n'),
      html: `
        <h2>New Inquiry: ${data.artworkTitle}</h2>
        <p><strong>From:</strong> ${data.customerName} &lt;${data.customerEmail}&gt;</p>
        ${data.customerPhone ? `<p><strong>Phone:</strong> ${data.customerPhone}</p>` : ''}
        <hr />
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br />')}</p>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Failed to send new inquiry notification:', error);
    }
  }

  /**
   * Notify customer that staff has responded to their inquiry.
   * Skips silently when SendGrid is not configured.
   */
  async sendInquiryResponseNotification(
    data: InquiryEmailData & { response: string }
  ) {
    if (!isConfigured) return;

    const msg = {
      to: data.customerEmail,
      from: config.email.fromEmail,
      subject: `Re: Your Inquiry About "${data.artworkTitle}"`,
      text: [
        `Dear ${data.customerName},`,
        '',
        `Thank you for your interest in "${data.artworkTitle}". Our team has responded to your inquiry:`,
        '',
        data.response,
        '',
        'Best regards,',
        'The ArtSpot Team',
      ].join('\n'),
      html: `
        <p>Dear ${data.customerName},</p>
        <p>Thank you for your interest in &ldquo;${data.artworkTitle}&rdquo;. Our team has responded to your inquiry:</p>
        <blockquote style="border-left: 3px solid #ccc; padding-left: 12px; margin: 16px 0; color: #555;">
          ${data.response.replace(/\n/g, '<br />')}
        </blockquote>
        <p>Best regards,<br />The ArtSpot Team</p>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Failed to send inquiry response notification:', error);
    }
  }
  async sendPasswordResetEmail(email: string, token: string, name: string) {
    if (!isConfigured) return;

    const resetUrl = `${config.apiUrl.replace(/\/api$/, '').replace(':4000', ':3000')}/reset-password?token=${token}`;

    const msg = {
      to: email,
      from: config.email.fromEmail,
      subject: 'Reset Your Password — ArtSpot',
      text: `Hi ${name},\n\nYou requested a password reset. Visit this link:\n\n${resetUrl}\n\nThis link expires in 1 hour.\n\nThe ArtSpot Team`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif;">
          <h2>Reset Your Password</h2>
          <p>Hi ${name},</p>
          <p>You requested a password reset. Click the button below:</p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background: #1a1a1a; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          </p>
          <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
        </div>
      `,
    };

    try { await sgMail.send(msg); } catch (error) { console.error('Failed to send password reset email:', error); }
  }

  async sendOrderConfirmationEmail(data: OrderEmailData) {
    if (!isConfigured) return;

    const itemRows = data.items.map(i =>
      `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.title}<br/><span style="color:#666;font-size:12px">by ${i.artistName}</span></td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${i.currency} ${i.price}</td></tr>`
    ).join('');

    const msg = {
      to: data.customerEmail,
      from: config.email.fromEmail,
      subject: `Order Confirmation — ${data.orderNumber}`,
      text: `Thank you!\n\nOrder: ${data.orderNumber}\n${data.items.map(i => `- ${i.title}: ${i.currency} ${i.price}`).join('\n')}\nTotal: ${data.currency} ${data.subtotal}`,
      html: `<div style="max-width:600px;margin:0 auto;font-family:sans-serif"><h2>Thank You!</h2><p>Hi ${data.customerName}, your order <strong>${data.orderNumber}</strong> is confirmed.</p><table style="width:100%;border-collapse:collapse;margin:24px 0"><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #333">Item</th><th style="text-align:right;padding:8px;border-bottom:2px solid #333">Price</th></tr></thead><tbody>${itemRows}</tbody><tfoot><tr><td style="padding:12px 8px;font-weight:bold">Total</td><td style="padding:12px 8px;text-align:right;font-weight:bold">${data.currency} ${data.subtotal}</td></tr></tfoot></table></div>`,
    };

    try { await sgMail.send(msg); } catch (error) { console.error('Failed to send order confirmation:', error); }
  }

  async sendNewOrderNotification(data: OrderEmailData) {
    if (!isConfigured || !config.email.staffEmail) return;

    const msg = {
      to: config.email.staffEmail,
      from: config.email.fromEmail,
      subject: `New Order: ${data.orderNumber}`,
      text: `New order!\nOrder: ${data.orderNumber}\nCustomer: ${data.customerName} (${data.customerEmail})\n${data.items.map(i => `- ${i.title}: ${i.currency} ${i.price}`).join('\n')}\nTotal: ${data.currency} ${data.subtotal}`,
      html: `<h2>New Order: ${data.orderNumber}</h2><p><strong>Customer:</strong> ${data.customerName} &lt;${data.customerEmail}&gt;</p><ul>${data.items.map(i => `<li>${i.title} — ${i.currency} ${i.price}</li>`).join('')}</ul><p><strong>Total:</strong> ${data.currency} ${data.subtotal}</p>`,
    };

    try { await sgMail.send(msg); } catch (error) { console.error('Failed to send order notification:', error); }
  }
}

export const emailService = new EmailService();
