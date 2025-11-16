"use client";

import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, Clock, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { monitorApi } from "@/lib/api";

interface Monitor {
  id: string;
  name: string;
  url: string;
}

interface DowntimeLog {
  id: string;
  monitorName: string;
  monitorUrl: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  status: 'ongoing' | 'resolved';
  reason?: string;
}

interface LogsTracesPageProps {
  monitors: Monitor[];
}

export function LogsTracesPage({ monitors }: LogsTracesPageProps) {
  const [logs, setLogs] = useState<DowntimeLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'resolved'>('all');

  useEffect(() => {
    const fetchDowntimeLogs = async () => {
      if (monitors.length === 0) return;
      
      setLoading(true);
      try {
        const allMonitorDetails = await Promise.all(
          monitors.map(monitor => monitorApi.getById(monitor.id))
        );
        
        const downtimeLogs: DowntimeLog[] = [];
        
        allMonitorDetails.forEach((data, index) => {
          const monitor = monitors[index];
          const ticks = data?.ticks || [];
          
          // Find downtime periods
          let downtimeStart: string | null = null;
          
          ticks.forEach((tick: any, tickIndex: number) => {
            if (tick.status === 'down' && !downtimeStart) {
              downtimeStart = tick.created_at;
            } else if (tick.status === 'up' && downtimeStart) {
              const duration = Math.floor((new Date(tick.created_at).getTime() - new Date(downtimeStart).getTime()) / (1000 * 60));
              
              downtimeLogs.push({
                id: `${monitor.id}-${downtimeStart}`,
                monitorName: monitor.name,
                monitorUrl: monitor.url,
                startTime: downtimeStart,
                endTime: tick.created_at,
                duration,
                status: 'resolved',
                reason: 'Connection timeout'
              });
              
              downtimeStart = null;
            }
          });
          
          // Check for ongoing downtime
          if (downtimeStart) {
            const duration = Math.floor((new Date().getTime() - new Date(downtimeStart).getTime()) / (1000 * 60));
            downtimeLogs.push({
              id: `${monitor.id}-${downtimeStart}-ongoing`,
              monitorName: monitor.name,
              monitorUrl: monitor.url,
              startTime: downtimeStart,
              duration,
              status: 'ongoing',
              reason: 'Connection timeout'
            });
          }
        });
        
        // Sort by start time (most recent first)
        downtimeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        setLogs(downtimeLogs);
      } catch (error) {
        console.error('Failed to fetch downtime logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDowntimeLogs();
  }, [monitors]);

  const filteredLogs = useMemo(() => {
    if (filter === 'all') return logs;
    return logs.filter(log => log.status === filter);
  }, [logs, filter]);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Logs & Traces</h1>
          <div className="flex items-center gap-3">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'ongoing' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('ongoing')}
            >
              Ongoing
            </Button>
            <Button
              variant={filter === 'resolved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('resolved')}
            >
              Resolved
            </Button>
          </div>
        </div>

        <Card className="bg-[#1e2433] border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-slate-200 text-lg font-medium flex items-center gap-2">
              <AlertTriangle size={20} />
              Downtime Incidents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading logs...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
                <p>No downtime incidents found</p>
                <p className="text-sm mt-2">Your websites are running smoothly!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-800/30">
                      <th className="text-left text-slate-400 font-normal px-6 py-3.5">Website</th>
                      <th className="text-left text-slate-400 font-normal px-6 py-3.5">Status</th>
                      <th className="text-left text-slate-400 font-normal px-6 py-3.5">Start Time</th>
                      <th className="text-left text-slate-400 font-normal px-6 py-3.5">End Time</th>
                      <th className="text-left text-slate-400 font-normal px-6 py-3.5">Duration</th>
                      <th className="text-left text-slate-400 font-normal px-6 py-3.5">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-800/20">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-white font-medium">{log.monitorName}</div>
                            <div className="text-slate-400 text-sm">{log.monitorUrl}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant={log.status === 'ongoing' ? 'destructive' : 'secondary'}
                            className={log.status === 'ongoing' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}
                          >
                            {log.status === 'ongoing' ? 'Ongoing' : 'Resolved'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-500" />
                            {formatDateTime(log.startTime)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {log.endTime ? (
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-slate-500" />
                              {formatDateTime(log.endTime)}
                            </div>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Clock size={14} className="text-slate-500" />
                            {formatDuration(log.duration)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {log.reason || 'Unknown'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}