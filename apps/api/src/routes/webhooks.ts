import { Router, Request, Response } from 'express';
import { config } from '../config/environment';
import { cmsSyncService } from '../services/cms-sync.service';
import { getStripe } from '../config/stripe';
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
 * POST /webhooks/stripe
 * Handles Stripe webhook events (checkout completed/expired).
 * Uses raw body for signature verification — registered with express.raw() in app.ts.
 */
router.post('/stripe', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  if (!sig || !config.stripe.webhookSecret) {
    res.status(400).json({ success: false, message: 'Missing signature or webhook secret' });
    return;
  }

  let event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret);
  } catch (err: any) {
    console.error('Stripe webhook signature verification failed:', err.message);
    res.status(400).json({ success: false, message: 'Invalid signature' });
    return;
  }

  // Respond immediately
  res.status(200).json({ received: true });

  // Process in background
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await orderService.handleCheckoutCompleted(session.id);
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object;
        await orderService.handleCheckoutExpired(session.id);
        break;
      }
      default:
        // Ignore other event types
        break;
    }
  } catch (err) {
    console.error(`Stripe webhook processing error [${event.type}]:`, err);
  }
});

export default router;
