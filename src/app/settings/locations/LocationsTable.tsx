"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2 } from "lucide-react"

export default function LocationsTable({ locations }: { locations: any[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-wuling-navy hover:bg-wuling-navy/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Location Preset
        </Button>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Area Name</TableHead>
              <TableHead>Coordinates</TableHead>
              <TableHead>Default Radius</TableHead>
              <TableHead>Context / Landmarks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No locations found.
                </TableCell>
              </TableRow>
            ) : (
              locations.map((loc) => (
                <TableRow key={loc.id}>
                  <TableCell className="font-medium">{loc.areaName}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-600">
                    {loc.latitude}, {loc.longitude}
                  </TableCell>
                  <TableCell>{loc.defaultRadiusKm} km</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {loc.landmarks?.map((lm: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                          {lm}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
