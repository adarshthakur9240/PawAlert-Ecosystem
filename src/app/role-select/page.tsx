"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, UserCircle2, Building2, Stethoscope, Scissors, BookOpen } from "lucide-react"
import Link from "next/link"

const roles = [
  { name: "Citizen", href: "/home", icon: UserCircle2, color: "text-blue-500", bg: "bg-blue-50" },
  { name: "NGO Partner", href: "/dashboard/ngo", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
  { name: "Govt Admin", href: "/dashboard/govt", icon: Building2, color: "text-purple-500", bg: "bg-purple-50" },
  { name: "Veterinarian", href: "/pawclinic", icon: Stethoscope, color: "text-teal-500", bg: "bg-teal-50" },
  { name: "Groomer", href: "/pawgroom", icon: Scissors, color: "text-pink-500", bg: "bg-pink-50" },
  { name: "Trainer", href: "/pawcare", icon: BookOpen, color: "text-orange-500", bg: "bg-orange-50" },
]

export default function RoleSelectPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
        <div className="text-center space-y-2 mt-12 mb-10">
          <h1 className="text-2xl font-extrabold text-foreground">Choose Your Role</h1>
          <p className="text-sm text-muted-foreground font-medium">Select how you want to experience PawAlert</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {roles.map((role) => (
            <Link key={role.name} href={role.href} className="block group">
              <Card className="border-2 border-border/50 shadow-sm transition-all group-hover:border-primary/50 group-hover:shadow-md cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                  <div className={`w-14 h-14 ${role.bg} rounded-full flex items-center justify-center`}>
                    <role.icon className={`w-7 h-7 ${role.color}`} />
                  </div>
                  <span className="font-bold text-sm text-foreground">{role.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
