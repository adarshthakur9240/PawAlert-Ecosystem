"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/layout/TopBar"
import { Plus, Minus, ChevronRight, ShoppingBag, Zap, Flame, Tag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Product = {
  id: number
  category: string
  name: string
  brand: string
  weight: string
  price: number
  mrp: number
  img: string
  badge?: string
}

const categories = [
  { id: "all",      name: "All",      emoji: "🐾", bg: "bg-orange-50" },
  { id: "dog",      name: "Dog Food", emoji: "🐶", bg: "bg-amber-50"  },
  { id: "cat",      name: "Cat Food", emoji: "🐱", bg: "bg-blue-50"   },
  { id: "treats",   name: "Treats",   emoji: "🦴", bg: "bg-pink-50"   },
  { id: "toys",     name: "Toys",     emoji: "🎾", bg: "bg-green-50"  },
  { id: "health",   name: "Health",   emoji: "💊", bg: "bg-teal-50"   },
  { id: "grooming", name: "Grooming", emoji: "✂️", bg: "bg-violet-50" },
]

const SEED: Product[] = [
  { id:1,  category:"dog",      name:"Pedigree Adult Dry Dog Food",        brand:"Pedigree",    weight:"3 kg",    price:699,  mrp:849,  img:"https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400&q=80", badge:"Bestseller" },
  { id:2,  category:"cat",      name:"Whiskas Adult Dry Cat Food",         brand:"Whiskas",     weight:"1.2 kg",  price:380,  mrp:449,  img:"https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&q=80" },
  { id:3,  category:"treats",   name:"JerHigh Chicken Sticks",             brand:"JerHigh",     weight:"100 g",   price:160,  mrp:200,  img:"https://images.unsplash.com/photo-1504595403659-9088ce801e29?w=400&q=80", badge:"New" },
  { id:4,  category:"grooming", name:"Himalaya Erina Tick Shampoo",        brand:"Himalaya",    weight:"200 ml",  price:195,  mrp:240,  img:"https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80" },
  { id:5,  category:"toys",     name:"Trixie Rubber Squeaky Bone Toy",     brand:"Trixie",      weight:"Large",   price:320,  mrp:399,  img:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80", badge:"Top Deal" },
  { id:6,  category:"health",   name:"First Aid Kit for Pets",             brand:"PawSafe",     weight:"1 Kit",   price:450,  mrp:550,  img:"https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&q=80" },
  { id:7,  category:"dog",      name:"Royal Canin Medium Adult Food",       brand:"Royal Canin", weight:"4 kg",   price:1799, mrp:2199, img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", badge:"Premium" },
  { id:8,  category:"cat",      name:"Purina Felix Wet Cat Food",           brand:"Purina",      weight:"85 g×6", price:299,  mrp:360,  img:"https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&q=80" },
  { id:9,  category:"adopt",    name:"Indie Dog Adoption Pack",            brand:"PawAlert",    weight:"Starter", price:0,    mrp:999,  img:"https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400&q=80", badge:"Free" },
]

const BANNERS = [
  { id:0, title:"Lightning Delivery", sub:"Pet needs in 10 mins",  color:"from-[#E55934] to-orange-400",  icon:Zap   },
  { id:1, title:"Karma Rewards",      sub:"Earn on every rescue",  color:"from-purple-600 to-indigo-500", icon:Flame },
  { id:2, title:"Pet Supplies Sale",  sub:"Up to 50% Off Today",   color:"from-emerald-600 to-teal-500",  icon:Tag   },
]

function getCardBadge(product: Product): { text: string; color: string } | null {
  if (product.badge) return { text: product.badge, color: "bg-[#E55934]" }
  const disc = Math.round(((product.mrp - product.price) / product.mrp) * 100)
  if (disc >= 10) return { text: `${disc}% OFF`, color: "bg-green-500" }
  return null
}

export default function PawStorePage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = React.useState("all")
  const [products, setProducts]             = React.useState<Product[]>(SEED)
  const [cart, setCart]                     = React.useState<Record<number, number>>({})
  const [banner, setBanner]                 = React.useState(0)
  const [loading, setLoading]               = React.useState(false)
  const loaderRef                           = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const stored = localStorage.getItem("pawstore_cart")
    if (stored) {
      setCart(JSON.parse(stored))
    }
  }, [])

  React.useEffect(() => {
    const t = setInterval(() => setBanner(p => (p + 1) % BANNERS.length), 5000)
    return () => clearInterval(t)
  }, [])

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setLoading(true)
        setTimeout(() => {
          setProducts(prev => [...prev, ...SEED.map(p => ({ ...p, id: p.id + prev.length + Math.random() }))])
          setLoading(false)
        }, 800)
      }
    }, { threshold: 0.1 })
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [loading])

  const filtered = activeCategory === "all" ? products : products.filter(p => p.category === activeCategory)

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
      const cartProducts = products.filter(p => newCart[p.id])
      localStorage.setItem("pawstore_products", JSON.stringify(cartProducts))

      return newCart
    })
  }

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find(x => x.id === Number(id)) ?? SEED.find(x => x.id === Number(id))
    return sum + (p?.price ?? 0) * qty
  }, 0)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans font-semibold">
      <TopBar />

      <div className="sticky top-[68px] z-30 bg-white/98 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-5 overflow-x-auto px-4 py-3 no-scrollbar">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className="flex flex-col items-center gap-1.5 shrink-0 transition-all">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${cat.bg} ${activeCategory === cat.id ? "ring-2 ring-[#E55934] scale-110 shadow-md" : "opacity-70"}`}>
                {cat.emoji}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${activeCategory === cat.id ? "text-[#E55934]" : "text-gray-400"}`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-3 pt-4 pb-44 space-y-5">
        <div className="relative h-36 rounded-2xl overflow-hidden shadow-lg cursor-pointer" onClick={() => router.push('/pawstore')}>
          <AnimatePresence mode="wait">
            <motion.div key={banner} initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }} transition={{ duration:0.35 }}
              className={`absolute inset-0 bg-gradient-to-br ${BANNERS[banner].color} flex items-center justify-between px-6`}>
              <div>
                <h2 className="text-xl font-black text-white leading-tight uppercase">{BANNERS[banner].title}</h2>
                <p className="text-xs text-white/80 mt-1 font-bold">{BANNERS[banner].sub}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                {React.createElement(BANNERS[banner].icon, { className:"w-7 h-7 text-white" })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {filtered.map((product, i) => {
            const qty   = cart[product.id] ?? 0
            const badge = getCardBadge(product)
            return (
              <div key={`${product.id}-${i}`}
                className="bg-white rounded-xl border border-gray-200 flex flex-col group overflow-visible shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  router.push(`/pawstore/product/${product.id}`);
                }}
              >
                <div className="relative">
                  <div className="aspect-square overflow-hidden rounded-t-xl bg-gray-50">
                    <img src={product.img} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-xl"
                      loading="lazy" />
                  </div>
                  {badge && (
                    <span className={`absolute top-0 left-0 ${badge.color} text-white text-[8px] font-black px-2 py-1 rounded-tl-xl rounded-br-xl z-10 uppercase tracking-widest shadow-sm`}>
                      {badge.text}
                    </span>
                  )}
                  <div className="absolute bottom-[-10px] right-2 z-20">
                    <AnimatePresence mode="wait">
                      {qty === 0 ? (
                        <motion.button key="add"
                          initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.85, opacity:0 }}
                          whileTap={{ scale:0.92 }}
                          onClick={(e) => { e.stopPropagation(); updateCart(product.id, 1); }}
                          className="bg-white text-[#E55934] border border-gray-200 shadow-md hover:shadow-lg rounded-lg px-4 py-[7px] font-extrabold text-[11px] uppercase tracking-widest min-w-[64px] text-center">
                          ADD
                        </motion.button>
                      ) : (
                        <motion.div key="counter"
                          initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.85, opacity:0 }}
                          className="flex items-center bg-[#E55934] rounded-lg shadow-md h-8 min-w-[80px] overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button onClick={() => updateCart(product.id, -1)} className="flex-1 h-full flex items-center justify-center text-white hover:bg-black/10"><Minus className="w-3 h-3" /></button>
                          <span className="w-7 text-center text-[11px] font-black text-white">{qty}</span>
                          <button onClick={() => updateCart(product.id, 1)} className="flex-1 h-full flex items-center justify-center text-white hover:bg-black/10"><Plus className="w-3 h-3" /></button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="h-[120px] px-3 pt-5 pb-3 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[14px] font-bold text-gray-900">₹{product.price}</span>
                      <span className="text-[10px] text-gray-400 line-through">₹{product.mrp}</span>
                    </div>
                    <h4 className="text-[12px] font-bold text-gray-700 leading-snug line-clamp-2 uppercase">
                      {product.name}
                    </h4>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{product.weight}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div ref={loaderRef} className="flex justify-center py-10">
          {loading && <div className="w-6 h-6 border-[3px] border-[#E55934] border-t-transparent rounded-full animate-spin" />}
        </div>
      </main>

      <div className="fixed bottom-20 left-4 right-4 z-[45] bg-[#E55934] rounded-2xl px-4 py-3 flex items-center justify-between shadow-2xl shadow-orange-900/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-[#E55934] text-[10px] font-black w-5 h-5 rounded-lg flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </div>
          <div>
            {totalItems > 0 ? (
              <>
                <p className="text-[9px] text-white/70 font-black uppercase tracking-[0.2em] leading-none mb-0.5">{totalItems} item{totalItems > 1 ? "s" : ""} added</p>
                <p className="text-base font-black text-white leading-none">₹{totalPrice.toLocaleString()}</p>
              </>
            ) : (
              <p className="text-sm font-black text-white/90 uppercase tracking-widest">PawStore</p>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            if (totalItems === 0) return
            const firstItem = products.find(p => cart[p.id]) ?? SEED.find(p => cart[p.id])
            const q = new URLSearchParams({
              type: 'order',
              name: firstItem?.name ?? 'PawStore Order',
              fee: String(totalPrice),
              image: firstItem?.img ?? '',
              breed: 'Essential Pet Supplies'
            })
            router.push(`/checkout?${q.toString()}`)
          }}
          className="flex items-center gap-1.5 bg-white text-[#E55934] h-11 px-6 rounded-xl font-extrabold text-[11px] uppercase tracking-widest shadow-md active:scale-95 transition-all">
          {totalItems > 0 ? "CHECKOUT" : "BROWSE"} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}