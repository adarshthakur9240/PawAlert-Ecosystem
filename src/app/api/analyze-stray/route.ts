import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { aiTriageLimiter } from "@/lib/rate-limit"; // Ensure this file exists!

const ANALYSIS_PROMPT = `You are a veterinary emergency assistant for the PawAlert rescue app. 
Analyze this image and respond with ONLY a JSON object in this exact format, with no markdown formatting or extra text:
{
  "animalType": "dog/cat/cow/bird/None",
  "condition": "critical/serious/moderate/stable/healthy/none",
  "advice": "1-2 sentence immediate first-aid or severity advice for a rescuer on the ground",
  "urgency": "critical/high/medium/low",
  "isValid": true
}

CRITICAL RULES:
1. If NO animal is in the image: Set "animalType": "None", "isValid": false, "urgency": "low", and "advice": "We couldn't detect an animal in this picture. Please upload a clear photo of the stray."
2. If an animal is present but looks HEALTHY and SAFE: Set "isValid": false, "urgency": "low", and "advice": "This animal appears to be safe and healthy. Emergency rescue is not required."
3. If an animal IS INJURED, SICK, or IN DISTRESS: Set "isValid": true, and provide the appropriate urgency and practical first-aid advice.`;

export async function POST(req: NextRequest) {
  try {
    // ==========================================
    // 1. RATE LIMITING LOGIC (UPSTASH + CLERK)
    // ==========================================
    const { userId } = await auth();
    // Fallback to IP if the user is not authenticated (e.g., guest users)
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const identifier = userId || ip;

    try {
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
    } catch (rateLimitError) {
      // If Upstash fails (e.g., WRONGPASS), log it but don't block the rescue report!
      console.error("Rate Limiter Failed (Check Upstash Token):", rateLimitError);
    }

    // ==========================================
    // 2. GROK (xAI) VISION API LOGIC
    // ==========================================
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const API_KEY = process.env.XAI_API_KEY; // Updated to XAI
    const API_URL = "https://api.x.ai/v1/chat/completions";

    if (!API_KEY) {
      throw new Error("XAI_API_KEY is missing from environment variables.");
    }

    // Format the image for Grok (Data URL format)
    const formattedMimeType = mimeType || "image/jpeg";
    const imageUrl = `data:${formattedMimeType};base64,${imageBase64}`;

    const requestBody = {
      model: "grok-vision-beta", // Or the specific Grok vision model you have access to
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: ANALYSIS_PROMPT,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              },
            },
          ],
        },
      ],
      temperature: 0.2, // Low temp for more consistent JSON structure
    };

    console.log("Sending direct fetch request to Grok API...");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Grok API direct call failed:", errorText);
      throw new Error(`Grok API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the generated text from Grok's response structure
    let responseText = data.choices?.[0]?.message?.content;
    
    if (!responseText) {
      throw new Error("No response text found in Grok response");
    }

    console.log("Grok Direct Response:", responseText);

    // Clean up Markdown formatting (Grok often wraps JSON in ```json ... ```)
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse the JSON object from the response
    const parsed = JSON.parse(responseText);

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("AI fetch error:", error);
    return NextResponse.json(
      { error: `Analysis failed: ${error.message}` },
      { status: 500 }
    );
  }
}