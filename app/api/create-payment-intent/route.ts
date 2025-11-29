import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Haversine distance calculation
const CAPE_LAT = 37.3059; // Cape Girardeau, Missouri
const CAPE_LNG = -89.5181;
const MAX_MILES = 10;
const EARTH_RADIUS_MILES = 3958.761;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

function isWithinDeliveryZone(location: { lat: number; lng: number }): boolean {
  const distance = haversineMiles(
    CAPE_LAT,
    CAPE_LNG,
    location.lat,
    location.lng
  );
  return distance <= MAX_MILES;
}


/**
 * API Route for Creating a Stripe Payment Intent
 *
 * This route creates a Stripe Payment Intent for an embedded payment form.
 * It calculates the total amount from the cart items and performs a conditional
 * server-side check to ensure the customer is within the delivery zone.
 */
export async function POST(req: Request) {
  try {
    const { items, location } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }
    
    // Conditionally enforce delivery zone if location data is provided.
    // This allows the payment form to load before location is confirmed.
    if (location && typeof location.lat === 'number' && typeof location.lng === 'number') {
      if (!isWithinDeliveryZone(location)) {
        return NextResponse.json(
          {
            error: 'You are outside the delivery zone. Please contact us on Instagram to arrange delivery.',
            outsideZone: true,
          },
          { status: 403 }
        );
      }
    }

    // Calculate the subtotal amount from the items array
    const subtotalAmount = items.reduce((sum: number, item: { price: number; qty: number; }) => {
        return sum + (item.price || 0) * (item.qty || 1);
    }, 0);

    // Calculate tax (8%)
    const taxAmount = subtotalAmount * 0.08;

    // Calculate the final total
    const finalAmount = subtotalAmount + taxAmount;

    if (finalAmount <= 0) {
        return NextResponse.json({ error: 'Invalid cart total.' }, { status: 400 });
    }

    // Create a PaymentIntent with the final order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100), // Amount in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return the client secret to the frontend
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    console.error('API Error creating payment intent:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}