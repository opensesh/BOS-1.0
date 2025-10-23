# BRAND-OS Automation Setup

This document explains how the automated content generation works and how to set it up.

## Overview

BRAND-OS has automated workflows that generate fresh content daily:
- **Weekly Ideas** (Inspiration section): Short-form, long-form, and blog content ideas
- **News Updates** (News section): Weekly updates and monthly outlooks

## How It Works

### GitHub Actions Workflow
The workflow runs **daily at 9 AM Pacific Time (5 PM UTC)** and:
1. Fetches latest AI/design news from RSS feeds (TechCrunch, The Verge, Wired)
2. Uses Claude AI to analyze articles and generate content ideas
3. Saves generated JSON files to `public/data/`
4. Commits and pushes changes to the repository
5. GitHub Pages automatically rebuilds and deploys

## Setup Instructions

### Prerequisites
- Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com/))
- Repository admin access

### Step 1: Add GitHub Secret

**This is the CRITICAL step to fix workflow failures!**

1. Go to your GitHub repository: `https://github.com/opensesh/BRAND-OS`
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Configure:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Your Anthropic API key (starts with `sk-ant-api03-...`)
5. Click **Add secret**

### Step 2: Verify Workflow

1. Go to **Actions** tab in your GitHub repository
2. Find the **Generate Weekly Ideas** workflow
3. Click **Run workflow** to test manually
4. Check that it completes successfully

## Local Development

### Generate Ideas Locally

```bash
# Set your API key
export ANTHROPIC_API_KEY="sk-ant-api03-..."

# Generate weekly ideas (short-form, long-form, blog)
npm run ideas:generate

# Generate news updates (weekly-update, monthly-outlook)
npm run news:generate
```

### Testing Without API Key

The scripts will fail gracefully with helpful error messages if the API key is missing.

## File Structure

```
public/data/
├── weekly-ideas/
│   ├── short-form/
│   │   └── latest.json      # Instagram/TikTok post ideas
│   ├── long-form/
│   │   └── latest.json      # YouTube tutorial ideas
│   └── blog/
│       └── latest.json      # Thought leadership article ideas
└── news/
    ├── weekly-update/
    │   └── latest.json      # Weekly AI/design news
    └── monthly-outlook/
        └── latest.json      # Monthly trend outlooks
```

## Workflow Configuration

**Location:** `.github/workflows/daily-ideas.yml`

```yaml
schedule:
  - cron: '0 17 * * *'  # Daily at 9 AM Pacific (5 PM UTC)
workflow_dispatch:       # Allows manual triggering
```

## Troubleshooting

### Workflow Fails: "All jobs have failed"

**Cause:** Missing `ANTHROPIC_API_KEY` secret

**Fix:** Follow Step 1 above to add the secret to GitHub

### No Fresh Data on Website

**Causes:**
1. Workflow is failing (check GitHub Actions tab)
2. API key not set (see above)
3. GitHub Pages not rebuilding

**Fix:**
1. Add ANTHROPIC_API_KEY secret
2. Manually trigger workflow: Actions → Generate Weekly Ideas → Run workflow
3. Verify GitHub Pages deployment

### Local Generation Fails

```bash
❌ ERROR: ANTHROPIC_API_KEY environment variable is required
```

**Fix:**
```bash
export ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"
```

## Content Format Details

### Short-Form Ideas
- Specific post ideas (carousels, reels, static posts)
- 40% Tools, 30% Frameworks, 30% Abstract/Future
- Example: "Carousel: How design systems are evolving with AI"

### Long-Form Ideas
- Instructional YouTube tutorials (5-10 min)
- Step-by-step guides and demonstrations
- Example: "Tutorial: Building AI-powered design systems with LangChain"

### Blog Ideas
- Thought leadership & perspective pieces
- Strategic analysis and future trends
- Example: "Our perspective: Why AI job cuts signal the real design opportunity"

### News Updates
- Weekly summaries of AI/design developments
- Monthly trend outlooks
- All include source links for further reading

## API Usage

The workflow uses Claude Sonnet 4 via the Anthropic API:
- **Model:** `claude-sonnet-4-20250514`
- **Max tokens:** 4000 per generation
- **Temperature:** 0.7
- **Estimated cost:** ~$0.50-1.00 per day for all generations

## Security Notes

- API key is stored as encrypted GitHub Secret
- Never commit API keys to the repository
- Workflow only has write access to `public/data/` files
- All commits are signed by `github-actions[bot]`

## Support

If you continue to experience issues:
1. Check GitHub Actions logs for specific errors
2. Verify API key is valid at [console.anthropic.com](https://console.anthropic.com/)
3. Review this documentation
4. Open an issue on GitHub

---

**Last Updated:** October 2025
**Version:** 1.0
