import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Frontend se animal details aayengi
    const { animalType, location, urgency } = await req.json();

    const data = await resend.emails.send({
      from: 'PawAlert <onboarding@resend.dev>', // Abhi testing ke liye default use kar
      to: ['singhadadarsh9240@gmail.com'], // Yahan apna email daal testing ke liye
      subject: `🚨 New Rescue Alert: ${urgency} case reported!`,
      html: `
        <h2>New Animal Reported</h2>
        <p>A <strong>${animalType}</strong> has been reported in a <strong>${urgency}</strong> condition.</p>
        <p><strong>Location:</strong> ${location}</p>
        <p>Please check the PawAlert dashboard to coordinate the rescue.</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}