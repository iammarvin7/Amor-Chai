import { NextResponse } from 'next/server';
import stripe from '../../../../lib/stripe';

/**
 * API Route for Fetching Checkout Session Status
 *
 * This route retrieves a Stripe Checkout Session object given a `session_id`.
 * It's used by the `/return` page to check the status of a payment after the
 * customer is redirected back to the site.
 *
 * It returns the session status and the customer's email.
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required.' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email,
    });

  } catch (error) {
    console.error('API Error fetching checkout session:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
