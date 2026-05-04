import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface HealthTimelineItem {
  type: 'Vaccination' | 'Checkup' | 'Deworming' | 'Grooming' | 'Other'
  title: string
  date: string
  status: 'Upcoming' | 'Completed' | 'Pending'
}

export interface Pet {
  id: string
  name: string
  type: 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Other'
  breed: string
  dob: string // ISO date string
  gender: 'Male' | 'Female'
  weight: string
  photoUrl: string
  timeline: HealthTimelineItem[]
}

export interface Order {
  id: string
  items: string
  total: number
  date: string
  status: 'Delivered' | 'Pending'
  image: string
}

interface PetState {
  pets: Pet[]
  activePetId: string | null
  recentOrders: Order[]
  addPet: (pet: Omit<Pet, 'id'>) => void
  updatePet: (id: string, updates: Partial<Pet>) => void
  deletePet: (id: string) => void
  setActivePet: (id: string) => void
  addOrder: (order: Omit<Order, 'id'>) => void
}

const DEFAULT_PETS: Pet[] = [
  {
    id: 'pet-1',
    name: 'Bruno',
    type: 'Dog',
    breed: 'Golden Retriever',
    dob: '2023-11-15',
    gender: 'Male',
    weight: '32 kg',
    photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop',
    timeline: [
      { type: 'Vaccination', title: 'Anti-Rabies Booster', date: '12 May 2026', status: 'Upcoming' },
      { type: 'Checkup', title: 'General Wellness', date: '15 April 2026', status: 'Completed' },
      { type: 'Deworming', title: 'Seasonal Deworming', date: '20 June 2026', status: 'Pending' }
    ]
  },
  {
    id: 'pet-2',
    name: 'Luna',
    type: 'Cat',
    breed: 'Persian Cat',
    dob: '2024-04-01',
    gender: 'Female',
    weight: '4.5 kg',
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop',
    timeline: [
      { type: 'Vaccination', title: 'FVRCP Vaccine', date: '05 June 2026', status: 'Upcoming' },
      { type: 'Checkup', title: 'Dental Cleaning', date: '10 March 2026', status: 'Completed' }
    ]
  }
]

export const usePetStore = create<PetState>()(
  persist(
    (set, get) => ({
      pets: DEFAULT_PETS,
      activePetId: DEFAULT_PETS[0].id,
      recentOrders: [],

      addPet: (petData) => {
        const newPet: Pet = {
          ...petData,
          id: `pet-${Date.now()}`,
          timeline: petData.timeline ?? []
        }
        set((state) => ({
          pets: [...state.pets, newPet],
          activePetId: newPet.id
        }))
      },

      updatePet: (id, updates) => {
        set((state) => ({
          pets: state.pets.map((p) => (p.id === id ? { ...p, ...updates } : p))
        }))
      },

      deletePet: (id) => {
        set((state) => {
          const remaining = state.pets.filter((p) => p.id !== id)
          const newActiveId = state.activePetId === id
            ? (remaining[0]?.id ?? null)
            : state.activePetId
          return { pets: remaining, activePetId: newActiveId }
        })
      },

      setActivePet: (id) => set({ activePetId: id }),

      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ord-${Date.now()}`
        }
        set((state) => ({
          recentOrders: [newOrder, ...state.recentOrders]
        }))
      }
    }),
    {
      name: 'pawalert-pet-store'
    }
  )
)

// Derived selector helpers
export const useActivePet = () => {
  const { pets, activePetId } = usePetStore()
  return pets.find((p) => p.id === activePetId) ?? pets[0] ?? null
}

export const calculateAge = (dob: string): string => {
  const birthDate = new Date(dob)
  const now = new Date()
  const years = now.getFullYear() - birthDate.getFullYear()
  const months = now.getMonth() - birthDate.getMonth()
  const totalMonths = years * 12 + months
  if (totalMonths < 12) return `${totalMonths} mo`
  const y = Math.floor(totalMonths / 12)
  const m = totalMonths % 12
  return m > 0 ? `${y}.${m} Yrs` : `${y} Yrs`
}
