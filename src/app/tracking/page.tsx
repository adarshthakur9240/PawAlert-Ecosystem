"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, MapPin, CheckCircle2, Navigation, Package, Phone } from "lucide-react"
import Link from "next/link"

export default function TrackingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="absolute top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 p-4 flex items-center justify-between">
        <Link href="/home">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-background/50">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="bg-background/80 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
          ETA: 8 Mins
        </div>
      </div>

      <main className="flex-1 flex flex-col relative">
        {/* Map Placeholder */}
        <div className="flex-1 min-h-[50vh] bg-emerald-50 relative flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]" />
          <div className="flex flex-col items-center gap-2">
            <MapPin className="w-10 h-10 text-primary animate-bounce drop-shadow-md" />
            <span className="text-sm font-bold text-emerald-800 bg-white/80 px-3 py-1 rounded-full shadow-sm">Live Tracking Active</span>
          </div>
        </div>

        {/* Tracking Details Bottom Sheet style */}
        <div className="bg-background rounded-t-3xl shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.15)] relative z-20 px-6 py-8 space-y-6">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-border rounded-full" />
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-foreground">Order is on the way</h2>
              <p className="text-sm text-muted-foreground font-medium mt-0.5">Your PawStore order #ORD-1092</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="pl-2 space-y-6">
            <div className="flex gap-4 relative">
              <div className="absolute left-[9px] top-6 bottom-[-24px] w-[2px] bg-primary" />
              <div className="w-5 h-5 bg-primary rounded-full shrink-0 flex items-center justify-center z-10">
                <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="space-y-1 pb-2">
                <p className="font-bold text-sm text-foreground">Order Accepted</p>
                <p className="text-xs text-muted-foreground">3:42 PM</p>
              </div>
            </div>
            <div className="flex gap-4 relative">
              <div className="absolute left-[9px] top-6 bottom-[-24px] w-[2px] bg-primary" />
              <div className="w-5 h-5 bg-primary rounded-full shrink-0 flex items-center justify-center z-10">
                <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="space-y-1 pb-2">
                <p className="font-bold text-sm text-foreground">Packed & Ready</p>
                <p className="text-xs text-muted-foreground">3:45 PM</p>
              </div>
            </div>
            <div className="flex gap-4 relative">
              <div className="absolute left-[9px] top-6 bottom-[-24px] w-[2px] bg-border" />
              <div className="w-5 h-5 bg-background border-2 border-primary rounded-full shrink-0 flex items-center justify-center z-10">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>
              <div className="space-y-1 pb-2">
                <p className="font-bold text-sm text-primary">On the way</p>
                <p className="text-xs text-muted-foreground">Arriving in ~8 mins</p>
              </div>
            </div>
          </div>

          <Card className="border-none shadow-sm bg-secondary mt-6">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center font-bold text-sm border border-border">
                  AJ
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Amit (Delivery)</h4>
                  <p className="text-xs text-muted-foreground">Vaccinated & Verified</p>
                </div>
              </div>
              <Button size="icon" variant="outline" className="rounded-full bg-background border-border shadow-sm">
                <Phone className="w-4 h-4 text-primary" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
