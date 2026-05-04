"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TopBar } from "@/components/layout/TopBar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Star, 
  MapPin, 
  Bone, 
  Dog, 
  ShieldCheck, 
  Play, 
  Video, 
  Award, 
  Check, 
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Mock Trainer Data
const INITIAL_TRAINERS = [
  {
    id: 1,
    name: "Alex Mercer",
    specialty: "Obedience • Aggression",
    issues: ["Aggression", "Barking", "Leash Pulling"],
    experience: "5 yrs exp",
    rating: "4.9",
    reviews: "210",
    distance: "1.2 km",
    nextSlot: "Today, 5:00 PM",
    fee: 800,
    bundlePrice: 3500,
    verified: true,
    tags: ["Specialist", "Behavioral Expert"],
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=300&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Priya Sharma",
    specialty: "Puppy Training • Agility",
    issues: ["Puppy Basics", "Potty Training", "Anxiety"],
    experience: "3 yrs exp",
    rating: "4.7",
    reviews: "64",
    distance: "4.5 km",
    nextSlot: "Tomorrow, 8:00 AM",
    fee: 600,
    bundlePrice: 2800,
    verified: true,
    tags: ["Top Rated", "Puppy Specialist"],
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=300&auto=format&fit=crop"
  }
]

const MORE_TRAINERS = [
  {
    id: 3,
    name: "Vikram Singh",
    specialty: "Advanced Obedience • Guarding",
    issues: ["Aggression", "Leash Pulling"],
    experience: "8 yrs exp",
    rating: "4.8",
    reviews: "156",
    distance: "2.8 km",
    nextSlot: "Today, 6:30 PM",
    fee: 1000,
    bundlePrice: 4500,
    verified: true,
    tags: ["Veteran", "Security Specialist"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=300&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    specialty: "Therapy Dog • Anxiety",
    issues: ["Anxiety", "Barking"],
    experience: "6 yrs exp",
    rating: "4.9",
    reviews: "88",
    distance: "5.1 km",
    nextSlot: "Wed, 10:00 AM",
    fee: 900,
    bundlePrice: 4000,
    verified: true,
    tags: ["Compassion Award", "Therapy Specialist"],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=300&auto=format&fit=crop"
  }
]

const ISSUES = ["Barking", "Potty Training", "Leash Pulling", "Aggression", "Anxiety", "Puppy Basics"]

export default function PawCarePage() {
  const router = useRouter()
  const [selectedIssue, setSelectedIssue] = React.useState<string | null>(null)
  const [trainersList, setTrainersList] = React.useState(INITIAL_TRAINERS)
  const [isLoadingMore, setIsLoadingMore] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)
  const [isInitialLoading, setIsInitialLoading] = React.useState(true)

  // Initial Load Simulation
  React.useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Infinite Scroll Observer
  const observerRef = React.useRef<IntersectionObserver | null>(null)
  const lastElementRef = React.useCallback((node: HTMLDivElement) => {
    if (isLoadingMore) return
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreTrainers()
      }
    })
    if (node) observerRef.current.observe(node)
  }, [isLoadingMore, hasMore])

  const loadMoreTrainers = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setTrainersList(prev => [...prev, ...MORE_TRAINERS])
      setHasMore(false) // No more trainers in this mock
      setIsLoadingMore(false)
    }, 1500)
  }

  const filteredTrainers = selectedIssue 
    ? trainersList.filter(t => t.issues.includes(selectedIssue))
    : trainersList

  const handleBook = (trainer: any) => {
    const params = new URLSearchParams({
      service: 'Training',
      docName: trainer.name,
      specialty: trainer.specialty,
      fee: trainer.fee.toString(),
      reason: selectedIssue || 'General Training'
    })
    router.push(`/pawclinic/book?${params.toString()}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans pb-20">
      <TopBar />
      
      <main className="flex-1 p-4 space-y-8">
        {/* Purple Hero Header */}
        <div className="bg-purple-50 border border-purple-100 rounded-[32px] p-6 flex items-center justify-between relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Award className="w-24 h-24 rotate-12 text-purple-600" />
          </div>
          <div className="space-y-1 relative z-10">
            <h2 className="font-black text-2xl text-purple-900 leading-tight">Professional<br/>Pet Training</h2>
            <p className="text-xs text-purple-700 font-bold uppercase tracking-widest">Certified Experts Only</p>
          </div>
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-600/20 relative z-10">
            <Dog className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Purple Issue Filters */}
        <div className="space-y-4">
          <h3 className="font-black text-lg text-[#1A1A1A] px-1 flex items-center gap-2">
            <Bone className="w-5 h-5 text-purple-600" /> Browse by Issue
          </h3>
          <div className="flex flex-wrap gap-2">
            {ISSUES.map(issue => (
              <motion.button
                key={issue}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedIssue(selectedIssue === issue ? null : issue)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs font-black transition-all border-2",
                  selectedIssue === issue 
                    ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/20" 
                    : "bg-white text-gray-400 border-transparent shadow-sm hover:border-purple-100 hover:text-purple-600"
                )}
              >
                {issue}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Trainer List */}
        <div className="space-y-5">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-lg text-[#1A1A1A]">Top Trainers</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {filteredTrainers.length} {selectedIssue ? `for ${selectedIssue}` : 'available'}
            </span>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {isInitialLoading ? (
                [1, 2].map(i => (
                  <div key={i} className="bg-white rounded-[32px] h-[200px] w-full animate-pulse shadow-sm" />
                ))
              ) : (
                filteredTrainers.map((trainer, index) => (
                  <motion.div
                    key={trainer.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    ref={index === filteredTrainers.length - 1 ? lastElementRef : null}
                  >
                    <Card className="border-none shadow-xl shadow-gray-200/50 rounded-[32px] overflow-hidden group hover:shadow-2xl hover:shadow-purple-200/40 transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="p-5 flex gap-5">
                          {/* Avatar with Video Overlay */}
                          <div className="relative shrink-0">
                            <div className="w-24 h-32 bg-gray-100 rounded-2xl overflow-hidden relative">
                              <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <motion.div 
                                  whileHover={{ scale: 1.2 }}
                                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40"
                                >
                                  <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                                </motion.div>
                              </div>
                            </div>
                            <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full p-1.5 border-4 border-white shadow-lg">
                              <ShieldCheck className="w-3 h-3" />
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-black text-lg text-[#1A1A1A] leading-tight">{trainer.name}</h4>
                                <div className="flex gap-1.5 mt-1">
                                  {trainer.tags.map(tag => (
                                    <Badge key={tag} className="bg-purple-100 text-purple-600 border-none text-[8px] font-black h-4 px-1.5 rounded-full uppercase tracking-widest">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-xl text-xs font-black">
                                <Star className="w-3 h-3 fill-current" />
                                {trainer.rating}
                              </div>
                            </div>

                            <p className="text-xs font-black text-purple-600 tracking-tight">{trainer.specialty}</p>
                            
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                <Award className="w-3 h-3 text-purple-400" /> {trainer.experience} • {trainer.reviews} reviews
                              </div>
                              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                <MapPin className="w-3 h-3 text-red-400" /> {trainer.distance} away
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Purple Pricing Bundle Footer */}
                        <div className="bg-purple-50/30 p-4 px-5 border-t border-purple-50 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <p className="text-xl font-black text-[#1A1A1A]">₹{trainer.fee}</p>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">/ session</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" />
                              <p className="text-[10px] font-black text-purple-700 uppercase tracking-tighter">Value Bundle: 5 Sessions for ₹{trainer.bundlePrice}</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleBook(trainer)}
                            className="h-12 px-8 rounded-2xl font-black bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20 active:scale-95 transition-transform"
                          >
                            Book Training
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {/* Loading More / End of List */}
            <div className="py-8 flex flex-col items-center justify-center gap-3">
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading more trainers...</p>
                </>
              ) : !hasMore && (
                <div className="flex flex-col items-center gap-2 opacity-50">
                  <div className="w-12 h-1 bg-gray-200 rounded-full" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">All certified trainers loaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
