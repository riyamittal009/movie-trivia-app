import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { movie } = await request.json();

    if (!movie) {
      return NextResponse.json(
        { error: "Movie name is required" },
        { status: 400 }
      );
    }

    console.log("Sending request to OpenAI...");

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert movie trivia master who knows incredibly specific, fascinating, and unusual facts about films. You specialize in:
          - Behind-the-scenes secrets and production stories
          - Weird casting decisions and actor anecdotes
          - Hidden details in scenes that most people miss
          - Bizarre real-world connections and coincidences
          - Technical filmmaking innovations or failures
          - Strange audience reactions or cultural impacts
          - Unexpected inspirations or source materials
          - Funny mistakes that made it into the final cut
          
          Always provide facts that would make someone say "Wow, I had no idea!" Never give generic facts like box office numbers or basic plot summaries. Be specific with names, dates, and details. But keep it short and concise`,
        },
        {
          role: "user",
          content: `Generate one incredibly interesting, specific, and unusual fact about the movie "${movie}". Make it something that would surprise even movie fans. Include specific details like names, numbers, or exact situations. Avoid generic facts about plot or obvious trivia.`,
        },
      ],
      response_format: { type: "text" },
      temperature: 0.8,
    });

    console.log("OpenAI Raw Response:", completion.choices[0].message.content);

    // Parse and return the movie fact
    const response = completion.choices[0].message.content;
    console.log("Parsed Response:", response);

    const result = {
      movieFact: response,
    };

    console.log("Final Movie Fact Result:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in movie fact generation:", error);
    return NextResponse.json(
      { error: "Failed to generate movie fact" },
      { status: 500 }
    );
  }
}
