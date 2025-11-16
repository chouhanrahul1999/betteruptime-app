"use client";

import axios from "axios";
import {
  Mail,
  Webhook,
  MessageSquare,
  Hash,
  Send,
  Trash2,
  Power,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

const ICONS = {
  EMAIL: Mail,
  WEBHOOK: Webhook,
  SLACK: MessageSquare,
  DISCORD: Hash,
  TELEGRAM: Send,
};

interface IntegrationCardProps {
  integration: any;
  onUpdate: () => void;
}

export function IntegrationCard({
  integration,
  onUpdate,
}: IntegrationCardProps) {
  const Icon = ICONS[integration.type as keyof typeof ICONS];

  const handleToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/api/v1/integrations/${integration.id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUpdate();
    } catch (error) {
      console.error("Failed to toggle integration:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete theis integration?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/api/v1/integrations/${integration.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        onUpdate();
      } catch (error) {
        console.error("Failed to delete integration:", error);
      }
    }
  };
  return (
    <Card className="bg-slate-900/60 border-slate-700/50 px-6">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-slate-800/90 rounded-lg flex items-center justify-center">
            <Icon size={24} className="text-slate-300" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{integration.type}</h3>
            <p className="text-sm text-slate-400">
              {integration.enabled ? "Active" : "Disabled"}
            </p>
          </div>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${
            integration.enabled ? "bg-green-500" : "bg-slate-600"
          }`}
        />
      </div>
      <div className="text-sm text-slate-400 mb-2">
        {integration.type === "EMAIL" && `Email: ${integration.config.email}`}
        {integration.type === "WEBHOOK" &&
          `URL: ${integration.config.webhookUrl}`}
        {integration.type === "SLACK" && "Slack Workspace"}
        {integration.type === "DISCORD" && "Discord Server"}
        {integration.type === "TELEGRAM" && "Telegram Bot"}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggle}
          className="flex-1"
        >
          <Power size={14} className="mr-2" />
          {integration.enabled ? "Disable" : "Enable"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </Card>
  );
}
