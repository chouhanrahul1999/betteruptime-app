"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { IntegrationCard } from "./IntegrationCard";
import { AddIntegrationModal } from "./AddIntegrationModal";

export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchIntegrations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/v1/integrations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIntegrations(res.data);
    } catch (error) {
      console.error("Failed to fetch integrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-950 text-white p-8">
        <div className="text-center">Loading integrations...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-white p-8 ">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-sans tracking-wider font-bold">Integrations</h1>
          <p className="text-slate-400 font-sans tracking-wide mt-2">
            Connect your notification channels
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Integration
        </Button>
      </div>

      {integrations.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p>No integrations configured yet.</p>
          <p className="mt-2">Click "Add Integration" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration: any) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onUpdate={fetchIntegrations}
            />
          ))}
        </div>
      )}

      <AddIntegrationModal
        open={open}
        onOpenChange={setOpen}
        onSuccess={fetchIntegrations}
      />
    </div>
  );
}
