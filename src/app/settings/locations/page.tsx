import { prisma } from "@/lib/prisma"
import LocationsTable from "./LocationsTable"

export const dynamic = 'force-dynamic'

export default async function LocationsPage() {
  try {
    const locations = await prisma.semarangLocation.findMany({
      orderBy: { areaName: 'asc' }
    })

    // Serialize decimals to string for Client Component
    const serializedLocations = locations.map(loc => ({
      ...loc,
      latitude: loc.latitude.toString(),
      longitude: loc.longitude.toString()
    }))

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Location Presets</h1>
          <p className="text-muted-foreground">Manage your Semarang geo-fencing areas and landmarks.</p>
        </div>
        
        <LocationsTable locations={serializedLocations} />
      </div>
    )
  } catch (error: any) {
    return (
      <div className="p-8 text-red-500">
        <h1 className="text-2xl font-bold mb-4">Database Error</h1>
        <pre className="bg-red-50 p-4 rounded text-sm overflow-auto">
          {error?.message || "Unknown error occurred"}
        </pre>
      </div>
    )
  }
}
