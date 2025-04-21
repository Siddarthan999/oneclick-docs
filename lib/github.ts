export interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  default_branch: string
  owner: {
    login: string
    avatar_url: string
  }
}

export interface FileContent {
  name: string
  path: string
  content: string
  type: "file" | "dir"
}

export async function fetchUserRepositories(accessToken: string): Promise<Repository[]> {
  try {
    const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos = await response.json()
    return repos
  } catch (error) {
    console.error("Error fetching repositories:", error)
    return []
  }
}

export async function fetchRepositoryFiles(
  accessToken: string,
  owner: string,
  repo: string,
  path = "",
  branch = "master",
): Promise<FileContent[]> {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const contents = await response.json()

    // If it's a single file
    if (!Array.isArray(contents)) {
      return [
        {
          name: contents.name,
          path: contents.path,
          content: contents.content ? atob(contents.content) : "",
          type: contents.type,
        },
      ]
    }

    // If it's a directory
    return contents.map((item) => ({
      name: item.name,
      path: item.path,
      content: "",
      type: item.type,
    }))
  } catch (error) {
    console.error("Error fetching repository files:", error)
    return []
  }
}

export async function fetchFileContent(
  accessToken: string,
  owner: string,
  repo: string,
  path: string,
  branch = "master",
): Promise<string> {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.content) {
      return atob(data.content)
    }

    return ""
  } catch (error) {
    console.error("Error fetching file content:", error)
    return ""
  }
}

export async function fetchRepositoryStructure(
  accessToken: string,
  owner: string,
  repo: string,
  branch = "master",
): Promise<{ files: FileContent[]; fileContents: Record<string, string> }> {
  const files: FileContent[] = []
  const fileContents: Record<string, string> = {}

  async function traverseDirectory(path = "") {
    const contents = await fetchRepositoryFiles(accessToken, owner, repo, path, branch)

    for (const item of contents) {
      files.push(item)

      if (item.type === "dir") {
        await traverseDirectory(item.path)
      } else if (item.type === "file") {
        // Only fetch content for code files, skip binaries
        const fileExtension = item.name.split(".").pop()?.toLowerCase()
        const codeExtensions = [
          "js",
          "jsx",
          "ts",
          "tsx",
          "py",
          "rb",
          "java",
          "php",
          "go",
          "rust",
          "c",
          "cpp",
          "h",
          "cs",
          "html",
          "css",
          "md",
          "json",
          "yml",
          "yaml",
        ]

        if (codeExtensions.includes(fileExtension || "")) {
          const content = await fetchFileContent(accessToken, owner, repo, item.path, branch)
          fileContents[item.path] = content
        }
      }
    }
  }

  await traverseDirectory()
  return { files, fileContents }
}
