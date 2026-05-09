"use client"

import * as React from "react"
import { TopBar } from "@/components/layout/TopBar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Camera,
  MapPin,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Sparkles,
  LocateFixed,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { supabase } from "@/lib/supabase"

type AiAnalysis = {
  animalType: string
  condition: string
  advice: string
  urgency: "critical" | "high" | "medium" | "low"
}

type LocationState =
  | { status: "idle" }
  | { status: "detecting" }
  | { status: "detected"; lat: number; lng: number; label: string }
  | { status: "error"; message: string }

const urgencyColors: Record<string, string> = {
  critical: "bg-red-50 border-red-200 text-red-700",
  high: "bg-orange-50 border-orange-200 text-orange-700",
  medium: "bg-amber-50 border-amber-200 text-amber-700",
  low: "bg-green-50 border-green-200 text-green-700",
}

export default function NewReportPage() {
  const router = useRouter()
  const { user } = useUser()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Form state
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [animalType, setAnimalType] = React.useState("dog")
  const [urgency, setUrgency] = React.useState<"low" | "medium" | "high" | "critical">("medium")

  // Location state
  const [location, setLocation] = React.useState<LocationState>({ status: "idle" })

  // Image state
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [imageBase64, setImageBase64] = React.useState<string | null>(null)

  // AI analysis state
  const [aiAnalysis, setAiAnalysis] = React.useState<AiAnalysis | null>(null)
  const [analyzing, setAnalyzing] = React.useState(false)
  const [analyzeError, setAnalyzeError] = React.useState<string | null>(null)

  // Submission state
  const [submitting, setSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  // ── 1. AUTO-LOCATION ON MOUNT ────────────────────────────────────────────
  React.useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ status: "error", message: "Geolocation not supported by your browser." })
      return
    }

    setLocation({ status: "detecting" })

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setLocation({
          status: "detected",
          lat: latitude,
          lng: longitude,
          label: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        })
        // Prefill urgency based on any analysis that may happen
      },
      (err) => {
        setLocation({
          status: "error",
          message: "Could not detect location. Please check permissions.",
        })
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  // ── 2. IMAGE CAPTURE + PREVIEW ───────────────────────────────────────────
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    setAiAnalysis(null)
    setAnalyzeError(null)

    // Generate preview URL
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    // Convert to base64 for AI API
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const result = ev.target?.result as string
      // Strip the data URL prefix (keep only the base64 payload)
      const base64 = result.split(",")[1]
      setImageBase64(base64)

      // Auto-trigger AI analysis
      await runAiAnalysis(base64, file.type)
    }
    reader.readAsDataURL(file)
  }

  // ── 3. AI ANALYSIS (Hits your Backend Route) ─────────────────────────────
  const runAiAnalysis = async (base64: string, mimeType: string) => {
    setAnalyzing(true)
    setAnalyzeError(null)

    try {
      const res = await fetch("/api/analyze-stray", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      })

      if (!res.ok) throw new Error("Analysis failed")

      const data: AiAnalysis = await res.json()
      setAiAnalysis(data)

      // Pre-fill form fields from AI
      if (data.animalType) setAnimalType(data.animalType)
      if (data.urgency) setUrgency(data.urgency)
    } catch (err: any) {
      setAnalyzeError("AI analysis unavailable. Please fill in details manually.")
    } finally {
      setAnalyzing(false)
    }
  }

  // ── 4. FORM SUBMISSION ───────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)

    let imageUrl: string | null = null

    // Upload image to Supabase Storage if present
    if (imageFile) {
      const ext = imageFile.name.split(".").pop() || "jpg"
      const path = `reports/${user.id}/${Date.now()}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("report-images")
        .upload(path, imageFile, { upsert: false })

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from("report-images")
          .getPublicUrl(uploadData.path)
        imageUrl = urlData.publicUrl
      }
    }

    // Insert Record into Supabase DB
    const { error } = await supabase.from("reports").insert([
      {
        reporter_id: user.id,
        title: title || `Stray ${animalType} reported`,
        description:
          description ||
          (aiAnalysis ? `AI Assessment: ${aiAnalysis.advice}` : null),
        animal_type: animalType,
        urgency,
        image_url: imageUrl,
        location_lat: location.status === "detected" ? location.lat : null,
        location_lng: location.status === "detected" ? location.lng : null,
        address:
          location.status === "detected"
            ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
            : null,
        status: "pending",
      },
    ])

    setSubmitting(false)

    if (!error) {
      // ====================================================================
      // 🚀 NEW: FIRE EMAIL ALERT AFTER SUCCESSFUL SUPABASE INSERT
      // ====================================================================
      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            animalType: animalType,
            location: location.status === "detected" ? location.label : "Location Not Shared",
            urgency: urgency,
          }),
        });
        console.log("Email alert sent successfully!");
      } catch (emailErr) {
        // If email fails, we log it but DON'T stop the user from seeing the success screen
        console.error("Failed to send email alert:", emailErr);
      }
      // ====================================================================

      setSubmitted(true)
      setTimeout(() => router.push("/home"), 2500)
    } else {
      console.error("Submit error:", error.message)
      alert("Failed to submit report. Please try again.")
    }
  }

  // ── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center p-6 text-center space-y-5">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-100 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight">SOS Sent!</h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Nearby rescuers and NGOs have been alerted. Help is on the way.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <Loader2 className="w-3 h-3 animate-spin" />
          Redirecting to dashboard…
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <TopBar />

      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-black text-2xl tracking-tight leading-none">Report SOS</h1>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              AI-powered rescue alert
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── IMAGE CAPTURE ─────────────────────────────────────────────── */}
          <Card className="border-none shadow-sm overflow-hidden">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Captured"
                  className="w-full h-52 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null)
                    setImageFile(null)
                    setImageBase64(null)
                    setAiAnalysis(null)
                    setAnalyzeError(null)
                  }}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
                >
                  <XCircle className="w-5 h-5" />
                </button>
                {analyzing && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                    <p className="text-white text-xs font-bold tracking-widest uppercase">
                      AI Analyzing…
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video bg-secondary flex flex-col items-center justify-center text-muted-foreground gap-3 hover:bg-secondary/80 transition-colors"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Camera className="w-7 h-7 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-foreground">Tap to take a photo</p>
                  <p className="text-xs text-muted-foreground">
                    AI will auto-assess the animal's condition
                  </p>
                </div>
              </button>
            )}

            {/* Hidden camera input — rear camera on mobile */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageChange}
            />

            {/* ── AI ANALYSIS RESULT ──────────────────────────────────── */}
            {aiAnalysis && !analyzing && (
              <div
                className={`mx-4 mb-4 mt-3 border rounded-2xl p-4 space-y-2 ${urgencyColors[aiAnalysis.urgency] || urgencyColors.medium}`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-wider">
                    AI Assessment
                  </span>
                  <span className="ml-auto text-[10px] font-black uppercase px-2 py-0.5 bg-current/10 rounded-md border border-current/20">
                    {aiAnalysis.urgency.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-medium">{aiAnalysis.advice}</p>
                <div className="flex items-center gap-3 text-[10px] font-bold opacity-70">
                  <span>🐾 {aiAnalysis.animalType}</span>
                  <span>📊 {aiAnalysis.condition}</span>
                </div>
              </div>
            )}

            {analyzeError && !analyzing && (
              <div className="mx-4 mb-4 mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 font-medium">{analyzeError}</p>
              </div>
            )}
          </Card>

          {/* ── FORM FIELDS ──────────────────────────────────────────────── */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Short Title
                </label>
                <Input
                  placeholder="e.g., Injured dog near main gate"
                  className="rounded-xl border-2 focus-visible:ring-primary/30"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Additional Details
                </label>
                <Textarea
                  placeholder="Describe condition, exact spot, or any other helpful info…"
                  className="rounded-xl border-2 min-h-[90px] focus-visible:ring-primary/30"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Urgency
                  </label>
                  <select
                    className="w-full h-10 rounded-xl border-2 bg-background px-3 text-sm font-bold focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                  >
                    <option value="critical">🔴 Critical</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Animal Type
                  </label>
                  <Input
                    placeholder="Dog, Cat, etc."
                    className="rounded-xl border-2 focus-visible:ring-primary/30"
                    value={animalType}
                    onChange={(e) => setAnimalType(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── LOCATION CARD ─────────────────────────────────────────────── */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    location.status === "detected"
                      ? "bg-emerald-100 text-emerald-600"
                      : location.status === "detecting"
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {location.status === "detecting" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <LocateFixed className="w-5 h-5" />
                  )}
                </div>
                <div>
                  {location.status === "idle" && (
                    <p className="text-sm font-bold">Detecting location…</p>
                  )}
                  {location.status === "detecting" && (
                    <>
                      <p className="text-sm font-bold">Detecting location…</p>
                      <p className="text-[10px] text-muted-foreground">
                        Please allow location access
                      </p>
                    </>
                  )}
                  {location.status === "detected" && (
                    <>
                      <p className="text-sm font-bold text-emerald-700">
                        ✓ Location Detected
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {location.label}
                      </p>
                    </>
                  )}
                  {location.status === "error" && (
                    <>
                      <p className="text-sm font-bold text-destructive">Location Unavailable</p>
                      <p className="text-[10px] text-muted-foreground">{location.message}</p>
                    </>
                  )}
                </div>
              </div>

              {location.status === "error" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg font-bold h-8 text-xs"
                  onClick={() => {
                    setLocation({ status: "detecting" })
                    navigator.geolocation.getCurrentPosition(
                      (pos) =>
                        setLocation({
                          status: "detected",
                          lat: pos.coords.latitude,
                          lng: pos.coords.longitude,
                          label: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
                        }),
                      () =>
                        setLocation({
                          status: "error",
                          message: "Still unable to detect location.",
                        })
                    )
                  }}
                >
                  Retry
                </Button>
              )}
            </CardContent>
          </Card>

          {/* ── SUBMIT BUTTON ────────────────────────────────────────────── */}
          <Button
            type="submit"
            className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/25 gap-2"
            disabled={submitting || analyzing}
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending Alert…
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                SUBMIT ALERT
              </>
            )}
          </Button>
        </form>
      </main>
    </div>
  )
}