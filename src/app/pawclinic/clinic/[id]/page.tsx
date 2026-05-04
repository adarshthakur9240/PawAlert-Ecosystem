"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ChevronLeft, 
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  ShieldCheck, 
  Share2,
  Info,
  MessageCircle,
  Stethoscope
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VetDiscoveryCard } from "@/components/pawclinic/VetDiscoveryCard"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const CLINIC_IMAGES = [
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop"
]

const CLINIC_DOCTORS = [
  {
    id: 1,
    name: "Dr. Ananya Iyer",
    specialty: "Senior Surgeon",
    experience: "12 yrs exp",
    rating: "4.9",
    reviews: "245",
    distance: "Inside Clinic",
    nextSlot: "Today, 4:30 PM",
    fee: "₹800",
    verified: true,
    tags: ["Surgery", "Critical Care"],
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=256&h=300&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialty: "General Physician",
    experience: "8 yrs exp",
    rating: "4.8",
    reviews: "112",
    distance: "Inside Clinic",
    nextSlot: "Tomorrow, 10:00 AM",
    fee: "₹600",
    verified: true,
    tags: ["Vaccination", "Dental"],
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=256&h=300&auto=format&fit=crop"
  }
]

const REVIEWS = [
  { id: 1, user: "Aditi S.", rating: 5, text: "The best care my cat has ever received. The surgeons are top-notch and the facility is spotless.", date: "2 days ago" },
  { id: 2, user: "Rohan M.", rating: 4, text: "Excellent facility but waiting time can be long. Dr. Ananya is brilliant.", date: "1 week ago" },
  { id: 3, user: "Sneha P.", rating: 5, text: "Very professional staff. They handled my puppy's vaccination so gently.", date: "3 weeks ago" }
]

export default function ClinicDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

  // Auto-sliding carousel
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CLINIC_IMAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // PERFECTED SHARE HANDLER (ABORT ERROR FIXED)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Happy Paws Premium Clinic',
          text: 'Check out this clinic on PawClinic!',
          url: window.location.href
        })
      } catch (error: any) {
        // Silently ignore AbortError (happens when user closes share sheet)
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error)
        }
      }
    } else {
      // Fallback for Desktop
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy link:', err)
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header Overlay */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center pointer-events-auto active:scale-90 transition-transform"
        >
          <ChevronLeft className="w-6 h-6 text-emerald-600" />
        </button>
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center active:scale-110 transition-transform cursor-pointer"
          >
            <Share2 className="w-5 h-5 text-emerald-600" />
          </button>
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="relative h-[40vh] w-full overflow-hidden bg-gray-200">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={CLINIC_IMAGES[currentImageIndex]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
          {CLINIC_IMAGES.map((_, i) => (
            <div 
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                currentImageIndex === i ? "w-6 bg-white" : "w-1.5 bg-white/50"
              )}
            />
          ))}
        </div>
      </div>

      {/* Clinic Info Body */}
      <div className="px-4 -mt-10 relative z-10 space-y-6">
        <Card className="border-none shadow-xl bg-white rounded-[32px] overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold rounded-full px-3">
                  Open 24/7
                </Badge>
                <div className="flex items-center gap-1 font-black text-emerald-600">
                  <Star className="w-4 h-4 fill-current" />
                  4.9 (1.2k Reviews)
                </div>
              </div>
              <h1 className="text-2xl font-black text-[#1A1A1A] tracking-tight">Happy Paws Premium Clinic</h1>
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-600" />
                12, Link Road, Andheri West, Mumbai
              </p>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
              <a href="tel:+919876543210" className="transition-transform hover:scale-105 active:scale-95">
                <Button variant="outline" className="rounded-2xl border-gray-100 font-bold h-12 flex items-center gap-2 whitespace-nowrap">
                  <Phone className="w-4 h-4 text-emerald-600" /> Call Clinic
                </Button>
              </a>
              <a href="https://happy-paws.clinic" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 active:scale-95">
                <Button variant="outline" className="rounded-2xl border-gray-100 font-bold h-12 flex items-center gap-2 whitespace-nowrap">
                  <Globe className="w-4 h-4 text-blue-600" /> Website
                </Button>
              </a>
              <a href="mailto:contact@happy-paws.clinic" className="transition-transform hover:scale-105 active:scale-95">
                <Button variant="outline" className="rounded-2xl border-gray-100 font-bold h-12 flex items-center gap-2 whitespace-nowrap">
                  <MessageCircle className="w-4 h-4 text-purple-600" /> Chat
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Experience</p>
                <p className="text-sm font-black text-[#1A1A1A]">15+ Years</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verified</p>
                <p className="text-sm font-black text-[#1A1A1A] flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Licensed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <div className="space-y-4">
          <h3 className="font-black text-xl text-[#1A1A1A] flex items-center gap-2 px-1">
            <Info className="w-5 h-5 text-emerald-600" /> About Clinic
          </h3>
          <p className="text-sm font-semibold text-gray-600 leading-relaxed px-1">
            Happy Paws is a premier veterinary facility dedicated to providing compassionate, high-quality care for your beloved pets. Our state-of-the-art facility includes full diagnostic labs, surgical suites, and 24/7 emergency support. We treat every animal like family.
          </p>
          <div className="bg-white rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-500">Operating Hours</span>
              <span className="text-sm font-black text-[#1A1A1A]">Open 24 Hours</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-50 pt-3">
              <span className="text-sm font-bold text-gray-500">Species Treated</span>
              <span className="text-sm font-black text-[#1A1A1A]">Dogs, Cats, Birds</span>
            </div>
          </div>
        </div>

        {/* Doctors Present */}
        <div className="space-y-4">
          <h3 className="font-black text-xl text-[#1A1A1A] flex items-center gap-2 px-1">
            <Stethoscope className="w-5 h-5 text-emerald-600" /> Doctors Available
          </h3>
          <div className="space-y-4">
            {CLINIC_DOCTORS.map((doc) => (
              <VetDiscoveryCard key={doc.id} vet={doc} />
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-xl text-[#1A1A1A] flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" /> Patient Stories
            </h3>
            <button className="text-emerald-600 text-sm font-black">See All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {REVIEWS.map((review) => (
              <Card key={review.id} className="min-w-[260px] border-none bg-white rounded-3xl shadow-sm p-5 space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                  <p className="font-black text-sm text-[#1A1A1A]">{review.user}</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200")} />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-500 italic leading-relaxed line-clamp-3">"{review.text}"</p>
                <p className="text-[10px] font-bold text-gray-400 text-right uppercase tracking-tighter">{review.date}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Booking CTA */}
      <div className="fixed bottom-20 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 p-4 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Starts from</p>
            <p className="text-lg font-black text-[#1A1A1A]">₹600 <span className="text-xs font-bold text-gray-400">/ visit</span></p>
          </div>
          <Link href="/pawclinic/book?docName=Clinic Visit&fee=600&specialty=Happy Paws Clinic" className="flex-grow">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 font-black text-lg shadow-xl shadow-emerald-600/20 active:scale-95 transition-transform">
              Book Appointment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}