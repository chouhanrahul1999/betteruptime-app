"use client"

import { Shield, Calendar, Zap, Monitor, Activity, Radio, Grid2X2, ChevronRight, BarChart3, Bell, MessageCircle, Info, LayoutGrid, PanelLeftClose, CreditCard, SquareStack, User, Settings2, Grid2x2Plus, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const leftBarIcons = [
  { icon: LayoutGrid, active: false },
  { icon: Monitor, active: false },
  { icon: Settings2 , active: false },
]

const items = [
  { title: "Incidents", url: "/dashboard/incidents", icon: Shield },
  { title: "Escalation policies", url: "/dashboard/escalation", icon: Zap },
  { title: "Monitors", url: "/dashboard/monitors", icon: Monitor },
  { title: "Status pages", url: "/dashboard/status", icon: Radio },
  { title: "Integrations", url: "/dashboard/integrations", icon: Grid2x2Plus, hasSubmenu: true },
 
]

const bottomIcons = [
  { icon: Bell, hasNotification: true },
  { icon: Info, hasNotification: false },
  { icon: Users, hasNotification: false },
]

interface AppSidebarProps {
  isOpen?: boolean
  onToggle?: () => void
}

export function AppSidebar({ isOpen = true, onToggle }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="h-screen flex">
      {/* Left icon bar - Always visible */}
      <div className="w-[52px] bg-slate-900/50 flex flex-col items-center py-3 border-r border-slate-700/20 shadow-[2px_0_12px_rgba(0,0,0,0.4)]">
        {/* Top app icons */}
        <div className="flex flex-col items-center gap-2 mb-auto">
          {leftBarIcons.map((item, idx) => (
            <button
              key={idx}
              className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${
                item.active
                  ? 'bg-indigo-600 text-white'
                  : 'bg-transparent text-slate-400 hover:bg-slate-700/50'
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
          {/* User avatar */}
          <button className="w-9 h-9 bg-lenear-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white mt-1">
            <User size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Main sidebar - Collapsible */}
      <div className={`bg-slate-900/30 flex flex-col relative border-r border-slate-700/20 shadow-[2px_0_16px_rgba(0,0,0,0.3)] ${isOpen ? 'w-[230px]' : 'w-[50px]'}`}>
        {/* Header */}
        {isOpen && (
          <div className="h-[52px] flex items-center justify-between px-4">
            <span className="text-white font-semibold text-base">Uptime</span>
            <button onClick={onToggle} className="text-slate-400 hover:text-slate-300 transition-colors">
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
              <PanelLeftClose size={16} strokeWidth={2} className="rotate-180" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto py-3`}>
          <div className={`flex flex-col ${isOpen ? 'px-3 gap-1' : 'items-center gap-3 px-2'}`}>
            {items.map((item) => {
              const isActive = pathname === item.url
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`flex items-center justify-between text-sm rounded-md transition-colors group ${
                    isOpen ? 'h-9 px-3' : 'w-9 h-9 justify-center'
                  } ${isActive ? 'bg-slate-700/70 text-white' : 'text-slate-200 hover:bg-slate-700/50'}`}
                >
                  <div className={`flex items-center ${isOpen ? 'gap-3' : ''}`}>
                    <item.icon size={18} strokeWidth={1.5} className="text-slate-400" />
                    {isOpen && <span>{item.title}</span>}
                  </div>
                  {isOpen && item.hasSubmenu && <ChevronRight size={14} strokeWidth={2} className="text-slate-500" />}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}