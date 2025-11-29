import { NextResponse } from 'next/server';

/**
 * For this demo, we are strictly validating against a list of allowed zip codes.
 * In a production environment, you would use a geocoding service to convert the
 * address to latitude/longitude and then use the Haversine formula to check
 * the distance against your delivery radius.
 */
const ALLOWED_ZIP_CODES = ['63701', '63702', '63703']; // Added 63703 as it's also Cape Girardeau

/**
 * API Route for Verifying Delivery Zone
 *
 * This route checks if a given address is within the allowed delivery zone.
 * It receives an address object from the Stripe Address Element.
 *
 * For now, it performs a simple check against a hardcoded list of zip codes.
 */
export async function POST(req: Request) {
  try {
    const { address } = await req.json();

    if (!address || !address.postal_code) {
      return NextResponse.json(
        { allowed: false, message: 'Postal code is missing.' },
        { status: 400 }
      );
    }

    const postalCode = address.postal_code.trim();

    if (ALLOWED_ZIP_CODES.includes(postalCode)) {
      return NextResponse.json({ allowed: true });
    } else {
      return NextResponse.json({
        allowed: false,
        message: 'We currently only deliver within the Cape Girardeau area (10-mile radius).',
      });
    }
  } catch (error) {
    console.error('API Error verifying delivery zone:', error);
    return NextResponse.json(
      { allowed: false, message: 'An unexpected error occurred on our end.' },
      { status: 500 }
    );
  }
}
