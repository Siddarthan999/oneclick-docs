import { GoogleGenerativeAI } from "@google/generative-ai"

export interface DocumentationSection {
  title: string
  content: string
}

export interface GeneratedDocumentation {
  overview: string
  architecture: string
  components: string
  api: string
  setup: string
}

export async function generateDocumentation(
  repoName: string,
  fileContents: Record<string, string>,
): Promise<GeneratedDocumentation> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    // Prepare the file contents for the prompt
    const filesList = Object.entries(fileContents)
      .map(([path, content]) => `File: ${path}\n\n${content}\n\n`)
      .join("\n---\n\n")

    // Create a prompt for comprehensive documentation
    const prompt = `
      You are a technical documentation expert. Analyze the following codebase for a project named "${repoName}" and generate comprehensive documentation.
      
      Here are the files from the repository:
      
      ${filesList}
      
      Generate detailed documentation with the following sections:
      
      1. Overview: Provide a high-level overview of the project, its purpose, and key features.
      
      2. Architecture: Describe the architecture of the application, including the main components, data flow, and design patterns used.
      
      3. Components: Document the main components of the application, their purpose, and how they interact with each other.
      
      4. API: Document any APIs exposed by the application, including endpoints, request/response formats, and authentication methods.
      
      5. Setup Guide: Provide step-by-step instructions for setting up the development environment and running the application locally.
      
      Format your response in Markdown. Each section should be comprehensive but concise.
    `

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Parse the response into sections
    const sections = parseSections(text)

    return {
      overview: sections.Overview || "No overview generated.",
      architecture: sections.Architecture || "No architecture documentation generated.",
      components: sections.Components || "No components documentation generated.",
      api: sections.API || "No API documentation generated.",
      setup: sections["Setup Guide"] || "No setup guide generated.",
    }
  } catch (error) {
    console.error("Error generating documentation:", error)
    return {
      overview: "Failed to generate documentation. Please try again later.",
      architecture: "",
      components: "",
      api: "",
      setup: "",
    }
  }
}

function parseSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {}

  // Match section headers (# Section Title)
  const sectionRegex = /#+\s+(.*?)(?=\n#+\s+|$)/gs
  let match
  let lastIndex = 0

  while ((match = sectionRegex.exec(text)) !== null) {
    const sectionTitle = match[1].trim()
    const startIndex = match.index + match[0].length
    const endIndex = text.indexOf(`\n# `, startIndex)

    const content = endIndex !== -1 ? text.substring(startIndex, endIndex).trim() : text.substring(startIndex).trim()

    sections[sectionTitle] = content
    lastIndex = endIndex !== -1 ? endIndex : text.length
  }

  // If no sections were found, return the entire text as "Overview"
  if (Object.keys(sections).length === 0) {
    sections["Overview"] = text.trim()
  }

  return sections
}
