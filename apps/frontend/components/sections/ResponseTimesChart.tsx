"use client";

import { useMemo, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";



interface ResponseTimesChartProps {
  data?: {
    ticks?: Array<{
      response_time_ms: number;
      created_at: string;
      region_id: string;
    }>;
  };
}


export function ResponseTimesChart({ data }: ResponseTimesChartProps) {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("day");

  const regions = useMemo(() => {
    const regionSet = new Set(data?.ticks?.map((t) => t.region_id) || []);
    return ["all", ...Array.from(regionSet)];
  }, [data]);

  const chartData = useMemo(() => {
    const ticks = data?.ticks || [];
    const now = new Date();
    
    // Filter by time range
    const timeFiltered = ticks.filter(tick => {
      const tickDate = new Date(tick.created_at);
      const diffMs = now.getTime() - tickDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (timeRange === 'day') return diffHours <= 24;
      if (timeRange === 'week') return diffHours <= 168; // 7 days
      if (timeRange === 'month') return diffHours <= 720; // 30 days
      return true;
    });
    
    // Filter by region
    const filtered = selectedRegion === 'all'
      ? timeFiltered
      : timeFiltered.filter(t => t.region_id === selectedRegion);

    return filtered.map(tick => ({
      time: new Date(tick.created_at).toLocaleTimeString(),
      responseTime: tick.response_time_ms
    })).reverse();
  }, [data, selectedRegion, timeRange])

  return (
    <Card className="bg-[#1e2433] border-slate-700/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-200 text-base font-normal">
            Response times
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="appearance-none bg-transparent text-slate-300 hover:text-white text-sm pl-5 pr-5 py-1 cursor-pointer focus:outline-none border-none"
              >
                {regions.map((region) => (
                  <option
                    key={region}
                    value={region}
                    className="bg-slate-800 text-white"
                  >
                    {region}
                  </option>
                ))}
              </select>
              <Globe
                size={14}
                className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
              />
              <ChevronDown
                size={12}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
              />
            </div>
            <div className="flex items-center gap-0 bg-slate-800/60 rounded-lg p-1">
              <button
                onClick={() => setTimeRange("day")}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                  timeRange === "day"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setTimeRange("week")}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                  timeRange === "week"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange("month")}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                  timeRange === "month"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="responseTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                opacity={0.2}
                vertical={false}
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(value) => `${value}ms`}
                domain={[0, 1500]}
                ticks={[0, 300, 600, 900, 1200, 1500]}
              />
              <Area
                type="monotone"
                dataKey="responseTime"
                stroke="#3b82f6"
                fill="url(#responseTime)"
                strokeWidth={1.5}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-start gap-6 mt-4 px-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
            <span className="text-xs text-slate-400">Response Time</span>
          </div>
          <div className="text-xs text-slate-400">
            Data points: {chartData.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
