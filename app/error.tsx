'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-6">
        <div>
          <h1 className="text-6xl font-bold text-red-500 mb-2">500</h1>
          <h2 className="text-3xl font-bold">Something Went Wrong</h2>
          <p className="text-muted-foreground mt-2">
            We're sorry for the inconvenience. Our team has been notified of this issue.
          </p>
        </div>

        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-sm text-red-500/80 font-mono break-all">
            {error.digest && `Error ID: ${error.digest}`}
          </p>
        </div>

        <div className="flex gap-2 flex-col sm:flex-row">
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Go Home
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Error Code: 500 | Internal Server Error
        </p>
      </div>
    </main>
  )
}
