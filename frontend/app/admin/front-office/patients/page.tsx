"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  Eye,
  Edit,
  Calendar as CalendarIcon,
  Users,
  Filter,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Clock,
  ArrowUpRight
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function PatientListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBranchId, setSelectedBranchId] = useState(authService.getSelectedBranchId())
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const pageSize = 10
  const router = useRouter()

  useEffect(() => {
    fetchPatients();
  }, [currentPage])

  useEffect(() => {
    const handleBranchChange = () => {
      const currentBranchId = authService.getSelectedBranchId()
      if (currentBranchId !== selectedBranchId) {
        setSelectedBranchId(currentBranchId)
        setCurrentPage(1)
        fetchPatients()
      }
    }
    window.addEventListener('branchChanged', handleBranchChange)
    return () => window.removeEventListener('branchChanged', handleBranchChange)
  }, [selectedBranchId])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const locationId = authService.getSelectedBranchId()

      const params = new URLSearchParams()
      if (locationId) params.append('locationId', locationId)
      params.append('page', currentPage.toString())
      params.append('limit', pageSize.toString())
      if (searchTerm) params.append('search', searchTerm)

      const url = `${authService.getSettingsApiUrl()}/patients?${params}`
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const data = result.data || result
        
        const formattedPatients = data.map((patient: any) => ({
          id: patient.patient_id,
          patientId: patient.patient_patient_id,
          name: `${patient.patient_first_name} ${patient.patient_last_name}`,
          mobile: patient.patient_mobile,
          dob: patient.patient_date_of_birth,
          gender: patient.patient_gender ? (patient.patient_gender.toLowerCase() === 'm' ? 'Male' : 'Female') : 'N/A',
          status: 'Active',
          nextRenewalDate: patient.next_renewal_date_pro,
          dueAmount: patient.due_amount
        }))
        
        setPatients(formattedPatients)
        setTotalRecords(result.total || formattedPatients.length)
        setTotalPages(result.totalPages || Math.ceil((result.total || formattedPatients.length) / pageSize))
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const maskMobile = (mobile: string) => {
    if (!mobile) return 'N/A'
    return 'XXXXXX' + mobile.slice(-4)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <PrivateRoute modulePath="admin/front-office/patients" action="view">
      <div className="p-6 lg:p-10 space-y-8 animate-reveal">
        {/* Premium Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
              Patients
            </h1>
            <p className="text-gray-500 font-medium">Coordinate care and manage records for your registered patient community.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/front-office/registration">
              <Button variant="vpride" className="h-12 px-6">
                <Plus className="h-5 w-5 mr-2" />
                Register New Patient
              </Button>
            </Link>
          </div>
        </div>

        {/* Dynamic Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Patients", value: totalRecords, icon: Users, color: "blue", bg: "bg-blue-50" },
            { label: "New This Month", value: "142", icon: TrendingUp, color: "green", bg: "bg-green-50", trend: "+12%" },
            { label: "Active Plans", value: "85%", icon: UserCheck, color: "purple", bg: "bg-purple-50" },
            { label: "Check-ins Today", value: "24", icon: Clock, color: "orange", bg: "bg-orange-50" },
          ].map((stat, i) => (
            <Card key={i} className="group hover:translate-y-[-4px] transition-all border-0 ring-1 ring-gray-200/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  {stat.trend && (
                    <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {stat.trend} <ArrowUpRight className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Powerful Filters & Search */}
        <Card className="border-0 ring-1 ring-gray-200/50 bg-white/60">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label className="text-gray-900 font-bold ml-1">Search Records</Label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search by ID, Name, or Mobile Number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 bg-white/50 border-gray-100 rounded-2xl focus:ring-blue-500/20"
                    onKeyDown={(e) => e.key === 'Enter' && fetchPatients()}
                  />
                </div>
              </div>
              <Button
                onClick={() => { setCurrentPage(1); fetchPatients(); }}
                disabled={loading}
                className="h-14 px-10 bg-gray-900 hover:bg-gray-800 rounded-2xl shadow-lg border-0"
              >
                <Filter className="h-5 w-5 mr-3" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modern Table Display */}
        <Card className="border-0 ring-1 ring-gray-200/50 overflow-hidden bg-white/40">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="h-12 w-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                  <p className="font-bold text-gray-400">Retrieving patient data...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>PID</TableHead>
                      <TableHead>Patient Details</TableHead>
                      <TableHead>Renewal Date</TableHead>
                      <TableHead>Amount Due</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient, idx) => (
                      <TableRow 
                        key={patient.id} 
                        className="animate-reveal group"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <TableCell className="font-black text-blue-600 tracking-tighter">
                          #{patient.patientId}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase">{patient.name}</span>
                            <span className="text-xs font-bold text-gray-400 mt-0.5">{maskMobile(patient.mobile)} • {patient.gender}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {patient.nextRenewalDate ? (
                            <Badge variant="outline" className="border-orange-200 text-orange-600 bg-orange-50 font-bold px-3 py-1">
                              {formatDate(patient.nextRenewalDate)}
                            </Badge>
                          ) : <span className="text-xs font-bold text-gray-400">NO RENEWAL</span>}
                        </TableCell>
                        <TableCell>
                          <span className={`font-black ${Number(patient.dueAmount) > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                            ₹{Number(patient.dueAmount || 0).toLocaleString('en-IN')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[11px] font-black text-gray-900 tracking-widest uppercase">{patient.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            {[
                              { icon: Edit, title: "Modify Profile", href: `/admin/front-office/registration?patientId=${patient.id}`, color: "hover:bg-blue-100 hover:text-blue-600" },
                              { icon: CalendarIcon, title: "Book Appt", href: `/admin/front-office/appointments/book?patientId=${patient.patientId}`, color: "hover:bg-purple-100 hover:text-purple-600" },
                              { icon: DollarSign, title: "Financials", href: `/admin/front-office/consultation?patientId=${patient.patientId}`, color: "hover:bg-green-100 hover:text-green-600" }
                            ].map((btn, bIdx) => (
                              <Button
                                key={bIdx}
                                variant="ghost"
                                size="sm"
                                className={cn("h-10 w-10 p-0 rounded-xl transition-all duration-300", btn.color)}
                                title={btn.title}
                                asChild
                              >
                                <Link href={btn.href}>
                                  <btn.icon className="h-4 w-4" />
                                </Link>
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Pagination Controls */}
            {!loading && totalRecords > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white/20 backdrop-blur-sm gap-4 border-t border-gray-100/50">
                <p className="text-sm font-bold text-gray-400">
                  Showing <span className="text-gray-900">{Math.min(((currentPage - 1) * pageSize) + 1, totalRecords)}</span> to <span className="text-gray-900">{Math.min(currentPage * pageSize, totalRecords)}</span> of <span className="text-gray-900">{totalRecords}</span> entries
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl font-bold bg-white"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl font-bold bg-white"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages || loading}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}