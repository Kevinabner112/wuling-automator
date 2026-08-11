import { prisma } from "@/lib/prisma"
import CampaignWizard from "./CampaignWizard"

export const dynamic = 'force-dynamic'

export default async function NewCampaignPage() {
  const locations = await prisma.semarangLocation.findMany({
    orderBy: { areaName: 'asc' }
  })

  const serializedLocations = locations.map(loc => ({
    ...loc,
    landmarks: loc.landmarks ? JSON.parse(loc.landmarks) : []
  }))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
        <p className="text-muted-foreground">Launch a new geo-targeted Meta ad campaign.</p>
      </div>
      
      <CampaignWizard locations={serializedLocations} />
    </div>
  )
}
