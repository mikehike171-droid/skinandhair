"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2, ArrowLeft } from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"
import authService from "@/lib/authService"
import { Combobox } from "@/components/ui/combobox"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function AddEnquiryPage() {
  const router = useRouter()
  const [enquiryTypes, setEnquiryTypes] = useState<any[]>([])
  const [patientSources, setPatientSources] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    contactNumber: "",
    patientName: "",
    email: "",
    address: "",
    enquiryFor: "",
    enquiryType: "",
    response: "",
    dateToFollow: new Date().toISOString().split('T')[0],
    sourceOfEnquiry: "",
    leadRepresentative: "Admin",
    leadStatus: "Pending",
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [typesData, sourcesData, productsData] = await Promise.all([
          settingsApi.getEnquiryTypes(),
          settingsApi.getPatientSources(),
          settingsApi.getServiceProducts()
        ])
        setEnquiryTypes(typesData)
        setPatientSources(sourcesData)
        setProducts(productsData || [])
      } catch (error) {
        console.error("Error fetching initial data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const locationId = authService.getLocationId()
      const dataToSave = {
        ...formData,
        locationId: locationId ? parseInt(locationId) : null
      }
      await settingsApi.savePatientEnquiry(dataToSave)
      toast.success("Enquiry added successfully!")
      router.push("/admin/front-office/enquiry")
    } catch (error) {
      console.error("Error saving enquiry:", error)
      toast.error("Failed to save enquiry.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PrivateRoute modulePath="admin/front-office" action="add">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Enquiry</h1>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50 py-3 px-6 border-b">
            <CardTitle className="text-xl font-bold text-gray-800">Enquiry Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactNumber" className="text-sm font-semibold">
                    Contact number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactNumber"
                    placeholder="Contact number"
                    value={formData.contactNumber}
                    onChange={(e) => handleChange("contactNumber", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientName" className="text-sm font-semibold">
                    Patient name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="patientName"
                    placeholder="Patient Name"
                    value={formData.patientName}
                    onChange={(e) => handleChange("patientName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold">
                    Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="enquiryFor" className="text-sm font-semibold">
                    Enquiry for <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="enquiryFor"
                    placeholder="Enquiry for..."
                    value={formData.enquiryFor}
                    onChange={(e) => handleChange("enquiryFor", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enquiryType" className="text-sm font-semibold">
                    Enquiry type <span className="text-red-500">*</span>
                  </Label>
                  <Combobox
                    options={enquiryTypes.map(t => ({ label: t.name, value: t.name }))}
                    value={formData.enquiryType}
                    onValueChange={(value) => handleChange("enquiryType", value)}
                    placeholder="-- Select a type --"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="response" className="text-sm font-semibold">
                    Response
                  </Label>
                  <Input
                    id="response"
                    placeholder="Response"
                    value={formData.response}
                    onChange={(e) => handleChange("response", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateToFollow" className="text-sm font-semibold">
                    Date to follow <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateToFollow"
                    type="date"
                    value={formData.dateToFollow}
                    onChange={(e) => handleChange("dateToFollow", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <div className="space-y-2">
                  <Label htmlFor="sourceOfEnquiry" className="text-sm font-semibold">
                    Source of enquiry <span className="text-red-500">*</span>
                  </Label>
                  <Combobox
                    options={patientSources.map(s => ({ label: s.name || s.title, value: s.name || s.title }))}
                    value={formData.sourceOfEnquiry}
                    onValueChange={(value) => handleChange("sourceOfEnquiry", value)}
                    placeholder="-- Select--"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadRepresentative" className="text-sm font-semibold">
                    Lead representative
                  </Label>
                  <Combobox
                    options={[
                      { label: "Admin", value: "Admin" },
                      { label: "Receptionist", value: "Receptionist" },
                      { label: "Manager", value: "Manager" },
                    ]}
                    value={formData.leadRepresentative}
                    onValueChange={(value) => handleChange("leadRepresentative", value)}
                    placeholder="Admin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadStatus" className="text-sm font-semibold">
                    Lead status <span className="text-red-500">*</span>
                  </Label>
                  <Combobox
                    options={[
                      { label: "Pending", value: "Pending" },
                      { label: "In Progress", value: "In Progress" },
                      { label: "Completed", value: "Completed" },
                    ]}
                    value={formData.leadStatus}
                    onValueChange={(value) => handleChange("leadStatus", value)}
                    placeholder="Pending"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="bg-[#00b574] hover:bg-[#009c63] text-white px-8 h-11"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-5 w-5 mr-2" />
                  )}
                  Save Enquiry
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}
