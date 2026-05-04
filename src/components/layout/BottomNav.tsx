"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShieldAlert, User, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const tabs = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Report", href: "/reports/new", icon: ShieldAlert, activeClass: "text-destructive", wrapperClass: "text-destructive" },
    { name: "Store", href: "/pawstore", icon: ShoppingBag },
    { name: "Profile", href: "/profile", icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-100 pb-safe">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/")
          const Icon = tab.icon

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center w-1/4 h-full transition-all active:scale-90",
                isActive ? "text-emerald-600" : "text-gray-400 hover:text-emerald-600",
                tab.wrapperClass
              )}
            >
              <div className={cn(
                "w-10 h-10 flex items-center justify-center rounded-2xl transition-all",
                isActive && "bg-emerald-50 shadow-sm"
              )}>
                <Icon className={cn("w-5 h-5", isActive && tab.activeClass)} strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest mt-1 transition-all",
                isActive ? "opacity-100 scale-100" : "opacity-40 scale-90"
              )}>
                {tab.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
