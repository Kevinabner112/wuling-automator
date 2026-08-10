import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // Mock parsing lead data from Meta
    const customerName = data.entry?.[0]?.changes?.[0]?.value?.form_data?.full_name || "New Lead"
    const customerPhone = data.entry?.[0]?.changes?.[0]?.value?.form_data?.phone_number || "628123456789"
    const districtArea = data.entry?.[0]?.changes?.[0]?.value?.form_data?.city || "Semarang"
    const campaignId = data.entry?.[0]?.changes?.[0]?.value?.campaign_id || null

    const lead = await prisma.lead.create({
      data: {
        customerName,
        customerPhone,
        districtArea,
        campaignId,
        status: "NEW"
      }
    })

    // Mock WhatsApp notification
    console.log(`[WA GATEWAY MOCK] Sent WhatsApp notification to Sales: "New Lead received: ${customerName} (${customerPhone}) from ${districtArea}!"`)

    return NextResponse.json({ success: true, leadId: lead.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to process lead" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  // Webhook verification for Meta
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  if (mode && token) {
    if (mode === "subscribe" && token === "my_custom_verify_token") {
      return new NextResponse(challenge, { status: 200 })
    }
    return new NextResponse("Forbidden", { status: 403 })
  }

  return new NextResponse("Bad Request", { status: 400 })
}
