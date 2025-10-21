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
 * Generate ideas for a specific content type using Claude
 */
async function generateIdeas(contentType, knowledge, newsSources, hotnessConfig, rssArticles) {
  console.log(`\n🤖 Generating ${contentType} ideas...`)

  // Format RSS articles for the prompt
  const articlesText = rssArticles.map(article =>
    `- "${article.title}" - ${article.source}\n  URL: ${article.url}`
  ).join('\n')

  const prompt = `You are an AI content strategist for OPEN SESSION, a design agency specializing in AI-powered creative workflows.

Today's date: ${new Date().toISOString().split('T')[0]}

**Your Task:**
Generate 3-5 content ideas for ${contentType} content based on the latest AI/design news articles below.

**Context - Brand Identity:**
${knowledge['core/OS_brand identity.md']}

**Context - Brand Messaging:**
${knowledge['core/OS_brand messaging.md']}

**Context - Writing Style for ${contentType}:**
${knowledge[`writing-styles/${contentType}.md`]}

**Context - Hotness Scoring System:**
${JSON.stringify(hotnessConfig, null, 2)}

**LATEST ARTICLES FROM RSS FEEDS (Use these URLs):**
${articlesText}

**Instructions:**
1. Review the articles above and identify 3-5 content ideas that would resonate with OPEN SESSION's audience (UX designers, creative directors, developers)
2. For EACH content idea, you MUST provide:
   - A compelling title (max 60 characters)
   - A brief description (max 120 characters)
   - Whether it should be "starred" (mark the top 1-2 most timely/valuable ideas as starred: true)
   - **3-5 SOURCE URLs** - Pick URLs from the articles above that are MOST RELEVANT to this specific idea

**CRITICAL RULES:**
- Use ONLY URLs from the articles list above
- Each idea should have 3-5 URLs that directly relate to that specific topic
- Pick the most relevant articles for each idea - match the topic!
- DO NOT create or modify URLs - copy them exactly from the list above

**Response Format (JSON only, no markdown):**
{
  "type": "${contentType}",
  "date": "${new Date().toISOString()}",
  "ideas": [
    {
      "title": "Claude's Computer Use Demo",
      "description": "Show AI controlling Figma directly - the future of design automation",
      "starred": true,
      "sources": [
        { "name": "TechCrunch AI", "url": "https://techcrunch.com/..." },
        { "name": "The Verge", "url": "https://www.theverge.com/..." },
        { "name": "Wired", "url": "https://www.wired.com/..." }
      ]
    }
  ]
}

Generate ideas now. Return ONLY valid JSON, no other text.`

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
