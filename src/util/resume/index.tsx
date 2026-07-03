/** @jsxImportSource hono/jsx */
import { readFile, writeFile } from 'node:fs/promises'
import { parse } from 'yaml'
import { copy, ensureDir } from '../node-fs.ts'
import { renderJsx } from '../../blog/components.tsx'

function replaceExperience(content: Array<any>): string {
  return renderJsx(<>
    {content.map((item) =>
      <div class="resume-learning-plate">
        <div class="resume-between">
          <span class="font-weight-600">{item.position}</span>
          <span>{item.time}</span>
        </div>
        <div class="resume-learning-content">
          {item.content.map((line) => <p>{line}</p>)}
        </div>
      </div>)}
  </>)
}

function replaceListItems(items: Array<any>): string {
  return renderJsx(<>{items.map((item) => <li>{item}</li>)}</>)
}

async function readYAMLFile(filePath: string): Promise<any> {
  try {
    const fileContent = await readFile(new URL(filePath), 'utf8')
    return parse(fileContent)
  } catch (error) {
    console.error('Error reading YAML file:', error)
    throw error
  }
}

async function writeHTMLFile(filePath: string, content: string): Promise<void> {
  try {
    await writeFile(new URL(filePath), content)
  } catch (error) {
    console.error('Error writing HTML file:', error)
    throw error
  }
}

async function generateResume() {
  const configPath = new URL('./resume.yaml', import.meta.url).href
  const indexPath = new URL('./index.html', import.meta.url).href
  const resumePath = new URL('./resume.html', import.meta.url).href
  const dest = new URL('../../../public/resume/', import.meta.url).href
  const source = new URL('./', import.meta.url).href

  const data = await readYAMLFile(configPath)
  let template = await readFile(new URL(resumePath), 'utf8')

  template = template.replace(/<!-- (.*?) -->/g, (_match, p1) => {
    switch (p1) {
      case 'experience':
        return replaceExperience(data[p1])
      case 'skills':
        return replaceListItems(data[p1])
      case 'others':
        return replaceListItems(data[p1])
      case 'projects':
        return replaceListItems(data[p1])
    }

    const [prefix, postfix] = p1.split('-')
    if (postfix === 'favourite') {
      return replaceListItems(data[prefix][postfix])
    }
    return data[prefix][postfix]
  })

  await writeHTMLFile(indexPath, template)

  await ensureDir(new URL(dest))
  await Promise.all([
    copy(new URL('index.html', source), new URL('index.html', dest)),
    copy(new URL('index.css', source), new URL('index.css', dest)),
  ])
}

generateResume().catch(console.error)
