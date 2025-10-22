import { useState, useEffect } from 'react'
import { Copy, Download } from 'lucide-react'

const BASE_URL = import.meta.env.BASE_URL
const ARCHITECTURE_PATH = `${BASE_URL}claude-data/system/architecture.md`

export default function ArchitectureBlock() {
  const [content, setContent] = useState('')
  const [copied, setCopied] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  // Fetch markdown content
  useEffect(() => {
    const fetchArchitecture = async () => {
      try {
        const response = await fetch(ARCHITECTURE_PATH)
        if (!response.ok) {
          console.error('Failed to fetch architecture:', response.status, response.statusText)
          setContent('# Error: File not found\n\nThe architecture markdown could not be loaded.')
          return
        }
        const text = await response.text()
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          console.error('Received HTML instead of markdown')
          setContent('# Error: Invalid file type\n\nReceived HTML instead of markdown content.')
          return
        }
        setContent(text)
      } catch (error) {
        console.error('Failed to load architecture:', error)
        setContent('# Error loading markdown file\n\n' + String(error))
      }
    }

    fetchArchitecture()
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setHoveredButton(null)
      }, 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'architecture.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Syntax highlighting for markdown
  const highlightMarkdown = (line: string) => {
    // Headers (# ## ###)
    if (line.match(/^#{1,6}\s/)) {
      return <span className="text-[#88a66a] font-semibold">{line}</span>
    }

    // Bold **text**
    if (line.includes('**')) {
      const parts = line.split(/(\*\*.*?\*\*)/)
      return (
        <>
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <span key={i} className="text-[#5ba9d9] font-semibold">{part}</span>
            }
            return <span key={i} className="text-brand-vanilla/90">{part}</span>
          })}
        </>
      )
    }

    // Lists (- or *)
    if (line.match(/^\s*[-*]\s/)) {
      return (
        <>
          <span className="text-[#5ba9d9]">{line.match(/^\s*[-*]\s/)?.[0]}</span>
          <span className="text-brand-vanilla/90">{line.replace(/^\s*[-*]\s/, '')}</span>
        </>
      )
    }

    // Links [text](url)
    if (line.includes('[') && line.includes('](')) {
      const parts = line.split(/(\[.*?\]\(.*?\))/)
      return (
        <>
          {parts.map((part, i) => {
            if (part.match(/\[.*?\]\(.*?\)/)) {
              const linkText = part.match(/\[(.*?)\]/)?.[1]
              const url = part.match(/\((.*?)\)/)?.[1]
              return (
                <span key={i}>
                  <span className="text-[#5ba9d9]">[</span>
                  <span className="text-[#a66bbf]">{linkText}</span>
                  <span className="text-[#5ba9d9]">](</span>
                  <span className="text-[#88a66a]">{url}</span>
                  <span className="text-[#5ba9d9]">)</span>
                </span>
              )
            }
            return <span key={i} className="text-brand-vanilla/90">{part}</span>
          })}
        </>
      )
    }

    // Code blocks ```
    if (line.includes('```')) {
      return <span className="text-[#a66bbf]">{line}</span>
    }

    // Comments (lines starting with //)
    if (line.trim().startsWith('//')) {
      return <span className="text-brand-vanilla/40 italic">{line}</span>
    }

    // Default
    return <span className="text-brand-vanilla/90">{line}</span>
  }

  const lines = content.split('\n')

  return (
    <div id="architecture" className="flex flex-col gap-6">
      {/* Title & Description */}
      <div className="flex flex-col gap-8">
        <h2 className="font-display text-d2-mobile md:text-d2-tablet xl:text-d2-desktop text-brand-vanilla">
          Architecture
        </h2>
        <p className="font-text text-b1 text-brand-vanilla/70 max-w-3xl">
          This website is structured to serve both as a landing page for humans and as a well-organized resource for AI agent interpretation. Think of it as our brand brain that will continue to grow and extend use cases over time.
        </p>
      </div>

      {/* Code Block */}
      <div className="flex flex-col w-full min-w-0 overflow-hidden rounded-xl border border-brand-vanilla/10">
        {/* Header */}
        <div className="bg-brand-vanilla/5 border-b border-brand-vanilla/10 px-3 py-2 flex items-center justify-between">
          <div className="px-2 py-1 rounded-md">
            <p className="font-text text-label text-brand-vanilla truncate">
              architecture.md
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  downloadMarkdown()
                  setTimeout(() => setHoveredButton(null), 100)
                }}
                onMouseEnter={() => setHoveredButton('download')}
                onMouseLeave={() => setHoveredButton(null)}
                onTouchEnd={() => setTimeout(() => setHoveredButton(null), 100)}
                className="w-8 h-8 rounded-full bg-brand-charcoal border border-brand-vanilla/20 hover:bg-brand-aperol hover:border-brand-aperol transition-all flex items-center justify-center group"
                aria-label="Download"
              >
                <Download className="w-4 h-4 text-brand-vanilla" />
              </button>
              {hoveredButton === 'download' && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-charcoal border border-brand-vanilla/20 px-2 py-1 rounded text-brand-vanilla text-caption whitespace-nowrap pointer-events-none">
                  Download
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  copyToClipboard()
                  setTimeout(() => setHoveredButton(null), 100)
                }}
                onMouseEnter={() => setHoveredButton('copy')}
                onMouseLeave={() => setHoveredButton(null)}
                onTouchEnd={() => setTimeout(() => setHoveredButton(null), 100)}
                className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center group ${
                  copied
                    ? 'bg-brand-aperol border-brand-aperol'
                    : 'bg-brand-charcoal border-brand-vanilla/20 hover:bg-brand-aperol hover:border-brand-aperol'
                }`}
                aria-label={copied ? 'Copied!' : 'Copy'}
              >
                <Copy className="w-4 h-4 text-brand-vanilla" />
              </button>
              {hoveredButton === 'copy' && !copied && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-charcoal border border-brand-vanilla/20 px-2 py-1 rounded text-brand-vanilla text-caption whitespace-nowrap pointer-events-none">
                  Copy
                </div>
              )}
              {copied && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-aperol border border-brand-aperol px-2 py-1 rounded text-brand-vanilla text-caption whitespace-nowrap pointer-events-none">
                  Copied!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content - Fit to content, no scroll */}
        <div className="bg-brand-charcoal flex gap-2.5">
          {/* Line numbers */}
          <div className="font-['Neue_Haas_Grotesk_Text_Pro:55_Roman',_sans-serif] text-caption text-brand-vanilla/20 text-right leading-[28px] select-none py-2 pl-1.5 pr-2.5 sticky left-0 bg-brand-charcoal">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code content */}
          <pre className="font-mono text-b2 leading-[28px] flex-1 min-w-0 py-2 pr-4">
            {lines.map((line, i) => (
              <div key={i} className="whitespace-pre">
                {highlightMarkdown(line) || ' '}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  )
}
