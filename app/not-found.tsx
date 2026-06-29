import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-6">
        <div>
          <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-3xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground mt-2">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="bg-card/40 border border-card/50 rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Here are some helpful links instead:
          </p>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Link href="/" className="flex-1">
              <Button variant="default" className="w-full">
                Go Home
              </Button>
            </Link>
            <Link href="/services" className="flex-1">
              <Button variant="outline" className="w-full">
                Browse Services
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Error Code: 404 | Page Not Found
        </p>
      </div>
    </main>
  )
}
