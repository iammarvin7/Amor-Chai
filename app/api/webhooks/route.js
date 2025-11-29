import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import stripe from '../../../lib/stripe';

/**
 * API Route for handling Stripe Webhooks for standard payments.
 *
 * This endpoint receives events from Stripe about payment status changes.
 */
export async function POST(req) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret or signature not found.' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`Checkout session completed for session ID: ${session.id}`);
      // Here you would fulfill the order, e.g., send a confirmation email,
      // update your database, etc.
      break;
    case 'checkout.session.expired':
      const expiredSession = event.data.object;
      console.log(`Checkout session expired for session ID: ${expiredSession.id}`);
      // Clean up any pending order data if necessary.
      break;
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent succeeded for ID: ${paymentIntent.id}`);
      // This is another point where you can fulfill the order.
      break;
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      const message = failedPaymentIntent.last_payment_error?.message;
      console.log(`PaymentIntent failed for ID: ${failedPaymentIntent.id}. Reason: ${message}`);
      // Notify the customer that their payment failed.
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
