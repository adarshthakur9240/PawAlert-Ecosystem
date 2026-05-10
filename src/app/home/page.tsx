"use client"

import * as React from "react"
import { TopBar } from "@/components/layout/TopBar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { 
  ShoppingBag, 
  Stethoscope, 
  Scissors, 
  BookOpen, 
  Heart, 
  AlertTriangle, 
  Map as MapIcon, 
  Trophy, 
  Zap,
  ChevronRight,
  Plus,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { db, Profile, Report } from "@/lib/database"
import LiveRescueMap from "@/components/map/DynamicMap"

const apps = [
  { name: "PawStore", icon: ShoppingBag, color: "bg-blue-50 text-blue-600", href: "/pawstore" },
  { name: "PawClinic", icon: Stethoscope, color: "bg-emerald-50 text-emerald-600", href: "/pawclinic" },
  { name: "PawGroom", icon: Scissors, color: "bg-pink-50 text-pink-600", href: "/pawgroom" },
  { name: "PawCare", icon: BookOpen, color: "bg-purple-50 text-purple-600", href: "/pawcare" },
  { name: "PawAdopt", icon: Heart, color: "bg-orange-50 text-orange-600", href: "/pawadopt" },
]

const quickSupplies = [
  { name: "Adult Dog Food", brand: "Pedigree", price: "₹750", image: "/supplies/food.jpg" },
  { name: "First Aid Kit", brand: "PawSafe", price: "₹450", image: "/supplies/kit.jpg" },
  { name: "Flea Treatment", brand: "SpotOn", price: "₹299", image: "/supplies/flea.jpg" },
]

export default function HomePage() {
  const { user, isLoaded } = useUser()
  const [profile, setProfile] = React.useState<Profile | null>(null)
  const [reports, setReports] = React.useState<Report[]>([])
  const [loading, setLoading] = React.useState(true)
  
  // Certificate Logic States
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // --- 🚀 NEW DYNAMIC KARMA & STREAK ENGINE ---
  // 1. Filter reports belonging to the current user for certificate
  const myReports = reports.filter(r => r.reporter_id === user?.id);
  const rescuedCount = myReports.length;

  // 2. Fetch direct Karma from DB
  const currentKarma = profile?.karma_points || 0;
  const calculatedLevel = Math.floor(currentKarma / 100) + 1;

  // 3. Calculate Streak Logic (Checking if broken)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastReportStr = profile?.last_report_date;
  const lastReport = lastReportStr ? new Date(lastReportStr) : null;
  if (lastReport) lastReport.setHours(0, 0, 0, 0);

  // Agar last report kal se bhi purani hai, matlab streak toot chuki hai
  const isStreakBroken = lastReport 
    ? Math.floor((today.getTime() - lastReport.getTime()) / (1000 * 60 * 60 * 24)) > 1
    : false;

  const displayStreak = isStreakBroken ? 0 : (profile?.current_streak || 0);
  const maxStreak = profile?.max_streak || 0;
  // ---------------------------------------------

  React.useEffect(() => {
    async function fetchData() {
      if (isLoaded && user) {
        const [profileRes, reportsRes] = await Promise.all([
          db.profiles.get(user.id),
          db.reports.getAll()
        ])
        
        if (profileRes.data) setProfile(profileRes.data)
        if (reportsRes.data) setReports(reportsRes.data as any)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [isLoaded, user])

  // Download Handler
  const downloadCertificate = async () => {
    if (isDownloading) return;
    
    const loadingToast = toast.loading("Generating your Official Recognition...");
    setIsDownloading(true);

    try {
      const el = certificateRef.current;
      if (!el) return;

      // Position temporarily for capture
      el.style.left = "0px";
      el.style.position = "fixed";
      el.style.top = "0px";
      el.style.zIndex = "99999";

      // Wait for components and images to render
      await new Promise((r) => setTimeout(r, 1000));

      const dataUrl = await toPng(el, {
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        cacheBust: true, // For images to load properly
      });

      const pdf = new jsPDF("l", "mm", "a4");
      pdf.addImage(dataUrl, "PNG", 0, 0, 297, 210);
      pdf.save(`Official_Certificate_${user?.fullName?.replace(/\s+/g, "_") || "Rescuer"}.pdf`);

      toast.success("Certificate Secured! 🇮🇳", { id: loadingToast });
    } catch (err) {
      console.error("PDF Generation Error:", err);
      toast.error("Download failed! Check console.", { id: loadingToast });
    } finally {
      // Wapas hide kar do
      if (certificateRef.current) {
        certificateRef.current.style.left = "-9999px";
        certificateRef.current.style.position = "absolute";
      }
      setIsDownloading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-white z-[100]">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin stroke-[1.5]" />
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black tracking-tight text-slate-800">Initializing PawAlert...</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Sniffing out your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopBar />
      
      <main className="flex-1 p-4 space-y-6 pb-24">
        {/* User Gamification / Karma Card */}
        <section>
          <Card className="border-none bg-gradient-to-r from-[#b33918] to-[#e55934] text-white shadow-2xl overflow-hidden relative rounded-[2.5rem]">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Trophy className="w-24 h-24 rotate-12" />
            </div>
            <CardContent className="p-6 flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-none hover:bg-white/30 font-black uppercase tracking-widest text-[10px]">
                    LVL {calculatedLevel}
                  </Badge>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{profile?.role || 'Citizen'} Rescuer</span>
                </div>
                <h3 className="text-3xl font-black italic tracking-tighter">{currentKarma} Karma</h3>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
                  {displayStreak > 0 ? (
                    <span>{displayStreak} DAY RESCUE STREAK</span>
                  ) : (
                    <span>MAX STREAK: {maxStreak} DAYS</span>
                  )}
                </div>
              </div>
              
              {/* Clickable Icon Wrapper */}
              <Button 
                size="icon" 
                variant="secondary" 
                onClick={downloadCertificate}
                disabled={isDownloading}
                className="rounded-2xl w-12 h-12 bg-white/20 hover:bg-white/30 text-white border-none shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer"
              >
                {isDownloading ? (
                   <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <ChevronRight className="w-6 h-6" />
                )}
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Live Rescues Map */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-black text-lg uppercase tracking-tight">Live Rescues Nearby</h2>
            <Link href="/map" className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-1">
              Fullscreen <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="relative rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl z-0" style={{ isolation: 'isolate' }}>
            <LiveRescueMap height="280px" />
          </div>
        </section>

        {/* Emergency Rescue CTA */}
        <section className="bg-red-950/30 border border-red-900/50 rounded-[2rem] p-5 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-600/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-black text-red-500 uppercase tracking-tight italic">Emergency Rescue</h3>
              <p className="text-[10px] text-red-400/70 font-bold uppercase tracking-widest">Report injured animals now</p>
            </div>
          </div>
          <Link href="/reports/new">
            <Button className="bg-red-600 hover:bg-red-700 text-white border-none px-5 h-11 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-600/20">
              REPORT
            </Button>
          </Link>
        </section>

        {/* Mini-App Switcher */}
        <div className="space-y-4">
          <h2 className="font-extrabold text-xl">Services</h2>
          <div className="grid grid-cols-2 gap-4">
            {apps.map((app) => (
              <Link key={app.name} href={app.href} className="block">
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${app.color}`}>
                      <app.icon className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm text-foreground">{app.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* ✅ PREMIUM OFFICIAL INDIAN CERTIFICATE FOR CAPTURE (SEAL REMOVED) */}
      <div
        ref={certificateRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "1123px",
          height: "794px",
          backgroundColor: "#ffffff",
          padding: "25px", 
          boxSizing: "border-box",
          fontFamily: "'Georgia', 'Times New Roman', serif", 
          overflow: "hidden"
        }}
      >
        {/* Top Tiranga (Tri-color) Accent Line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '8px',
          background: 'linear-gradient(to right, #FF9933 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #138808 66.6%)'
        }} />

        {/* Outer Dark Gold Border */}
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "2px solid #B8860B",
            padding: "6px",
            boxSizing: "border-box",
            position: "relative"
          }}
        >
          
          {/* Subtle Background Watermark Text */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)',
            fontSize: '100px', color: 'rgba(0,0,0,0.03)', whiteSpace: 'nowrap', fontWeight: 900, pointerEvents: 'none', zIndex: 1
          }}>
            GOVERNMENT OF INDIA
          </div>

          {/* Inner Thick Double Border */}
          <div
            style={{
              width: "100%",
              height: "100%",
              border: "8px double #B8860B", 
              backgroundColor: "#ffffff", 
              padding: "30px 50px", 
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              position: "relative",
              zIndex: 2
            }}
          >
            {/* 1. Header (QR & Emblem) */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div style={{ textAlign: "center", border: "1px solid #ddd", padding: "8px", borderRadius: "8px", backgroundColor: "#fafafa" }}>
                <QRCodeSVG value={`https://pawalert.in/verify/${user?.id || "preview"}`} size={85} level="H" includeMargin={false} />
                <p style={{ fontSize: "10px", fontWeight: 900, color: "#138808", marginTop: "8px", margin: 0, letterSpacing: "1px" }}>VERIFIED</p>
              </div>
              
              <div style={{ textAlign: "right" }}>
                <img src="/ashok.png" crossOrigin="anonymous" style={{ width: "55px", marginLeft: "auto", display: "block", marginBottom: "2px" }} alt="Emblem" />
                <p style={{ fontSize: "12px", fontWeight: "bold", margin: "0 0 2px 0", color: "#D4762A" }}>सत्यमेव जयते</p>
                <p style={{ fontSize: "15px", fontWeight: 900, margin: 0, color: "#000000", letterSpacing: "1px" }}>MINISTRY OF CULTURE</p>
                <p style={{ fontSize: "12px", margin: 0, color: "#555", fontWeight: "bold" }}>GOVERNMENT OF INDIA</p>
              </div>
            </div>

            {/* 2. Main Title */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <h1 style={{ fontSize: "75px", fontWeight: 900, margin: "0", lineHeight: 1, color: "#000000" }}>CERTIFICATE</h1>
              <h3 style={{ fontSize: "20px", letterSpacing: "12px", color: "#B8860B", margin: "10px 0 25px", fontWeight: "bold" }}>OF APPRECIATION</h3>
              <p style={{ fontSize: "16px", color: "#555", fontStyle: "italic", margin: 0 }}>PROUDLY PRESENTED TO</p>
              
              <h2 style={{ fontSize: "65px", fontStyle: "italic", color: "#FF9933", borderBottom: "3px solid #138808", display: "inline-block", padding: "0 50px 5px", margin: "10px 0" }}>
                {user?.fullName || "Citizen Rescuer"}
              </h2>
              
              <p style={{ fontSize: "16px", lineHeight: 1.8, maxWidth: "800px", margin: "10px auto 0", textTransform: "uppercase", fontWeight: 600, color: "#222" }}>
                For successfully rescuing <b style={{fontSize: "18px", color: "#FF9933"}}>{rescuedCount} stray animals</b> through <b style={{ color: "#000", fontSize: "18px" }}>PawAlert</b>.<br />
                An exemplary contribution to making <b style={{color: "#138808", fontSize: "18px"}}>India</b> safer for every living being.
              </p>
            </div>

            {/* 3. Footer (Signature Only) */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", marginTop: "auto" }}>
              {/* Signature (Right Side) */}
              <div style={{ textAlign: "center", width: "240px" }}>
                <p style={{ fontSize: "14px", margin: "0 0 5px", textAlign: "left", color: "#000", paddingLeft: "15px" }}>Founder,</p>
                <img src="/adarsh_sign-removebg-preview.png" crossOrigin="anonymous" alt="Signature" style={{ width: "160px", height: "55px", objectFit: "contain", display: "block", margin: "0 auto" }} />
                <div style={{ height: "2px", backgroundColor: "#000000", width: "100%", margin: "5px 0" }} />
                <p style={{ fontSize: "16px", fontWeight: 900, color: "#000", margin: 0 }}>Adarsh Thakur</p>
                <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>Authorized Signatory, PawAlert</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}