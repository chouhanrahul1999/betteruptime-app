"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChevronDown, Globe, Clock } from "lucide-react";

interface CreateMonitorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMonitorModal({
  open,
  onOpenChange,
}: CreateMonitorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 h-9 ">
          Create monitor
          <ChevronDown size={16} className="ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-950 border-zinc-800/50 text-white sm:max-w-[480px]">
        <DialogHeader className="space-y-3 pb-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-lg ring-1 ring-indigo-500/20">
              <Globe className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                Create Monitor
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-sm mt-1.5">
                Monitor your website uptime and performance
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2.5">
            <label className="text-sm font-medium text-slate-300 block">
              Website URL
            </label>
            <div className="relative">
              <Globe
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <Input
                placeholder="https://example.com"
                className="w-full bg-[#1a1c28] border-[#2a2d3a] text-white placeholder:text-gray-600 h-12 rounded-xl pl-11 pr-4"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3.5 bg-slate-800/40 rounded-lg border border-slate-700/50">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-sm text-slate-300">
              Checks every 3 minutes by default
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-slate-700 hover:bg-slate-800 text-white"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
              Create Monitor
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
