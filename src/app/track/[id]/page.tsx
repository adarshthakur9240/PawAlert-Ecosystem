"use client"

import * as React from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { TopBar } from "@/components/layout/TopBar"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { usePetStore } from "@/state/petState"
import { 
  ChevronLeft, CheckCircle2, Loader2, 
  Phone, MessageCircle, Heart, MapPin, Zap, 
  ShieldCheck, PartyPopper, Clock, ArrowRight, Package, Truck, ShoppingBag
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────
type TrackStatus = 'approved' | 'checkup' | 'transit' | 'delivered'

// ─── Inline Map (avoids dynamic import module-resolution issues) ─────────────
function TrackingMapInner({ petName, status, isOrder }: { petName: string; status: string; isOrder: boolean }) {
  const [isMounted, setIsMounted] = React.useState(false)
  const mapRef = React.useRef<HTMLDivElement>(null)
  const leafletMap = React.useRef<any>(null)
  const petMarker = React.useRef<any>(null)
  const [waypointIdx, setWaypointIdx] = React.useState(0)

  const HOME: [number, number] = [12.9716, 77.5946]
  const WAYPOINTS: [number, number][] = [
    [12.9350, 77.6101], [12.9450, 77.6050], [12.9550, 77.6000],
    [12.9616, 77.5970], [12.9680, 77.5955], HOME,
  ]

  React.useEffect(() => { setIsMounted(true) }, [])

  React.useEffect(() => {
    if (!isMounted || !mapRef.current) return
    if (leafletMap.current) return // already initialised

    import('leaflet').then(L => {
      import('leaflet/dist/leaflet.css' as any)
      const Lm = L.default ?? L

      delete (Lm.Icon.Default.prototype as any)._getIconUrl
      Lm.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const startPos = WAYPOINTS[0]
      const map = Lm.map(mapRef.current!, { zoomControl: false, scrollWheelZoom: false })
        .setView(startPos, 13)
      leafletMap.current = map

      Lm.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map)

      const emoji = isOrder ? '🚴' : (petName.toLowerCase().includes('cat') ? '🐱' : '🐶')
      const markerColor = isOrder ? '#f97316' : '#ea580c'
      
      const petIconHtml = `<div style="width:48px;height:48px;background:${markerColor};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 16px rgba(234,88,12,0.4);display:flex;align-items:center;justify-content:center;position:relative;"><span style="transform:rotate(45deg);font-size:24px;position:absolute">${emoji}</span></div>`
      const homeIconHtml = `<div style="width:44px;height:44px;background:#22c55e;border-radius:50%;border:3px solid white;box-shadow:0 4px 16px rgba(34,197,94,0.4);display:flex;align-items:center;justify-content:center;font-size:20px;">🏠</div>`

      const petDivIcon = Lm.divIcon({ className:'', html: petIconHtml, iconSize:[48,48], iconAnchor:[24,48] })
      const homeDivIcon = Lm.divIcon({ className:'', html: homeIconHtml, iconSize:[44,44], iconAnchor:[22,22] })

      petMarker.current = Lm.marker(startPos, { icon: petDivIcon }).addTo(map)
        .bindPopup(isOrder ? `📦 ${petName} · On the way!` : `${emoji} ${petName} · On the way!`)
      Lm.marker(HOME, { icon: homeDivIcon }).addTo(map)
        .bindPopup('🏠 Your Home · Destination')
    })
  }, [isMounted]) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (status !== 'transit' && status !== 'delivered') return
    const interval = setInterval(() => {
      setWaypointIdx(prev => {
        if (prev >= WAYPOINTS.length - 1) { clearInterval(interval); return prev }
        const next = prev + 1
        if (petMarker.current && leafletMap.current) {
          petMarker.current.setLatLng(WAYPOINTS[next])
          leafletMap.current.panTo(WAYPOINTS[next], { animate: true, duration: 1 })
        }
        return next
      })
    }, 1800)
    return () => clearInterval(interval)
  }, [status]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isMounted) return (
    <div className="h-full bg-gray-100 flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
    </div>
  )
  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
}

interface TrackStep {
  id: TrackStatus
  label: string
  sub: string
  icon: React.ElementType
  color: string
  bg: string
}

const ADOPTION_STEPS: TrackStep[] = [
  { id: 'approved',  label: 'Application Approved',    sub: 'Background check passed',      icon: ShieldCheck,    color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 'checkup',   label: 'Medical Checkup',         sub: 'Vet examining & vaccinating',  icon: Heart,          color: 'text-orange-600',  bg: 'bg-orange-100'  },
  { id: 'transit',   label: 'On The Way',              sub: 'Foster on the way to you',     icon: Zap,            color: 'text-blue-600',    bg: 'bg-blue-100'    },
  { id: 'delivered', label: 'Delivered! Welcome Home', sub: 'Your pet has arrived!',        icon: PartyPopper,    color: 'text-purple-600',  bg: 'bg-purple-100'  },
]

const ORDER_STEPS: TrackStep[] = [
  { id: 'approved',  label: 'Order Confirmed',    sub: 'Stock verified & reserved', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 'checkup',   label: 'Packing Items',      sub: 'Items being sanitized & packed', icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 'transit',   label: 'Out for Delivery',   sub: 'Partner arriving in ~10 mins', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'delivered', label: 'Order Delivered',    sub: 'Enjoy your products!', icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-100' },
]

const STATUS_ORDER: TrackStatus[] = ['approved', 'checkup', 'transit', 'delivered']

function ProgressBar({ current, isOrder }: { current: TrackStatus; isOrder: boolean }) {
  const currentIdx = STATUS_ORDER.indexOf(current)
  const steps = isOrder ? ORDER_STEPS : ADOPTION_STEPS
  
  return (
    <div className="space-y-0">
      {steps.map((step, idx) => {
        const isDone = idx < currentIdx
        const isActive = idx === currentIdx
        const isPending = idx > currentIdx
        return (
          <div key={step.id} className="flex gap-4 relative">
            {idx < steps.length - 1 && (
              <div className="absolute left-[23px] top-12 bottom-0 w-0.5 z-0" style={{ background: isDone ? '#22c55e' : '#e5e7eb' }} />
            )}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: isActive ? Infinity : 0, duration: 2 }}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 relative z-10 shadow-sm",
                isDone ? "bg-emerald-600 border-emerald-600 text-white" :
                isActive ? cn(step.bg, "border-current", step.color) :
                "bg-gray-50 border-gray-100 text-gray-300"
              )}
            >
              {isDone ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
            </motion.div>

            <div className="flex-1 pb-8 pt-2.5">
              <p className={cn("font-black text-sm leading-tight", isPending ? "text-gray-300" : "text-[#1A1A1A]")}>{step.label}</p>
              <p className={cn("text-[10px] font-bold uppercase tracking-widest mt-0.5", isPending ? "text-gray-200" : "text-gray-400")}>{step.sub}</p>
              {isActive && (
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="mt-2">
                  <span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full", step.bg, step.color)}>
                    IN PROGRESS
                  </span>
                </motion.div>
              )}
              {isDone && (
                <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 mt-2 inline-block">
                  DONE ✓
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TrackingContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { id: trackingId } = useParams<{ id: string }>()
  const { addPet, addOrder } = usePetStore()

  const petName    = params.get('name')  ?? 'Your Pet'
  const petImage   = params.get('image') ?? ''
  const petBreed   = params.get('breed') ?? 'Mixed Breed'
  const petId      = params.get('petId') ?? 'pet-1'
  const type       = params.get('type')  ?? 'adoption'
  const isAdoption = type === 'adoption'
  const isOrder    = type === 'order'

  const [status, setStatus] = React.useState<TrackStatus>('approved')
  const [autoAddDone, setAutoAddDone] = React.useState(false)
  const [eta, setEta] = React.useState(isOrder ? 10 : 45)

  React.useEffect(() => {
    const timers = [
      setTimeout(() => { setStatus('checkup'); setEta(isOrder ? 8 : 30) }, 4000),
      setTimeout(() => { setStatus('transit');  setEta(isOrder ? 5 : 15) }, 9000),
      setTimeout(() => { setStatus('delivered'); setEta(0) }, 14000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [isOrder])

  React.useEffect(() => {
    if (status === 'delivered' && !autoAddDone) {
      setAutoAddDone(true)
      if (isAdoption) {
        addPet({
          name: petName,
          type: 'Dog',
          breed: petBreed,
          dob: '2023-01-01',
          gender: 'Male',
          weight: 'Unknown',
          photoUrl: petImage || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400',
          timeline: [
            { type: 'Checkup', title: 'Adoption Medical Checkup', date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), status: 'Completed' },
            { type: 'Vaccination', title: 'First Vaccination Due', date: 'Schedule with PawClinic', status: 'Upcoming' }
          ]
        })
      } else if (isOrder) {
        addOrder({
          items: petName,
          total: parseInt(params.get('fee') ?? '0'),
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          status: 'Delivered',
          image: petImage
        })
      }
    }
  }, [status, autoAddDone, isAdoption, isOrder, petName, petBreed, petImage, addPet, addOrder, params])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <TopBar />

      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.push('/home')} className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 active:scale-90 transition-transform">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-lg text-[#1A1A1A] leading-none">Live Tracking</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">#{trackingId?.slice(0, 8).toUpperCase()}</p>
        </div>
        {status !== 'delivered' && (
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-2xl">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-black text-orange-600">~{eta} min</span>
          </div>
        )}
      </div>

      <main className="flex-1 p-4 space-y-5 pb-24 max-w-xl mx-auto w-full">
        <AnimatePresence>
          {status === 'delivered' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-purple-500 to-orange-500 rounded-[2.5rem] p-8 text-white text-center space-y-4 shadow-2xl shadow-purple-500/20 overflow-hidden relative">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <span className="text-6xl">{isOrder ? '🎁' : '🐾'}</span>
              </motion.div>
              <div className="space-y-2 relative z-10">
                <h2 className="text-3xl font-black italic tracking-tighter">{isOrder ? 'Order Delivered!' : `${petName} is Home!`}</h2>
                <p className="text-sm font-semibold opacity-80">
                  {isOrder ? 'Your products are here! Check recent orders.' : 'Added to Your My Pets dashboard automatically 🎉'}
                </p>
              </div>
              <button
                onClick={() => router.push(isOrder ? '/profile' : '/profile/pets')}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 mx-auto font-black text-sm"
              >
                {isOrder ? 'View Orders' : 'View My Pets'} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 flex items-center gap-5 shadow-sm">
          <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shrink-0 shadow-md">
            {petImage ? (
              <img src={petImage} alt={petName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-orange-50 flex items-center justify-center">
                {isOrder ? <Package className="w-8 h-8 text-orange-300" /> : <Heart className="w-8 h-8 text-orange-300" />}
              </div>
            )}
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-black text-2xl text-[#1A1A1A] tracking-tighter">{petName}</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">{isOrder ? 'PawStore Delivery' : petBreed}</p>
            <div className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest",
              status === 'delivered' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
            )}>
              <motion.div animate={{ opacity: status === 'delivered' ? 1 : [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }} className={cn("w-1.5 h-1.5 rounded-full", status === 'delivered' ? "bg-emerald-500" : "bg-orange-500")} />
              {status === 'delivered' ? 'Delivered' : 'In Progress'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden" style={{ height: '280px', isolation: 'isolate', zIndex: 0 }}>
          <TrackingMapInner petName={petName} status={status} isOrder={isOrder} />
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <h2 className="font-black text-base text-[#1A1A1A] mb-6 flex items-center gap-2">
            {isOrder ? <Truck className="w-5 h-5 text-orange-600" /> : <Zap className="w-5 h-5 text-orange-600" />} 
            {isOrder ? 'Delivery Journey' : 'Adoption Journey'}
          </h2>
          <ProgressBar current={status} isOrder={isOrder} />
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-4">
          <h2 className="font-black text-base text-[#1A1A1A]">{isOrder ? 'Contact Partner' : 'Contact Specialist'}</h2>
          <div className="grid grid-cols-2 gap-3">
            <a href="tel:+919876543210" className="flex flex-col items-center gap-2 p-5 bg-emerald-50 rounded-[1.5rem] border border-emerald-100 active:scale-95 transition-transform">
              <Phone className="w-6 h-6 text-emerald-600" />
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Call {isOrder ? 'Partner' : 'Foster'}</span>
            </a>
            <a href="sms:+919876543210" className="flex flex-col items-center gap-2 p-5 bg-blue-50 rounded-[1.5rem] border border-blue-100 active:scale-95 transition-transform">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Chat Now</span>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-3">
          <h2 className="font-black text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-600" /> Delivering To
          </h2>
          <div className="space-y-0.5">
            <p className="font-black text-[#1A1A1A]">Home — Sector 62, Noida</p>
            <p className="text-sm font-bold text-gray-400">Uttar Pradesh 201309 · India</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function TrackingPage() {
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
      <TrackingContent />
    </React.Suspense>
  )
}
