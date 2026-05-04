import { BottomNav } from "@/components/layout/BottomNav"
import { PawBot } from "@/components/pawclinic/PawBot"
import { cn } from "@/lib/utils"

export default function PawClinicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={cn(
      "flex flex-col min-h-screen pb-20 font-sans selection:bg-emerald-600/20",
      "bg-white text-[#1A1A1A]"
    )}>
      {children}
      <PawBot />
      <BottomNav />
    </div>
  )
}
