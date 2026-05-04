"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Syringe, Calendar, CheckCircle2, ChevronRight, Bell, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const UPCOMING = [
  { id: 1, pet: "Luna", vaccine: "Anti-Rabies Booster", due: "19 May 2026", daysLeft: 4, type: "Core Vaccine" },
  { id: 2, pet: "Bruno", vaccine: "DHPP (Distemper)", due: "05 Jun 2026", daysLeft: 21, type: "Core Vaccine" },
]

const COMPLETED = [
  { id: 3, pet: "Charlie", vaccine: "Bordetella", date: "12 Apr 2026", doctor: "Dr. Ananya Iyer" },
  { id: 4, pet: "Bruno", vaccine: "Parvovirus", date: "02 Feb 2026", doctor: "Dr. Rajesh Kumar" },
]

import Link from "next/link"

export default function VaccinationPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState("upcoming")

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans pb-10">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-2 border-b border-gray-100 sticky top-0 z-50 space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-6 h-6 text-emerald-600" />
          </button>
          <h1 className="text-xl font-black tracking-tight text-[#1A1A1A]">Vaccinations</h1>
        </div>

        {/* Custom Tabs */}
        <div className="flex bg-gray-100 p-1.5 rounded-[20px] relative">
          <div 
            className={cn(
              "absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-[16px] shadow-sm transition-all duration-300",
              activeTab === "upcoming" ? "left-1.5" : "left-[calc(50%+1.5px)]"
            )}
          />
          <button 
            onClick={() => setActiveTab("upcoming")}
            className={cn(
              "flex-1 py-3 text-sm font-black relative z-10 transition-colors",
              activeTab === "upcoming" ? "text-emerald-600" : "text-gray-400"
            )}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setActiveTab("completed")}
            className={cn(
              "flex-1 py-3 text-sm font-black relative z-10 transition-colors",
              activeTab === "completed" ? "text-emerald-600" : "text-gray-400"
            )}
          >
            Completed
          </button>
        </div>
      </div>

      <main className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === "upcoming" ? (
            <motion.div 
              key="upcoming"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4 flex gap-3 mb-6">
                <Bell className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-xs font-semibold text-emerald-800 leading-relaxed">
                  Keeping your pets vaccinated prevents serious diseases. We'll remind you 3 days before any due date.
                </p>
              </div>

              {UPCOMING.map((v) => {
                const queryParams = new URLSearchParams({
                  visitType: 'Vaccination',
                  fee: '200',
                  reason: v.vaccine
                }).toString()

                return (
                  <Card key={v.id} className="border-none bg-white rounded-[32px] shadow-sm overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-[#1A1A1A]">{v.vaccine}</h2>
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold rounded-full">
                              {v.type}
                            </Badge>
                          </div>
                          <p className="text-sm font-bold text-gray-400">Pet: <span className="text-[#1A1A1A]">{v.pet}</span></p>
                        </div>
                        <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          {v.daysLeft} Days Left
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-0.5">Due Date</p>
                            <p className="text-sm font-black text-[#1A1A1A]">{v.due}</p>
                          </div>
                        </div>
                        <Link href={`/pawclinic/book?${queryParams}`}>
                          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 px-6 font-black shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform">
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </motion.div>
          ) : (
            <motion.div 
              key="completed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {COMPLETED.map((v) => (
                <div key={v.id} className="bg-white rounded-3xl p-5 shadow-sm flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-black text-[#1A1A1A] leading-tight">{v.vaccine}</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <span>Pet: {v.pet}</span>
                      <span>•</span>
                      <span>{v.date}</span>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1 pt-1">
                      <ShieldCheck className="w-3 h-3" /> Administered by {v.doctor}
                    </p>
                  </div>
                  <button className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </button>
                </div>
              ))}
              
              <div className="pt-10 text-center space-y-2">
                <p className="text-sm font-black text-gray-300 uppercase tracking-widest">End of History</p>
                <div className="w-1.5 h-1.5 bg-gray-200 rounded-full mx-auto" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
