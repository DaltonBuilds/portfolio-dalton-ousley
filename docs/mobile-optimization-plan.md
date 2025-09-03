## Mobile Optimization Plan

### Goals
- **Mobile-first UX**: readable typography, logical stacking, no horizontal scroll.
- **Responsive media**: properly sized images via `next/image` with `sizes`/`priority`.
- **Accessible navigation**: usable mobile menu with keyboard and screen readers.
- **Performance**: improved LCP/CLS on mobile via image and layout fixes.

### High-priority tasks (in order)
1. **Adjust container padding and remove redundant page padding**
2. **Implement mobile navigation menu in `Header`**
3. **Add `sizes`/`priority` to `next/image` across blog header, cards, MDX**
4. **Make `BentoGrid` mobile-first (1 column, smaller row height)**
5. **Wrap footer link rows to avoid crowding**
6. **Tune `Hero` typography and bottom prompt behavior for small screens**
7. **Add viewport metadata to app layout**
8. **Scale MDX prose for mobile (prose-sm on small screens)**
9. **Audit sticky/absolute elements and prevent horizontal overflow**
10. **Run Lighthouse (mobile) and address any regressions**

---

### 1) Adjust container padding and remove redundant page padding
Problem: `tailwind.config.ts` sets `container.padding: "2rem"` and pages add `px-6 md:px-10`, producing cramped content on phones.

Recommended change (option A – global tuning):
```ts
// tailwind.config.ts
container: {
  center: true,
  padding: { DEFAULT: "1rem", md: "2rem" },
  screens: { "2xl": "1400px" },
}
```

Recommended change (option B – local cleanup):
- Remove mobile `px-6` from page/container wrappers; keep only `md:px-*` where necessary.
- Targets include: `src/app/blog/**`, `src/app/experience/page.tsx`, `src/app/projects/page.tsx`, and similar sections using `container ... px-6 md:px-10`.

Acceptance criteria:
- 320–390px widths show balanced margins, no truncated content.

### 2) Implement mobile navigation menu in `Header`
Problem: `nav` is `hidden md:flex`, so there is no mobile menu.

Add:
- A `md:hidden` button with `aria-label="Open menu"` and an accessible menu (dropdown or sheet) with `About, Experience, Projects, Blog`.
- Keep 44px+ touch targets.

File: `src/components/Header.tsx`

### 3) Add responsive `next/image` usage
Add `sizes` and `loading/priority`:

Blog post header image:
```tsx
// src/components/blog/BlogPostHeader.tsx
<Image
  src={post.image.src}
  alt={post.image.alt}
  width={800}
  height={384}
  className="w-full h-64 md:h-96 object-cover"
  sizes="(max-width: 768px) 100vw, 800px"
  priority
/>
```

Blog card image:
```tsx
// src/components/blog/BlogPostCard.tsx
<Image
  src={post.image.src}
  alt={post.image.alt}
  width={400}
  height={192}
  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
  sizes="(max-width: 768px) 100vw, 400px"
  loading="lazy"
/>
```

MDX images default:
```tsx
// src/components/mdx/CustomImage.tsx
<Image
  src={src}
  alt={alt}
  width={width || 800}
  height={height || 600}
  className={`w-full h-auto transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
  sizes={props?.sizes || "(max-width: 800px) 100vw, 800px"}
  onLoad={() => setIsLoading(false)}
  {...props}
/>
```

### 4) Make `BentoGrid` mobile-first
Default to one column and smaller auto row height:
```tsx
// src/components/ui/bento-grid.tsx
className={cn("grid w-full auto-rows-[12rem] grid-cols-1 gap-4", className)}
```

### 5) Wrap footer link rows for small screens
Prevent crowding/truncation with wrapping and gaps:
```tsx
// src/components/Footer.tsx
<div className="flex flex-wrap gap-x-6 gap-y-2"> ... </div>
```
(Apply to both link rows.)

### 6) Tune `Hero` typography and bottom prompt for small screens
Use fluid text sizes and conditionally hide the absolute prompt on very small screens:
```tsx
// src/components/Hero.tsx
<h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">...</h1>
<h2 className="text-xl sm:text-2xl md:text-4xl font-semibold ...">...</h2>
// For the bottom prompt container
<div className="absolute bottom-10 left-1/2 -translate-x-1/2 sm:flex hidden ..."> ... </div>
```

### 7) Add viewport metadata
Ensure a standard mobile viewport is set:
```ts
// src/app/layout.tsx
export const viewport = { width: "device-width", initialScale: 1 };
```

### 8) Scale MDX prose for mobile
Improve legibility on phones:
```tsx
// src/components/mdx/MDXContent.tsx
<div className="prose prose-gray dark:prose-invert max-w-none prose-sm sm:prose-base md:prose-lg">
  <MDXComponent components={components} />
</div>
```

### 9) Sticky/absolute audit to prevent overflow
- Verify sticky timelines/absolutes at 320–390px widths don’t cause horizontal scrolling.
- Where needed, ensure containers have `max-w-full` and content respects `overflow-hidden`.

### 10) Lighthouse (mobile) pass
- Run Lighthouse mobile. Focus on: LCP image priority/sizes, CLS from layout shifts, and overall image bytes.
- Address flagged items; re-test.

---

### QA checklist
- **No horizontal scroll** at 320px.
- **Typography legible** at 320–390px (body ~16px+, headings scaled appropriately).
- **Images properly sized** on mobile (`sizes` verified in devtools, no huge downloads).
- **Mobile menu** opens/closes via keyboard and tap; focus trap works if using a drawer.
- **Touch targets** ≥44px; buttons/links easy to tap.
- **CLS < 0.1** on mobile; **LCP ≤ ~2.5s** on a mid device with slow 4G.

### Tracking
- Work items are tracked in the project TODOs. Complete items in order; re-run Lighthouse after items 1–5 and again at the end.



