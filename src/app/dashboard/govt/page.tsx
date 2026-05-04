"use client"

import * as React from "react"
import { TopBar } from "@/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, BarChart3, Users, Building2, Map } from "lucide-react"

export default function GovtDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h1 className="font-bold text-lg">Govt Oversight</h1>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Admin</Badge>
      </div>
      
      <main className="flex-1 p-4 space-y-6">
        {/* Analytics Summary */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">City-Wide Analytics</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-none shadow-sm">
              <CardContent className="p-4 flex flex-col gap-1">
                <BarChart3 className="w-5 h-5 text-blue-500 mb-1" />
                <h4 className="font-extrabold text-2xl text-foreground">1,245</h4>
                <p className="text-[10px] text-muted-foreground font-bold uppercase">Total Reports (30d)</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-4 flex flex-col gap-1">
                <ShieldCheck className="w-5 h-5 text-emerald-500 mb-1" />
                <h4 className="font-extrabold text-2xl text-foreground">89%</h4>
                <p className="text-[10px] text-muted-foreground font-bold uppercase">Resolution Rate</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Heatmap Placeholder */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-secondary/30 p-4 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Map className="w-4 h-4 text-primary" /> Incident Heatmap
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-48 bg-emerald-50 relative flex items-center justify-center">
              <span className="text-sm font-medium text-emerald-700">Interactive Map Visualization</span>
              {/* Mock hotspots */}
              <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full bg-destructive/30 animate-pulse" />
              <div className="absolute top-1/2 right-1/4 w-12 h-12 rounded-full bg-orange-500/30 animate-pulse" />
              <div className="absolute bottom-1/4 left-1/2 w-6 h-6 rounded-full bg-yellow-500/30 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* NGO Performance */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">NGO Partner Status</h3>
          <Card className="border-none shadow-sm">
            <CardContent className="p-0 divide-y divide-border/50">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">P</div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Paws Rescue</h4>
                    <p className="text-xs text-muted-foreground">42 active cases</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Compliant</Badge>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">H</div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Hope Shelter</h4>
                    <p className="text-xs text-muted-foreground">15 active cases</p>
                  </div>
                </div>
                <Badge variant="secondary">Review Pending</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
