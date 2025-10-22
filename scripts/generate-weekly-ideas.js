#!/usr/bin/env node

import Anthropic from '@anthropic-ai/sdk'
import Parser from 'rss-parser'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const API_KEY = process.env.ANTHROPIC_API_KEY
const PROJECT_ROOT = path.join(__dirname, '..')
const KNOWLEDGE_DIR = path.join(PROJECT_ROOT, '.claude', 'knowledge')
const CONFIG_DIR = path.join(PROJECT_ROOT, '.claude', 'config')
const DATA_DIR = path.join(PROJECT_ROOT, '.claude', 'data')
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public', 'data', 'weekly-ideas')

// Initialize clients
const anthropic = new Anthropic({ apiKey: API_KEY })
const rssParser = new Parser()

// RSS Feeds to fetch
const RSS_FEEDS = [
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss' },
]

/**
 * Load all knowledge base files
 */
async function loadKnowledgeBase() {
  console.log('📚 Loading knowledge base...')

  const files = [
    'core/OS_brand identity.md',
    'core/OS_brand messaging.md',
    'core/OS_art direction.md',
    'writing-styles/short-form.md',
    'writing-styles/long-form.md',
    'writing-styles/blog.md',
  ]

  const knowledge = {}
  for (const file of files) {
    const filePath = path.join(KNOWLEDGE_DIR, file)
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      knowledge[file] = content
    } catch (error) {
      console.warn(`⚠️  Could not load ${file}:`, error.message)
    }
  }

  return knowledge
}

/**
 * Load news sources
 */
async function loadNewsSources() {
  console.log('📰 Loading news sources...')

  const sourcesPath = path.join(DATA_DIR, 'news-sources.md')
  try {
    const content = await fs.readFile(sourcesPath, 'utf-8')
    return content
  } catch (error) {
    console.warn('⚠️  Could not load news sources:', error.message)
    return ''
  }
}

/**
 * Load hotness scoring configuration
 */
async function loadHotnessConfig() {
  console.log('🔥 Loading hotness scoring config...')

  const configPath = path.join(CONFIG_DIR, 'hotness-scoring.json')
  try {
    const content = await fs.readFile(configPath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.warn('⚠️  Could not load hotness config:', error.message)
    return null
  }
}

/**
 * Fetch fresh articles from RSS feeds
 */
async function fetchRSSArticles() {
  console.log('📰 Fetching latest articles from RSS feeds...')

  const allArticles = []

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await rssParser.parseURL(feed.url)
      const articles = parsed.items.slice(0, 10).map(item => ({
        title: item.title,
        url: item.link,
        source: feed.name,
        pubDate: item.pubDate
      }))
      allArticles.push(...articles)
      console.log(`  ✓ ${feed.name}: ${articles.length} articles`)
    } catch (error) {
      console.warn(`  ⚠️  Failed to fetch ${feed.name}:`, error.message)
    }
  }

  console.log(`✅ Fetched ${allArticles.length} total articles\n`)
  return allArticles
}

/**
 * Generate format-specific prompts based on content type
 */
function getPromptForContentType(contentType, knowledge, articlesText) {
  const commonContext = `You are an AI content strategist for OPEN SESSION, a design agency specializing in AI-powered creative workflows.

Today's date: ${new Date().toISOString().split('T')[0]}

**Context - Brand Identity:**
${knowledge['core/OS_brand identity.md']}

**Context - Brand Messaging:**
${knowledge['core/OS_brand messaging.md']}

**Context - Writing Style for ${contentType}:**
${knowledge[`writing-styles/${contentType}.md`]}

**LATEST ARTICLES FROM RSS FEEDS (Use these URLs as inspiration):**
${articlesText}
`

  if (contentType === 'short-form') {
    return `${commonContext}

**Your Task:**
Generate 4-5 SPECIFIC POST IDEAS for Instagram/TikTok based on the latest AI/design news.

**CRITICAL: These should be ACTIONABLE POST IDEAS, NOT news summaries!**

**Format Examples (this is what we want):**
✓ "Create a carousel showing how design systems are evolving with AI"
✓ "Film an Instagram reel demonstrating Cursor + Figma workflow"
✓ "Make a 3-slide comparison of AI tools for designers"
✓ "Create a visual breakdown of 'spec is the new code' philosophy"
✗ "AI tools are changing design" (too vague, not actionable)
✗ "New Claude update released" (news summary, not a post idea)

**Content Mix Requirements:**
- 40% Tools & Workflows (practical demonstrations)
- 30% Frameworks & Concepts (design philosophies)
- 30% Future & Abstract (provocative questions)

**For EACH post idea provide:**
- Title: The specific post format (e.g., "Carousel: How design systems are changing")
- Description: What the post will show/teach (max 120 chars)
- Starred: Mark 1-2 most timely ideas as true
- Sources: 3-5 source OBJECTS (not just URLs!) from articles above - these help inspire the idea and give places to learn more

**CRITICAL: Sources must be objects with "name" and "url" properties!**

**Response Format (JSON only):**
{
  "type": "short-form",
  "date": "${new Date().toISOString()}",
  "ideas": [
    {
      "title": "Reel: Cursor + Figma live demo",
      "description": "30-second tutorial showing how to integrate Cursor with Figma for faster design",
      "starred": true,
      "sources": [
        { "name": "TechCrunch AI", "url": "https://techcrunch.com/..." },
        { "name": "The Verge", "url": "https://www.theverge.com/..." },
        { "name": "Wired", "url": "https://www.wired.com/..." }
      ]
    }
  ]
}

Generate 4-5 specific, actionable post ideas now. Return ONLY valid JSON.`
  }

  if (contentType === 'long-form') {
    return `${commonContext}

**Your Task:**
Generate 4-5 INSTRUCTIONAL VIDEO IDEAS for YouTube (5-10 minute tutorials) based on the latest AI/design news.

**CRITICAL: These should be TUTORIAL TOPICS, NOT news summaries!**

**Format Examples (this is what we want):**
✓ "Tutorial: Using Figma with OpenAI's browser use feature for automated design"
✓ "MCP Deep Dive: How we integrate it across our entire design workflow"
✓ "Step-by-step: Building a component library with Claude Code"
✓ "Cursor + Figma integration: Complete setup and workflow guide"
✗ "AI is changing design" (too vague, not a tutorial)
✗ "New tool released" (news announcement, not instructional)

**Video Types Requirements:**
- 40% Tool Integration Tutorials (how to connect tools)
- 30% Deep Dives on New Features (hands-on exploration)
- 20% Framework & Philosophy Explainers (concepts with examples)
- 10% Our Business Use Cases (how we use tools)

**Target Outcome:** Viewers should be able to DO, UNDERSTAND, or REPLICATE something after watching

**For EACH video idea provide:**
- Title: The tutorial topic (e.g., "Tutorial: Figma to Production with AI")
- Description: What viewers will learn/be able to do (max 120 chars)
- Starred: Mark 1-2 most timely/valuable tutorials as true
- Sources: 3-5 source OBJECTS (not just URLs!) from articles above - these help with research and give viewers places to learn more

**CRITICAL: Sources must be objects with "name" and "url" properties!**

**Response Format (JSON only):**
{
  "type": "long-form",
  "date": "${new Date().toISOString()}",
  "ideas": [
    {
      "title": "Tutorial: MCP + Figma integration guide",
      "description": "Step-by-step setup showing exactly how we use MCP with Figma at OPEN SESSION",
      "starred": true,
      "sources": [
        { "name": "TechCrunch AI", "url": "https://techcrunch.com/..." },
        { "name": "The Verge", "url": "https://www.theverge.com/..." },
        { "name": "Wired", "url": "https://www.wired.com/..." }
      ]
    }
  ]
}

Generate 4-5 specific instructional video ideas now. Return ONLY valid JSON.`
  }

  if (contentType === 'blog') {
    return `${commonContext}

**Your Task:**
Generate 3-5 THOUGHT LEADERSHIP ARTICLE IDEAS based on the latest AI/design news.

**CRITICAL: These should be PERSPECTIVE PIECES with editorial depth, NOT tutorials or news summaries!**

**Format Examples (this is what we want):**
✓ "Our perspective: Why 'spec is the new code' will reshape design education"
✓ "The realistic AI toolkit for designers in 2025: What actually works vs. hype"
✓ "Where design is heading: Three trends that matter more than the latest tools"
✓ "Why most designers are approaching AI wrong (and how to fix it)"
✗ "How to use Figma" (tutorial, belongs in long-form)
✗ "New AI tool released" (news, not perspective)

**Article Types Requirements:**
- 30% Future Perspectives (where design is heading)
- 30% Tool & Framework Analysis (what's realistic to adopt)
- 25% Philosophy & Frameworks (why approaches matter)
- 15% Case Studies & Our Approach (how we solved challenges)

**Key Differentiators:**
- Short-form = Quick post idea → Blog = Why it matters (analysis)
- Long-form = How to do it (tutorial) → Blog = Should you do it? (perspective)

**For EACH article idea provide:**
- Title: The perspective/analysis angle (e.g., "Our take: Why spec is the new code")
- Description: The argument or perspective (max 120 chars)
- Starred: Mark 1-2 most compelling perspectives as true
- Sources: 3-5 source OBJECTS (not just URLs!) from articles above - these help with research and give readers places to learn more

**CRITICAL: Sources must be objects with "name" and "url" properties!**

**Response Format (JSON only):**
{
  "type": "blog",
  "date": "${new Date().toISOString()}",
  "ideas": [
    {
      "title": "Why 'spec is the new code' matters for designers",
      "description": "Deep dive on how this philosophy will reshape design education and practice",
      "starred": true,
      "sources": [
        { "name": "TechCrunch AI", "url": "https://techcrunch.com/..." },
        { "name": "The Verge", "url": "https://www.theverge.com/..." },
        { "name": "Wired", "url": "https://www.wired.com/..." }
      ]
    }
  ]
}

Generate 3-5 thought leadership article ideas now. Return ONLY valid JSON.`
  }

  // Fallback (shouldn't reach here)
  return `${commonContext}\n\nGenerate 3-5 content ideas for ${contentType}.`
}

/**
 * Generate ideas for a specific content type using Claude
 */
async function generateIdeas(contentType, knowledge, newsSources, hotnessConfig, rssArticles) {
  console.log(`\n🤖 Generating ${contentType} ideas...`)

  // Format RSS articles for the prompt
  const articlesText = rssArticles.map(article =>
    `- "${article.title}" - ${article.source}\n  URL: ${article.url}`
  ).join('\n')

  const prompt = getPromptForContentType(contentType, knowledge, articlesText)

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText = message.content[0].text

    // Extract JSON from response (in case Claude adds markdown formatting)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const ideas = JSON.parse(jsonMatch[0])
    console.log(`✅ Generated ${ideas.ideas.length} ideas`)

    return ideas
  } catch (error) {
    console.error(`❌ Failed to generate ${contentType} ideas:`, error.message)
    throw error
  }
}

/**
 * Save ideas to file
 */
async function saveIdeas(ideas, contentType) {
  console.log(`💾 Saving ${contentType} ideas...`)

  const typeDir = path.join(OUTPUT_DIR, contentType)
  await fs.mkdir(typeDir, { recursive: true })

  // Save with timestamp
  const date = new Date().toISOString().split('T')[0]
  const timestampedFile = path.join(typeDir, `${date}.json`)
  await fs.writeFile(timestampedFile, JSON.stringify(ideas, null, 2))

  // Save as latest
  const latestFile = path.join(typeDir, 'latest.json')
  await fs.writeFile(latestFile, JSON.stringify(ideas, null, 2))

  console.log(`✅ Saved to ${timestampedFile} and ${latestFile}`)
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Weekly Ideas Generator\n')

  if (!API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY environment variable is required')
    process.exit(1)
  }

  try {
    // Load all context
    const knowledge = await loadKnowledgeBase()
    const newsSources = await loadNewsSources()
    const hotnessConfig = await loadHotnessConfig()

    // Fetch fresh articles from RSS feeds
    const rssArticles = await fetchRSSArticles()

    if (rssArticles.length === 0) {
      console.error('❌ No articles fetched from RSS feeds. Cannot generate ideas.')
      process.exit(1)
    }

    // Generate ideas for each content type
    const contentTypes = ['short-form', 'long-form', 'blog']

    for (const contentType of contentTypes) {
      const ideas = await generateIdeas(contentType, knowledge, newsSources, hotnessConfig, rssArticles)
      await saveIdeas(ideas, contentType)
    }

    console.log('\n✨ All ideas generated successfully!')
  } catch (error) {
    console.error('\n❌ Generation failed:', error)
    process.exit(1)
  }
}

main()
