"use client"

import * as React from "react"
import { ChevronLeft, MessageCircle, HelpCircle, Phone, Mail, ChevronRight, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function SupportPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24 text-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-black text-xl tracking-tight uppercase">Support</h1>
      </div>

      <main className="p-4 space-y-8 max-w-2xl mx-auto w-full">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="Search for help topics..." 
            className="h-16 pl-12 bg-white border-gray-200 shadow-sm rounded-[2rem] font-bold text-gray-900 focus:ring-primary/20" 
          />
        </div>

        {/* Quick Help Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Live Chat", icon: MessageCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Email Support", icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" },
          ].map((item, idx) => (
            <button key={idx} className="p-6 bg-white border border-gray-200 shadow-sm rounded-[2.5rem] flex flex-col items-center gap-3 group hover:bg-gray-50 transition-all">
              <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-7 h-7 ${item.color}`} />
              </div>
              <span className="font-black text-xs uppercase tracking-widest text-gray-900">{item.label}</span>
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-gray-500 tracking-widest uppercase px-2">Popular Questions</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {[
              { q: "How do I report a stray?", a: "Go to the Rescue tab and click 'Report Incident'. We'll guide you through the process." },
              { q: "What are Karma Points?", a: "Karma is earned by helping animals and reporting rescues. You can redeem them for rewards." },
              { q: "Is PawAlert free?", a: "Yes, all core rescue services are free for citizens. We fund this via the PawStore." },
            ].map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="bg-white border border-gray-200 shadow-sm rounded-3xl px-6 overflow-hidden">
                <AccordionTrigger className="font-black text-sm uppercase tracking-tight text-gray-900 hover:no-underline py-5 italic">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-wide pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Info */}
        <div className="p-6 border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-white flex flex-col items-center text-center space-y-2">
          <Phone className="w-5 h-5 text-primary mb-1" />
          <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Emergency Hotline</p>
          <p className="text-xl font-black text-primary tracking-tighter italic">+91 1800-PAW-HELP</p>
        </div>
      </main>
    </div>
  )
}