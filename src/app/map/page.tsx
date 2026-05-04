"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import LiveRescueMap from "@/components/map/DynamicMap"

export default function FullscreenMapPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 p-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-black text-lg tracking-tight">Live Rescue Map</h1>
      </div>

      {/* Full Map */}
      <div className="flex-1">
        <LiveRescueMap height="100%" className="rounded-none border-none" />
      </div>
    </div>
  )
}
