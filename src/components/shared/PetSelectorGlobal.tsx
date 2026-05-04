"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePetStore, Pet } from "@/state/petState"
import { AddPetModal } from "@/components/shared/AddPetModal"

type ServiceTheme = 'emerald' | 'pink' | 'violet' | 'purple'

interface PetSelectorGlobalProps {
  theme?: ServiceTheme
  onPetChange?: (pet: Pet) => void
}

const THEME_CLASSES: Record<ServiceTheme, { border: string; text: string; bg: string }> = {
  emerald: { border: 'border-emerald-600', text: 'text-emerald-600', bg: 'bg-emerald-50' },
  pink:    { border: 'border-pink-500',    text: 'text-pink-600',    bg: 'bg-pink-50' },
  violet:  { border: 'border-violet-600',  text: 'text-violet-600',  bg: 'bg-violet-50' },
  purple:  { border: 'border-purple-600',  text: 'text-purple-600',  bg: 'bg-purple-50' }
}

export function PetSelectorGlobal({ theme = 'emerald', onPetChange }: PetSelectorGlobalProps) {
  const { pets, activePetId, setActivePet } = usePetStore()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const t = THEME_CLASSES[theme]

  const handleSelect = (pet: Pet) => {
    setActivePet(pet.id)
    onPetChange?.(pet)
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {pets.map((pet) => (
          <button
            key={pet.id}
            onClick={() => handleSelect(pet)}
            className={cn(
              "flex flex-col items-center gap-2 min-w-[80px] transition-all active:scale-95",
              activePetId === pet.id ? "scale-105" : "opacity-60 hover:opacity-80"
            )}
          >
            <div className={cn(
              "w-20 h-20 rounded-full border-4 p-0.5 transition-all shadow-md",
              activePetId === pet.id ? t.border : "border-transparent"
            )}>
              <img src={pet.photoUrl} alt={pet.name} className="w-full h-full rounded-full object-cover" />
            </div>
            <span className={cn(
              "text-xs font-black",
              activePetId === pet.id ? t.text : "text-gray-500"
            )}>
              {pet.name}
            </span>
          </button>
        ))}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center gap-2 min-w-[80px] group opacity-60 hover:opacity-100 transition-opacity active:scale-95"
        >
          <div className={cn(
            "w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-white transition-all",
            `group-hover:${t.border} group-hover:${t.bg}`
          )}>
            <Plus className={cn("w-8 h-8 text-gray-300 transition-colors", `group-hover:${t.text}`)} />
          </div>
          <span className={cn("text-xs font-black text-gray-400 uppercase tracking-widest", `group-hover:${t.text}`)}>
            Add New
          </span>
        </button>
      </div>
      <AddPetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} accentColor={theme} />
    </>
  )
}
