import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function UptimeTable() {
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
                <td className="px-6 py-3.5 text-white">100.0000%</td>
                <td className="px-6 py-3.5 text-slate-400">none</td>
                <td className="px-6 py-3.5 text-white">0</td>
                <td className="px-6 py-3.5 text-slate-400">none</td>
                <td className="px-6 py-3.5 text-slate-400">none</td>
              </tr>
              <tr className="border-b border-slate-700/50 hover:bg-slate-800/20">
                <td className="px-6 py-3.5 text-white">Last 7 days</td>
                <td className="px-6 py-3.5 text-white">100.0000%</td>
                <td className="px-6 py-3.5 text-slate-400">none</td>
                <td className="px-6 py-3.5 text-white">0</td>
                <td className="px-6 py-3.5 text-slate-400">none</td>
                <td className="px-6 py-3.5 text-slate-400">none</td>
              </tr>
              <tr className="border-b border-slate-700/50 hover:bg-slate-800/20">
                <td className="px-6 py-3.5 text-white">Last 30 days</td>
                <td className="px-6 py-3.5 text-white">100.0000%</td>
                <td className="px-6 py-3.5 text-slate-400">none</td>
                <td className="px-6 py-3.5 text-white">0</td>
                <td className="px-6 py-3.5 text-slate-400">none</td>
                <td className="px-6 py-3.5 text-slate-400">none</td>
              </tr>
              <tr className="border-b border-slate-700/50 hover:bg-slate-800/20">
                <td className="px-6 py-3.5 text-white">Last 365 days</td>
                <td className="px-6 py-3.5 text-white">100.0000%</td>
                <td className="px-6 py-3.5 text-slate-400">none</td>
                <td className="px-6 py-3.5 text-white">0</td>
                <td className="px-6 py-3.5 text-slate-400">none</td>
                <td className="px-6 py-3.5 text-slate-400">none</td>
              </tr>
              <tr className="border-b border-slate-700/50 hover:bg-slate-800/20">
                <td className="px-6 py-3.5 text-white">All time</td>
                <td className="px-6 py-3.5 text-white">100.0000%</td>
                <td className="px-6 py-3.5 text-slate-400">none</td>
                <td className="px-6 py-3.5 text-white">0</td>
                <td className="px-6 py-3.5 text-slate-400">none</td>
                <td className="px-6 py-3.5 text-slate-400">none</td>
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
