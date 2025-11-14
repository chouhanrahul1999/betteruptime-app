"use client";

import {
  Shield,
  Zap,
  SlidersHorizontal,
  Radio,
  LayoutDashboard,
  ChevronRight,
  Bell,
  Info,
  ArrowDownWideNarrow,
  PanelLeftClose,
  GalleryVerticalEnd,
  Globe,
  SquareTerminal,
  Grid2x2Plus,
  TriangleAlert,
  Columns3Cog,
  Users,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  hasSubmenu?: boolean;
}

const items: MenuItem[] = [
  { title: "Incidents", url: "/dashboard/incidents", icon: Shield },
  { title: "Escalation policies", url: "/dashboard/escalation", icon: ArrowDownWideNarrow },
  { title: "Monitors", url: "/dashboard/monitors", icon: Globe },
  { title: "Status pages", url: "/dashboard/status", icon: Radio },
  {
    title: "Integrations",
    url: "/dashboard/integrations",
    icon: Grid2x2Plus,
    hasSubmenu: true,
  },
];

const Dashboard: MenuItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: GalleryVerticalEnd },
  { title: "Logs & traces", url: "/dashboard/logs", icon: SquareTerminal },
  { title: "Alert", url: "/dashboard/monitors", icon: TriangleAlert },
];

const Setting: MenuItem[] = [
  { title: "Settings", url: "/dashboard/settings", icon: Columns3Cog },
];

const bottomIcons = [
  { icon: Bell, hasNotification: true },
  { icon: Info, hasNotification: false },
  { icon: Users, hasNotification: false },
];

interface AppSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AppSidebar({ isOpen = true, onToggle }: AppSidebarProps) {
  const pathname = usePathname();
  const [activeView, setActiveView] = useState<'dashboard' | 'items' | 'settings'>('items');

  const leftBarIcons = [
    { icon: LayoutDashboard, view: 'dashboard' as const },
    { icon: Zap, view: 'items' as const },
    { icon: SlidersHorizontal, view: 'settings' as const },
  ];

  const getCurrentItems = (): MenuItem[] => {
    switch (activeView) {
      case 'dashboard':
        return Dashboard;
      case 'settings':
        return Setting;
      default:
        return items;
    }
  };

  const getTitle = (): string => {
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard';
      case 'settings':
        return 'Settings';
      default:
        return 'Uptime';
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left icon bar - Always visible */}
      <div className="w-[52px] bg-slate-900/10 flex flex-col items-center py-3 border-r border-slate-700/20 shadow-[2px_0_12px_rgba(0,0,0,0.4)]">
        {/* Top app icons */}
        <div className="flex flex-col items-center gap-2 mb-auto">
          {leftBarIcons.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveView(item.view)}
              className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${
                activeView === item.view
                  ? "bg-slate-700/50 text-white"
                  : "bg-transparent text-slate-400 hover:bg-slate-700/50"
              }`}
            >
              <item.icon size={18} strokeWidth={2} />
            </button>
          ))}
        </div>

        {/* Bottom utility icons */}
        <div className="flex flex-col items-center gap-2 mb-3">
          {bottomIcons.map((item, idx) => (
            <button
              key={idx}
              className="relative w-9 h-9 rounded-md flex items-center justify-center bg-transparent text-slate-400 hover:bg-slate-700/50 transition-colors"
            >
              <item.icon size={18} strokeWidth={2} />
              {item.hasNotification && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main sidebar - Collapsible */}
      <div
        className={`bg-slate-900/25 flex flex-col relative border-r border-slate-700/20 shadow-[2px_0_16px_rgba(0,0,0,0.3)] ${isOpen ? "w-[230px]" : "w-[50px]"}`}
      >
        {/* Header */}
        {isOpen && (
          <div className="h-[52px] flex items-center justify-between px-4">
            <span className="text-white font-semibold text-base">{getTitle()}</span>
            <button
              onClick={onToggle}
              className="text-slate-400 hover:text-slate-300 transition-colors"
            >
              <PanelLeftClose size={16} strokeWidth={2} />
            </button>
          </div>
        )}

        {/* Collapse button when collapsed */}
        {!isOpen && (
          <div className="h-[52px] flex items-center justify-center">
            <button
              onClick={onToggle}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <PanelLeftClose
                size={16}
                strokeWidth={2}
                className="rotate-180"
              />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto py-3`}>
          <div
            className={`flex flex-col ${isOpen ? "px-3 gap-1" : "items-center gap-3 px-2"}`}
          >
            {getCurrentItems().map((item) => {
              const isActive = pathname === item.url;
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`flex items-center justify-between text-sm rounded-md transition-colors group ${
                    isOpen ? "h-9 px-3" : "w-9 h-9 justify-center"
                  } ${isActive ? "bg-slate-700/70 text-white" : "text-slate-200 hover:bg-slate-700/50"}`}
                >
                  <div className={`flex items-center ${isOpen ? "gap-4" : ""}`}>
                    <item.icon
                      size={18}
                      strokeWidth={1.5}
                      className="text-slate-400"
                    />
                    {isOpen && <span>{item.title}</span>}
                  </div>
                  {isOpen && 'hasSubmenu' in item && item.hasSubmenu && (
                    <ChevronRight
                      size={14}
                      strokeWidth={2}
                      className="text-slate-500"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
