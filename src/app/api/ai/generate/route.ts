import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { location, landmarks, carModel } = await req.json()
    
    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found, using mock response.")
      return NextResponse.json({
        headline: `Promo ${carModel} Khusus Warga ${location}!`,
        caption: `Kini saatnya punya ${carModel} impian Anda. Nikmati DP ringan & cicilan rendah khusus domisili ${location}. Kunjungi dealer Wuling Semarang sekarang juga!`
      })
    }

    const prompt = `Write an engaging, short Facebook ad for a Wuling ${carModel} targeted at people living in or visiting ${location}, Semarang. 
    Use these landmarks if relevant: ${landmarks}. 
    Output in JSON format with exactly two keys: "headline" and "caption". Language: Indonesian. Tone: persuasive and urgent.`

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    })

    if (!res.ok) {
      throw new Error("Failed to fetch from Gemini API")
    }

    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (text) {
      const parsed = JSON.parse(text)
      return NextResponse.json(parsed)
    }
    
    throw new Error("Invalid response format")
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to generate AI copy" }, { status: 500 })
  }
}
