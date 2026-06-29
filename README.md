# Web Aesthetic Showcase

Interactive showcase of 6 visual styles for web projects, each transforming the entire page from a CRT terminal to clean minimalism.

[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square)](https://www.typescriptlang.org)
[![Tailwind_CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square)](https://tailwindcss.com)
[![Bun](https://img.shields.io/badge/Bun-000000?style=flat-square)](https://bun.sh)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## Features

- 6 distinct visual styles: Retro Terminal, Brutalist Shell, CLI/Command, Sci-Fi HUD, Code Art, Clean Modern
- Retro Terminal style with amber CRT display, scanlines, and 11 terminal commands (help, matrix, sysinfo, whoami, echo)
- Brutalist Shell style with raw borders, high contrast, 3 tabs, and a working guestbook
- CLI/Command style with Catppuccin Mocha IDE theme, file tree explorer, syntax highlighting, and mini-terminal
- Sci-Fi HUD style with cyan holographic panels, animated radar, telemetry, and system log
- Code Art style with Material Theme, animated line highlighting, and poetic code display
- Clean Modern style with whitespace, neutral palette, bento grid, hover states, design tokens, and component lab
- Style switching via pills in a sticky header
- Unified content structure for each style: header, interactive demo, use cases, and key characteristics
- Prisma SQLite database for persistent data (guestbook)

## Tech Stack

- **Framework** - Next.js 16 (App Router)
- **Language** - TypeScript 5
- **Styling** - Tailwind CSS 4
- **Components** - shadcn/ui (New York)
- **Icons** - Lucide React
- **State** - React hooks (useState, useEffect, useRef, useCallback, useMemo)
- **ORM** - Prisma (SQLite)
- **Runtime** - Bun

## Getting Started

### Prerequisites

- Node.js 20+ or Bun

### Installation

```bash
git clone https://github.com/stsgs1980/web-aesthetic-showcase.git
cd web-aesthetic-showcase
bun install
bun run db:push
```

### Run

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

A single page (`page.tsx`) contains 6 full visual components switchable via style pills in a sticky header. Each style follows a unified content structure:

- Header with style name and description
- Interactive demo with a working element
- Use cases section with 4 scenarios (accordion)
- Key characteristics section with 4 properties (accordion)

## Project Structure

- `src/app/page.tsx` - Full showcase with 6 styles, hero section, and style switcher
- `src/app/layout.tsx` - Metadata, fonts, and global wrapper
- `src/app/globals.css` - Keyframes, scanline, and blink animations
- `src/components/ui/` - shadcn/ui components
- `src/hooks/` - use-mobile and use-toast hooks
- `src/lib/db.ts` - Prisma client
- `src/lib/utils.ts` - cn() helper

## License

[MIT](LICENSE)

---
Built with: Next.js + React + TypeScript + Tailwind CSS