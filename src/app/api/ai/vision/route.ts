import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserSession } from "@/lib/core/session";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json(
        { error: "Access portal revoked: Login first" },
        { status: 401 },
      );
    }

    const { imageUrl } = await request.json();
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Spatial rendering snapshot required" },
        { status: 400 },
      );
    }

    const imgRes = await fetch(imageUrl);
    const arrayBuffer = await imgRes.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = imgRes.headers.get("content-type") || "image/jpeg";

    const systemPrompt = `You are the Aetheris Spatial Vision AI. Analyze this physical room layout or architectural draft. Categorize its design category (e.g., Japandi Minimalism, Modernist Brutalism, Classical Bauhaus, Nordic Rustic), identify dominant color palettes, evaluate spatial lighting distributions, and suggest exactly 3 layout optimization modifications. Keep your responses structured, professional, and formatted in markdown.`;

    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Vision pipeline reported an error: ${errorText}` },
        { status: 500 },
      );
    }

    const data = await response.json();
    const aiText = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ analysis: aiText });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
