# BOS-1.0

> **Note:** This is Brand Operating System version 1 — a purely experimental test exploring how Figma, MCP servers, Claude Code, and Cursor can work together to build and maintain a living design system. This repo served as our sandbox for vibe-coding workflows and AI-driven design tooling before evolving into BOS-2.0 and beyond.

**A design system built for both humans and AI to interpret.**

BRAND-OS is not just a traditional design system—it's a comprehensive brand operating system designed for the present and the future. Built as a living, breathing repository that serves both human designers and AI agents, this system bridges the gap between pixel-perfect design and machine-readable brand intelligence.

## 🎯 Philosophy

We're designing for two audiences simultaneously:

**For Humans:** A beautiful, intuitive landing page to quickly access brand assets—logos, colors, typography, identity guidelines, and design resources. Everything you need to represent the brand, organized and accessible.

**For AI Agents:** A highly structured, semantically rich repository that AI can parse, understand, and reference. As computational costs decrease and context windows expand, AI's ability to help brands produce content will continue to grow. BRAND-OS is an investment in both present workflows and future AI-powered brand production.

This dual-purpose approach means your design system doesn't just document your brand—it actively enables both humans and machines to create on-brand work at scale.

## 🏗️ Built on Solid Foundations

- **Figma-First:** Mirrors our Figma design system exactly, ensuring design-development parity
- **Claude Integration:** Comprehensive AI implementation that understands brand context, generates content ideas, and curates news
- **Token-Based:** Design tokens power consistency across all brand touchpoints
- **Component-Driven:** Modular, reusable components built with React + TypeScript
- **Future-Proof:** Structured for AI readability while maintaining human usability

## ✨ Key Features

### 🎨 Brand Identity
- **Logo System** - Complete logo variations with download options
- **Color Palette** - Interactive color system with design tokens
- **Typography** - Font specimens and usage guidelines
- **Art Direction** - Visual language and aesthetic principles

### 💡 AI-Powered Features
- **Inspiration Engine** - Daily content ideas generated and filtered by category (Short-Form, Long-Form, Blogging)
- **News Curation** - Auto-generated news updates (Weekly Update & Monthly Outlook) from industry sources
- **Claude Knowledge Base** - Comprehensive `.claude/` directory with brand messaging, writing styles, and strategic context

### 📦 Design Resources
- **Downloadable Assets** - Icons, logos, fonts, textures
- **Figma Files** - Direct access to source design files
- **Brand Guidelines** - Complete brand documentation
- **Code Snippets** - Reusable component examples

### 🤖 AI Integration
- **`/news-update`** - Generate fresh news summaries from RSS feeds
- **`/content-ideas`** - AI-generated content ideas aligned with brand pillars
- **News Source Management** - Add URLs directly through the UI, auto-categorized by AI
- **Automated Generation Scripts** - `npm run ideas:generate` and `npm run news:generate`

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Generate AI content ideas
npm run ideas:generate

# Generate news updates
npm run news:generate
```

Visit `http://localhost:5173` to see the design system in action.

## 📁 Project Structure

```
├── .claude/                    # Claude AI configuration
│   ├── commands/              # Custom slash commands
│   ├── config/                # AI behavior settings
│   ├── data/                  # News sources and data
│   └── knowledge/             # Brand knowledge base
│       ├── core/              # Brand identity, messaging, art direction
│       └── writing-styles/    # Content voice guidelines
├── public/
│   ├── data/
│   │   ├── news/              # Generated news updates
│   │   │   ├── weekly-update/
│   │   │   └── monthly-outlook/
│   │   └── weekly-ideas/      # Generated content ideas
│   │       ├── short-form/
│   │       ├── long-form/
│   │       └── blog/
│   └── assets/                # Static brand assets
├── scripts/
│   ├── generate-weekly-ideas.js    # AI content idea generation
│   └── generate-news-updates.js    # AI news curation
├── src/
│   ├── components/
│   │   ├── identity/          # Logo, colors, typography
│   │   ├── sections/          # Page sections
│   │   ├── news/              # News components
│   │   └── weekly-ideas/      # Inspiration components
│   ├── styles/                # Global styles & tokens
│   └── types/                 # TypeScript definitions
└── package.json
```

## 🎨 Design Tokens

Design tokens are defined in Figma and synced via:
```bash
npm run tokens:sync
```

This ensures perfect alignment between design and code.

## 🤖 Claude Configuration

The `.claude/` directory contains everything AI needs to understand your brand:

- **`knowledge/core/`** - Brand identity, messaging, art direction guidelines
- **`knowledge/writing-styles/`** - Voice and tone for different content types
- **`commands/`** - Custom AI commands like `/news-update`
- **`data/`** - News sources and reference data

This structure allows AI to generate on-brand content, understand your visual language, and assist with strategic decisions.

## 🌐 Deployment

```bash
# Deploy to GitHub Pages
npm run deploy
```

The site is automatically built and published to `gh-pages` branch.

## 🔧 Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Anthropic Claude** - AI integration
- **RSS Parser** - News aggregation

## 📖 Why Open Source?

BRAND-OS is built primarily for our brand, but we're open-sourcing it so other designers and agencies can:

- **Learn from our approach** to AI-integrated design systems
- **Copy and adapt** components and patterns for their own brands
- **Contribute ideas** on how to make design systems more AI-friendly
- **See real implementation** of Claude AI in a production environment

This is our contribution to the design community as we collectively figure out how to design for both humans and AI.

## 🔮 Designing for the Future

As AI inference costs drop and context windows expand, the ability of AI to help brands produce content will grow exponentially. By structuring your design system for AI readability *today*, you're investing in:

- **Scalable content production** - AI that understands your brand can help create more, faster
- **Consistent brand application** - Machines enforcing brand guidelines across all touchpoints
- **Strategic automation** - AI handling routine brand decisions while humans focus on creative strategy
- **Future-proof infrastructure** - Ready for whatever AI capabilities emerge next

BRAND-OS isn't just a design system. It's a brand operating system for the AI age.

---

**Built by [OPEN SESSION](https://opensession.com)**
**Powered by Claude AI**

## 📄 License

MIT License - Feel free to use, modify, and learn from this project.
