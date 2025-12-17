'use client'

import { TopBar } from './TopBar'
import { Sidebar } from './sidebar-new'
import { GlobalBackground } from './GlobalBackground'
import { EdgeNavigator } from './EdgeNavigator'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen relative">
      {/* Global Animated Background */}
      <GlobalBackground />

      {/* Top Navigation Bar */}
      <TopBar />

      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Left Edge Navigation Indicator */}
      <EdgeNavigator />

      {/* Main Content */}
      <main className="relative pt-16 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}