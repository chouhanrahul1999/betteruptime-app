"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CreateMonitorModal } from "@/components/sections/CreateMonitorModal"
import { MonitorsTable } from "@/components/sections/MonitorsTable"
import { MonitorHeader } from "@/components/sections/MonitorHeader"
import { MonitorStats } from "@/components/sections/MonitorStats"
import { ResponseTimesChart } from "@/components/sections/ResponseTimesChart"
import { UptimeTable } from "@/components/sections/UptimeTable"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"

const monitors = [
  { id: 1, name: 'facebook.com', status: 'up' as const, uptime: '9h 44m', statusColor: 'bg-green-500', interval: '3m' },
  { id: 2, name: 'google.com', status: 'up' as const, uptime: '2d 9h 23m', statusColor: 'bg-green-500', interval: '3m' },
]

export default function Dashboard() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const pathParts = pathname.split('/').filter(Boolean)
  const isMonitorView = pathParts[1] === 'monitor'
  const monitorId = pathParts[2]
  const currentMonitor = monitors.find(m => m.id.toString() === monitorId)

  if (isMonitorView && currentMonitor) {
    return (
      <div className="bg-slate-950 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <MonitorHeader 
            monitorName={currentMonitor.name}
            statusColor={currentMonitor.statusColor}
            onBack={() => router.push('/dashboard')}
          />
          <MonitorStats />
          <ResponseTimesChart />
          <UptimeTable />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-950 text-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Monitors</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <Input 
              placeholder="Search" 
              className="pl-9 pr-10 w-64 h-9 bg-[#252b3b] border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-slate-600"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs text-slate-500 bg-slate-700/50 rounded border border-slate-600/50">/</kbd>
          </div>
          <CreateMonitorModal open={open} onOpenChange={setOpen} />
        </div>
      </div>
      <MonitorsTable monitors={monitors} onCreateMonitor={() => setOpen(true)} />
    </div>
  )
}
