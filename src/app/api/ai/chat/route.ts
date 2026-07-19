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

    const { messages } = await request.json();

    const systemContext = {
      role: "user",
      parts: [
        {
          text: `You are the Aetheris Autonomous Co-Founder & Space Curator. 
You are speaking with our elite registered client: ${user.name}.
You speak using professional, minimalist, and deeply design-focused language. 
Avoid generic or conversational fluff. Speak with absolute authority on Brutalist, Minimalist, Japandi, and Bauhaus structures. 
Answer the user's questions regarding design optimization, budget matching, and spatial analytics. Keep responses concise and structured in markdown.`,
        },
      ],
    };

    const contents = [systemContext, ...messages];

    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "AI failed to process spatial conversation." },
        { status: 500 },
      );
    }

    const data = await response.json();
    const outputMessage = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ message: outputMessage });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
