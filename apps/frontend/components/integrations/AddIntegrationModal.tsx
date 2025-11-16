"use client";

import axios from "axios";
import { use, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Mail, Webhook } from "lucide-react";
import { FaDiscord, FaSlack, FaTelegram } from "react-icons/fa";

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
      await axios.post(
        "http://localhost:3000/api/v1/integrations",
        {
          type,
          config,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      <DialogContent className="bg-slate-900/70 text-white border-slate-700/50">
        <DialogHeader>
          <DialogTitle className="font-sans tracking-wide text-2xl pb-3">Add Integration</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 font-sans tracking-wide">
            <Label className="pl-1 pb-1">Integration Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="EMAIL">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </div>
                </SelectItem>
                <SelectItem value="WEBHOOK">
                  <div className="flex items-center gap-2">
                    <Webhook className="w-4 h-4" /> Webhook
                  </div>
                </SelectItem>
                <SelectItem value="SLACK">
                  <div className="flex items-center gap-2">
                    <FaSlack className="w-4 h-4" /> Slack
                  </div>
                </SelectItem>
                <SelectItem value="DISCORD">
                  <div className="flex items-center gap-2">
                    <FaDiscord className="w-4 h-4" /> Discord
                  </div>
                </SelectItem>
                <SelectItem value="TELEGRAM">
                  <div className="flex items-center gap-2">
                    <FaTelegram className="w-4 h-4" /> Telegram
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "EMAIL" && (
            <div className="space-y-2">
              <Label className="pl-1 pb-1">Email Address</Label>
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
            <div className="space-y-2">
              <Label className="pl-1 pb-1">Webhook URL</Label>
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
            <div className="space-y-2">
              <Label className="pl-1 pb-1">Slack Webhook URL</Label>
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
            <div className="space-y-2">
              <Label className="pl-1 pb-1">Discord Webhook URL</Label>
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

          <div className="flex gap-3 pt-4">
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
