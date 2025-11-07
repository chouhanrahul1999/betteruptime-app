import { ArrowLeft, Send, AlertTriangle, Pause, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface MonitorHeaderProps {
  monitorName: string
  statusColor: string
  onBack: () => void
}

export function MonitorHeader({ monitorName, statusColor, onBack }: MonitorHeaderProps) {
  return (
    <>
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 text-slate-400 hover:text-white ml-[-10]"
      >
        <ArrowLeft size={16} className="mr-2  " />
        Back to Dashboard
      </Button>

      <div className="flex items-center gap-3 mb-3">
        <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
        <h1 className="text-2xl font-bold">{monitorName}</h1>
      </div>
      
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">
          Up
        </Badge>
        <span className="text-slate-400 text-sm">· Checked every 3 minutes</span>
      </div>

      <Separator className="mb-6 bg-slate-700/50" />

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Button variant="outline" size="sm" className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
          <Send size={14} className="mr-2" />
          Send test alert
        </Button>
        <Button variant="outline" size="sm" className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
          <AlertTriangle size={14} className="mr-2" />
          Incidents
        </Button>
        <Button variant="outline" size="sm" className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
          <Pause size={14} className="mr-2" />
          Pause
        </Button>
        <Button variant="outline" size="sm" className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
          <Settings size={14} className="mr-2" />
          Configure
        </Button>
      </div>
    </>
  )
}
