"use client"

import * as React from "react"
import { Bell, MapPin, Loader2, PawPrint, Pencil, Trash2, Plus, X, Check, Clock, Syringe, ShieldAlert } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { DynamicSearch } from "@/components/ui/DynamicSearch"
import { usePetStore, Pet } from "@/state/petState"
import { AddPetModal } from "@/components/shared/AddPetModal"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// --- Mock Notifications ---
const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'vaccination', title: "Bruno's Anti-Rabies due!", body: 'Booster shot is scheduled for 12 May.', time: '2h ago', read: false },
  { id: 2, type: 'checkup', title: "Luna's Checkup reminder", body: 'Annual dental cleaning is overdue.', time: '1d ago', read: false },
  { id: 3, type: 'offer', title: 'PawClinic Offer: 30% OFF', body: 'First consultation is discounted this week.', time: '3d ago', read: true },
]

function NotificationDot({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white">
      {count}
    </span>
  )
}

export function TopBar() {
  const [locationName, setLocationName] = React.useState("Detecting...")
  const [isDetecting, setIsDetecting] = React.useState(false)
  const [isPetPanelOpen, setIsPetPanelOpen] = React.useState(false)
  const [isNotifOpen, setIsNotifOpen] = React.useState(false)
  const [isAddPetOpen, setIsAddPetOpen] = React.useState(false)
  const [editPet, setEditPet] = React.useState<Pet | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null)
  const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS)

  const { pets, deletePet } = usePetStore()
  const unreadCount = notifications.filter(n => !n.read).length

  const detectLocation = React.useCallback(() => {
    if (!navigator.geolocation) { setLocationName("Location unsupported"); return }
    setIsDetecting(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'en-US,en;q=0.9', 'User-Agent': 'PawAlert-App' } }
          )
          const data = await response.json()
          if (data.address) {
            const addr = data.address
            setLocationName(addr.suburb || addr.neighbourhood || addr.city_district || addr.city || "Unknown Area")
          } else { setLocationName("Unknown Area") }
        } catch { setLocationName("Location Error") } finally { setIsDetecting(false) }
      },
      (error) => {
        if (!error || (!error.code && !error.message)) { setIsDetecting(false); return }
        if (error.code === 1) setLocationName("Location Denied")
        else if (error.code === 2) setLocationName("Area Unreachable")
        else if (error.code === 3) setLocationName("Detection Timeout")
        else setLocationName("Location Error")
        setIsDetecting(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  React.useEffect(() => { detectLocation() }, [detectLocation])

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  return (
    <>
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Location */}
            <div className="flex items-center gap-2">
              <Link href="/home" className="flex items-center gap-2 group">
                <img src='/pawalert-brand.svg' alt="PawAlert" className="w-8 h-8 group-hover:scale-105 transition-transform" />
              </Link>
              <button onClick={detectLocation} className="flex flex-col items-start group hover:opacity-80 transition-opacity text-left max-w-[180px]" disabled={isDetecting}>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter flex items-center gap-1">
                  Delivering to <MapPin className={`w-2.5 h-2.5 text-emerald-600 ${isDetecting ? 'animate-bounce' : ''}`} />
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black truncate text-[#1A1A1A]">{locationName}</span>
                  {isDetecting && <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />}
                </div>
              </button>
            </div>

            {/* Right: My Pets + Bell + User */}
            <div className="flex items-center gap-3">
              {/* My Pets Icon */}
              <button
                onClick={() => { setIsPetPanelOpen(true); setIsNotifOpen(false) }}
                className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center relative hover:bg-emerald-100 transition-colors active:scale-90"
              >
                <PawPrint className="w-5 h-5 text-emerald-600" />
                {pets.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-emerald-600 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white">
                    {pets.length}
                  </span>
                )}
              </button>

              {/* Notification Bell */}
              <button
                onClick={() => { setIsNotifOpen(p => !p); setIsPetPanelOpen(false) }}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center relative hover:bg-gray-100 transition-colors active:scale-90"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <NotificationDot count={unreadCount} />
              </button>

              <UserButton />
            </div>
          </div>

          <DynamicSearch />
        </div>

        {/* Notification Dropdown */}
        <AnimatePresence>
          {isNotifOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 w-80 bg-white rounded-[28px] shadow-2xl border border-gray-100 overflow-hidden z-50 mx-4"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-50">
                <h3 className="font-black text-sm text-[#1A1A1A]">Notifications</h3>
                <button onClick={markAllRead} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.map(notif => (
                  <div key={notif.id} className={cn("flex gap-3 p-4 transition-colors", !notif.read ? "bg-emerald-50/50" : "bg-white")}>
                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                      notif.type === 'vaccination' ? "bg-purple-50 text-purple-600" :
                      notif.type === 'checkup' ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-500"
                    )}>
                      {notif.type === 'vaccination' ? <Syringe className="w-4 h-4" /> :
                       notif.type === 'checkup' ? <Clock className="w-4 h-4" /> :
                       <ShieldAlert className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-[#1A1A1A] leading-tight">{notif.title}</p>
                      <p className="text-[10px] font-semibold text-gray-400 mt-0.5 leading-snug">{notif.body}</p>
                      <p className="text-[9px] font-bold text-gray-300 uppercase mt-1">{notif.time}</p>
                    </div>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* My Pets Slide-over Panel */}
      <AnimatePresence>
        {isPetPanelOpen && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPetPanelOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-black text-xl text-[#1A1A1A]">My Pets</h2>
                <button onClick={() => setIsPetPanelOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Add New Button */}
              <div className="px-6 py-4">
                <button
                  onClick={() => { setEditPet(null); setIsAddPetOpen(true) }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-3xl bg-emerald-600 text-white font-black shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform"
                >
                  <Plus className="w-5 h-5" /> Add New Pet
                </button>
              </div>

              {/* Pet List */}
              <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-6">
                {pets.length === 0 && (
                  <div className="text-center py-16 space-y-3">
                    <PawPrint className="w-12 h-12 text-gray-200 mx-auto" />
                    <p className="text-sm font-black text-gray-300">No pets yet. Add your first pet!</p>
                  </div>
                )}
                {pets.map(pet => (
                  <div key={pet.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-[24px] group">
                    <img src={pet.photoUrl} alt={pet.name} className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[#1A1A1A] truncate">{pet.name}</p>
                      <p className="text-xs font-bold text-gray-400">{pet.breed}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditPet(pet); setIsAddPetOpen(true) }}
                        className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors shadow-sm"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(pet.id)}
                        className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Pet Modal */}
      <AddPetModal
        isOpen={isAddPetOpen}
        onClose={() => { setIsAddPetOpen(false); setEditPet(null) }}
        editPet={editPet}
        accentColor="emerald"
      />

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirmId(null)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[32px] p-8 space-y-6 w-full max-w-sm shadow-2xl">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="font-black text-xl text-[#1A1A1A]">Remove this pet?</h3>
                <p className="text-sm font-semibold text-gray-400">All health records will be permanently deleted.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="h-12 rounded-2xl font-black border-2 border-gray-100 text-gray-500 hover:bg-gray-50">Cancel</button>
                <button onClick={() => { deletePet(deleteConfirmId); setDeleteConfirmId(null) }} className="h-12 rounded-2xl font-black bg-red-500 hover:bg-red-600 text-white">Remove</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
