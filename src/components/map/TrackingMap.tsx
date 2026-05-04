"use client"

import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

const petIcon = (emoji: string) => L.divIcon({
  className: "tracking-pet-icon",
  html: `<div style="
    width: 48px; height: 48px;
    background: #ea580c;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 4px 16px rgba(234,88,12,0.4);
    display: flex; align-items: center; justify-content: center;
    position: relative;
  ">
    <span style="transform: rotate(45deg); font-size: 20px; position: absolute;">${emoji}</span>
  </div>`,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -52],
})

const homeIcon = L.divIcon({
  className: "tracking-home-icon",
  html: `<div style="
    width: 44px; height: 44px;
    background: #22c55e;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 4px 16px rgba(34,197,94,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  ">🏠</div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
})

function MapCenter({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => { map.panTo(center, { animate: true, duration: 1 }) }, [center, map])
  return null
}

// Waypoints simulating the pet's journey toward home
const HOME: [number, number] = [12.9716, 77.5946]
const WAYPOINTS: [number, number][] = [
  [12.9350, 77.6101],
  [12.9450, 77.6050],
  [12.9550, 77.6000],
  [12.9616, 77.5970],
  [12.9680, 77.5955],
  HOME,
]

interface TrackingMapProps {
  petName: string
  status: string
}

export default function TrackingMap({ petName, status }: TrackingMapProps) {
  const [waypointIdx, setWaypointIdx] = useState(0)
  const petPos = WAYPOINTS[Math.min(waypointIdx, WAYPOINTS.length - 1)]

  useEffect(() => {
    if (status === 'transit' || status === 'delivered') {
      const interval = setInterval(() => {
        setWaypointIdx(prev => {
          if (prev >= WAYPOINTS.length - 1) { clearInterval(interval); return prev }
          return prev + 1
        })
      }, 1800)
      return () => clearInterval(interval)
    }
  }, [status])

  // Pick emoji based on pet type
  const emoji = petName.toLowerCase().includes('cat') ? '🐱' : '🐶'

  return (
    <MapContainer
      center={petPos}
      zoom={13}
      scrollWheelZoom={false}
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapCenter center={petPos} />

      {/* Pet marker */}
      <Marker position={petPos} icon={petIcon(emoji)}>
        <Popup>
          <div className="text-center font-bold text-sm">
            {emoji} {petName}<br />
            <span className="text-orange-600 text-xs">On the way!</span>
          </div>
        </Popup>
      </Marker>

      {/* Home / destination marker */}
      <Marker position={HOME} icon={homeIcon}>
        <Popup>
          <div className="text-center font-bold text-sm">
            🏠 Your Home<br />
            <span className="text-emerald-600 text-xs">Destination</span>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
