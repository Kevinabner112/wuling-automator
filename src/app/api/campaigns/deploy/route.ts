import { NextResponse } from "next/server"
import { deployToMeta } from "@/lib/meta_ads"

export async function POST(req: Request) {
  try {
    const { locationId, carModel, budget, headline, caption, radiusKm, customLatitude, customLongitude } = await req.json()
    
    // Deploy to Meta (if credentials exist, otherwise it falls back to mock inside the function)
    const result = await deployToMeta({
      headline,
      caption,
      carModel,
      budget,
      radiusKm,
      latitude: customLatitude || -7.0535, // default to some coordinate if missing
      longitude: customLongitude || 110.4285
    })

    return NextResponse.json({
      success: true,
      campaignId: result.campaignId,
      adSetId: result.adSetId,
      adId: result.adId,
      message: "Successfully deployed to Meta Ads"
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to deploy campaign" }, { status: 500 })
  }
}
