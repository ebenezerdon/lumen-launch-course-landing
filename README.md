# Lumen Launch – Course Landing

Lumen Launch is a production-quality digital course launch landing page built by [Teda.dev](https://teda.dev), the AI app builder for everyday problems. It showcases a beautiful hero, instructor bio, curriculum outline, cohort timeline, testimonials, and tiered pricing, with thoughtful interactions and mobile-first polish.

## Features
- Centered, high-impact hero with clear value and CTAs
- Instructor bio with animated impact metrics
- Curriculum outline with accessible accordion and expand all
- Cohort timeline with horizontal scroll, snap, and keyboard-friendly controls
- Testimonials carousel with autoplay that respects reduced motion
- Tiered pricing cards with monthly toggle and localStorage persistence
- Join waitlist modal with validation and saved user details
- WCAG-friendly colors, keyboard navigation, and semantic HTML

## Tech Stack
- Tailwind CSS via CDN
- jQuery 3.7.x
- Modular JavaScript in `scripts/` with a single global namespace `window.App`
- LocalStorage persistence for user selections and progress

## Project Structure
- `index.html` – Landing page and app entry
- `styles/main.css` – Custom CSS for background, animations, and components
- `scripts/helpers.js` – Storage and utilities
- `scripts/ui.js` – Rendering and interactivity
- `scripts/main.js` – App bootstrap

## Getting Started
1. Open `index.html` in your browser.
2. Interact with the sections. Your preferences like pricing mode, chosen tier, expanded curriculum, and last viewed timeline are saved automatically.

## Accessibility
- Buttons and toggles are keyboard and screen reader friendly.
- Animations respect `prefers-reduced-motion`.
- Color contrast meets WCAG 2.1 AA.

## Notes
- Images are loaded from Unsplash and may be replaced with your own.
- Update text content, pricing, and dates in `scripts/ui.js` under `App.data`.
