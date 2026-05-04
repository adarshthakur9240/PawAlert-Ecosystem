"use client"

import * as React from "react"
import { ChevronLeft, ShieldCheck, Fingerprint, Key, Smartphone, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function SecurityPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] pb-24 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-black text-xl tracking-tight uppercase">Security</h1>
      </div>

      <main className="p-4 space-y-8 max-w-2xl mx-auto w-full">
        {/* Protection Status - Theme Compatible */}
        <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-[2.5rem] flex items-center gap-5 shadow-sm dark:shadow-none">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-emerald-600 dark:text-emerald-500 uppercase italic">Account Protected</h2>
            <p className="text-[11px] text-gray-500 dark:text-slate-500 font-black tracking-widest uppercase">DATA IS ENCRYPTED</p>
          </div>
        </div>

        {/* Security Controls - Theme Compatible */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-gray-500 dark:text-muted-foreground tracking-widest uppercase px-2">Access Controls</h2>
          <div className="space-y-3">
            {[
              { label: "Two-Factor Authentication", desc: "Require a code sent to your mobile phone", icon: Smartphone, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Biometric Login", desc: "Use FaceID or Fingerprint to access app", icon: Fingerprint, color: "text-purple-500", bg: "bg-purple-500/10" },
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
                <Switch defaultChecked={idx === 1} />
              </div>
            ))}
          </div>
        </div>

        {/* Password Management - Theme Compatible */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-gray-500 dark:text-muted-foreground tracking-widest uppercase px-2">Password Management</h2>
          <button className="w-full p-5 bg-white border border-gray-200 shadow-sm dark:bg-[#1a1a1a] dark:border-transparent dark:shadow-none rounded-[2rem] flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-[#222] transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                <Key className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-left space-y-0.5">
                <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight italic">Change Password</h3>
                <p className="text-[10px] text-gray-500 dark:text-slate-500 font-black tracking-widest uppercase">Last updated 3 months ago</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-slate-700 group-hover:text-primary transition-colors" />
          </button>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-slate-900/50 rounded-[2rem] border border-gray-200 dark:border-white/5 text-center">
          <p className="text-[10px] text-gray-500 dark:text-slate-500 font-black uppercase tracking-widest leading-relaxed">
            Managed via Clerk Authentication Services.
          </p>
        </div>
      </main>
    </div>
  )
}
