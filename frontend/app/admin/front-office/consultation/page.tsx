"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign, User, Stethoscope, ArrowLeft, CreditCard, Plus, Trash2, Search, ChevronDown, CheckCircle2, Printer, List, FileText, History, Image as ImageIcon, Pill, Receipt } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ConsultationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get('patientId')
  
  const [patient, setPatient] = useState<any>(null)
  const [doctors, setDoctors] = useState<any[]>([])
  const [consultationFees, setConsultationFees] = useState<any[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [doctorSearch, setDoctorSearch] = useState("")
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false)
  const [consultationFee, setConsultationFee] = useState("")
  const [payments, setPayments] = useState<{type: string, amount: string}[]>([{type: "cash", amount: ""}])
  const [loading, setLoading] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)
  const [showReceipt, setShowReceipt] = useState(false)

  // New Clinical Detail States
  const [consultationStatus, setConsultationStatus] = useState("")
  const [patientHistory, setPatientHistory] = useState("")
  const [doctorObservation, setDoctorObservation] = useState("")
  const [prescriptionNotes, setPrescriptionNotes] = useState("")
  const [services, setServices] = useState<any[]>([{ service: "", quantity: 1, days: "" }])
  const [serviceOptions, setServiceOptions] = useState<any[]>([])
  const [activeServiceDropdown, setActiveServiceDropdown] = useState<number | null>(null)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [examinationId, setExaminationId] = useState<number | null>(null)
  const [existingImages, setExistingImages] = useState<string[]>([])

  useEffect(() => {
    if (patientId) {
      fetchPatientDetails()
      fetchDoctors()
      fetchConsultationFees()
      fetchServiceOptions()
    }
  }, [patientId])

  useEffect(() => {
    if (patient?.id) {
       fetchPatientExamination(patient.id)
    }
  }, [patient?.id])

  const fetchPatientExamination = async (actualPatientId: number) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${actualPatientId}/latest`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data && data.id) {
          setExaminationId(data.id)
          if (data.services && Array.isArray(data.services) && data.services.length > 0) {
            setServices(data.services)
          }
          setConsultationStatus(data.consultationStatus || "")
          setPatientHistory(data.patientHistory || "")
          setDoctorObservation(data.doctorObservation || "")
          
          if (data.file) {
             try {
                const files = JSON.parse(data.file)
                if (Array.isArray(files)) setExistingImages(files)
             } catch(e) {}
          }
        }
      }
    } catch (error) {
      console.error('Error fetching examination:', error)
    }
  }

  const fetchServiceOptions = async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/service-product`)
      if (response.ok) {
        const data = await response.json()
        setServiceOptions(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const fetchPatientDetails = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patients/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const patientData = await response.json()
        setPatient(patientData)
      }
    } catch (error) {
      console.error('Error fetching patient:', error)
    }
  }

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const locationId = userData.locationId || userData.primary_location_id || 1
      
      const response = await fetch(`${authService.getSettingsApiUrl()}/doctors/users?locationId=${locationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const doctorsData = await response.json()
        setDoctors(doctorsData)
      }
    } catch (error) {
      console.error('Error fetching doctors:', error)
    }
  }

  const fetchConsultationFees = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const locationId = userData.locationId || userData.primary_location_id || 1
      
      const response = await fetch(`${authService.getSettingsApiUrl()}/doctors/consultation-fees?locationId=${locationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const feesData = await response.json()
        setConsultationFees(feesData)
      }
    } catch (error) {
      console.error('Error fetching consultation fees:', error)
    }
  }

  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.first_name || doctor.firstName} ${doctor.last_name || doctor.lastName}`.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    doctor.username.toLowerCase().includes(doctorSearch.toLowerCase())
  )

  const selectDoctor = (doctor: any) => {
    setSelectedDoctor(doctor)
    setDoctorSearch(`${doctor.first_name || doctor.firstName} ${doctor.last_name || doctor.lastName}`.trim())
    setShowDoctorDropdown(false)
    const fee = consultationFees.find(f => f.userId?.toString() === doctor.id?.toString())
    setConsultationFee(fee?.cashFee?.toString() || "")
  }

  const handleDoctorSearch = (value: string) => {
    setDoctorSearch(value)
    setShowDoctorDropdown(true)
  }

  const addPayment = () => {
    setPayments([...payments, {type: "cash", amount: ""}])
  }

  const removePayment = (index: number) => {
    if (payments.length > 1) {
      setPayments(payments.filter((_, i) => i !== index))
    }
  }

  const updatePayment = (index: number, field: 'type' | 'amount', value: string) => {
    const updatedPayments = [...payments]
    updatedPayments[index][field] = value
    setPayments(updatedPayments)
  }

  const getTotalAmount = () => {
    return payments.reduce((total, payment) => total + (parseFloat(payment.amount) || 0), 0)
  }

  const handleSubmit = async () => {
    const validPayments = payments.filter(p => p.amount && parseFloat(p.amount) > 0)
    
    if (!selectedDoctor || !consultationFee || validPayments.length === 0) {
      alert('Please select doctor, enter consultation fee, and add at least one payment')
      return
    }

    const totalPayments = getTotalAmount()
    const consultationAmount = parseFloat(consultationFee)
    
    if (totalPayments !== consultationAmount) {
      alert(`Payment total (₹${totalPayments}) must equal consultation fee (₹${consultationAmount})`)
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const locationId = authService.getLocationId()
      const url = `${authService.getSettingsApiUrl()}/consultation${locationId ? `?locationId=${locationId}` : ''}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patient.id,
          doctorId: selectedDoctor.id,
          consultationFee: consultationAmount,
          payments: validPayments
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setReceiptData({
          ...result.consultation,
          patientName: `${patient.salutation}. ${patient.first_name} ${patient.last_name}`,
          patientId: patient.patient_id,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString()
        })
        setShowReceipt(true)
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to record consultation fee')
      }
    } catch (error) {
      console.error('Error recording consultation:', error)
      alert('Failed to record consultation fee')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConsultation = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('authToken')
      const locationId = authService.getLocationId() || 1
      
      const payload = {
        patientId: patient.id,
        locationId: locationId,
        services: services.filter(s => s.service.trim() !== ''),
        consultationStatus,
        patientHistory,
        doctorObservation,
      };

      const method = examinationId ? 'PUT' : 'POST';
      const url = examinationId 
        ? `${authService.getSettingsApiUrl()}/patient-examination/${examinationId}`
        : `${authService.getSettingsApiUrl()}/patient-examination`;

      const examinationResponse = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!examinationResponse.ok) {
        throw new Error('Failed to save consultation details');
      }

      const examinationData = await examinationResponse.json();
      const currentExamId = examinationId || examinationData.id;

      if (uploadedImages.length > 0) {
        const formData = new FormData();
        uploadedImages.forEach((file) => {
          formData.append('files', file);
        });

        const uploadResponse = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamId}/upload-reports`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          console.error('Failed to upload images');
        }
      }

      alert('Consultation saved successfully!');
      router.push('/admin/front-office/consultation-fee-list');
    } catch (error) {
      console.error('Error saving consultation:', error)
      alert('Failed to save consultation')
    } finally {
      setIsSaving(false)
    }
  }

  const calculateAge = (dob: string) => {
    const today = new Date()
    const birthDate = new Date(dob)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1
    }
    return age
  }

  if (!patient) {
    return <div className="p-6">Loading patient details...</div>
  }

  return (
    <PrivateRoute modulePath="admin/front-office/consultation" action="add">
      <div className="min-h-screen bg-gray-50">
        <div className="">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultation Fee</h1>
              <p className="text-gray-600">Record consultation fee for the patient</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/front-office/consultation-fee-list')}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                View List
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/admin/manager/patient-bill-discuss/${patientId}`)}
                className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
              >
                <Receipt className="h-4 w-4" />
                Bill
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Patient Information Card */}
            <Card className="h-fit" data-slot="card">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white" style={{padding: '5px'}}>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Avatar and Name */}
                  <div className="flex items-center gap-4 min-w-[300px]">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {patient.salutation}. {patient.first_name} {patient.last_name}
                      </h3>
                      <p className="text-gray-600">ID: {patient.patient_id}</p>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="flex-1 flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-8 justify-around border-t md:border-t-0 md:border-l pt-4 md:pt-0 pl-0 md:pl-8">
                    <div className="text-center md:text-left">
                      <Label className="text-sm text-gray-500 block mb-1">Age</Label>
                      <p className="font-medium text-lg">{calculateAge(patient.date_of_birth)} Yrs</p>
                    </div>
                    <div className="text-center md:text-left">
                      <Label className="text-sm text-gray-500 block mb-1">Gender</Label>
                      <Badge variant={patient.gender.toLowerCase() === 'm' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                        {patient.gender.toLowerCase() === 'm' ? 'Male' : 'Female'}
                      </Badge>
                    </div>
                    <div className="text-center md:text-left">
                      <Label className="text-sm text-gray-500 block mb-1">Mobile</Label>
                      <p className="font-medium text-lg">{patient.mobile || patient.phone || 'N/A'}</p>
                    </div>
                    <div className="text-center md:text-left">
                      <Label className="text-sm text-gray-500 block mb-1">DOB</Label>
                      <p className="font-medium text-lg">{new Date(patient.date_of_birth).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>

          {/* Clinical Details: Single Page Layout */}
          <div className="mt-6">
            <Card>
              <CardHeader className="bg-white border-b pt-4 pb-4 rounded-t-xl">
                <CardTitle className="text-xl">Clinical Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-10">
                  
                  {/* Select Service / Product First */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                      <Pill className="h-5 w-5 text-blue-600" />
                      Services & Products
                    </Label>
                    <div className="border rounded-md bg-gray-50/50">
                      <div className="grid grid-cols-12 gap-4 p-3 bg-gray-100 border-b text-sm font-semibold text-gray-700">
                        <div className="col-span-6 lg:col-span-7 pl-2">Select Service / Product</div>
                        <div className="col-span-3 lg:col-span-2 text-center">Days</div>
                        <div className="col-span-3 lg:col-span-3 text-center">Quantity</div>
                      </div>

                      {services.map((serviceItem, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 p-3 border-b items-center bg-white">
                          <div className="col-span-6 lg:col-span-7 flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-400 hover:text-gray-600 shrink-0 hidden sm:flex cursor-grab active:cursor-grabbing"
                            >
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90"><path d="M5.5 4.625C6.12132 4.625 6.625 4.12132 6.625 3.5C6.625 2.87868 6.12132 2.375 5.5 2.375C4.87868 2.375 4.375 2.87868 4.375 3.5C4.375 4.12132 4.87868 4.625 5.5 4.625ZM9.5 4.625C10.1213 4.625 10.625 4.12132 10.625 3.5C10.625 2.87868 10.1213 2.375 9.5 2.375C8.87868 2.375 8.375 2.87868 8.375 3.5C8.375 4.12132 8.87868 4.625 9.5 4.625ZM10.625 7.5C10.625 8.12132 10.1213 8.625 9.5 8.625C8.87868 8.625 8.375 8.12132 8.375 7.5C8.375 6.87868 8.87868 6.375 9.5 6.375C10.1213 6.375 10.625 6.87868 10.625 7.5ZM5.5 8.625C6.12132 8.625 6.625 8.12132 6.625 7.5C6.625 6.87868 6.12132 6.375 5.5 6.375C4.87868 6.375 4.375 6.87868 4.375 7.5C4.375 8.12132 4.87868 8.625 5.5 8.625ZM10.625 11.5C10.625 12.1213 10.1213 12.625 9.5 12.625C8.87868 12.625 8.375 12.1213 8.375 11.5C8.375 10.87868 8.87868 10.375 9.5 10.375C10.1213 10.375 10.625 10.87868 10.625 11.5ZM5.5 12.625C6.12132 12.625 6.625 12.1213 6.625 11.5C6.625 10.87868 6.12132 10.375 5.5 10.375C4.87868 10.375 4.375 10.87868 4.375 11.5C4.375 12.1213 4.87868 12.625 5.5 12.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                            </Button>
                            {services.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setServices(services.filter((_, i) => i !== index))}
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {/* Autocomplete Combobox Custom UI */}
                            <div className="relative w-full">
                              <div className="relative">
                                <Input 
                                  placeholder="Service (Autocomplete)" 
                                  value={serviceItem.service}
                                  onChange={(e) => {
                                    const newServices = [...services]
                                    newServices[index].service = e.target.value
                                    setServices(newServices)
                                  }}
                                  onFocus={() => setActiveServiceDropdown(index)}
                                  onBlur={() => setTimeout(() => setActiveServiceDropdown(null), 200)}
                                  className="w-full h-10 border-gray-400 focus:border-green-500 focus:ring-green-500 shadow-sm pr-10"
                                />
                                <div 
                                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-500 hover:text-gray-700"
                                  onClick={() => setActiveServiceDropdown(activeServiceDropdown === index ? null : index)}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </div>
                              </div>
                              
                              {activeServiceDropdown === index && (
                                <div className="absolute z-50 w-full mt-1 bg-[#fefce8] border border-gray-300 rounded-sm shadow-md max-h-40 overflow-y-auto">
                                  {(() => {
                                    const filteredOpts = serviceItem.service 
                                      ? serviceOptions.filter(opt => opt.name.toLowerCase().includes(serviceItem.service.toLowerCase())) 
                                      : serviceOptions;
                                      
                                    if (filteredOpts.length > 0) {
                                      return filteredOpts.map((opt) => (
                                        <div
                                          key={opt.id}
                                          className="px-3 py-2 cursor-pointer hover:bg-gray-200 text-sm text-gray-900 border-b border-gray-100 last:border-0"
                                          onMouseDown={(e) => {
                                            e.preventDefault(); // Prevent input from losing focus immediately
                                            const newServices = [...services]
                                            newServices[index].service = opt.name
                                            newServices[index].price = opt.amount
                                            setServices(newServices)
                                            setActiveServiceDropdown(null)
                                          }}
                                        >
                                          {opt.name}
                                        </div>
                                      ));
                                    } else {
                                      return <div className="px-3 py-2 text-sm text-gray-500 italic">No matches found</div>;
                                    }
                                  })()}
                                </div>
                              )}
                            </div>

                          </div>
                          <div className="col-span-3 lg:col-span-2 text-center">
                            {(() => {
                              const opt = serviceOptions.find(o => o.name === serviceItem.service);
                              if (opt?.type === 'Product') {
                                return (
                                  <Input 
                                    type="number" 
                                    placeholder="Days" 
                                    value={serviceItem.days || ""}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      const newServices = [...services];
                                      newServices[index].days = val;
                                      // Auto-calculate quantity based on days (assuming 1 per day if not specified otherwise)
                                      if (val) {
                                        newServices[index].quantity = parseInt(val) || 1;
                                      }
                                      setServices(newServices);
                                    }}
                                    className="w-full text-center h-10 border-gray-400 shadow-sm"
                                  />
                                );
                              }
                              return <span className="text-gray-400">-</span>;
                            })()}
                          </div>
                          <div className="col-span-3 lg:col-span-3 text-center">
                            <Input 
                              type="number" 
                              placeholder="Quantity" 
                              value={serviceItem.quantity}
                              onChange={(e) => {
                                const newServices = [...services]
                                newServices[index].quantity = parseInt(e.target.value) || 1
                                setServices(newServices)
                              }}
                              className="w-full text-center h-10 border-gray-400 shadow-sm"
                            />
                          </div>
                        </div>
                      ))}
                      
                      <div className="p-3 bg-white flex justify-end">
                        <Button 
                          type="button" 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-medium"
                          onClick={() => setServices([...services, { service: "", quantity: 1, days: "" }])}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add service
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Consultation Status */}
                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Consultation Status
                    </Label>
                    <Textarea 
                      placeholder="Write consultation status and general notes here..." 
                      className="min-h-[120px] shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                      value={consultationStatus}
                      onChange={(e) => setConsultationStatus(e.target.value)}
                    />
                  </div>
                  
                  {/* Patient History */}
                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                      <History className="h-5 w-5 text-blue-600" />
                      Patient History
                    </Label>
                    <Textarea 
                      placeholder="Write patient history and previous medical conditions here..." 
                      className="min-h-[120px] shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                      value={patientHistory}
                      onChange={(e) => setPatientHistory(e.target.value)}
                    />
                  </div>

                  {/* Doctor Observation */}
                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                      <Stethoscope className="h-5 w-5 text-blue-600" />
                      Doctor Observation
                    </Label>
                    <Textarea 
                      placeholder="Write clinical observations and findings here..." 
                      className="min-h-[120px] shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                      value={doctorObservation}
                      onChange={(e) => setDoctorObservation(e.target.value)}
                    />
                  </div>

                  {/* Upload Images */}
                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                      <ImageIcon className="h-5 w-5 text-blue-600" />
                      Upload Images
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-blue-50 hover:border-blue-400 transition-colors cursor-pointer group bg-gray-50/50"
                         onClick={() => document.getElementById('image-upload')?.click()}>
                      <div className="mx-auto flex justify-center mb-4">
                        <div className="p-4 bg-white shadow-sm border border-gray-100 rounded-full group-hover:shadow-md transition-shadow">
                          <ImageIcon className="h-8 w-8 text-blue-500" />
                        </div>
                      </div>
                      <p className="text-base font-medium text-gray-900 mb-1">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                      <input 
                        id="image-upload" 
                        type="file" 
                        className="hidden" 
                        multiple 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files) {
                            setUploadedImages([...uploadedImages, ...Array.from(e.target.files)])
                          }
                        }}
                      />
                    </div>
                    
                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4 mb-2">
                        {existingImages.map((filename, index) => {
                          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
                          const fileUrl = `${authService.getSettingsApiUrl().replace('/api', '')}/patientexaminationreport/${filename}`;
                          
                          return (
                            <div key={`existing-${index}`} className="relative rounded-lg overflow-hidden border border-gray-200 bg-white aspect-square flex flex-col items-center justify-center p-2 shadow-sm group">
                              {isImage ? (
                                <img src={fileUrl} alt={filename} className="w-full h-full object-cover rounded-md mb-2 cursor-pointer" onClick={() => window.open(fileUrl, '_blank')} />
                              ) : (
                                <FileText className="h-8 w-8 text-green-500 mb-2" onClick={() => window.open(fileUrl, '_blank')} />
                              )}
                              {!isImage && <span className="text-xs text-center text-gray-700 font-medium break-all line-clamp-2 px-1 cursor-pointer" title={filename} onClick={() => window.open(fileUrl, '_blank')}>{filename}</span>}
                              
                              <Badge className="absolute top-1 left-1 text-[10px] px-1 py-0 bg-green-100 text-green-700 border-green-200 shadow-sm leading-none flex items-center h-4 z-10">Saved</Badge>
                              
                              {/* Overlay for icon if image */}
                              {isImage && (
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                  <ImageIcon className="h-6 w-6 text-white drop-shadow-md" />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                    
                    {/* Newly Uploaded Images */}
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                        {uploadedImages.map((file, index) => {
                          const isImage = file.type.startsWith('image/');
                          const previewUrl = isImage ? URL.createObjectURL(file) : null;

                          return (
                            <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200 bg-white aspect-square flex flex-col items-center justify-center p-2 group shadow-sm hover:shadow-md transition-shadow">
                              {isImage && previewUrl ? (
                                <img src={previewUrl} alt={file.name} className="w-full h-full object-cover rounded-md mb-2" />
                              ) : (
                                <FileText className="h-8 w-8 text-blue-400 mb-2" />
                              )}
                              {!isImage && <span className="text-xs truncate max-w-[90%] text-center text-gray-700 font-medium" title={file.name}>{file.name}</span>}
                              
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none rounded-md" />
                              <Button 
                                variant="destructive" 
                                size="icon" 
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setUploadedImages(uploadedImages.filter((_, i) => i !== index))
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t flex justify-end">
                    <Button 
                      onClick={handleSaveConsultation} 
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 h-auto text-lg flex items-center shadow-md transition-all active:scale-95"
                    >
                      {isSaving ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          Save Consultation
                        </div>
                      )}
                    </Button>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      <Dialog open={showReceipt} onOpenChange={(open) => {
        if (!open) router.push('/admin/front-office/consultation-fee-list')
        setShowReceipt(open)
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
              Payment Successful
            </DialogTitle>
          </DialogHeader>
          <div id="receipt-content" className="p-6 bg-white border rounded-lg space-y-4">
            <div className="text-center border-b pb-4">
              <h2 className="text-xl font-bold">CONSULTATION RECEIPT</h2>
              <p className="text-sm text-gray-500">ID: {receiptData?.consultationId}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Patient:</span>
                <span className="font-medium">{receiptData?.patientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Patient ID:</span>
                <span className="font-medium">{receiptData?.patientId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">{receiptData?.doctorName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{receiptData?.date} {receiptData?.time}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold">Total Amount paid:</span>
                <span className="text-xl font-bold text-green-700">₹{parseFloat(receiptData?.fee || '0').toFixed(2)}</span>
              </div>
            </div>

            <div className="text-xs text-center text-gray-400 mt-6 pt-4 border-t border-dashed">
              This is a computer generated receipt.
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                const printContent = document.getElementById('receipt-content');
                const windowUrl = 'about:blank';
                const uniqueName = new Date().getTime();
                const windowName = 'Print' + uniqueName;
                const printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=0,height=0');
                if (printWindow) {
                  printWindow.document.write(printContent?.innerHTML || '');
                  printWindow.document.close();
                  printWindow.focus();
                  printWindow.print();
                  printWindow.close();
                }
              }}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push('/admin/front-office/consultation-fee-list')}
            >
              Go to List
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PrivateRoute>
  )
}