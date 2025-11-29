import Stripe from "stripe";

const CAPE_LAT = 37.3059; // Cape Girardeau, Missouri
const CAPE_LNG = -89.5181;
const MAX_MILES = 10;
const EARTH_RADIUS_MILES = 3958.761;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function haversineMiles(lat1, lon1, lat2, lon2) {
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

function isWithinDeliveryZone(location) {
  if (
    !location ||
    typeof location.lat !== "number" ||
    typeof location.lng !== "number"
  ) {
    return false;
  }
  const distance = haversineMiles(
    CAPE_LAT,
    CAPE_LNG,
    location.lat,
    location.lng
  );
  return distance <= MAX_MILES;
}

export async function POST(req) {
  try {
    const { items, location, successUrl, cancelUrl } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty." }), {
        status: 400,
      });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({
          error:
            "Stripe is not configured. Please set STRIPE_SECRET_KEY in .env",
        }),
        { status: 500 }
      );
    }

    // Enforce delivery zone
    if (!isWithinDeliveryZone(location)) {
      return new Response(
        JSON.stringify({
          outsideZone: true,
          message:
            "you are outside the delivery zone, if you still want the product, i suggest you contact us on instagram",
        }),
        { status: 403 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    const line_items = items
      .map((item) => {
        const unitAmount = Math.round(((item?.price ?? 0) * 100));
        if (!unitAmount || unitAmount <= 0) return null;
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item?.name || "Item",
              images: item?.image ? [item.image] : undefined,
            },
            unit_amount: unitAmount,
          },
          quantity: item?.qty && item.qty > 0 ? item.qty : 1,
        };
      })
      .filter(Boolean);

    if (!line_items.length) {
      return new Response(JSON.stringify({ error: "No valid items." }), {
        status: 400,
      });
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url:
        typeof successUrl === "string" && successUrl.startsWith("http")
          ? successUrl
          : `${origin}/?checkout=success`,
      cancel_url:
        typeof cancelUrl === "string" && cancelUrl.startsWith("http")
          ? cancelUrl
          : `${origin}/?checkout=cancel`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}


