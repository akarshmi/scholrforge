import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <span className="text-primary">S</span>
              </div>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                scholrforge
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="px-4 py-2 text-muted-foreground hover:text-foreground transition">
                Sign In
              </Link>
              <Link href="/register" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Showcase Your{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Academic Excellence
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover, share, and collaborate on groundbreaking academic projects. Join thousands of students building the future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium">
              Get Started Free
            </Link>
            <Link href="/explore" className="px-8 py-3 border border-border rounded-lg hover:bg-card transition font-medium">
              Explore Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
            <p className="text-muted-foreground">Active Students</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary mb-2">2,500+</div>
            <p className="text-muted-foreground">Projects Shared</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">45K+</div>
            <p className="text-muted-foreground">Downloads</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 scholrforge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
