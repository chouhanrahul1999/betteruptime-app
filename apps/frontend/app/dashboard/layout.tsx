
"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/sections/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className={`${sidebarOpen ? 'w-[284px]' : 'w-[104px]'} transition-all duration-300 h-full overflow-y-auto`}>
        <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </aside>
      <main className="flex-1 h-full overflow-y-auto">
        {children}
      </main>
    </div>
  )
}