/*
  Token Transformer Script (scaffold)
  - Fetch tokens from OS_Brand-Design-System
  - Transform to Tailwind theme extension
  - Optionally write back generated config
*/
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

type TailwindTheme = {
  theme: {
    extend: Record<string, unknown>
  }
}

async function fetchTokens() {
  // Placeholder: in real use, clone/pull or fetch from API.
  return {
    colors: {
      brand: { charcoal: '#191919', vanilla: '#FFFAEE', aperol: '#FE5102' },
    },
    fonts: {
      display: '"Neue Haas Grotesk Display Pro", system-ui, sans-serif',
      text: '"Neue Haas Grotesk Text Pro", system-ui, sans-serif',
      mono: 'Offbit, ui-monospace, SFMono-Regular, monospace',
    },
  }
}

function transformToTailwind(tokens: Awaited<ReturnType<typeof fetchTokens>>): TailwindTheme {
  return {
    theme: {
      extend: {
        colors: tokens.colors,
        fontFamily: {
          display: tokens.fonts.display,
          text: tokens.fonts.text,
          mono: tokens.fonts.mono,
        },
      },
    },
  }
}

async function writeTailwindConfig(theme: TailwindTheme) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const projectRoot = path.resolve(__dirname, '../../')
  const out = `export default ${JSON.stringify(theme, null, 2)}\n`
  await fs.writeFile(path.join(projectRoot, 'tailwind.brand-theme.ts'), out, 'utf-8')
}

async function main() {
  const tokens = await fetchTokens()
  const theme = transformToTailwind(tokens)
  await writeTailwindConfig(theme)
  console.log('Generated tailwind.brand-theme.ts from tokens')
}

// Run if invoked directly via tsx
if (process.argv[1]?.includes('tokenTransformer')) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

export { fetchTokens, transformToTailwind, writeTailwindConfig }


