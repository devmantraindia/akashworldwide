'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, Eye } from 'lucide-react'
import { useState } from 'react'

const allOrders = [
  {
    id: 'ORD-001',
    service: 'PAN Card',
    date: '2024-06-27',
    status: 'Completed',
    amount: '₹99',
    icon: '🎫',
    description: 'New PAN application processed'
  },
  {
    id: 'ORD-002',
    service: 'Aadhaar Update',
    date: '2024-06-25',
    status: 'Completed',
    amount: '₹0',
    icon: '👤',
    description: 'Address update completed'
  },
  {
    id: 'ORD-003',
    service: 'Passport Application',
    date: '2024-06-20',
    status: 'In Progress',
    amount: '₹2,499',
    icon: '📘',
    description: 'Document verification in progress'
  },
  {
    id: 'ORD-004',
    service: 'Voter ID',
    date: '2024-06-15',
    status: 'Completed',
    amount: '₹49',
    icon: '🗳️',
    description: 'Voter registration successful'
  },
  {
    id: 'ORD-005',
    service: 'Driving License',
    date: '2024-06-10',
    status: 'Processing',
    amount: '₹299',
    icon: '🚗',
    description: 'Awaiting RTO verification'
  },
]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  const statuses = ['All', 'Completed', 'In Progress', 'Processing']

  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.service.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 text-green-400'
      case 'In Progress':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'Processing':
        return 'bg-blue-500/20 text-blue-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Manage and track all your service orders</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search orders by ID or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card border-border text-foreground placeholder-muted-foreground pr-12"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        </div>

        <div className="flex flex-wrap gap-2">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                filterStatus === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-foreground border border-border hover:border-primary/50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-4xl">{order.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{order.service}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{order.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground">Order ID: <span className="text-foreground font-semibold">{order.id}</span></span>
                      <span className="text-muted-foreground">Date: <span className="text-foreground font-semibold">{order.date}</span></span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-primary mb-4">{order.amount}</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}
