import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BACK_URL="http://localhost:3000/api/v1"

export interface Moniter {
  id: string
  url: string
  time_added: string
  status?: 'up' | 'down' | 'unknown'
  uptime?: string
  statusColor?: string
}

export interface MonitorTicks {
  id: string
  response_time_ms: number
  status: 'up' | 'Down' | 'Unknown'
  created_at: string
}

export function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export function calculateUptime(ticks: any[]): string {
  if (!ticks?.length) return "No data";
  
  const firstUpTick = ticks.find(t => t.status === "up");
  if (!firstUpTick) return "Down";
  
  const now = new Date();
  const start = new Date(firstUpTick.created_at);
  const diffMs = now.getTime() - start.getTime();
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
  return `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
}


export function calculateTotalUptime(timeAdded: string): string {
  const now = new Date();
  const added = new Date(timeAdded);
  const diffMs = now.getTime() - added.getTime();
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return `${hours} hours ${minutes} minutes ${seconds} seconds`;
}

export function formatTimestamp(date: string | Date): string {
  return new Date(date).toLocaleString();
}

