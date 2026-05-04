"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TopBar } from "@/components/layout/TopBar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Scissors, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  Home, 
  Store,
  Clock,
  ArrowRight,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const packages = [
  {
    id: 1,
    name: "Full Spa Day",
    description: "Bath, Haircut, Nail Trim, Ear Cleaning, Styling",
    time: "120 mins",
    price: "₹1,499",
    priceInt: 1499,
    tag: "MOST POPULAR",
  },
  {
    id: 2,
    name: "Basic Bath & Brush",
    description: "Shampoo, Conditioning, Blow Dry, Brushing",
    time: "60 mins",
    price: "₹799",
    priceInt: 799,
  },
]

const addons = [
  { name: "Tick Treatment", price: "₹299", priceInt: 299 },
  { name: "De-shedding", price: "₹399", priceInt: 399 },
  { name: "Teeth Cleaning", price: "₹199", priceInt: 199 },
  { name: "Paw Massage", price: "₹149", priceInt: 149 }
]

export default function PawGroomPage() {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = React.useState<number | null>(null)
  const [selectedAddons, setSelectedAddons] = React.useState<string[]>([])
  const [serviceMode, setServiceMode] = React.useState<'salon' | 'home'>('salon')

  const basePrice = packages.find(p => p.id === selectedPackage)?.priceInt || 0
  const addonsPrice = addons.filter(a => selectedAddons.includes(a.name)).reduce((sum, a) => sum + a.priceInt, 0)
  const conveyanceFee = serviceMode === 'home' ? 99 : 0
  const totalPrice = basePrice + addonsPrice + conveyanceFee

  const toggleAddon = (name: string) => {
    setSelectedAddons(prev => 
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    )
  }

  const handleProceed = () => {
    if (!selectedPackage) return
    const pkg = packages.find(p => p.id === selectedPackage)
    const details = `${pkg?.name}${selectedAddons.length > 0 ? ' + ' + selectedAddons.join(', ') : ''} (${serviceMode === 'home' ? 'Home Service' : 'Salon Visit'})`
    
    const params = new URLSearchParams({
      service: 'Grooming',
      docName: 'Grooming Specialist',
      specialty: details,
      fee: totalPrice.toString(),
      visitType: serviceMode === 'home' ? 'Home Visit' : 'Clinic Visit'
    })
    
    router.push(`/pawclinic/book?${params.toString()}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans pb-32">
      <TopBar />
      
      <main className="flex-1 p-4 space-y-8">
        {/* Hero Section */}
        <div className="bg-pink-50 border border-pink-100 rounded-[32px] p-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Scissors className="w-24 h-24 rotate-12" />
          </div>
          <div className="space-y-1 relative z-10">
            <h2 className="font-black text-2xl text-pink-900 leading-tight">Premium Pet<br/>Grooming</h2>
            <p className="text-xs text-pink-700 font-bold uppercase tracking-widest">Spa, Style & Wellness</p>
          </div>
          <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-pink-500/20 relative z-10">
            <Scissors className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Service Mode Toggle */}
        <div className="space-y-4">
          <h3 className="font-black text-lg text-[#1A1A1A] px-1">Select Service Mode</h3>
          <div className="flex bg-white p-1.5 rounded-[24px] shadow-sm border border-gray-100 relative">
            <motion.div 
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-pink-500 rounded-[18px] shadow-lg shadow-pink-500/20"
              animate={{ x: serviceMode === 'salon' ? 0 : '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button 
              onClick={() => setServiceMode('salon')}
              className={cn(
                "flex-1 py-3 flex items-center justify-center gap-2 text-sm font-black relative z-10 transition-colors",
                serviceMode === 'salon' ? "text-white" : "text-gray-400"
              )}
            >
              <Store className="w-4 h-4" /> Salon Visit
            </button>
            <button 
              onClick={() => setServiceMode('home')}
              className={cn(
                "flex-1 py-3 flex items-center justify-center gap-2 text-sm font-black relative z-10 transition-colors",
                serviceMode === 'home' ? "text-white" : "text-gray-400"
              )}
            >
              <Home className="w-4 h-4" /> Home Service
            </button>
          </div>
        </div>

        {/* Packages */}
        <div className="space-y-4">
          <h3 className="font-black text-lg text-[#1A1A1A] px-1">Grooming Packages</h3>
          <div className="space-y-4">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPackage(pkg.id)}
                className="cursor-pointer"
              >
                <Card className={cn(
                  "border-2 rounded-[32px] overflow-hidden transition-all duration-300",
                  selectedPackage === pkg.id 
                    ? "border-pink-500 bg-pink-50/50 shadow-xl shadow-pink-500/10" 
                    : "border-transparent bg-white shadow-sm"
                )}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-black text-lg text-[#1A1A1A]">{pkg.name}</h4>
                        <p className="text-xs font-bold text-gray-500 leading-relaxed">{pkg.description}</p>
                      </div>
                      {selectedPackage === pkg.id && (
                        <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5 text-pink-600"><Clock className="w-3.5 h-3.5" /> {pkg.time}</span>
                      {pkg.tag && <Badge className="bg-pink-100 text-pink-700 border-none rounded-full">{pkg.tag}</Badge>}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="font-black text-2xl text-[#1A1A1A]">{pkg.price}</span>
                      <Button className={cn(
                        "rounded-2xl font-black h-11 px-6 transition-all",
                        selectedPackage === pkg.id 
                          ? "bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-600/20" 
                          : "bg-gray-100 text-gray-500 hover:bg-pink-50 hover:text-pink-600"
                      )}>
                        {selectedPackage === pkg.id ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        <div className="space-y-4">
          <h3 className="font-black text-lg text-[#1A1A1A] px-1">Popular Add-ons</h3>
          <div className="grid grid-cols-2 gap-4">
            {addons.map(addon => (
              <motion.div
                key={addon.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleAddon(addon.name)}
                className={cn(
                  "p-5 rounded-[28px] border-2 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all",
                  selectedAddons.includes(addon.name)
                    ? "border-pink-500 bg-pink-50/50 shadow-lg"
                    : "border-transparent bg-white shadow-sm"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center transition-colors",
                  selectedAddons.includes(addon.name) ? "bg-pink-500 text-white" : "bg-pink-50 text-pink-500"
                )}>
                  {selectedAddons.includes(addon.name) ? <Check className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div className="space-y-0.5">
                  <span className="font-black text-xs text-[#1A1A1A] block">{addon.name}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">+{addon.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky Checkout Bar */}
      <AnimatePresence>
        {selectedPackage && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-100 p-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]"
          >
            <div className="max-w-md mx-auto flex items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Price</p>
                  {serviceMode === 'home' && (
                    <Badge className="bg-emerald-50 text-emerald-700 border-none text-[8px] font-black h-4 px-1.5">HOME FEE INCL.</Badge>
                  )}
                </div>
                <p className="text-2xl font-black text-[#1A1A1A]">₹{totalPrice}</p>
              </div>
              <Button 
                onClick={handleProceed}
                className="bg-pink-600 hover:bg-pink-700 text-white rounded-2xl h-14 px-8 font-black text-lg shadow-xl shadow-pink-600/20 flex-grow group"
              >
                Proceed to Book
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
