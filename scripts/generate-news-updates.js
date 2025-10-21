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
const DATA_DIR = path.join(PROJECT_ROOT, '.claude', 'data')
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public', 'data', 'news')

// Initialize clients
const anthropic = new Anthropic({ apiKey: API_KEY })
const rssParser = new Parser()

// RSS Feeds to fetch (focused on news/industry updates)
const RSS_FEEDS = [
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss' },
]

/**
 * Load news sources configuration
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
 * Fetch fresh articles from RSS feeds
 */
async function fetchRSSArticles() {
  console.log('📰 Fetching latest articles from RSS feeds...')

  const allArticles = []

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await rssParser.parseURL(feed.url)
      const articles = parsed.items.slice(0, 15).map(item => ({
        title: item.title,
        url: item.link,
        source: feed.name,
        pubDate: item.pubDate,
        description: item.contentSnippet || item.description
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
 * Format timestamp in required format: "MM/DD/YYYY, H:MM AM/PM"
 */
function formatTimestamp(date) {
  const d = new Date(date)
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  const year = d.getFullYear()
  let hours = d.getHours()
  const minutes = d.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12

  return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`
}

/**
 * Generate news updates for a specific category using Claude
 */
async function generateNewsUpdates(updateType, newsSources, rssArticles) {
  console.log(`\n🤖 Generating ${updateType} news updates...`)

  // Format RSS articles for the prompt
  const articlesText = rssArticles.map(article =>
    `- "${article.title}" - ${article.source} (${article.pubDate})\n  URL: ${article.url}\n  ${article.description?.substring(0, 200) || ''}`
  ).join('\n\n')

  const typeInstructions = updateType === 'weekly-update'
    ? 'Focus on THIS WEEK\'s announcements, releases, and important developments. These are things happening NOW that designers and creators need to know about immediately.'
    : 'Focus on UPCOMING events, predictions, analyst forecasts, and things to watch for in the coming month. These are forward-looking insights and trends to keep in mind.'

  const prompt = `You are an AI news curator for OPEN SESSION, a design agency specializing in AI-powered creative workflows.

Today's date: ${new Date().toISOString().split('T')[0]}

**Your Task:**
Generate 3-5 news updates for "${updateType}" based on the latest AI/design news articles below.

**Category: ${updateType}**
${typeInstructions}

**Available News Sources:**
${newsSources}

**LATEST ARTICLES FROM RSS FEEDS:**
${articlesText}

**Instructions:**
1. Review the articles above and identify 3-5 ${updateType} news items
2. For EACH news update, you MUST provide:
   - A title (1-2 sentences that summarize the trend/announcement - be specific and informative)
   - A timestamp in the format "MM/DD/YYYY, H:MM AM/PM" (use the article's pubDate)
   - 2-4 SOURCE URLs from the articles above that are directly relevant to this update

**CRITICAL RULES:**
- Title should be 1-2 sentences that FULLY explain the news (no need for separate description)
- Use ONLY URLs from the articles list above
- Each update should have 2-4 URLs that directly relate to that specific topic
- Copy URLs exactly as they appear - DO NOT modify them
- Timestamp must use format: "MM/DD/YYYY, H:MM AM/PM" (e.g., "10/21/2025, 9:15 AM")
- Focus on AI, design tools, creative AI, and industry developments relevant to designers

**Response Format (JSON only, no markdown):**
{
  "type": "${updateType}",
  "date": "${new Date().toISOString()}",
  "updates": [
    {
      "title": "Figma announces AI-powered design tools that automatically generate design systems from existing components",
      "timestamp": "10/21/2025, 9:15 AM",
      "sources": [
        { "name": "Figma Blog", "url": "https://www.figma.com/..." },
        { "name": "The Verge", "url": "https://www.theverge.com/..." },
        { "name": "Designer News", "url": "https://www.designernews.co/..." }
      ]
    }
  ]
}

Generate news updates now. Return ONLY valid JSON, no other text.`

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

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const newsData = JSON.parse(jsonMatch[0])
    console.log(`✅ Generated ${newsData.updates.length} news updates`)

    return newsData
  } catch (error) {
    console.error(`❌ Failed to generate ${updateType} news:`, error.message)
    throw error
  }
}

/**
 * Save news updates to file
 */
async function saveNewsUpdates(newsData, updateType) {
  console.log(`💾 Saving ${updateType} news updates...`)

  const typeDir = path.join(OUTPUT_DIR, updateType)
  await fs.mkdir(typeDir, { recursive: true })

  // Save with timestamp
  const date = new Date().toISOString().split('T')[0]
  const timestampedFile = path.join(typeDir, `${date}.json`)
  await fs.writeFile(timestampedFile, JSON.stringify(newsData, null, 2))

  // Save as latest
  const latestFile = path.join(typeDir, 'latest.json')
  await fs.writeFile(latestFile, JSON.stringify(newsData, null, 2))

  console.log(`✅ Saved to ${timestampedFile} and ${latestFile}`)
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting News Updates Generator\n')

  if (!API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY environment variable is required')
    process.exit(1)
  }

  try {
    // Load context
    const newsSources = await loadNewsSources()

    // Fetch fresh articles from RSS feeds
    const rssArticles = await fetchRSSArticles()

    if (rssArticles.length === 0) {
      console.error('❌ No articles fetched from RSS feeds. Cannot generate news updates.')
      process.exit(1)
    }

    // Generate news updates for each category
    const updateTypes = ['weekly-update', 'monthly-outlook']

    for (const updateType of updateTypes) {
      const newsData = await generateNewsUpdates(updateType, newsSources, rssArticles)
      await saveNewsUpdates(newsData, updateType)
    }

    console.log('\n✨ All news updates generated successfully!')
    console.log('\n📝 Next steps:')
    console.log('   1. Review the generated news in public/data/news/')
    console.log('   2. Edit timestamps and sources as needed')
    console.log('   3. The news will automatically appear on your website')
  } catch (error) {
    console.error('\n❌ Generation failed:', error)
    process.exit(1)
  }
}

main()
