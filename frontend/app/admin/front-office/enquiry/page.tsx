"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, Phone, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"
import authService from "@/lib/authService"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { format, parseISO } from "date-fns"

export default function EnquiryListPage() {
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Filter states
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    enquiryFor: "",
    leadRepresentative: "",
    enquiryType: "",
    sourceOfEnquiry: ""
  })

  // Dropdown data states
  const [enquiryTypes, setEnquiryTypes] = useState<any[]>([])
  const [patientSources, setPatientSources] = useState<any[]>([])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [types, sources] = await Promise.all([
          settingsApi.getEnquiryTypes(),
          settingsApi.getPatientSources()
        ])
        setEnquiryTypes(types)
        setPatientSources(sources)
      } catch (error) {
        console.error("Error fetching filter data:", error)
      }
    }
    fetchInitialData()
  }, [])

  const fetchEnquiries = async () => {
    setIsLoading(true)
    try {
      const locationId = authService.getLocationId()
      const response = await settingsApi.getPatientEnquiries({
        location_id: locationId ? parseInt(locationId) : undefined,
        ...filters,
        page: currentPage,
        limit: itemsPerPage
      })
      
      setEnquiries(response.data || [])
      setTotalItems(response.total || 0)
    } catch (error) {
      console.error("Error fetching enquiries:", error)
      setEnquiries([])
      setTotalItems(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [currentPage])

  const handleFilterClick = () => {
    if (currentPage === 1) {
      fetchEnquiries()
    } else {
      setCurrentPage(1)
    }
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleDateChange = (field: string, date?: Date) => {
    const dateString = date ? format(date, "yyyy-MM-dd") : ""
    setFilters(prev => ({ ...prev, [field]: dateString }))
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <PrivateRoute modulePath="admin/front-office" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Patient Enquiries</h1>
          <Button asChild className="bg-[#00b574] hover:bg-[#009c63] text-white">
            <Link href="/admin/front-office/enquiry/add">
              <Plus className="h-5 w-5 mr-2" />
              Add Enquiry
            </Link>
          </Button>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="bg-gray-50 py-3 px-6 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-800">Enquiry List</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 items-end">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-gray-500">From Date</Label>
                <DatePicker
                  date={filters.startDate ? parseISO(filters.startDate) : undefined}
                  setDate={(date) => handleDateChange("startDate", date)}
                  placeholder="DD/MM/YYYY"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-gray-500">To Date</Label>
                <DatePicker
                  date={filters.endDate ? parseISO(filters.endDate) : undefined}
                  setDate={(date) => handleDateChange("endDate", date)}
                  placeholder="DD/MM/YYYY"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-gray-500">Enquiry For</Label>
                <Input
                  placeholder="Service / Product"
                  value={filters.enquiryFor}
                  onChange={(e) => handleFilterChange("enquiryFor", e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-gray-500">Lead Rep</Label>
                <Combobox
                  options={[
                    { label: "All", value: "" },
                    { label: "Admin", value: "Admin" },
                    { label: "Receptionist", value: "Receptionist" },
                    { label: "Manager", value: "Manager" },
                  ]}
                  value={filters.leadRepresentative}
                  onValueChange={(value) => handleFilterChange("leadRepresentative", value)}
                  placeholder="Select Rep"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-gray-500">Enquiry Type</Label>
                <Combobox
                  options={[
                    { label: "All", value: "" },
                    ...enquiryTypes.map(t => ({ label: t.name, value: t.name }))
                  ]}
                  value={filters.enquiryType}
                  onValueChange={(value) => handleFilterChange("enquiryType", value)}
                  placeholder="Select Type"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-gray-500">Source</Label>
                <Combobox
                  options={[
                    { label: "All", value: "" },
                    ...patientSources.map(s => ({ label: s.name || s.title, value: s.name || s.title }))
                  ]}
                  value={filters.sourceOfEnquiry}
                  onValueChange={(value) => handleFilterChange("sourceOfEnquiry", value)}
                  placeholder="Select Source"
                  className="h-9"
                />
              </div>
              <Button 
                onClick={handleFilterClick}
                className="bg-[#9333ea] hover:bg-[#7e22ce] text-white h-9"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Enquiry For</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Follow Up</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mr-2 inline text-primary" />
                        Loading enquiries...
                      </TableCell>
                    </TableRow>
                  ) : enquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No enquiries found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    enquiries.map((enquiry) => (
                      <TableRow key={enquiry.id}>
                        <TableCell className="font-medium text-gray-900">{enquiry.patientName}</TableCell>
                        <TableCell className="text-gray-600 font-mono text-sm">
                          {enquiry.contactNumber && enquiry.contactNumber.length >= 4 
                            ? `XXXXXX${enquiry.contactNumber.slice(-4)}`
                            : enquiry.contactNumber}
                        </TableCell>
                        <TableCell className="text-gray-600">{enquiry.enquiryFor}</TableCell>
                        <TableCell className="text-gray-600">{enquiry.sourceOfEnquiry}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                            enquiry.leadStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                            enquiry.leadStatus === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {enquiry.leadStatus}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {enquiry.dateToFollow 
                            ? new Date(enquiry.dateToFollow).toLocaleDateString('en-GB') 
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                            title="Call Patient"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Link href={`/admin/telecaller/call-patient?enquiryId=${enquiry.id}`}>
                              <Phone className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination UI */}
            {!isLoading && totalItems > 0 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to{" "}
                  <span className="font-semibold">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
                  <span className="font-semibold">{totalItems}</span> results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 p-0 ${currentPage === page ? 'bg-primary' : ''}`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
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
