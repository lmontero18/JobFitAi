import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { cv, jobDescription } = await request.json();

  if (!cv || !jobDescription) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const prompt = `
You are an expert recruiter.

Your task is to analyze a resume against a job description.

Return ONLY a valid, minified JSON object like this:
{"score":87,"strengths":["..."],"weaknesses":["..."],"recommendations":["..."]}

Do NOT include any explanation or extra text. If unsure, return empty arrays.

Resume:
${cv}

Job Description:
${jobDescription}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const raw = completion.choices?.[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(raw!);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON from OpenAI", raw },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[OpenAI API ERROR]", err);
    return NextResponse.json({ error: "OpenAI error" }, { status: 500 });
  }
}
