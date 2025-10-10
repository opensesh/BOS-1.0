import { useState, useEffect } from 'react'
import { Copy, Download } from 'lucide-react'

interface MarkdownFile {
  name: string
  path: string
  displayName: string
}

// Use base URL from Vite config to ensure correct paths in production
const BASE_URL = import.meta.env.BASE_URL

const BRAND_GUIDELINES: MarkdownFile[] = [
  { name: 'brand-identity', path: `${BASE_URL}.claude/knowledge/OS_brand identity.md`, displayName: 'Brand Identity' },
  { name: 'brand-messaging', path: `${BASE_URL}.claude/knowledge/OS_brand messaging.md`, displayName: 'Brand Messaging' },
  { name: 'art-direction', path: `${BASE_URL}.claude/knowledge/OS_art direction.md`, displayName: 'Art Direction' },
]

const WRITING_STYLES: MarkdownFile[] = [
  { name: 'blog', path: `${BASE_URL}.claude/knowledge/blog.md`, displayName: 'Blog' },
  { name: 'creative', path: `${BASE_URL}.claude/knowledge/creative.md`, displayName: 'Creative' },
  { name: 'long-form', path: `${BASE_URL}.claude/knowledge/long-form.md`, displayName: 'Long Form' },
  { name: 'short-form', path: `${BASE_URL}.claude/knowledge/short-form.md`, displayName: 'Short Form' },
  { name: 'strategic', path: `${BASE_URL}.claude/knowledge/strategic.md`, displayName: 'Strategic' },
]

export default function MarkdownBlock() {
  const [selectedGuideline, setSelectedGuideline] = useState(BRAND_GUIDELINES[0])
  const [selectedWritingStyle, setSelectedWritingStyle] = useState(WRITING_STYLES[0])
  const [guidelineContent, setGuidelineContent] = useState('')
  const [writingContent, setWritingContent] = useState('')
  const [copiedGuideline, setCopiedGuideline] = useState(false)
  const [copiedWriting, setCopiedWriting] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  // Fetch markdown content
  useEffect(() => {
    const fetchGuideline = async () => {
      try {
        const response = await fetch(selectedGuideline.path)
        if (!response.ok) {
          console.error('Failed to fetch guideline:', response.status, response.statusText)
          setGuidelineContent('# Error: File not found\n\nThe markdown file could not be loaded. Please check if the file exists.')
          return
        }
        const text = await response.text()
        // Check if we got HTML instead of markdown (404 page)
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          console.error('Received HTML instead of markdown')
          setGuidelineContent('# Error: Invalid file type\n\nReceived HTML instead of markdown content.')
          return
        }
        setGuidelineContent(text)
      } catch (error) {
        console.error('Failed to load guideline:', error)
        setGuidelineContent('# Error loading markdown file\n\n' + String(error))
      }
    }

    const fetchWriting = async () => {
      try {
        const response = await fetch(selectedWritingStyle.path)
        if (!response.ok) {
          console.error('Failed to fetch writing style:', response.status, response.statusText)
          setWritingContent('# Error: File not found\n\nThe markdown file could not be loaded. Please check if the file exists.')
          return
        }
        const text = await response.text()
        // Check if we got HTML instead of markdown (404 page)
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          console.error('Received HTML instead of markdown')
          setWritingContent('# Error: Invalid file type\n\nReceived HTML instead of markdown content.')
          return
        }
        setWritingContent(text)
      } catch (error) {
        console.error('Failed to load writing style:', error)
        setWritingContent('# Error loading markdown file\n\n' + String(error))
      }
    }

    fetchGuideline()
    fetchWriting()
  }, [selectedGuideline, selectedWritingStyle])

  const copyToClipboard = async (content: string, type: 'guideline' | 'writing') => {
    try {
      await navigator.clipboard.writeText(content)
      if (type === 'guideline') {
        setCopiedGuideline(true)
        setTimeout(() => {
          setCopiedGuideline(false)
          setHoveredButton(null)
        }, 1500)
      } else {
        setCopiedWriting(true)
        setTimeout(() => {
          setCopiedWriting(false)
          setHoveredButton(null)
        }, 1500)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
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

  const renderCodeBlock = (content: string, filename: string, copied: boolean, onCopy: () => void, onDownload: () => void, blockId: string) => {
    const lines = content.split('\n')

    return (
      <div className="flex flex-col w-full min-w-0 overflow-hidden rounded-xl border border-brand-vanilla/10">
        {/* Header */}
        <div className="bg-brand-vanilla/5 border-b border-brand-vanilla/10 px-3 py-2 flex items-center justify-between">
          <div className="px-2 py-1 rounded-md">
            <p className="font-text text-label text-brand-vanilla truncate">
              {filename}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  onDownload()
                  // Clear hover state after click (especially important for mobile)
                  setTimeout(() => setHoveredButton(null), 100)
                }}
                onMouseEnter={() => setHoveredButton(`${blockId}-download`)}
                onMouseLeave={() => setHoveredButton(null)}
                onTouchEnd={() => setTimeout(() => setHoveredButton(null), 100)}
                className="w-8 h-8 rounded-full bg-brand-charcoal border border-brand-vanilla/20 hover:bg-brand-aperol hover:border-brand-aperol transition-all flex items-center justify-center group"
                aria-label="Download"
              >
                <Download className="w-4 h-4 text-brand-vanilla" />
              </button>
              {hoveredButton === `${blockId}-download` && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-charcoal border border-brand-vanilla/20 px-2 py-1 rounded text-brand-vanilla text-caption whitespace-nowrap pointer-events-none">
                  Download
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  onCopy()
                  // Clear hover state after click (especially important for mobile)
                  setTimeout(() => setHoveredButton(null), 100)
                }}
                onMouseEnter={() => setHoveredButton(`${blockId}-copy`)}
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
              {hoveredButton === `${blockId}-copy` && !copied && (
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

        {/* Content - Scrollable */}
        <div className="bg-brand-charcoal flex gap-2.5 max-h-[400px] overflow-y-auto">
          {/* Line numbers */}
          <div className="font-mono text-caption text-brand-vanilla/20 text-right leading-[28px] select-none py-2 pl-1.5 pr-2.5 sticky left-0 bg-brand-charcoal">
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
    )
  }

  return (
    <div id="markdown" className="flex flex-col gap-12 py-12">
      {/* Title */}
      <div className="flex flex-col gap-8">
        <h2 className="font-display text-d2-mobile md:text-d2-tablet xl:text-d2-desktop text-brand-vanilla">
          Markdown
        </h2>
        <p className="font-text text-b1 text-brand-vanilla/70 max-w-3xl">
          We're using Markdown files as the primary way to give AI systems our brand context, serving both as reference
          materials for AI to understand our guidelines and as direct examples of our writing style. Markdown's plain-text
          format is highly efficient for AI to parse and understand, making brand information immediately accessible and actionable.
        </p>
      </div>

      {/* Brand Guidelines */}
      <div className="flex flex-col gap-6">
        <h3 className="font-display text-h2-mobile md:text-h2-tablet xl:text-h2-desktop text-brand-vanilla">
          Brand Guidelines
        </h3>

        {/* File Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {BRAND_GUIDELINES.map((file) => (
            <button
              key={file.name}
              onClick={() => setSelectedGuideline(file)}
              className={`px-3 py-2 rounded-full font-text text-button transition-all duration-200 ${
                selectedGuideline.name === file.name
                  ? 'bg-brand-aperol text-brand-vanilla shadow-lg shadow-brand-aperol/20'
                  : 'bg-brand-vanilla/10 text-brand-vanilla/70 hover:bg-brand-vanilla/20 hover:text-brand-vanilla'
              }`}
            >
              {file.displayName}
            </button>
          ))}
        </div>

        {/* Code Block */}
        {renderCodeBlock(
          guidelineContent,
          selectedGuideline.path.split('/').pop() || 'file.md',
          copiedGuideline,
          () => copyToClipboard(guidelineContent, 'guideline'),
          () => downloadMarkdown(guidelineContent, selectedGuideline.path.split('/').pop() || 'file.md'),
          'guideline'
        )}
      </div>

      {/* Writing Styles */}
      <div className="flex flex-col gap-6">
        <h3 className="font-display text-h2-mobile md:text-h2-tablet xl:text-h2-desktop text-brand-vanilla">
          Writing Styles
        </h3>

        {/* File Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {WRITING_STYLES.map((file) => (
            <button
              key={file.name}
              onClick={() => setSelectedWritingStyle(file)}
              className={`px-3 py-2 rounded-full font-text text-button transition-all duration-200 ${
                selectedWritingStyle.name === file.name
                  ? 'bg-brand-aperol text-brand-vanilla shadow-lg shadow-brand-aperol/20'
                  : 'bg-brand-vanilla/10 text-brand-vanilla/70 hover:bg-brand-vanilla/20 hover:text-brand-vanilla'
              }`}
            >
              {file.displayName}
            </button>
          ))}
        </div>

        {/* Code Block */}
        {renderCodeBlock(
          writingContent,
          selectedWritingStyle.path.split('/').pop() || 'file.md',
          copiedWriting,
          () => copyToClipboard(writingContent, 'writing'),
          () => downloadMarkdown(writingContent, selectedWritingStyle.path.split('/').pop() || 'file.md'),
          'writing'
        )}
      </div>
    </div>
  )
}
