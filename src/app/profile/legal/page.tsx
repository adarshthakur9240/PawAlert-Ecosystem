"use client"

import * as React from "react"
import { ChevronLeft, Scale, Shield, FileText, Globe, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LegalPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24 text-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-black text-xl tracking-tight uppercase">Legal & About</h1>
      </div>

      <main className="p-4 space-y-8 max-w-2xl mx-auto w-full">
        {/* App Info */}
        <div className="flex flex-col items-center text-center space-y-4 py-8">
          <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary/20 rotate-12">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic text-gray-900">
              Paw<span className="text-primary">Alert</span>
            </h2>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Version 2.4.0 (Build 89)</p>
          </div>
        </div>

        {/* Legal Links */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-gray-500 tracking-widest uppercase px-2">Documentation</h2>
          <div className="space-y-3">
            {[
              { label: "Terms of Service", icon: Scale, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Privacy Policy", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Cookie Policy", icon: FileText, color: "text-orange-500", bg: "bg-orange-500/10" },
              { label: "Community Guidelines", icon: Globe, color: "text-purple-500", bg: "bg-purple-500/10" },
            ].map((item, idx) => (
              <button key={idx} className="w-full p-5 bg-white border border-gray-200 shadow-sm rounded-[2rem] flex items-center justify-between group hover:bg-gray-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <span className="font-black text-sm uppercase tracking-tight italic text-gray-900">{item.label}</span>
                </div>
                <Info className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8 text-center space-y-4">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Made with ❤️ for Animals</p>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed px-12">
            © 2024 PawAlert Foundation. All rights reserved. NGO registration ID: PA-990-21.
          </p>
        </div>
      </main>
    </div>
  )
}