"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type LoaderType = 'clinic' | 'groom' | 'care' | 'adopt' | 'store' | 'app'

interface PawLoaderProps {
  type: LoaderType
}

const LOADER_CONFIG: Record<LoaderType, { 
  main: string, 
  sub: string, 
  color: string,
  bgColor: string
}> = {
  clinic: {
    main: "Paging Dr. Woof...",
    sub: "Your veterinary specialist is getting ready",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  groom: {
    main: "Preparing the bubble bath...",
    sub: "Fetching the finest pet-safe soaps and brushes",
    color: "text-pink-600",
    bgColor: "bg-pink-50"
  },
  care: {
    main: "Syncing training modules...",
    sub: "Almost ready to start your learning journey",
    color: "text-violet-600",
    bgColor: "bg-violet-50"
  },
  adopt: {
    main: "Finding your best friend...",
    sub: "Scanning shelters for your perfect match",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  store: {
    main: "Preparing your order...",
    sub: "Getting your pet essentials ready for 10-min delivery",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  app: {
    main: "Initializing PawAlert...",
    sub: "Sniffing out your dashboard...",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  }
}

export function PawLoader({ type }: PawLoaderProps) {
  const config = LOADER_CONFIG[type]

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md"
    >
      <div className="flex flex-col items-center max-w-xs text-center space-y-6">
        {/* Spinner Container */}
        <div className={cn("relative w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-xl", config.bgColor)}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Loader2 className={cn("w-10 h-10 stroke-[1.5]", config.color)} />
          </motion.div>
          
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={cn("w-12 h-12 rounded-full blur-xl", config.color.replace('text', 'bg'))}
          />
        </div>

        {/* Text Container */}
        <div className="space-y-2 px-4">
          <motion.h2 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-black tracking-tight text-foreground"
          >
            {config.main}
          </motion.h2>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed"
          >
            {config.sub}
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}
