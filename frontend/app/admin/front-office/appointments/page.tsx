"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  CalendarIcon,
  Clock,
  User,
  Stethoscope,
  Phone,
  Mail,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MessageSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  CalendarCheck
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import authService from "@/lib/authService"

const safeFormatDate = (dateString: string, formatStr: string) => {
  try {
    if (!dateString) return 'Invalid Date'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return format(date, formatStr)
  } catch {
    return 'Invalid Date'
  }
}

const formatTime12h = (timeString: string) => {
  try {
    if (!timeString) return ''
    if (timeString.includes('AM') || timeString.includes('PM')) return timeString
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes), 0)
    return format(date, 'hh:mm a')
  } catch {
    return timeString
  }
}

import { BillSummaryWidget } from "@/components/billing/bill-summary-widget"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { appointmentsApi } from "@/lib/appointmentsApi"
import { useRouter } from "next/navigation"

const mockServices = [
  { id: "S001", name: "General Medicine Consultation", price: 500, category: "Consultation" },
  { id: "S002", name: "Cardiology Consultation", price: 800, category: "Consultation" },
  { id: "S003", name: "ECG", price: 200, category: "Investigation" },
  { id: "S004", name: "Blood Test - CBC", price: 300, category: "Lab" },
  { id: "S005", name: "X-Ray Chest", price: 400, category: "Radiology" },
]

export default function FrontOfficeAppointments() {
  const router = useRouter()
  const [fromDate, setFromDate] = useState<Date>(new Date())
  const [toDate, setToDate] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showBillDialog, setShowBillDialog] = useState(false)
  const [billItems, setBillItems] = useState<any[]>([])
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const loadingRef = useRef(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem('appointments_page_loaded')
    if (!alreadyLoaded && !isInitialized) {
      sessionStorage.setItem('appointments_page_loaded', 'true')
      setCurrentUser(authService.getCurrentUser())
      setIsInitialized(true)
      loadAppointments()
    }
    return () => { sessionStorage.removeItem('appointments_page_loaded') }
  }, [])

  const loadAppointments = async (pageNum = page) => {
    if (loading || loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    try {
      const locationId = authService.getLocationId()
      const filters: any = {
        page: pageNum,
        limit: 10,
        locationId: locationId ? parseInt(locationId) : undefined,
        fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
        toDate: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined
      }

      const response = await appointmentsApi.getAppointments(filters)
      setAppointments(response.data || [])
      setPage(response.page || pageNum)
      setTotalPages(response.totalPages || Math.ceil((response.total || 0) / 10))
      setTotalRecords(response.total || 0)
    } catch (error) {
      console.error('Failed to load appointments:', error)
      setAppointments([])
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }

  const updateAppointmentStatusToWaiting = async (appointmentId: string) => {
    try {
      setUpdatingId(appointmentId)
      const token = localStorage.getItem("authToken")
      await fetch(`${authService.getSettingsApiUrl()}/queue/appointments/${appointmentId}/status`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: "waiting" }),
      })
      await loadAppointments(page)
    } catch (error) {
      console.error("Error updating status to waiting:", error)
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed": return "border-green-100 text-green-600 bg-green-50"
      case "scheduled": return "border-blue-100 text-blue-600 bg-blue-50"
      case "in_progress": return "border-yellow-100 text-yellow-600 bg-yellow-50"
      case "completed": return "border-emerald-100 text-emerald-600 bg-emerald-50"
      case "cancelled": return "border-red-100 text-red-600 bg-red-50"
      default: return "border-gray-100 text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="h-3.5 w-3.5" />
      case "scheduled": return <Clock className="h-3.5 w-3.5" />
      case "in_progress": return <Activity className="h-3.5 w-3.5" />
      case "completed": return <CheckCircle className="h-3.5 w-3.5" />
      case "cancelled": return <XCircle className="h-3.5 w-3.5" />
      default: return <AlertCircle className="h-3.5 w-3.5" />
    }
  }

  const addServiceToBill = (service: any) => {
    const existingItem = billItems.find((item) => item.id === service.id)
    if (existingItem) {
      setBillItems(billItems.map((item) =>
        item.id === service.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price - item.discount }
          : item
      ))
    } else {
      setBillItems([...billItems, { id: service.id, name: service.name, price: service.price, quantity: 1, discount: 0, total: service.price, category: service.category }])
    }
  }

  const handleGenerateBill = (billData: any) => {
    console.log("Generating bill:", billData)
    alert("Bill generated successfully!")
    setShowBillDialog(false)
  }

  const handleSaveDraft = (draftData: any) => {
    console.log("Saving draft:", draftData)
    alert("Draft saved successfully!")
  }

  const handleSaveEdit = () => {
    if (editingAppointment) {
      console.log("Updated appointment:", editingAppointment)
      alert("Appointment updated successfully!")
      setShowEditDialog(false)
      setEditingAppointment(null)
      loadAppointments()
    }
  }

  const getPageNumbers = () => {
    const pages = [];
    const windowSize = 7;
    let start = Math.max(1, page - Math.floor(windowSize / 2));
    let end = Math.min(totalPages, start + windowSize - 1);
    if (end - start + 1 < windowSize) start = Math.max(1, end - windowSize + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  return (
    <PrivateRoute modulePath="admin/front-office/appointments" action="view">
      <div className="p-4 sm:p-8 space-y-8 animate-reveal">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Appointments <span className="text-blue-600">Scheduler</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">Orchestrating patient visits and facility bandwidth.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="h-11 rounded-xl bg-white border-gray-200">
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
            <Button variant="vpride" className="h-11 px-6 rounded-xl shadow-lg" onClick={() => router.push('/admin/front-office/appointments/book')}>
              <Plus className="h-5 w-5 mr-2" />
              Book New visit
            </Button>
          </div>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Daily Schedule", value: totalRecords, icon: CalendarCheck, color: "blue", bg: "bg-blue-50" },
            { label: "Today's Checks", value: "48", icon: Activity, color: "green", bg: "bg-green-50" },
            { label: "Wait Time Avg", value: "12m", icon: Clock, color: "purple", bg: "bg-purple-50" },
            { label: "Completed", value: "32", icon: CheckCircle, color: "emerald", bg: "bg-emerald-50" },
          ].map((stat, i) => (
            <Card key={i} className="group border-0 ring-1 ring-gray-100 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className={`p-3 w-12 h-12 rounded-2xl ${stat.bg} ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : stat.color === 'purple' ? 'text-purple-600' : 'text-emerald-600'} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="mt-4">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Refined Filter Bar */}
        <Card className="border-0 ring-1 ring-gray-100 bg-white/60 backdrop-blur-sm overflow-visible">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-1">
                <Label className="font-bold text-gray-500 text-[11px] uppercase tracking-wider">Search Patient</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-11 bg-white/50 border-gray-100 rounded-xl focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <Label className="font-bold text-gray-500 text-[11px] uppercase tracking-wider">Status Category</Label>
                <div className="mt-1">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-11 rounded-xl border-gray-100 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All View</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="font-bold text-gray-500 text-[11px] uppercase tracking-wider">From Date</Label>
                <div className="mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-11 justify-start font-bold rounded-xl border-gray-100 bg-white">
                        <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                        {fromDate ? format(fromDate, "dd/MM/yyyy") : "Select"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl bg-white" align="start">
                      <Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label className="font-bold text-gray-500 text-[11px] uppercase tracking-wider">To Date</Label>
                <div className="mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-11 justify-start font-bold rounded-xl border-gray-100 bg-white">
                        <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                        {toDate ? format(toDate, "dd/MM/yyyy") : "Select"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl bg-white" align="start">
                      <Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-end">
                <Button className="w-full h-11 bg-gray-900 hover:bg-black text-white rounded-xl shadow-lg border-0" onClick={() => loadAppointments(1)}>
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sophisticated Appointments List */}
        <Card className="border-0 ring-1 ring-gray-100 bg-white/40 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="h-10 w-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                  <p className="font-bold text-gray-400 text-sm italic">Synchronizing schedule...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Patient Discovery</TableHead>
                      <TableHead>Clinician</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Operations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appt, i) => (
                      <TableRow key={appt.id} className="animate-reveal group" style={{ animationDelay: `${i * 40}ms` }}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-black text-gray-900 uppercase tracking-tighter text-sm">{appt.patientName}</p>
                              <p className="text-[10px] font-black text-gray-400 tracking-widest">{appt.appointmentNumber}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                              <Stethoscope className="h-3.5 w-3.5" />
                            </div>
                            <span className="font-bold text-gray-700 text-xs">DR. {appt.doctorName.toUpperCase()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                              <CalendarIcon className="h-3.5 w-3.5 text-blue-500" />
                              {safeFormatDate(appt.appointmentDate, 'dd/MM/yyyy')}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                              <Clock className="h-3.2 w-3.2" />
                              {appt.appointmentTime}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-black tracking-widest border-gray-100 bg-gray-50/50 uppercase rounded-lg px-2 py-0.5">
                            {appt.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                           <Badge className={cn("text-[9px] font-black tracking-widest uppercase border-0 flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-lg shadow-sm", getStatusStyle(appt.status))}>
                            <div className={`h-1.5 w-1.5 rounded-full ${appt.status === 'confirmed' ? 'bg-green-600' : 'bg-blue-600'}`} />
                            {appt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                             {["confirmed", "scheduled"].includes(appt.status) && (
                                <Button
                                  size="sm"
                                  className="h-9 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl text-[11px]"
                                  onClick={() => updateAppointmentStatusToWaiting(appt.id)}
                                  disabled={updatingId === appt.id}
                                >
                                  {updatingId === appt.id ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                                  Mark Waiting
                                </Button>
                             )}
                             <Button variant="ghost" size="sm" className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600" onClick={() => router.push(`/admin/caseheetnew?patientId=${appt.patientId}`)}>
                                <FileText className="h-4 w-4" />
                             </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {appointments.length === 0 && !loading && (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No appointments found</p>
              </div>
            )}

            {/* Pagination - Always show if more than 10 records */}
            {!loading && totalRecords > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
                <div className="text-sm text-gray-600">
                  Showing {Math.min(((page - 1) * 10) + 1, totalRecords)} to {Math.min(page * 10, totalRecords)} of {totalRecords} appointments
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadAppointments(page - 1)}
                    disabled={page === 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => loadAppointments(pageNum)}
                        disabled={loading}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadAppointments(page + 1)}
                    disabled={page >= totalPages || loading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bill Dialog */}
        <Dialog open={showBillDialog} onOpenChange={setShowBillDialog}>
          <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                Bill Management - {selectedAppointment?.patientName}
              </DialogTitle>
              <DialogDescription className="text-sm">
                Manage billing for appointment {selectedAppointment?.id}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Patient & Appointment Info */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{selectedAppointment?.patientName}</p>
                        <p className="text-sm text-gray-600">{selectedAppointment?.patientId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-green-600" />
                      <p className="text-sm">{selectedAppointment?.patientPhone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-purple-600" />
                      <p className="text-sm">{selectedAppointment?.patientEmail}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Add Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {mockServices.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => addServiceToBill(service)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{service.name}</p>
                            <p className="text-xs text-gray-600">{service.category}</p>
                          </div>
                          <div className="text-right ml-2">
                            <p className="font-semibold">₹{service.price}</p>
                            <Button size="sm" className="mt-1">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bill Summary Widget */}
              <div>
                <BillSummaryWidget
                  items={billItems}
                  onItemsChange={setBillItems}
                  onGenerateBill={handleGenerateBill}
                  onSaveDraft={handleSaveDraft}
                  showPaymentOptions={true}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBillDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Appointment Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Edit Appointment</DialogTitle>
              <DialogDescription className="text-sm">
                Modify appointment details for {editingAppointment?.patientName}
              </DialogDescription>
            </DialogHeader>

            {editingAppointment && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Patient Name</Label>
                    <Input
                      value={editingAppointment.patientName}
                      onChange={(e) =>
                        setEditingAppointment({
                          ...editingAppointment,
                          patientName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Patient Phone</Label>
                    <Input
                      value={editingAppointment.patientPhone}
                      onChange={(e) =>
                        setEditingAppointment({
                          ...editingAppointment,
                          patientPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Doctor</Label>
                    <Select
                      value={editingAppointment.doctorName}
                      onValueChange={(value) =>
                        setEditingAppointment({
                          ...editingAppointment,
                          doctorName: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr. Priya Sharma">Dr. Priya Sharma</SelectItem>
                        <SelectItem value="Dr. Amit Patel">Dr. Amit Patel</SelectItem>
                        <SelectItem value="Dr. Sunita Gupta">Dr. Sunita Gupta</SelectItem>
                        <SelectItem value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select
                      value={editingAppointment.department}
                      onValueChange={(value) =>
                        setEditingAppointment({
                          ...editingAppointment,
                          department: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="General Medicine">General Medicine</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={editingAppointment.date}
                      onChange={(e) =>
                        setEditingAppointment({
                          ...editingAppointment,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Select
                      value={editingAppointment.time}
                      onValueChange={(value) =>
                        setEditingAppointment({
                          ...editingAppointment,
                          time: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                        <SelectItem value="09:30 AM">09:30 AM</SelectItem>
                        <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                        <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                        <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                        <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                        <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                        <SelectItem value="02:30 PM">02:30 PM</SelectItem>
                        <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                        <SelectItem value="03:30 PM">03:30 PM</SelectItem>
                        <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                        <SelectItem value="04:30 PM">04:30 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={editingAppointment.type}
                      onValueChange={(value) =>
                        setEditingAppointment({
                          ...editingAppointment,
                          type: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="Procedure">Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={editingAppointment.status}
                      onValueChange={(value) =>
                        setEditingAppointment({
                          ...editingAppointment,
                          status: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={editingAppointment.amount}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        amount: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            )}

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="w-full sm:w-auto">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}
