# Expand on Hover Component Integration Guide

## ✅ Integration Complete

The hover-expand components have been successfully integrated into your React + Vite + TypeScript + Tailwind CSS project.

## 📁 Files Created

1. **`src/components/ui/expand-on-hover.tsx`** - Horizontal gallery (expands width on hover)
2. **`src/components/ui/expand-on-hover-demo.tsx`** - Vertical gallery (expands height on hover)

## 📦 Dependencies Installed

- ✅ `swiper` - Required for the component (already installed)
- ✅ `framer-motion` - Already present in your project
- ✅ All Swiper CSS imports included in the component

## 🎨 Project Compatibility

Your project already had everything needed:
- ✅ React 19 + TypeScript
- ✅ Tailwind CSS configured
- ✅ `cn()` utility at `src/lib/utils.ts`
- ✅ Path aliases configured (`@/*`)
- ✅ Component structure at `src/components/ui/`

## 🚀 Usage Examples

### Horizontal Gallery (Expands Width)

```tsx
import { HoverExpand_001, Skiper52 } from '@/components/ui/expand-on-hover'

// Option 1: Use the pre-built demo component
function MyPage() {
  return <Skiper52 />
}

// Option 2: Use with custom images
function CustomGallery() {
  const myImages = [
    { src: "/path/to/image1.jpg", alt: "Description 1", code: "#01" },
    { src: "/path/to/image2.jpg", alt: "Description 2", code: "#02" },
    { src: "/path/to/image3.jpg", alt: "Description 3", code: "#03" },
  ]

  return (
    <div className="flex h-screen w-full items-center justify-center bg-brand-vanilla">
      <HoverExpand_001 images={myImages} className="custom-class" />
    </div>
  )
}
```

### Vertical Gallery (Expands Height)

```tsx
import HoverExpandDefault from '@/components/ui/expand-on-hover-demo'

function MyPage() {
  return (
    <div className="min-h-screen bg-brand-charcoal py-20">
      <HoverExpandDefault />
    </div>
  )
}
```

### Custom Implementation

```tsx
import { HoverExpand_001 } from '@/components/ui/expand-on-hover'

function BrandGallery() {
  const brandImages = [
    {
      src: "/assets/brand/logo-evolution-1.jpg",
      alt: "Brand Evolution Phase 1",
      code: "2020"
    },
    {
      src: "/assets/brand/logo-evolution-2.jpg",
      alt: "Brand Evolution Phase 2",
      code: "2021"
    },
    {
      src: "/assets/brand/logo-evolution-3.jpg",
      alt: "Brand Evolution Phase 3",
      code: "2022"
    },
  ]

  return (
    <section className="container-responsive py-20">
      <h2 className="text-h2-mobile md:text-h2-tablet xl:text-h2-desktop font-display mb-12">
        Our Brand Journey
      </h2>
      <HoverExpand_001 images={brandImages} />
    </section>
  )
}
```

## 🎨 Customization with Your Brand Colors

You can easily adapt the components to use your brand colors:

```tsx
// Modify the background gradient overlay
className="absolute h-full w-full bg-gradient-to-t from-brand-charcoal/60 to-transparent"

// Modify the container background
className="flex h-full w-full items-center justify-center bg-brand-vanilla"

// Modify text colors
className="text-xs text-brand-aperol/70"
```

## 📱 Responsive Behavior

The components are fully responsive:
- **Desktop**: Smooth hover interactions
- **Mobile/Touch**: Click/tap to expand
- **Tablet**: Works with both touch and hover

## 🔧 Component Props

### HoverExpand_001 Props

```typescript
interface HoverExpand_001Props {
  images: {
    src: string      // Image URL
    alt: string      // Alt text for accessibility
    code: string     // Label/code displayed on active image
  }[]
  className?: string // Additional Tailwind classes
}
```

## 💡 Integration Tips

1. **Image Optimization**: Use optimized images (WebP format recommended)
2. **Lazy Loading**: The demo component already includes lazy loading
3. **Error Handling**: Fallback images are configured in the demo
4. **Accessibility**: Alt text is required for each image

## 🎯 Example: Full Page Integration

```tsx
// src/pages/Gallery.tsx
import HoverExpandDefault from '@/components/ui/expand-on-hover-demo'
import { HoverExpand_001 } from '@/components/ui/expand-on-hover'

export default function GalleryPage() {
  const portfolioImages = [
    { src: "/portfolio/project-1.jpg", alt: "Project Alpha", code: "2024" },
    { src: "/portfolio/project-2.jpg", alt: "Project Beta", code: "2024" },
    { src: "/portfolio/project-3.jpg", alt: "Project Gamma", code: "2023" },
  ]

  return (
    <main className="min-h-screen bg-brand-charcoal">
      {/* Hero Section */}
      <section className="container-responsive py-20">
        <h1 className="text-d1-mobile md:text-d1-tablet xl:text-d1-desktop font-display text-brand-vanilla">
          Our Portfolio
        </h1>
      </section>

      {/* Vertical Gallery */}
      <section className="py-20">
        <HoverExpandDefault />
      </section>

      {/* Horizontal Gallery with Custom Images */}
      <section className="py-20 bg-brand-vanilla">
        <div className="container-responsive">
          <h2 className="text-h2-mobile md:text-h2-tablet font-display text-brand-charcoal mb-12">
            Featured Work
          </h2>
        </div>
        <HoverExpand_001 images={portfolioImages} />
      </section>
    </main>
  )
}
```

## 🐛 Troubleshooting

### Issue: Images not loading
**Solution**: Ensure image paths are correct and accessible

### Issue: Animations not working
**Solution**: Verify `framer-motion` is installed (`npm list framer-motion`)

### Issue: TypeScript errors
**Solution**: The `@/*` path alias is configured in `tsconfig.app.json`

### Issue: Swiper CSS not loading
**Solution**: The CSS imports are already included in the component files

## 📚 Additional Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Swiper Docs](https://swiperjs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

## 🎨 Adapting to Your Design System

The components use standard Tailwind classes, making them easy to adapt:

```tsx
// Example: Using your typography system
<p className="text-caption text-brand-aperol">
  {image.code}
</p>

// Example: Using your spacing tokens
<div className="gap-1 p-4">
  {/* Your content */}
</div>

// Example: Custom border radius
className="rounded-3xl" // Already matches your design system
```

---

**Need Help?** These components are ready to use. Just import and customize as needed!
