"use client"

import * as React from "react"
import { TopBar } from "@/components/layout/TopBar"
import { 
  UserCircle2, 
  MapPin, 
  CreditCard, 
  Bell, 
  Lock, 
  Gift, 
  HelpCircle, 
  FileText,
  ChevronRight,
  Award,
  LogOut
} from "lucide-react"
import { useUser, SignOutButton } from "@clerk/nextjs"
import Link from "next/link"

const menuItems = [
  {
    title: "PROFILE INFORMATION",
    subtitle: "UPDATE YOUR NAME AND CONTACT DETAILS",
    icon: UserCircle2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/profile/information",
  },
  {
    title: "SAVED ADDRESSES",
    subtitle: "MANAGE YOUR HOME AND OFFICE ADDRESSES",
    icon: MapPin,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/profile/addresses",
  },
  {
    title: "PAYMENT METHODS",
    subtitle: "MANAGE CARDS, UPI AND WALLETS",
    icon: CreditCard,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    href: "/profile/payments",
  },
  {
    title: "NOTIFICATIONS",
    subtitle: "CONTROL YOUR ALERTS AND REMINDERS",
    icon: Bell,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    href: "/profile/notifications",
  },
  {
    title: "PRIVACY & SECURITY",
    subtitle: "PASSWORD, 2FA AND DATA PRIVACY",
    icon: Lock,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    href: "/profile/security",
  },
  {
    title: "REWARDS & GIFT CARDS",
    subtitle: "VIEW KARMA POINTS AND REDEEM GIFTS",
    icon: Gift,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    href: "/profile/rewards",
  },
  {
    title: "HELP & SUPPORT",
    subtitle: "FAQS, CONTACT US AND LIVE CHAT",
    icon: HelpCircle,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    href: "/profile/support",
  },
  {
    title: "LEGAL & ABOUT",
    subtitle: "TERMS, PRIVACY POLICY AND APP VERSION",
    icon: FileText,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    href: "/profile/legal",
  },
]

import { usePetStore } from "@/state/petState"

export default function ProfilePage() {
  const { user } = useUser()
  const [mounted, setMounted] = React.useState(false)
  const { recentOrders } = usePetStore()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <TopBar />
      
      <main className="flex-1 p-4 space-y-8 max-w-4xl mx-auto w-full">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className="relative group">
            <div className="w-28 h-28 rounded-[2.5rem] bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-primary uppercase">
                  {user?.firstName?.[0] || user?.username?.[0] || "P"}
                </span>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-2xl shadow-lg border-4 border-white">
              <Award className="w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight uppercase text-gray-900">
              {user?.fullName || "Sarah Connor"}
            </h1>
            <p className="text-sm text-gray-600 font-bold tracking-widest uppercase">
              {user?.primaryEmailAddress?.emailAddress || "Citizen Rescuer"}
            </p>
          </div>
        </div>

        {/* Recent Orders Section */}
        {recentOrders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xs font-black tracking-[0.2em] text-gray-500 uppercase px-2">
              Recent PawStore Orders
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {recentOrders.map((order) => (
                <div 
                  key={order.id}
                  className="shrink-0 w-64 bg-white border border-gray-200 rounded-3xl p-4 shadow-sm space-y-3"
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                      <img src={order.image} alt={order.items} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <h4 className="text-xs font-black text-gray-900 line-clamp-1 uppercase">
                        {order.items}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400">{order.date}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Paid</span>
                    <span className="text-xs font-black text-orange-600">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Grid */}
        <div className="space-y-4">
          <h2 className="text-xs font-black tracking-[0.2em] text-gray-500 uppercase px-2">
            My Activity & Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <button
                  className="group w-full flex items-center justify-between p-5 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 rounded-[2rem] transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-black text-gray-900 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-500 tracking-wide uppercase">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-4 px-2">
          <SignOutButton>
            <button className="w-full p-5 flex items-center justify-center gap-3 bg-red-50 text-red-600 rounded-[2rem] border border-red-100 hover:bg-red-500 hover:text-white transition-all duration-300 font-black tracking-widest uppercase text-sm">
              <LogOut className="w-5 h-5" />
              Log Out Session
            </button>
          </SignOutButton>
        </div>
      </main>
    </div>
  )
}