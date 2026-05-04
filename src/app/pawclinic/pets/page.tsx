"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Plus, Heart, Ruler, Weight, Calendar, ShieldCheck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const MY_PETS = [
  {
    id: 1,
    name: "Bruno",
    breed: "Golden Retriever",
    age: "2.5 Yrs",
    weight: "28 kg",
    status: "Healthy",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Luna",
    breed: "Persian Cat",
    age: "1.2 Yrs",
    weight: "4.5 kg",
    status: "Vaccine Due",
    statusColor: "bg-amber-50 text-amber-700 border-amber-100",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&h=400&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Charlie",
    breed: "Beagle",
    age: "8 Mos",
    weight: "12 kg",
    status: "Healthy",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=400&h=400&auto=format&fit=crop"
  }
]

export default function MyPetsPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans pb-10">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-6 h-6 text-emerald-600" />
          </button>
          <h1 className="text-xl font-black tracking-tight text-[#1A1A1A]">My Pets</h1>
        </div>
        <Button variant="ghost" className="text-emerald-600 font-black">Edit</Button>
      </div>

      <main className="p-4 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {MY_PETS.map((pet, i) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none bg-white rounded-[32px] shadow-sm hover:shadow-md transition-all overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex p-5 gap-5">
                    {/* Pet Image */}
                    <div className="relative shrink-0">
                      <div className="w-28 h-32 rounded-[24px] overflow-hidden shadow-inner">
                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-sm border border-gray-50">
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      </div>
                    </div>

                    {/* Pet Info */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-black text-[#1A1A1A]">{pet.name}</h2>
                          <Badge variant="outline" className={cn("rounded-full border px-2 py-0 font-bold text-[10px]", pet.statusColor)}>
                            {pet.status === "Healthy" ? <ShieldCheck className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                            {pet.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-bold text-gray-400">{pet.breed}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-0.5">Age</p>
                            <p className="text-xs font-black text-[#1A1A1A]">{pet.age}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                            <Weight className="w-4 h-4 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-0.5">Weight</p>
                            <p className="text-xs font-black text-[#1A1A1A]">{pet.weight}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Add New Pet Card - Interactive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: MY_PETS.length * 0.1 }}
          >
            <button 
              onClick={() => {}} // Handle add pet logic
              className="w-full h-32 rounded-[32px] border-4 border-dashed border-gray-100 bg-white flex flex-col items-center justify-center gap-2 transition-all hover:border-emerald-600/30 hover:bg-emerald-50 hover:shadow-sm group active:scale-[0.98] cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-emerald-600 transition-all duration-300">
                <Plus className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-black text-gray-300 group-hover:text-emerald-600 transition-colors uppercase tracking-widest">Add New Pet</span>
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
