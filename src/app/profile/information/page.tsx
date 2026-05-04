"use client"

import * as React from "react"
import { ChevronLeft, User, Mail, Phone, MapPin, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function InformationPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      router.back()
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] pb-24 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-black text-xl tracking-tight uppercase">Profile Info</h1>
      </div>

      <main className="p-4 space-y-8 max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="w-24 h-24 rounded-[2rem] bg-gray-100 dark:bg-secondary flex items-center justify-center border-4 border-gray-200 dark:border-white/5 shadow-xl relative group">
            <span className="text-3xl font-black text-primary">A</span>
            <div className="absolute inset-0 bg-black/40 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Change</span>
            </div>
          </div>
          <p className="text-[10px] font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest">Citizen Rescuer • Since 2024</p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2 px-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-slate-500 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                <Input defaultValue="Adarsh Singh" className="h-14 pl-12 bg-white border-gray-200 shadow-sm dark:bg-[#1a1a1a] dark:border-transparent dark:shadow-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-primary/20" />
              </div>
            </div>

            <div className="space-y-2 px-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-slate-500 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                <Input defaultValue="adarsh@pawalert.com" className="h-14 pl-12 bg-white border-gray-200 shadow-sm dark:bg-[#1a1a1a] dark:border-transparent dark:shadow-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-primary/20" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 px-1">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-slate-500 ml-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <Input defaultValue="+91 98765 43210" className="h-14 pl-12 bg-white border-gray-200 shadow-sm dark:bg-[#1a1a1a] dark:border-transparent dark:shadow-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-primary/20" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-slate-500 ml-1">City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <Input defaultValue="Noida" className="h-14 pl-12 bg-white border-gray-200 shadow-sm dark:bg-[#1a1a1a] dark:border-transparent dark:shadow-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-primary/20" />
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-16 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            {isSaving ? "Saving..." : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}
