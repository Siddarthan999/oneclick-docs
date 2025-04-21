"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileDown, FileText, Loader2, RefreshCw } from "lucide-react"
import type { GeneratedDocumentation } from "@/lib/ai"
import { jsPDF } from "jspdf"
import ReactMarkdown from "react-markdown"

type DocumentationViewerProps = {
  repoName: string
  ownerName: string
  documentation: GeneratedDocumentation
  isGenerating: boolean
  onRegenerate: () => void
}

export function DocumentationViewer({
  repoName,
  ownerName,
  documentation,
  isGenerating,
  onRegenerate,
}: DocumentationViewerProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const handleExportPDF = () => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(20)
    doc.text(`${repoName} Documentation`, 20, 20)

    // Add content
    doc.setFontSize(12)
    let y = 40

    // Add overview
    doc.setFontSize(16)
    doc.text("Overview", 20, y)
    y += 10

    doc.setFontSize(12)
    const overviewLines = doc.splitTextToSize(documentation.overview.replace(/#+\s/g, "").replace(/\*\*/g, ""), 170)
    doc.text(overviewLines, 20, y)
    y += overviewLines.length * 7 + 10

    // Add more sections...

    // Save the PDF
    doc.save(`${repoName}-documentation.pdf`)
  }

  const handleExportMarkdown = () => {
    // Combine all documentation sections
    const markdownContent = `# ${repoName} Documentation

## Overview
${documentation.overview}

## Architecture
${documentation.architecture}

## Components
${documentation.components}

## API
${documentation.api}

## Setup Guide
${documentation.setup}
`

    // Create a blob and download it
    const blob = new Blob([markdownContent], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${repoName}-documentation.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{repoName}</h1>
          <p className="text-muted-foreground">
            {ownerName}/{repoName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportMarkdown}>
            <FileText className="mr-2 h-4 w-4" />
            Export Markdown
          </Button>
          <Button onClick={onRegenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </>
            )}
          </Button>
        </div>
      </div>

      {isGenerating ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-violet-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">Regenerating Documentation</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Our AI is analyzing your codebase and generating comprehensive documentation. This may take a few minutes.
            </p>
          </div>
        </div>
      ) : (
        <Card className="flex-1 overflow-hidden">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b px-4">
              <TabsList className="h-12">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="architecture">Architecture</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="setup">Setup Guide</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="overview" className="flex-1 p-6 overflow-auto">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{documentation.overview}</ReactMarkdown>
              </div>
            </TabsContent>
            <TabsContent value="architecture" className="flex-1 p-6 overflow-auto">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{documentation.architecture}</ReactMarkdown>
              </div>
            </TabsContent>
            <TabsContent value="components" className="flex-1 p-6 overflow-auto">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{documentation.components}</ReactMarkdown>
              </div>
            </TabsContent>
            <TabsContent value="api" className="flex-1 p-6 overflow-auto">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{documentation.api}</ReactMarkdown>
              </div>
            </TabsContent>
            <TabsContent value="setup" className="flex-1 p-6 overflow-auto">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{documentation.setup}</ReactMarkdown>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  )
}
