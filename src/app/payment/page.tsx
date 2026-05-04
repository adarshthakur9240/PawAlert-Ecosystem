"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { TopBar } from "@/components/layout/TopBar"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, CreditCard, Smartphone, Banknote,
  ArrowRight, CheckCircle2, Loader2, Lock, Shield
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// ─── Confetti Particle ────────────────────────────────────────────────────────
interface Particle { id: number; x: number; color: string; size: number; delay: number }

function ConfettiParticle({ particle }: { particle: Particle }) {
  return (
    <motion.div
      className="fixed top-0 rounded-sm pointer-events-none z-[9999]"
      style={{ left: `${particle.x}%`, width: particle.size, height: particle.size * 1.5, backgroundColor: particle.color }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{ y: '110vh', opacity: [1, 1, 0], rotate: 720 }}
      transition={{ duration: 3 + Math.random() * 2, delay: particle.delay, ease: 'easeIn' }}
    />
  )
}

const CONFETTI_COLORS = ['#f97316','#ef4444','#22c55e','#3b82f6','#a855f7','#fbbf24','#ec4899']

function generateConfetti(count = 80): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 6 + Math.random() * 10,
    delay: Math.random() * 0.8,
  }))
}

// ─── UPI Input ──────────────────────────────────────────────────────────────
function UPIInput() {
  const [upi, setUpi] = React.useState("")
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">UPI ID</label>
      <div className="flex gap-3">
        <input
          type="text"
          value={upi}
          onChange={e => setUpi(e.target.value)}
          placeholder="name@upi"
          className="flex-1 bg-gray-50 rounded-2xl h-14 px-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 border-2 border-transparent focus:border-orange-500/30"
        />
        <button className="px-5 h-14 rounded-2xl bg-orange-100 text-orange-600 text-sm font-black">Verify</button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
          <button key={app} className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-black text-gray-500 border border-gray-100 hover:border-orange-300 transition-colors">
            {app}
          </button>
        ))}
      </div>
    </div>
  )
}

function CardInput() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Card Number</label>
        <input
          type="text"
          placeholder="1234  5678  9012  3456"
          className="w-full bg-gray-50 rounded-2xl h-14 px-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 border-2 border-transparent focus:border-orange-500/30"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry</label>
          <input type="text" placeholder="MM / YY" className="w-full bg-gray-50 rounded-2xl h-14 px-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 border-2 border-transparent focus:border-orange-500/30" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CVV</label>
          <input type="password" maxLength={4} placeholder="•••" className="w-full bg-gray-50 rounded-2xl h-14 px-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 border-2 border-transparent focus:border-orange-500/30" />
        </div>
      </div>
    </div>
  )
}

const PAYMENT_OPTIONS = [
  { id: "upi",  label: "UPI / GPay", sub: "PhonePe, Paytm, BHIM", icon: Smartphone, color: "text-blue-600", bg: "bg-blue-50", Panel: UPIInput },
  { id: "card", label: "Debit / Credit Card", sub: "Visa, Mastercard, RuPay", icon: CreditCard, color: "text-gray-600", bg: "bg-gray-50", Panel: CardInput },
  { id: "net",  label: "Netbanking", sub: "All major Indian banks", icon: Banknote, color: "text-emerald-600", bg: "bg-emerald-50", Panel: null },
]

function PaymentContent() {
  const router = useRouter()
  const params = useSearchParams()

  const total    = parseInt(params.get('fee') ?? '2500')
  const petName  = params.get('name') ?? 'Pet'
  const petImage = params.get('image') ?? ''
  const petId    = params.get('petId') ?? 'pet-1'
  const petBreed = params.get('breed') ?? ''
  const isAdoption = params.get('type') === 'adoption'

  const [payMethod, setPayMethod] = React.useState("upi")
  const [paying, setPaying] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [confetti, setConfetti] = React.useState<Particle[]>([])

  const txnId = React.useMemo(() => 'PAW' + Math.random().toString(36).substring(2, 10).toUpperCase(), [])

  const handlePay = async () => {
    setPaying(true)
    await new Promise(r => setTimeout(r, 2000))
    setPaying(false)
    setSuccess(true)
    setConfetti(generateConfetti())
    // Auto-navigate to tracking
    setTimeout(() => {
      const q = new URLSearchParams({ petId, name: petName, image: petImage, breed: petBreed, type: isAdoption ? 'adoption' : 'order', txn: txnId })
      router.push(`/track/${txnId}?${q.toString()}`)
    }, 3000)
  }

  const active = PAYMENT_OPTIONS.find(o => o.id === payMethod)

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <TopBar />

      {/* Header */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 active:scale-90 transition-transform">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-black text-lg text-[#1A1A1A] leading-none">Secure Payment</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Lock className="w-3 h-3" /> 256-bit SSL Encrypted
          </p>
        </div>
      </div>

      <main className="flex-1 p-4 space-y-5 pb-40 max-w-xl mx-auto w-full">

        {/* Order Summary */}
        <div className="bg-orange-50 rounded-[2rem] p-6 flex items-center gap-4 border border-orange-100">
          {petImage ? (
            <img src={petImage} alt={petName} className="w-16 h-16 rounded-[1.2rem] object-cover shrink-0 shadow-md" />
          ) : (
            <div className="w-16 h-16 rounded-[1.2rem] bg-orange-200 flex items-center justify-center shrink-0">
              <span className="text-2xl">🐾</span>
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-black text-lg text-[#1A1A1A]">{isAdoption ? `Adopt ${petName}` : 'Your Order'}</h3>
            <p className="text-xs font-bold text-gray-400">{petBreed}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase">Total</p>
            <p className="text-2xl font-black text-orange-600">₹{total.toLocaleString()}</p>
          </div>
        </div>

        {/* Payment Method Tabs */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100">
            {PAYMENT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setPayMethod(opt.id)}
                className={cn(
                  "flex-1 py-4 text-center transition-all relative",
                  payMethod === opt.id ? "text-orange-600" : "text-gray-400"
                )}
              >
                <opt.icon className="w-5 h-5 mx-auto mb-1" />
                <span className="text-[9px] font-black uppercase tracking-widest block">{opt.id.toUpperCase()}</span>
                {payMethod === opt.id && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
                )}
              </button>
            ))}
          </div>
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div key={payMethod} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                {active?.Panel ? <active.Panel /> : (
                  <div className="text-center py-8 space-y-2">
                    <Banknote className="w-10 h-10 text-gray-200 mx-auto" />
                    <p className="text-sm font-black text-gray-400">Select your bank on the next step</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Security badges */}
        <div className="flex justify-center gap-6">
          {['PCI-DSS', 'RBI Certified', '256-bit SSL'].map(badge => (
            <div key={badge} className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{badge}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Sticky Pay CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 z-40">
        <div className="max-w-xl mx-auto">
          <Button
            onClick={handlePay}
            disabled={paying}
            className="w-full h-16 rounded-[2rem] bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-black text-lg shadow-2xl shadow-orange-600/30 active:scale-95 transition-transform"
          >
            {paying ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Authenticating...</>
            ) : (
              <><Lock className="w-5 h-5 mr-2" /> PAY ₹{total.toLocaleString()} NOW <ArrowRight className="w-5 h-5 ml-2" /></>
            )}
          </Button>
          <p className="text-center text-[10px] font-bold text-gray-400 mt-3">By paying you agree to PawAlert&apos;s Terms</p>
        </div>
      </div>

      {/* Payment Success Overlay */}
      <AnimatePresence>
        {success && (
          <>
            {confetti.map(p => <ConfettiParticle key={p.id} particle={p} />)}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[9998] bg-white flex flex-col items-center justify-center gap-8 p-8"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
              >
                <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600" />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center space-y-3">
                <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tighter">Payment Done! 🎉</h2>
                <p className="text-gray-400 font-semibold">{isAdoption ? `Your adoption of ${petName} is confirmed!` : 'Your order is confirmed!'}</p>
                <div className="bg-gray-50 rounded-2xl px-8 py-4 space-y-1 mt-4">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Transaction ID</p>
                  <p className="font-black text-lg text-[#1A1A1A] font-mono">{txnId}</p>
                </div>
              </motion.div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-sm font-bold text-gray-400">
                Taking you to tracking... 🐾
              </motion.p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <React.Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 stroke-[1.5]" />
        <div className="mt-6 text-center space-y-1">
          <p className="text-lg font-black text-slate-800">Initializing PawAlert...</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sniffing out your dashboard...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </React.Suspense>
  )
}
