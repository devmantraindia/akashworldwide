'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useState } from 'react'

const allServices = [
  { id: 1, name: 'PAN Card', category: 'Documentation', price: '₹99', orders: 5230, status: 'Active' },
  { id: 2, name: 'Aadhaar Services', category: 'Identification', price: '₹0', orders: 12450, status: 'Active' },
  { id: 3, name: 'Voter ID', category: 'Voting', price: '₹49', orders: 3420, status: 'Active' },
  { id: 4, name: 'Driving License', category: 'Transportation', price: '₹299', orders: 2150, status: 'Active' },
  { id: 5, name: 'Passport', category: 'Travel', price: '₹2,499', orders: 1890, status: 'Active' },
]

export default function AdminServicesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [services, setServices] = useState(allServices)

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Services Management</h1>
          <p className="text-muted-foreground">Manage all platform services</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-card border-border text-foreground placeholder-muted-foreground pr-12"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
      </div>

      {/* Services Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Service Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Orders</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service, index) => (
                <tr
                  key={service.id}
                  className={`border-b border-border hover:bg-secondary/30 transition ${
                    index === filteredServices.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-6 py-4 font-semibold">{service.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{service.category}</td>
                  <td className="px-6 py-4 font-semibold">{service.price}</td>
                  <td className="px-6 py-4 text-muted-foreground">{service.orders}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-secondary rounded-lg transition">
                        <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                      <button className="p-2 hover:bg-secondary rounded-lg transition">
                        <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                      <button className="p-2 hover:bg-secondary rounded-lg transition">
                        <Trash2 className="w-4 h-4 text-red-500 hover:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
