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
  items: Array<{
    title: string;
    artistName: string;
    price: string;
    currency: string;
  }>;
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
  /**
   * Send a password reset email.
   * Skips silently when SendGrid is not configured.
   */
  async sendPasswordResetEmail(data: { email: string; name: string; resetUrl: string }) {
    if (!isConfigured) return;

    const msg = {
      to: data.email,
      from: config.email.fromEmail,
      subject: 'Reset Your Password — ArtAldo',
      text: [
        `Dear ${data.name},`,
        '',
        'We received a request to reset your password. Click the link below to set a new password:',
        '',
        data.resetUrl,
        '',
        'This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.',
        '',
        'Best regards,',
        'The ArtAldo Team',
      ].join('\n'),
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>Dear ${data.name},</p>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${data.resetUrl}" style="background: #1a1a1a; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
          <p>Best regards,<br />The ArtAldo Team</p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }

  /**
   * Notify staff about a new order.
   * Skips silently when SendGrid is not configured.
   */
  async sendNewOrderNotification(data: OrderEmailData) {
    if (!isConfigured || !config.email.staffEmail) return;

    const formatPrice = (price: string, currency: string) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
        parseFloat(price)
      );

    const itemsList = data.items
      .map((item) => `  • ${item.title} by ${item.artistName} — ${formatPrice(item.price, item.currency)}`)
      .join('\n');

    const msg = {
      to: config.email.staffEmail,
      from: config.email.fromEmail,
      subject: `New Order: ${data.orderNumber} — ${formatPrice(data.subtotal, data.currency)}`,
      text: [
        `New order ${data.orderNumber} has been paid.`,
        '',
        `Customer: ${data.customerName} (${data.customerEmail})`,
        '',
        'Items:',
        itemsList,
        '',
        `Total: ${formatPrice(data.subtotal, data.currency)}`,
      ].join('\n'),
      html: `
        <h2>New Order: ${data.orderNumber}</h2>
        <p><strong>Customer:</strong> ${data.customerName} &lt;${data.customerEmail}&gt;</p>
        <p><strong>Total:</strong> ${formatPrice(data.subtotal, data.currency)}</p>
        <p><strong>Items:</strong></p>
        <ul>
          ${data.items.map((item) => `<li>${item.title} by ${item.artistName} — ${formatPrice(item.price, item.currency)}</li>`).join('')}
        </ul>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Failed to send new order notification:', error);
    }
  }

  /**
   * Send order confirmation email to the customer after successful payment.
   * Skips silently when SendGrid is not configured.
   */
  async sendOrderConfirmationEmail(data: OrderEmailData) {
    if (!isConfigured) return;

    const formatPrice = (price: string, currency: string) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
        parseFloat(price)
      );

    const itemsText = data.items
      .map(
        (item) =>
          `  • ${item.title} by ${item.artistName} — ${formatPrice(item.price, item.currency)}`
      )
      .join('\n');

    const itemsHtml = data.items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.title}<br /><span style="color: #666; font-size: 14px;">by ${item.artistName}</span></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price, item.currency)}</td>
          </tr>`
      )
      .join('');

    const msg = {
      to: data.customerEmail,
      from: config.email.fromEmail,
      subject: `Order Confirmed — ${data.orderNumber}`,
      text: [
        `Dear ${data.customerName},`,
        '',
        `Thank you for your purchase! Your order ${data.orderNumber} has been confirmed.`,
        '',
        'Items:',
        itemsText,
        '',
        `Total: ${formatPrice(data.subtotal, data.currency)}`,
        '',
        'We will be in touch with shipping and delivery details shortly.',
        '',
        'Best regards,',
        'The ArtAldo Team',
      ].join('\n'),
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Confirmed</h2>
          <p>Dear ${data.customerName},</p>
          <p>Thank you for your purchase! Your order <strong>${data.orderNumber}</strong> has been confirmed.</p>

          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 8px 0; border-bottom: 2px solid #333;">Item</th>
                <th style="text-align: right; padding: 8px 0; border-bottom: 2px solid #333;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 12px 0; font-weight: bold;">Total</td>
                <td style="padding: 12px 0; font-weight: bold; text-align: right;">${formatPrice(data.subtotal, data.currency)}</td>
              </tr>
            </tfoot>
          </table>

          <p>We will be in touch with shipping and delivery details shortly.</p>
          <p>Best regards,<br />The ArtAldo Team</p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }
  }
}

export const emailService = new EmailService();
