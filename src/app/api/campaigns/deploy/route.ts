import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { locationId, carModel, budget, headline, caption, radiusKm } = await req.json()
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock successful Meta API response
    return NextResponse.json({
      success: true,
      campaignId: `cmp_${Math.random().toString(36).substring(7)}`,
      adSetId: `ads_${Math.random().toString(36).substring(7)}`,
      adId: `ad_${Math.random().toString(36).substring(7)}`,
      message: "Successfully deployed to Meta Ads"
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to deploy campaign" }, { status: 500 })
  }
}
