import { useState, useEffect } from 'react'
import { Copy } from 'lucide-react'

interface MarkdownFile {
  name: string
  path: string
  displayName: string
}

const BRAND_GUIDELINES: MarkdownFile[] = [
  { name: 'brand-identity', path: '/brand/core/OS_brand identity.md', displayName: 'Brand Identity' },
  { name: 'brand-messaging', path: '/brand/core/OS_brand messaging.md', displayName: 'Brand Messaging' },
  { name: 'art-direction', path: '/brand/core/OS_art direction.md', displayName: 'Art Direction' },
]

const WRITING_STYLES: MarkdownFile[] = [
  { name: 'blog', path: '/brand/writing-styles/blog.md', displayName: 'Blog' },
  { name: 'creative', path: '/brand/writing-styles/creative.md', displayName: 'Creative' },
  { name: 'long-form', path: '/brand/writing-styles/long-form.md', displayName: 'Long Form' },
  { name: 'short-form', path: '/brand/writing-styles/short-form.md', displayName: 'Short Form' },
  { name: 'strategic', path: '/brand/writing-styles/strategic.md', displayName: 'Strategic' },
]

export default function MarkdownBlock() {
  const [selectedGuideline, setSelectedGuideline] = useState(BRAND_GUIDELINES[0])
  const [selectedWritingStyle, setSelectedWritingStyle] = useState(WRITING_STYLES[0])
  const [guidelineContent, setGuidelineContent] = useState('')
  const [writingContent, setWritingContent] = useState('')
  const [copiedGuideline, setCopiedGuideline] = useState(false)
  const [copiedWriting, setCopiedWriting] = useState(false)

  // Fetch markdown content
  useEffect(() => {
    const fetchGuideline = async () => {
      try {
        const response = await fetch(selectedGuideline.path)
        const text = await response.text()
        setGuidelineContent(text)
      } catch (error) {
        console.error('Failed to load guideline:', error)
        setGuidelineContent('# Error loading markdown file')
      }
    }

    const fetchWriting = async () => {
      try {
        const response = await fetch(selectedWritingStyle.path)
        const text = await response.text()
        setWritingContent(text)
      } catch (error) {
        console.error('Failed to load writing style:', error)
        setWritingContent('# Error loading markdown file')
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
        setTimeout(() => setCopiedGuideline(false), 2000)
      } else {
        setCopiedWriting(true)
        setTimeout(() => setCopiedWriting(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
    }
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

  const renderCodeBlock = (content: string, filename: string, copied: boolean, onCopy: () => void) => {
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
          <button
            onClick={onCopy}
            className="bg-brand-charcoal border border-brand-vanilla/20 hover:bg-brand-vanilla/10 transition-colors px-2 py-1 rounded-md flex items-center gap-2"
          >
            <Copy className="w-4 h-4 text-brand-vanilla" />
            <span className="font-text text-label text-brand-vanilla">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="bg-brand-charcoal flex gap-2.5 max-h-[400px] overflow-y-auto">
          {/* Line numbers */}
          <div className="font-mono text-[14.5px] text-brand-vanilla/20 text-right leading-[28px] select-none py-2 pl-1.5 pr-2.5 sticky left-0 bg-brand-charcoal">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code content */}
          <pre className="font-mono text-[15px] leading-[28px] flex-1 min-w-0 py-2 pr-4">
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
        <h2 className="font-display text-d2-mobile md:text-d2-tablet xl:text-d2-desktop tracking-[-2px] text-brand-vanilla">
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
        <h3 className="font-display text-h2-mobile md:text-h2-tablet tracking-[-2px] text-brand-vanilla">
          Brand Guidelines
        </h3>

        {/* File Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {BRAND_GUIDELINES.map((file) => (
            <button
              key={file.name}
              onClick={() => setSelectedGuideline(file)}
              className={`px-3 py-2 rounded-full font-text text-[14px] transition-all duration-200 ${
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
          () => copyToClipboard(guidelineContent, 'guideline')
        )}
      </div>

      {/* Writing Styles */}
      <div className="flex flex-col gap-6">
        <h3 className="font-display text-h2-mobile md:text-h2-tablet tracking-[-2px] text-brand-vanilla">
          Writing Styles
        </h3>

        {/* File Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {WRITING_STYLES.map((file) => (
            <button
              key={file.name}
              onClick={() => setSelectedWritingStyle(file)}
              className={`px-3 py-2 rounded-full font-text text-[14px] transition-all duration-200 ${
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
          () => copyToClipboard(writingContent, 'writing')
        )}
      </div>
    </div>
  )
}
