import "server-only";
import Stripe from "stripe";

const apiKey =
  process.env.STRIPE_SECRET_KEY || "sk_test_mock_key_for_vercel_build_pass";

export const stripe = new Stripe(apiKey);
