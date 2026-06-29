'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Home,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  FileText,
  BarChart3,
  Heart,
  HelpCircle,
} from 'lucide-react'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: ShoppingCart, label: 'My Orders', href: '/dashboard/orders' },
  { icon: Heart, label: 'Saved Services', href: '/dashboard/saved' },
  { icon: FileText, label: 'My Documents', href: '/dashboard/documents' },
  { icon: BarChart3, label: 'Activity', href: '/dashboard/activity' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  { icon: HelpCircle, label: 'Help & Support', href: '/dashboard/support' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-secondary rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold hidden sm:inline">akashworldwide</span>
          </Link>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-secondary rounded-lg">
              <User className="w-5 h-5" />
            </button>
            <Button variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border transform transition-transform duration-300 z-30 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 space-y-8">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-4">Menu</p>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href}>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary transition text-muted-foreground hover:text-foreground">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="border-t border-border pt-6">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">Need Help?</p>
              <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="pt-20 lg:ml-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
