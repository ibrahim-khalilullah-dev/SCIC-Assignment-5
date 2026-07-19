import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getUserSession } from "@/lib/core/session";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(
        { error: "User context required." },
        { status: 401 },
      );
    }

    const { preferences, budget } = await request.json();
    const db = await getDb();

    const spaces = await db.collection("spaces").find({}).limit(15).toArray();

    const formattedSpaces = spaces.map((s) => ({
      id: s._id.toString(),
      title: s.title,
      category: s.category,
      price: `${s.price}k`,
      location: s.location,
      dimensions: s.dimensions,
    }));

    const systemPrompt = `You are the Aetheris Cognitive Recommendation Engine. 
Your objective is to review a user's design preferences and financial bounds, analyze the database listings, and logically output the single best match with a deep, authoritative architectural reason.

Available Spaces Dataset:
${JSON.stringify(formattedSpaces, null, 2)}

User Input:
Preferences: "${preferences}"
Max Budget Limit: $${budget}k

Output format MUST be a clean JSON block containing:
{
  "recommendedSpaceId": "matching_mongodb_id",
  "reasoning": "A deeply detailed, cognitive architectural explanation matching style elements to the user preferences",
  "suitabilityScore": 95
}`;

    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Gemini API reported an issue: ${errorText}` },
        { status: 500 },
      );
    }

    const data = await response.json();
    const aiText = data.candidates[0].content.parts[0].text;
    return NextResponse.json(JSON.parse(aiText));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
