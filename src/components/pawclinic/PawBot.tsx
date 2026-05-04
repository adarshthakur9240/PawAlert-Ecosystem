"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Bot, 
  Stethoscope, 
  X, 
  Send, 
  Mic, 
  Camera, 
  MessageCircle,
  MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Message {
  role: 'user' | 'bot'
  text: string
  type?: 'text' | 'image'
  image?: string // Added to store base64 image strings
}

export function PawBot() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([
    { role: 'bot', text: 'Namaste! I am PawBot, your AI Vet Assistant. Aapka pet kaisa hai aaj? How can I help you today?' }
  ])
  const [inputText, setInputText] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null)
  const [isListening, setIsListening] = React.useState(false)

  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // --- MIC FEATURE (Speech to Text) ---
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser doesn't support voice input.")
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN' // Supports English and Indian accents
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputText(prev => prev + (prev ? " " : "") + transcript)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognition.start()
  }

  // --- CAMERA FEATURE (Image to Base64) ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
    // Reset file input so the same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // --- SEND MESSAGE ---
  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return

    const userMessage: Message = { 
      role: 'user', 
      text: inputText.trim() || (selectedImage ? "Analyze this image." : ""),
      image: selectedImage || undefined
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputText("")
    setSelectedImage(null)
    setIsTyping(true)

    try {
      const response = await fetch('/api/pawbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })
      const data = await response.json()
      
      if (data.text) {
        setMessages(prev => [...prev, { role: 'bot', text: data.text }])
      }
    } catch (error) {
      console.error("PawBot Chat Error:", error)
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now. Please try again later." }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-24 right-4 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[320px] md:w-[380px] bg-white/95 backdrop-blur-md rounded-[32px] shadow-2xl border border-emerald-100 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight">PawBot - AI Vet</h3>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Always Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-2xl text-sm font-semibold shadow-sm flex flex-col gap-2",
                    msg.role === 'user' 
                      ? "bg-emerald-600 text-white rounded-br-none" 
                      : "bg-emerald-50 text-emerald-900 rounded-bl-none"
                  )}>
                    {/* Render Image if exists in message */}
                    {msg.image && (
                      <img 
                        src={msg.image} 
                        alt="Uploaded by user" 
                        className="w-full max-w-[200px] rounded-xl object-cover border border-emerald-500/20"
                      />
                    )}
                    {msg.text && <span>{msg.text}</span>}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex flex-col mr-auto items-start max-w-[80%]">
                  <div className="bg-emerald-50 p-4 rounded-2xl rounded-bl-none">
                    <MoreHorizontal className="w-5 h-5 text-emerald-600 animate-pulse" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 flex flex-col gap-2">
              {/* Image Preview Area */}
              {selectedImage && (
                <div className="relative inline-block w-fit ml-2">
                  <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-xl border border-gray-200 shadow-sm" />
                  <button 
                    onClick={() => setSelectedImage(null)} 
                    className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-[10px] hover:bg-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleMicClick}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isListening ? "bg-red-50 text-red-500 animate-pulse" : "bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                  )}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isListening ? "Listening..." : "Ask anything..."}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-emerald-600/20 placeholder:text-gray-400"
                  />
                </div>
                <button 
                  onClick={handleSend}
                  disabled={(!inputText.trim() && !selectedImage) || isTyping}
                  className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 active:scale-90 transition-transform disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: ["0 0 0px rgba(5,150,105,0)", "0 0 20px rgba(5,150,105,0.4)", "0 0 0px rgba(5,150,105,0)"]
        }}
        transition={{ repeat: Infinity, duration: 3 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-700 to-transparent opacity-50" />
        <div className="relative flex flex-col items-center">
          <Bot className="w-6 h-6 mb-[-4px]" />
          <Stethoscope className="w-4 h-4 opacity-80" />
        </div>
      </motion.button>
    </div>
  )
}