import Stripe from "stripe";

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-12-15.clover",
  });
}

let _stripe: Stripe | null = null;

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    if (!_stripe) {
      _stripe = getStripeClient();
    }
    return (_stripe as any)[prop];
  },
});
