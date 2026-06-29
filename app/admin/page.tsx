'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Users, ShoppingCart, TrendingUp, AlertCircle, CreditCard } from 'lucide-react'

export default function AdminDashboardPage() {
  const supabase = createClient()
  const [paymentStats, setPaymentStats] = useState({
    pendingCount: 0,
    totalPaid: 0,
    rejectedCount: 0,
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadPaymentStats()
    }
  }, [])

  async function loadPaymentStats() {
    try {
      if (!supabase) return

      // Get payment statistics
      const { data: pending, error: e1 } = await supabase
        .from('payments')
        .select('id', { count: 'exact' })
        .eq('payment_status', 'Pending Verification')
        .limit(0)

      if (e1) throw e1

      const { data: paid, error: e2 } = await supabase
        .from('payments')
        .select('id', { count: 'exact' })
        .eq('payment_status', 'Paid')
        .limit(0)

      if (e2) throw e2

      const { data: rejected, error: e3 } = await supabase
        .from('payments')
        .select('id', { count: 'exact' })
        .eq('payment_status', 'Rejected')
        .limit(0)

      if (e3) throw e3

      setPaymentStats({
        pendingCount: pending?.length || 0,
        totalPaid: paid?.length || 0,
        rejectedCount: rejected?.length || 0,
      })
    } catch (err) {
      console.error('[v0] Error loading payment stats:', err)
      // Set default stats on error
      setPaymentStats({
        pendingCount: 0,
        totalPaid: 0,
        rejectedCount: 0,
      })
    }
  }

  const stats = [
    { label: 'Total Users', value: '50K+', icon: Users, color: 'text-blue-500', trend: '+12% this month' },
    { label: 'Total Orders', value: '25K+', icon: ShoppingCart, color: 'text-green-500', trend: '+8% this month' },
    { label: 'Revenue', value: '₹45L', icon: TrendingUp, color: 'text-purple-500', trend: '+15% this month' },
    { label: 'Pending Payments', value: paymentStats.pendingCount.toString(), icon: CreditCard, color: 'text-yellow-500', trend: 'Needs verification' },
  ]

  const recentOrders = [
    { id: 'ORD-5234', user: 'Rajesh Kumar', service: 'PAN Card', amount: '₹99', status: 'Completed' },
    { id: 'ORD-5233', user: 'Priya Singh', service: 'Aadhaar', amount: '₹0', status: 'Processing' },
    { id: 'ORD-5232', user: 'Amit Patel', service: 'Passport', amount: '₹2,499', status: 'Completed' },
  ]

  const services = [
    { name: 'PAN Card', orders: 5230, revenue: '₹5.1L', status: 'Active' },
    { name: 'Aadhaar', orders: 12450, revenue: '₹0', status: 'Active' },
    { name: 'GST Registration', orders: 2340, revenue: '₹11.6L', status: 'Active' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your platform and track key metrics</p>
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
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <div>
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.user}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{order.service}</p>
                  <p className={`text-xs ${order.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-card border border-border rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Top Services</h2>
            <Link href="/admin/services">
              <Button variant="outline" size="sm">
                Manage <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.name} className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{service.name}</h3>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    {service.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Orders: {service.orders}</span>
                  <span>Revenue: {service.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-card/40 border-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-sm">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{paymentStats.pendingCount}</p>
            <p className="text-xs text-muted-foreground mt-2">Awaiting verification</p>
            <Link href="/admin/payments">
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Review Payments
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-sm">Verified Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">{paymentStats.totalPaid}</p>
            <p className="text-xs text-muted-foreground mt-2">Successfully verified</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-sm">Payment Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Configure UPI payment details</p>
            <Link href="/admin/payment-settings">
              <Button variant="outline" size="sm" className="w-full">
                Configure UPI
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-8">
        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          <Link href="/admin/services">
            <Button variant="outline" className="w-full justify-start">
              Add Service
            </Button>
          </Link>
          <Link href="/admin/payment-settings">
            <Button variant="outline" className="w-full justify-start">
              Payment Settings
            </Button>
          </Link>
          <Link href="/admin/payments">
            <Button variant="outline" className="w-full justify-start">
              Verify Payments
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button variant="outline" className="w-full justify-start">
              Analytics
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
