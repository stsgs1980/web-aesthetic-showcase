# Web Aesthetic Showcase

Интерактивный showcase 6 визуальных стилей для веб-проектов. Каждый стиль трансформирует всю страницу — от CRT-терминала до чистого минимализма.

---

## Стили

| Стиль | Визуальный язык | Реализованные интерактивные элементы |
|-------|----------------|--------------------------------------|
| **Retro Terminal** | Amber CRT · scanlines · boot sequence | 11 команд (`help`, `matrix`, `sysinfo`, `whoami`, `echo`...) |
| **Brutalist Shell** | Raw borders · high contrast · monospace | 3 таба + рабочий guestbook |
| **CLI / Command** | Catppuccin Mocha IDE · file explorer | Файловое дерево (5 файлов) · подсветка синтаксиса · mini-terminal |
| **Sci-Fi HUD** | Cyan holographic · radar · telemetry | 4 live-панели · анимированный радар · system log |
| **Code Art** | Material Theme · line highlighting | Анимированная подсветка строк · поэтический код |
| **Clean Modern** | Whitespace · neutral palette · bento grid | Hover-состояния · design tokens · component lab |

---

## Технологии

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Components:** shadcn/ui (New York)
- **Icons:** Lucide React
- **State:** React hooks (useState, useEffect, useRef, useCallback, useMemo)
- **ORM:** Prisma (SQLite)
- **Runtime:** Bun

---

## Установка и запуск

```bash
# Клонировать репозиторий
git clone https://github.com/Sts8987/Web-Aesthetic-Showcase.git
cd Web-Aesthetic-Showcase

# Установить зависимости
bun install

# Применить схему базы данных
bun run db:push

# Запустить dev server
bun run dev
```

Открыть [http://localhost:3000](http://localhost:3000).

---

## Структура проекта

```
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

---

## Архитектура

Единая страница (`page.tsx`) содержит 6 полноценных визуальных компонент, переключаемых через стильные pills в sticky header.

Каждый стиль следует **единой структуре контента**:

1. **Header** — название и описание стиля
2. **Interactive Demo** — работающий интерактивный элемент
3. **Когда использовать** — 4 сценария применения (аккордеон)
4. **Ключевые особенности** — 4 свойства стиля (аккордеон)

---

## Лицензия

MIT
