"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateMonitorModal } from "@/components/sections/CreateMonitorModal";
import { MonitorsTable } from "@/components/sections/MonitorsTable";
import { MonitorHeader } from "@/components/sections/MonitorHeader";
import { MonitorStats } from "@/components/sections/MonitorStats";
import { ResponseTimesChart } from "@/components/sections/ResponseTimesChart";
import { UptimeTable } from "@/components/sections/UptimeTable";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMonitors } from "@/hooks/use-monitors";
import { monitorApi } from "@/lib/api";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [monitorDetails, setMonitorDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { monitors, loading, error, reFetch } = useMonitors();
  const pathParts = pathname.split("/").filter(Boolean);
  const isMonitorView = pathParts[1] === "monitor";
  const monitorId = pathParts[2];
  const currentMonitor = monitors.find((m) => m.id === monitorId);

  useEffect(() => {
    if (isMonitorView && monitorId) {
      const fetchDetails = () => {
        monitorApi.getById(monitorId).then(setMonitorDetails);
      };

      setDetailsLoading(true);
      fetchDetails();
      setDetailsLoading(false);

      const interval = setInterval(fetchDetails, 180000); // 3 minutes

      return () => clearInterval(interval);
    }
  }, [isMonitorView, monitorId]);

  if (loading) {
    return (
      <div className="bg-slate-950 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading monitors...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-950 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (isMonitorView && currentMonitor) {
    return (
      <div className="bg-slate-950 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <MonitorHeader
            monitorName={currentMonitor.url}
            statusColor={currentMonitor.statusColor || "bg-green-500"}
            onBack={() => router.push("/dashboard")}
          />
          <MonitorStats data={monitorDetails} timeAdded={currentMonitor.time_added} />
          <ResponseTimesChart data={monitorDetails?.responseTimes} />
          <UptimeTable data={monitorDetails?.uptimeStats} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Monitors</h1>
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
          <CreateMonitorModal open={open} onOpenChange={setOpen} onSuccess={reFetch} />
        </div>
      </div>
      <MonitorsTable
        monitors={monitors}
        onCreateMonitor={() => setOpen(true)}
      />
    </div>
  );
}

