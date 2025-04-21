"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FolderGit2, Plus } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInput,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupAction,
  SidebarTrigger,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import type { Repository } from "@/lib/github"

export function RepositorySidebar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRepositories() {
      try {
        setLoading(true)
        const response = await fetch("/api/repositories")

        if (!response.ok) {
          throw new Error("Failed to fetch repositories")
        }

        const data = await response.json()
        setRepositories(data.repositories || [])
        setError(null)
      } catch (error) {
        console.error("Error fetching repositories:", error)
        setError("Failed to load repositories")
      } finally {
        setLoading(false)
      }
    }

    fetchRepositories()
  }, [])

  const filteredRepos = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleRepoClick = (repo: Repository) => {
    router.push(`/dashboard/repo/${repo.owner.login}/${repo.name}`)
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Repositories</h2>
          <SidebarTrigger />
        </div>
        <SidebarInput
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span className="flex items-center">
              <FolderGit2 className="mr-2 h-4 w-4" />
              GitHub Repositories
            </span>
          </SidebarGroupLabel>
          <SidebarGroupAction>
            <a href="https://github.com/new" target="_blank" rel="noopener noreferrer">
              <Plus className="h-4 w-4" />
            </a>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading ? (
                // Show skeletons while loading
                Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))
              ) : error ? (
                <div className="px-2 py-4 text-sm text-muted-foreground">{error}</div>
              ) : filteredRepos.length === 0 ? (
                <div className="px-2 py-4 text-sm text-muted-foreground">
                  {searchQuery ? "No repositories found" : "No repositories available"}
                </div>
              ) : (
                filteredRepos.map((repo) => (
                  <SidebarMenuItem key={repo.id}>
                    <SidebarMenuButton onClick={() => handleRepoClick(repo)}>
                      <FolderGit2 className="h-4 w-4" />
                      <span>{repo.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
