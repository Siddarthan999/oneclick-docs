"use client"

import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react"

interface EmptyStateProps {
  title?: string
  description?: string
  buttonText?: string
  isLoading?: boolean
  error?: string | null
  onAction?: () => void
}

export function EmptyState({
  title = "No repository selected",
  description = "Select a repository from the sidebar to generate documentation or add a new repository.",
  buttonText = "Generate Documentation",
  isLoading = false,
  error = null,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto p-6">
      <div className="size-16 rounded-full bg-violet-600/10 flex items-center justify-center mb-4">
        <FileText className="h-8 w-8 text-violet-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{error || description}</p>
      <div className="flex gap-4">
        {onAction && (
          <Button onClick={onAction} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              buttonText
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
