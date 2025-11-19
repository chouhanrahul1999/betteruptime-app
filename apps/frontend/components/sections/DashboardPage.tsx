"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { MonitorsTable } from "@/components/sections/MonitorsTable";
import { UptimeTable } from "@/components/sections/UptimeTable";
import { MultiWebsiteChart } from "@/components/sections/MultiWebsiteChart";
import { CreateMonitorModal } from "@/components/sections/CreateMonitorModal";
import { useState, useEffect } from "react";
import { monitorApi } from "@/lib/api";

interface Monitor {
  id: string;
  name: string;
  url: string;
  time_added: string;
  status: "up" | "down" | "unknown";
  uptime: string;
  statusColor: string;
  interval: string;
}

interface DashboardPageProps {
  monitors: Monitor[];
  onCreateMonitor: () => void;
  onRefresh: () => void;
}

export function DashboardPage({ monitors, onCreateMonitor, onRefresh }: DashboardPageProps) {
  const router = useRouter();
  const recentMonitors = monitors.slice(-5).reverse();
  const [allTicks, setAllTicks] = useState<any[]>([]);
  const [allMonitorDetails, setAllMonitorDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchAllMonitorData = async () => {
      if (monitors.length === 0) return;
      
      setLoading(true);
      try {
        const allMonitorDetails = await Promise.all(
          monitors.map(monitor => monitorApi.getById(monitor.id))
        );
        
        const aggregatedTicks = allMonitorDetails.flatMap(data => 
          data.ticks?.map((tick: any) => ({
            status: tick.status,
            created_at: tick.created_at
          })) || []
        );
        
        setAllTicks(aggregatedTicks);
        setAllMonitorDetails(allMonitorDetails);
      } catch (error) {
        console.error('Failed to fetch monitor details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMonitorData();
  }, [monitors]);

  return (
    <div className="bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />
              <Input
                placeholder="Search"
                className="pl-9 pr-10 w-64 h-9 bg-[#252b3b] border-slate-700/50 text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-slate-600"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs text-slate-500 bg-slate-700/50 rounded border border-slate-600/50">
                /
              </kbd>
            </div>
            <Button 
              onClick={() => setOpen(true)}
            >
              Add Monitor
              <Plus size={16} className="ml-2" />
            </Button>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Monitors</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/dashboard/monitors')}
            >
              View All
            </Button>
          </div>
          
          {recentMonitors.length > 0 ? (
            <MonitorsTable 
              monitors={recentMonitors} 
              onCreateMonitor={() => setOpen(true)}
              onRefresh={onRefresh}
            />
          ) : (
            <div className="bg-[#1a1f2e] rounded-lg border border-slate-700/50">
              <div className="text-center py-8 text-slate-400">
                <p>No monitors yet</p>
              </div>
            </div>
          )}
        </div>

        {monitors.length > 0 && (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Response Times Overview</h2>
              </div>
              {loading ? (
                <div className="text-center py-8 text-slate-400">Loading response times...</div>
              ) : (
                <MultiWebsiteChart 
                  monitors={monitors} 
                  allMonitorDetails={allMonitorDetails} 
                />
              )}
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Overall Uptime Statistics</h2>
              </div>
              {loading ? (
                <div className="text-center py-8 text-slate-400">Loading uptime data...</div>
              ) : (
                <UptimeTable data={{ ticks: allTicks }} />
              )}
            </div>
          </>
        )}
        
        <CreateMonitorModal 
          open={open} 
          onOpenChange={setOpen} 
          onSuccess={() => {
            onRefresh();
            setOpen(false);
          }} 
        />
      </div>
    </div>
  );
}