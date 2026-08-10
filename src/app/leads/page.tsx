import { prisma } from "@/lib/prisma"
import LeadsTable from "./LeadsTable"

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      campaign: true
    }
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
        <p className="text-muted-foreground">Manage and contact your incoming Wuling leads.</p>
      </div>
      
      <LeadsTable leads={leads} />
    </div>
  )
}
