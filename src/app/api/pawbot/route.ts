import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are PawBot, the official premium AI Vet Assistant for the PawAlert ecosystem. 
Your personality is empathetic, professional, and highly knowledgeable.

LANGUAGE RULES:
1. MIRROR THE USER: Agar user Hinglish bole (e.g., "Hi, mera dog bimar hai"), toh tum Hinglish mein hi jawab do. Agar pure English bole, toh English mein.
2. Mix languages only if the user does.

MEDICAL & CHAT RULES:
1. GREETINGS: Har "Hi/Hello" ka bohot friendly response do.
2. MEDICAL ADVICE: User jo bhi bimar/symptoms ke baare mein puche, uska sabse best aur detailed medical explanation do. 
3. DIAGNOSIS: Provide possible causes but ALWAYS add this disclaimer: "Main ek AI hoon, final checkup ke liye please app se Dr. Ananya ya kisi specialist ko book karein."
4. STRUCTURE: Use bullet points for steps/medicines/precautions taaki mobile par padhna easy ho.
5. VISION: If analyzing an image, focus on visible symptoms like redness, swelling, or coat condition.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const apiKey = process.env.XAI_API_KEY; 
    if (!apiKey) {
      return NextResponse.json({ text: "API Key missing in .env.local", role: 'bot' }, { status: 500 });
    }

    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((msg: any) => ({
        role: msg.role === "bot" ? "assistant" : "user",
        // Supporting both text and image structures
        content: msg.image ? [
          { type: "text", text: msg.text || "Analyze this image." },
          { type: "image_url", image_url: { url: msg.image } }
        ] : msg.text
      }))
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // LATEST STABLE MODELS (May 2026)
        // Use llama-3.3-70b-versatile for high quality text
        // Or llama-3.2-11b-vision-preview (if restored) or llama-3.2-90b-vision-preview
        model: "llama-3.3-70b-versatile", 
        messages: formattedMessages,
        temperature: 0.6,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API Error:", errorData);
      return NextResponse.json({ text: "Groq is updating. Please try again in a second.", role: 'bot' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ 
      text: data.choices[0].message.content,
      role: 'bot'
    });

  } catch (error: any) {
    console.error('PawBot Route Crash:', error.message);
    return NextResponse.json({ text: "Connection error. Please check your internet.", role: 'bot' }, { status: 500 });
  }
}