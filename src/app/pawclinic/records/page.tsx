"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, FileText, Download, Eye, Stethoscope, Search, Filter, ArrowUpRight, ClipboardList, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const RECORDS = [
  {
    id: 1,
    date: "12 Apr 2026",
    pet: "Bruno",
    doctor: "Dr. Ananya Iyer",
    diagnosis: "Mild Fever & Seasonal Allergy",
    type: "Clinic Visit",
    status: "Resolved",
    prescription: true,
    labReport: false
  },
  {
    id: 2,
    date: "05 Mar 2026",
    pet: "Luna",
    doctor: "Dr. Rajesh Kumar",
    diagnosis: "Routine Vaccination",
    type: "Clinic Visit",
    status: "Completed",
    prescription: true,
    labReport: true
  },
  {
    id: 3,
    date: "20 Feb 2026",
    pet: "Charlie",
    doctor: "Dr. James Wilson",
    diagnosis: "Minor Skin Irritation",
    type: "Teleconsult",
    status: "Follow-up needed",
    prescription: true,
    labReport: false
  }
]

export default function MedicalRecordsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState('ALL PETS')

  const filteredRecords = React.useMemo(() => {
    if (activeTab === 'CONSULTATIONS') return RECORDS.filter(r => r.type === 'Clinic Visit' || r.type === 'Teleconsult')
    if (activeTab === 'TESTS') return RECORDS.filter(r => r.labReport)
    return RECORDS
  }, [activeTab])

  const handleDownloadDocument = (type: string, record: any) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const content = `
      <html>
        <head>
          <title>${type} - ${record.pet}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800;900&display=swap');
            body { font-family: 'Poppins', sans-serif; padding: 40px; color: #1A1A1A; line-height: 1.6; }
            .header { border-bottom: 4px solid #059669; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-start; }
            .logo { font-size: 28px; font-weight: 900; color: #059669; letter-spacing: -1px; }
            .title { font-size: 20px; font-weight: 800; text-transform: uppercase; margin-top: 10px; color: #333; }
            .meta { font-size: 12px; font-weight: 600; color: #666; text-align: right; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 14px; font-weight: 900; text-transform: uppercase; color: #059669; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .info-box { background: #f8fafc; padding: 15px; rounded: 12px; }
            .label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; display: block; }
            .value { font-size: 14px; font-weight: 700; color: #1e293b; }
            .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; font-size: 10px; color: #94a3b8; text-align: center; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">PAWCLINIC</div>
              <div class="title">${type}</div>
            </div>
            <div class="meta">
              <div>Record ID: #REC-${record.id}</div>
              <div>Date: ${record.date}</div>
            </div>
          </div>

          <div class="grid">
            <div class="info-box">
              <span class="label">Patient Name</span>
              <span class="value">${record.pet}</span>
            </div>
            <div class="info-box">
              <span class="label">Attending Doctor</span>
              <span class="value">${record.doctor}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Diagnosis & Summary</div>
            <p class="value">${record.diagnosis}</p>
          </div>

          ${type === 'Prescription' ? `
            <div class="section">
              <div class="section-title">Rx Medications</div>
              <div style="padding-left: 10px;">
                <p><strong>1. Meloxicam Oral Suspension</strong><br/><span style="font-size: 12px; color: #666;">Dosage: 0.5mg - Once daily with food for 5 days</span></p>
                <p><strong>2. PawSoothe Allergy Tablets</strong><br/><span style="font-size: 12px; color: #666;">Dosage: 1 tablet every 12 hours for 7 days</span></p>
              </div>
            </div>
          ` : `
            <div class="section">
              <div class="section-title">Laboratory Results</div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="background: #f1f5f9;">
                  <th style="text-align: left; padding: 10px; font-size: 12px;">Test Description</th>
                  <th style="text-align: right; padding: 10px; font-size: 12px;">Result</th>
                  <th style="text-align: right; padding: 10px; font-size: 12px;">Reference</th>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-size: 12px;">WBC Count</td>
                  <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee; font-size: 12px; font-weight: 700;">Normal</td>
                  <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee; font-size: 12px; color: #666;">6.0 - 17.0 x10³/μL</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-size: 12px;">Blood Glucose</td>
                  <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee; font-size: 12px; font-weight: 700;">94 mg/dL</td>
                  <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee; font-size: 12px; color: #666;">70 - 143 mg/dL</td>
                </tr>
              </table>
            </div>
          `}

          <div class="footer">
            Generated by PawClinic Digital Medical Records System. This is a computer-generated document.
          </div>

          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            }
          </script>
        </body>
      </html>
    `
    printWindow.document.write(content)
    printWindow.document.close()
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans pb-10">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 border-b border-gray-100 sticky top-0 z-50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center active:scale-90 transition-transform"
            >
              <ChevronLeft className="w-6 h-6 text-emerald-600" />
            </button>
            <h1 className="text-xl font-black tracking-tight text-[#1A1A1A]">Medical Records</h1>
          </div>
          <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2">
          {['ALL PETS', 'CONSULTATIONS', 'TESTS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-wider transition-all active:scale-95",
                activeTab === tab 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                  : "bg-white text-gray-500 border border-gray-100"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main className="p-4 relative min-h-[60vh]">
        {/* Timeline Line */}
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200 z-0" />

        <div className="space-y-8 relative z-10">
          <AnimatePresence mode="popLayout">
            {filteredRecords.length > 0 ? filteredRecords.map((record, i) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6"
              >
                {/* Timeline Dot */}
                <div className="relative mt-2 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-white border-4 border-emerald-600 flex items-center justify-center shadow-sm">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{record.date}</span>
                    <Badge variant="outline" className="bg-emerald-50/50 text-emerald-700 border-emerald-100 font-bold rounded-full text-[9px] uppercase">
                      {record.type}
                    </Badge>
                  </div>

                  <Card className="border-none bg-white rounded-[32px] shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-[#1A1A1A] group-hover:text-emerald-600 transition-colors">{record.diagnosis}</h2>
                            <ArrowUpRight className="w-4 h-4 text-gray-200 group-hover:text-emerald-600 transition-colors" />
                          </div>
                          <p className="text-sm font-bold text-gray-400">Pet: <span className="text-[#1A1A1A]">{record.pet}</span> • {record.doctor}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        {record.prescription && (
                          <Button 
                            onClick={() => handleDownloadDocument('Prescription', record)}
                            variant="outline" 
                            size="sm" 
                            className="rounded-2xl border-gray-100 font-black h-10 flex items-center gap-2 text-[11px] text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100 transition-all"
                          >
                            <FileText className="w-3.5 h-3.5" /> Rx Prescription <Printer className="w-3 h-3 ml-1 opacity-40" />
                          </Button>
                        )}
                        {record.labReport && (
                          <Button 
                            onClick={() => handleDownloadDocument('Lab Report', record)}
                            variant="outline" 
                            size="sm" 
                            className="rounded-2xl border-gray-100 font-black h-10 flex items-center gap-2 text-[11px] text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100 transition-all"
                          >
                            <Stethoscope className="w-3.5 h-3.5" /> Lab Results <Printer className="w-3 h-3 ml-1 opacity-40" />
                          </Button>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1">
                          Status: <span className={cn(
                            record.status === "Resolved" || record.status === "Completed" ? "text-emerald-600" : "text-amber-500"
                          )}>{record.status}</span>
                        </span>
                        <button className="text-xs font-black text-emerald-600 flex items-center gap-1 hover:underline">
                          View Details
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                <ClipboardList className="w-16 h-16 text-gray-300 mb-4" />
                <p className="font-black text-gray-400 uppercase tracking-widest">No records found</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-12 text-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-gray-100">
            <ClipboardList className="w-6 h-6 text-gray-200" />
          </div>
          <p className="mt-3 text-xs font-black text-gray-300 uppercase tracking-widest">End of Timeline</p>
        </div>
      </main>
    </div>
  )
}
