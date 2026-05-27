"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  ArrowLeft, 
  RefreshCw, 
  FileText, 
  Receipt, 
  Plus, 
  TrendingUp, 
  Users, 
  Clock, 
  ChevronRight,
  Stethoscope
} from "lucide-react"
import { useRouter } from "next/navigation"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function ConsultationFeeListPage() {
  const router = useRouter()
  const [consultations, setConsultations] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConsultations()
  }, [])

  const fetchConsultations = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const user = authService.getUserInfo()
      const locationId = authService.getLocationId()
      
      const isDoctor = user?.role?.name?.toLowerCase() === 'doctor' || user?.roleName?.toLowerCase() === 'doctor'
      
      let url = `${authService.getSettingsApiUrl()}/consultation`
      if (isDoctor) {
        url += `/doctor`
      } else if (locationId) {
        url += `?locationId=${locationId}`
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setConsultations(data)
      }
    } catch (error) {
      console.error('Error fetching consultations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredConsultations = consultations.filter(c =>
    c.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.consultationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Operational Metrics
  const totalConsultations = consultations.length
  const uniquePatients = new Set(consultations.map(c => c.patientRegistrationId)).size
  const distinctDoctors = new Set(consultations.map(c => c.doctorName)).size

  return (
    <PrivateRoute modulePath="admin/front-office/consultation" action="view">
      <div className="p-4 sm:p-8 space-y-8 animate-reveal">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Consultation <span className="text-blue-600">Registry</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">Strategic audit of practitioner engagements and patient service flows.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="h-11 rounded-xl bg-white border-gray-200" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button variant="vpride" className="h-11 px-6 rounded-xl shadow-lg" onClick={fetchConsultations} disabled={loading}>
              <RefreshCw className={cn("h-5 w-5 mr-2", loading && "animate-spin")} />
              Sync Records
            </Button>
          </div>
        </div>

        {/* Operational Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: "Total Engagements", value: totalConsultations, icon: FileText, color: "blue", bg: "bg-blue-50" },
            { label: "Distinct Patients", value: uniquePatients, icon: Users, color: "green", bg: "bg-green-50" },
            { label: "Practitioners", value: distinctDoctors, icon: Stethoscope, color: "purple", bg: "bg-purple-50" },
          ].map((stat, i) => (
            <Card key={i} className="group border-0 ring-1 ring-gray-100 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h3>
                  </div>
                  <div className={cn("p-4 rounded-2xl", stat.bg, stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : 'text-purple-600')}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Refined Filter Bar */}
        <Card className="border-0 ring-1 ring-gray-100 bg-white/60 backdrop-blur-sm shadow-sm overflow-visible">
          <CardContent className="p-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by Patient, ID, or Doctor..."
                className="pl-12 h-12 bg-white/50 border-gray-100 rounded-2xl focus:ring-blue-500/10 text-lg font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Premium Consultation Table */}
        <Card className="border-0 ring-1 ring-gray-100 bg-white/40 overflow-hidden shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableHead className="font-black text-[11px] uppercase tracking-widest text-gray-400 py-5 pl-8">Engagement Date</TableHead>
                    <TableHead className="font-black text-[11px] uppercase tracking-widest text-gray-400 py-5">Patient Profile</TableHead>
                    <TableHead className="font-black text-[11px] uppercase tracking-widest text-gray-400 py-5">Service Overview</TableHead>
                    <TableHead className="font-black text-[11px] uppercase tracking-widest text-gray-400 py-5">Assigned Clinician</TableHead>
                    <TableHead className="font-black text-[11px] uppercase tracking-widest text-gray-400 py-5">Engagement Status</TableHead>
                    <TableHead className="font-black text-[11px] uppercase tracking-widest text-gray-400 py-5 text-center px-8">Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-20">
                        <div className="flex flex-col items-center gap-4">
                          <div className="h-10 w-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                          <p className="font-bold text-gray-400 text-sm italic">Synchronizing audit logs...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredConsultations.length > 0 ? (
                    filteredConsultations.map((item, i) => {
                      let parsedServices = []
                      if (item.services) {
                        try {
                          parsedServices = typeof item.services === 'string' ? JSON.parse(item.services) : item.services
                        } catch (e) { }
                      }
                      const serviceNames = parsedServices.map((s: any) => s.service).join(', ')

                      return (
                        <TableRow key={item.id} className="animate-reveal group hover:bg-white/60 transition-colors" style={{ animationDelay: `${i * 30}ms` }}>
                          <TableCell className="pl-8">
                             <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-blue-500" />
                              <span className="font-bold text-gray-900 text-sm">
                                {new Date(item.date).toLocaleDateString('en-GB').replace(/\//g, '-')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-black text-gray-900 uppercase tracking-tighter text-sm">{item.patientName}</p>
                              <p className="text-[10px] font-black text-gray-400 tracking-widest">{item.patientRegistrationId || item.consultationId}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px]">
                              <p className="text-xs font-bold text-gray-700 truncate">{serviceNames || '-'}</p>
                              {parsedServices.length > 1 && (
                                <p className="text-[9px] font-black text-blue-600 uppercase">+{parsedServices.length - 1} More Services</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                             <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                                <Stethoscope className="h-3.5 w-3.5" />
                              </div>
                              <span className="font-bold text-gray-700 text-xs">DR. {item.doctorName?.toUpperCase()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[9px] font-black tracking-widest uppercase bg-gray-50/50 border-gray-100 px-2.5 py-1 rounded-lg">
                              {item.consultationStatus || 'Not Recorded'}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-8">
                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 px-4 hover:bg-blue-50 hover:text-blue-600 text-gray-400 rounded-xl font-bold text-[11px] transition-all"
                                onClick={() => router.push(`/admin/front-office/consultation?patientId=${item.patientRegistrationId}`)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Report
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 hover:bg-emerald-50 hover:text-emerald-600 text-gray-400 rounded-xl"
                                onClick={() => router.push(`/admin/manager/patient-bill-discuss/${item.patientRegistrationId}`)}
                              >
                                <Receipt className="h-5 w-5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-20 text-gray-500">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-6 rounded-3xl bg-gray-50 text-gray-200">
                            <FileText className="h-16 w-16" />
                          </div>
                          <div>
                            <p className="text-xl font-black text-gray-900 uppercase tracking-tighter">No engagements found</p>
                            <p className="text-sm font-bold text-gray-400 italic mt-1">Refine your audit criteria or check back later.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}
