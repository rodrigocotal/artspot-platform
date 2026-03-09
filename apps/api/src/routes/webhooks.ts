import { Router, Request, Response } from 'express';
import { config } from '../config/environment';
import { cmsSyncService } from '../services/cms-sync.service';
import { WebhooksHelper } from 'square';
import { orderService } from '../services/order.service';

const router = Router();

/**
 * POST /webhooks/cms
 * Receives Strapi lifecycle events and syncs data into the API database.
 * Validated via shared secret header — no JWT auth middleware.
 */
router.post('/cms', (req: Request, res: Response) => {
  // Validate webhook secret
  const secret = req.headers['x-webhook-secret'] as string | undefined;

  if (!config.cms.webhookSecret || secret !== config.cms.webhookSecret) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const { event, model, entry } = req.body;

  if (!event || !model || !entry) {
    res.status(400).json({ success: false, message: 'Invalid webhook payload' });
    return;
  }

  // Respond immediately — sync runs fire-and-forget
  res.status(200).json({ success: true, message: 'Webhook received' });

  // Process in background
  cmsSyncService.handleEvent(event, model, entry).catch((err) => {
    console.error(`CMS sync error [${event} ${model}]:`, err);
  });
});

/**
 * POST /webhooks/square
 * Handles Square webhook events (payment.updated).
 * Uses raw body for signature verification — registered with express.raw() in app.ts.
 */
router.post('/square', async (req: Request, res: Response) => {
  const signature = req.headers['x-square-hmacsha256-signature'] as string;

  if (!signature || !config.square.webhookSignatureKey) {
    res.status(400).json({ success: false, message: 'Missing signature or webhook secret' });
    return;
  }

  const rawBody = req.body.toString('utf8');

  try {
    const isValid = await WebhooksHelper.verifySignature({
      requestBody: rawBody,
      signatureHeader: signature,
      signatureKey: config.square.webhookSignatureKey,
      notificationUrl: `${config.apiUrl}/webhooks/square`,
    });

    if (!isValid) {
      console.error('Square webhook signature verification failed');
      res.status(400).json({ success: false, message: 'Invalid signature' });
      return;
    }
  } catch (err: any) {
    console.error('Square webhook signature verification error:', err.message);
    res.status(400).json({ success: false, message: 'Invalid signature' });
    return;
  }

  // Respond immediately
  res.status(200).json({ received: true });

  // Parse and process the event
  const event = JSON.parse(rawBody);

  try {
    if (event.type === 'payment.updated') {
      const payment = event.data?.object?.payment;
      if (!payment) return;

      const paymentId = payment.id;
      const squareOrderId = payment.order_id;
      const status = payment.status;

      if (status === 'COMPLETED' && squareOrderId) {
        await orderService.handlePaymentCompleted(paymentId, squareOrderId);
      } else if ((status === 'FAILED' || status === 'CANCELED') && squareOrderId) {
        await orderService.handlePaymentFailed(squareOrderId);
      }
    }
  } catch (err) {
    console.error(`Square webhook processing error [${event.type}]:`, err);
  }
});

export default router;
