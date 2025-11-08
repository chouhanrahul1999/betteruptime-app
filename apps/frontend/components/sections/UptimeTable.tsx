import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMemo } from "react"

interface UptimeTableProps {
  data?: {
    ticks?: Array<{
      status: string;
      created_at: string;
    }>;
  };
}

function calculateUptimeStats(ticks: any[], hours: number) {
  const now = new Date();
  const filtered = ticks.filter(tick => {
    const tickDate = new Date(tick.created_at);
    const diffHours = (now.getTime() - tickDate.getTime()) / (1000 * 60 * 60);
    return diffHours <= hours;
  });

  if (filtered.length === 0) return { availability: 0, downtime: 0, incidents: 0, longestIncident: 'none', avgIncident: 'none' };

  const upCount = filtered.filter(t => t.status === "up").length;
  const availability = (upCount / filtered.length) * 100;
  
  const incidents: number[] = [];
  let currentIncidentDuration = 0;
  
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i].status.toLowerCase() === "down") {
      currentIncidentDuration++;
    } else if (currentIncidentDuration > 0) {
      incidents.push(currentIncidentDuration);
      currentIncidentDuration = 0;
    }
  }
  if (currentIncidentDuration > 0) incidents.push(currentIncidentDuration);
  
  const longestIncident = incidents.length > 0 ? Math.max(...incidents) * 3 : 0;
  const avgIncident = incidents.length > 0 ? (incidents.reduce((a, b) => a + b, 0) / incidents.length) * 3 : 0;
  
  return {
    availability: availability.toFixed(4),
    downtime: incidents.length,
    incidents: incidents.length,
    longestIncident: longestIncident > 0 ? `${longestIncident}m` : 'none',
    avgIncident: avgIncident > 0 ? `${Math.round(avgIncident)}m` : 'none'
  };
}

export function UptimeTable({ data }: UptimeTableProps) {
  const ticks = data?.ticks || [];

  const stats = useMemo(() => ({
    today: calculateUptimeStats(ticks, 24),
    week: calculateUptimeStats(ticks, 168),
    month: calculateUptimeStats(ticks, 720),
    year: calculateUptimeStats(ticks, 8760),
    allTime: calculateUptimeStats(ticks, Infinity)
  }), [ticks]);
  return (
    <Card className="bg-[#1e2433] border-slate-700/50 mt-8">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/30">
                <th className="text-left text-slate-400 font-normal px-6 py-3.5">Time period</th>
                <th className="text-left text-slate-400 font-normal px-6 py-3.5">Availability</th>
                <th className="text-left text-slate-400 font-normal px-6 py-3.5">Downtime</th>
                <th className="text-left text-slate-400 font-normal px-6 py-3.5">Incidents</th>
                <th className="text-left text-slate-400 font-normal px-6 py-3.5">Longest incident</th>
                <th className="text-left text-slate-400 font-normal px-6 py-3.5">Avg. incident</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-700/50 hover:bg-slate-800/20">
                <td className="px-6 py-3.5 text-white">Today</td>
                <td className="px-6 py-3.5 text-white">{stats.today.availability}%</td>
                <td className="px-6 py-3.5 text-slate-400">{stats.today.downtime || 'none'}</td>
                <td className="px-6 py-3.5 text-white">{stats.today.incidents}</td>
                <td className="px-6 py-3.5 text-slate-400">{stats.today.longestIncident}</td>
                <td className="px-6 py-3.5 text-slate-400">{stats.today.avgIncident}</td>
              </tr>
              <tr className="border-b border-slate-700/50 hover:bg-slate-800/20">
                <td className="px-6 py-3.5 text-white">Last 7 days</td>
                <td className="px-6 py-3.5 text-white">{stats.week.availability}%</td>
                <td className="px-6 py-3.5 text-slate-400">{stats.week.downtime || 'none'}</td>
                <td className="px-6 py-3.5 text-white">{stats.week.incidents}</td>
                <td className="px-6 py-3.5 text-slate-400">{stats.week.longestIncident}</td>
                <td className="px-6 py-3.5 text-slate-400">{stats.week.avgIncident}</td>
              </tr>
              <tr className="border-b border-slate-700/50 hover:bg-slate-800/20">
                <td className="px-6 py-3.5 text-white">Last 30 days</td>
                <td className="px-6 py-3.5 text-white">{stats.month.availability}%</td>
                <td className="px-6 py-3.5 text-slate-400">{stats.month.downtime || 'none'}</td>
                <td className="px-6 py-3.5 text-white">{stats.month.incidents}</td>
                <td className="px-6 py-3.5 text-slate-400">{stats.month.longestIncident}</td>
                <td className="px-6 py-3.5 text-slate-400">{stats.month.avgIncident}</td>
              </tr>
              <tr className="border-b border-slate-700/50 hover:bg-slate-800/20">
                <td className="px-6 py-3.5 text-white">Last 365 days</td>
                <td className="px-6 py-3.5 text-white">{stats.year.availability}%</td>
                <td className="px-6 py-3.5 text-slate-400">{stats.year.downtime || 'none'}</td>
                <td className="px-6 py-3.5 text-white">{stats.year.incidents}</td>
                <td className="px-6 py-3.5 text-slate-400">{stats.year.longestIncident}</td>
                <td className="px-6 py-3.5 text-slate-400">{stats.year.avgIncident}</td>
              </tr>
              <tr className="border-b border-slate-700/50 hover:bg-slate-800/20">
                <td className="px-6 py-3.5 text-white">All time</td>
                <td className="px-6 py-3.5 text-white">{stats.allTime.availability}%</td>
                <td className="px-6 py-3.5 text-slate-400">{stats.allTime.downtime || 'none'}</td>
                <td className="px-6 py-3.5 text-white">{stats.allTime.incidents}</td>
                <td className="px-6 py-3.5 text-slate-400">{stats.allTime.longestIncident}</td>
                <td className="px-6 py-3.5 text-slate-400">{stats.allTime.avgIncident}</td>
              </tr>
              <tr className="bg-slate-800/20">
                <td className="px-6 py-4" colSpan={6}>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm">From</span>
                    <Input
                      type="date"
                      defaultValue="2025-11-06"
                      className="w-36 bg-slate-800/50 border-slate-700 text-white text-sm h-9 focus-visible:ring-1 focus-visible:ring-slate-600 [&::-webkit-calendar-picker-indicator]:invert-[0.6] [&::-webkit-calendar-picker-indicator]:brightness-90"
                    />
                    <span className="text-slate-400 text-sm">To</span>
                    <Input
                      type="date"
                      defaultValue="2025-11-06"
                      className="w-36 bg-slate-800/50 border-slate-700 text-white text-sm h-9 focus-visible:ring-1 focus-visible:ring-slate-600 [&::-webkit-calendar-picker-indicator]:invert-[0.6] [&::-webkit-calendar-picker-indicator]:brightness-90"
                    />
                    <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white h-9 px-4">
                      Calculate
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
