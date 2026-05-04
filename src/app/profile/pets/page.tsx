"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Settings, MessageSquare } from "lucide-react"

import { PetSelectorGlobal } from "@/components/shared/PetSelectorGlobal"
import { HealthCardUnified } from "@/components/shared/HealthCardUnified"
import { usePetStore, useActivePet } from "@/state/petState"

export default function MyPetsPage() {
  const router = useRouter()
  const activePet = useActivePet()

  const handleConsultPawBot = (pet: ReturnType<typeof useActivePet>) => {
    router.push(`/pawclinic?chatWith=${pet?.name}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center active:scale-90 transition-transform">
            <ChevronLeft className="w-6 h-6 text-violet-600" />
          </button>
          <h1 className="text-xl font-black tracking-tight text-[#1A1A1A]">My Pets</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <main className="p-4 space-y-8">
        {/* Global Pet Selector */}
        <PetSelectorGlobal theme="violet" />

        {/* Unified Health Card */}
        {activePet ? (
          <HealthCardUnified theme="violet" onConsultPawBot={handleConsultPawBot} />
        ) : (
          <div className="text-center py-20 space-y-3">
            <p className="text-gray-400 font-black">No pets yet. Add your first pet!</p>
          </div>
        )}
      </main>
    </div>
  )
}
