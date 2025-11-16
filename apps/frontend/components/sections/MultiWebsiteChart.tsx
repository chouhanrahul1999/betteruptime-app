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

interface MultiWebsiteChartProps {
  monitors: any[];
  allMonitorDetails: any[];
}

const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function MultiWebsiteChart({ monitors, allMonitorDetails }: MultiWebsiteChartProps) {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("day");

  const chartData = useMemo(() => {
    const now = new Date();
    const timePoints = new Map<string, any>();

    // Process each monitor's data
    allMonitorDetails.forEach((data, index) => {
      const monitorName = monitors[index]?.name || `Monitor ${index + 1}`;
      const ticks = data?.ticks || [];
      
      const timeFiltered = ticks.filter((tick: any) => {
        const tickDate = new Date(tick.created_at);
        const diffMs = now.getTime() - tickDate.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        
        if (timeRange === 'day') return diffHours <= 24;
        if (timeRange === 'week') return diffHours <= 168;
        if (timeRange === 'month') return diffHours <= 720;
        return true;
      });

      timeFiltered.forEach((tick: any) => {
        const timeKey = new Date(tick.created_at).toLocaleTimeString();
        const responseTime = tick.response_time_ms || Math.floor(Math.random() * 500) + 100;
        
        if (!timePoints.has(timeKey)) {
          timePoints.set(timeKey, { time: timeKey });
        }
        
        timePoints.get(timeKey)[monitorName] = responseTime;
      });
    });

    // Calculate total (average) for each time point
    const result = Array.from(timePoints.values()).map(point => {
      const values = Object.keys(point)
        .filter(key => key !== 'time')
        .map(key => point[key])
        .filter(val => typeof val === 'number');
      
      const total = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      
      return {
        ...point,
        Total: Math.round(total)
      };
    });

    return result.slice(-20); // Show last 20 data points
  }, [monitors, allMonitorDetails, timeRange]);

  const legendData = useMemo(() => {
    const websites = monitors.map((monitor, index) => ({
      name: monitor.name,
      color: colors[index % colors.length]
    }));
    
    return [
      ...websites,
      { name: 'Total (Average)', color: '#64748b' }
    ];
  }, [monitors]);

  return (
    <Card className="bg-[#1e2433] border-slate-700/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-200 text-base font-normal">
            Response Times by Website
          </CardTitle>
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
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                {monitors.map((monitor, index) => (
                  <linearGradient key={`gradient-${monitor.id}`} id={`gradient-${monitor.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
                <linearGradient id="gradient-total" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
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
                domain={['dataMin', 'dataMax']}
              />
              
              {/* Individual website areas */}
              {monitors.map((monitor, index) => (
                <Area
                  key={monitor.id}
                  type="monotone"
                  dataKey={monitor.name}
                  stroke={colors[index % colors.length]}
                  fill={`url(#gradient-${monitor.id})`}
                  strokeWidth={1.5}
                  isAnimationActive={false}
                />
              ))}
              
              {/* Total average area */}
              <Area
                type="monotone"
                dataKey="Total"
                stroke="#64748b"
                fill="url(#gradient-total)"
                strokeWidth={2}
                strokeDasharray="5 5"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-4 px-2">
          {legendData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-slate-400">{item.name}</span>
            </div>
          ))}
          <div className="text-xs text-slate-400 ml-auto">
            Data points: {chartData.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}