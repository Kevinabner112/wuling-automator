"use client"

import Link from 'next/link'
import { LayoutDashboard, Megaphone, Users, MapPin, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Locations', href: '/settings/locations', icon: MapPin },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-wuling-navy text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-wider">
          <span className="text-wuling-red">WULING</span> AUTO
        </h1>
        <p className="text-xs text-gray-400 mt-1">Semarang Geo-Targeting</p>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                isActive ? 'bg-wuling-red text-white' : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">SA</span>
          </div>
          <div>
            <p className="text-sm font-medium">Sales Agent</p>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
