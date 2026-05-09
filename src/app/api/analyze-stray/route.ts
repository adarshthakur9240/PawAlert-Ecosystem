import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { aiTriageLimiter } from "@/lib/rate-limit"; // Ensure this file exists!

const ANALYSIS_PROMPT = `You are a veterinary emergency assistant for the PawAlert rescue app. 
Analyze this image of a stray or injured animal and respond with ONLY a JSON object in this exact format:
{
  "animalType": "dog/cat/cow/bird/other",
  "condition": "critical/serious/moderate/stable",
  "advice": "1-2 sentence immediate first-aid or severity advice for a rescuer on the ground",
  "urgency": "critical/high/medium/low"
}
Be concise and practical. Do not add any markdown or extra text.`;

export async function POST(req: NextRequest) {
  try {
    // ==========================================
    // 1. RATE LIMITING LOGIC (UPSTASH + CLERK)
    // ==========================================
    const { userId } = await auth();
    // Fallback to IP if the user is not authenticated (e.g., guest users)
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const identifier = userId || ip;

    // Check if the user/IP has exceeded the limit
    const { success, limit, reset, remaining } = await aiTriageLimiter.limit(identifier);

    if (!success) {
      console.log(`Rate limit hit for identifier: ${identifier}`);
      return NextResponse.json(
        { error: "AI analysis limit reached. Please try again in an hour." },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          }
        }
      );
    }

    // ==========================================
    // 2. ORIGINAL GEMINI API LOGIC
    // ==========================================
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: ANALYSIS_PROMPT },
            {
              inlineData: {
                mimeType: mimeType || "image/jpeg",
                data: imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    console.log("Sending direct fetch request to Gemini API...");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API direct call failed:", errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the generated text from the response structure
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error("No response text found in Gemini response");
    }

    console.log("Gemini Direct Response:", responseText);

    // Parse the JSON object from the response
    const parsed = JSON.parse(responseText.trim());

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("Gemini manual fetch error:", error);
    return NextResponse.json(
      { error: `Analysis failed: ${error.message}` },
      { status: 500 }
    );
  }
}