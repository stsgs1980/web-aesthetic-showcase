'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/* ══════════════════════════════════════════════════════════════════
   CODE ART / CREATIVE CODING — MAIN STYLE
   Typography: Geist Sans + Geist Mono
   Type Scale: 80/64/48/18/14/12/10 with modular ratio
   ══════════════════════════════════════════════════════════════════ */

/* ─── Type Scale Constants ─── */
const TS = {
  display: { size: 'clamp(3rem, 6vw, 5rem)', weight: 700, lh: 1.05, ls: '-0.035em' },
  h2: { size: '1.125rem', weight: 600, lh: 1.3, ls: '0.04em' },
  bodyLg: { size: '1rem', weight: 400, lh: 1.65, ls: '-0.01em' },
  body: { size: '0.875rem', weight: 400, lh: 1.6, ls: '-0.005em' },
  caption: { size: '0.75rem', weight: 400, lh: 1.55, ls: '0.005em' },
  micro: { size: '0.625rem', weight: 500, lh: 1.5, ls: '0.06em' },
  label: { size: '0.6875rem', weight: 500, lh: 1.4, ls: '0.08em' },
} as const

const mono = { fontFamily: "'Geist Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace" }
const sans = { fontFamily: "'Geist Sans', ui-sans-serif, system-ui, -apple-system, sans-serif" }

/* ─── Retro Terminal (interactive) ─── */

const BOOT_LINES = [
  { text: 'Phoenix BIOS v4.06  (C) 1999 Phoenix Technologies', delay: 60 },
  { text: 'CPU: Intel Pentium III 500MHz', delay: 80 },
  { text: 'Memory Test: 65536K OK', delay: 150 },
  { text: '', delay: 40 },
  { text: 'Loading Z.AI System...', delay: 300 },
  { text: '████████████████████████████████████ 100%', delay: 120 },
  { text: '', delay: 40 },
  { text: '  ╔══════════════════════════════════════════╗', delay: 15 },
  { text: '  ║     Z.AI  TERMINAL  SYSTEM  v3.1       ║', delay: 15 },
  { text: '  ║     (c) 1999 Z.ai Corporation           ║', delay: 15 },
  { text: '  ╚══════════════════════════════════════════╝', delay: 15 },
  { text: '', delay: 40 },
  { text: 'Type "help" for available commands.', delay: 80, isPrompt: true },
]

const COMMANDS: Record<string, string[]> = {
  help: ['Available commands:', '', '  help   - Show help', '  sysinfo - System info', '  matrix - Enter the matrix', '  cls    - Clear screen', '  ls     - List files', '  ver    - Version'],
  sysinfo: ['┌─────────────────────────────┐', '│  OS    : Z.AI DOS 7.1        │', '│  CPU   : Pentium III 500MHz   │', '│  RAM   : 64 MB               │', '│  CRT   : Amber P3            │', '└─────────────────────────────┘'],
  ls: ['  COMMAND  COM    93,890  12-01-99', '  CONFIG   SYS       256  12-01-99', '  WINDOWS      <DIR>  12-01-99', '  TERMINAL EXE   45,312  12-01-99', '', '  3 File(s)  140,610 bytes'],
  ver: ['Z.AI [Version 3.1.1999]', 'Phosphor Amber Edition'],
  whoami: ['user@zai-terminal', 'Logged in as: ADMIN'],
  cls: ['__CLS__'],
}

function RetroTerminalBlock() {
  const [lines, setLines] = useState<Array<{ text: string; type: 'boot' | 'cmd' | 'output' | 'error' | 'prompt' }>>([])
  const [inputVal, setInputVal] = useState('')
  const [inputVisible, setInputVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let totalDelay = 0
    const t: ReturnType<typeof setTimeout>[] = []
    for (const line of BOOT_LINES) { totalDelay += line.delay; t.push(setTimeout(() => setLines((p) => [...p, { text: line.text, type: line.isPrompt ? 'prompt' : 'boot' }]), totalDelay)) }
    t.push(setTimeout(() => { setInputVisible(true); setTimeout(() => inputRef.current?.focus(), 50) }, totalDelay + 200))
    return () => t.forEach(clearTimeout)
  }, [])
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, [lines])

  const processCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase(); const sp = cmd.indexOf(' '); const base = sp > -1 ? cmd.slice(0, sp) : cmd; const arg = sp > -1 ? raw.trim().slice(sp + 1) : ''
    if (base === 'cls') { setLines([]); return }
    if (base === 'echo') { setLines((p) => [...p, { text: `C:\\>${raw.trim()}`, type: 'cmd' }, { text: arg || '', type: 'output' }]); return }
    if (base === 'matrix') { setLines((p) => [...p, { text: `C:\\>${raw.trim()}`, type: 'cmd' }, { text: '', type: 'output' }, { text: '  01001000 01100101 01101100 01101100 01101111', type: 'output' }, { text: '  01010111 01101111 01110010 01101100 01100100', type: 'output' }, { text: '', type: 'output' }]); return }
    if (base === '') { setLines((p) => [...p, { text: 'C:\\>', type: 'cmd' }]); return }
    const r = COMMANDS[base]
    if (r) setLines((p) => [...p, { text: `C:\\>${raw.trim()}`, type: 'cmd' }, ...r.map((t) => ({ text: t, type: 'output' as const }))])
    else setLines((p) => [...p, { text: `C:\\>${raw.trim()}`, type: 'cmd' }, { text: `  '${base}' is not recognized.`, type: 'error' }, { text: '', type: 'output' }])
  }, [])

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: '#0a0800', border: '2px solid #333' }}>
      {/* Bezel */}
      <div className="flex items-center justify-between px-4 py-2" style={{ background: '#1a1a1a', borderBottom: '1px solid #333' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#f0c020] opacity-60" style={{ boxShadow: '0 0 4px rgba(240,192,32,0.5)' }} />
          <span className="font-mono" style={{ ...mono, fontSize: TS.label.size, fontWeight: TS.label.weight, letterSpacing: TS.label.ls, color: '#555' }}>retro_terminal.exe</span>
        </div>
        <span className="font-mono" style={{ ...mono, fontSize: TS.micro.size, fontWeight: TS.micro.weight, letterSpacing: TS.micro.ls, color: '#444' }}>CRT-15</span>
      </div>
      {/* Scanlines + content */}
      <div className="relative">
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.12) 1px, rgba(0,0,0,0.12) 2px)' }} />
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.4) 100%)' }} />
        <div ref={scrollRef} className="relative z-0 p-4 overflow-y-auto" style={{ ...mono, fontSize: TS.body.size, lineHeight: 1.7, color: '#f0c020', textShadow: '0 0 5px rgba(240,192,32,0.5)', maxHeight: '200px', fontFeatureSettings: '"liga" off, "calt" off' }}>
          {lines.map((line, i) => {
            if (line.type === 'error') return <div key={i} style={{ color: '#ff6666' }}>{line.text || '\u00A0'}</div>
            if (line.type === 'prompt') return <div key={i} style={{ color: '#ffe066' }}>{line.text || '\u00A0'}</div>
            return <div key={i}>{line.text || '\u00A0'}</div>
          })}
          {inputVisible && (
            <div className="flex items-center">
              <span style={{ color: '#f0c020' }}>C:\&gt;</span>
              <span className="mx-1">&nbsp;</span>
              <input ref={inputRef} value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && inputVal.trim()) { processCommand(inputVal); setInputVal('') } }} className="flex-1 bg-transparent outline-none caret-[#f0c020]" style={{ color: '#f0c020', textShadow: '0 0 5px rgba(240,192,32,0.5)', ...mono, fontSize: TS.body.size, fontFeatureSettings: '"liga" off, "calt" off' }} autoFocus spellCheck={false} autoComplete="off" />
              <span className="inline-block w-[5px] h-[14px] bg-[#f0c020] animate-[blink_0.7s_step-end_infinite]" style={{ boxShadow: '0 0 5px rgba(240,192,32,0.7)' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Brutalist Shell (interactive) ─── */

function BrutalistBlock() {
  const [tab, setTab] = useState<'html' | 'manifesto'>('html')
  return (
    <div className="border-2 border-black bg-white overflow-hidden" style={{ fontFamily: 'monospace' }}>
      <div className="flex" role="tablist">
        <button onClick={() => setTab('html')} role="tab" aria-selected={tab === 'html'} className={`px-4 py-1.5 transition-colors ${tab === 'html' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`} style={{ ...mono, fontSize: TS.label.size, fontWeight: TS.label.weight, letterSpacing: TS.label.ls, textTransform: 'uppercase' as const, borderRight: '2px solid black', borderBottom: tab === 'html' ? '2px solid black' : 'none' }}>HTML</button>
        <button onClick={() => setTab('manifesto')} role="tab" aria-selected={tab === 'manifesto'} className={`px-4 py-1.5 transition-colors ${tab === 'manifesto' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`} style={{ ...mono, fontSize: TS.label.size, fontWeight: TS.label.weight, letterSpacing: TS.label.ls, textTransform: 'uppercase' as const, borderBottom: tab === 'manifesto' ? '2px solid black' : 'none' }}>MANIFESTO</button>
      </div>
      <div className="p-4" style={{ ...mono, fontSize: TS.body.size, lineHeight: TS.body.lh, minHeight: '200px' }}>
        {tab === 'html' && (
          <pre className="whitespace-pre-wrap" style={{ ...mono, fontSize: TS.body.size, lineHeight: 1.7 }}>{`<BODY BGCOLOR="white">
  <H1>&lt;BRUTALIST SHELL/&gt;</H1>
  <P>
    NO SHADOWS. NO BLUR. NO ROUNDED.
    JUST RAW STRUCTURE AND TRUTH.
  </P>
  <TABLE BORDER="2" CELLPADDING="3">
    <TR><TD BGCOLOR="#ffff00">STATUS</TD>
        <TD>OPERATIONAL</TD></TR>
    <TR><TD BGCOLOR="#ffff00">DESIGN</TD>
        <TD>ANTI-DESIGN</TD></TR>
  </TABLE>
</BODY>`}</pre>
        )}
        {tab === 'manifesto' && (
          <div style={{ ...mono, fontSize: TS.body.size, lineHeight: TS.body.lh }}>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>FORM FOLLOWS FUNCTION</li>
              <li>BORDERS EXIST TO BE SEEN</li>
              <li>NO SHADOW WITHOUT PURPOSE</li>
              <li>CONTENT OVER DECORATION</li>
              <li>A BUTTON NEEDS NO GRADIENT</li>
            </ol>
            <div className="border-2 border-black bg-black text-[#0f0] p-0.5 overflow-hidden mt-3">
              <div className="whitespace-nowrap animate-[marquee_12s_linear_infinite] inline-block" style={{ ...mono, fontSize: TS.micro.size, letterSpacing: TS.micro.ls }}>★ BRUTALISM IS A STATEMENT ★</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── CLI Style (visual) ─── */

function CliBlock() {
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: '#1e1e2e' }}>
      <div className="flex items-center gap-2.5 px-4 py-2" style={{ background: '#181825' }}>
        <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#f38ba8]" /><div className="w-2.5 h-2.5 rounded-full bg-[#f9e2af]" /><div className="w-2.5 h-2.5 rounded-full bg-[#a6e3a1]" /></div>
        <span className="font-mono" style={{ ...mono, fontSize: TS.label.size, fontWeight: TS.label.weight, letterSpacing: TS.label.ls, color: '#6c7086' }}>user@zai: ~/projects</span>
      </div>
      <div className="p-4 space-y-1" style={{ ...mono, fontSize: TS.body.size, lineHeight: 1.7, color: '#cdd6f4' }}>
        <div><span style={{ color: '#a6e3a1' }}>user@zai</span><span style={{ color: '#89b4fa' }}>:~/projects</span><span style={{ color: '#cdd6f4' }}>$ </span><span style={{ color: '#f38ba8' }}>git</span> status</div>
        <div style={{ color: '#a6e3a1' }}>On branch <span style={{ color: '#89b4fa' }}>main</span></div>
        <div />
        <div><span style={{ color: '#a6e3a1' }}>user@zai</span><span style={{ color: '#89b4fa' }}>:~/projects</span><span style={{ color: '#cdd6f4' }}>$ </span><span style={{ color: '#f38ba8' }}>npm</span> run build</div>
        <div style={{ color: '#a6e3a1' }}>{'✓'} Compiled successfully</div>
        <div style={{ color: '#a6e3a1' }}>{'✓'} Generating pages (5/5)</div>
        <div />
        <div><span style={{ color: '#a6e3a1' }}>user@zai</span><span style={{ color: '#89b4fa' }}>:~/projects</span><span style={{ color: '#cdd6f4' }}>$ </span><span className="inline-block w-[5px] h-[14px] bg-[#f5e0dc] animate-[blink_0.8s_step-end_infinite]" /></div>
      </div>
    </div>
  )
}

/* ─── Sci-Fi UI (visual) ─── */

function SciFiBlock() {
  const [scanY, setScanY] = useState(0)
  useEffect(() => { const t = setInterval(() => setScanY((p) => (p + 0.5) % 100), 35); return () => clearInterval(t) }, [])
  return (
    <div className="relative rounded-lg overflow-hidden min-h-[230px]" style={{ background: '#0a0e1a', border: '1px solid rgba(0,240,255,0.12)' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="absolute left-0 right-0 h-[1px] z-10 pointer-events-none" style={{ top: `${scanY}%`, background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.35), transparent)', boxShadow: '0 0 15px rgba(0,240,255,0.2)' }} />
      {/* HUD corners */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l" style={{ borderColor: 'rgba(0,240,255,0.4)' }} />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r" style={{ borderColor: 'rgba(0,240,255,0.4)' }} />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l" style={{ borderColor: 'rgba(0,240,255,0.4)' }} />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r" style={{ borderColor: 'rgba(0,240,255,0.4)' }} />
      <div className="relative z-10 p-5 flex items-center gap-6 h-full" style={{ ...mono }}>
        <div className="text-center">
          <h3 className="font-bold tracking-[0.3em]" style={{ fontSize: '1rem', lineHeight: 1.2, color: '#00f0ff', textShadow: '0 0 15px rgba(0,240,255,0.4)' }}>ONLINE</h3>
          <p className="mt-1" style={{ ...TS.micro, color: 'rgba(0,240,255,0.35)' }}>HUD v4.2</p>
        </div>
        <div className="border-l h-14" style={{ borderColor: 'rgba(0,240,255,0.15)' }} />
        <div className="space-y-2" style={{ ...TS.caption, letterSpacing: '0.08em' }}>
          <div className="flex justify-between gap-4"><span style={{ color: 'rgba(0,240,255,0.5)' }}>CORE</span><span style={{ color: '#a6e3a1' }}>ACTIVE</span></div>
          <div className="flex justify-between gap-4"><span style={{ color: 'rgba(0,240,255,0.5)' }}>SHIELD</span><span style={{ color: '#f9e2af' }}>98.7%</span></div>
          <div className="h-[3px] w-20 rounded" style={{ background: 'rgba(0,240,255,0.1)' }}><div className="h-full w-[87%] rounded" style={{ background: 'linear-gradient(90deg, #00f0ff, #a6e3a1)', boxShadow: '0 0 6px rgba(0,240,255,0.4)' }} /></div>
          <div className="flex justify-between gap-4"><span style={{ color: 'rgba(0,240,255,0.5)' }}>SIGNAL</span><span style={{ color: '#cdd6f4' }}>98.2 dBm</span></div>
        </div>
        {/* Mini radar */}
        <div className="relative w-16 h-16 ml-auto">
          <div className="absolute inset-0 rounded-full border" style={{ borderColor: 'rgba(0,240,255,0.15)' }} />
          <div className="absolute inset-2 rounded-full border" style={{ borderColor: 'rgba(0,240,255,0.1)' }} />
          <div className="absolute inset-0 rounded-full animate-spin" style={{ animationDuration: '3s', background: 'conic-gradient(from 0deg, transparent, rgba(0,240,255,0.25), transparent)' }} />
          <div className="absolute top-3 left-5 w-1 h-1 rounded-full" style={{ background: '#a6e3a1', boxShadow: '0 0 4px #a6e3a1' }} />
        </div>
      </div>
    </div>
  )
}

/* ─── Glitch Aesthetic (visual) ─── */

function GlitchBlock() {
  const [glitch, setGlitch] = useState(false)
  useEffect(() => { const t = setInterval(() => { setGlitch(true); setTimeout(() => setGlitch(false), 120) }, 2500); return () => clearInterval(t) }, [])
  return (
    <div className="relative rounded-lg overflow-hidden min-h-[230px]" style={{ background: '#0d0d0d' }}>
      <div className="absolute inset-0 z-20 pointer-events-none opacity-15 mix-blend-screen" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")` }} />
      {glitch && <>
        <div className="absolute left-0 right-0 h-[2px] z-30" style={{ top: '30%', background: '#ff00ff', opacity: 0.6, transform: 'translateX(-4px)' }} />
        <div className="absolute left-0 right-0 h-[2px] z-30" style={{ top: '55%', background: '#00ffff', opacity: 0.5, transform: 'translateX(6px)' }} />
      </>}
      <div className="relative z-10 p-6 flex flex-col items-center justify-center h-full gap-4" style={{ ...mono }}>
        <div className="relative">
          <div className="absolute inset-0" style={{ ...mono, fontSize: '1.375rem', fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', lineHeight: 1, color: '#ff0040', transform: glitch ? 'translate(-2px, 1px)' : 'none', mixBlendMode: 'screen', opacity: 0.6, transition: 'transform 0.05s' }}>GLITCH</div>
          <div className="absolute inset-0" style={{ ...mono, fontSize: '1.375rem', fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', lineHeight: 1, color: '#0040ff', transform: glitch ? 'translate(2px, -1px)' : 'none', mixBlendMode: 'screen', opacity: 0.6, transition: 'transform 0.05s' }}>GLITCH</div>
          <div style={{ ...mono, fontSize: '1.375rem', fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.15em', lineHeight: 1, color: '#fff', textShadow: '0 0 8px rgba(255,255,255,0.2)', transform: glitch ? 'skewX(1deg)' : 'none', transition: 'transform 0.08s' }}>GLITCH</div>
        </div>
        <div className="flex gap-2.5" style={{ ...TS.caption, letterSpacing: '0.08em' }}>
          {[['D4T4_C0RR', '#ff0040'], ['ERR:0xFF', '#00ffff'], ['S3GM3NT', '#ff00ff']].map(([t, c], i) => (
            <div key={i} className="border px-2.5 py-1" style={{ borderColor: c, color: c, transform: glitch ? `translate(${(i % 2 ? 1 : -1) * 3}px, 0)` : 'none', transition: 'transform 0.05s' }}>{t}</div>
          ))}
        </div>
        <p className="tracking-[0.15em]" style={{ ...mono, ...TS.micro, color: 'rgba(255,255,255,0.1)', lineHeight: 1.6 }}>
          <span>01110011 01010100 00110001 11010010</span>
          <br />
          <span>10010110 00111010 11100101 01001011</span>
        </p>
        <div className="w-36 h-[1px]" style={{ background: 'linear-gradient(90deg, #ff0040, #ff00ff, #00ffff)', transform: glitch ? 'scaleX(1.08)' : 'none', transition: 'transform 0.08s' }} />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE — Code Art as the container
   Full-width hero · Proper typographic scale · Semantic markup
   ══════════════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0c0c14', ...sans }}>

      {/* ═══════════════════════════════════════════════════════
          HEADER — full-width, minimal
          ═══════════════════════════════════════════════════════ */}
      <header className="w-full sticky top-0 z-50" style={{ background: 'rgba(12,12,20,0.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="w-full px-6 md:px-10 py-3.5 flex items-center justify-between" style={{ ...mono }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span style={{ color: '#565575' }}>{'//'}</span>
              <span style={{ ...TS.body, ...mono, fontWeight: 600, letterSpacing: '0.02em', color: '#c3cee3' }}>style_showcase.js</span>
            </div>
            <span className="hidden sm:inline" style={{ ...TS.micro, ...mono, color: '#565575' }}>v1.0.0</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {['#f0c020', '#c3cee3', '#89b4fa', '#00f0ff', '#ff00ff', '#c792ea'].map((c) => (
                <div key={c} className="w-1.5 h-1.5 rounded-sm" style={{ background: c, opacity: 0.5 }} />
              ))}
            </div>
            <span className="hidden md:inline" style={{ ...TS.micro, ...mono, letterSpacing: '0.12em', color: '#565575' }}>6 STYLES · CODE AS ART</span>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          HERO — FULL WIDTH, edge-to-edge
          ═══════════════════════════════════════════════════════ */}
      <section className="w-full relative overflow-hidden" aria-label="Hero">
        {/* Background effects */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 10% 50%, rgba(199,146,234,0.05) 0%, transparent 50%), radial-gradient(circle at 90% 50%, rgba(0,240,255,0.04) 0%, transparent 50%)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 w-full px-6 md:px-10 pt-20 pb-14 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24">

          {/* Eyebrow / overline */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-16" style={{ background: 'linear-gradient(90deg, #c792ea, transparent)' }} />
            <span className="font-mono" style={{ ...TS.micro, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#676e95' }}>
              code art / creative coding
            </span>
          </div>

          {/* Display heading — FULL WIDTH */}
          <h1 className="w-full font-bold" style={{ ...mono, fontSize: TS.display.size, fontWeight: TS.display.weight, lineHeight: TS.display.lh, letterSpacing: TS.display.ls, fontFeatureSettings: '"liga" off, "calt" off' }}>
            <span style={{ color: '#c792ea' }}>Code</span>
            <span style={{ color: '#c3cee3' }}>{' '}</span>
            <span style={{ color: '#82aaff' }}>is</span>
            <span style={{ color: '#c3cee3' }}>{' ' }</span>
            <span style={{ color: '#c792ea' }}>Visual</span>
            <span style={{ color: '#89ddff' }}>.</span>
          </h1>

          {/* Subtitle — constrained for readability */}
          <p className="mt-8 max-w-2xl" style={{ ...sans, ...TS.bodyLg, color: '#676e95' }}>
            Код как визуальное искусство. 6 стилей для веб-проектов — от CRT-терминалов до glitch-эстетики.
            Каждый стиль — блок кода в своей уникальной визуальной языковой парадигме.
          </p>

          {/* import statement */}
          <div className="font-mono mt-10" style={{ ...TS.body, ...mono, lineHeight: 1.7 }}>
            <span style={{ color: '#c792ea' }}>import</span>
            <span style={{ color: '#c3cee3' }}> {'{ '}</span>
            {['RetroTerminal', 'Brutalist', 'CLI', 'SciFi', 'Glitch', 'CodeArt'].map((s, i) => (
              <span key={s}>
                {i > 0 && <span style={{ color: '#89ddff' }}>, </span>}
                <span style={{ color: '#f78c6c' }}>{s}</span>
              </span>
            ))}
            <span style={{ color: '#c3cee3' }}> {'}'} </span>
            <span style={{ color: '#c792ea' }}>from</span>
            <span style={{ color: '#c3e88d' }}> {'\'visual-language\''}</span>
            <span style={{ color: '#89ddff' }}>;</span>
          </div>

          {/* Style pills row */}
          <nav className="flex flex-wrap gap-2.5 mt-10" aria-label="Style navigation">
            {[
              { n: 'Retro Terminal', c: '#f0c020', t: 'interactive' },
              { n: 'Brutalist Shell', c: '#c3cee3', t: 'interactive' },
              { n: 'CLI / Command Line', c: '#89b4fa', t: 'visual' },
              { n: 'Sci-Fi UI', c: '#00f0ff', t: 'animated' },
              { n: 'Glitch Aesthetic', c: '#ff00ff', t: 'animated' },
              { n: 'Code Art', c: '#c792ea', t: 'main' },
            ].map((s) => (
              <div key={s.n} className="flex items-center gap-2 px-3.5 py-2 rounded-full border transition-colors hover:brightness-125 cursor-default"
                style={{ borderColor: `${s.c}25`, background: `${s.c}0a` }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.c, boxShadow: `0 0 6px ${s.c}40` }} />
                <span className="font-mono" style={{ ...TS.label, ...mono, color: s.c }}>{s.n}</span>
                <span className="font-mono" style={{ ...TS.micro, ...mono, color: '#565575' }}>{s.t}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom separator */}
        <div className="w-full">
          <div className="h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)' }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STYLE BLOCKS — full-width, proper typography
          ═══════════════════════════════════════════════════════ */}
      <main className="flex-1 w-full px-6 md:px-10 py-10 md:py-14 font-mono" style={{ ...mono }}>

        {/* ─── Block 1: Retro Terminal ─── */}
        <section className="mb-12 md:mb-16" aria-labelledby="style-retro">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-6 rounded" style={{ background: '#f0c020', boxShadow: '0 0 8px rgba(240,192,32,0.4)' }} />
            <span style={{ ...TS.micro, ...mono, letterSpacing: '0.15em', color: '#565575' }}>01</span>
            <h2 id="style-retro" className="font-mono" style={{ ...TS.h2, ...mono, color: '#f0c020' }}>Retro Terminal 2.0</h2>
            <span className="hidden md:inline font-mono ml-auto" style={{ ...TS.micro, ...mono, letterSpacing: '0.1em', color: '#565575' }}>interactive // CRT + amber phosphor + boot sequence</span>
          </div>
          <p className="mb-4" style={{ ...TS.caption, ...mono, color: '#676e95' }}>
            <span style={{ color: '#565575' }}>{'//'}</span> CRT-монитор с amber-yellow, scanlines, boot-анимация
            <span className="hidden sm:inline"> — Когда: <span style={{ color: '#82aaff' }}>DevTools, retro-игры, education</span></span>
          </p>
          <RetroTerminalBlock />
        </section>

        {/* ─── Block 2: Brutalist Shell ─── */}
        <section className="mb-12 md:mb-16" aria-labelledby="style-brutalist">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-6 bg-white" />
            <span style={{ ...TS.micro, ...mono, letterSpacing: '0.15em', color: '#565575' }}>02</span>
            <h2 id="style-brutalist" className="font-mono" style={{ ...TS.h2, ...mono, color: '#c3cee3' }}>Brutalist Shell</h2>
            <span className="hidden md:inline font-mono ml-auto" style={{ ...TS.micro, ...mono, letterSpacing: '0.1em', color: '#565575' }}>interactive // raw HTML + borders + anti-design</span>
          </div>
          <p className="mb-4" style={{ ...TS.caption, ...mono, color: '#676e95' }}>
            <span style={{ color: '#565575' }}>{'//'}</span> Сырой HTML без оформления. Табы: HTML и MANIFESTO
            <span className="hidden sm:inline"> — Когда: <span style={{ color: '#82aaff' }}>Портфолио, арт-проекты, Statement</span></span>
          </p>
          <BrutalistBlock />
        </section>

        {/* ─── Row: CLI + Sci-Fi ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 mb-12 md:mb-16">
          {/* Block 3: CLI */}
          <section aria-labelledby="style-cli">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-6 rounded" style={{ background: '#89b4fa' }} />
              <span style={{ ...TS.micro, ...mono, letterSpacing: '0.15em', color: '#565575' }}>03</span>
              <h2 id="style-cli" className="font-mono" style={{ ...TS.h2, ...mono, color: '#89b4fa' }}>CLI / Command Line</h2>
            </div>
            <p className="mb-4" style={{ ...TS.caption, ...mono, color: '#676e95' }}>
              <span style={{ color: '#565575' }}>{'//'}</span> Catppuccin Mocha. Когда: <span style={{ color: '#82aaff' }}>API docs, dev-лендинги, playgrounds</span>
            </p>
            <CliBlock />
          </section>

          {/* Block 4: Sci-Fi */}
          <section aria-labelledby="style-scifi">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-6 rounded" style={{ background: '#00f0ff', boxShadow: '0 0 6px rgba(0,240,255,0.3)' }} />
              <span style={{ ...TS.micro, ...mono, letterSpacing: '0.15em', color: '#565575' }}>04</span>
              <h2 id="style-scifi" className="font-mono" style={{ ...TS.h2, ...mono, color: '#00f0ff' }}>Sci-Fi UI</h2>
            </div>
            <p className="mb-4" style={{ ...TS.caption, ...mono, color: '#676e95' }}>
              <span style={{ color: '#565575' }}>{'//'}</span> HUD + радар + телеметрия. Когда: <span style={{ color: '#82aaff' }}>IoT, game UI, крипто</span>
            </p>
            <SciFiBlock />
          </section>
        </div>

        {/* ─── Row: Glitch + Code Art ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">

          {/* Block 5: Glitch */}
          <section aria-labelledby="style-glitch">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-6 rounded" style={{ background: '#ff00ff' }} />
              <span style={{ ...TS.micro, ...mono, letterSpacing: '0.15em', color: '#565575' }}>05</span>
              <h2 id="style-glitch" className="font-mono" style={{ ...TS.h2, ...mono, color: '#ff00ff' }}>Glitch Aesthetic</h2>
            </div>
            <p className="mb-4" style={{ ...TS.caption, ...mono, color: '#676e95' }}>
              <span style={{ color: '#565575' }}>{'//'}</span> RGB-split, corruption. Когда: <span style={{ color: '#82aaff' }}>Музыка, киберпанк, 404</span>
            </p>
            <GlitchBlock />
          </section>

          {/* Block 6: Code Art (self-referential) */}
          <section aria-labelledby="style-codeart">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-6 rounded" style={{ background: '#c792ea' }} />
              <span style={{ ...TS.micro, ...mono, letterSpacing: '0.15em', color: '#565575' }}>06</span>
              <h2 id="style-codeart" className="font-mono" style={{ ...TS.h2, ...mono, color: '#c792ea' }}>Code Art</h2>
              <span className="font-mono px-2 py-0.5 rounded" style={{ ...TS.micro, ...mono, color: '#c792ea', background: 'rgba(199,146,234,0.1)', border: '1px solid rgba(199,146,234,0.2)' }}>main</span>
            </div>
            <p className="mb-4" style={{ ...TS.caption, ...mono, color: '#676e95' }}>
              <span style={{ color: '#565575' }}>{'//'}</span> Meta-level. Когда: <span style={{ color: '#82aaff' }}>Dev-блоги, open-source, конференции</span>
            </p>
            <div className="rounded-lg overflow-hidden min-h-[230px]" style={{ background: '#0c0c14', border: '1px solid rgba(199,146,234,0.12)' }}>
              <div className="p-5 h-full flex flex-col" style={{ ...mono, ...TS.body, lineHeight: 1.8 }}>
                <div className="mb-2">
                  <span style={{ color: '#565575' }}>{'//'}</span>
                  <span style={{ color: '#565575' }}> this_page.js — meta-level</span>
                </div>
                <div>
                  <span style={{ color: '#c792ea' }}>const</span>
                  <span style={{ color: '#82aaff' }}> page</span>
                  <span style={{ color: '#89ddff' }}> = {'{'}</span>
                </div>
                <div className="pl-4">
                  <span style={{ color: '#c3cee3' }}>style:</span>
                  <span style={{ color: '#c3e88d' }}> {'\'code_art\''}</span>
                  <span style={{ color: '#89ddff' }}>,</span>
                </div>
                <div className="pl-4">
                  <span style={{ color: '#c3cee3' }}>contains:</span>
                  <span style={{ color: '#89ddff' }}> [</span>
                </div>
                {[
                  ['\'retroTerminal\'', '#f0c020'],
                  ['\'brutalist\'', '#c3cee3'],
                  ['\'cli\'', '#89b4fa'],
                  ['\'sciFiUI\'', '#00f0ff'],
                  ['\'glitch\'', '#ff00ff'],
                  ['\'codeArt\'', '#c792ea'],
                ].map(([name, color]) => (
                  <div key={name} className="pl-8">
                    <span style={{ color: '#c3e88d' }}>{name}</span>
                    <span style={{ color: '#89ddff' }}>,</span>
                    <span style={{ color: '#565575' }}> {'//'} </span>
                    <span style={{ color, opacity: 0.5 }}>style</span>
                  </div>
                ))}
                <div className="pl-4"><span style={{ color: '#89ddff' }}>]</span><span style={{ color: '#89ddff' }}>,</span></div>
                <div className="pl-4">
                  <span style={{ color: '#c3cee3' }}>motto:</span>
                  <span style={{ color: '#c3e88d' }}> {'\'code is poetry\''}</span>
                </div>
                <div><span style={{ color: '#89ddff' }}>{'};'} </span><span style={{ color: '#565575' }}>{'//'} ✦</span></div>
              </div>
            </div>
          </section>
        </div>

        {/* ─── Full-width palette legend ─── */}
        <div className="mt-16 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 className="font-mono mb-5" style={{ ...TS.micro, ...mono, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#565575' }}>{'//'} palette</h3>
          <div className="flex flex-wrap gap-x-8 gap-y-4" style={{ ...TS.caption, ...mono }}>
            {[
              { c: '#f0c020', n: 'Amber P3', u: 'retro terminal' },
              { c: '#c3cee3', n: 'White', u: 'brutalism' },
              { c: '#89b4fa', n: 'Blue', u: 'cli' },
              { c: '#00f0ff', n: 'Cyan', u: 'sci-fi' },
              { c: '#ff00ff', n: 'Magenta', u: 'glitch' },
              { c: '#c792ea', n: 'Purple', u: 'code art' },
              { c: '#a6e3a1', n: 'Green', u: 'success' },
              { c: '#f9e2af', n: 'Yellow', u: 'warning' },
              { c: '#f38ba8', n: 'Red', u: 'error' },
              { c: '#676e95', n: 'Gray', u: 'comments' },
            ].map((x) => (
              <div key={x.n} className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-sm" style={{ background: x.c, boxShadow: `0 0 6px ${x.c}30` }} />
                <span style={{ color: x.c }}>{x.n}</span>
                <span style={{ color: '#565575' }}>{'{'}</span>
                <span style={{ color: '#565575' }}>{x.u}</span>
                <span style={{ color: '#565575' }}>{'}'}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════
          FOOTER — full-width, sticky
          ═══════════════════════════════════════════════════════ */}
      <footer className="w-full mt-auto" style={{ background: '#0c0c14', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="w-full px-6 md:px-10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5" style={{ ...mono, ...TS.micro, letterSpacing: '0.08em', color: '#565575' }}>
          <span>{'//'} Z.ai Style Showcase — Code Art Edition</span>
          <span>6 styles · 2 interactive · full-width hero landing</span>
        </div>
      </footer>
    </div>
  )
}
