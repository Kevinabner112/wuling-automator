export async function deployToMeta(params: {
  headline: string
  caption: string
  carModel: string
  budget: number
  radiusKm: number
  latitude: number
  longitude: number
}) {
  const { headline, caption, budget, radiusKm, latitude, longitude } = params

  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN
  const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID
  const PAGE_ID = process.env.META_PAGE_ID

  if (!ACCESS_TOKEN || !AD_ACCOUNT_ID || !PAGE_ID || ACCESS_TOKEN.startsWith("YOUR_")) {
    console.warn("[Meta API] Missing credentials, using mock deployment")
    await new Promise((r) => setTimeout(r, 2000))
    return {
      campaignId: `mock_cmp_${Math.random().toString(36).substring(7)}`,
      adSetId: `mock_ads_${Math.random().toString(36).substring(7)}`,
      adId: `mock_ad_${Math.random().toString(36).substring(7)}`,
    }
  }

  const baseUrl = `https://graph.facebook.com/v19.0/act_${AD_ACCOUNT_ID}`

  try {
    // 1. Create Campaign
    const cmpRes = await fetch(`${baseUrl}/campaigns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `Automated Campaign - Wuling Semarang - ${new Date().toISOString()}`,
        objective: "OUTCOME_LEADS",
        status: "PAUSED", // PAUSED for safety
        special_ad_categories: ["NONE"],
        access_token: ACCESS_TOKEN,
      }),
    })
    const cmpData = await cmpRes.json()
    if (cmpData.error) throw new Error(cmpData.error.message)
    const campaignId = cmpData.id

    // 2. Create Ad Set with Geo-Fencing
    const adSetRes = await fetch(`${baseUrl}/adsets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `AdSet Geo - ${latitude}, ${longitude}`,
        campaign_id: campaignId,
        daily_budget: budget * 100, // API expects cents / smallest currency unit
        billing_event: "IMPRESSIONS",
        optimization_goal: "LEAD_GENERATION",
        bid_amount: 5000, // IDR 50.00
        promoted_object: { page_id: PAGE_ID },
        targeting: {
          geo_locations: {
            custom_locations: [
              {
                latitude: latitude,
                longitude: longitude,
                radius: radiusKm,
                distance_unit: "kilometer",
              },
            ],
          },
        },
        status: "PAUSED",
        access_token: ACCESS_TOKEN,
      }),
    })
    const adSetData = await adSetRes.json()
    if (adSetData.error) throw new Error(adSetData.error.message)
    const adSetId = adSetData.id

    // 3. Create Ad Creative (Mocking image hash for now)
    const creativeRes = await fetch(`${baseUrl}/adcreatives`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Creative AI Output",
        object_story_spec: {
          page_id: PAGE_ID,
          link_data: {
            link: "https://wuling.id",
            message: `${headline}\n\n${caption}`,
            // In a real app, you need to upload an image first and get image_hash
            // For now, we omit it or use a placeholder if required
          },
        },
        access_token: ACCESS_TOKEN,
      }),
    })
    const creativeData = await creativeRes.json()
    if (creativeData.error) throw new Error(creativeData.error.message)
    const creativeId = creativeData.id

    // 4. Create Ad
    const adRes = await fetch(`${baseUrl}/ads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Automated AI Ad",
        adset_id: adSetId,
        creative: { creative_id: creativeId },
        status: "PAUSED",
        access_token: ACCESS_TOKEN,
      }),
    })
    const adData = await adRes.json()
    if (adData.error) throw new Error(adData.error.message)
    const adId = adData.id

    return {
      campaignId,
      adSetId,
      adId,
    }
  } catch (error: any) {
    console.error("Meta API Error:", error)
    throw new Error(error.message || "Failed to deploy to Meta Ads")
  }
}
