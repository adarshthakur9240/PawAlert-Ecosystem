"use client"

import * as React from "react"
import { TopBar } from "@/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, CheckCircle2, ChevronRight, UserCircle2 } from "lucide-react"

const reports = [
  {
    id: "REP-9821",
    species: "Dog (Indie)",
    urgency: "High",
    status: "Pending Rescue",
    location: "12th Main, Indiranagar",
    time: "10 mins ago",
    assignedTo: null,
  },
  {
    id: "REP-9820",
    species: "Cat",
    urgency: "Medium",
    status: "In Transit",
    location: "Koramangala 4th Block",
    time: "45 mins ago",
    assignedTo: "Raj (Volunteer)",
  },
]

export default function NGODashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 p-4 flex items-center justify-between">
        <h1 className="font-bold text-lg">NGO Portal</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Active</Badge>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <UserCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>
      
      <main className="flex-1 p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-none shadow-sm bg-destructive/10">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <h4 className="font-extrabold text-3xl text-destructive">5</h4>
              <p className="text-[10px] text-destructive/80 font-bold uppercase mt-1">Pending Rescues</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-orange-50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <h4 className="font-extrabold text-3xl text-orange-600">12</h4>
              <p className="text-[10px] text-orange-800 font-bold uppercase mt-1">Active Cases</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Required */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Live Rescue Feed</h3>
            <span className="text-xs font-semibold text-primary">View Map</span>
          </div>
          
          <div className="space-y-3">
            {reports.map((report) => (
              <Card key={report.id} className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {report.urgency === "High" ? (
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        ) : (
                          <Clock className="w-5 h-5 text-orange-500" />
                        )}
                        <h4 className="font-bold text-base text-foreground">{report.id}</h4>
                      </div>
                      <Badge variant="secondary" className={`text-[10px] font-bold ${report.status === 'Pending Rescue' ? 'bg-destructive/10 text-destructive' : 'bg-orange-100 text-orange-700'}`}>
                        {report.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{report.species}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{report.location}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs font-medium">
                      <span className="text-muted-foreground">{report.time}</span>
                      {report.assignedTo ? (
                        <span className="text-primary flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {report.assignedTo}
                        </span>
                      ) : (
                        <Button size="sm" className="h-7 text-xs rounded px-3">Assign Team</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Audit / Logs Placeholder */}
        <Card className="border border-border/50 shadow-none bg-transparent">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Recent Audit Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-foreground">Status changed to Rescued (REP-9819)</span>
              <span className="text-muted-foreground">1hr ago</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-foreground">Shelter transfer approved (Luna)</span>
              <span className="text-muted-foreground">2hrs ago</span>
            </div>
            <Button variant="link" className="px-0 h-auto text-xs font-bold text-primary w-full text-left justify-start">View Full Audit Trail</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
