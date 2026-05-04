"use client"

import * as React from "react"
import { 
  Zap, Syringe, CheckCircle2, Clock, Weight, Dna, 
  Pencil, Trash2, MessageSquare, ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { usePetStore, useActivePet, calculateAge, Pet } from "@/state/petState"
import { AddPetModal } from "@/components/shared/AddPetModal"
import { motion, AnimatePresence } from "framer-motion"

type ServiceTheme = 'emerald' | 'pink' | 'violet' | 'purple'

interface HealthCardUnifiedProps {
  theme?: ServiceTheme
  onConsultPawBot?: (pet: Pet) => void
  showDeleteConfirm?: boolean
}

const THEME = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'bg-emerald-600', btn: 'bg-emerald-600 hover:bg-emerald-700', shadow: 'shadow-emerald-200/60', border: 'border-emerald-100', upcomingBadge: 'bg-emerald-50 text-emerald-700' },
  pink:    { bg: 'bg-pink-50',    text: 'text-pink-600',    badge: 'bg-pink-600',    btn: 'bg-pink-600 hover:bg-pink-700',       shadow: 'shadow-pink-200/60',    border: 'border-pink-100',    upcomingBadge: 'bg-pink-50 text-pink-700' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  badge: 'bg-violet-600',  btn: 'bg-violet-600 hover:bg-violet-700',   shadow: 'shadow-violet-200/60',  border: 'border-violet-100',  upcomingBadge: 'bg-violet-50 text-violet-700' },
  purple:  { bg: 'bg-purple-50',  text: 'text-purple-600',  badge: 'bg-purple-600',  btn: 'bg-purple-600 hover:bg-purple-700',   shadow: 'shadow-purple-200/60',  border: 'border-purple-100',  upcomingBadge: 'bg-purple-50 text-purple-700' }
}

export function HealthCardUnified({ theme = 'emerald', onConsultPawBot }: HealthCardUnifiedProps) {
  const { deletePet } = usePetStore()
  const activePet = useActivePet()
  const t = THEME[theme]

  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false)

  if (!activePet) return null

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={activePet.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
        >
          <Card className={cn("border-none rounded-[40px] overflow-hidden bg-white shadow-2xl", t.shadow)}>
            <CardContent className="p-8 space-y-8">
              {/* Identity + Edit/Delete */}
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-lg shrink-0">
                  <img src={activePet.photoUrl} alt={activePet.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tighter leading-none">{activePet.name}</h2>
                  <Badge className={cn("text-white border-none rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest mt-2", t.badge)}>
                    {activePet.breed}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="w-9 h-9 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="w-9 h-9 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Vitals */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 p-4 rounded-[28px] text-center space-y-1">
                  <Weight className={cn("w-4 h-4 mx-auto", t.text)} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Weight</p>
                  <p className="text-sm font-black text-[#1A1A1A]">{activePet.weight}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-[28px] text-center space-y-1">
                  <Clock className="w-4 h-4 mx-auto text-orange-400" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Age</p>
                  <p className="text-sm font-black text-[#1A1A1A]">{calculateAge(activePet.dob)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-[28px] text-center space-y-1">
                  <Dna className="w-4 h-4 mx-auto text-blue-500" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Gender</p>
                  <p className="text-sm font-black text-[#1A1A1A]">{activePet.gender}</p>
                </div>
              </div>

              {/* Medical Timeline */}
              {activePet.timeline.length > 0 && (
                <div className="space-y-5">
                  <h3 className={cn("font-black text-base flex items-center gap-2", t.text)}>
                    <Zap className="w-4 h-4" /> Medical Timeline
                  </h3>
                  <div className="space-y-4">
                    {activePet.timeline.map((item, i) => (
                      <div key={i} className="flex gap-4 relative">
                        {i !== activePet.timeline.length - 1 && (
                          <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-gray-100" />
                        )}
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 relative z-10 shadow-sm",
                          item.status === 'Completed' ? "bg-emerald-50 text-emerald-600" : cn(t.bg, t.text)
                        )}>
                          {item.type === 'Vaccination' ? <Syringe className="w-5 h-5" /> :
                           item.type === 'Checkup' ? <CheckCircle2 className="w-5 h-5" /> :
                           <Clock className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-sm font-black text-[#1A1A1A] leading-tight">{item.title}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.date}</p>
                            <Badge className={cn(
                              "text-[8px] font-black border-none h-4 px-1.5 rounded-full",
                              item.status === 'Completed' ? "bg-emerald-50 text-emerald-700" :
                              item.status === 'Upcoming' ? t.upcomingBadge : "bg-gray-50 text-gray-500"
                            )}>{item.status}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PawBot CTA */}
              <Button
                onClick={() => onConsultPawBot?.(activePet)}
                className={cn("w-full rounded-3xl h-14 font-black text-white shadow-xl group", t.btn)}
              >
                <MessageSquare className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Consult PawBot about {activePet.name}
                <ArrowRight className="w-5 h-5 ml-2 opacity-50" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Edit Modal */}
      <AddPetModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} editPet={activePet} accentColor={theme} />

      {/* Delete Confirm */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteConfirmOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[32px] p-8 space-y-6 w-full max-w-sm shadow-2xl">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="font-black text-xl text-[#1A1A1A]">Remove {activePet.name}?</h3>
                <p className="text-sm font-semibold text-gray-400">This will permanently delete all of {activePet.name}'s health records.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)} className="h-12 rounded-2xl font-black">Cancel</Button>
                <Button onClick={() => { deletePet(activePet.id); setIsDeleteConfirmOpen(false) }} className="h-12 rounded-2xl font-black bg-red-500 hover:bg-red-600 text-white">Remove</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
