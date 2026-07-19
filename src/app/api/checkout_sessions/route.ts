import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getUserSession } from "@/lib/core/session";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || "http://localhost:3000";

    const formData = await request.formData();
    const checkoutType = formData.get("checkout_type");
    const user = await getUserSession();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    let lineItems: any[] = [];
    let metadata: Record<string, string> = {};
    let successUrl = "";
    let cancelUrl = "";

    if (checkoutType === "purchase") {
      const spaceId = formData.get("space_id") as string;
      if (!spaceId) {
        return NextResponse.json(
          { error: "Space ID is required for purchase" },
          { status: 400 },
        );
      }

      const db = await getDb();
      const space = await db
        .collection("spaces")
        .findOne({ _id: new ObjectId(spaceId) });

      if (!space) {
        return NextResponse.json(
          { error: "Target spatial blueprint not found" },
          { status: 404 },
        );
      }

      lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: space.title,
              description: `Spatial blueprint and licensing from ${space.architectName}`,
            },
            unit_amount: Math.round(space.price * 1000 * 100),
          },
          quantity: 1,
        },
      ];

      metadata = {
        type: "purchase",
        associatedItemId: space._id.toString(),
        buyerEmail: user.email,
        amount: (space.price * 1000).toString(),
      };

      successUrl = `${origin}/browse/success?session_id={CHECKOUT_SESSION_ID}&space_id=${space._id.toString()}`;
      cancelUrl = `${origin}/browse/${space._id.toString()}`;
    } else if (checkoutType === "verification") {
      lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Aetheris Architect License Fee",
              description:
                "One-time platform fee to unlock structural design publishing privileges",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ];

      metadata = {
        type: "publishing fee",
        buyerEmail: user.email,
        amount: "20.00",
      };

      successUrl = `${origin}/dashboard/writer/success?session_id={CHECKOUT_SESSION_ID}`;
      cancelUrl = `${origin}/dashboard/writer`;
    } else {
      return NextResponse.json(
        { error: "Invalid checkout session type" },
        { status: 400 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: lineItems,
      mode: "payment",
      metadata: metadata,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.redirect(session.url || "", 303);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
