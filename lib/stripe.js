import Stripe from 'stripe';

// This file initializes the Stripe client with the secret key and exports it.
// It includes a check to ensure the Stripe secret key is properly configured
// in the environment variables.

// Get the Stripe secret key from environment variables.
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Check if the Stripe secret key is available. If not, log an error and exit.
// This is a critical error because the application cannot process payments without it.
if (!stripeSecretKey) {
  console.error('ERROR: Stripe secret key not found. Please set STRIPE_SECRET_KEY in your .env.local file.');
  // In a real application, you might want to handle this more gracefully,
  // but for development, throwing an error is a clear indicator of a missing configuration.
  throw new Error('Stripe secret key is not configured.');
}

/**
 * The official Stripe SDK client.
 *
 * @see https://github.com/stripe/stripe-node
 *
 * The `appInfo` helps Stripe identify your integration for support and analytics.
 * The `apiVersion` is set to the preview version required for V2 Connect APIs.
 * It's good practice to pin the API version to ensure your integration
 * doesn't break with future updates.
 */
const stripe = new Stripe(stripeSecretKey, {
  // The spec says the latest preview version is '2025-08-27.preview',
  // and that the SDK will use it automatically.
  // We will not set it here to rely on the SDK's default behavior with the beta version.
  // If issues arise, we can pin it here:
  // apiVersion: '2025-08-27.preview',
  appInfo: {
    name: 'amor-chai-website-connect-marketplace',
    version: '0.1.0',
  },
});

export default stripe;
