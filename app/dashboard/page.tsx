'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, TrendingUp, ShoppingCart, FileText, Zap } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    { label: 'Total Orders', value: '12', icon: ShoppingCart, color: 'text-blue-500' },
    { label: 'Saved Services', value: '5', icon: Zap, color: 'text-yellow-500' },
    { label: 'Documents', value: '8', icon: FileText, color: 'text-green-500' },
    { label: 'Savings', value: '₹4,200', icon: TrendingUp, color: 'text-purple-500' },
  ]

  const recentOrders = [
    {
      id: 1,
      service: 'PAN Card',
      date: '2 days ago',
      status: 'Completed',
      amount: '₹99',
      icon: '🎫',
    },
    {
      id: 2,
      service: 'Aadhaar Update',
      date: '5 days ago',
      status: 'Completed',
      amount: '₹0',
      icon: '👤',
    },
    {
      id: 3,
      service: 'Passport Application',
      date: '1 week ago',
      status: 'In Progress',
      amount: '₹2,499',
      icon: '📘',
    },
  ]

  const recommendedServices = [
    { name: 'Voter ID', icon: '🗳️', price: '₹49', description: 'Register to vote' },
    { name: 'Driving License', icon: '🚗', price: '₹299', description: 'Apply for DL' },
    { name: 'GST Registration', icon: '💼', price: '₹499', description: 'Business service' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, User! 👋</h1>
        <p className="text-muted-foreground">You have 3 pending tasks</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className={`p-2 bg-secondary rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
            </div>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Orders</h2>
          <Link href="/dashboard/orders">
            <Button variant="outline" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{order.icon}</div>
                <div>
                  <h3 className="font-semibold text-foreground">{order.service}</h3>
                  <p className="text-sm text-muted-foreground">{order.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.status === 'Completed'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {order.status}
                </span>
                <span className="font-bold text-primary">{order.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Services */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recommended Services</h2>
          <Link href="/services">
            <Button variant="outline" size="sm">
              Browse All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {recommendedServices.map((service) => (
            <div key={service.name} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition group cursor-pointer">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition">{service.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary">{service.price}</span>
                <Button size="sm" variant="outline">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/services">
            <Button variant="outline" className="w-full justify-start">
              Browse Services
            </Button>
          </Link>
          <Link href="/dashboard/documents">
            <Button variant="outline" className="w-full justify-start">
              View Documents
            </Button>
          </Link>
          <Button variant="outline" className="w-full justify-start">
            Track Order
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Download Invoice
          </Button>
        </div>
      </div>
    </div>
  )
}
