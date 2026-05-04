"use client"

import * as React from "react"
import { Search, Mic, MicOff, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation" // ✅ useRouter add kiya

const routePlaceholders: Record<string, string[]> = {
  "/home": [
    'Search for "Pedigree dog food"',
    'Find nearby emergency vets...',
    'Search "Puppy vaccines"',
    'Adopt a stray indie...',
  ],
  "/pawstore": [
    'Search dog food...',
    'Find cat treats...',
    'Search "Chew toys"',
    'First aid kits for pets',
  ],
  "/pawclinic": [
    'Find nearby vets...',
    'Search clinics...',
    'Emergency care nearby',
    'Specialist pet doctors',
  ],
  "default": [
    'Search PawAlert...',
    'Find help nearby...',
  ]
}

// ✅ Suggestions ko ID ke sath object bana diya
const storeSuggestions = [
  { id: 1, name: "Pedigree Adult Dry Dog Food" },
  { id: 2, name: "Whiskas Kitten Dry Cat Food" },
  { id: 3, name: "JerHigh Chicken Sticks" },
  { id: 4, name: "Himalaya Erina Tick Shampoo" },
  { id: 5, name: "Trixie Rubber Squeaky Bone Toy" },
  { id: 6, name: "First Aid Kit for Pets" },
  { id: 7, name: "Dog Vaccines (Rabies, DHLPP)" },
  { id: 8, name: "Cat Scratching Post" },
  { id: 9, name: "Indie Dog Adoption Pack" },
]

export function DynamicSearch() {
  const pathname = usePathname()
  const router = useRouter() // ✅ Router initialize kiya
  
  const [inputValue, setInputValue] = React.useState("")
  const [displayText, setDisplayText] = React.useState("")
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [typingSpeed, setTypingSpeed] = React.useState(100)
  const [isListening, setIsListening] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  const placeholders = routePlaceholders[pathname] || routePlaceholders["default"]

  // Typewriter Effect
  React.useEffect(() => {
    setPlaceholderIndex(0)
    setDisplayText("")
    setIsDeleting(false)
  }, [pathname])

  React.useEffect(() => {
    if (inputValue !== "") {
      setDisplayText("")
      return
    }

    const handleTyping = () => {
      const currentPlaceholder = placeholders[placeholderIndex % placeholders.length]
      
      if (!isDeleting) {
        setDisplayText(currentPlaceholder.substring(0, displayText.length + 1))
        setTypingSpeed(100)
        
        if (displayText.length === currentPlaceholder.length) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        setDisplayText(currentPlaceholder.substring(0, displayText.length - 1))
        setTypingSpeed(50)
        
        if (displayText.length === 0) {
          setIsDeleting(false)
          setPlaceholderIndex((prev) => prev + 1)
        }
      }
    }

    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [displayText, isDeleting, placeholderIndex, typingSpeed, inputValue, placeholders])

  // Voice Search
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputValue(transcript)
      setShowSuggestions(pathname === "/pawstore")
    }

    recognition.start()
  }

  // ✅ Filter logic ko update kiya for objects
  const filteredSuggestions = storeSuggestions.filter(item => 
    item.name.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <div className="relative w-full group z-[100]">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
          <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setShowSuggestions(pathname.startsWith("/pawstore") && e.target.value.length > 0)
          }}
          onFocus={() => {
            if (pathname.startsWith("/pawstore") && inputValue.length > 0) setShowSuggestions(true)
          }}
          className="w-full h-11 pl-10 pr-10 bg-secondary border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
        />

        {/* Typewriter Overlay */}
        {inputValue === "" && (
          <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none text-sm text-muted-foreground whitespace-nowrap overflow-hidden pr-10">
            {displayText}
            <span className="w-[2px] h-4 bg-primary ml-0.5 animate-pulse shrink-0" />
          </div>
        )}

        <div className="absolute inset-y-0 right-3 flex items-center gap-2">
          {inputValue !== "" && (
            <button 
              onClick={() => {
                setInputValue("")
                setShowSuggestions(false)
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button 
            onClick={startListening}
            className={`${isListening ? 'text-primary animate-pulse' : 'text-muted-foreground hover:text-primary'} transition-colors`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Auto-Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-12 left-0 right-0 bg-background border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 flex flex-col">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => {
                  setInputValue(suggestion.name) // Search bar mein naam dal dega
                  setShowSuggestions(false)      // Dropdown band karega
                  router.push(`/pawstore/product/${suggestion.id}`) // ✅ Direct product page par phek dega!
                }}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-secondary rounded-lg text-left transition-colors group cursor-pointer"
              >
                <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                <span className="text-sm font-medium">{suggestion.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}