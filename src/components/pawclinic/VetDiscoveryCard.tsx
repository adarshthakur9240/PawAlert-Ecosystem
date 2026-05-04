"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock, CheckCircle2, ShieldCheck, Heart, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

import Link from "next/link"

interface VetDiscoveryCardProps {
  vet: {
    id: number | string
    name: string
    avatar?: string
    specialty: string
    experience: string
    rating: string
    reviews: string
    distance: string
    nextSlot: string
    fee: string
    verified: boolean
    tags?: string[]
  }
  className?: string
}

export function VetDiscoveryCard({ vet, className }: VetDiscoveryCardProps) {
  const queryParams = new URLSearchParams({
    docName: vet.name,
    fee: vet.fee.replace('₹', ''),
    specialty: vet.specialty.split('•')[0].trim()
  }).toString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "group relative overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[24px] transition-all hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)]",
        className
      )}>
        <CardContent className="p-0">
          <div className="p-5 flex gap-5 font-sans">
            {/* Avatar Section */}
            <div className="relative shrink-0">
              <div className="w-24 h-28 bg-[#F8F9FA] rounded-[20px] overflow-hidden border border-[#F1F3F5] transition-transform group-hover:scale-105 duration-500">
                {vet.avatar ? (
                  <img 
                    src={vet.avatar} 
                    alt={vet.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white to-[#F1F3F5]">
                    <div className="text-emerald-600/20 font-black text-4xl">
                      {vet.name.charAt(0)}
                    </div>
                  </div>
                )}
              </div>
              {vet.verified && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full p-1 border-[3px] border-white shadow-sm">
                  <ShieldCheck className="w-4 h-4 fill-current text-white" />
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <h4 className="font-black text-lg text-[#1A1A1A] leading-tight group-hover:text-emerald-600 transition-colors">
                    {vet.name}
                  </h4>
                  <p className="text-sm font-bold text-emerald-600 opacity-90">
                    {vet.specialty}
                  </p>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-50 transition-colors text-gray-300 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-black">
                    <Star className="w-3 h-3 fill-current" />
                    {vet.rating}
                  </div>
                  <span className="opacity-70">({vet.reviews} reviews)</span>
                </div>
                <span>•</span>
                <span>{vet.experience}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {vet.distance} away
              </div>
              
              {vet.tags && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {vet.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="bg-emerald-50 text-emerald-700 border-emerald-100 rounded-full px-2 py-0 font-bold text-[10px]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-gray-50/50 px-5 py-4 border-t border-gray-100 flex items-center justify-between font-sans">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider leading-none mb-1">
                  Next Available
                </p>
                <p className="text-sm font-black text-[#1A1A1A]">
                  {vet.nextSlot}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider leading-none mb-1">
                  Visit Fee
                </p>
                <p className="text-lg font-black text-[#1A1A1A]">
                  {vet.fee}
                </p>
              </div>
              <Link href={`/pawclinic/book?${queryParams}`}>
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-[16px] px-6 h-12 font-black shadow-[0_8px_20px_rgba(5,150,105,0.2)] transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                >
                  Book <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
