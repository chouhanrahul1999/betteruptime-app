"use client"

import { GripVertical, ListFilter, ChevronDown, Target, Ellipsis, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useState } from "react"
import axios from "axios"

interface Monitor {
  id: string | number
  name: string
  status: 'up' | 'down' | 'unknown'
  uptime: string
  statusColor: string
  interval: string
}

interface MonitorsTableProps {
  monitors: Monitor[]
  onCreateMonitor?: () => void
  onRefresh?: () => void
}

export function MonitorsTable({ monitors, onCreateMonitor, onRefresh }: MonitorsTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleteMonitorId, setDeleteMonitorId] = useState<string | number | null>(null)

  const handleDeleteClick = (monitorId: string | number, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteMonitorId(monitorId)
  }

  const handleConfirmDelete = async () => {
    if (!deleteMonitorId) return
    
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:3000/api/v1/website/${deleteMonitorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      onRefresh?.()
      toast({
        title: "Monitor deleted",
        description: "The monitor has been successfully removed.",
      })
    } catch (error) {
      console.error('Failed to delete monitor:', error)
      toast({
        title: "Error",
        description: "Failed to delete monitor. Please try again.",
        variant: "destructive",
      })
    }
    setDeleteMonitorId(null)
  }

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
                  {monitor.status === 'up' ? 'Up' : monitor.status === 'down' ? 'Down' : 'Unknown'} · {monitor.uptime}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between min-w-0 ml-auto">
              <div className="flex items-center gap-1.5 text-slate-400 text-sm mr-4 sm:mr-8 lg:mr-12 xl:mr-20">
                <Target size={18} />
                <span>{monitor.interval}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center shrink-0"
                  onClick={(e) => handleDeleteClick(monitor.id, e)}
                  title="Delete monitor"
                >
                  <Trash2 size={14} />
                </Button>
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
          </div>
        ))}
      </div>
      
      <AlertDialog open={deleteMonitorId !== null} onOpenChange={() => setDeleteMonitorId(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Monitor</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this monitor? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}