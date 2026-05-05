"use client"

import * as React from "react"
import { ChevronLeft, MapPin, Home, Shield, Plus, X, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AddressesPage() {
  const router = useRouter()
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [addresses, setAddresses] = React.useState([
    { id: 1, label: "PawStore Delivery", addr: "42, Silicon Heights, Koramangala, Bangalore", icon: Home, color: "text-blue-400", bg: "bg-blue-400/10" },
    { id: 2, label: "Primary Rescue Zone", addr: "Indiranagar 100ft Road (Active Monitoring)", icon: Shield, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ])
  const [tempAddr, setTempAddr] = React.useState("")

  const handleEdit = (id: number, currentAddr: string) => {
    setEditingId(id)
    setTempAddr(currentAddr)
  }

  const handleSave = () => {
    setAddresses(prev => prev.map(a => a.id === editingId ? { ...a, addr: tempAddr } : a))
    setEditingId(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24 text-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-black text-xl tracking-tight uppercase">Saved Addresses</h1>
        </div>
        <Button size="icon" className="rounded-full bg-primary text-white hover:bg-primary/90">
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <main className="p-4 space-y-6 max-w-2xl mx-auto w-full">
        <div className="space-y-4">
          <h2 className="text-xs font-black text-gray-500 tracking-widest uppercase px-2">Primary Locations</h2>
          
          <div className="space-y-4">
            {addresses.map((item) => (
              <div key={item.id} className="p-5 bg-white border border-gray-200 shadow-sm rounded-[2rem] flex flex-col gap-4 group hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="font-black text-sm uppercase text-gray-900 tracking-tight">{item.label}</span>
                  </div>
                  <Button 
                    onClick={() => handleEdit(item.id, item.addr)}
                    variant="ghost" 
                    size="sm" 
                    className="text-xs font-black uppercase text-primary tracking-widest"
                  >
                    Edit
                  </Button>
                </div>
                <div className="flex items-start gap-2 text-gray-600 bg-gray-50 p-4 rounded-2xl">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <p className="text-xs font-bold leading-relaxed">{item.addr}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline" className="w-full h-16 bg-white border-2 border-dashed border-gray-200 rounded-2xl font-black uppercase text-xs tracking-[0.2em] text-gray-500 hover:bg-gray-50 hover:text-primary transition-all">
          Add New Delivery Point
        </Button>
      </main>

      {/* Edit Modal Overlay */}
      {editingId !== null && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-gray-200 p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">Edit Address</h2>
              <button onClick={() => setEditingId(null)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Full Address</label>
                <textarea
                  value={tempAddr}
                  onChange={(e) => setTempAddr(e.target.value)}
                  className="w-full min-h-[100px] bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter your address..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={() => setEditingId(null)}
                  variant="ghost" 
                  className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs bg-primary text-white hover:bg-primary/90"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}