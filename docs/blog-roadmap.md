# 🚀 Modern Blog Implementation Roadmap for Dalton Ousley's Portfolio

This roadmap outlines the phased development of a personal blog section for daltonousley.com using **Velite + MDX** with **Next.js 15 App Router**. Features rich markdown content, advanced filtering, author profiles, SEO optimization, and modern UX patterns.

> **Tech Stack:** Next.js 15 App Router + Velite + MDX + TypeScript + Tailwind CSS

---

## ✅ Phase 1: Modern Blog Infrastructure Setup (Velite + MDX)

**Goal:** Establish the content management system with type-safe schema and App Router integration.

### 🔧 Core Infrastructure:
- [ ] Install dependencies:
  - `velite`, `@velite/cli`, `shiki`, `reading-time`, `gray-matter`
  - `@next/mdx`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`
- [ ] Create `/content/blog/` directory structure:
  ```
  content/
  ├── blog/
  │   ├── hello-world.mdx
  │   └── categories/
  ├── authors/
  │   └── dalton-ousley.json
  └── config/
      └── blog-config.json
  ```
- [ ] Configure `velite.config.ts` with comprehensive schema:
  - BlogPost schema (title, slug, date, author, categories, tags, etc.)
  - Author schema (name, bio, avatar, social links)
  - Category schema (name, slug, description, color)
- [ ] Update `next.config.ts` to enable Velite and MDX
- [ ] Set up TypeScript types generation

### 🎯 Content Schema Features:
- [ ] **Draft/Published status** with build-time filtering
- [ ] **Reading time estimation** 
- [ ] **Table of contents** auto-generation
- [ ] **Featured image** with alt text and optimization
- [ ] **SEO metadata** (description, keywords, og:image)
- [ ] **Blog post series** support
- [ ] **Related posts** by tags/categories

---

## 🏗️ Phase 2: App Router Blog Architecture

**Goal:** Build modern App Router pages with server components and optimal performance.

### 🔧 App Router Structure:
- [ ] Create App Router blog structure:
  ```
  app/
  ├── blog/
  │   ├── page.tsx              # Blog index with filtering
  │   ├── [slug]/
  │   │   └── page.tsx          # Individual blog posts
  │   ├── category/
  │   │   └── [category]/
  │   │       └── page.tsx      # Category pages
  │   ├── tag/
  │   │   └── [tag]/
  │   │       └── page.tsx      # Tag pages
  │   ├── author/
  │   │   └── [author]/
  │   │       └── page.tsx      # Author pages
  │   └── loading.tsx           # Loading UI
  ```

### 🎨 Blog Components:
- [ ] `BlogLayout.tsx` - Main blog layout with sidebar
- [ ] `BlogPostCard.tsx` - Reusable post preview card
- [ ] `BlogPostHeader.tsx` - Post title, meta, author info
- [ ] `BlogPostContent.tsx` - MDX content with custom components
- [ ] `BlogSidebar.tsx` - Categories, tags, recent posts
- [ ] `BlogNavigation.tsx` - Previous/next post navigation
- [ ] `TableOfContents.tsx` - Auto-generated TOC
- [ ] `AuthorCard.tsx` - Author bio and social links

### 🔧 MDX Components:
- [ ] Custom MDX components in `components/mdx/`:
  - `CodeBlock.tsx` with Shiki syntax highlighting
  - `Callout.tsx` for info/warning/error boxes
  - `Image.tsx` with Next.js optimization
  - `VideoEmbed.tsx` for YouTube/Vimeo
  - `TweetEmbed.tsx` for Twitter integration
  - `FileTree.tsx` for directory structures

---

## 🎯 Phase 3: Advanced Features & UX

**Goal:** Implement filtering, search, and enhanced user experience features.

### 🔍 Filtering & Search:
- [ ] **Advanced filtering system:**
  - Filter by categories, tags, authors, date ranges
  - URL-based filter state (`/blog?category=devops&tag=kubernetes`)
  - Clear filter states and reset functionality
- [ ] **Client-side search** with Fuse.js:
  - Search titles, content, tags, and authors
  - Highlight search terms in results
  - Search suggestions and autocomplete
- [ ] **Pagination system:**
  - Server-side pagination for performance
  - "Load more" and traditional pagination options
  - SEO-friendly pagination URLs

### 📱 Enhanced UX:
- [ ] **Loading states:**
  - Skeleton loaders for blog cards
  - Progressive image loading with blur placeholders
  - Smooth transitions between pages
- [ ] **Interactive elements:**
  - Copy link to heading functionality
  - Social sharing buttons (Twitter, LinkedIn, Reddit)
  - Print-friendly CSS styles
  - Estimated reading progress indicator

### 🖼️ Media & Performance:
- [ ] **Image optimization pipeline:**
  - Auto-generate responsive images
  - WebP/AVIF format support
  - Lazy loading with intersection observer
- [ ] **Performance optimizations:**
  - Bundle splitting for blog-specific code
  - Prefetch related posts
  - Service worker for offline reading (optional)

---

## 🚀 Phase 4: SEO, Analytics & Content Distribution

**Goal:** Maximize discoverability and track engagement metrics.

### 🎯 SEO & Metadata:
- [ ] **Comprehensive SEO setup:**
  - Dynamic metadata generation for all blog pages
  - JSON-LD structured data for articles and authors
  - Open Graph and Twitter Card optimization
  - Canonical URLs and proper meta tags
- [ ] **Sitemap generation:**
  - Auto-generate XML sitemap for blog posts
  - Include categories, tags, and author pages
  - Update sitemap on content changes

### 📊 Analytics & Tracking:
- [ ] **Content analytics:**
  - Page view tracking (Google Analytics/Plausible)
  - Reading completion rates
  - Popular posts and trending topics
  - Social sharing metrics
- [ ] **RSS & Feeds:**
  - Generate RSS/Atom feeds for all posts
  - Category-specific RSS feeds
  - JSON feed format support

### 🔗 Content Distribution:
- [ ] **Blog widgets for other pages:**
  - `LatestPostsWidget.tsx` for homepage
  - `RelatedPostsWidget.tsx` for project pages
  - `FeaturedPostBanner.tsx` for announcements
- [ ] **Newsletter integration:**
  - Email signup forms in blog posts
  - RSS-to-email automation setup
  - Content digest generation

---

## ✨ Phase 5: Advanced Features & Automation

**Goal:** Implement cutting-edge features and content management automation.

### 🤖 Content Management:
- [ ] **CLI tooling:**
  - `npm run blog:new` - Generate new blog post template
  - `npm run blog:draft` - Preview draft posts locally
  - `npm run blog:publish` - Publish drafts with validation
- [ ] **Content validation:**
  - Frontmatter schema validation
  - Broken link detection
  - Image optimization verification
  - SEO score calculation

### 💬 Community Features:
- [ ] **Comments system:**
  - Giscus (GitHub Discussions) integration
  - Comment moderation and spam filtering
  - Email notifications for new comments
- [ ] **Engagement features:**
  - Post reactions (like/dislike)
  - Bookmark/save for later functionality
  - Share post via Web Share API

### 🔮 Future Enhancements:
- [ ] **Content personalization:**
  - Reading history tracking
  - Recommended posts based on interests
  - Tag following and notifications
- [ ] **Multi-language support:**
  - i18n setup for blog interface
  - Multi-language post support
  - Language-specific RSS feeds

---

## 📁 Enhanced Blog Post Template

### Example: `content/blog/debugging-kubernetes-networking.mdx`

```mdx
---
title: "Debugging Kubernetes Networking Issues with Prometheus"
slug: "debugging-kubernetes-networking-prometheus"
description: "Learn advanced techniques for troubleshooting Kubernetes networking problems using Prometheus metrics and Grafana dashboards."
date: "2025-01-15"
lastModified: "2025-01-15"
author: "dalton-ousley"
categories: ["kubernetes", "observability"]
tags: ["kubernetes", "prometheus", "grafana", "networking", "debugging"]
series: "kubernetes-troubleshooting"
seriesOrder: 3
featured: true
draft: false
image: 
  src: "/blog/images/k8s-networking-debug.png"
  alt: "Kubernetes networking debugging dashboard"
seo:
  keywords: ["kubernetes networking", "prometheus monitoring", "container networking"]
  ogImage: "/blog/images/k8s-networking-debug-og.png"
---

import { Callout } from '@/components/mdx/Callout'
import { CodeBlock } from '@/components/mdx/CodeBlock'
import { FileTree } from '@/components/mdx/FileTree'

<Callout type="info">
This is part 3 of our Kubernetes troubleshooting series. Check out [part 1](/blog/kubernetes-troubleshooting-basics) and [part 2](/blog/kubernetes-pod-debugging) first.
</Callout>

When Kubernetes networking goes wrong, it can be challenging to pinpoint the exact issue...

## Network Policy Debugging

<CodeBlock language="bash" filename="debug-network-policies.sh">
```bash
# Check network policies affecting a pod
kubectl get networkpolicies -A
kubectl describe networkpolicy <policy-name> -n <namespace>
```
</CodeBlock>

## Prometheus Metrics for Network Debugging

<FileTree>
- monitoring/
  - prometheus/
    - rules/
      - network-alerts.yaml
    - dashboards/
      - network-overview.json
</FileTree>

...rest of the blog content...
```

---

## 🎯 Success Metrics

**Phase 1-2 Complete:** Basic blog functionality with modern architecture  
**Phase 3-4 Complete:** Full-featured blog with SEO and analytics  
**Phase 5 Complete:** Advanced blog platform with automation and community features

**Target Timeline:** 4-6 weeks for Phases 1-4, Phase 5 as ongoing enhancements

---

## 📁 Example Blog Post Template (`content/blog/example-post.mdx`)

```mdx
---
title: "Debugging VPNs with Prometheus"
slug: "debugging-vpn-prometheus"
date: "2025-08-25"
summary: "Learn how to use Prometheus and Grafana to troubleshoot VPN performance issues."
tags: ["Prometheus", "Grafana", "VPN", "Observability"]
---

Welcome to the tutorial!

```bash
sudo tcpdump -i tun0 port 443
