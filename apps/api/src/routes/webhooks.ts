import { Router, Request, Response } from 'express';
import { config } from '../config/environment';
import { cmsSyncService } from '../services/cms-sync.service';

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

export default router;
