import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { RepositorySidebar } from "@/components/repository-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AuthProvider } from "@/components/auth-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardNav />
        <div className="flex-1 flex">
          <SidebarProvider>
            <RepositorySidebar />
            <main className="flex-1 p-6">{children}</main>
          </SidebarProvider>
        </div>
      </div>
    </AuthProvider>
  )
}
