import Stripe from 'stripe';
import { config } from './environment';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!config.stripe.secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripeInstance = new Stripe(config.stripe.secretKey, {
      apiVersion: '2026-02-25.clover',
    });
  }
  return stripeInstance;
}
