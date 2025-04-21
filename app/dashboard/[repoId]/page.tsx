import { DocumentationViewer } from "@/components/documentation-viewer"

export default function RepoPage({ params }: { params: { repoId: string } }) {
  // In a real app, we would fetch the repository data and documentation
  // based on the repoId parameter
  const repoId = params.repoId

  return (
    <div className="h-full">
      <DocumentationViewer repoId={repoId} />
    </div>
  )
}
