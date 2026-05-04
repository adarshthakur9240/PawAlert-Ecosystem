"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  ChevronLeft, 
  Stethoscope, 
  Syringe, 
  AlertCircle, 
  Video, 
  ChevronRight,
  Check,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Download,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Scissors,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { usePetStore, useActivePet } from "@/state/petState"
import { PetSelectorGlobal } from "@/components/shared/PetSelectorGlobal"

const VISIT_TYPES = [
  { id: "routine", label: "Routine Checkup", icon: Stethoscope, sub: "General wellness" },
  { id: "vaccination", label: "Vaccination", icon: Syringe, sub: "Booster shots" },
  { id: "emergency", label: "Emergency", icon: AlertCircle, sub: "Urgent care" },
  { id: "teleconsult", label: "Teleconsult", icon: Video, sub: "Online advice" },
]

const TIME_SLOTS = ["09:00 AM", "10:30 AM", "11:45 AM", "01:30 PM", "03:00 PM", "04:30 PM", "06:00 PM"]

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Extract URL Params
  const service = searchParams.get('service')
  const docName = searchParams.get('docName')
  const docFee = parseInt(searchParams.get('fee') || "500")
  const docSpecialty = searchParams.get('specialty')
  const visitTypeParam = searchParams.get('visitType')
  const bookingReason = searchParams.get('reason')

  // Global Pet State
  const { pets, activePetId, setActivePet } = usePetStore()
  const activePet = useActivePet()
  const selectedPet = activePetId ?? pets[0]?.id

  const isTraining = service === 'Training'
  const isGrooming = service === 'Grooming'

  // Dynamic Theme Colors
  const themeHex = isGrooming ? '#DB2777' : isTraining ? '#9333EA' : '#059669'
  const serviceTheme = isGrooming ? 'pink' as const : isTraining ? 'purple' as const : 'emerald' as const
  
  // Tailwind class mappings
  const themeBg = isGrooming ? 'bg-pink-50' : isTraining ? 'bg-purple-50' : 'bg-emerald-50'
  const themeText = isGrooming ? 'text-pink-600' : isTraining ? 'text-purple-600' : 'text-emerald-600'
  const themeBorder = isGrooming ? 'border-pink-500' : isTraining ? 'border-purple-500' : 'border-emerald-600'
  const themeButton = isGrooming ? 'bg-pink-600 hover:bg-pink-700' : isTraining ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'
  const themeShadow = isGrooming ? 'shadow-pink-600/20' : isTraining ? 'shadow-purple-600/20' : 'shadow-emerald-600/20'

  // State
  const [bookingStep, setBookingStep] = React.useState<'select' | 'payment' | 'success'>('select')
  const [selectedType, setSelectedType] = React.useState(visitTypeParam === 'Vaccination' ? "vaccination" : "routine")
  const [selectedDate, setSelectedDate] = React.useState(new Date().getDate().toString())
  const [selectedSlot, setSelectedSlot] = React.useState("10:30 AM")
  const [isLoading, setIsLoading] = React.useState(false)

  
  // Dynamic Calendar Logic
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const monthName = now.toLocaleString('default', { month: 'long' })
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  
  const bookingId = (isGrooming ? "PG-" : isTraining ? "PT-" : "PC-") + Math.random().toString(36).substr(2, 9).toUpperCase()

  const handleDownloadInvoice = () => {
    const invoiceContent = `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;900&display=swap');
            body { font-family: 'Poppins', sans-serif; padding: 40px; color: #1A1A1A; line-height: 1.6; }
            .header { border-bottom: 4px solid ${themeHex}; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: 900; color: ${themeHex}; text-transform: uppercase; }
            .details { margin-bottom: 30px; }
            .item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: 600; color: #666; }
            .value { font-weight: 900; }
            .total { font-size: 22px; font-weight: 900; margin-top: 30px; text-align: right; color: ${themeHex}; }
            .footer { margin-top: 50px; font-size: 11px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${isGrooming ? 'PAWGROOM INVOICE' : isTraining ? 'PAWCARE TRAINING INVOICE' : 'PAWCLINIC INVOICE'}</div>
            <p style="font-weight: 900; font-size: 12px;">Booking ID: ${bookingId}</p>
          </div>
          <div class="details">
            <div class="item"><span class="label">Patient Name</span><span class="value">${activePet?.name ?? 'N/A'}</span></div>
            <div class="item"><span class="label">Service Category</span><span class="value">${isGrooming ? 'Pet Grooming' : isTraining ? 'Professional Training' : 'Veterinary Care'}</span></div>
            <div class="item"><span class="label">${isTraining ? 'Trainer' : 'Specialist'}</span><span class="value">${docName || bookingReason || VISIT_TYPES.find(t => t.id === selectedType)?.label}</span></div>
            <div class="item"><span class="label">Appointment</span><span class="value">${selectedDate} ${monthName}, ${selectedSlot}</span></div>
            <div class="item"><span class="label">Base Fee</span><span class="value">₹${docFee * 2}</span></div>
            <div class="item"><span class="label">App Discount</span><span class="value" style="color: #059669;">-₹${docFee}</span></div>
            <div class="item"><span class="label">GST (18%)</span><span class="value">₹${Math.round(docFee * 0.18)}</span></div>
          </div>
          <div class="total">Total Amount Paid: ₹${Math.round(docFee * 1.18)}</div>
          <div class="footer">
            Thank you for choosing PawAlert Ecosystem for your pet's needs.
            <br/>This is a computer-generated invoice and requires no signature.
          </div>
          <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 500); }</script>
        </body>
      </html>
    `
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(invoiceContent)
      printWindow.document.close()
    }
  }

  const handlePayment = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setBookingStep('success')
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans pb-32">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => bookingStep === 'select' ? router.back() : setBookingStep('select')}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform",
              themeBg, themeText
            )}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black tracking-tight text-[#1A1A1A]">
            {bookingStep === 'select' 
              ? (isTraining ? 'Book Training Session' : isGrooming ? 'Book Grooming' : 'Book Appointment') 
              : (bookingStep === 'payment' ? 'Payment' : 'Success')}
          </h1>
        </div>
        {bookingStep === 'success' && (
          <Badge className={cn(
            "font-black border-none px-3",
            themeBg, themeText
          )}>CONFIRMED</Badge>
        )}
      </div>

      <AnimatePresence mode="wait">
        {bookingStep === 'select' && (
          <motion.main 
            key="select"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 space-y-8"
          >
            {/* Dynamic Banner */}
            {(docName || bookingReason || isGrooming || isTraining) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "bg-white border-2 rounded-[32px] p-6 shadow-sm flex items-center gap-4 relative overflow-hidden",
                  themeBorder
                )}
              >
                <div className="absolute top-0 right-0 p-2 opacity-5">
                  {isTraining ? <Award className={cn("w-20 h-20 rotate-12", themeText)} /> : isGrooming ? <Scissors className={cn("w-20 h-20 rotate-12", themeText)} /> : docName ? <Stethoscope className={cn("w-20 h-20 rotate-12", themeText)} /> : <Syringe className={cn("w-20 h-20 rotate-12", themeText)} />}
                </div>
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0",
                  themeBg, themeText
                )}>
                  <div className="font-black text-2xl">
                    {isTraining ? 'T' : isGrooming ? 'G' : docName ? docName.charAt(0) : bookingReason?.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-[#1A1A1A] leading-tight">{docName || bookingReason || (isTraining ? "Training Specialist" : "Grooming Specialist")}</h3>
                    <CheckCircle2 className={cn("w-4 h-4 fill-current opacity-20", themeText)} />
                  </div>
                  <p className={cn("text-[10px] font-black uppercase tracking-widest", themeText)}>
                    {isTraining ? 'Certified Trainer' : isGrooming ? 'Grooming Expert' : docSpecialty || "Specialist"}
                  </p>
                  {(isGrooming || isTraining) && docSpecialty && (
                    <p className="text-[10px] font-bold text-gray-400 mt-1 line-clamp-1">{docSpecialty}</p>
                  )}
                </div>
                <Badge className={cn("text-white font-black px-3", themeButton.split(' ')[0])}>SELECTED</Badge>
              </motion.div>
            )}

            {/* Step 1: Select Pet – powered by Global State */}
            <div className="space-y-4">
              <h3 className="font-black text-lg text-[#1A1A1A] px-1">1. Select Pet</h3>
              <PetSelectorGlobal theme={serviceTheme} onPetChange={(pet) => setActivePet(pet.id)} />
            </div>


            {/* Step 2: Visit Type (Hidden for Grooming/Training/Specific Docs) */}
            {!(docName || bookingReason || isGrooming || isTraining) && (
              <div className="space-y-4">
                <h3 className="font-black text-lg text-[#1A1A1A] px-1">2. Visit Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  {VISIT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={cn(
                        "p-4 rounded-3xl border-2 text-left transition-all active:scale-95",
                        selectedType === type.id 
                          ? "border-emerald-600 bg-emerald-50" 
                          : "border-transparent bg-white shadow-sm"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center mb-3",
                        selectedType === type.id ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-600"
                      )}>
                        <type.icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-black text-sm text-[#1A1A1A]">{type.label}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{type.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Dynamic Calendar */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-black text-lg text-[#1A1A1A] px-1 flex items-center justify-between">
                  {(docName || bookingReason || isGrooming || isTraining) ? '2. Select Slot' : '3. Select Slot'}
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" /> {monthName} {currentYear}
                  </span>
                </h3>
                
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                      <div key={d} className="text-center text-[10px] font-black text-gray-300 uppercase tracking-tighter">
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(firstDayOfMonth)].map((_, i) => (
                      <div key={`empty-${i}`} className="h-10" />
                    ))}
                    {[...Array(daysInMonth)].map((_, i) => {
                      const date = (i + 1).toString()
                      const isSelected = selectedDate === date
                      return (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={cn(
                            "h-10 w-full rounded-xl flex items-center justify-center text-sm transition-all active:scale-90",
                            isSelected 
                              ? cn("text-white font-black shadow-lg", themeButton, isGrooming ? 'shadow-pink-600/20' : isTraining ? 'shadow-purple-600/20' : 'shadow-emerald-600/20') 
                              : "text-[#1A1A1A] font-bold hover:bg-emerald-50 hover:text-emerald-600"
                          )}
                        >
                          {date}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "py-3 px-1 rounded-2xl border-2 text-[11px] font-black transition-all active:scale-95",
                      selectedSlot === slot 
                        ? cn(themeBorder, themeBg, themeText) 
                        : "border-transparent bg-white text-gray-500 shadow-sm"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </motion.main>
        )}

        {bookingStep === 'payment' && (
          <motion.main 
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 space-y-8"
          >
            <div className="space-y-6">
              <h3 className="font-black text-xl text-[#1A1A1A]">Bill Summary</h3>
              <Card className="border-none bg-white rounded-[32px] shadow-sm overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-400">{isTraining ? 'Training Fee' : isGrooming ? 'Grooming Fee' : 'Consultation Fee'}</span>
                    <span className="font-black text-[#1A1A1A]">₹{docFee * 2}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-400">Discount (50% OFF)</span>
                    <span className={cn("font-black", themeText)}>-₹{docFee}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-400">Service Tax (GST)</span>
                    <span className="font-black text-[#1A1A1A]">₹{Math.round(docFee * 0.18)}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-lg font-black text-[#1A1A1A]">Total Payable</span>
                    <span className={cn("text-2xl font-black", themeText)}>₹{Math.round(docFee * 1.18)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <h3 className="font-black text-xl text-[#1A1A1A]">Payment Method</h3>
              <div className="space-y-3">
                <button className={cn(
                  "w-full p-5 rounded-3xl bg-white border-2 flex items-center gap-4 shadow-sm",
                  themeBorder
                )}>
                  <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", themeBg, themeText)}>
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-black text-[#1A1A1A]">UPI / Google Pay</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Instant & Secure</p>
                  </div>
                  <div className={cn("w-6 h-6 rounded-full border-4 bg-white", themeBorder)} />
                </button>
                <button className="w-full p-5 rounded-3xl bg-white border-2 border-transparent flex items-center gap-4 shadow-sm opacity-30 cursor-not-allowed">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-black text-gray-400">Debit / Credit Card</p>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Unavailable</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-gray-200" />
                </button>
              </div>
            </div>
            
            <div className={cn("p-4 rounded-3xl flex gap-3 border", themeBg, isGrooming ? 'border-pink-100' : isTraining ? 'border-purple-100' : 'border-emerald-100')}>
              <ShieldCheck className={cn("w-6 h-6 shrink-0", themeText)} />
              <p className={cn("text-[11px] font-semibold leading-relaxed", isGrooming ? 'text-pink-800' : isTraining ? 'text-purple-800' : 'text-emerald-800')}>
                Your transaction is protected by PawSecure™ end-to-end encryption.
              </p>
            </div>
          </motion.main>
        )}

        {bookingStep === 'success' && (
          <motion.main 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8"
          >
            <div className="relative">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className={cn("w-24 h-24 rounded-full flex items-center justify-center", themeBg)}
              >
                <CheckCircle2 className={cn("w-16 h-16", themeText)} />
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={cn("absolute inset-0 rounded-full", isGrooming ? 'bg-pink-400/20' : isTraining ? 'bg-purple-400/20' : 'bg-emerald-400/20')}
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-[#1A1A1A]">Confirmed!</h2>
              <p className="text-gray-500 font-semibold px-4">
                Booking for <span className="text-[#1A1A1A] font-black">{activePet?.name}</span> is successful.
              </p>
            </div>

            <div className="w-full bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Booking ID</span>
                <span className="text-xs font-black text-[#1A1A1A]">{bookingId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date & Time</span>
                <span className="text-xs font-black text-[#1A1A1A]">{selectedDate} {monthName}, {selectedSlot}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Service</span>
                <span className={cn("text-xs font-black", themeText)}>{docName || bookingReason || (isTraining ? "Professional Training" : "General Consultation")}</span>
              </div>
            </div>

            <div className="w-full space-y-3">
              <Button 
                onClick={handleDownloadInvoice}
                variant="outline" 
                className={cn(
                  "w-full h-14 rounded-2xl font-black flex items-center justify-center gap-2",
                  themeBorder, themeText, "hover:" + themeBg
                )}
              >
                <Download className="w-5 h-5" /> Download Invoice
              </Button>
              <Button 
                onClick={() => router.push(isGrooming ? '/pawgroom' : isTraining ? '/pawcare' : '/pawclinic')}
                className={cn(
                  "w-full h-14 rounded-2xl text-white font-black shadow-lg",
                  themeButton, themeShadow
                )}
              >
                Go to Dashboard
              </Button>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Sticky Bottom Bar */}
      {bookingStep !== 'success' && (
        <div className="fixed bottom-[72px] left-0 right-0 bg-white border-t border-gray-100 p-4 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
          <div className="max-w-md mx-auto flex items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <del className="text-xs font-bold text-gray-300">₹{docFee * 2}</del>
                <Badge className={cn("border-none text-[8px] font-black h-4 px-1.5", themeBg, themeText)}>50% OFF</Badge>
              </div>
              <p className="text-2xl font-black text-[#1A1A1A]">₹{docFee}</p>
            </div>
            <Button 
              disabled={isLoading}
              onClick={() => bookingStep === 'select' ? setBookingStep('payment') : handlePayment()}
              className={cn(
                "text-white rounded-2xl h-14 px-8 font-black text-lg shadow-xl flex-grow group",
                themeButton, themeShadow
              )}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  {bookingStep === 'select' ? 'Confirm Booking' : 'Pay Securely'}
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BookAppointmentPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin stroke-[1.5]" />
        <div className="mt-6 text-center space-y-1">
          <p className="text-lg font-black text-slate-800">Initializing PawAlert...</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sniffing out your dashboard...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </React.Suspense>
  )
}
