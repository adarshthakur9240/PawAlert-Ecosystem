"use client"

import * as React from "react"
import { ChevronLeft, Wallet, CreditCard, Landmark, Plus, ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function PaymentsPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24 text-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-black text-xl tracking-tight uppercase">Payments</h1>
      </div>

      <main className="p-4 space-y-8 max-w-2xl mx-auto w-full">
        {/* Wallet Card - Kept Dark/Black for a Premium "Black Card" Look */}
        <div className="bg-gray-900 text-white p-6 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wallet className="w-40 h-40" />
          </div>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Paw-Wallet Balance</span>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-4xl font-black text-white italic tracking-tighter">₹2,450.00</h2>
              <Button size="sm" className="rounded-xl bg-white text-black font-black uppercase text-[10px] tracking-widest px-4 hover:bg-gray-200 transition-colors">
                Add Money
              </Button>
            </div>
          </div>
        </div>

        {/* Saved Methods */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black text-gray-500 tracking-widest uppercase px-2">Saved Methods</h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:text-primary/80 transition-colors">
              Add New <Plus className="w-3 h-3" />
            </button>
          </div>
          
          <div className="space-y-3">
            {[
              { label: "Visa Primary", info: "•••• 4242", icon: CreditCard, color: "text-blue-500" },
              { label: "Google Pay UPI", info: "adarsh@okaxis", icon: Landmark, color: "text-emerald-500" },
            ].map((item, idx) => (
              <div key={idx} className="p-5 bg-white border border-gray-200 text-gray-900 rounded-[2rem] flex items-center justify-between group hover:border-primary/40 transition-all cursor-pointer shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight italic">{item.label}</h3>
                    <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">{item.info}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Karma Cashback Banner */}
        <div className="p-6 bg-white rounded-[2rem] border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1 text-gray-900">
            <p className="text-sm font-black text-primary uppercase italic">Karma Cashback</p>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-wide max-w-[180px]">Earn up to 10% Karma on all PawStore purchases.</p>
          </div>
          <Button variant="link" className="text-primary font-black uppercase text-[10px] tracking-widest p-0 h-auto">View Offers</Button>
        </div>
      </main>
    </div>
  )
}