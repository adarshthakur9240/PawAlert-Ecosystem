import { BottomNav } from "@/components/layout/BottomNav"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-full pb-20 bg-background">
      {children}
      <BottomNav />
    </div>
  )
}
