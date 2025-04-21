"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { DocumentationViewer } from "@/components/documentation-viewer"
import { EmptyState } from "@/components/empty-state"
import type { GeneratedDocumentation } from "@/lib/ai"

export default function RepoPage() {
  const params = useParams()
  const owner = params.owner as string
  const repo = params.repo as string

  const [documentation, setDocumentation] = useState<GeneratedDocumentation | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateDocumentation = async () => {
    try {
      setIsGenerating(true)
      setError(null)

      const response = await fetch("/api/documentation/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner,
          repo,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate documentation")
      }

      const data = await response.json()

      if (data.documentation) {
        setDocumentation(data.documentation)
      } else {
        throw new Error("No documentation generated")
      }
    } catch (error) {
      console.error("Error generating documentation:", error)
      setError("Failed to generate documentation. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="h-full">
      {documentation ? (
        <DocumentationViewer
          repoName={repo}
          ownerName={owner}
          documentation={documentation}
          isGenerating={isGenerating}
          onRegenerate={generateDocumentation}
        />
      ) : (
        <EmptyState
          title={`Repository: ${repo}`}
          description="Generate comprehensive documentation for this repository using AI."
          buttonText="Generate Documentation"
          isLoading={isGenerating}
          error={error}
          onAction={generateDocumentation}
        />
      )}
    </div>
  )
}
