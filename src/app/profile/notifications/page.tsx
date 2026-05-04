"use client"

import * as React from "react"
import { ChevronLeft, Bell, Zap, ShoppingBag, Syringe, Smartphone } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function NotificationsPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] pb-24 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-black text-xl tracking-tight uppercase">Notifications</h1>
      </div>

      <main className="p-4 space-y-8 max-w-2xl mx-auto w-full">
        {/* Alerts Section - Theme Compatible */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-gray-500 dark:text-muted-foreground tracking-widest uppercase px-2">Alert Preferences</h2>
          <div className="space-y-3">
            {[
              { label: "Emergency SOS Alerts", desc: "Nearby stray rescue reports", icon: Zap, color: "text-red-500", bg: "bg-red-500/10" },
              { label: "PawStore Updates", desc: "Order tracking and lightning offers", icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Pet Reminders", desc: "Vaccination and grooming alerts", icon: Syringe, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "App Notifications", desc: "General ecosystem updates", icon: Smartphone, color: "text-orange-500", bg: "bg-orange-500/10" },
            ].map((item, idx) => (
              <div key={idx} className="p-5 bg-white border border-gray-200 shadow-sm dark:bg-[#1a1a1a] dark:border-transparent dark:shadow-none rounded-[2rem] flex items-center justify-between group transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="text-left space-y-0.5">
                    <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight italic">{item.label}</h3>
                    <p className="text-[10px] text-gray-500 dark:text-slate-500 font-bold uppercase tracking-widest leading-tight max-w-[180px]">{item.desc}</p>
                  </div>
                </div>
                <Switch defaultChecked={idx !== 3} />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-slate-900/50 rounded-[2rem] border border-gray-200 dark:border-white/5 text-center">
          <p className="text-[10px] text-gray-500 dark:text-slate-500 font-black uppercase tracking-widest">
            Preferences are synced across all your devices using Clerk.
          </p>
        </div>
      </main>
    </div>
  )
}
