"use client"

import * as React from "react"
import { ChevronLeft, Award, Zap, Gift, Heart, ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function RewardsPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24 text-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-black text-xl tracking-tight uppercase">Karma Rewards</h1>
      </div>

      <main className="p-4 space-y-8 max-w-2xl mx-auto w-full">
        {/* Points Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#b33918] to-[#e55934] text-white p-8 rounded-[3rem] shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Award className="w-48 h-48 rotate-12 text-white" />
          </div>
          <div className="relative z-10 flex flex-col items-center text-center space-y-2">
            <span className="text-xs font-black tracking-[0.2em] uppercase opacity-90">Total Karma Earned</span>
            <div className="flex items-center gap-3">
              <h2 className="text-7xl font-black tracking-tighter italic">1,240</h2>
              <Zap className="w-8 h-8 fill-white" />
            </div>
            <p className="text-sm font-bold bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mt-2">
              Level 4 Rescuer • Top 5% this month
            </p>
          </div>
        </div>

        {/* Redemption Section */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-gray-500 tracking-widest uppercase px-2">Redeem Points</h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              { title: "₹100 Off on PawStore", cost: "500 Karma", icon: Gift, color: "text-blue-500", bg: "bg-blue-500/10" },
              { title: "Free Vet Consultation", cost: "1,200 Karma", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
              { title: "Donate to Local NGO", cost: "100 Karma", icon: Heart, color: "text-red-500", bg: "bg-red-500/10" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 bg-white border border-gray-200 shadow-sm rounded-[2rem] group hover:border-primary/40 hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <div className="space-y-0.5 text-left">
                    <h3 className="font-black text-sm text-gray-900 uppercase tracking-tight italic">{item.title}</h3>
                    <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">{item.cost}</p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowUpRight className="w-5 h-5 text-gray-300" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-white flex flex-col items-center text-center space-y-2">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Next Goal</p>
          <p className="text-xs font-medium text-gray-500 max-w-[280px]">
            Earn 760 more Karma to reach Level 5 and unlock Exclusive Badges.
          </p>
        </div>
      </main>
    </div>
  )
}