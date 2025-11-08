import { Card, CardContent } from "@/components/ui/card";
import { calculateUptime, formatTimeAgo } from "@/lib/utils";
interface MonitorsTableProps {
  data?: {
    ticks?: Array<{
      status: string;
      created_at: string;
    }>
  }
}

export function MonitorStats({data}: MonitorsTableProps) {
  const ticks = data?.ticks || [];
  const lastTick = ticks[0];
  const incidents = ticks.filter(t => t.status === "Down").length;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-[#1e2433] border-slate-700/50">
        <CardContent className="p-3.5">
          <p className="text-slate-400 text-sm mb-2">Currently up for</p>
          <p className="text-white text-lg font-semibold leading-tight">
            {calculateUptime(ticks)}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-[#1e2433] border-slate-700/50">
        <CardContent className="p-3.5">
          <p className="text-slate-400 text-sm mb-2">Last checked at</p>
          <p className="text-white text-lg font-semibold">{lastTick ? formatTimeAgo(lastTick.created_at) : "Never"}</p>
        </CardContent>
      </Card>
      <Card className="bg-[#1e2433] border-slate-700/50">
        <CardContent className="p-3.5">
          <p className="text-slate-400 text-sm mb-2">Incidents</p>
          <p className="text-white text-lg font-semibold">{incidents}</p>
        </CardContent>
      </Card>
    </div>
  );
}
