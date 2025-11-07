"use client"

import { useState } from "react"
import { Globe, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"

const regions = ['Europe', 'North America', 'Asia', 'India', 'Australia']

const chartData = {
  day: Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = (i % 2) * 30
    return {
      time: `${hour}:${minute.toString().padStart(2, '0')}`,
      nameLookup: Math.random() * 200 + 50,
      connection: Math.random() * 800 + 200,
      tlsHandshake: Math.random() * 600 + 300,
      dataTransfer: Math.random() * 400 + 100,
    }
  }),
  week: Array.from({ length: 168 }, (_, i) => {
    const day = Math.floor(i / 24)
    const hour = i % 24
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return {
      time: `${days[day]} ${hour}:00`,
      nameLookup: Math.random() * 200 + 50,
      connection: Math.random() * 800 + 200,
      tlsHandshake: Math.random() * 600 + 300,
      dataTransfer: Math.random() * 400 + 100,
    }
  }),
  month: Array.from({ length: 720 }, (_, i) => {
    const day = Math.floor(i / 24) + 1
    const hour = i % 24
    return {
      time: `Day ${day} ${hour}:00`,
      nameLookup: Math.random() * 200 + 50,
      connection: Math.random() * 800 + 200,
      tlsHandshake: Math.random() * 600 + 300,
      dataTransfer: Math.random() * 400 + 100,
    }
  }),
}

export function ResponseTimesChart() {
  const [selectedRegion, setSelectedRegion] = useState('Europe')
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day')

  return (
    <Card className="bg-[#1e2433] border-slate-700/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-200 text-base font-normal">Response times</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="appearance-none bg-transparent text-slate-300 hover:text-white text-sm pl-5 pr-5 py-1 cursor-pointer focus:outline-none border-none"
              >
                {regions.map((region) => (
                  <option key={region} value={region} className="bg-slate-800 text-white">
                    {region}
                  </option>
                ))}
              </select>
              <Globe size={14} className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
            <div className="flex items-center gap-0 bg-slate-800/60 rounded-lg p-1">
              <button
                onClick={() => setTimeRange('day')}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                  timeRange === 'day'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                  timeRange === 'week'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                  timeRange === 'month'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-300'
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
            <AreaChart data={chartData[timeRange]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="nameLookup" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="connection" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="tlsHandshake" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="dataTransfer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                interval="preserveStartEnd"
                tickFormatter={(value, index) => {
                  if (timeRange === 'day') {
                    return index % 8 === 0 ? value : ''
                  }
                  if (timeRange === 'week') {
                    return index % 24 === 0 ? value.split(' ')[0] : ''
                  }
                  return index % 72 === 0 ? `Day ${Math.floor(index / 24) + 1}` : ''
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(value) => `${value}ms`}
                domain={[0, 1500]}
                ticks={[0, 300, 600, 900, 1200, 1500]}
              />
              <Area
                type="monotone"
                dataKey="nameLookup"
                stroke="#8b5cf6"
                fill="url(#nameLookup)"
                strokeWidth={1.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="connection"
                stroke="#06b6d4"
                fill="url(#connection)"
                strokeWidth={1.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="tlsHandshake"
                stroke="#10b981"
                fill="url(#tlsHandshake)"
                strokeWidth={1.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="dataTransfer"
                stroke="#3b82f6"
                fill="url(#dataTransfer)"
                strokeWidth={1.5}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-start gap-6 mt-4 px-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-violet-500"></div>
            <span className="text-xs text-slate-400">Name lookup</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-cyan-500"></div>
            <span className="text-xs text-slate-400">Connection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-green-500"></div>
            <span className="text-xs text-slate-400">TLS handshake</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
            <span className="text-xs text-slate-400">Data transfer</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
