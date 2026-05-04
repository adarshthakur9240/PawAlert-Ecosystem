"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ShoppingBag, Star, ShieldCheck, Clock, Plus, Minus, Share2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// SEED data 
const SEED = [
  { id: 1, category: "dog", name: "Pedigree Adult Dry Dog Food", brand: "Pedigree", weight: "3 kg", price: 699, mrp: 849, img: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=800&q=80", badge: "Bestseller", desc: "Complete and balanced nutrition with antioxidant formula for a healthy immune system." },
  { id: 2, category: "cat", name: "Whiskas Adult Dry Cat Food", brand: "Whiskas", weight: "1.2 kg", price: 380, mrp: 449, img: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&q=80", desc: "Crunchy chunks packed with real fish/chicken flavour & milk." },
  { id: 3, category: "treats", name: "JerHigh Chicken Sticks", brand: "JerHigh", weight: "100 g", price: 160, mrp: 200, img: "https://images.unsplash.com/photo-1504595403659-9088ce801e29?w=800&q=80", badge: "New", desc: "Premium snack filled with nutrients and vitamins to make your dog healthy and strong." },
  { id: 4, category: "grooming", name: "Himalaya Erina Tick Shampoo", brand: "Himalaya", weight: "200 ml", price: 195, mrp: 240, img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80", desc: "Helps control ticks, fleas, and lice. Promotes a healthy skin and coat." },
  { id: 5, category: "toys", name: "Trixie Rubber Squeaky Bone Toy", brand: "Trixie", weight: "Large", price: 320, mrp: 399, img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80", badge: "Top Deal", desc: "Durable natural rubber toy that massages gums and cleans teeth." },
  { id: 6, category: "health", name: "First Aid Kit for Pets", brand: "PawSafe", weight: "1 Kit", price: 450, mrp: 550, img: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80", desc: "Essential medical supplies for emergency pet care at home or on trips." },
  { id: 7, category: "health", name: "Dog Vaccines (Rabies, DHLPP)", brand: "PawClinic", weight: "Dose", price: 899, mrp: 1200, img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80", badge: "Premium", desc: "Essential annual vaccination package for your dog's safety." },
  { id: 8, category: "accessories", name: "Cat Scratching Post", brand: "Trixie", weight: "1 Unit", price: 1299, mrp: 1599, img: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800&q=80", desc: "Sturdy sisal-wrapped post to keep your cat's claws healthy and protect your furniture." },
  { id: 9, category: "adopt", name: "Indie Dog Adoption Pack", brand: "PawAlert", weight: "Starter", price: 0, mrp: 999, img: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=800&q=80", badge: "Free", desc: "Everything you need to welcome a rescued Indie dog to your home." },
]

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const productId = Number(params.id)

  const product = SEED.find(p => p.id === productId)
  
  const [cart, setCart] = React.useState<Record<number, number>>({})

  // Load cart from LocalStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("pawstore_cart")
    if (stored) setCart(JSON.parse(stored))
  }, [])

  // Sync cart to LocalStorage
  const updateCart = (id: number, delta: number) => {
    setCart(prev => {
      const next = (prev[id] ?? 0) + delta
      let newCart = { ...prev }
      if (next <= 0) {
        delete newCart[id]
      } else {
        newCart[id] = next
      }
      localStorage.setItem("pawstore_cart", JSON.stringify(newCart))
      
      const cartProducts = SEED.filter(p => newCart[p.id])
      localStorage.setItem("pawstore_products", JSON.stringify(cartProducts))
      
      return newCart
    })
  }

  // Not Found UI
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-xl font-black text-gray-800">Product Not Found</h1>
        <button onClick={() => router.push("/pawstore")} className="mt-4 text-[#E55934] font-bold underline">Go Back to Store</button>
      </div>
    )
  }

  const qty = cart[product.id] ?? 0
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100)

  return (
    // 🔴 Gray background for desktop, keeps the center column white like a mobile app
    <div className="min-h-screen bg-gray-100 dark:bg-[#050505] pb-40">
      
      {/* 🔴 Main App Container (Max-width fixes the stretching issue) */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-[#0a0a0a] min-h-screen shadow-2xl relative overflow-hidden">
        
        {/* Top Image Area */}
        <div className="relative w-full h-[350px] md:h-[400px] bg-gray-50 dark:bg-[#111]">
          {/* Floating Header Actions */}
          <div className="absolute top-4 left-0 w-full px-4 flex justify-between items-center z-20">
            <button onClick={() => router.back()} className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all">
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all">
                <Share2 className="w-5 h-5 text-gray-800" />
              </button>
              <button onClick={() => router.push("/pawstore")} className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md relative active:scale-95 transition-all">
                <ShoppingBag className="w-5 h-5 text-gray-800" />
                {Object.values(cart).reduce((a, b) => a + b, 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E55934] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {Object.values(cart).reduce((a, b) => a + b, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Product Image */}
          <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Product Info Sheet */}
        <div className="relative -mt-8 bg-white dark:bg-[#0a0a0a] rounded-t-[32px] px-6 pt-8 pb-10 z-10 border-t border-gray-100 dark:border-white/5">
          
          {/* Brand & Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{product.brand}</span>
            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-[10px] font-black">
              <Star className="w-3 h-3 fill-current" /> 4.8
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-2">
            {product.name}
          </h1>
          <p className="text-sm font-bold text-gray-500 mb-8">{product.weight}</p>

          {/* Price Tag */}
          <div className="flex items-center gap-4 mb-8 bg-gray-50 dark:bg-[#1a1a1a] p-5 rounded-[20px] border border-gray-100 dark:border-white/5">
            <span className="text-4xl font-black text-gray-900 dark:text-white">₹{product.price}</span>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400 line-through font-bold">MRP ₹{product.mrp}</span>
              {discount > 0 && <span className="text-[11px] font-black text-[#E55934] uppercase tracking-wider">{discount}% OFF</span>}
            </div>
          </div>

          {/* Details / Desc */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">Product Details</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
              {product.desc || "Premium quality product tailored for your pet's needs. Delivered directly from verified PawStore vendors."}
            </p>
          </div>

          {/* Trust Badges - Improved Layout */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
            <div className="flex flex-col items-center gap-3 flex-1 bg-orange-50/50 dark:bg-[#1a1a1a] p-4 rounded-2xl border border-orange-100 dark:border-white/5">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#E55934]" />
              </div>
              <span className="text-[10px] font-black text-center text-gray-600 dark:text-gray-300">10 MIN<br/>DELIVERY</span>
            </div>
            <div className="flex flex-col items-center gap-3 flex-1 bg-blue-50/50 dark:bg-[#1a1a1a] p-4 rounded-2xl border border-blue-100 dark:border-white/5">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-[10px] font-black text-center text-gray-600 dark:text-gray-300">100%<br/>GENUINE</span>
            </div>
          </div>
        </div>

        {/* 🔴 Sticky Bottom Bar (Shifted up to bottom-20 so it doesn't overlap global nav) */}
        <div className="fixed bottom-20 md:bottom-[84px] left-0 right-0 mx-auto max-w-2xl w-full bg-white dark:bg-[#1a1a1a] p-4 z-[100] flex items-center gap-4 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-gray-100">
          
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {qty === 0 ? (
                <motion.button 
                  key="add"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => updateCart(product.id, 1)}
                  className="w-full h-14 bg-orange-50 border-2 border-[#E55934] text-[#E55934] hover:bg-[#E55934] hover:text-white rounded-[16px] font-black uppercase tracking-widest active:scale-95 transition-all"
                >
                  Add to Cart
                </motion.button>
              ) : (
                <motion.div 
                  key="counter"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="w-full h-14 bg-[#E55934] rounded-[16px] flex items-center justify-between px-3 text-white shadow-lg shadow-orange-500/30"
                >
                  <button onClick={() => updateCart(product.id, -1)} className="w-10 h-10 flex items-center justify-center bg-white/20 active:bg-black/20 rounded-xl transition-colors"><Minus className="w-5 h-5" /></button>
                  <span className="font-black text-xl">{qty}</span>
                  <button onClick={() => updateCart(product.id, 1)} className="w-10 h-10 flex items-center justify-center bg-white/20 active:bg-black/20 rounded-xl transition-colors"><Plus className="w-5 h-5" /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {qty > 0 && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              onClick={() => router.push("/pawstore")}
              className="flex-1 h-14 bg-gray-900 dark:bg-white text-white dark:text-black rounded-[16px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
            >
              Go to Cart
            </motion.button>
          )}
        </div>

      </div>
    </div>
  )
}