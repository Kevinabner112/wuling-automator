"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { buttonVariants } from "@/components/ui/button"
import { Search, MessageCircle } from "lucide-react"
import { updateLeadStatus } from "./actions"

export default function LeadsTable({ leads }: { leads: any[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLeads = leads.filter(l => 
    l.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.districtArea?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStatusChange = async (leadId: string, status: string) => {
    await updateLeadStatus(leadId, status)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-gray-500" />
        <Input 
          placeholder="Search leads by name or area..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Area & Model</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No leads found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => {
                const message = encodeURIComponent(`Halo ${lead.customerName}, perkenalkan saya sales Wuling Semarang. Terima kasih atas ketertarikan Anda pada Wuling ${lead.campaign?.carModel}. Boleh saya bantu jelaskan promonya?`)
                const waLink = `https://wa.me/${lead.customerPhone}?text=${message}`

                return (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.customerName}</TableCell>
                    <TableCell>{lead.customerPhone}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{lead.districtArea}</span>
                        <span className="text-xs text-gray-500">{lead.campaign?.carModel}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={lead.status || "NEW"} onValueChange={(v) => handleStatusChange(lead.id, v)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">NEW</SelectItem>
                          <SelectItem value="CONTACTED">CONTACTED</SelectItem>
                          <SelectItem value="TEST_DRIVE_SCHEDULED">TEST DRIVE SCHEDULED</SelectItem>
                          <SelectItem value="CLOSED_WON">CLOSED WON</SelectItem>
                          <SelectItem value="CLOSED_LOST">CLOSED LOST</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <a 
                        href={waLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={buttonVariants({ size: "sm" }) + " bg-green-600 hover:bg-green-700 text-white cursor-pointer"}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat WA
                      </a>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
