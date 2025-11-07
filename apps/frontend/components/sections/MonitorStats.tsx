import { Card, CardContent } from "@/components/ui/card"

export function MonitorStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-[#1e2433] border-slate-700/50">
        <CardContent className="p-3.5">
          <p className="text-slate-400 text-sm mb-2">Currently up for</p>
          <p className="text-white text-lg font-semibold leading-tight">12 hours 1 minute 14 seconds</p>
        </CardContent>
      </Card>
      <Card className="bg-[#1e2433] border-slate-700/50">
        <CardContent className="p-3.5">
          <p className="text-slate-400 text-sm mb-2">Last checked at</p>
          <p className="text-white text-lg font-semibold">1 minute ago</p>
        </CardContent>
      </Card>
      <Card className="bg-[#1e2433] border-slate-700/50">
        <CardContent className="p-3.5">
          <p className="text-slate-400 text-sm mb-2">Incidents</p>
          <p className="text-white text-lg font-semibold">0</p>
        </CardContent>
      </Card>
    </div>
  )
}
