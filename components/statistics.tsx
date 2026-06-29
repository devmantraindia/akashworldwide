'use client'

import { useEffect, useState } from 'react'

export default function Statistics() {
  const [counts, setCounts] = useState({ services: 0, users: 0, partners: 0, rate: 0 })

  useEffect(() => {
    const targets = { services: 100, users: 50000, partners: 500, rate: 99.9 }
    const duration = 1500
    const step = 50

    let current = { services: 0, users: 0, partners: 0, rate: 0 }
    const interval = setInterval(() => {
      current.services = Math.min(current.services + targets.services / (duration / step), targets.services)
      current.users = Math.min(current.users + targets.users / (duration / step), targets.users)
      current.partners = Math.min(current.partners + targets.partners / (duration / step), targets.partners)
      current.rate = Math.min(current.rate + targets.rate / (duration / step), targets.rate)

      setCounts({
        services: Math.floor(current.services),
        users: Math.floor(current.users),
        partners: Math.floor(current.partners),
        rate: parseFloat(current.rate.toFixed(1)),
      })

      if (
        current.services >= targets.services &&
        current.users >= targets.users &&
        current.partners >= targets.partners &&
        current.rate >= targets.rate
      ) {
        clearInterval(interval)
      }
    }, step)

    return () => clearInterval(interval)
  }, [])

  const stats = [
    { label: 'Services', value: counts.services, suffix: '+' },
    { label: 'Happy Users', value: counts.users, suffix: 'K+' },
    { label: 'Partners', value: counts.partners, suffix: '+' },
    { label: 'Success Rate', value: counts.rate, suffix: '%' },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                {stat.value}
                {stat.suffix}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
