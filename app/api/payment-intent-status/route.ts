import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * API Route for Fetching a Payment Intent Status
 *
 * This route securely retrieves a Stripe Payment Intent object.
 * It expects a `payment_intent_client_secret` in the query parameters.
 * It extracts the Payment Intent ID from the client secret and uses the
 * Stripe Node.js library to fetch the full object, returning its status.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clientSecret = searchParams.get('payment_intent_client_secret');

  if (!clientSecret) {
    return NextResponse.json({ error: 'Client secret is required.' }, { status: 400 });
  }

  try {
    // The client secret has the format pi_123..._secret_456...
    // We only need the Payment Intent ID (pi_123...) to retrieve it.
    const paymentIntentId = clientSecret.split('_secret_')[0];
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      status: paymentIntent.status,
    });

  } catch (error) {
    console.error('API Error fetching payment intent:', error);
    // It's possible the client secret is invalid
    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
        return NextResponse.json({ error: 'Invalid payment intent provided.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
