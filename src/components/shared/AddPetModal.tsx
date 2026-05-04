"use client"

import * as React from "react"
import { Camera, Loader2, Check, X, CheckCircle2, ArrowRight, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePetStore, Pet } from "@/state/petState"
import { motion, AnimatePresence } from "framer-motion"

const MOCK_AI_RESULTS: Record<string, { breed: string; type: Pet['type']; dob: string }> = {
  default: { breed: 'Golden Retriever', type: 'Dog', dob: '2023-06-15' }
}

interface AddPetModalProps {
  isOpen: boolean
  onClose: () => void
  editPet?: Pet | null
  accentColor?: 'emerald' | 'pink' | 'violet' | 'purple' | 'orange'
  prefillPhotoUrl?: string
  prefillData?: Partial<Pet>
}

type AddStep = 'capture' | 'scanning' | 'form'

export function AddPetModal({ isOpen, onClose, editPet, accentColor = 'emerald', prefillPhotoUrl, prefillData }: AddPetModalProps) {
  const { addPet, updatePet } = usePetStore()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [step, setStep] = React.useState<AddStep>(editPet ? 'form' : 'capture')
  const [previewUrl, setPreviewUrl] = React.useState<string>(editPet?.photoUrl ?? '')
  const [form, setForm] = React.useState({
    name: editPet?.name ?? '',
    breed: editPet?.breed ?? '',
    type: editPet?.type ?? 'Dog' as Pet['type'],
    dob: editPet?.dob ?? '',
    gender: editPet?.gender ?? 'Male' as Pet['gender'],
    weight: editPet?.weight ?? ''
  })

  // Reset when modal opens fresh
  React.useEffect(() => {
    if (isOpen) {
      if (editPet) {
        setStep('form')
        setPreviewUrl(editPet.photoUrl)
        setForm({
          name: editPet.name,
          breed: editPet.breed,
          type: editPet.type,
          dob: editPet.dob,
          gender: editPet.gender,
          weight: editPet.weight
        })
      } else if (prefillPhotoUrl) {
        setPreviewUrl(prefillPhotoUrl)
        setStep('scanning')
        // Simulate AI scan for prefilled pet
        setTimeout(() => {
          setForm(f => ({
            ...f,
            breed: prefillData?.breed ?? 'Mixed Breed',
            type: prefillData?.type ?? 'Dog',
            dob: prefillData?.dob ?? '2023-01-01',
            gender: prefillData?.gender ?? 'Male'
          }))
          setStep('form')
        }, 3000)
      } else {
        setStep('capture')
        setPreviewUrl('')
        setForm({ name: '', breed: '', type: 'Dog', dob: '', gender: 'Male', weight: '' })
      }
    }
  }, [isOpen, editPet, prefillPhotoUrl, prefillData])

  const themeClass = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', btn: 'bg-emerald-600 hover:bg-emerald-700', border: 'border-emerald-600', ring: 'ring-emerald-600/20' },
    pink:    { bg: 'bg-pink-50',    text: 'text-pink-600',    btn: 'bg-pink-600 hover:bg-pink-700',       border: 'border-pink-500',    ring: 'ring-pink-500/20' },
    violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  btn: 'bg-violet-600 hover:bg-violet-700',   border: 'border-violet-600',  ring: 'ring-violet-600/20' },
    purple:  { bg: 'bg-purple-50',  text: 'text-purple-600',  btn: 'bg-purple-600 hover:bg-purple-700',   border: 'border-purple-600',  ring: 'ring-purple-600/20' },
    orange:  { bg: 'bg-orange-50',  text: 'text-orange-600',  btn: 'bg-orange-600 hover:bg-orange-700',   border: 'border-orange-500',  ring: 'ring-orange-500/20' }
  }[accentColor]

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setStep('scanning')
    // Simulate AI scan
    setTimeout(() => {
      setForm(f => ({ ...f, breed: 'Golden Retriever', type: 'Dog', dob: '2023-06-15' }))
      setStep('form')
    }, 3000)
  }

  const handleSubmit = () => {
    const petData = {
      name: form.name,
      type: form.type,
      breed: form.breed,
      dob: form.dob,
      gender: form.gender,
      weight: form.weight || 'Unknown',
      photoUrl: previewUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400',
      timeline: editPet?.timeline ?? []
    }
    if (editPet) {
      updatePet(editPet.id, petData)
    } else {
      addPet(petData)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-[40px] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4">
              <h2 className="text-2xl font-black text-[#1A1A1A]">
                {editPet ? 'Edit Pet' : 'Add New Pet'}
              </h2>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Step indicator */}
            {!editPet && (
              <div className="flex items-center gap-2 px-8 pb-6">
                {(['capture', 'scanning', 'form'] as AddStep[]).map((s, i) => (
                  <div key={s} className={cn(
                    "h-1.5 rounded-full flex-1 transition-all",
                    step === s || (step === 'form' && i <= 2) || (step === 'scanning' && i <= 1) || (step === 'capture' && i === 0)
                      ? themeClass.btn.split(' ')[0]
                      : 'bg-gray-100'
                  )} />
                ))}
              </div>
            )}

            <div className="px-8 pb-8 space-y-6 max-h-[75vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* Step 1: Capture */}
                {step === 'capture' && (
                  <motion.div key="capture" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={cn("w-full aspect-square rounded-[40px] border-4 border-dashed flex flex-col items-center justify-center gap-6 transition-all active:scale-95", themeClass.border, themeClass.bg)}
                    >
                      <div className={cn("w-24 h-24 rounded-full flex items-center justify-center shadow-xl", themeClass.bg, themeClass.text)}>
                        <Camera className="w-10 h-10" />
                      </div>
                      <div className="text-center">
                        <p className="font-black text-[#1A1A1A] text-lg">Upload Pet Photo</p>
                        <p className={cn("text-xs font-bold uppercase tracking-widest mt-1", themeClass.text)}>
                          AI will detect breed instantly
                        </p>
                      </div>
                    </button>
                    <Button onClick={() => fileInputRef.current?.click()} className={cn("w-full h-14 rounded-3xl font-black text-white text-base", themeClass.btn)}>
                      <Camera className="w-5 h-5 mr-2" /> Choose Photo
                    </Button>
                    <button onClick={() => setStep('form')} className="w-full text-center text-xs font-bold text-gray-400 hover:text-gray-600">
                      Skip & Enter Manually →
                    </button>
                  </motion.div>
                )}

                {/* Step 2: AI Scanning */}
                {step === 'scanning' && (
                  <motion.div key="scanning" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                    <div className="relative w-full aspect-square rounded-[40px] overflow-hidden bg-black">
                      {previewUrl && <img src={previewUrl} alt="Scanning" className="w-full h-full object-cover opacity-70" />}
                      {/* Laser scan line */}
                      <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                        className={cn("absolute left-0 right-0 h-1 shadow-[0_0_20px_rgba(139,92,246,0.9)] z-20", themeClass.btn.split(' ')[0].replace('bg-', 'bg-'))}
                      />
                      {/* Corner scan brackets */}
                      <div className={cn("absolute top-6 left-6 w-10 h-10 border-l-4 border-t-4 rounded-tl-xl", themeClass.border)} />
                      <div className={cn("absolute top-6 right-6 w-10 h-10 border-r-4 border-t-4 rounded-tr-xl", themeClass.border)} />
                      <div className={cn("absolute bottom-6 left-6 w-10 h-10 border-l-4 border-b-4 rounded-bl-xl", themeClass.border)} />
                      <div className={cn("absolute bottom-6 right-6 w-10 h-10 border-r-4 border-b-4 rounded-br-xl", themeClass.border)} />

                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                        <Wand2 className={cn("w-12 h-12 animate-pulse", themeClass.text)} />
                        <p className={cn("text-sm font-black uppercase tracking-widest animate-bounce bg-black/40 px-4 py-2 rounded-full text-white")}>
                          AI Detecting Breed...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className={cn("w-5 h-5 animate-spin", themeClass.text)} />
                      <p className="text-sm font-black text-gray-500">Analyzing photo for breed, age & type...</p>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Form (AI pre-filled) */}
                {step === 'form' && (
                  <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                    {/* AI Banner */}
                    {!editPet && previewUrl && (
                      <div className={cn("flex items-center gap-3 p-4 rounded-2xl border", themeClass.bg, themeClass.border)}>
                        <CheckCircle2 className={cn("w-5 h-5 shrink-0", themeClass.text)} />
                        <p className={cn("text-xs font-black uppercase tracking-tight", themeClass.text)}>
                          AI Detected: {form.breed} · Edit below to confirm
                        </p>
                      </div>
                    )}

                    {/* Pet Photo Preview */}
                    {previewUrl && (
                      <div className="flex items-center gap-4">
                        <img src={previewUrl} alt="Pet" className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md" />
                        <button onClick={() => { setPreviewUrl(''); setStep('capture') }} className="text-xs font-bold text-gray-400 hover:text-gray-600">Change Photo</button>
                      </div>
                    )}

                    {/* Name (blank for user) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pet Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Bruno"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className={cn("w-full bg-gray-50 rounded-2xl h-14 px-6 font-bold text-sm focus:outline-none focus:ring-2", themeClass.ring)}
                      />
                    </div>

                    {/* Type */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pet Type</label>
                      <div className="grid grid-cols-5 gap-2">
                        {(['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'] as Pet['type'][]).map(t => (
                          <button
                            key={t}
                            onClick={() => setForm(f => ({ ...f, type: t }))}
                            className={cn(
                              "py-2.5 rounded-2xl text-[10px] font-black uppercase border-2 transition-all",
                              form.type === t ? cn(themeClass.border, themeClass.bg, themeClass.text) : "border-transparent bg-gray-50 text-gray-400"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Breed (AI prefilled) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Breed (AI detected)</label>
                      <input
                        type="text"
                        value={form.breed}
                        onChange={e => setForm(f => ({ ...f, breed: e.target.value }))}
                        className={cn("w-full bg-gray-50 rounded-2xl h-14 px-6 font-bold text-sm focus:outline-none focus:ring-2", themeClass.ring)}
                      />
                    </div>

                    {/* DOB (AI prefilled) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth (AI estimated)</label>
                      <input
                        type="date"
                        value={form.dob}
                        onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
                        className={cn("w-full bg-gray-50 rounded-2xl h-14 px-6 font-bold text-sm focus:outline-none focus:ring-2", themeClass.ring)}
                      />
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['Male', 'Female'] as Pet['gender'][]).map(g => (
                          <button
                            key={g}
                            onClick={() => setForm(f => ({ ...f, gender: g }))}
                            className={cn(
                              "py-3.5 rounded-2xl text-sm font-black border-2 transition-all",
                              form.gender === g ? cn(themeClass.border, themeClass.bg, themeClass.text) : "border-transparent bg-gray-50 text-gray-400"
                            )}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Weight */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Weight (optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. 28 kg"
                        value={form.weight}
                        onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                        className={cn("w-full bg-gray-50 rounded-2xl h-14 px-6 font-bold text-sm focus:outline-none focus:ring-2", themeClass.ring)}
                      />
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={!form.name.trim()}
                      className={cn("w-full h-14 rounded-3xl font-black text-white text-base shadow-lg", themeClass.btn)}
                    >
                      {editPet ? 'Save Changes' : 'Add to My Pets'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
