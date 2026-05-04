'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

/* ═══════════════════════════════════════════════════════════════════════
   STYLE SWITCHER SHOWCASE
   6 styles. Each transforms the ENTIRE page.
   Unified content structure — same info, different visual language.
   ═══════════════════════════════════════════════════════════════════════ */

/* ─── Type Scale ─── */
const mono = { fontFamily: "'Geist Mono', ui-monospace, SFMono-Regular, monospace" }
const sans = { fontFamily: "'Geist Sans', ui-sans-serif, system-ui, -apple-system, sans-serif" }

/* ─── Layout Constants ─── */
const TERMINAL_HEIGHT = '420px'
const IDE_PANEL_HEIGHT = '460px'
const ACCORDION_MAX_H = '200px'
const SECTION_ACCORDION_MAX_H = '600px'

type StyleKey = 'retro' | 'brutalist' | 'cli' | 'scifi' | 'codeart' | 'modern'

const STYLES: { key: StyleKey; label: string; pill: string; accent: string }[] = [
  { key: 'retro',     label: 'Retro Terminal',  pill: 'TERMINAL', accent: '#f0c020' },
  { key: 'cli',       label: 'CLI / Command',     pill: 'CLI',      accent: '#89b4fa' },
  { key: 'codeart',   label: 'Code Art',          pill: 'CODE ART', accent: '#c792ea' },
  { key: 'modern',    label: 'Clean / Modern',     pill: 'MODERN',   accent: '#525252' },
  { key: 'brutalist', label: 'Brutalist Shell',  pill: 'BRUTAL',   accent: '#111111' },
  { key: 'scifi',     label: 'Sci-Fi UI',         pill: 'SCI-FI',   accent: '#00f0ff' },
]

/* ═══════════════════════════════════════════════════════════════════════
   1. RETRO TERMINAL — full-page CRT experience
   ═══════════════════════════════════════════════════════════════════════ */

const BOOT_LINES = [
  { text: 'Phoenix BIOS v4.06  (C) 1999 Phoenix Technologies', delay: 60 },
  { text: 'CPU: Intel Pentium III 500MHz', delay: 80 },
  { text: 'Memory Test: 65536K OK', delay: 150 },
  { text: '', delay: 40 },
  { text: 'Loading Z.AI System...', delay: 300 },
  { text: '████████████████████████████████████ 100%', delay: 120 },
  { text: '', delay: 40 },
  { text: '  ╔══════════════════════════════════════════════════╗', delay: 15 },
  { text: '  ║     Z.AI  TERMINAL  SYSTEM  v3.1               ║', delay: 15 },
  { text: '  ║     (c) 1999 Z.ai Corporation                   ║', delay: 15 },
  { text: '  ╚══════════════════════════════════════════════════╝', delay: 15 },
  { text: '', delay: 40 },
  { text: 'Type "help" for available commands.', delay: 80, isPrompt: true },
]

const COMMANDS: Record<string, string[]> = {
  help: ['Available commands:', '', '  help    - Show this help', '  sysinfo - System info', '  usecase - When to use this style', '  props   - Key properties', '  matrix  - Enter the matrix', '  cls     - Clear screen', '  ls      - List files', '  ver     - Version', '  whoami  - Who are you?', '  echo    - Echo text'],
  sysinfo: ['┌────────────────────────────────┐', '│  OS      : Z.AI DOS 7.1          │', '│  CPU     : Pentium III 500MHz     │', '│  RAM     : 64 MB                  │', '│  CRT     : Amber P3               │', '│  Uptime  : 47d 13h 22m            │', '└────────────────────────────────┘'],
  ls: ['  COMMAND  COM    93,890  12-01-99', '  CONFIG   SYS       256  12-01-99', '  WINDOWS      <DIR>  12-01-99', '  TERMINAL EXE   45,312  12-01-99', '  README   TXT     1,024  12-01-99', '', '  4 File(s)  140,634 bytes', '  1 Dir(s)   2,048,000 bytes free'],
  ver: ['Z.AI [Version 3.1.1999]', 'Phosphor Amber Edition', '(C) Copyright Z.ai Corp.'],
  whoami: ['user@zai-terminal', 'Privilege level: ADMINISTRATOR', 'Session: TTY1'],
  usecase: ['', '┌─────────────────────────────────────┐', '│  KOГДА ИСПОЛЬЗОВАТЬ              │', '├─────────────────────────────────────┤', '│  ► DevTools & developer utilities   │', '│  ► Retro-игры и игровые лендинги   │', '│  ► Интерактивные демо и education  │', '│  ► CLI-onboarding и SaaS wizard-ы  │', '└─────────────────────────────────────┘'],
  props: ['', '┌─────────────────────────────────────┐', '│  КЛЮЧЕВЫЕ ОСОБЕННОСТИ             │', '├─────────────────────────────────────┤', '│  ► Amber glow — phosphor effect    │', '│  ► Scanline overlay — CRT realism  │', '│  ► Boot sequence — dramatic entry  │', '│  ► Monospace-only — pure terminal  │', '└─────────────────────────────────────┘'],
  matrix: ['__MATRIX__'],
  cls: ['__CLS__'],
}

function RetroPage() {
  const [lines, setLines] = useState<Array<{ text: string; type: 'boot' | 'cmd' | 'output' | 'error' | 'prompt' }>>([])
  const [inputVal, setInputVal] = useState('')
  const [inputVisible, setInputVisible] = useState(false)
  const [showUseCases, setShowUseCases] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)
  const [expandedUseCase, setExpandedUseCase] = useState<string | null>(null)
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let totalDelay = 0
    const t: ReturnType<typeof setTimeout>[] = []
    for (const line of BOOT_LINES) {
      totalDelay += line.delay
      t.push(setTimeout(() => setLines((p) => [...p, { text: line.text, type: line.isPrompt ? 'prompt' : 'boot' }]), totalDelay))
    }
    t.push(setTimeout(() => { setInputVisible(true); const focusTimer = setTimeout(() => inputRef.current?.focus(), 50); t.push(focusTimer) }, totalDelay + 200))
    return () => t.forEach(clearTimeout)
  }, [])
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, [lines])

  const processCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase()
    const sp = cmd.indexOf(' ')
    const base = sp > -1 ? cmd.slice(0, sp) : cmd
    const arg = sp > -1 ? raw.trim().slice(sp + 1) : ''
    if (base === 'cls') { setLines([]); return }
    if (base === 'echo') { setLines((p) => [...p, { text: `C:\\>${raw.trim()}`, type: 'cmd' }, { text: arg || '', type: 'output' }]); return }
    if (base === 'matrix') {
      const matrixLines = ['', '  01001000 01100101 01101100 01101100 01101111', '  01010111 01101111 01110010 01101100 01100100', '  01011001 01101111 01110101 00100000 01100001', '  01110010 01100101 00100000 01100001 01110111', '  01100101 01110011 01101111 01101101 01100101', '']
      setLines((p) => [...p, { text: `C:\\>${raw.trim()}`, type: 'cmd' }, ...matrixLines.map((t) => ({ text: t, type: 'output' as const }))]); return
    }
    if (base === '') { setLines((p) => [...p, { text: 'C:\\>', type: 'cmd' }]); return }
    const r = COMMANDS[base]
    if (r) setLines((p) => [...p, { text: `C:\\>${raw.trim()}`, type: 'cmd' }, ...r.map((t) => ({ text: t, type: 'output' as const }))])
    else setLines((p) => [...p, { text: `C:\\>${raw.trim()}`, type: 'cmd' }, { text: `  '${base}' is not recognized as an internal or external command.`, type: 'error' }, { text: '', type: 'output' }])
  }, [])

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col" style={{ background: '#0a0800' }}>

      {/* ── Block 1: Что это ── */}
      <div className="shrink-0 px-5 py-3" style={{ background: '#1a1a1a', borderBottom: '1px solid #333' }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#f0c020]" style={{ boxShadow: '0 0 8px rgba(240,192,32,0.6)' }} />
          <span style={{ ...mono, fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.06em', color: '#f0c020' }}>CRT-терминал с amber phosphor, scanlines и boot-анимацией</span>
        </div>
      </div>

      {/* ── Block 2: Interactive Demo — Terminal ── */}
      <div className="relative shrink-0 flex flex-col" style={{ height: TERMINAL_HEIGHT }}>
        {/* Scanline overlay — scoped to terminal */}
        <div className="absolute inset-0 z-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.15) 1px, rgba(0,0,0,0.15) 2px)' }} />
        <div className="absolute inset-0 z-20 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />

        {/* Bezel top */}
        <div className="flex items-center justify-between px-5 py-2.5 relative z-10 shrink-0" style={{ background: '#1a1a1a', borderBottom: '1px solid #333' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#f0c020]" style={{ boxShadow: '0 0 8px rgba(240,192,32,0.6)' }} />
            <span style={{ ...mono, fontSize: '0.75rem', letterSpacing: '0.08em', color: '#f0c020', fontWeight: 600 }}>Z.AI TERMINAL v3.1</span>
          </div>
          <div className="flex items-center gap-4" style={{ ...mono, fontSize: '0.6875rem', color: '#555' }}>
            <span>CRT-15</span>
            <span>640×480</span>
            <span className="hidden sm:inline">Amber P3</span>
          </div>
        </div>

        {/* Terminal content */}
        <div ref={scrollRef} className="overflow-y-auto relative z-10 p-5 flex-1" style={{ ...mono, fontSize: '0.9375rem', lineHeight: 1.75, color: '#f0c020', textShadow: '0 0 6px rgba(240,192,32,0.45)', fontFeatureSettings: '"liga" off, "calt" off' }}>
          {lines.map((line, i) => {
            if (line.type === 'error') return <div key={i} style={{ color: '#ff6666' }}>{line.text || '\u00A0'}</div>
            if (line.type === 'prompt') return <div key={i} style={{ color: '#ffe066' }}>{line.text || '\u00A0'}</div>
            return <div key={i}>{line.text || '\u00A0'}</div>
          })}
          {inputVisible && (
            <div className="flex items-center">
              <span style={{ color: '#f0c020' }}>C:\&gt;</span>
              <span className="mx-1">&nbsp;</span>
              <input ref={inputRef} value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && inputVal.trim()) { processCommand(inputVal); setInputVal('') } }} className="flex-1 bg-transparent outline-none caret-[#f0c020]" style={{ color: '#f0c020', textShadow: '0 0 6px rgba(240,192,32,0.45)', ...mono, fontSize: '0.9375rem', fontFeatureSettings: '"liga" off, "calt" off' }} autoFocus spellCheck={false} autoComplete="off" />
              <span className="inline-block w-[6px] h-[15px] bg-[#f0c020] animate-[blink_0.7s_step-end_infinite]" style={{ boxShadow: '0 0 6px rgba(240,192,32,0.7)' }} />
            </div>
          )}
        </div>

      </div>

      {/* Bottom bar — outside the terminal box, between CRT and accordions */}
      <div className="flex items-center justify-between px-5 py-2.5 mt-2 mx-1 shrink-0 rounded-sm" style={{ background: '#0d0d0d', borderTop: '1px solid #333', borderBottom: '1px solid #333' }}>
        <span style={{ ...mono, fontSize: '0.625rem', letterSpacing: '0.1em', color: '#444' }}>C:\\ZAI\\TERMINAL</span>
        <span style={{ ...mono, fontSize: '0.625rem', letterSpacing: '0.1em', color: '#444' }}>{'\u2588'.repeat(20)}{'\u2591'.repeat(8)}</span>
      </div>

      {/* ── Block 3 & 4: Раскрываемые секции — Когда использовать + Ключевые особенности ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 md:p-10">
        {/* Когда использовать */}
        <div>
          <button
            onClick={() => setShowUseCases((p) => !p)}
            aria-expanded={showUseCases}
            className="w-full flex items-center gap-3 mb-3 group cursor-pointer"
            style={{ ...mono, fontSize: '0.8125rem', color: '#f0c020', textShadow: '0 0 4px rgba(240,192,32,0.3)', background: 'none', border: 'none', padding: 0, textAlign: 'left', fontFeatureSettings: '"liga" off, "calt" off' }}
          >
            <span style={{ fontSize: '0.75rem', transition: 'transform 0.2s', display: 'inline-block', transform: showUseCases ? 'rotate(90deg)' : 'rotate(0deg)' }}>{'▶'}</span>
            <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>{'KOГДА ИСПОЛЬЗОВАТЬ'}</span>
            <span style={{ color: '#555' }}>[tab]</span>
          </button>
          <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: showUseCases ? SECTION_ACCORDION_MAX_H : '0px', opacity: showUseCases ? 1 : 0 }}>
            <div style={{ ...mono, fontSize: '0.8125rem', lineHeight: 1.8, color: '#f0c020', textShadow: '0 0 4px rgba(240,192,32,0.3)', fontFeatureSettings: '"liga" off, "calt" off' }}>
              <div style={{ border: '1px solid rgba(240,192,32,0.15)', borderRadius: '2px', padding: '4px 0' }}>
                <div style={{ padding: '6px 12px', borderBottom: '1px solid rgba(240,192,32,0.1)', fontWeight: 700, letterSpacing: '0.04em', color: '#ffe066' }}>{'KOГДА ИСПОЛЬЗОВАТЬ'}</div>
                {[
                  { id: 'devtools', title: 'DevTools & developer utilities', desc: 'Инструменты разработчика в retro-стиле — debugger, profiler, network inspector. Пользователь чувствует как будто работает в настоящей DOS-системе.' },
                  { id: 'retro', title: 'Retro-игры и игровые лендинги', desc: 'Игры с pixel-art эстетикой, text-based приключения, промо-сайты для инди-игр. CRT-эффект погружает в атмосферу 90-х.' },
                  { id: 'demo', title: 'Интерактивные демо и education', desc: 'Образовательные платформы, обучающие CLI-интерфейсы, скрипты-онбординг для новых сотрудников. Terminal — интуитивный UI для разработчиков.' },
                  { id: 'cli', title: 'CLI-onboarding и SaaS wizard-ы', desc: 'Пошаговые настройки через terminal-интерфейс: конфигурация проекта, деплой, настройка окружения. Знакомый UX для технической аудитории.' },
                ].map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => setExpandedUseCase((p) => p === item.id ? null : item.id)}
                      className="w-full text-left cursor-pointer flex items-center gap-2 transition-colors"
                      style={{ ...mono, fontSize: '0.8125rem', padding: '8px 12px', background: 'none', border: 'none', color: '#f0c020', borderBottom: expandedUseCase === item.id ? '1px solid rgba(240,192,32,0.1)' : 'none' }}
                    >
                      <span style={{ fontSize: '0.625rem', transition: 'transform 0.2s', display: 'inline-block', transform: expandedUseCase === item.id ? 'rotate(90deg)' : 'rotate(0deg)' }}>{'▶'}</span>
                      <span>{'►'}</span>
                      <span>{item.title}</span>
                    </button>
                    <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: expandedUseCase === item.id ? ACCORDION_MAX_H : '0px', opacity: expandedUseCase === item.id ? 1 : 0 }}>
                      <div style={{ padding: '6px 12px 10px 34px', fontSize: '0.75rem', lineHeight: 1.7, color: '#b8960f' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ключевые особенности */}
        <div>
          <button
            onClick={() => setShowFeatures((p) => !p)}
            aria-expanded={showFeatures}
            className="w-full flex items-center gap-3 mb-3 group cursor-pointer"
            style={{ ...mono, fontSize: '0.8125rem', color: '#f0c020', textShadow: '0 0 4px rgba(240,192,32,0.3)', background: 'none', border: 'none', padding: 0, textAlign: 'left', fontFeatureSettings: '"liga" off, "calt" off' }}
          >
            <span style={{ fontSize: '0.75rem', transition: 'transform 0.2s', display: 'inline-block', transform: showFeatures ? 'rotate(90deg)' : 'rotate(0deg)' }}>{'▶'}</span>
            <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>{'КЛЮЧЕВЫЕ ОСОБЕННОСТИ'}</span>
            <span style={{ color: '#555' }}>[tab]</span>
          </button>
          <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: showFeatures ? SECTION_ACCORDION_MAX_H : '0px', opacity: showFeatures ? 1 : 0 }}>
            <div style={{ ...mono, fontSize: '0.8125rem', lineHeight: 1.8, color: '#f0c020', textShadow: '0 0 4px rgba(240,192,32,0.3)', fontFeatureSettings: '"liga" off, "calt" off' }}>
              <div style={{ border: '1px solid rgba(240,192,32,0.15)', borderRadius: '2px', padding: '4px 0' }}>
                <div style={{ padding: '6px 12px', borderBottom: '1px solid rgba(240,192,32,0.1)', fontWeight: 700, letterSpacing: '0.04em', color: '#ffe066' }}>{'КЛЮЧЕВЫЕ ОСОБЕННОСТИ'}</div>
                {[
                  { id: 'glow', title: 'Amber glow — phosphor CRT', desc: 'Тёплое amber свечение с text-shadow эмуляцией phosphor-отсвета. Создаёт ощущение настоящего CRT-монитора без CSS-фильтров.' },
                  { id: 'scanline', title: 'Scanline overlay — authentic', desc: 'Полупрозрачные горизонтальные линии через repeating-linear-gradient. Масштабируются, не замедляют рендер.' },
                  { id: 'boot', title: 'Boot sequence — dramatic start', desc: 'Пошаговая анимация загрузки BIOS → system → prompt. Задержки через setTimeout цепочку для реалистичного pacing.' },
                  { id: 'feat-mono', title: 'Monospace-only — pure terminal', desc: 'Geist Mono с отключёнными лигатурами (liga off, calt off). Каждый символ имеет фиксированную ширину для идеального column-alignment.' },
                ].map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => setExpandedFeature((p) => p === item.id ? null : item.id)}
                      className="w-full text-left cursor-pointer flex items-center gap-2 transition-colors"
                      style={{ ...mono, fontSize: '0.8125rem', padding: '8px 12px', background: 'none', border: 'none', color: '#f0c020', borderBottom: expandedFeature === item.id ? '1px solid rgba(240,192,32,0.1)' : 'none' }}
                    >
                      <span style={{ fontSize: '0.625rem', transition: 'transform 0.2s', display: 'inline-block', transform: expandedFeature === item.id ? 'rotate(90deg)' : 'rotate(0deg)' }}>{'▶'}</span>
                      <span>{'►'}</span>
                      <span>{item.title}</span>
                    </button>
                    <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: expandedFeature === item.id ? ACCORDION_MAX_H : '0px', opacity: expandedFeature === item.id ? 1 : 0 }}>
                      <div style={{ padding: '6px 12px 10px 34px', fontSize: '0.75rem', lineHeight: 1.7, color: '#b8960f' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   2. BRUTALIST SHELL — raw, no compromises
   ═══════════════════════════════════════════════════════════════════════ */

function BrutalistPage() {
  const [tab, setTab] = useState<'about' | 'manifesto' | 'specs'>('about')
  const [guestName, setGuestName] = useState('')
  const [guests, setGuests] = useState<string[]>(['ANONYMOUS', 'ROOT', 'SYSOP'])
  const [expandedUseCase, setExpandedUseCase] = useState<string | null>(null)
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  const addGuest = () => {
    const name = guestName.trim().toUpperCase()
    if (name && !guests.includes(name)) {
      setGuests((p) => [...p, name])
      setGuestName('')
    }
  }

  const tabs = [
    { key: 'about' as const, label: 'ABOUT.SYS' },
    { key: 'manifesto' as const, label: 'MANIFESTO.TXT' },
    { key: 'specs' as const, label: 'SPECS.DAT' },
  ]

  return (
    <div className="min-h-[calc(100vh-56px)] bg-white flex flex-col" style={{ ...mono }}>
      {/* ── Block 1: Что это — Hero ── */}
      <div className="border-b-4 border-black p-6 md:p-10 bg-[#ffff00]">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-none tracking-tight" style={{ fontFamily: 'monospace' }}>
          {'<BRUTALIST SHELL/>'}
        </h1>
        <p className="mt-4 text-base md:text-lg" style={{ fontFamily: 'monospace', lineHeight: 1.6 }}>
          Сырой HTML без оформления — только структура и правда.
        </p>
        <div className="mt-4 border-2 border-black bg-black text-[#00ff00] p-1 overflow-hidden">
          <div className="whitespace-nowrap animate-[marquee_10s_linear_infinite] inline-block text-sm font-bold">
            {'★ BRUTALISM IS NOT A CRIME — IT IS A STATEMENT ★ BRUTALISM IS NOT A CRIME ★'}
          </div>
        </div>
      </div>

      {/* ── Block 2: Interactive Demo — Tabs ── */}
      {/* Tab bar */}
      <div className="flex border-b-2 border-black" role="tablist">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className="px-5 py-2.5 text-sm font-bold uppercase tracking-wider border-r-2 border-black transition-colors"
            style={{ background: tab === t.key ? 'black' : 'white', color: tab === t.key ? 'white' : 'black' }}
          >{t.label}</button>
        ))}
      </div>

      <div className="p-6 md:p-10">
        {tab === 'about' && (
          <div>
            <TABLE border={2} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace', borderColor: 'black' }}>
              <tbody>
                <TR><TD bgColor="#f0f0f0" style={{ fontWeight: 700, width: '30%' }}>STATUS</TD><TD>OPERATIONAL</TD></TR>
                <TR><TD bgColor="#f0f0f0" style={{ fontWeight: 700 }}>DESIGN</TD><TD>ANTI-DESIGN</TD></TR>
                <TR><TD bgColor="#f0f0f0" style={{ fontWeight: 700 }}>BORDERS</TD><TD>ALWAYS VISIBLE, ALWAYS BLACK</TD></TR>
                <TR><TD bgColor="#f0f0f0" style={{ fontWeight: 700 }}>SHADOWS</TD><TD>BANNED</TD></TR>
                <TR><TD bgColor="#f0f0f0" style={{ fontWeight: 700 }}>ROUNDED</TD><TD>NEVER</TD></TR>
                <TR><TD bgColor="#f0f0f0" style={{ fontWeight: 700 }}>FONTS</TD><TD>SYSTEM MONOSPACE ONLY</TD></TR>
              </tbody>
            </TABLE>
          </div>
        )}
        {tab === 'manifesto' && (
          <OL style={{ fontFamily: 'monospace', lineHeight: 2.2, paddingLeft: '1.5rem', fontSize: '1rem' }}>
            <LI>ФОРМА СЛЕДУЕТ ЗА ФУНКЦИЕЙ</LI>
            <LI>ГРАНИЦЫ СУЩЕСТВУЮТ ЧТОБЫ БЫТЬ ВИДИМЫМИ</LI>
            <LI>ТЕНЬ БЕЗ ЦЕЛИ — ЭТО ДЕКОРАЦИЯ</LI>
            <LI>КОНТЕНТ ВАЖНЕЕ ОФОРМЛЕНИЯ</LI>
            <LI>КНОПКЕ НЕ НУЖЕН ГРАДИЕНТ</LI>
            <LI>ПИКСЕЛЬ ИДЕАЛЕН</LI>
            <LI>ПРОСТОТА — ЭТО СИЛА</LI>
          </OL>
        )}
        {tab === 'specs' && (
          <div>
            <PRE style={{ fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.7, padding: '1rem', background: '#f5f5f5', border: '1px solid #ddd' }}>{`/* BRUTALIST SHELL — Technical Specs */

:root {
  --border:    2px solid black;
  --radius:    0px;        /* NEVER */
  --shadow:    none;        /* BANNED */
  --gradient:  none;        /* UNNECESSARY */
  --font:      monospace;
  --padding:   generous;    /* BREATHE */
  --color:     high-contrast;
}

.element {
  box-shadow:     none !important;
  border-radius:  0 !important;
  backdrop-filter: none !important;
}`}</PRE>

            {/* Guestbook */}
            <div className="mt-8 border-2 border-black p-5">
              <H2 style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem' }}>GUESTBOOK.DAT</H2>
              <div className="mb-4 space-y-1.5" style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                {guests.map((g) => (
                  <div key={g} className="border border-black px-3 py-1.5 bg-[#f9f9f9]">▸ {g}</div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addGuest()}
                  placeholder="YOUR NAME"
                  className="flex-1 border-2 border-black px-3 py-2 outline-none bg-white"
                  style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                />
                <button onClick={addGuest} className="border-2 border-black bg-black text-white px-5 py-2 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors" style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>SIGN</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Block 3: Когда использовать — Раскрываемые строки таблицы ── */}
      <div className="p-6 md:p-10 border-t-4 border-black bg-white">
        <H2 style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.25rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
          {'// КОГДА ИСПОЛЬЗОВАТЬ'}
        </H2>
        {[
          { id: 'b-port', num: '01', title: 'Портфолио с attitude', desc: 'Showcase your work with zero pretense — никаких теней, никаких градиентов. Чистая структура = честность. Посетитель видит контент, а не декорацию.' },
          { id: 'b-art', num: '02', title: 'Арт-проекты и statement-сайты', desc: 'Pure structure as artistic expression — брутализм как арт-форма. Страница становится statement: «нам не нужна полировка, нам нужна правда».' },
          { id: 'b-statement', num: '03', title: 'Statement-сайты', desc: 'When the message matters more than decoration — манифесты, отказы, протесты. Чёрные рамки = несогласие с конформизмом современного web.' },
          { id: 'b-conf', num: '04', title: 'Конференции', desc: 'Web-standards events and tech talks — бруталистичный сайт конференции = сигнал: «мы тут ради контента, а не ради анимаций».' },
        ].map((item) => (
          <div key={item.id}>
            <button
              onClick={() => setExpandedUseCase((p) => p === item.id ? null : item.id)}
              className="w-full text-left cursor-pointer flex items-center gap-0"
              aria-expanded={expandedUseCase === item.id}
              style={{ fontFamily: 'monospace', fontSize: '0.875rem', padding: '12px 8px', background: 'none', border: 'none', borderBottom: expandedUseCase === item.id ? '4px solid black' : '2px solid black', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
            >
              <span style={{ fontWeight: 900, background: '#000', padding: '2px 8px', marginRight: '12px', minWidth: '32px', textAlign: 'center', display: 'inline-block', color: '#fff' }}>{item.num}</span>
              <span style={{ fontWeight: 700, flex: 1 }}>{item.title}</span>
              <span style={{ fontSize: '0.625rem', transition: 'transform 0.2s', display: 'inline-block', transform: expandedUseCase === item.id ? 'rotate(90deg)' : 'rotate(0deg)', color: '#000' }}>{'▶'}</span>
            </button>
            <div className="overflow-hidden transition-all duration-200" style={{ maxHeight: expandedUseCase === item.id ? ACCORDION_MAX_H : '0px', opacity: expandedUseCase === item.id ? 1 : 0, borderBottom: '2px solid black', borderLeft: '2px solid black', borderRight: '2px solid black' }}>
              <div style={{ fontFamily: 'monospace', padding: '10px 8px 10px 52px', fontSize: '0.8125rem', color: '#555', lineHeight: 1.7, background: '#f9f9f9' }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Block 4: Ключевые особенности — Раскрываемые строки таблицы ── */}
      <div className="p-6 md:p-10 border-t-4 border-black bg-white">
        <H2 style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.25rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
          {'// КЛЮЧЕВЫЕ ОСОБЕННОСТИ'}
        </H2>
        {[
          { id: 'b-border', title: 'BORDERS', subtitle: 'always visible, always structural', desc: '2px solid black — always visible, always structural. Границы не декорация — они часть архитектуры. Каждый элемент имеет чёткие пределы.' },
          { id: 'b-shadow', title: 'SHADOWS', subtitle: 'banned entirely — no exceptions', desc: 'No shadows — banned entirely. Тень без цели = ложь. Элемент либо существует на плоскости, либо нет. Брутализм не имитирует глубину.' },
          { id: 'b-radius', title: 'RADIUS', subtitle: 'sharp corners only, never rounded', desc: 'No border-radius — sharp corners only. Скруглённый угол = сглаживание реальности. Брутализм предпочитает честную геометрию.' },
          { id: 'b-typo', title: 'TYPOGRAPHY', subtitle: 'system monospace, no fancy fonts', desc: 'System monospace — no fancy fonts, just raw text. Один шрифт для всего = единообразие. Нет иерархии через размер = демократия контента.' },
        ].map((item) => (
          <div key={item.id}>
            <button
              onClick={() => setExpandedFeature((p) => p === item.id ? null : item.id)}
              className="w-full text-left cursor-pointer flex items-center gap-0"
              aria-expanded={expandedFeature === item.id}
              style={{ fontFamily: 'monospace', fontSize: '0.875rem', padding: '12px 8px', background: 'none', border: 'none', borderBottom: expandedFeature === item.id ? '4px solid black' : '2px solid black', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
            >
              <span style={{ fontWeight: 900, background: '#ffff00', padding: '2px 12px', marginRight: '12px', minWidth: '120px', display: 'inline-block', textAlign: 'center' }}>{item.title}</span>
              <span style={{ fontWeight: 700, flex: 1, color: '#333' }}>{item.subtitle}</span>
              <span style={{ fontSize: '0.625rem', transition: 'transform 0.2s', display: 'inline-block', transform: expandedFeature === item.id ? 'rotate(90deg)' : 'rotate(0deg)', color: '#000' }}>{'▶'}</span>
            </button>
            <div className="overflow-hidden transition-all duration-200" style={{ maxHeight: expandedFeature === item.id ? ACCORDION_MAX_H : '0px', opacity: expandedFeature === item.id ? 1 : 0, borderBottom: '2px solid black', borderLeft: '2px solid black', borderRight: '2px solid black' }}>
              <div style={{ fontFamily: 'monospace', padding: '10px 8px 10px 8px', fontSize: '0.8125rem', color: '#555', lineHeight: 1.7, background: '#ffff0015' }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Helper brutalist elements */
function TABLE({ border, cellPadding, style, children, ...rest }: React.TableHTMLAttributes<HTMLTableElement> & { border?: number; cellPadding?: number }) { return <table border={border} cellPadding={cellPadding} style={{ borderCollapse: 'collapse', borderColor: 'black', ...style }} {...rest}>{children}</table> }
function TR({ children, ...rest }: React.HTMLAttributes<HTMLTableRowElement>) { return <tr {...rest}>{children}</tr> }
function TD({ bgColor, style, children, ...rest }: React.TdHTMLAttributes<HTMLTableCellElement> & { bgColor?: string }) { return <td style={{ border: '2px solid black', padding: '8px', fontFamily: 'monospace', backgroundColor: bgColor, ...style }} {...rest}>{children}</td> }
function H2({ children, style, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) { return <h2 style={style} {...rest}>{children}</h2> }
function OL({ children, style, ...rest }: React.OlHTMLAttributes<HTMLOListElement>) { return <ol style={style} {...rest}>{children}</ol> }
function LI({ children, ...rest }: React.LiHTMLAttributes<HTMLLIElement>) { return <li {...rest}>{children}</li> }
function PRE({ children, style, ...rest }: React.HTMLAttributes<HTMLPreElement>) { return <pre style={style} {...rest}>{children}</pre> }

/* ═══════════════════════════════════════════════════════════════════════
   3. CLI / COMMAND LINE — Catppuccin Mocha
   ═══════════════════════════════════════════════════════════════════════ */

const CLI_FILES = [
  { name: 'readme.md', icon: '📄' },
  { name: 'config.json', icon: '⚙️' },
  { name: 'index.ts', icon: '🔷' },
  { name: 'style.css', icon: '🎨' },
  { name: 'USE_CASES.md', icon: '📋' },
] as const

const CLI_FILE_CONTENTS: Record<string, string> = {
    'readme.md': `# Web Aesthetic Showcase

> 6 visual languages for web projects
> from CRT terminals to creative coding

## Installation

\`\`\`bash
npm install @zai/aesthetics
\`\`\`

## Usage

\`\`\`ts
import { Terminal, Brutalist, SciFi } from '@zai/aesthetics'
\`\`\`

## License
MIT © Z.ai`,
    'config.json': `{
  "name": "web-aesthetic-showcase",
  "version": "2.0.0",
  "styles": [
    "retro-terminal",
    "brutalist-shell",
    "cli-command",
    "sci-fi-hud",
    "code-art",
    "clean-modern"
  ],
  "theme": "catppuccin-mocha",
  "interactive": true
}`,
    'index.ts': `import { AestheticEngine } from '@zai/aesthetics'
import { Catppuccin } from '@zai/themes'

const engine = new AestheticEngine({
  theme: Catppuccin.Mocha,
  transitions: true,
  responsive: true,
})

export function createShowcase(styles: Style[]) {
  return engine.render(styles, {
    fullscreen: true,
    interactive: true,
  })
}`,
    'style.css': `/* Z.AI Showcase — Core Styles */

:root {
  --bg-base:   #1e1e2e;
  --bg-mantle: #181825;
  --bg-crust:  #11111b;
  --text:      #cdd6f4;
  --subtext:   #a6adc8;
  --overlay:   #6c7086;
  --blue:      #89b4fa;
  --green:     #a6e3a1;
  --red:       #f38ba8;
  --yellow:    #f9e2af;
  --mauve:     #cba6f7;
  --border:    1px solid rgba(255,255,255,0.08);
}`,
    'USE_CASES.md': `# CLI / Command — Info

> IDE-раскладка с файловым деревом, подсветкой синтаксиса и терминалом

## Когда использовать

- API документация — structured, searchable docs
- Dev-лендинги — developer-first product pages
- Playgrounds — interactive code sandboxes
- SaaS платформы — developer dashboards & tools

## Ключевые особенности

- Catppuccin theme — warm, consistent color palette
- File explorer — navigable project structure
- Syntax highlight — multi-language code coloring
- Status bar — context-aware editor information`,
  }

function CliPage() {
  const [activeFile, setActiveFile] = useState('readme.md')
  const [expandedUseCase, setExpandedUseCase] = useState<string | null>(null)
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col" style={{ background: '#1e1e2e', ...mono }}>
      {/* ── Block 1: Что это — Terminal header ── */}
      <div className="flex items-center gap-2.5 px-4 py-2 shrink-0" style={{ background: '#181825', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-[#f38ba8]" /><div className="w-3 h-3 rounded-full bg-[#f9e2af]" /><div className="w-3 h-3 rounded-full bg-[#a6e3a1]" /></div>
        <span style={{ fontSize: '0.8125rem', letterSpacing: '0.02em', color: '#6c7086' }}>user@zai</span>
        <span style={{ color: '#45475a' }}>:</span>
        <span style={{ fontSize: '0.8125rem', color: '#89b4fa' }}>~/style-showcase</span>
        <span style={{ fontSize: '0.8125rem', color: '#cdd6f4' }}>$</span>
        <span className="ml-1" style={{ fontSize: '0.8125rem', color: '#a6e3a1' }}>vim .</span>
        <span className="ml-auto hidden md:inline" style={{ fontSize: '0.75rem', color: '#6c7086' }}>IDE-раскладка с файловым деревом, подсветкой синтаксиса и терминалом</span>
      </div>

      {/* ── Block 2: Interactive Demo — IDE layout ── */}
      <div className="flex overflow-hidden" style={{ height: IDE_PANEL_HEIGHT }}>
        {/* File tree sidebar */}
        <div className="hidden md:block w-56 shrink-0 p-3 overflow-y-auto border-r" style={{ background: '#181825', borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="mb-3" style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', color: '#6c7086', textTransform: 'uppercase' }}>Explorer</div>
          <div className="space-y-0.5">
            {CLI_FILES.map((f) => (
              <button key={f.name} onClick={() => setActiveFile(f.name)}
                className="w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center gap-2"
                style={{ ...mono, fontSize: '0.8125rem', background: activeFile === f.name ? 'rgba(137,180,250,0.1)' : 'transparent', color: activeFile === f.name ? '#89b4fa' : '#cdd6f4' }}
              >{f.icon} {f.name}</button>
            ))}
          </div>

          {/* Terminal mini section */}
          <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="mb-2" style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', color: '#6c7086', textTransform: 'uppercase' }}>Terminal</div>
            <div className="space-y-1" style={{ fontSize: '0.75rem', lineHeight: 1.7 }}>
              <div><span style={{ color: '#a6e3a1' }}>$</span> <span style={{ color: '#cdd6f4' }}>git status</span></div>
              <div style={{ color: '#a6e3a1' }}>On branch main</div>
              <div style={{ color: '#a6e3a1' }}>nothing to commit</div>
              <div><span style={{ color: '#a6e3a1' }}>$</span> <span style={{ color: '#f38ba8' }}>npm</span> <span style={{ color: '#cdd6f4' }}>run build</span></div>
              <div style={{ color: '#a6e3a1' }}>✓ Compiled successfully</div>
              <div className="flex items-center"><span style={{ color: '#a6e3a1' }}>$</span> <span className="inline-block w-[5px] h-[13px] bg-[#f5e0dc] animate-[blink_0.8s_step-end_infinite] ml-1" /></div>
            </div>
          </div>
        </div>

        {/* File content */}
        <div className="flex-1 overflow-auto p-5">
          <div className="mb-4 flex items-center gap-2" style={{ fontSize: '0.75rem', color: '#6c7086' }}>
            <span>read-only</span>
            <span>·</span>
            <span>{CLI_FILE_CONTENTS[activeFile]?.split('\n').length} lines</span>
            <span>·</span>
            <span>{activeFile}</span>
          </div>
          <pre className="whitespace-pre-wrap" style={{ ...mono, fontSize: '0.875rem', lineHeight: 1.75, color: '#cdd6f4' }}>
            <SyntaxHighlight content={CLI_FILE_CONTENTS[activeFile]} filename={activeFile} />
          </pre>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 shrink-0" style={{ background: '#181825', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3" style={{ fontSize: '0.6875rem', color: '#6c7086' }}>
          <span style={{ color: '#89b4fa' }}>NORMAL</span>
          <span>utf-8</span>
          <span>spaces: 2</span>
        </div>
        <div style={{ fontSize: '0.6875rem', color: '#6c7086' }}>CLI / Command — 5 files · Catppuccin Mocha</div>
      </div>

      {/* ── Block 3: Когда использовать — Раскрываемые terminal-строки ── */}
      <div className="p-6 md:p-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="mb-4" style={{ ...mono, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', color: '#6c7086', textTransform: 'uppercase' }}>
          <span style={{ color: '#89b4fa' }}>{'$'}</span> cat USE_CASES.md
        </div>
        {[
          { id: 'c-api', title: 'API документация', icon: '📄', desc: 'Structured, searchable docs — IDE-раскладка превращает документацию в navigable файловую систему. Каталоги = разделы, файлы = endpoints. Разработчики сразу чувствуют себя как дома.' },
          { id: 'c-dev', title: 'Dev-лендинги', icon: '🚀', desc: 'Developer-first product pages — вместо скучных hero-секций показываем live-демо в редакторе. «Try it here» вместо «Sign up for beta». Конверсия через доверие.' },
          { id: 'c-play', title: 'Playgrounds', icon: '⚡', desc: 'Interactive code sandboxes — встроенный терминал + подсветка = мгновенный feedback. Пользователь пишет код и видит результат без переключения вкладок.' },
          { id: 'c-saas', title: 'SaaS платформы', icon: '🛠', desc: 'Developer dashboards & tools — Catppuccin Mocha снижает eye strain при долгой работе. Файловое дерево + терминал = привычная среда для dev-команд.' },
        ].map((item) => (
          <div key={item.id}>
            <button
              onClick={() => setExpandedUseCase((p) => p === item.id ? null : item.id)}
              className="w-full text-left cursor-pointer flex items-center gap-3 p-3 rounded-lg transition-colors"
              style={{ ...mono, fontSize: '0.875rem', background: expandedUseCase === item.id ? 'rgba(137,180,250,0.06)' : 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <span style={{ fontSize: '0.5625rem', transition: 'transform 0.2s', display: 'inline-block', transform: expandedUseCase === item.id ? 'rotate(90deg)' : 'rotate(0deg)', color: '#6c7086' }}>{'▶'}</span>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              <span style={{ fontWeight: 600, color: '#cdd6f4' }}>{item.title}</span>
            </button>
            <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: expandedUseCase === item.id ? ACCORDION_MAX_H : '0px', opacity: expandedUseCase === item.id ? 1 : 0 }}>
              <div style={{ ...mono, padding: '4px 0 12px 36px', fontSize: '0.75rem', lineHeight: 1.7, color: '#6c7086' }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Block 4: Ключевые особенности — Раскрываемые terminal-строки ── */}
      <div className="px-6 md:px-10 pb-10">
        <div className="mb-4" style={{ ...mono, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', color: '#6c7086', textTransform: 'uppercase' }}>
          <span style={{ color: '#89b4fa' }}>{'$'}</span> cat SPECS.md
        </div>
        {[
          { id: 'c-cat', title: 'Catppuccin theme', color: '#cba6f7', desc: 'Warm, consistent color palette — 26 базовых цветов для UI, синтаксиса и текста. Создан специально для tiling WM и low-contrast сред. Снижает eye strain.' },
          { id: 'c-file', title: 'File explorer', color: '#89b4fa', desc: 'Navigable project structure — иконки файлов + подсветка активного файла. Sidebar с контекстом: папки, терминал, explorer. Как в VS Code, но встроен в страницу.' },
          { id: 'c-syntax', title: 'Syntax highlight', color: '#a6e3a1', desc: 'Multi-language code coloring — кастомный рендерер для .md, .json, .ts, .css без внешних зависимостей. Regex-based, zero-cost, theme-agnostic.' },
          { id: 'c-status', title: 'Status bar', color: '#f9e2af', desc: 'Context-aware editor information — показывает режим, кодировку, тип отступов. Mimics Vim/VS Code status bar для чувства familiarity.' },
        ].map((item) => (
          <div key={item.id}>
            <button
              onClick={() => setExpandedFeature((p) => p === item.id ? null : item.id)}
              className="w-full text-left cursor-pointer flex items-center gap-3 p-3 rounded-lg transition-colors"
              style={{ ...mono, fontSize: '0.875rem', background: expandedFeature === item.id ? 'rgba(255,255,255,0.03)' : 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <span style={{ fontSize: '0.5625rem', transition: 'transform 0.2s', display: 'inline-block', transform: expandedFeature === item.id ? 'rotate(90deg)' : 'rotate(0deg)', color: '#6c7086' }}>{'▶'}</span>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}40` }} />
              <span style={{ fontWeight: 600, color: '#cdd6f4' }}>{item.title}</span>
            </button>
            <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: expandedFeature === item.id ? ACCORDION_MAX_H : '0px', opacity: expandedFeature === item.id ? 1 : 0 }}>
              <div style={{ ...mono, padding: '4px 0 12px 36px', fontSize: '0.75rem', lineHeight: 1.7, color: '#6c7086' }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SyntaxHighlight({ content, filename }: { content: string; filename: string }) {
  const isJson = filename.endsWith('.json')
  const isTs = filename.endsWith('.ts')
  const isCss = filename.endsWith('.css')
  const isMd = filename.endsWith('.md')

  const render = (line: string) => {
    if (isMd) return <MdLine line={line} />
    if (isJson) return <JsonLine line={line} />
    if (isCss) return <CssLine line={line} />
    if (isTs) return <TsLine line={line} />
    return <span>{line}</span>
  }

  return content.split('\n').map((line, i) => <div key={i}>{render(line) || '\u00A0'}</div>)
}

function MdLine({ line }: { line: string }) {
  if (line.startsWith('# ')) return <div><span style={{ color: '#89b4fa', fontWeight: 700 }}>{line}</span></div>
  if (line.startsWith('> ')) return <div style={{ color: '#a6adc8', fontStyle: 'italic' }}>{line}</div>
  if (line.startsWith('## ')) return <div><span style={{ color: '#89b4fa', fontWeight: 600 }}>{line}</span></div>
  if (line.startsWith('- ')) return <div><span style={{ color: '#a6e3a1' }}>{'- '}</span><span style={{ color: '#cdd6f4' }}>{line.slice(2)}</span></div>
  if (line.startsWith('```')) return <div style={{ color: '#6c7086' }}>{line}</div>
  return <div style={{ color: '#cdd6f4' }}>{line}</div>
}

function JsonLine({ line: rawLine }: { line: string }) {
  if (!rawLine) return <div>{'\u00A0'}</div>
  const parts = rawLine.split(/("(?:[^"\\]|\\.)*")/g)
  return <div>{parts.map((part, i) => {
    if (!part) return null
    if (/^"/.test(part) && i + 1 < parts.length && parts[i + 1]?.startsWith(':'))
      return <span key={i} style={{ color: '#89b4fa' }}>{part}</span>
    if (/^"/.test(part) && i > 0 && parts[i - 1]?.endsWith(':'))
      return <span key={i} style={{ color: '#a6e3a1' }}>{part}</span>
    if (/^"/.test(part))
      return <span key={i} style={{ color: '#a6e3a1' }}>{part}</span>
    const nums = part.replace(/(\d+)/g, '|||$1|||').split('|||')
  return <span key={i}>{nums.map((seg, j) => /^\d+$/.test(seg) ? <span key={j} style={{ color: '#fab387' }}>{seg}</span> : seg)}</span>
  })}</div>
}

function TsLine({ line: rawLine }: { line: string }) {
  if (!rawLine) return <div>{'\u00A0'}</div>
  const kwRe = /\b(import|export|from|const|return|new)\b/g
  const strRe = /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g
  const clsRe = /\b(StyleEngine|Catppuccin|Style\[\])\b/g
  const tokens: { text: string; color?: string }[] = []
  let remaining = rawLine
  while (remaining.length > 0) {
    const strMatch = strRe.exec(remaining)
    const kwMatch = kwRe.exec(remaining)
    const clsMatch = clsRe.exec(remaining)
    const first = [strMatch, kwMatch, clsMatch].filter(Boolean).sort((a, b) => a!.index - b!.index)[0]
    if (!first) { tokens.push({ text: remaining }); break }
    if (first.index > 0) tokens.push({ text: remaining.slice(0, first.index) })
    const color = first === strMatch ? '#a6e3a1' : first === kwMatch ? '#cba6f7' : '#f9e2af'
    tokens.push({ text: first[0], color })
    remaining = remaining.slice(first.index + first[0].length)
    strRe.lastIndex = 0; kwRe.lastIndex = 0; clsRe.lastIndex = 0
  }
  return <div>{tokens.map((t, i) => t.color ? <span key={i} style={{ color: t.color }}>{t.text}</span> : t.text)}</div>
}

function CssLine({ line: rawLine }: { line: string }) {
  if (!rawLine) return <div>{'\u00A0'}</div>
  const tokens: { text: string; color?: string }[] = []
  let remaining = rawLine
  const commentRe = /(\/\*.*?\*\/)/g
  const varRe = /(--[\w-]+)/g
  const valRe = /:\s*(#[\w]+|rgba?\([^)]+\))/g
  while (remaining.length > 0) {
    const commentMatch = commentRe.exec(remaining)
    const varMatch = varRe.exec(remaining)
    const valMatch = valRe.exec(remaining)
    const first = [commentMatch, varMatch, valMatch].filter(Boolean).sort((a, b) => a!.index - b!.index)[0]
    if (!first) { tokens.push({ text: remaining }); break }
    if (first.index > 0) tokens.push({ text: remaining.slice(0, first.index) })
    const color = first === commentMatch ? '#6c7086' : first === varMatch ? '#89b4fa' : '#fab387'
    tokens.push({ text: first[0], color })
    remaining = remaining.slice(first.index + first[0].length)
    commentRe.lastIndex = 0; varRe.lastIndex = 0; valRe.lastIndex = 0
  }
  return <div>{tokens.map((t, i) => t.color ? <span key={i} style={{ color: t.color }}>{t.text}</span> : t.text)}</div>
}

/* ═══════════════════════════════════════════════════════════════════════
   4. SCI-FI UI — Heads-Up Display
   ═══════════════════════════════════════════════════════════════════════ */

function SciFiPage() {
  const [scanY, setScanY] = useState(0)
  const [time, setTime] = useState(new Date())
  const [shield, setShield] = useState(98.7)
  const [core, setCore] = useState<'ACTIVE' | 'WARNING' | 'CRITICAL'>('ACTIVE')
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null)
  const [expandedSpec, setExpandedSpec] = useState<string | null>(null)

  useEffect(() => { const t = setInterval(() => setScanY((p) => (p + 0.3) % 100), 30); return () => clearInterval(t) }, [])
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])
  useEffect(() => {
    const t = setInterval(() => {
      setShield((p) => {
        const v = p + (Math.random() - 0.48) * 0.5
        return Math.min(100, Math.max(85, v))
      })
      setCore(Math.random() > 0.95 ? 'WARNING' : 'ACTIVE')
    }, 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative min-h-[calc(100vh-56px)] overflow-hidden flex flex-col" style={{ background: '#060a14' }}>
      {/* Grid overlay */}
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.025) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      {/* Scan line */}
      <div className="absolute left-0 right-0 h-[1px] z-10 pointer-events-none" style={{ top: `${scanY}%`, background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.3), transparent)', boxShadow: '0 0 20px rgba(0,240,255,0.15)' }} />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,10,20,0.8) 100%)' }} />

      {/* HUD content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top HUD bar — Block 1: Что это */}
        <div className="flex items-center justify-between px-6 py-3" style={{ borderBottom: '1px solid rgba(0,240,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ background: core === 'ACTIVE' ? '#a6e3a1' : '#f9e2af', boxShadow: `0 0 8px ${core === 'ACTIVE' ? '#a6e3a1' : '#f9e2af'}` }} />
            <span style={{ ...mono, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', color: '#00f0ff', textShadow: '0 0 10px rgba(0,240,255,0.3)' }}>Z.AI COMMAND CENTER</span>
          </div>
          <div className="hidden sm:block" style={{ ...mono, fontSize: '0.625rem', letterSpacing: '0.08em', color: 'rgba(0,240,255,0.4)' }}>
            Heads-Up Display с радаром, телеметрией и live-данными
          </div>
          <div style={{ ...mono, fontSize: '0.6875rem', letterSpacing: '0.1em', color: 'rgba(0,240,255,0.4)' }}>
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>

        {/* Block 2: Interactive Demo — HUD panels, radar, log */}
        <div className="p-6 md:p-10 flex flex-col gap-6" style={{ minHeight: '400px' }}>
          {/* Status panels row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'CORE STATUS', value: core, color: core === 'ACTIVE' ? '#a6e3a1' : '#f9e2af', pct: 100 },
              { label: 'SHIELD', value: `${shield.toFixed(1)}%`, color: shield > 90 ? '#a6e3a1' : '#f9e2af', pct: shield },
              { label: 'SIGNAL', value: '-42 dBm', color: '#89b4fa', pct: 78 },
              { label: 'BANDWIDTH', value: '2.4 Gbps', color: '#cba6f7', pct: 92 },
            ].map((s) => (
              <div key={s.label} className="relative p-4" style={{ border: '1px solid rgba(0,240,255,0.1)', background: 'rgba(0,240,255,0.02)' }}>
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: 'rgba(0,240,255,0.3)' }} />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: 'rgba(0,240,255,0.3)' }} />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: 'rgba(0,240,255,0.3)' }} />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: 'rgba(0,240,255,0.3)' }} />
                <div className="mb-1" style={{ ...mono, fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'rgba(0,240,255,0.4)' }}>{s.label}</div>
                <div className="mb-2" style={{ ...mono, fontSize: '1.25rem', fontWeight: 700, color: s.color, textShadow: `0 0 12px ${s.color}40` }}>{s.value}</div>
                <div className="h-[3px] rounded-full" style={{ background: 'rgba(0,240,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.pct}%`, background: `linear-gradient(90deg, rgba(0,240,255,0.6), ${s.color})`, boxShadow: `0 0 8px ${s.color}40` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Center: Radar + Telemetry */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ minHeight: '260px' }}>
            {/* Radar */}
            <div className="relative flex items-center justify-center" style={{ border: '1px solid rgba(0,240,255,0.08)' }}>
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border" style={{ borderColor: 'rgba(0,240,255,0.12)' }} />
                <div className="absolute inset-6 rounded-full border" style={{ borderColor: 'rgba(0,240,255,0.08)' }} />
                <div className="absolute inset-12 rounded-full border" style={{ borderColor: 'rgba(0,240,255,0.05)' }} />
                <div className="absolute w-[1px] bg-[rgba(0,240,255,0.06)]" style={{ top: 0, bottom: 0, left: '50%' }} />
                <div className="absolute h-[1px] bg-[rgba(0,240,255,0.06)]" style={{ left: 0, right: 0, top: '50%' }} />
                <div className="absolute inset-0 rounded-full animate-spin" style={{ animationDuration: '4s', background: 'conic-gradient(from 0deg, transparent, rgba(0,240,255,0.2), transparent)' }} />
                {/* Blips */}
                <div className="absolute w-2 h-2 rounded-full" style={{ top: '25%', left: '35%', background: '#a6e3a1', boxShadow: '0 0 6px #a6e3a1' }} />
                <div className="absolute w-1.5 h-1.5 rounded-full animate-pulse" style={{ top: '60%', left: '65%', background: '#f9e2af', boxShadow: '0 0 6px #f9e2af' }} />
                <div className="absolute w-1.5 h-1.5 rounded-full" style={{ top: '40%', left: '55%', background: '#89b4fa', boxShadow: '0 0 6px #89b4fa' }} />
              </div>
              <div className="absolute bottom-3 left-3" style={{ ...mono, fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'rgba(0,240,255,0.3)' }}>RADAR SECTOR 7G</div>
            </div>

            {/* System log */}
            <div className="md:col-span-2 flex flex-col gap-4" style={{ border: '1px solid rgba(0,240,255,0.08)', padding: '1rem' }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ ...mono, fontSize: '0.625rem', letterSpacing: '0.15em', color: 'rgba(0,240,255,0.4)' }}>SYSTEM LOG</span>
                <span style={{ ...mono, fontSize: '0.5625rem', color: 'rgba(0,240,255,0.3)' }}>LIVE</span>
              </div>
              <div className="flex-1 space-y-1 overflow-hidden" style={{ ...mono, fontSize: '0.75rem', lineHeight: 1.7 }}>
                <div style={{ color: '#6c7086' }}>[{time.toLocaleTimeString('en-US', { hour12: false })}]</div>
                <div><span style={{ color: '#a6e3a1' }}>✓</span> <span style={{ color: 'rgba(0,240,255,0.6)' }}>Core reactor nominal</span></div>
                <div><span style={{ color: '#a6e3a1' }}>✓</span> <span style={{ color: 'rgba(0,240,255,0.6)' }}>Deflector shields at {shield.toFixed(1)}%</span></div>
                <div><span style={{ color: '#89b4fa' }}>ℹ</span> <span style={{ color: 'rgba(0,240,255,0.6)' }}>Signal locked on 2.4 GHz</span></div>
                <div><span style={{ color: '#a6e3a1' }}>✓</span> <span style={{ color: 'rgba(0,240,255,0.6)' }}>Data stream stable — 2.4 Gbps</span></div>
                <div><span style={{ color: '#f9e2af' }}>⚠</span> <span style={{ color: 'rgba(0,240,255,0.6)' }}>Minor flux detected in sector 7G</span></div>
                <div><span style={{ color: '#a6e3a1' }}>✓</span> <span style={{ color: 'rgba(0,240,255,0.6)' }}>All systems operational</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Block 3 & 4: MISSION BRIEFING — Раскрываемые панели ── */}
        <div className="px-6 md:px-10 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2" style={{ background: '#00f0ff', boxShadow: '0 0 8px rgba(0,240,255,0.5)' }} />
            <span style={{ ...mono, fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.15em', color: '#00f0ff', textShadow: '0 0 10px rgba(0,240,255,0.3)' }}>MISSION BRIEFING</span>
            <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(0,240,255,0.2), transparent)' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deployment Scenarios */}
            <div>
              <div className="mb-3" style={{ ...mono, fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.15em', color: 'rgba(0,240,255,0.5)', textTransform: 'uppercase' }}>
                DEPLOYMENT SCENARIOS
              </div>
              {[
                { id: 's-iot', title: 'IoT дашборды', desc: 'Real-time sensor monitoring — live-данные с датчиков в HUD-стиле. Статус-панели с прогресс-барами, радар для топологии сети, system log для алертов.' },
                { id: 's-game', title: 'Game UI', desc: 'Immersive heads-up displays — здоровье, щиты, ammo в стиле sci-fi. Corner-акценты + scanline создают ощущение стеклянного кокпита.' },
                { id: 's-crypto', title: 'Крипто-платформы', desc: 'Live trading dashboards — биржевые данные, графики, ордера в командном центре. Telemetry-панели = price, volume, spread в реальном времени.' },
                { id: 's-monitor', title: 'Мониторинг систем', desc: 'Server & infrastructure — CPU, RAM, network в live-панелях. Scan-line + grid overlay = ощущение ситуационного центра NASA.' },
              ].map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => setExpandedScenario((p) => p === item.id ? null : item.id)}
                    className="w-full text-left cursor-pointer flex items-center gap-2 py-2.5 px-1"
                    style={{ ...mono, fontSize: '0.75rem', background: 'none', border: 'none', borderBottom: '1px solid rgba(0,240,255,0.06)' }}
                  >
                    <span style={{ fontSize: '0.5rem', transition: 'transform 0.2s', display: 'inline-block', transform: expandedScenario === item.id ? 'rotate(90deg)' : 'rotate(0deg)', color: 'rgba(0,240,255,0.3)' }}>{'▶'}</span>
                    <span style={{ color: '#00f0ff', textShadow: '0 0 6px rgba(0,240,255,0.4)' }}>▹</span>
                    <span style={{ color: 'rgba(0,240,255,0.8)', fontWeight: 600 }}>{item.title}</span>
                  </button>
                  <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: expandedScenario === item.id ? ACCORDION_MAX_H : '0px', opacity: expandedScenario === item.id ? 1 : 0 }}>
                    <div style={{ ...mono, padding: '2px 0 8px 22px', fontSize: '0.6875rem', lineHeight: 1.7, color: 'rgba(0,240,255,0.5)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* System Specifications */}
            <div>
              <div className="mb-3" style={{ ...mono, fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.15em', color: 'rgba(0,240,255,0.5)', textTransform: 'uppercase' }}>
                SYSTEM SPECIFICATIONS
              </div>
              {[
                { id: 's-cyan', label: 'Cyan accents', desc: 'Primary HUD color system — #00f0ff как main accent. Text-shadow для glow-эффекта, border с низким opacity для рамок. Читается на любом фоне.' },
                { id: 's-grid', label: 'Grid overlay', desc: 'Perspective depth mapping — repeating-linear-gradient создаёт mesh 40×40px. Фон без сетки = плоский, с сеткой = 3D-пространство.' },
                { id: 's-radar', label: 'Animated radar', desc: 'Real-time sweep visualization — conic-gradient + CSS spin animation. Blips = фиксированные точки. 4s rotation = calm monitoring pace.' },
                { id: 's-telemetry', label: 'Live telemetry', desc: 'Dynamic data streams — setInterval + random jitter для реалистичных значений. Прогресс-бары с gradient + glow. Core/shield/signal/bandwidth.' },
              ].map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => setExpandedSpec((p) => p === item.id ? null : item.id)}
                    className="w-full text-left cursor-pointer flex items-center gap-2 py-2.5 px-1"
                    style={{ ...mono, fontSize: '0.75rem', background: 'none', border: 'none', borderBottom: '1px solid rgba(0,240,255,0.06)' }}
                  >
                    <span style={{ fontSize: '0.5rem', transition: 'transform 0.2s', display: 'inline-block', transform: expandedSpec === item.id ? 'rotate(90deg)' : 'rotate(0deg)', color: 'rgba(0,240,255,0.3)' }}>{'▶'}</span>
                    <span style={{ color: '#a6e3a1', textShadow: '0 0 6px rgba(166,227,161,0.4)' }}>◈</span>
                    <span style={{ color: '#cdd6f4', fontWeight: 600 }}>{item.label}</span>
                  </button>
                  <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: expandedSpec === item.id ? ACCORDION_MAX_H : '0px', opacity: expandedSpec === item.id ? 1 : 0 }}>
                    <div style={{ ...mono, padding: '2px 0 8px 22px', fontSize: '0.6875rem', lineHeight: 1.7, color: 'rgba(0,240,255,0.5)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   5. CODE ART — code as poetry
   ═══════════════════════════════════════════════════════════════════════ */

function CodeArtPage() {
  const [highlightedLine, setHighlightedLine] = useState(-1)
  const [expandedUseCase, setExpandedUseCase] = useState<string | null>(null)
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  useEffect(() => {
    const t = setInterval(() => setHighlightedLine((p) => {
      const next = p + 1
      return next > 19 ? -1 : next
    }), 1200)
    return () => clearInterval(t)
  }, [])

  const codeLines = [
    { num: 1,  content: <><span style={{ color: '#676e95' }}>{'/**'}</span></> },
    { num: 2,  content: <><span style={{ color: '#676e95' }}> * Code Art — where code meets canvas</span></> },
    { num: 3,  content: <><span style={{ color: '#676e95' }}> * Each line is a brush stroke, each function a composition</span></> },
    { num: 4,  content: <><span style={{ color: '#676e95' }}> */</span></> },
    { num: 5,  content: <></> },
    { num: 6,  content: <><span style={{ color: '#c792ea' }}>import</span> <span style={{ color: '#c3cee3' }}>{'{ '}</span><span style={{ color: '#f78c6c' }}>creativity</span><span style={{ color: '#c3cee3' }}>{' }'}</span> <span style={{ color: '#c792ea' }}>from</span> <span style={{ color: '#c3e88d' }}>{'\'imagination\''}</span><span style={{ color: '#89ddff' }}>;</span></> },
    { num: 7,  content: <><span style={{ color: '#c792ea' }}>import</span> <span style={{ color: '#c3cee3' }}>{'{ '}</span><span style={{ color: '#f78c6c' }}>precision</span><span style={{ color: '#c3cee3' }}>{' }'}</span> <span style={{ color: '#c792ea' }}>from</span> <span style={{ color: '#c3e88d' }}>{'\'engineering\''}</span><span style={{ color: '#89ddff' }}>;</span></> },
    { num: 8,  content: <></> },
    { num: 9,  content: <><span style={{ color: '#c792ea' }}>interface</span> <span style={{ color: '#82aaff' }}>AestheticShowcase</span> <span style={{ color: '#89ddff' }}>{'{'}</span></> },
    { num: 10,  content: <><span style={{ color: '#c3cee3' }}>  name</span><span style={{ color: '#89ddff' }}>:</span> <span style={{ color: '#c3e88d' }}>{'"code-art"'}</span><span style={{ color: '#89ddff' }}>;</span></> },
    { num: 11,  content: <><span style={{ color: '#c3cee3' }}>  styles</span><span style={{ color: '#89ddff' }}>:</span> <span style={{ color: '#82aaff' }}>Style</span><span style={{ color: '#89ddff' }}>[];</span></> },
    { num: 12,  content: <><span style={{ color: '#c3cee3' }}>  interactive</span><span style={{ color: '#89ddff' }}>:</span> <span style={{ color: '#f78c6c' }}>true</span><span style={{ color: '#89ddff' }}>;</span></> },
    { num: 13,  content: <><span style={{ color: '#c3cee3' }}>  medium</span><span style={{ color: '#89ddff' }}>:</span> <span style={{ color: '#c3e88d' }}>{'"the web"'}</span><span style={{ color: '#89ddff' }}>;</span></> },
    { num: 14,  content: <><span style={{ color: '#89ddff' }}>{'}'}</span></> },
    { num: 15,  content: <></> },
    { num: 16,  content: <><span style={{ color: '#c792ea' }}>const</span> <span style={{ color: '#82aaff' }}>motto</span><span style={{ color: '#89ddff' }}> = </span><span style={{ color: '#c3cee3' }}>{'`'}</span><span style={{ color: '#c3e88d' }}>{'Code is poetry in motion.'}</span><span style={{ color: '#c3cee3' }}>{'`'}</span><span style={{ color: '#89ddff' }}>;</span></> },
    { num: 17,  content: <><span style={{ color: '#c792ea' }}>const</span> <span style={{ color: '#82aaff' }}>truth</span><span style={{ color: '#89ddff' }}> = </span><span style={{ color: '#c3cee3' }}>{'`'}</span><span style={{ color: '#c3e88d' }}>{'Every pixel is intentional.'}</span><span style={{ color: '#c3cee3' }}>{'`'}</span><span style={{ color: '#89ddff' }}>;</span></> },
    { num: 18,  content: <></> },
    { num: 19,  content: <><span style={{ color: '#c792ea' }}>export</span> <span style={{ color: '#c792ea' }}>default</span> <span style={{ color: '#82aaff' }}>showcase</span><span style={{ color: '#89ddff' }}>;</span> <span style={{ color: '#676e95' }}>{'// ✦'}</span></> },
  ]

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col" style={{ background: '#0c0c14' }}>
      {/* ── Block 1: Что это — Top info bar ── */}
      <div className="flex items-center justify-between px-6 py-3 shrink-0" style={{ borderBottom: '1px solid rgba(199,146,234,0.08)' }}>
        <div className="flex items-center gap-2.5">
          <span style={{ ...mono, fontSize: '0.6875rem', letterSpacing: '0.1em', color: '#676e95' }}>{'//'}</span>
          <span style={{ ...mono, fontSize: '0.8125rem', fontWeight: 600, color: '#c792ea' }}>showcase.ts</span>
        </div>
        <div className="hidden sm:block" style={{ ...mono, fontSize: '0.6875rem', color: '#676e95' }}>
          Код как визуальное искусство — Material Theme и поэтический код
        </div>
        <div className="flex items-center gap-4">
          <span style={{ ...mono, fontSize: '0.6875rem', letterSpacing: '0.1em', color: '#676e95' }}>TypeScript</span>
          <span style={{ ...mono, fontSize: '0.6875rem', letterSpacing: '0.1em', color: '#676e95' }}>UTF-8</span>
        </div>
      </div>

      {/* ── Block 2: Editor + Info panels — Split layout ── */}
      <div className="shrink-0 flex flex-col md:flex-row">
        {/* Left: Code editor */}
        <div className="flex-1 min-w-0">
          <div className="flex">
            {/* Line numbers */}
            <div className="hidden sm:block py-8 pl-6 pr-4 text-right select-none" style={{ ...mono, fontSize: '0.875rem', lineHeight: 1.85, color: '#3b3f54', minWidth: '3.5rem' }}>
              {codeLines.map((l) => (
                <div key={l.num} className={highlightedLine === l.num ? 'text-[#676e95]' : ''}>{l.num}</div>
              ))}
            </div>

            {/* Code */}
            <div className="flex-1 py-8 pr-6" style={{ ...mono, fontSize: '0.875rem', lineHeight: 1.85 }}>
              {codeLines.map((l) => (
                <div
                  key={l.num}
                  className="transition-all duration-500"
                  style={{ padding: '0 8px', margin: '0 -8px', borderRadius: '2px', background: highlightedLine === l.num ? 'rgba(199,146,234,0.06)' : 'transparent', borderLeft: highlightedLine === l.num ? '2px solid rgba(199,146,234,0.3)' : '2px solid transparent' }}
                >{l.content || '\u00A0'}</div>
              ))}
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-6 py-2.5" style={{ borderTop: '1px solid rgba(199,146,234,0.08)' }}>
            <div className="flex items-center gap-3" style={{ ...mono, fontSize: '0.6875rem', color: '#676e95' }}>
              <span>Material Theme</span>
              <span>·</span>
              <span>Geist Mono</span>
            </div>
            <div className="flex items-center gap-3" style={{ ...mono, fontSize: '0.6875rem', color: '#676e95' }}>
              <span>19 lines</span>
              <span>·</span>
              <span>TypeScript</span>
            </div>
          </div>
        </div>

        {/* Right: Info panels */}
        <div className="md:w-[340px] lg:w-[380px] shrink-0 md:border-l flex flex-col" style={{ borderColor: 'rgba(199,146,234,0.08)' }}>
          {/* @use cases */}
          <div className="p-5 pb-3">
            <div className="mb-2" style={{ ...mono, fontSize: '0.6875rem', color: '#546e7a' }}>{'// ─── @use cases ──────────'}</div>
            {[
              { id: 'use-blogs', title: 'dev-блоги', desc: 'Readable & aesthetic code presentation — подсветка синтаксиса превращает статьи в визуальный контент. Читатель видит код, а не wall of text.', color: '#c792ea' },
              { id: 'use-oss', title: 'open-source', desc: 'Documentation as art — README и docs в стиле code-art привлекают контрибьюторов. Код становится визитной карточкой проекта.', color: '#82aaff' },
              { id: 'use-conf', title: 'конференции', desc: 'Presentation-ready code blocks — слайды с подсвеченным кодом выглядят как живой редактор. Material Theme читается даже с далёкого экрана.', color: '#c3e88d' },
              { id: 'use-docs', title: 'документация', desc: 'Pleasant code reading experience — комфортное чтение долгих примеров. Подсветка + анимация снижают когнитивную нагрузку при изучении API.', color: '#f78c6c' },
            ].map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => setExpandedUseCase((p) => p === item.id ? null : item.id)}
                  className="w-full text-left cursor-pointer flex items-center gap-2"
                  style={{ ...mono, fontSize: '0.8125rem', padding: '6px 0', background: 'none', border: 'none', color: '#c3cee3' }}
                >
                  <span style={{ fontSize: '0.5625rem', transition: 'transform 0.2s', display: 'inline-block', transform: expandedUseCase === item.id ? 'rotate(90deg)' : 'rotate(0deg)', color: '#546e7a' }}>{'▶'}</span>
                  <span style={{ color: '#89ddff' }}>{'@use'}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.title}</span>
                </button>
                <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: expandedUseCase === item.id ? ACCORDION_MAX_H : '0px', opacity: expandedUseCase === item.id ? 1 : 0 }}>
                  <div style={{ ...mono, padding: '2px 0 6px 18px', fontSize: '0.75rem', lineHeight: 1.7, color: '#676e95' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* features */}
          <div className="p-5 pt-3 md:border-t" style={{ borderColor: 'rgba(199,146,234,0.08)' }}>
            <div className="mb-2" style={{ ...mono, fontSize: '0.6875rem', color: '#546e7a' }}>{'// ─── features ────────────'}</div>
            {[
              { id: 'feat-theme', title: 'Material Theme', desc: 'Deep, rich color palette — тёмный фон с насыщенными акцентами (purple, blue, green, orange). Каждый тип токена имеет свой цвет для максимальной различимости.', color: '#c792ea' },
              { id: 'feat-hl', title: 'Line highlighting', desc: 'Animated focus cursor — плавное перемещение подсветки по строкам создаёт эффект «живого кода». Duration 500ms с ease transition.', color: '#82aaff' },
              { id: 'feat-syntax', title: 'Syntax colors', desc: 'Language as visual art — ключевые слова, типы, строки и комментарии окрашены по Material Theme спецификации. Читается мгновенно.', color: '#c3e88d' },
              { id: 'feat-poetic', title: 'Poetic code', desc: 'Every line tells a story — код написан как литература: imports из imagination, interface как композиция. Контент дополняет визуальный стиль.', color: '#f78c6c' },
            ].map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => setExpandedFeature((p) => p === item.id ? null : item.id)}
                  className="w-full text-left cursor-pointer flex items-center gap-2"
                  style={{ ...mono, fontSize: '0.8125rem', padding: '6px 0', background: 'none', border: 'none', color: '#c3cee3' }}
                >
                  <span style={{ fontSize: '0.5625rem', transition: 'transform 0.2s', display: 'inline-block', transform: expandedFeature === item.id ? 'rotate(90deg)' : 'rotate(0deg)', color: '#546e7a' }}>{'▶'}</span>
                  <span style={{ color: '#676e95' }}>{'// ▸'}</span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.title}</span>
                </button>
                <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: expandedFeature === item.id ? ACCORDION_MAX_H : '0px', opacity: expandedFeature === item.id ? 1 : 0 }}>
                  <div style={{ ...mono, padding: '2px 0 6px 18px', fontSize: '0.75rem', lineHeight: 1.7, color: '#676e95' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   6. CLEAN / MODERN — bento grid, typography, restraint
   ═══════════════════════════════════════════════════════════════════════ */

function CleanModernPage() {
  const [expandedUseCase, setExpandedUseCase] = useState<string | null>(null)
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col" style={{ background: '#fafafa', ...sans }}>

      {/* ── Block 1: Minimal header ── */}
      <div className="px-6 md:px-12 lg:px-20 pt-10 pb-8 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <span style={{ fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#d4d4d4' }}>06</span>
          <span style={{ width: '24px', height: '1px', background: '#e5e5e5', display: 'inline-block' }} />
          <span style={{ fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a3a3a3' }}>Clean / Modern</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3rem)', fontWeight: 300, color: '#171717', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
          Less is more.
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#a3a3a3', marginTop: '0.75rem', maxWidth: '420px', lineHeight: 1.75 }}>
          Минимализм как философия — пространство, типографика и намеренное молчание.
        </p>
      </div>

      {/* ── Block 2: Bento Grid ── */}
      <div className="px-6 md:px-12 lg:px-20 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[minmax(140px,auto)]">

          {/* ─ Card: Typography Scale (2×2 — large) ─ */}
          <div
            className="col-span-2 row-span-2 rounded-2xl transition-all duration-300 cursor-default"
            onMouseEnter={() => setHoveredCard('typo')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ background: '#fff', border: '1px solid #e5e5e5', padding: 'clamp(1.25rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4d4d4' }}>Typography Scale</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem', flex: 1, justifyContent: 'center' }}>
              <div style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: '#171717', lineHeight: 1.05, transition: 'letter-spacing 0.3s', letterSpacing: hoveredCard === 'typo' ? '-0.06em' : '-0.04em' }}>Aa</div>
              <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', fontWeight: 400, color: '#404040', lineHeight: 1.3 }}>The quick brown fox</div>
              <div style={{ fontSize: 'clamp(0.8125rem, 1.5vw, 0.9375rem)', fontWeight: 400, color: '#737373', lineHeight: 1.6 }}>jumps over the lazy dog. Pack my box with five dozen liquor jugs.</div>
            </div>
            <div className="flex gap-4 mt-4" style={{ borderTop: '1px solid #f5f5f5', paddingTop: '0.75rem' }}>
              {[{ w: 300, l: 'Light' }, { w: 500, l: 'Medium' }, { w: 600, l: 'Semi' }, { w: 700, l: 'Bold' }].map((f) => (
                <div key={f.l} style={{ fontSize: '0.625rem', color: '#d4d4d4', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontWeight: f.w, color: '#404040', fontSize: '0.875rem' }}>Ag</span>
                  <span>{f.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─ Card: Spacing Scale (1×1) ─ */}
          <div
            className="rounded-2xl transition-all duration-300"
            onMouseEnter={() => setHoveredCard('space')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ background: '#fff', border: '1px solid #e5e5e5', padding: 'clamp(1rem, 2vw, 1.5rem)', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4d4d4', marginBottom: '1rem' }}>Spacing Scale</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'center' }}>
              {[{ label: 'xs', px: 4 }, { label: 'sm', px: 8 }, { label: 'md', px: 16 }, { label: 'lg', px: 24 }, { label: 'xl', px: 40 }].map((sp) => (
                <div key={sp.label} className="flex items-center gap-2">
                  <span style={{ fontSize: '0.625rem', color: '#d4d4d4', width: '16px', textAlign: 'right', ...mono }}>{sp.label}</span>
                  <div style={{ height: '4px', width: `${sp.px}px`, background: '#e5e5e5', borderRadius: '2px', transition: 'width 0.4s, background 0.4s', ...(hoveredCard === 'space' ? { background: '#a3a3a3' } : {}) }} />
                </div>
              ))}
            </div>
          </div>

          {/* ─ Card: Color Palette (1×1) ─ */}
          <div
            className="rounded-2xl transition-all duration-300"
            onMouseEnter={() => setHoveredCard('color')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ background: '#fff', border: '1px solid #e5e5e5', padding: 'clamp(1rem, 2vw, 1.5rem)', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4d4d4', marginBottom: '1rem' }}>Palette</div>
            <div className="grid grid-cols-3 gap-2" style={{ flex: 1 }}>
              {[
                { hex: '#171717', label: '900' },
                { hex: '#404040', label: '700' },
                { hex: '#737373', label: '500' },
                { hex: '#a3a3a3', label: '400' },
                { hex: '#d4d4d4', label: '300' },
                { hex: '#fafafa', label: '50' },
              ].map((c) => (
                <div key={c.label} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-lg transition-transform duration-200"
                    style={{
                      height: 'clamp(24px, 3vw, 36px)',
                      background: c.hex,
                      border: c.hex === '#fafafa' ? '1px solid #e5e5e5' : 'none',
                      transform: hoveredCard === 'color' ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                  <span style={{ fontSize: '0.5625rem', color: '#d4d4d4', ...mono }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─ Card: Component Lab (1×1) ─ */}
          <div
            className="rounded-2xl transition-all duration-300"
            onMouseEnter={() => setHoveredCard('comp')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ background: '#fff', border: '1px solid #e5e5e5', padding: 'clamp(1rem, 2vw, 1.5rem)', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4d4d4', marginBottom: '1rem' }}>Components</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'center' }}>
              <div className="flex gap-2">
                <div className="rounded-lg px-3 py-1.5 transition-colors duration-200 cursor-default" style={{ background: '#171717', color: '#fafafa', fontSize: '0.6875rem', fontWeight: 500 }}>Primary</div>
                <div className="rounded-lg px-3 py-1.5 transition-colors duration-200 cursor-default" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: hoveredCard === 'comp' ? '#a3a3a3' : '#e5e5e5', color: '#737373', fontSize: '0.6875rem', fontWeight: 500 }}>Secondary</div>
              </div>
              <div className="rounded-lg px-3 py-1.5 transition-colors duration-200" style={{ border: '1px solid #e5e5e5', color: '#d4d4d4', fontSize: '0.6875rem' }}>placeholder...</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 rounded-full relative transition-colors duration-200" style={{ background: '#171717' }}>
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white transition-all" />
                </div>
                <div className="w-8 h-4 rounded-full relative transition-colors duration-200" style={{ background: '#e5e5e5' }}>
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-white transition-all" />
                </div>
                <div className="w-3.5 h-3.5 rounded border transition-colors duration-200" style={{ borderColor: '#171717', background: '#171717' }} />
                <div className="w-3.5 h-3.5 rounded border transition-colors duration-200" style={{ borderColor: '#e5e5e5' }} />
              </div>
            </div>
          </div>

          {/* ─ Card: Design Tokens (1×1) ─ */}
          <div
            className="rounded-2xl transition-all duration-300"
            onMouseEnter={() => setHoveredCard('tokens')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ background: '#171717', padding: 'clamp(1rem, 2vw, 1.5rem)', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#525252', marginBottom: '0.75rem' }}>Design Tokens</div>
            <div style={{ ...mono, fontSize: '0.625rem', lineHeight: 1.9, color: '#a3a3a3', flex: 1 }}>
              <div><span style={{ color: '#525252' }}>--radius</span><span style={{ color: '#525252' }}>:</span> <span style={{ color: '#737373' }}>16px</span><span style={{ color: '#404040' }}>;</span></div>
              <div><span style={{ color: '#525252' }}>--border</span><span style={{ color: '#525252' }}>:</span> <span style={{ color: '#737373' }}>1px solid</span> <span style={{ color: '#d4d4d4' }}>#e5e5e5</span><span style={{ color: '#404040' }}>;</span></div>
              <div><span style={{ color: '#525252' }}>--font</span><span style={{ color: '#525252' }}>:</span> <span style={{ color: '#d4d4d4' }}>{`'Geist Sans'`}</span><span style={{ color: '#404040' }}>;</span></div>
              <div><span style={{ color: '#525252' }}>--transition</span><span style={{ color: '#525252' }}>:</span> <span style={{ color: '#737373' }}>200ms ease</span><span style={{ color: '#404040' }}>;</span></div>
              <div><span style={{ color: '#525252' }}>--shadow</span><span style={{ color: '#525252' }}>:</span> <span style={{ color: '#737373' }}>none</span><span style={{ color: '#404040' }}>;</span></div>
              <div><span style={{ color: '#525252' }}>--accent</span><span style={{ color: '#525252' }}>:</span> <span style={{ color: '#d4d4d4' }}>transparent</span><span style={{ color: '#404040' }}>;</span></div>
            </div>
          </div>

          {/* ─ Card: Philosophy — full width ─ */}
          <div
            className="col-span-2 md:col-span-4 rounded-2xl transition-all duration-300"
            style={{ background: '#fff', border: '1px solid #e5e5e5', padding: 'clamp(1.25rem, 3vw, 2rem) clamp(1.25rem, 4vw, 3rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '100px' }}
          >
            <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', fontWeight: 300, color: '#404040', lineHeight: 1.6, letterSpacing: '-0.01em', maxWidth: '560px' }}>
              {'"Whitespace is not empty space — it\'s the breathing room that lets content speak."'}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#d4d4d4', marginTop: '0.75rem', fontWeight: 400 }}>— Design Philosophy</div>
          </div>
        </div>
      </div>

      {/* ── Block 3 & 4: Когда использовать + Ключевые особенности (vertical stack) ── */}
      <div className="px-6 md:px-12 lg:px-20" style={{ borderTop: '1px solid #e5e5e5' }}>

        {/* Когда использовать */}
        <div className="py-8">
          <div style={{ fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4d4d4', marginBottom: '0.25rem' }}>
            Когда использовать
          </div>
          <div style={{ fontSize: '0.0625rem', background: '#e5e5e5', height: '1px', marginBottom: '0.75rem' }} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {[
              { id: 'use-saas', title: 'SaaS платформы', desc: 'Чистый интерфейс снижает когнитивную нагрузку. Пользователь видит только нужное — навигация, контент, CTA. Без визуального шума.' },
              { id: 'use-corp', title: 'Корпоративные сайты', desc: 'Профессионализм через restraint. Минималистичный дизайн транслирует уверенность и надёжность. Брендинг через типографику и whitespace.' },
              { id: 'use-portfolio', title: 'Портфолио', desc: 'Контент в центре внимания — работы, проекты, навыки. Дизайн отступает и позволяет контенту говорить сам за себя.' },
              { id: 'use-docs2', title: 'Документация', desc: 'Длинные тексты читаются легче при хорошей типографике и air between blocks. Clean-стиль создан для focused reading.' },
            ].map((item, idx) => (
              <div key={item.id}>
                <button
                  onClick={() => setExpandedUseCase((p) => p === item.id ? null : item.id)}
                  className="w-full text-left cursor-pointer flex items-center justify-between transition-colors duration-150"
                  style={{ ...sans, background: 'none', border: 'none', padding: '0.875rem 0', color: '#171717', borderBottom: '1px solid #f5f5f5' }}
                >
                  <span className="flex items-center gap-2">
                    <span style={{ fontSize: '0.625rem', color: '#e5e5e5' }}>{String(idx + 1).padStart(2, '0')}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.title}</span>
                  </span>
                  <span style={{ fontSize: '0.75rem', transition: 'transform 0.2s', display: 'inline-block', transform: expandedUseCase === item.id ? 'rotate(45deg)' : 'rotate(0deg)', color: '#d4d4d4' }}>{'+'}</span>
                </button>
                <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: expandedUseCase === item.id ? ACCORDION_MAX_H : '0px', opacity: expandedUseCase === item.id ? 1 : 0 }}>
                  <div style={{ ...sans, padding: '0 0 1rem 1.25rem', fontSize: '0.8125rem', lineHeight: 1.75, color: '#737373' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ключевые особенности */}
        <div className="py-8" style={{ borderTop: '1px solid #e5e5e5' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4d4d4', marginBottom: '0.25rem' }}>
            Ключевые особенности
          </div>
          <div style={{ fontSize: '0.0625rem', background: '#e5e5e5', height: '1px', marginBottom: '0.75rem' }} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {[
              { id: 'feat-whitespace', title: 'Whitespace first', desc: 'Пространство — главный инструмент. Каждый элемент дышит. Отступы и gap-ы выверены до пикселя для создания визуального ритма.' },
              { id: 'feat-type', title: 'Типографика', desc: 'Geist Sans — нейтральный, читаемый, современный. Шрифт сам по себе достаточен для создания иерархии без дополнительных украшений.' },
              { id: 'feat-neutral', title: 'Нейтральная палитра', desc: 'Чёрный, белый, оттенки серого. Никаких акцентных цветов — фокус исключительно на контенте и структуре.' },
              { id: 'feat-subtle', title: 'Subtle interaction', desc: 'Минимальные hover-состояния, плавные transitions 200ms. Пользователь чувствует отклик, но не отвлекается от контента.' },
            ].map((item, idx) => (
              <div key={item.id}>
                <button
                  onClick={() => setExpandedFeature((p) => p === item.id ? null : item.id)}
                  className="w-full text-left cursor-pointer flex items-center justify-between transition-colors duration-150"
                  style={{ ...sans, background: 'none', border: 'none', padding: '0.875rem 0', color: '#171717', borderBottom: '1px solid #f5f5f5' }}
                >
                  <span className="flex items-center gap-2">
                    <span style={{ fontSize: '0.625rem', color: '#e5e5e5' }}>{String(idx + 1).padStart(2, '0')}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.title}</span>
                  </span>
                  <span style={{ fontSize: '0.75rem', transition: 'transform 0.2s', display: 'inline-block', transform: expandedFeature === item.id ? 'rotate(45deg)' : 'rotate(0deg)', color: '#d4d4d4' }}>{'+'}</span>
                </button>
                <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: expandedFeature === item.id ? ACCORDION_MAX_H : '0px', opacity: expandedFeature === item.id ? 1 : 0 }}>
                  <div style={{ ...sans, padding: '0 0 1rem 1.25rem', fontSize: '0.8125rem', lineHeight: 1.75, color: '#737373' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE — Style Switcher
   ═══════════════════════════════════════════════════════════════════════ */

export default function Home() {
  const [activeStyle, setActiveStyle] = useState<StyleKey>('retro')
  const [animKey, setAnimKey] = useState(0)
  const switcherRef = useRef<HTMLDivElement>(null)

  const switchStyle = (key: StyleKey) => {
    if (key !== activeStyle) {
      setActiveStyle(key)
      setAnimKey((p) => p + 1)
    }
    switcherRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const ActivePage = useMemo(() => {
    switch (activeStyle) {
      case 'retro': return <RetroPage />
      case 'cli': return <CliPage />
      case 'codeart': return <CodeArtPage />
      case 'modern': return <CleanModernPage />
      case 'brutalist': return <BrutalistPage />
      case 'scifi': return <SciFiPage />
    }
  }, [activeStyle])

  const currentMeta = STYLES.find((s) => s.key === activeStyle)!

  const isLight = activeStyle === 'brutalist' || activeStyle === 'modern'

  return (
    <div style={{ ...sans }}>

      {/* ═══════════════════════════════════════════════════════════════
          HERO LANDING — Brutalist typography, black, amber accent
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center text-center" style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        padding: '4rem 1.5rem',
      }}>
        {/* Logo line */}
        <div className="flex items-center gap-2" style={{ ...mono, fontSize: '0.8125rem', color: '#f0c020', letterSpacing: '0.04em' }}>
          <span>{'◆'}</span>
          <span>Web Aesthetic Showcase</span>
        </div>

        {/* THE ART OF */}
        <div style={{
          ...mono,
          fontSize: 'clamp(0.625rem, 1.2vw, 0.75rem)',
          color: '#555',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginTop: '2.5rem',
        }}>
          THE ART OF
        </div>

        {/* WEB */}
        <h1 style={{
          ...mono,
          fontSize: 'clamp(4rem, 15vw, 12rem)',
          fontWeight: 800,
          color: '#e8e8e8',
          lineHeight: 0.9,
          letterSpacing: '-0.04em',
          marginTop: '0.5rem',
        }}>
          WEB
        </h1>

        {/* AESTHETICS */}
        <h1 style={{
          ...mono,
          fontSize: 'clamp(3.5rem, 13vw, 10rem)',
          fontWeight: 800,
          color: '#f0c020',
          lineHeight: 0.9,
          letterSpacing: '-0.04em',
          textShadow: '0 0 60px rgba(240,192,32,0.15)',
        }}>
          AESTHETICS
        </h1>

        {/* Description */}
        <p style={{
          ...sans,
          fontSize: 'clamp(0.875rem, 1.4vw, 1rem)',
          color: '#666',
          lineHeight: 1.8,
          maxWidth: '520px',
          marginTop: '2.5rem',
        }}>
          6 visual languages for the web — interactive showcase of web aesthetic styles. From CRT terminals to clean modernism — the intersection of code and visual design.
        </p>

        {/* Category links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10">
          {STYLES.map((s) => (
            <button
              key={s.key}
              onClick={() => switchStyle(s.key)}
              className="cursor-pointer transition-colors duration-200"
              style={{
                ...mono,
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: activeStyle === s.key ? s.accent : '#999',
                background: 'none',
                border: 'none',
                padding: 0,
                textAlign: 'left',
              }}
              aria-label={`Switch to ${s.label}`}
            >
              {s.pill}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '2rem', background: '#222', marginTop: '3rem' }} />

        {/* Stats */}
        <div className="flex items-center gap-4" style={{ ...mono, fontSize: '0.6875rem', color: '#555', letterSpacing: '0.08em', marginTop: '1.5rem' }}>
          <span>6 STYLES</span>
          <span>{'·'}</span>
          <span>INTERACTIVE</span>
          <span>{'·'}</span>
          <span style={{ color: '#f0c020' }}>{'∞'}</span>
          <span>SWITCH FREELY</span>
        </div>

        {/* Scroll prompt */}
        <div className="flex flex-col items-center gap-1 mt-auto pt-8" style={{ ...mono, fontSize: '0.625rem', color: '#444', letterSpacing: '0.15em' }}>
          <span>SCROLL</span>
          <span style={{ fontSize: '0.5rem', animation: 'bounce 2s ease-in-out infinite' }}>{'▼'}</span>
        </div>
      </section>

      {/* ═══ Style Switcher Section ═══ */}
      <nav ref={switcherRef} aria-label="Style switcher" className="min-h-screen flex flex-col" style={{ ...sans }}>
      {/* ═══ Fixed Header with Style Switcher ═══ */}
      <header className="w-full sticky top-0 z-50 shrink-0" style={{
        background: isLight ? (activeStyle === 'brutalist' ? '#f0f0f0' : '#fafafa') : 'rgba(10,10,18,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: isLight ? '1px solid #e5e5e5' : '1px solid rgba(255,255,255,0.06)',
        height: '56px',
      }}>
        <div className="w-full h-full px-4 md:px-6 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-2 h-2 rounded-sm" style={{ background: currentMeta.accent, boxShadow: `0 0 8px ${currentMeta.accent}50` }} />
            <span className="hidden sm:inline" style={{ ...mono, fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.04em', color: isLight ? '#171717' : '#c3cee3' }}>Web Aesthetic Showcase</span>
          </div>

          {/* Style pills — scrollable on mobile */}
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 min-w-max px-1">
              {STYLES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => switchStyle(s.key)}
                  className="relative px-3 py-1.5 rounded-md text-center transition-all duration-200 whitespace-nowrap"
                  style={{
                    background: activeStyle === s.key ? `${s.accent}18` : 'transparent',
                    border: activeStyle === s.key ? `1px solid ${s.accent}35` : '1px solid transparent',
                  }}
                  aria-label={`Switch to ${s.label} style`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full transition-opacity" style={{ background: s.accent, opacity: activeStyle === s.key ? 1 : 0.4, boxShadow: activeStyle === s.key ? `0 0 6px ${s.accent}50` : 'none' }} />
                    <span style={{ ...mono, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', color: activeStyle === s.key ? s.accent : (isLight ? '#a3a3a3' : '#565575') }}>{s.pill}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Style name */}
          <div className="hidden md:flex items-center shrink-0">
            <span style={{ ...mono, fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.04em', color: currentMeta.accent }}>{currentMeta.label}</span>
          </div>
        </div>
      </header>

      {/* ═══ Page Content ═══ */}
      <main key={animKey} className="flex-1 animate-[fadeIn_0.35s_ease]">
        {ActivePage}
      </main>

      {/* ═══ Footer ═══ */}
      <footer className="w-full shrink-0" style={{
        background: isLight ? (activeStyle === 'brutalist' ? '#f0f0f0' : '#fafafa') : '#0c0c14',
        borderTop: isLight ? '1px solid #e5e5e5' : '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-1.5" style={{ ...mono, fontSize: '0.625rem', letterSpacing: '0.08em', color: isLight ? '#a3a3a3' : '#3b3f54' }}>
          <span>{'//'} Web Aesthetic Showcase</span>
          <span>6 styles · switch freely · {currentMeta.label}</span>
        </div>
      </footer>
      </nav>
    </div>
  )
}
