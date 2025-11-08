import { monitorApi } from "@/lib/api";
import { useEffect, useState } from "react";

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
function calculateUptime(timeAdded: string): string {
  const now = new Date();
  const added = new Date(timeAdded);
  const diff = now.getTime() - added.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function useMonitors() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonitors = async () => {
    try {
      setLoading(true);
      const websites = await monitorApi.getAll();


      const formattedMonitors = websites.map((website: any) => {
        const latestTick = website.ticks?.[0];
        const tickStatus = latestTick?.status?.toLowerCase() || "unknown";

        return {
          id: website.id,
          name: website.url,
          url: website.url,
          time_added: website.time_added,
          status: tickStatus,
          uptime: calculateUptime(website.time_added),
          statusColor:
            tickStatus === "up"
              ? "bg-green-500"
              : tickStatus === "down"
                ? "bg-red-500"
                : "bg-gray-500",
          interval: "3m",
        };
      });

      setMonitors(formattedMonitors);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch data from backend"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  return { monitors, loading, error, reFetch: fetchMonitors };
}
