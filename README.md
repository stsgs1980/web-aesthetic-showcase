# Web Aesthetic Showcase

Интерактивный showcase 6 визуальных стилей для веб-проектов. Каждый стиль трансформирует всю страницу — от CRT-терминала до чистого минимализма.


[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square)](https://www.typescriptlang.org)
[![Tailwind_CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square)](https://tailwindcss.com)
[![Bun](https://img.shields.io/badge/Bun-000000?style=flat-square)](https://bun.sh)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## Стили

| Стиль | Визуальный язык | Реализованные интерактивные элементы |
|-------|----------------|--------------------------------------|
| **Retro Terminal** | Amber CRT · scanlines · boot sequence | 11 команд (`help`, `matrix`, `sysinfo`, `whoami`, `echo`...) |
| **Brutalist Shell** | Raw borders · high contrast · monospace | 3 таба + рабочий guestbook |
| **CLI / Command** | Catppuccin Mocha IDE · file explorer | Файловое дерево (5 файлов) · подсветка синтаксиса · mini-terminal |
| **Sci-Fi HUD** | Cyan holographic · radar · telemetry | 4 live-панели · анимированный радар · system log |
| **Code Art** | Material Theme · line highlighting | Анимированная подсветка строк · поэтический код |
| **Clean Modern** | Whitespace · neutral palette · bento grid | Hover-состояния · design tokens · component lab |


## Технологии

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Components:** shadcn/ui (New York)
- **Icons:** Lucide React
- **State:** React hooks (useState, useEffect, useRef, useCallback, useMemo)
- **ORM:** Prisma (SQLite)
- **Runtime:** Bun


## Установка и запуск

```bash
## Клонировать репозиторий
git clone https://github.com/Sts8987/Web-Aesthetic-Showcase.git
cd Web-Aesthetic-Showcase

## Установить зависимости
bun install

## Применить схему базы данных
bun run db:push

## Запустить dev server
bun run dev
```

Открыть [http://localhost:3000](http://localhost:3000).


## Структура проекта

```css
src/
├── app/
│   ├── page.tsx          ← Весь showcase (6 стилей + hero + switcher)
│   ├── layout.tsx        ← Metadata · шрифты · глобальная обёртка
│   └── globals.css       ← Keyframes · scanline · blink анимации
├── components/ui/        ← shadcn/ui компоненты
├── hooks/                ← use-mobile · use-toast
└── lib/
    ├── db.ts             ← Prisma client
    └── utils.ts          ← cn() helper
```


## Архитектура

Единая страница (`page.tsx`) содержит 6 полноценных визуальных компонент, переключаемых через стильные pills в sticky header.

Каждый стиль следует **единой структуре контента**:

1. **Header** — название и описание стиля
2. **Interactive Demo** — работающий интерактивный элемент
3. **Когда использовать** — 4 сценария применения (аккордеон)
4. **Ключевые особенности** — 4 свойства стиля (аккордеон)


## Лицензия

MIT


## Features

- Feature 1 - description
- Feature 2 - description


## Tech Stack

- **Framework** - Next.js
- **Language** - TypeScript
- **Styling** - Tailwind CSS, CSS
- **Database** - Prisma, SQLite
- **Libraries** - shadcn/ui
- **Tools** - React, Bun


## Getting Started

### Prerequisites

- Node.js 20+ or Bun

### Installation

```bash
git clone https://github.com/stsgs1980/web-aesthetic-showcase.git
cd web-aesthetic-showcase
bun install
```

### Run

```bash
bun run dev
```

## License

[MIT](LICENSE)

---
Built with: Next.js + React + TypeScript + Tailwind CSS
