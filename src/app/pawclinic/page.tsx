"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Star, 
  MapPin, 
  Clock, 
  Search, 
  PhoneCall, 
  Stethoscope, 
  Syringe, 
  ClipboardList, 
  Users,
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react"
import { VetDiscoveryCard } from "@/components/pawclinic/VetDiscoveryCard"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"

// Mock Data with Real Images
const INITIAL_VETS = [
  {
    id: 1,
    name: "Dr. Ananya Iyer",
    specialty: "General Physician • Surgery",
    experience: "8 yrs exp",
    rating: "4.9",
    reviews: "124",
    distance: "2.5 km",
    nextSlot: "Today, 4:30 PM",
    fee: "₹500",
    verified: true,
    tags: ["Surgery", "Emergency"],
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=256&h=300&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Dr. James Wilson",
    specialty: "Orthopedics • Vaccination",
    experience: "12 yrs exp",
    rating: "4.8",
    reviews: "89",
    distance: "3.1 km",
    nextSlot: "Tomorrow, 10:00 AM",
    fee: "₹600",
    verified: true,
    tags: ["Bone Care", "Vaccination"],
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=256&h=300&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    specialty: "Dermatology • Small Animals",
    experience: "6 yrs exp",
    rating: "4.7",
    reviews: "156",
    distance: "1.2 km",
    nextSlot: "Today, 6:00 PM",
    fee: "₹450",
    verified: true,
    tags: ["Skin Care", "Small Pets"],
    avatar: "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=256&h=300&auto=format&fit=crop"
  },
]

const MOCK_EXTRA_VETS = [
  {
    id: 4,
    name: "Dr. Michael Chen",
    specialty: "Cardiology • Senior Pets",
    experience: "15 yrs exp",
    rating: "5.0",
    reviews: "210",
    distance: "4.5 km",
    nextSlot: "Mon, 9:00 AM",
    fee: "₹800",
    verified: true,
    tags: ["Heart Care", "Senior Dogs"],
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=256&h=300&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Dr. Sarah Jenkins",
    specialty: "Nutrition • Behavioral",
    experience: "5 yrs exp",
    rating: "4.6",
    reviews: "67",
    distance: "2.8 km",
    nextSlot: "Today, 5:15 PM",
    fee: "₹400",
    verified: true,
    tags: ["Diet", "Training"],
    avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=256&h=300&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Dr. Rajesh Kumar",
    specialty: "Dental • Oral Hygiene",
    experience: "10 yrs exp",
    rating: "4.8",
    reviews: "112",
    distance: "3.9 km",
    nextSlot: "Wed, 11:00 AM",
    fee: "₹550",
    verified: true,
    tags: ["Dental", "Gum Health"],
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=256&h=300&auto=format&fit=crop"
  }
]

const QUICK_ACTIONS = [
  { icon: Stethoscope, label: "Book Visit", sub: "Clinic & Home", href: "/pawclinic/book" },
  { icon: Syringe, label: "Vaccination", sub: "Schedule Now", href: "/pawclinic/vaccination" },
  { icon: Users, label: "My Pets", sub: "View Profiles", href: "/pawclinic/pets" },
  { icon: ClipboardList, label: "Records", sub: "Digital History", href: "/pawclinic/records" },
]

const CLINICS = [
  { id: "c1", name: "Happy Paws Clinic", area: "Andheri West, Mumbai", rating: "4.9", tags: ["Open 24/7", "Diagnostic"], image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop" },
  { id: "c2", name: "City Vet Hospital", area: "Bandra East, Mumbai", rating: "4.8", tags: ["Surgery", "ICU"], image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?q=80&w=400&auto=format&fit=crop" },
]

export default function PawClinicPage() {
  const [vets, setVets] = React.useState(INITIAL_VETS)
  const [loading, setLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)
  
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  })

  const loadMoreVets = React.useCallback(() => {
    if (loading || !hasMore) return
    
    setLoading(true)
    setTimeout(() => {
      const nextBatch = MOCK_EXTRA_VETS.slice(vets.length - INITIAL_VETS.length, vets.length - INITIAL_VETS.length + 5)
      if (nextBatch.length > 0) {
        setVets(prev => [...prev, ...nextBatch])
      } else {
        setHasMore(false)
      }
      setLoading(false)
    }, 1000)
  }, [loading, hasMore, vets.length])

  React.useEffect(() => {
    if (inView) {
      loadMoreVets()
    }
  }, [inView, loadMoreVets])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Header Section */}
      <div className="bg-white px-4 pt-4 pb-2 border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-[#1A1A1A]">PawClinic</h1>
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                Mumbai, MH
              </div>
            </div>
          </div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold rounded-full px-3 py-1">
            Live Support
          </Badge>
        </div>

        {/* Search Hero */}
        <div className="relative mb-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search symptoms, clinics or vets..." 
            className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-600/20 transition-all shadow-inner"
          />
        </div>
      </div>

      <main className="flex-1 p-4 space-y-8">
        {/* Emergency Banner - Emerald Green */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-[28px] p-5 text-white shadow-[0_15px_30px_rgba(5,150,105,0.2)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertCircle className="w-24 h-24 rotate-12" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-black text-lg leading-tight">Emergency Help?</h3>
              <p className="text-xs font-semibold opacity-90 max-w-[180px]">
                One-tap connection to nearest 24/7 clinics and vets.
              </p>
            </div>
            <Button className="bg-white text-emerald-600 hover:bg-white/90 rounded-2xl h-12 px-6 font-black shadow-lg flex items-center gap-2 group">
              Call Now <PhoneCall className="w-4 h-4 group-hover:animate-pulse" />
            </Button>
          </div>
        </motion.div>

        {/* Interactive Quick Actions Grid - Medical Green Theme */}
        <div className="grid grid-cols-2 gap-4">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={action.href}>
                <Card className="border-none shadow-sm bg-white rounded-[24px] hover:shadow-md transition-all cursor-pointer group hover:scale-105 active:scale-95 duration-300 overflow-hidden">
                  <CardContent className="p-5 flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-50 transition-all group-hover:bg-emerald-100">
                      <action.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-black text-sm text-[#1A1A1A] group-hover:text-emerald-600 transition-colors">
                        {action.label}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                        {action.sub}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Highly Recommended Vets Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <div className="space-y-1">
              <h3 className="font-black text-xl text-[#1A1A1A]">Highly recommended nearby you</h3>
              <p className="text-xs font-semibold text-gray-500">Based on your current location</p>
            </div>
            <button className="text-emerald-600 text-sm font-black flex items-center gap-1 hover:opacity-80 transition-opacity">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {vets.map((vet) => (
              <VetDiscoveryCard key={vet.id} vet={vet} />
            ))}
            
            <div ref={ref} className="py-8 flex justify-center">
              {loading && (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                  <p className="text-xs font-bold text-gray-400">Loading more experts...</p>
                </div>
              )}
              {!hasMore && (
                <p className="text-xs font-bold text-gray-400">You've reached the end of the list</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Clinics */}
        <div className="space-y-6 pb-8">
          <div className="flex items-center justify-between px-1">
            <div className="space-y-1">
              <h3 className="font-black text-xl text-[#1A1A1A]">Top Clinics</h3>
              <p className="text-xs font-semibold text-gray-500">Premium care facilities</p>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {CLINICS.map((clinic) => (
              <Link key={clinic.id} href={`/pawclinic/clinic/${clinic.id}`}>
                <Card className="min-w-[280px] border-none bg-white rounded-[28px] shadow-sm hover:shadow-md transition-all overflow-hidden shrink-0 group active:scale-95 duration-300">
                  <div className="h-40 relative overflow-hidden">
                    <img 
                      src={clinic.image} 
                      alt={clinic.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black text-[#1A1A1A]">
                      <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                      {clinic.rating}
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-3">
                    <div>
                      <h4 className="font-black text-base text-[#1A1A1A] group-hover:text-emerald-600 transition-colors">{clinic.name}</h4>
                      <p className="text-xs font-semibold text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {clinic.area}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {clinic.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full px-2 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
