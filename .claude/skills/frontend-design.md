# Frontend Design: Distinctive UI

Create distinctive, production-grade interfaces that avoid generic "AI slop" aesthetics. Every UI decision must be intentional.

## Design Thinking

Before coding, commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick a clear direction — brutally minimal, maximalist, retro-futuristic, organic, luxury, editorial, brutalist, art deco, soft/pastel, industrial. Execute with precision.
- **Differentiation**: What makes this UNFORGETTABLE?

## Typography
- Body: Inter (project standard via `--font-sans`), use strong weight contrast (400 body, 600-800 headings)
- Code: JetBrains Mono (via `--font-mono`)
- Display/hero sections: bring in distinctive display fonts via next/font — avoid settling on the same choice twice
- Heading hierarchy: large size jumps, tight leading on headings, relaxed on body
- Pair a distinctive display font with Inter body for contrast

## Color System — Official Temenos Brand Palette
```
Warm Blue:  --color-warm-blue (#293276), --color-warm-blue-light, --color-warm-blue-mid   [Pantone 280 C]
Violet:     --color-violet (#8246AF), --color-violet-light, --color-violet-dark            [Pantone 2587 C]
Green:      --color-green (#5CB8B2), --color-green-light, --color-green-dark               [Pantone 7472 C]
Light Blue: --color-light-blue (#C9D9F2), --color-light-blue-muted                        [Pantone 2707 C]
Surfaces:   --color-surface, --color-surface-card, --color-surface-code, --color-surface-hover
Text:       --color-text-primary, --color-text-secondary, --color-text-muted, --color-text-inverse
Borders:    --color-border, --color-border-strong
Status:     --color-success, --color-warning, --color-error, --color-info
Phase:      --color-phase-design (violet), --color-phase-build (warm-blue), --color-phase-deploy (green), --color-phase-operate (amber)
```
- Never introduce raw hex values — extend `@theme` block in globals.css if needed
- Use `color-mix(in srgb, var(--color-green) 30%, transparent)` for opacity variants
- Dominant colors with sharp accents > timid, evenly-distributed palettes
- Light Blue works well for backgrounds, highlights, and secondary surfaces

## Motion (Framer Motion)
- All interactive elements must have entrance/exit animations
- Spring physics: `stiffness: 300-400, damping: 25-30` — not linear easing
- Stagger children: `delayChildren` + `staggerChildren` for lists/grids
- Respect `prefers-reduced-motion`
- High-impact moments: one well-orchestrated page load with staggered reveals > scattered micro-interactions
- Common patterns: fadeInUp for cards, scale for buttons, `layoutId` for shared transitions
- Use `motion` from `framer-motion` (already in project deps)

## Spatial Composition
- Break the grid intentionally: negative margins, overlapping elements, asymmetric padding
- Generous whitespace as a design element
- Cards: `rounded-xl`, shadow via `--shadow-card`, hover elevation via `--shadow-card-hover`
- Layout spacing: `--spacing-sidebar` (260px), `--spacing-header` (64px)
- Radius scale: `--radius-sm` (6), `--radius-md` (8), `--radius-lg` (12), `--radius-xl` (16)

## Backgrounds & Visual Details
- Gradient backgrounds: warm-blue → warm-blue-light for depth, or warm-blue → violet for energy
- Light Blue (#C9D9F2) for soft background washes and secondary panels
- Subtle border treatments: `border-green/30` on hover
- Surface hierarchy: surface < surface-card < surface-hover < surface-code
- Shadow progression: shadow-card < shadow-card-hover < shadow-panel
- Add atmosphere: gradient meshes, noise textures, geometric patterns, layered transparencies
- Custom decorative elements that match the chosen aesthetic direction

## Anti-Patterns — NEVER
- Generic gray-on-white cards with no personality
- Default Tailwind colors (gray-100, blue-500) instead of design tokens
- Static UIs with no motion
- Equal spacing everywhere — create rhythm through variation
- Stock icon-heavy layouts with no visual hierarchy
- Converging on the same font/color/layout across different components
- Overused generic fonts (Arial, Roboto, system defaults) for display text
- Cookie-cutter component patterns with no context-specific character

## Execution
Match complexity to the vision. Maximalist designs need elaborate code with extensive animations. Minimalist designs need restraint, precision, and careful spacing/typography. The right amount of complexity is the minimum needed for the aesthetic vision.

Every generation should feel genuinely designed for its context. No two UIs should look the same.
