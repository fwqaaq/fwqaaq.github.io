import { parse } from "yaml"
import { copy, ensureDir } from "fs"

function replaceExperience(content) {
  return content.map(item =>
    `<div class="resume-learning-plate">
        <div class="resume-between">
          <span class="font-weight-600">${item.position}</span>
          <span>${item.time}</span>
        </div>
        <div class="resume-learning-content">
          ${item.content.map(item => `<p>${item}</p>`).join("")}
        </div>
      </div>`
  ).join("")
}

async function readYAMLFile(filePath) {
  try {
    const fileContent = await Deno.readTextFile(new URL(filePath))
    return parse(fileContent)
  } catch (error) {
    console.error("Error reading YAML file:", error)
    throw error
  }
}

async function writeHTMLFile(filePath, content) {
  try {
    await Deno.writeTextFile(new URL(filePath), content)
  } catch (error) {
    console.error("Error writing HTML file:", error)
    throw error
  }
}

async function generateResume() {
  const configPath = import.meta.resolve("./resume.yaml")
  const indexPath = import.meta.resolve("./index.html")
  const resumePath = import.meta.resolve("./resume.html")
  const dest = import.meta.resolve("../../../public/resume/")
  const source = import.meta.resolve("./")

  const data = await readYAMLFile(configPath)
  let template = await Deno.readTextFile(new URL(resumePath))

  template = template.replace(/<!-- (.*?) -->/g, (_match, p1) => {
    switch (p1) {
      case "experience":
        return replaceExperience(data[p1])
      case "skills":
        return data[p1].map(item => `<li>${item}</li>`).join("")
      case "others":
        return data[p1].map(item => `<li>${item}</li>`).join("")
    }

    const [prefix, postfix] = p1.split("-")
    if (postfix === "favourite") return data[prefix][postfix].map(item => `<li>${item}</li>`).join("")
    return data[prefix][postfix]
  })

  await writeHTMLFile(indexPath, template)

  await ensureDir(new URL(dest))
  await Promise.all([
    copy(new URL("index.html", source), new URL("index.html", dest), { overwrite: true }),
    copy(new URL("index.css", source), new URL("index.css", dest), { overwrite: true })
  ])
}

generateResume().catch(console.error)