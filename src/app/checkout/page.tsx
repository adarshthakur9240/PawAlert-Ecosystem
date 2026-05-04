"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { TopBar } from "@/components/layout/TopBar"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, MapPin, Heart, Home, Building2, 
  ArrowRight, Check, ShieldCheck, CreditCard, 
  Smartphone, Banknote, Loader2, Zap, Timer
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const PAYMENT_OPTIONS = [
  { id: "upi",  label: "UPI / Google Pay", sub: "PhonePe, GPay, Paytm", icon: Smartphone, color: "text-blue-600", bg: "bg-blue-50" },
  { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay", icon: CreditCard, color: "text-gray-600", bg: "bg-gray-50" },
  { id: "net",  label: "Netbanking", sub: "All major Indian banks", icon: Banknote, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "cod",  label: "Cash on Delivery", sub: "Pay when you receive", icon: Banknote, color: "text-orange-600", bg: "bg-orange-50" },
]

const ADDRESSES = [
  { id: "home", label: "Home", address: "Plot 14, Sector 62, Noida", pin: "201309", icon: Home },
  { id: "work", label: "Work", address: "Cyber City, Gurugram", pin: "122002", icon: Building2 },
]

function CheckoutContent() {
  const router = useRouter()
  const params = useSearchParams()

  const type      = params.get('type')   ?? 'adoption'
  const isAdoption = type === 'adoption'
  const isOrder    = type === 'order'
  
  const petName    = params.get('name')   ?? 'Pet'
  const petBreed   = params.get('breed')  ?? ''
  const feeStr     = params.get('fee')    ?? '2500'
  const petImage   = params.get('image')  ?? ''
  const shelter    = params.get('shelter') ?? 'PawAlert Shelter'
  const petId      = params.get('petId')  ?? 'pet-1'
  const fee        = parseInt(feeStr.replace(/[^\d]/g, '')) || 2500

  const [selectedAddress, setSelectedAddress] = React.useState("home")
  const [deliveryMode, setDeliveryMode] = React.useState<"home" | "pickup">("home")
  const [payment, setPayment] = React.useState("upi")
  const [placing, setPlacing] = React.useState(false)

  // Countdown timer for 10 min delivery
  const [timeLeft, setTimeLeft] = React.useState(600) // 10 minutes in seconds

  React.useEffect(() => {
    if (!isOrder) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [isOrder])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const convenienceFee = 99
  const total = fee + (deliveryMode === 'home' || isOrder ? convenienceFee : 0)

  const handlePay = async () => {
    setPlacing(true)
    await new Promise(r => setTimeout(r, 1500))
    
    const queryParams = new URLSearchParams({
      petId, name: petName, image: petImage, breed: petBreed,
      fee: String(total), payment, type
    })

    if (payment === 'cod') {
      const txnId = 'PAW' + Math.random().toString(36).substring(2, 10).toUpperCase()
      queryParams.set('txn', txnId)
      router.push(`/track/${txnId}?${queryParams.toString()}`)
    } else {
      router.push(`/payment?${queryParams.toString()}`)
    }
  }

  const filteredPayments = PAYMENT_OPTIONS.filter(opt => isOrder || opt.id !== 'cod')

  return (
    <div className="flex flex-col min-h-screen bg-orange-50/30 font-sans">
      <TopBar />

      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 active:scale-90 transition-transform">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-black text-lg text-[#1A1A1A] leading-none">Checkout</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isAdoption ? 'Adoption Application' : 'Order Review'}</p>
        </div>
      </div>

      <main className="flex-1 p-4 space-y-5 pb-40 max-w-xl mx-auto w-full">
        {isOrder && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-orange-600 to-red-500 rounded-[2rem] p-6 text-white shadow-xl shadow-orange-600/20 relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 opacity-10">
              <Zap size={120} />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-yellow-300 animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-xl italic tracking-tighter">10 Minute Delivery</h3>
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">High-Speed Express Shipping</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black opacity-60 uppercase">Arriving In</p>
                <div className="flex items-center gap-1 font-mono text-2xl font-black">
                  <Timer className="w-5 h-5 text-yellow-300" />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] border border-orange-100 overflow-hidden shadow-sm">
          <div className="flex gap-5 p-6 items-center">
            <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shrink-0 shadow-md">
              {petImage ? (
                <img src={petImage} alt={petName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-orange-50 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-orange-300" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-2xl text-[#1A1A1A] tracking-tighter">{petName}</h3>
                {isAdoption && (
                  <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-lg">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">{petBreed}</p>
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{isAdoption ? shelter : 'PawStore Premium'}</p>
            </div>
          </div>
          <div className="border-t border-orange-50 px-6 py-4 flex justify-between items-center bg-orange-50/50">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {isAdoption ? 'Processing & Health Check Fee' : 'Fast-Track Service Included'}
              </p>
              <p className="text-xs font-bold text-gray-500">
                {isAdoption ? 'Includes vaccination records + vet certificate' : 'Real-time tracking + 10 min promise'}
              </p>
            </div>
            <p className="font-black text-xl text-orange-600">₹{fee.toLocaleString()}</p>
          </div>
        </motion.div>

        {isAdoption && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Mode</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'home', label: 'Home Visit', sub: '+₹99 fee', icon: Home },
                { id: 'pickup', label: 'Self Pick-up', sub: 'Visit shelter', icon: Building2 }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setDeliveryMode(mode.id as 'home' | 'pickup')}
                  className={cn(
                    "p-4 rounded-[1.5rem] border-2 text-left transition-all space-y-1",
                    deliveryMode === mode.id 
                      ? "border-orange-500 bg-orange-50" 
                      : "border-gray-100 bg-white hover:border-orange-200"
                  )}
                >
                  <mode.icon className={cn("w-5 h-5 mb-2", deliveryMode === mode.id ? "text-orange-600" : "text-gray-400")} />
                  <p className={cn("font-black text-sm", deliveryMode === mode.id ? "text-orange-600" : "text-[#1A1A1A]")}>{mode.label}</p>
                  <p className="text-[10px] font-bold text-gray-400">{mode.sub}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {(deliveryMode === 'home' || isOrder) && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" /> Delivery Address
            </h2>
            <div className="space-y-3">
              {ADDRESSES.map(addr => (
                <button
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-[1.5rem] border-2 text-left transition-all",
                    selectedAddress === addr.id 
                      ? "border-orange-500 bg-orange-50" 
                      : "border-gray-100 bg-white hover:border-orange-200"
                  )}
                >
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", selectedAddress === addr.id ? "bg-orange-100" : "bg-gray-50")}>
                    <addr.icon className={cn("w-5 h-5", selectedAddress === addr.id ? "text-orange-600" : "text-gray-400")} />
                  </div>
                  <div className="flex-1">
                    <p className={cn("font-black text-sm", selectedAddress === addr.id ? "text-orange-600" : "text-[#1A1A1A]")}>{addr.label}</p>
                    <p className="text-xs font-bold text-gray-400">{addr.address}</p>
                    <p className="text-[10px] text-gray-300 font-bold uppercase">PIN {addr.pin}</p>
                  </div>
                  {selectedAddress === addr.id && (
                    <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-4">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Method</h2>
          <div className="space-y-3">
            {filteredPayments.map(opt => (
              <button
                key={opt.id}
                onClick={() => setPayment(opt.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-[1.5rem] border-2 text-left transition-all",
                  payment === opt.id 
                    ? "border-orange-500 bg-orange-50" 
                    : "border-gray-100 bg-white hover:border-orange-200"
                )}
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", payment === opt.id ? "bg-orange-100" : opt.bg)}>
                  <opt.icon className={cn("w-5 h-5", payment === opt.id ? "text-orange-600" : opt.color)} />
                </div>
                <div className="flex-1">
                  <p className={cn("font-black text-sm", payment === opt.id ? "text-orange-600" : "text-[#1A1A1A]")}>{opt.label}</p>
                  <p className="text-[10px] font-bold text-gray-400">{opt.sub}</p>
                </div>
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", payment === opt.id ? "border-orange-600" : "border-gray-200")}>
                  {payment === opt.id && <div className="w-2.5 h-2.5 bg-orange-600 rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-4">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bill Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-bold text-gray-500">{isAdoption ? 'Adoption Fee' : 'Item Total'}</span>
              <span className="font-black text-[#1A1A1A]">₹{fee.toLocaleString()}</span>
            </div>
            {(deliveryMode === 'home' || isOrder) && (
              <div className="flex justify-between">
                <span className="font-bold text-gray-500">Delivery Fee</span>
                <span className="font-black text-[#1A1A1A]">₹{convenienceFee}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-bold text-gray-500">PawAlert Guarantee</span>
              <span className="font-black text-emerald-600">FREE</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between text-base">
              <span className="font-black text-[#1A1A1A]">Total Payable</span>
              <span className="font-black text-orange-600 text-xl">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 z-40">
        <div className="max-w-xl mx-auto">
          <Button
            onClick={handlePay}
            disabled={placing}
            className="w-full h-16 rounded-[2rem] bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-black text-lg shadow-2xl shadow-orange-600/30 active:scale-95 transition-transform"
          >
            {placing ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {payment === 'cod' ? 'Placing Order...' : 'Redirecting...'}</>
            ) : (
              <>
                {payment === 'cod' ? `PLACE ORDER ₹${total.toLocaleString()}` : `PROCEED TO PAY ₹${total.toLocaleString()}`}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
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
      <CheckoutContent />
    </React.Suspense>
  )
}
