import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-violet-600 flex items-center justify-center">
              <span className="font-bold text-white">OD</span>
            </div>
            <span className="font-bold text-xl">OneClick Docs</span>
          </div>
          <Button asChild>
            <Link href="/api/auth/login">
              <Github className="mr-2 h-4 w-4" />
              Login with GitHub
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 container py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight">Generate documentation for your codebase in one click</h1>
          <p className="text-muted-foreground text-lg">
            OneClick Docs uses AI to analyze your codebase and generate comprehensive documentation automatically.
          </p>
          <Button size="lg" asChild>
            <Link href="/api/auth/login">
              <Github className="mr-2 h-4 w-4" />
              Get Started with GitHub
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
