import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getUserSession } from "@/lib/core/session";
import { getEbookById } from "@/lib/core/ebook";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || "";

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
      const ebookId = formData.get("ebook_id") as string;
      const ebook = await getEbookById(ebookId);

      if (!ebook) {
        return NextResponse.json(
          { error: "Target manuscript not found" },
          { status: 404 },
        );
      }

      lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: ebook.title,
              description: `Digital manuscript authored by ${ebook.writerName}`,
            },
            unit_amount: Math.round(ebook.price * 100),
          },
          quantity: 1,
        },
      ];

      metadata = {
        type: "purchase",
        ebookId: ebook._id,
        buyerEmail: user.email,
        writerEmail: ebook.writerEmail || "",
        amount: ebook.price.toString(),
      };

      successUrl = `${origin}/browse/success?session_id={CHECKOUT_SESSION_ID}&ebook_id=${ebook._id}`;
      cancelUrl = `${origin}/browse/${ebook._id}`;
    } else if (checkoutType === "verification") {
      lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Fable Writer Verification Fee",
              description:
                "One-time platform fee to unlock lifetime digital publishing capabilities",
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
