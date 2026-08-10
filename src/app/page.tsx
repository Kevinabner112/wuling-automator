import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { PerformanceChart } from "@/components/PerformanceChart"

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const activeCampaignsCount = await prisma.campaign.count({
    where: { status: 'ACTIVE' }
  })
  
  const totalLeads = await prisma.lead.count()

  // Mock calculation for Cost per lead
  const avgCostPerLead = "Rp 25.000"
  const conversionRate = "12%"

  const recentLeads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      campaign: true
    }
  })

  // For the chart, let's group leads by district
  const leadsByDistrict = await prisma.lead.groupBy({
    by: ['districtArea'],
    _count: {
      id: true
    }
  })

  const chartData = leadsByDistrict.map(l => ({
    name: l.districtArea || 'Unknown',
    leads: l._count.id
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-wuling-navy">{activeCampaignsCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Leads (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-wuling-navy">{totalLeads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Cost / Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-wuling-navy">{avgCostPerLead}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-wuling-navy">{conversionRate}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Campaign Performance by District</CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceChart data={chartData} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeads.length === 0 ? (
                  <p className="text-sm text-gray-500">No leads received yet.</p>
                ) : (
                  recentLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-sm">{lead.customerName}</p>
                        <p className="text-xs text-gray-500">{lead.districtArea || 'Unknown Area'} • {lead.campaign?.carModel || 'Unknown Model'}</p>
                      </div>
                      <a 
                        href={`https://wa.me/${lead.customerPhone}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={buttonVariants({ size: "sm" }) + " bg-green-600 hover:bg-green-700 text-white cursor-pointer"}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </a>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
