"use client"

import { GripVertical, ListFilter, ChevronDown, Target, Ellipsis, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Monitor {
  id: number
  name: string
  status: 'up' | 'down'
  uptime: string
  statusColor: string
  interval: string
}

interface MonitorsTableProps {
  monitors: Monitor[]
  onCreateMonitor?: () => void
}

export function MonitorsTable({ monitors, onCreateMonitor }: MonitorsTableProps) {
  const router = useRouter()

  return (
    <div className="bg-[#1a1f2e] rounded-lg border border-slate-700/50 group">
      <div className="px-4 py-2 border-b border-slate-700/50 flex items-center justify-between relative">
        <div className="flex items-center text-slate-300 relative">
          <div className="absolute left-0 flex items-center gap-1.5 opacity-0 transition-all duration-200 delay-75 group-hover:opacity-100">
            <GripVertical size={14} className="text-slate-500" />
          </div>
          <div className="flex items-center gap-1.5 transition-all duration-200 transform group-hover:translate-x-6">
            <ChevronDown size={14} className="text-slate-500" />
            <span className="text-sm font-medium transition-colors duration-200 group-hover:text-white">Monitors</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-200 delay-150 group-hover:opacity-100">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50">
            <ListFilter size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50"
            onClick={onCreateMonitor}
          >
            <Plus size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50">
            <Ellipsis size={14} />
          </Button>
        </div>
      </div>
      
      <div className="divide-y divide-slate-700/50">
        {monitors.map((monitor) => (
          <div
            key={monitor.id}
            onClick={() => router.push(`/dashboard/monitor/${monitor.id}`)}
            className="px-4 py-3.5 hover:bg-slate-700/20 cursor-pointer transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-2 h-2 ${monitor.statusColor} rounded-full shrink-0`}></div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-normal text-[15px] leading-tight">{monitor.name}</div>
                <div className="text-slate-400 text-xs mt-1 leading-tight">
                  {monitor.status === 'up' ? 'Up' : 'Down'} · {monitor.uptime}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between min-w-0 ml-auto">
              <div className="flex items-center gap-1.5 text-slate-400 text-sm mr-4 sm:mr-8 lg:mr-12 xl:mr-20">
                <Target size={18} />
                <span>{monitor.interval}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50 flex items-center justify-center shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Ellipsis size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}