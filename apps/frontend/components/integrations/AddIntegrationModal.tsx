"use client";

import axios from "axios";
import { use, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem } from "../ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface AddIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddIntegrationModal({
  open,
  onOpenChange,
  onSuccess,
}: AddIntegrationModalProps) {
  const [type, setType] = useState("EMAIL");
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/v1/integrations", {
        type,
        config,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onSuccess();
      onOpenChange(false);
      setConfig({});
    } catch (error) {
      console.error("Failed to create integration:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle>Add Integration</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Integration Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="WEBHOOK">Webhook</SelectItem>
                <SelectItem value="SLACK">Slack</SelectItem>
                <SelectItem value="DISCORD">Discord</SelectItem>
                <SelectItem value="TELEGRAM">Telegram</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "EMAIL" && (
            <div>
              <label>Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={config.email || ""}
                onChange={(e) =>
                  setConfig({
                    email: e.target.value,
                  })
                }
                className="bg-slate-800 border-slate-700"
                required
              />
            </div>
          )}

          {type === "WEBHOOK" && (
            <div>
              <Label>Webhook URL</Label>
              <Input
                type="url"
                placeholder="https://your-webhook-url.com"
                value={config.webhookUrl || ""}
                onChange={(e) => setConfig({ webhookUrl: e.target.value })}
                className="bg-slate-800 border-slate-700"
                required
              />
            </div>
          )}

          {type === "SLACK" && (
            <div>
              <Label>Slack Webhook URL</Label>
              <Input
                type="url"
                placeholder="https://hooks.slack.com/services/..."
                value={config.webhookUrl || ""}
                onChange={(e) => setConfig({ webhookUrl: e.target.value })}
                className="bg-slate-800 border-slate-700"
                required
              />
              <p className="text-xs text-slate-400 mt-1">
                Get your webhook URL from Slack App settings
              </p>
            </div>
          )}

          {type === "DISCORD" && (
            <div>
              <Label>Discord Webhook URL</Label>
              <Input
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={config.webhookUrl || ""}
                onChange={(e) => setConfig({ webhookUrl: e.target.value })}
                className="bg-slate-800 border-slate-700"
                required
              />
              <p className="text-xs text-slate-400 mt-1">
                Get your webhook URL from Discord Server Settings → Integrations
              </p>
            </div>
          )}

          {type === "TELEGRAM" && (
            <div className="space-y-3">
              <div>
                <Label>Bot Token</Label>
                <Input
                  type="text"
                  placeholder="123456:ABC-DEF..."
                  value={config.botToken || ""}
                  onChange={(e) =>
                    setConfig({ ...config, botToken: e.target.value })
                  }
                  className="bg-slate-800 border-slate-700"
                  required
                />
              </div>
              <div>
                <Label>Chat ID</Label>
                <Input
                  type="text"
                  placeholder="123456789"
                  value={config.chatId || ""}
                  onChange={(e) =>
                    setConfig({ ...config, chatId: e.target.value })
                  }
                  className="bg-slate-800 border-slate-700"
                  required
                />
              </div>
              <p className="text-xs text-slate-400">
                Create a bot with @BotFather and get your chat ID
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Integration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
