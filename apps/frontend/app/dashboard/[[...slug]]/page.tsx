"use client";

import { Plus, Search } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { IntegrationsPage } from "@/components/integrations/IntegrationsPage";
import { DashboardPage } from "@/components/sections/DashboardPage";
import { LogsTracesPage } from "@/components/sections/LogsTracesPage";
import { AlertPage } from "@/components/sections/AlertPage";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [monitorDetails, setMonitorDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { monitors, loading, error, reFetch } = useMonitors();
  const pathParts = pathname.split("/").filter(Boolean);
  const isMonitorView = pathParts[1] === "monitor";
  const isDashboardView = pathParts.length === 1; // /dashboard only
  const monitorId = pathParts[2];
  const currentMonitor = monitors.find((m) => m.id === monitorId);
  const isEscalationView = pathParts[1] === "escalation";
  const isIncidentsView = pathParts[1] === "incidents";
  const isStatusPageView = pathParts[1] === "status";
  const isIntegrationsView = pathParts[1] === "integrations";
  const isLogsView = pathParts[1] === "logs";
  const isAlertView = pathParts[1] === "alerts";

  useEffect(() => {
    if (isMonitorView && monitorId) {
      const fetchDetails = async () => {
        setDetailsLoading(true);
        try {
          const data = await monitorApi.getById(monitorId);
          setMonitorDetails(data);
        } catch (err) {
          console.error('Failed to fetch monitor details:', err);
        } finally {
          setDetailsLoading(false);
        }
      };

      fetchDetails();
      const interval = setInterval(fetchDetails, 180000);
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
  if (isEscalationView) {
    return (
      <div className="bg-slate-950 text-white p-8">
       
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold"> Escalation Policies </h1>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Plus size={16} className="mr-2" />
            Add Escalation Policy
          </Button>
        </div>
      </div>
    </div>
    );
  }

  if (isIncidentsView) {
    return (
      <div className="bg-slate-950 text-white p-8">
       
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Incidents </h1>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Plus size={16} className="mr-2" />
              Add Incident
            </Button>
          </div>
        </div>
      </div>
    );
  }
  if (isDashboardView) {
    return (
      <DashboardPage 
        monitors={monitors} 
        onCreateMonitor={() => setOpen(true)}
        onRefresh={reFetch}
      />
    );
  }

  if (isStatusPageView) {
    return (
      <div className="bg-slate-950 text-white p-8">
       
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Status Page </h1>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Plus size={16} className="mr-2" />
              Add Status Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isIntegrationsView) {
    return (
     <IntegrationsPage />
    );
  }
  
  if (isLogsView) {
    return (
      <LogsTracesPage monitors={monitors} />
    );
  }
  
  if (isAlertView) {
    return (
      <AlertPage monitors={monitors} />
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
          <ResponseTimesChart data={monitorDetails} />
          <UptimeTable data={monitorDetails} />
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
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add Monitor
          </Button>
          <CreateMonitorModal open={open} onOpenChange={setOpen} onSuccess={reFetch} />
        </div>
      </div>
      <MonitorsTable
        monitors={monitors}
        onCreateMonitor={() => setOpen(true)}
        onRefresh={reFetch}
      />
    </div>
  );
}

