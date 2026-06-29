'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useState } from 'react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-xl font-bold hidden sm:inline">akashworldwide</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#services" className="text-sm text-muted-foreground hover:text-foreground transition">
              Services
            </Link>
            <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition">
              Testimonials
            </Link>
            <Link href="#blog" className="text-sm text-muted-foreground hover:text-foreground transition">
              Blog
            </Link>
            <Link href="#partners" className="text-sm text-muted-foreground hover:text-foreground transition">
              Partners
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-secondary rounded-lg transition">
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 dark:hidden" />
            </button>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Sign Up
              </Button>
            </Link>
            <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="#services" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
              Services
            </Link>
            <Link href="#testimonials" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
              Testimonials
            </Link>
            <Link href="#blog" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
              Blog
            </Link>
            <Link href="#partners" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
              Partners
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
