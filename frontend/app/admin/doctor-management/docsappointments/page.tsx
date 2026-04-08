"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Clock, User, Phone, FileText, Search } from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"
import { useRouter } from "next/navigation"

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const getTodayFormatted = () => {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const [fromDate, setFromDate] = useState(getTodayFormatted())
  const [toDate, setToDate] = useState(getTodayFormatted())
  const [fromDateObj, setFromDateObj] = useState<Date>(new Date())
  const [toDateObj, setToDateObj] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")

  const convertToApiFormat = (ddmmyyyy: string) => {
    const [day, month, year] = ddmmyyyy.split('/')
    return `${year}-${month}-${day}`
  }
  const filteredAppointments = appointments.filter((appointment: any) => {
    const matchesSearch = searchTerm === "" ||
      appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientPhone?.includes(searchTerm) ||
      appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  useEffect(() => {
    fetchDoctorAppointments()
  }, [])

  const fetchDoctorAppointments = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")
      const userStr = localStorage.getItem("user")
      const user = userStr ? JSON.parse(userStr) : null

      const params = new URLSearchParams()
      if (fromDate) params.append('fromDate', convertToApiFormat(fromDate))
      if (toDate) params.append('toDate', convertToApiFormat(toDate))

      const response = await fetch(
        `${authService.getSettingsApiUrl()}/consultation/doctor?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      const data = await response.json()
      
      const mappedAppointments = data.map((c: any) => ({
        id: c.id,
        consultationId: c.consultationId,
        patientName: c.patientName,
        patientPhone: c.patientPhone,
        appointmentDate: c.date,
        appointmentTime: new Date(c.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        patientId: c.patientRegistrationId,
        amount: c.amount,
        status: "completed", // Since consultation fee is paid
        type: "Consultation"
      }))

      setAppointments(mappedAppointments)
    } catch (error) {
      console.error("Error fetching consultations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCaseSheetClick = (patientId: string) => {
    router.push(`/admin/caseheetnew?patientId=${patientId}`)
  }



  if (loading) {
    return (
      <PrivateRoute modulePath="admin/doctor-management" action="view">
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </PrivateRoute>
    )
  }

  return (
    <PrivateRoute modulePath="admin/doctor-management" action="view">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Consultations</h1>
          <p className="text-gray-600">View and manage your consultation records</p>
        </div>


        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Date Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>From Date (DD/MM/YYYY)</Label>
                <div className="relative">
                  <input
                    id="fromDatePicker"
                    type="date"
                    value={fromDateObj.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const date = new Date(e.target.value)
                      setFromDateObj(date)
                      const day = String(date.getDate()).padStart(2, '0')
                      const month = String(date.getMonth() + 1).padStart(2, '0')
                      const year = date.getFullYear()
                      setFromDate(`${day}/${month}/${year}`)
                    }}
                    style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                  />
                  <Input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={fromDate}
                    readOnly
                    className="w-full cursor-pointer"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>To Date (DD/MM/YYYY)</Label>
                <div className="relative">
                  <input
                    id="toDatePicker"
                    type="date"
                    value={toDateObj.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const date = new Date(e.target.value)
                      setToDateObj(date)
                      const day = String(date.getDate()).padStart(2, '0')
                      const month = String(date.getMonth() + 1).padStart(2, '0')
                      const year = date.getFullYear()
                      setToDate(`${day}/${month}/${year}`)
                    }}
                    style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                  />
                  <Input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={toDate}
                    readOnly
                    className="w-full cursor-pointer"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={fetchDoctorAppointments} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Consultations ({filteredAppointments.length})</CardTitle>
                <CardDescription>All your paid patient consultations</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search consultations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No consultations found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment: any) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.patientName}</p>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {appointment.patientPhone}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-purple-600" />
                            <div>
                              <p className="font-medium">
                                {appointment.appointmentDate
                                  ? new Date(appointment.appointmentDate).toLocaleDateString('en-GB')
                                  : "N/A"}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {appointment.appointmentTime || "N/A"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{appointment.type || "consultation"}</Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">{appointment.notes || "-"}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Case Sheet"
                              onClick={() => handleCaseSheetClick(appointment.patientId)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}
