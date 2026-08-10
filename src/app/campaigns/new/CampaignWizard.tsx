"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Wand2, Rocket } from "lucide-react"

export default function CampaignWizard({ locations }: { locations: any[] }) {
  const [step, setStep] = useState(1)
  const [isLoadingAi, setIsLoadingAi] = useState(false)
  const [isLoadingDeploy, setIsLoadingDeploy] = useState(false)
  const [formData, setFormData] = useState({
    carModel: "",
    locationId: "",
    radiusKm: [5],
    budget: "",
    headline: "",
    caption: ""
  })

  const handleGenerateCopy = async () => {
    setIsLoadingAi(true)
    try {
      const selectedLocation = locations.find(l => l.id === formData.locationId)
      const locName = selectedLocation ? selectedLocation.areaName : "Semarang"
      const landmarks = selectedLocation ? selectedLocation.landmarks.join(', ') : ""
      
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: locName,
          landmarks,
          carModel: formData.carModel
        })
      })
      const data = await res.json()
      
      setFormData(prev => ({
        ...prev,
        headline: data.headline || `Promo Spesial ${prev.carModel} di ${locName}!`,
        caption: data.caption || `Kini hadir mobil ${prev.carModel} dengan promo DP ringan. Cocok untuk Anda yang sering melintas di ${locName}.`
      }))
      setStep(3)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoadingAi(false)
    }
  }

  const handleDeploy = async () => {
    setIsLoadingDeploy(true)
    try {
      const res = await fetch('/api/campaigns/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        alert("Campaign deployed successfully! Campaign ID: " + data.campaignId)
        // Reset or redirect
        window.location.href = '/'
      } else {
        alert("Failed to deploy campaign.")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoadingDeploy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? 'bg-wuling-red' : 'bg-gray-200'}`} />
        ))}
      </div>

      <Card>
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Step 1: Target & Product</CardTitle>
              <CardDescription>Select the vehicle model and the target area in Semarang.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Wuling Model</Label>
                <Select onValueChange={(v) => setFormData({...formData, carModel: v || ""})} value={formData.carModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Air EV">Air EV</SelectItem>
                    <SelectItem value="BinguoEV">BinguoEV</SelectItem>
                    <SelectItem value="Cloud EV">Cloud EV</SelectItem>
                    <SelectItem value="Alvez">Alvez</SelectItem>
                    <SelectItem value="Almaz">Almaz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Area (Semarang)</Label>
                <Select onValueChange={(v) => setFormData({...formData, locationId: v || ""})} value={formData.locationId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>{loc.areaName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <Label>Geo-Fence Radius: {formData.radiusKm[0]} km</Label>
                </div>
                <Slider 
                  value={formData.radiusKm} 
                  onValueChange={(v) => setFormData({...formData, radiusKm: Array.isArray(v) ? [...v] : [v]})} 
                  max={15} 
                  min={1} 
                  step={1} 
                />
              </div>

              <div className="space-y-2 pt-2">
                <Label>Daily Budget (IDR)</Label>
                <Input 
                  type="number" 
                  placeholder="e.g. 50000" 
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => setStep(2)} disabled={!formData.carModel || !formData.locationId || !formData.budget} className="bg-wuling-navy hover:bg-wuling-navy/90 text-white">
                Next Step
              </Button>
            </CardFooter>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Step 2: AI Copy Generation</CardTitle>
              <CardDescription>Generate contextual ad copy tailored to the selected Semarang district.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col items-center justify-center py-12">
              <Badge variant="outline" className="mb-4">
                Model: {formData.carModel} • Area: {locations.find(l => l.id === formData.locationId)?.areaName}
              </Badge>
              <Button 
                size="lg" 
                onClick={handleGenerateCopy} 
                disabled={isLoadingAi}
                className="bg-wuling-red hover:bg-red-700 text-white"
              >
                <Wand2 className={`w-5 h-5 mr-2 ${isLoadingAi ? 'animate-spin' : ''}`} />
                {isLoadingAi ? "Generating..." : "Generate AI Local Copywriting"}
              </Button>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            </CardFooter>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle>Step 3: Review & Launch</CardTitle>
              <CardDescription>Review the AI-generated copy and launch your campaign to Meta Ads.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Generated Headline</Label>
                <Input 
                  value={formData.headline}
                  onChange={(e) => setFormData({...formData, headline: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Generated Caption</Label>
                <Textarea 
                  rows={4}
                  value={formData.caption}
                  onChange={(e) => setFormData({...formData, caption: e.target.value})}
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-600">
                <p><strong>Targeting:</strong> {locations.find(l => l.id === formData.locationId)?.areaName} (Lat/Lng radius: {formData.radiusKm[0]}km)</p>
                <p><strong>Budget:</strong> Rp {parseInt(formData.budget).toLocaleString('id-ID')} / day</p>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white font-bold tracking-wide"
                onClick={handleDeploy}
                disabled={isLoadingDeploy}
              >
                <Rocket className={`w-4 h-4 mr-2 ${isLoadingDeploy ? 'animate-bounce' : ''}`} />
                {isLoadingDeploy ? "DEPLOYING..." : "LAUNCH CAMPAIGN TO META ADS"}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
