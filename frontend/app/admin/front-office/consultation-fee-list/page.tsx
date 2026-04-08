"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ArrowLeft, RefreshCw, FileText, Trash2, Receipt, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Badge } from "@/components/ui/badge"

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
      
      // Determine if we should filter by doctor
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

  return (
    <PrivateRoute modulePath="admin/front-office/consultation" action="view">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultation Fee List</h1>
              <p className="text-gray-600">View and manage all consultation fee records</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={fetchConsultations} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filters & Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by Patient Name, ID or Doctor..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* List Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold w-[120px]">Date of Consultation</TableHead>
                      <TableHead className="font-semibold w-[150px]">Patient name</TableHead>
                      <TableHead className="font-semibold w-[130px]">Patient ID</TableHead>
                      <TableHead className="font-semibold min-w-[250px]">Consulation Status</TableHead>
                      <TableHead className="font-semibold w-[180px]">Service / Product</TableHead>
                      <TableHead className="font-semibold w-[150px]">Doctors</TableHead>
                      <TableHead className="font-semibold w-[120px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                          Loading consultation records...
                        </TableCell>
                      </TableRow>
                    ) : filteredConsultations.length > 0 ? (
                      filteredConsultations.map((item) => {
                        let parsedServices = []
                        if (item.services) {
                          try {
                            parsedServices = typeof item.services === 'string' ? JSON.parse(item.services) : item.services
                          } catch (e) { }
                        }
                        const serviceNames = parsedServices.map((s: any) => s.service).join(', ')

                        return (
                          <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="text-gray-600 align-top">
                              {new Date(item.date).toLocaleDateString('en-GB').replace(/\//g, '-')}
                            </TableCell>
                            <TableCell className="font-medium align-top">
                              {item.patientName}
                            </TableCell>
                            <TableCell className="text-gray-600 align-top">
                              {item.patientRegistrationId || item.consultationId}
                            </TableCell>
                            <TableCell className="text-gray-700 align-top max-w-sm whitespace-pre-wrap">
                              {item.consultationStatus || '-'}
                            </TableCell>
                            <TableCell className="text-gray-700 align-top">
                              {serviceNames || '-'}
                            </TableCell>
                            <TableCell className="align-top">
                              <span className="font-medium text-gray-800">{item.doctorName}</span>
                            </TableCell>
                            <TableCell className="align-top text-center">
                              <div className="flex items-center gap-1 justify-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() => router.push(`/admin/front-office/consultation?patientId=${item.patientRegistrationId}`)}
                                  title="Add Report / Consultation"
                                >
                                  <Plus className="h-5 w-5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => router.push(`/admin/manager/patient-bill-discuss/${item.patientRegistrationId}`)}
                                  title="Bill Discussion"
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
                        <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                          <div className="flex flex-col items-center">
                            <FileText className="h-12 w-12 text-gray-200 mb-4" />
                            <p className="text-lg font-medium">No results found</p>
                            <p className="text-sm">Try adjusting your search terms</p>
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
      </div>
    </PrivateRoute>
  )
}
