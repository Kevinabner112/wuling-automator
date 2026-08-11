export async function sendNewLeadAlert(lead: {
  customerName: string
  customerPhone: string
  districtArea: string
  carModel?: string
}) {
  const token = process.env.FONNTE_API_KEY
  const target = process.env.SALES_WHATSAPP_NUMBER

  if (!token || !target || token === "YOUR_FONNTE_API_KEY") {
    console.warn("[WA Notifier] Missing FONNTE_API_KEY or SALES_WHATSAPP_NUMBER. Skipping actual WA sending.")
    return false
  }

  // Ensure target starts with country code, typically Fonnte handles 08 or 62
  
  const message = `🚨 *LEADS BARU WULING SEMARANG!*
  
Nama: ${lead.customerName}
No. WA: ${lead.customerPhone}
Area: ${lead.districtArea}
Minat Mobil: ${lead.carModel || "Belum Diketahui"}

👉 *Klik untuk chat langsung:*
https://wa.me/${lead.customerPhone.replace(/[^0-9]/g, '')}`

  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: new URLSearchParams({
        target: target,
        message: message,
      }),
    })

    const data = await response.json()
    
    if (data.status) {
      console.log("[WA Notifier] Message sent successfully via Fonnte")
      return true
    } else {
      console.error("[WA Notifier] Fonnte Error:", data)
      return false
    }
  } catch (error) {
    console.error("[WA Notifier] Request Failed:", error)
    return false
  }
}
