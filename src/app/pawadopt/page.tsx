"use client"

import * as React from "react"
import { TopBar } from "@/components/layout/TopBar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  MapPin, 
  Search, 
  Filter, 
  Clock, 
  Zap, 
  ArrowRight, 
  X, 
  MessageCircle, 
  Info,
  ChevronRight,
  ShieldCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { AddPetModal } from "@/components/shared/AddPetModal"
import { Pet } from "@/state/petState"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

// --- Mock Data ---
const CATEGORIES = ["All", "Dogs", "Cats", "Puppies", "Kittens", "Birds", "Rabbits"]

interface AdoptPet {
  id: string
  name: string
  breed: string
  age: string
  gender: 'Male' | 'Female'
  type: 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Other'
  distance: string
  verified: boolean
  shelter: string
  image: string
  story: string
  tags: string[]
}

const MOCK_PETS: AdoptPet[] = [
  {
    id: "1",
    name: "Luna",
    breed: "Indie Mix",
    age: "3 months",
    gender: "Female",
    type: "Dog",
    distance: "2.1 km",
    verified: true,
    shelter: "Hope Animal Shelter",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600",
    story: "Luna was found wandering near a construction site. She is incredibly playful, loves belly rubs, and is already partially potty trained. She's looking for a family that can keep up with her energy!",
    tags: ["Vaccinated", "Playful", "Kid-friendly"]
  },
  {
    id: "2",
    name: "Max",
    breed: "Labrador Retriever",
    age: "1.5 years",
    gender: "Male",
    type: "Dog",
    distance: "5.4 km",
    verified: true,
    shelter: "Paws Rescue NGO",
    image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=600",
    story: "Max is a gentle soul who loves long walks and car rides. He was surrendered by his previous owners due to relocation. He is well-behaved, knows basic commands, and is great with other dogs.",
    tags: ["Trained", "Calm", "Neutered"]
  },
  {
    id: "3",
    name: "Simba",
    breed: "Persian Cat",
    age: "6 months",
    gender: "Male",
    type: "Cat",
    distance: "0.8 km",
    verified: true,
    shelter: "Cat Haven",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600",
    story: "Simba is a majestic little fluffball who enjoys napping in sunbeams. He's a bit shy at first but once he warms up, he'll be your most loyal companion. Perfect for a quiet apartment life.",
    tags: ["Indoor", "Litter-trained", "Healthy"]
  },
  {
    id: "4",
    name: "Misty",
    breed: "British Shorthair",
    age: "2 years",
    gender: "Female",
    type: "Cat",
    distance: "3.2 km",
    verified: false,
    shelter: "Community Rescue",
    image: "https://images.unsplash.com/photo-1513245533418-29753dc57440?q=80&w=600",
    story: "Misty is a very independent cat who loves her space but will occasionally demand attention with soft meows. She's looking for a forever home where she can be the queen of the house.",
    tags: ["Quiet", "Elegant", "Healthy"]
  },
  {
    id: "5",
    name: "Rocky",
    breed: "German Shepherd Mix",
    age: "4 years",
    gender: "Male",
    type: "Dog",
    distance: "7.1 km",
    verified: true,
    shelter: "Urban Paws",
    image: "https://images.unsplash.com/photo-1589944172352-83b3b1233c49?q=80&w=600",
    story: "Rocky is a loyal protector who needs an active owner. He loves hiking and fetching frisbees. He's very intelligent and learns new tricks in minutes!",
    tags: ["Active", "Guard Dog", "Intelligent"]
  },
  {
    id: "6",
    name: "Bella",
    breed: "Beagle",
    age: "1 year",
    gender: "Female",
    type: "Dog",
    distance: "1.5 km",
    verified: true,
    shelter: "Beagle Rescue",
    image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=600",
    story: "Bella is a curious sniffer who loves exploring. She's great with children and always has a wagging tail. She needs a fenced yard as she tends to follow her nose!",
    tags: ["Friendly", "High Energy", "Healthy"]
  }
]

// --- Components ---

function PetSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded-full w-2/3" />
        <div className="h-4 bg-gray-100 rounded-full w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 bg-gray-50 rounded-full w-16" />
          <div className="h-5 bg-gray-50 rounded-full w-16" />
        </div>
      </div>
    </div>
  )
}

export default function PawAdoptPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [selectedPet, setSelectedPet] = React.useState<AdoptPet | null>(null)
  const [isAdoptModalOpen, setIsAdoptModalOpen] = React.useState(false)
  const [isAddPetModalOpen, setIsAddPetModalOpen] = React.useState(false)
  const [visiblePets, setVisiblePets] = React.useState<AdoptPet[]>(MOCK_PETS)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)

  // Infinite Scroll Logic
  const handleScroll = React.useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading && hasMore) {
      setIsLoading(true)
      // Simulate loading more
      setTimeout(() => {
        setVisiblePets(prev => [...prev, ...MOCK_PETS.map(p => ({ ...p, id: Math.random().toString() }))])
        setIsLoading(false)
        // Stop after 3 loads for demo
        if (visiblePets.length > 18) setHasMore(false)
      }, 1500)
    }
  }, [isLoading, hasMore, visiblePets.length])

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const filteredPets = visiblePets.filter(p => selectedCategory === "All" || p.type === selectedCategory.slice(0, -1) || p.type === selectedCategory)

  const handleAdopt = async () => {
    if (!selectedPet) return
    setIsProcessing(true)
    // Brief processing delay for UX polish
    await new Promise(r => setTimeout(r, 1200))
    const params = new URLSearchParams({
      type: 'adoption',
      petId: selectedPet.id,
      name: selectedPet.name,
      breed: selectedPet.breed,
      fee: '2500',
      image: selectedPet.image,
      shelter: selectedPet.shelter,
    })
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <TopBar />

      {/* Sticky Category Bar */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
              selectedCategory === cat 
                ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20" 
                : "bg-white border-gray-100 text-gray-400 hover:border-orange-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <main className="flex-1 p-4 space-y-6 pb-24">
        {/* Quick Filters */}
        <div className="flex gap-3 px-1">
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-2xl border border-orange-100 text-orange-600 active:scale-95 transition-transform">
            <MapPin className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Near Me</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-2xl border border-orange-100 text-orange-600 active:scale-95 transition-transform">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Recent</span>
          </button>
        </div>

        {/* Hero Card */}
        <div className="relative rounded-[2.5rem] overflow-hidden h-44 bg-gradient-to-br from-orange-500 to-red-500 text-white p-8 flex items-center shadow-xl shadow-orange-500/20">
          <div className="space-y-1 relative z-10">
            <h2 className="text-3xl font-black tracking-tight leading-none italic">
              Find Your<br/>Soulmate
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
              Verified Adoptions • Free forever
            </p>
          </div>
          <Heart className="absolute -right-6 -bottom-6 w-48 h-48 opacity-10 rotate-12" />
        </div>

        {/* High Density Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredPets.length > 0 ? (
            filteredPets.map((pet, idx) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx % 6 * 0.05 }}
              >
                <Card 
                  onClick={() => { setSelectedPet(pet); setIsAdoptModalOpen(true) }}
                  className="border-gray-100 rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <div className="h-48 relative overflow-hidden bg-gray-100">
                    <img 
                      src={pet.image} 
                      alt={pet.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {pet.verified && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md rounded-lg px-2 py-1 shadow-sm flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-orange-600" />
                        <span className="text-[8px] font-black text-orange-600 uppercase tracking-widest">Verified</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-black/30 backdrop-blur-md rounded-full w-8 h-8 flex items-center justify-center text-white">
                      <Heart className="w-4 h-4" />
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-0.5">
                      <h4 className="font-black text-lg text-[#1A1A1A] leading-none">{pet.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{pet.breed}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-none text-[9px] font-black uppercase px-2 h-5">
                        {pet.age}
                      </Badge>
                      <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-none text-[9px] font-black uppercase px-2 h-5">
                        {pet.distance}
                      </Badge>
                    </div>

                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black text-[10px] uppercase tracking-widest h-9 rounded-xl shadow-lg shadow-orange-600/10"
                    >
                      MEET {pet.name.toUpperCase()}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : !isLoading && (
            <div className="col-span-full py-20 text-center space-y-6">
              <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Heart className="w-16 h-16 text-orange-200" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-2xl text-gray-400">Out of Stock!</h3>
                <p className="text-sm font-semibold text-gray-300">All buddies found a home!<br/>Check back in a bit.</p>
              </div>
            </div>
          )}

          {/* Skeletons while loading */}
          {isLoading && (
            <>
              <PetSkeleton />
              <PetSkeleton />
              <PetSkeleton />
              <PetSkeleton />
            </>
          )}
        </div>
      </main>

      {/* Adoption Detail Bottom Sheet */}
      <AnimatePresence>
        {isAdoptModalOpen && selectedPet && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsAdoptModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white rounded-t-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Image Header */}
              <div className="h-72 relative shrink-0">
                <img src={selectedPet.image} alt={selectedPet.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setIsAdoptModalOpen(false)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
              </div>

              {/* Content */}
              <div className="px-8 pb-8 flex-1 overflow-y-auto space-y-8 -mt-12 relative z-10">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <h2 className="text-5xl font-black tracking-tighter text-[#1A1A1A] italic">{selectedPet.name}</h2>
                    <p className="text-sm font-bold text-orange-600 uppercase tracking-widest">{selectedPet.breed}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-2xl">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Fully Verified</span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-[2rem] text-center space-y-1">
                    <Clock className="w-4 h-4 mx-auto text-gray-400" />
                    <p className="text-[10px] font-black text-gray-300 uppercase">Age</p>
                    <p className="text-sm font-black text-[#1A1A1A]">{selectedPet.age}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-[2rem] text-center space-y-1">
                    <MapPin className="w-4 h-4 mx-auto text-gray-400" />
                    <p className="text-[10px] font-black text-gray-300 uppercase">Distance</p>
                    <p className="text-sm font-black text-[#1A1A1A]">{selectedPet.distance}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-[2rem] text-center space-y-1">
                    <Heart className="w-4 h-4 mx-auto text-gray-400" />
                    <p className="text-[10px] font-black text-gray-300 uppercase">Gender</p>
                    <p className="text-sm font-black text-[#1A1A1A]">{selectedPet.gender}</p>
                  </div>
                </div>

                {/* Story */}
                <div className="space-y-3">
                  <h3 className="font-black text-lg text-[#1A1A1A] flex items-center gap-2">
                    <Info className="w-5 h-5 text-orange-600" /> My Story
                  </h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    {selectedPet.story}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedPet.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Shelter Info */}
                <div className="p-6 bg-gray-50 rounded-[2.5rem] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black">
                      {selectedPet.shelter[0]}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rescued by</p>
                      <h4 className="font-black text-[#1A1A1A]">{selectedPet.shelter}</h4>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </Button>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-8 border-t border-gray-100 flex gap-4 bg-white shrink-0">
                <Button 
                  variant="outline" 
                  className="w-14 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="w-6 h-6" />
                </Button>
                <Button 
                  onClick={handleAdopt}
                  disabled={isProcessing}
                  className="flex-1 h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-black text-base shadow-xl shadow-orange-600/20"
                >
                  {isProcessing ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                  ) : (
                    <>ADOPT {selectedPet.name.toUpperCase()} <ArrowRight className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global AI Scan Add Pet Modal */}
      <AddPetModal 
        isOpen={isAddPetModalOpen} 
        onClose={() => setIsAddPetModalOpen(false)}
        accentColor="orange"
        prefillPhotoUrl={selectedPet?.image}
        prefillData={{
          name: selectedPet?.name,
          breed: selectedPet?.breed,
          type: selectedPet?.type,
          gender: selectedPet?.gender,
        }}
      />
    </div>
  )
}
