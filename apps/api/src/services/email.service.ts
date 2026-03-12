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
}

export const emailService = new EmailService();
