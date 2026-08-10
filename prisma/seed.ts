import { prisma } from '../src/lib/prisma'

async function main() {
  const locations = [
    {
      areaName: 'Banyumanik / Tembalang',
      latitude: -7.0535,
      longitude: 110.4285,
      defaultRadiusKm: 5,
      landmarks: JSON.stringify(['Tanjakan Gombel', 'Kampus UNDIP', 'Patung Kuda', 'ADA Banyumanik'])
    },
    {
      areaName: 'Simpang Lima / City Center',
      latitude: -6.9904,
      longitude: 110.4229,
      defaultRadiusKm: 5,
      landmarks: JSON.stringify(['Simpang Lima', 'Lawang Sewu', 'Paragon Mall', 'Tugu Muda'])
    },
    {
      areaName: 'BSB Mijen / Semarang Barat',
      latitude: -7.0270,
      longitude: 110.3200,
      defaultRadiusKm: 5,
      landmarks: JSON.stringify(['Uptown Mall', 'Unika BSB', 'Danau BSB', 'Kawasan Industri BSB'])
    },
    {
      areaName: 'Gajahmungkur / Candisari',
      latitude: -7.0150,
      longitude: 110.4180,
      defaultRadiusKm: 5,
      landmarks: JSON.stringify(['Taman Diponegoro', 'Akpelni', 'Kagok', 'Hotel Grand Candi'])
    }
  ]

  for (const location of locations) {
    const created = await prisma.semarangLocation.create({
      data: location
    })
    console.log(`Created location: ${created.areaName}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
