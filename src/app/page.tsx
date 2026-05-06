"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ShieldCheck, Heart, Building2, TrendingUp, MapPin, Trophy
} from "lucide-react"
import Link from "next/link"
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs"
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion"

/* ── Floating particle data ────────────────────────── */
const PARTICLES = [
  { emoji:"🐾", x:8,  y:12, size:28, delay:0,   dur:4.5 },
  { emoji:"🐾", x:82, y:8,  size:22, delay:0.8, dur:5.2 },
  { emoji:"🐾", x:55, y:78, size:20, delay:1.6, dur:4.8 },
  { emoji:"❤️", x:15, y:55, size:26, delay:0.4, dur:5.5 },
  { emoji:"❤️", x:88, y:60, size:18, delay:1.2, dur:4.2 },
  { emoji:"🦴", x:65, y:20, size:24, delay:2.0, dur:5.8 },
  { emoji:"🦴", x:30, y:85, size:20, delay:0.6, dur:4.6 },
  { emoji:"⭐", x:75, y:45, size:16, delay:1.8, dur:3.9 },
  { emoji:"🐶", x:6,  y:75, size:22, delay:1.0, dur:5.1 },
  { emoji:"🐱", x:90, y:28, size:20, delay:2.4, dur:4.4 },
]

const stats = [
  { label: "Rescues Made", value: "12,450", icon: ShieldCheck, color: "text-[#E55934]" },
  { label: "Happy Tails",  value: "8,900",  icon: Heart,       color: "text-pink-500"  },
  { label: "Active NGOs",  value: "450+",   icon: Building2,   color: "text-blue-500"  },
]

/* ── 3D Tilt Card ──────────────────────────────────── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [12, -12]), { stiffness:200, damping:20 })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), { stiffness:200, damping:20 })
  const glareX  = useTransform(rawX, [-0.5, 0.5], ["-30%", "130%"])
  const glareY  = useTransform(rawY, [-0.5, 0.5], ["-30%", "130%"])

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width  - 0.5)
    rawY.set((e.clientY - rect.top)  / rect.height - 0.5)
  }
  const handleLeave = () => { rawX.set(0); rawY.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className={className}
    >
      {/* Glare highlight */}
      <motion.div
        style={{ left: glareX, top: glareY }}
        className="absolute pointer-events-none w-40 h-40 rounded-full bg-white/15 blur-2xl -translate-x-1/2 -translate-y-1/2 z-20"
      />
      {children}
    </motion.div>
  )
}

/* ── Shiny Button ──────────────────────────────────── */
function ShinyButton({ children, onClick, className, disabled }: {
  children: React.ReactNode; onClick?: () => void; className?: string; disabled?: boolean
}) {
  const [shine, setShine] = React.useState(false)
  React.useEffect(() => {
    if (disabled) return
    const t = setTimeout(() => setShine(true), 1500)
    const interval = setInterval(() => {
      setShine(true)
      setTimeout(() => setShine(false), 700)
    }, 4000)
    return () => { clearTimeout(t); clearInterval(interval) }
  }, [disabled])

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.04, boxShadow: "0 24px 48px rgba(229,89,52,0.4)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      <AnimatePresence>
        {shine && (
          <motion.div
            key="shine"
            initial={{ x: "-120%", opacity: 0.8, skewX: -15 }}
            animate={{ x: "120%",  opacity: 0.0, skewX: -15 }}
            exit={{}}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="absolute inset-0 w-1/3 bg-white/30 blur-sm pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}

/* ── Stagger container variants ────────────────────── */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } as const },
}

/* ── Main Page ─────────────────────────────────────── */
export default function LandingPage() {
  const { isLoaded, isSignedIn } = useUser()

  return (
    <div className="relative flex flex-col min-h-screen bg-[#080808] text-foreground overflow-hidden">

      {/* ── Animated Gradient Mesh Background ────────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, -40, 0], y: [0, -50, 30, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#E55934]/20 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -80, 50, 0], y: [0, 60, -40, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-orange-300/15 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 40, -60, 0], y: [0, -30, 50, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[90px]"
        />
        {/* Grain overlay for texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />
      </div>

      {/* ── Floating 3D Particles ─────────────────────── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size }}
            animate={{
              y:       [0, -18, 0],
              rotateX: [0, 12, -8, 0],
              rotateY: [0, -10, 14, 0],
              opacity: [0.35, 0.65, 0.35],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </div>

      {/* ── Main Content ─────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-lg mx-auto w-full space-y-10">

        {/* Staggered Hero Title */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="text-center space-y-4"
        >
          {/* Logo mark */}
          <motion.div variants={fadeUp} className="flex justify-center mb-2">
            <motion.div
              animate={{ rotate: [12, 18, 12], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 bg-[#E55934]/15 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-[#E55934]/20 border border-[#E55934]/20 backdrop-blur-sm"
            >
              <img src='/vercel.svg' alt="Logo" className="w-12 h-12" />
            </motion.div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-6xl font-black tracking-tighter leading-none text-white"
          >
            Paw<span className="text-[#E55934]">Alert</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-white/70 text-xl font-extrabold tracking-tight">
            Every Paw Deserves a Home.
          </motion.p>

          <motion.p variants={fadeUp} className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em] max-w-[260px] mx-auto leading-relaxed">
            The Premium Super-App for Stray Rescue &amp; Neighborhood Care
          </motion.p>
        </motion.div>

        {/* 3D Tilt Karma Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
          className="w-full"
        >
          <TiltCard className="w-full relative rounded-[2.5rem] overflow-hidden cursor-pointer">
            <div className="relative bg-gradient-to-br from-[#b33918] via-[#e55934] to-[#ff7849] p-6 rounded-[2.5rem] shadow-2xl shadow-[#E55934]/30 text-left">
              {/* Glassmorphism inner glow */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-white/5 backdrop-blur-[1px]" />
              {/* Watermark trophy */}
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy className="w-32 h-32 rotate-12 text-white" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20 text-white border-none font-black text-[9px] uppercase tracking-widest px-2 h-5">
                    Join the Mission
                  </Badge>
                  <div className="flex -space-x-2">
                    {["🐶","🐱","🐾"].map((e, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-[#b33918] bg-black/30 flex items-center justify-center text-xs">{e}</div>
                    ))}
                  </div>
                </div>
                <h2 className="text-2xl font-black leading-tight uppercase tracking-tighter text-white">
                  Earn Karma Points for Every Rescue
                </h2>
                <p className="text-[11px] text-white/80 font-extrabold leading-relaxed max-w-[220px] uppercase tracking-wide">
                  Level up your rescuer profile and earn badges recognized by authorities.
                </p>
                {/* Karma progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">Your Karma</span>
                    <span className="text-[10px] text-white font-black">1,240 pts</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "62%" }}
                      transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* Main CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 22 }}
          className="w-full space-y-3"
        >
          {!isLoaded ? (
            <div className="w-full h-16 bg-white/5 rounded-[2rem] animate-pulse" />
          ) : isSignedIn ? (
            <Link href="/home" className="block w-full">
              <ShinyButton className="w-full h-16 text-lg rounded-[2rem] bg-[#E55934] text-white font-black uppercase tracking-widest shadow-2xl shadow-[#E55934]/30">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Go to Dashboard <TrendingUp className="w-5 h-5" />
                </span>
              </ShinyButton>
            </Link>
          ) : (
            <>
              <SignUpButton mode="modal">
                <ShinyButton className="w-full h-16 text-lg rounded-[2rem] bg-[#E55934] text-white font-black uppercase tracking-widest shadow-2xl shadow-[#E55934]/30">
                  <span className="relative z-10">Join the Pack 🐾</span>
                </ShinyButton>
              </SignUpButton>
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full h-14 text-base rounded-[2rem] border border-white/10 bg-white/5 text-white font-black uppercase tracking-widest backdrop-blur-sm"
                >
                  Sign In
                </motion.button>
              </SignInButton>
            </>
          )}
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="w-full space-y-4"
        >
          <div className="flex items-center gap-3">
            <h3 className="font-black text-[10px] uppercase tracking-[0.25em] text-white/30 whitespace-nowrap">Global Impact</h3>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="bg-white/5 border border-white/5 p-4 rounded-[1.5rem] flex flex-col items-center gap-2 hover:border-[#E55934]/30 transition-colors cursor-default"
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <div className="space-y-0.5 text-center">
                  <p className="font-black text-sm text-white">{stat.value}</p>
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-tighter">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Nearby Rescues strip */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.01 }}
          className="w-full bg-white/5 border border-white/5 p-5 rounded-[2rem] flex items-center gap-5 text-left hover:border-[#E55934]/20 transition-colors cursor-pointer backdrop-blur-sm"
        >
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shrink-0">
            <MapPin className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-black text-sm text-white uppercase tracking-tight">Nearby Rescues</h4>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">See live reports in your area.</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Live</span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
