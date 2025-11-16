"use client";

import { useState, useEffect, useMemo } from "react";
import { Bell, Mail, MessageSquare, Send, Webhook, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { monitorApi } from "@/lib/api";

interface Monitor {
  id: string;
  name: string;
  url: string;
}

interface AlertLog {
  id: string;
  monitorName: string;
  monitorUrl: string;
  alertType: 'down';
  notificationChannel: 'email' | 'slack' | 'discord' | 'telegram' | 'webhook';
  timestamp: string;
  status: 'sent' | 'failed' | 'pending';
  message: string;
  recipient?: string;
  responseTime?: number;
}

interface AlertPageProps {
  monitors: Monitor[];
}

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'email': return <Mail size={16} />;
    case 'slack': return <MessageSquare size={16} />;
    case 'discord': return <MessageSquare size={16} />;
    case 'telegram': return <Send size={16} />;
    case 'webhook': return <Webhook size={16} />;
    default: return <Bell size={16} />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'sent': return <CheckCircle size={16} className="text-green-400" />;
    case 'failed': return <XCircle size={16} className="text-red-400" />;
    case 'pending': return <Clock size={16} className="text-yellow-400" />;
    default: return <AlertCircle size={16} className="text-slate-400" />;
  }
};

export function AlertPage({ monitors }: AlertPageProps) {
  const [alerts, setAlerts] = useState<AlertLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'sent' | 'failed' | 'pending'>('all');

  useEffect(() => {
    const fetchAlertLogs = async () => {
      if (monitors.length === 0) return;
      
      setLoading(true);
      try {
        const notificationLogs = await monitorApi.getNotificationLogs();
        
        const alertLogs: AlertLog[] = notificationLogs.map((log: any) => {
          const monitor = monitors.find(m => m.id === log.payload?.websiteId);
          const integrationType = log.integration?.type?.toLowerCase() || 'email';
          
          return {
            id: log.id,
            monitorName: monitor?.name || log.payload?.url || 'Unknown',
            monitorUrl: log.payload?.url || monitor?.url || '',
            alertType: 'down',
            notificationChannel: integrationType === 'email' ? 'email' : 
                               integrationType === 'slack' ? 'slack' :
                               integrationType === 'discord' ? 'discord' :
                               integrationType === 'telegram' ? 'telegram' : 'webhook',
            timestamp: log.sent_at,
            status: log.status?.toLowerCase() === 'sent' ? 'sent' : 
                   log.status?.toLowerCase() === 'failed' ? 'failed' : 'pending',
            message: `🚨 ${monitor?.name || log.payload?.url} is DOWN - Website is not responding`,
            recipient: integrationType === 'email' ? log.integration?.config?.email || 'admin@example.com' : '#alerts',
            responseTime: log.payload?.responseTime || 0
          };
        });
        
        alertLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setAlerts(alertLogs);
      } catch (error) {
        console.error('Failed to fetch notification logs:', error);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlertLogs();
  }, [monitors]);

  const filteredAlerts = useMemo(() => {
    if (filter === 'all') return alerts;
    return alerts.filter(alert => alert.status === filter);
  }, [alerts, filter]);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getAlertTypeColor = (type: string) => {
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Alert Notifications</h1>
          <div className="flex items-center gap-3">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'sent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('sent')}
            >
              Sent
            </Button>
            <Button
              variant={filter === 'failed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('failed')}
            >
              Failed
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pending
            </Button>
          </div>
        </div>

        <div className="bg-[#1a1f2e] rounded-lg border border-slate-700/50">
          <div className="px-4 py-2 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center text-slate-300">
              <div className="flex items-center gap-1.5">
                <Bell size={14} className="text-slate-500" />
                <span className="text-sm font-medium text-white">Notification History</span>
              </div>
            </div>
          </div>
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading alerts...</div>
            ) : filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Bell size={48} className="mx-auto mb-4 opacity-50" />
                <p>No alert notifications found</p>
                <p className="text-sm mt-2">Notifications will appear here when triggered</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className="px-4 py-3.5 hover:bg-slate-700/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-2 h-2 rounded-full shrink-0 bg-red-500"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-white font-normal text-[15px] leading-tight">{alert.monitorName}</div>
                            <Badge className={`text-xs px-2 py-0.5 ${getAlertTypeColor(alert.alertType)}`}>
                              DOWN
                            </Badge>
                          </div>
                          <div className="text-slate-400 text-xs leading-tight">
                            {alert.message}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-slate-400 text-sm">
                        <div className="flex items-center gap-1.5">
                          {getChannelIcon(alert.notificationChannel)}
                          <span className="capitalize text-xs">{alert.notificationChannel}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(alert.status)}
                          <span className={`text-xs ${
                            alert.status === 'sent' ? 'text-green-400' :
                            alert.status === 'failed' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {alert.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatDateTime(alert.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}