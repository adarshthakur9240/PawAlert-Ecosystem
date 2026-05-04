"use client"

import dynamic from "next/dynamic"
import { MapPin } from "lucide-react"

const LiveRescueMap = dynamic(() => import("@/components/map/LiveRescueMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl bg-secondary/50 flex items-center justify-center h-[300px]">
      <div className="flex flex-col items-center gap-2 animate-pulse">
        <MapPin className="w-8 h-8 text-primary/40" />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Loading map...
        </span>
      </div>
    </div>
  ),
})

export default LiveRescueMap
