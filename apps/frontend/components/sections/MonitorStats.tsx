"use client";

import { Card, CardContent } from "@/components/ui/card";
import { calculateTotalUptime, formatTimestamp } from "@/lib/utils";
import { useState, useEffect } from "react";

interface MonitorsTableProps {
  data?: {
    ticks?: Array<{
      status: string;
      created_at: string;
    }>;
  };
  timeAdded?: string;
}

export function MonitorStats({ data, timeAdded }: MonitorsTableProps) {
  const [timeAgo, setTimeAgo] = useState("");

  const ticks = data?.ticks || [];
  const lastTick = ticks[0];
  const incidents = ticks.filter((t) => t.status === "Down").length;

  useEffect(() => {
    if (!lastTick) return;

    const updateTimer = () => {
      const now = new Date();
      const lastCheck = new Date(lastTick.created_at);
      const diffMs = now.getTime() - lastCheck.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const mins = Math.floor(diffSecs / 60);
      const secs = diffSecs % 60;

      setTimeAgo(`${mins}m ${secs}s ago`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [lastTick]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-[#1e2433] border-slate-700/50">
        <CardContent className="p-3.5">
          <p className="text-slate-400 text-sm mb-2">Currently up for</p>
          <p className="text-white text-lg font-semibold leading-tight">
            {timeAdded ? calculateTotalUptime(timeAdded) : "No data"}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-[#1e2433] border-slate-700/50">
        <CardContent className="p-3.5">
          <p className="text-slate-400 text-sm mb-2">Last checked at</p>
          <p className="text-white text-lg font-semibold">
            {lastTick ? timeAgo : "Never"}
          </p>
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
