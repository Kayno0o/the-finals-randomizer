#!/usr/bin/env bun

import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

interface IconData {
  width?: number
  height?: number
  body: string
}

interface IconsJson {
  icons: Record<string, IconData>
  width?: number
  height?: number
}

async function getAllFiles(dir: string, extensions = ['.ts', '.astro', '.js', '.jsx', '.tsx']): Promise<string[]> {
  const files: string[] = []

  async function scan(currentDir: string) {
    const items = await readdir(currentDir, { withFileTypes: true })

    for (const item of items) {
      const fullPath = join(currentDir, item.name)

      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        await scan(fullPath)
      }
      else if (item.isFile() && extensions.includes(extname(item.name))) {
        files.push(fullPath)
      }
    }
  }

  await scan(dir)
  return files
}

async function extractIcons(projectDir: string): Promise<string[]> {
  const files = await getAllFiles(projectDir)
  const iconPattern = /i-([a-zA-Z0-9-]+):([a-zA-Z0-9-]+)/g
  const icons = new Set<string>()

  for (const file of files) {
    try {
      const content = await readFile(file, 'utf8')
      const matches = content.matchAll(iconPattern)

      for (const match of matches) {
        const iconSet = match[1]
        const iconName = match[2]
        icons.add(`${iconSet}:${iconName}`)
      }
    }
    catch (error) {
      console.warn(`Error reading ${file}:`, (error as Error).message)
    }
  }

  return Array.from(icons)
}

async function findIconPackage(iconSet: string): Promise<string | null> {
  const packageName = `@iconify-json/${iconSet}`
  try {
    const packagePath = join(process.cwd(), 'node_modules', packageName)
    if (existsSync(packagePath)) {
      return packagePath
    }

    const resolved = require.resolve(`${packageName}/package.json`)
    return resolved.replace('/package.json', '')
  }
  catch {
    return null
  }
}

async function getIconSvg(iconSet: string, iconName: string): Promise<string | null> {
  try {
    const packagePath = await findIconPackage(iconSet)
    if (!packagePath) {
      throw new Error(`Package @iconify-json/${iconSet} not found`)
    }

    const iconsJsonPath = join(packagePath, 'icons.json')
    const iconsData: IconsJson = await Bun.file(iconsJsonPath).json()

    if (!iconsData.icons[iconName]) {
      throw new Error(`Icon ${iconName} not found in ${iconSet}`)
    }

    const iconData = iconsData.icons[iconName]
    const { width: defaultWidth = 24, height: defaultHeight = 24 } = iconsData
    const { width = defaultWidth, height = defaultHeight, body } = iconData
    const viewBox = `0 0 ${width} ${height}`

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">${body}</svg>`
    const base64 = btoa(svg)

    return `data:image/svg+xml;base64,${base64}`
  }
  catch (error) {
    console.error(`Failed to get SVG for ${iconSet}:${iconName} - ${(error as Error).message}`)
    return null
  }
}

async function main() {
  const projectDir = process.argv[2] || './src'
  const outputFile = process.argv[3] || './public/css/icons.css'

  console.log(`Scanning ${projectDir} for icons...`)
  const icons = await extractIcons(projectDir)

  if (icons.length === 0) {
    console.log('No icons found')
    return
  }

  console.log(`Found ${icons.length} unique icons`)

  const cssRules: string[] = []
  let processed = 0
  let failed = 0

  for (const icon of icons) {
    const [iconSet, iconName] = icon.split(':')
    console.log(`Processing ${icon}...`)

    const svgData = await getIconSvg(iconSet, iconName)
    if (svgData) {
      const className = `i-${iconSet}\\:${iconName}`
      cssRules.push(`.${className} {
  mask: url('${svgData}') no-repeat;
  mask-size: 100% 100%;
  -webkit-mask: url('${svgData}') no-repeat;
  -webkit-mask-size: 100% 100%;
  background-color: currentColor;
  display: inline-block;
  width: 1em;
  height: 1em;
}`)
      processed++
    }
    else {
      failed++
    }
  }

  const cssContent = cssRules.join('\n\n')
  await Bun.write(outputFile, cssContent)

  console.log(`\nComplete! Processed: ${processed}, Failed: ${failed}`)
  console.log(`CSS file saved to: ${outputFile}`)
}

try {
  main()
}
catch (e) {
  console.error(e)
}
