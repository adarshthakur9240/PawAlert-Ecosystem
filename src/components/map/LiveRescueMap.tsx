"use client"

import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, MapPin } from "lucide-react"
import type { Report } from "@/lib/database"

// Fix Leaflet's default icon path issue in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

// Custom marker icons by urgency
const createUrgencyIcon = (urgency: string) => {
  const colors: Record<string, string> = {
    critical: "#dc2626",
    high: "#ea580c",
    medium: "#E27E35",
    low: "#16a34a",
  }
  const color = colors[urgency] || colors.medium

  return L.divIcon({
    className: "custom-rescue-marker",
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
        <div style="
          width:36px;height:36px;
          background:${color};
          border:3px solid white;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 4px 12px ${color}80;
        "></div>
        <div style="
          position:absolute;
          width:14px;height:14px;
          background:white;
          border-radius:50%;
          top:11px;
        "></div>
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [18, 42],
    popupAnchor: [0, -44],
  })
}

const urgencyLabel: Record<string, { text: string; class: string }> = {
  critical: { text: "CRITICAL", class: "bg-red-600 text-white" },
  high: { text: "HIGH", class: "bg-orange-600 text-white" },
  medium: { text: "MEDIUM", class: "bg-amber-500 text-white" },
  low: { text: "LOW", class: "bg-green-600 text-white" },
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

interface LiveRescueMapProps {
  height?: string
  className?: string
}

export default function LiveRescueMap({ height = "300px", className = "" }: LiveRescueMapProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .in("status", ["pending", "dispatched", "on-site"])
        .order("created_at", { ascending: false })

      if (data) setReports(data as Report[])
      setLoading(false)
    }

    fetchReports()

    // Subscribe to realtime changes
    const channel = supabase
      .channel("reports-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports" },
        () => {
          fetchReports()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Default center: Bangalore
  const defaultCenter: [number, number] = [12.9716, 77.5946]

  // If we have reports with coordinates, center on the first one
  const mapCenter: [number, number] =
    reports.length > 0 && reports[0].location_lat && reports[0].location_lng
      ? [reports[0].location_lat, reports[0].location_lng]
      : defaultCenter

  if (loading) {
    return (
      <div
        className={`rounded-2xl bg-secondary/50 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <MapPin className="w-8 h-8 text-primary/40" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Loading map...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-sm border border-border ${className}`}
      style={{ height, isolation: 'isolate', position: 'relative', zIndex: 0 }}
    >
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reports.map((report) => {
          if (!report.location_lat || !report.location_lng) return null
          const urgency = urgencyLabel[report.urgency] || urgencyLabel.medium

          return (
            <Marker
              key={report.id}
              position={[report.location_lat, report.location_lng]}
              icon={createUrgencyIcon(report.urgency)}
            >
              <Popup className="rescue-popup" maxWidth={260} minWidth={220}>
                <div className="p-1 space-y-3">
                  {/* Image */}
                  {report.image_url && (
                    <div className="rounded-lg overflow-hidden h-28 bg-slate-100">
                      <img
                        src={report.image_url}
                        alt={report.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Header */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${urgency.class}`}
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {urgency.text}
                      </span>
                      {report.animal_type && (
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {report.animal_type}
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-sm text-slate-900 leading-tight">
                      {report.title}
                    </h3>
                  </div>

                  {/* Description */}
                  {report.description && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {report.description}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                      <Clock className="w-3 h-3" />
                      {timeAgo(report.created_at)}
                    </div>
                    <span className="text-[10px] font-bold text-primary uppercase">
                      {report.status}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Overlay Badge */}
      {reports.length > 0 && (
        <div className="absolute top-3 left-3 z-[1000]">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-md border border-border flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-black text-slate-700">
              {reports.length} Active Rescue{reports.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
