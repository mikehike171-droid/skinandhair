"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Phone,
  Mail,
  Calendar as LucideCalendar,
  CreditCard,
  ChevronDown,
  CalendarIcon,
  Plus,
  Trash2,
  Clock,
  Tag,
  Percent,
  Calculator,
  Upload,
  Receipt,
  Search,
  IndianRupee,
  ArrowLeft,
  Banknote,
  Smartphone,
  Building,
  Printer,
  Save,
  History,
  CheckSquare,
  Package as PackageIcon,
  ClipboardList
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"
import { format, parseISO, addMonths } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"





const getPaymentIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'cash': return Banknote
    case 'card': return CreditCard
    case 'upi': return Smartphone
    case 'insurance': return Building
    case 'other': return Receipt
    default: return CreditCard
  }
}

export default function PatientBillDiscuss() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.patientId as string

  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [currentExamination, setCurrentExamination] = useState<any>(null)
  const [treatmentPlans, setTreatmentPlans] = useState<any[]>([])
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)
  const [locationData, setLocationData] = useState<any>(null)

  const [billItems, setBillItems] = useState<any[]>([
    { service: '', quantity: 1, discount: 0, doctor: '', startTime: '', endTime: '', price: 0, type: 'Service' }
  ])
  const [doctors, setDoctors] = useState<any[]>([])
  const [serviceOptions, setServiceOptions] = useState<any[]>([])
  const [referralCode, setReferralCode] = useState("")
  const [advanceReceived, setAdvanceReceived] = useState(0)
  const [agent, setAgent] = useState("")
  const [billingFiles, setBillingFiles] = useState<File[]>([])
  const [activeServiceDropdown, setActiveServiceDropdown] = useState<number | null>(null)
  const [activeDoctorDropdown, setActiveDoctorDropdown] = useState<number | null>(null)
  const [roundOff, setRoundOff] = useState<number>(0)
  const [couponCode, setCouponCode] = useState("")

  // Keep original states for summary calculations if needed, or replace with derived state
  const [paidAmount, setPaidAmount] = useState<number>(0)
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<{ id: string, amount: number }[]>([])
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [installments, setInstallments] = useState<any[]>([])

  // New entry states for the single-payment form
  const [additionalPaymentMethod, setAdditionalPaymentMethod] = useState('cash')
  const [additionalPaymentAmount, setAdditionalPaymentAmount] = useState('0')
  const [paymentNotes, setPaymentNotes] = useState('')
  const [showAddPayment, setShowAddPayment] = useState(false)

  // Treatment plan related
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [selectedPlanValue, setSelectedPlanValue] = useState<string>("")
  const [nextRenewalDate, setNextRenewalDate] = useState("")
  const [planSearch, setPlanSearch] = useState("")
  const [showPlanDropdown, setShowPlanDropdown] = useState(false)
  const [filteredPlans, setFilteredPlans] = useState<any[]>([])

  const [billingMode, setBillingMode] = useState<'items' | 'package'>('items')
  const [isPackageCreated, setIsPackageCreated] = useState(false)
  const [patientPackages, setPatientPackages] = useState<any[]>([])
  const [activePackageServiceDropdown, setActivePackageServiceDropdown] = useState<number | null>(null)

  // Next Visit (follow-up appointment)
  const [nextVisitDays, setNextVisitDays] = useState<string>('')
  const [nextVisitDoctorId, setNextVisitDoctorId] = useState<string>('')
  const [nextVisitCreated, setNextVisitCreated] = useState(false)
  
  const [newPackage, setNewPackage] = useState({
    name: '',
    duration_days: 60,
    validity_till: '',
    package_price: 0,
    services: [{ category: '', service_name: '', sessions: 1, quantity: 1, price: 0 }]
  })

  useEffect(() => {
    if (patientId) {
      fetchTreatmentPlans()
      fetchPaymentMethods()
      fetchLocationData()
      fetchPatientData()
      fetchPatientExamination()
      fetchInstallments()
      fetchDoctors()
      fetchServiceOptions()
      fetchPatientPackages()
    }
  }, [patientId])

  // Pre-populate billItems when examination and services are loaded
  useEffect(() => {
    if (currentExamination && serviceOptions.length > 0) {
      let populatedItems: any[] = []

      // Try to parse services array/string from examination
      if (currentExamination.services) {
        try {
          const parsedServices = typeof currentExamination.services === 'string'
            ? JSON.parse(currentExamination.services)
            : currentExamination.services

          if (Array.isArray(parsedServices) && parsedServices.length > 0) {
            populatedItems = parsedServices.map((s: any) => {
              const basePrice = parseFloat(parseFloat(s.price as any) || parseFloat(s.amount as any) || 0 as any)
              let itemPrice = basePrice;
              if (itemPrice === 0 && s.service) {
                const matched = serviceOptions.find(opt => opt.name.toLowerCase().trim() === s.service.toLowerCase().trim());
                if (matched) {
                  itemPrice = parseFloat(matched.amount as any) || parseFloat(matched.price as any) || 0;
                }
              }

                return {
                service: s.service || '',
                quantity: s.quantity || 1,
                discount: s.discount || 0,
                doctor: s.doctor || currentExamination.doctor_name || '',
                startTime: s.startTime || '',
                endTime: s.endTime || '',
                price: itemPrice,
                usePackage: s.usePackage || false,
                packageId: s.packageId || null,
                packageServiceId: s.packageServiceId || null,
                type: s.type || (serviceOptions.find(opt => opt.name === s.service)?.type) || 'Service'
              }
            })
          }
        } catch (e) {
          console.error("Error parsing services:", e)
        }
      }

      // If no services found in examination, but singular 'service' column exists (as per user prompt)
      if (populatedItems.length === 0 && currentExamination.service) {
        const serviceMaster = serviceOptions.find(opt => opt.name === currentExamination.service)
        populatedItems = [{
          service: currentExamination.service,
          quantity: 1,
          discount: 0,
          doctor: currentExamination.doctor_name || '',
          startTime: '',
          endTime: '',
          price: parseFloat(serviceMaster?.amount as any) || parseFloat(serviceMaster?.price as any) || 0,
          type: serviceMaster?.type || 'Service'
        }]
      }

      if (populatedItems.length > 0) {
        setBillItems(populatedItems)
      }
    }
  }, [currentExamination, serviceOptions])
  const [hasInitializedPackageMode, setHasInitializedPackageMode] = useState(false)

  // Auto-detect if the saved examination was finalized as a Package
  useEffect(() => {
    // Wait for BOTH billItems and patientPackages to fetch before making a one-time judgement
    if (!currentExamination || billItems.length === 0 || !patientPackages || hasInitializedPackageMode) {
      return
    }

    const savedTotal = parseFloat(currentExamination.totalAmount as any) || 0
    const subtotal = billItems.reduce((acc, item) => acc + (parseFloat(item.price as any) * parseInt(item.quantity as any)) - parseFloat(item.discount as any), 0);
    const hasPackageItems = billItems.some(item => item.usePackage === true);

    // Identify if the active total matches any active package assigned to this patient
    const matchingPkg = patientPackages.find(p => 
      parseFloat(p.amount_paid) === savedTotal || 
      parseFloat(p.package?.total_price) === savedTotal || 
      p.id === billItems.find(i => i.usePackage)?.packageId
    );

    // If there is mathematical certainty this bill reflects a package:
    // 1. It has internal package items AND the saved total differs from the bill items math.
    // OR 2. The saved total perfectly matches a known patient package (fault-tolerant against db payload drops).
    if ((hasPackageItems && savedTotal > 0 && Math.abs(savedTotal - subtotal) > 1) || 
        (matchingPkg && savedTotal > 0 && Math.abs(savedTotal - subtotal) > 1)) {
       
       setBillingMode('package');
       setIsPackageCreated(true);
       setNewPackage((prev: any) => ({ 
         ...prev, 
         name: matchingPkg?.package?.name || 'Assigned Treatment Package', 
         package_price: savedTotal,
         duration_days: matchingPkg?.package?.duration_days || 30
       }));
    }
    
    // Mark as initialized
    setHasInitializedPackageMode(true);
  }, [currentExamination, billItems, patientPackages, hasInitializedPackageMode])


  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const locationId = userData.locationId || userData.primary_location_id || 1
      const response = await fetch(`${authService.getSettingsApiUrl()}/doctors/users?locationId=${locationId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) setDoctors(await response.json())
    } catch (error) { console.error('Error fetching doctors:', error) }
  }

  const fetchServiceOptions = async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/service-product`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      })
      if (response.ok) setServiceOptions(await response.json())
    } catch (error) { console.error('Error fetching services:', error) }
  }

  useEffect(() => {
    if (selectedPlan) {
      const today = new Date()
      const renewalDate = addMonths(today, selectedPlan.months)
      setNextRenewalDate(format(renewalDate, "yyyy-MM-dd"))
    }
  }, [selectedPlan])

  useEffect(() => {
    setFilteredPlans(treatmentPlans)
  }, [treatmentPlans])

  const handleAddItem = () => {
    setBillItems([...billItems, {
      service: '',
      quantity: 1,
      discount: 0,
      doctor: currentExamination?.doctor_name || '',
      startTime: '',
      endTime: '',
      price: 0,
      usePackage: false,
      packageId: null,
      packageServiceId: null,
      type: 'Service'
    }])
  }

  const handleRemoveItem = (index: number) => {
    if (billItems.length > 1) {
      setBillItems(billItems.filter((_, i) => i !== index))
    } else {
      setBillItems([{ service: '', quantity: 1, discount: 0, doctor: '', startTime: '', endTime: '', price: 0, type: 'Service' }])
    }
  }

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const newItems = [...billItems]
    newItems[index] = { ...newItems[index], [field]: value }

    // If service changes, automatically update price from serviceOptions
    if (field === 'service') {
      const selectedService = serviceOptions.find(s => s.name.toLowerCase().trim() === value.toLowerCase().trim())
      if (selectedService) {
        newItems[index].price = parseFloat(selectedService.amount as any) || parseFloat(selectedService.price as any) || 0
        newItems[index].type = selectedService.type || 'Service'
      }
    }

    setBillItems(newItems)
  }

  const calculateSubtotal = () => {
    return billItems
      .filter(item => item.type === 'Service')
      .reduce((acc, item) => {
        const price = parseFloat(item.price) || 0
        const qty = parseInt(item.quantity) || 0
        return acc + (price * qty)
      }, 0)
  }

  const calculateTotalDiscount = () => {
    return billItems
      .filter(item => item.type === 'Service')
      .reduce((acc, item) => {
        const price = parseFloat(item.price) || 0
        const qty = parseInt(item.quantity) || 0
        const itemSubtotal = price * qty
        const discountPercent = parseFloat(item.discount) || 0
        return acc + (itemSubtotal * (discountPercent / 100))
      }, 0)
  }

  const calculateNetTotal = () => {
    const subtotal = calculateSubtotal()
    const totalDiscount = calculateTotalDiscount()
    const advance = parseFloat(advanceReceived as any) || 0
    const adjustment = parseFloat(roundOff as any) || 0
    return subtotal - totalDiscount - advance + adjustment
  }



  const fetchPatientData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patients/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPatient({
          id: data.patient_id,
          name: `${data.first_name} ${data.last_name}`,
          phone: data.phone_number,
          email: data.email,
          age: calculateAge(data.date_of_birth),
          gender: data.gender === 'M' ? 'Male' : data.gender === 'F' ? 'Female' : 'Other',
          bloodGroup: data.blood_group
        })
      }
    } catch (error) {
      console.error('Error fetching patient data:', error)
    } finally {
      setLoading(false)
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

  const fetchPatientExamination = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        const examinations = Array.isArray(data) ? data : []
        const latestExam = examinations[0] // Get the latest examination
        if (latestExam) {
          setCurrentExamination(latestExam)
          // Pre-populate with PRO data if exists, otherwise use doctor data
          if (latestExam.treatment_plan_months_pro) {
            setSelectedPlanValue(latestExam.treatment_plan_months_pro.toString())
            setNextRenewalDate(latestExam.next_renewal_date_pro ? format(new Date(latestExam.next_renewal_date_pro), "yyyy-MM-dd") : '')
            const plan = treatmentPlans.find(p => p.months === latestExam.treatment_plan_months_pro)
            if (plan) setPlanSearch(`${plan.months} Month${plan.months > 1 ? 's' : ''}`)
          } else if (latestExam.treatment_plan_months_doctor) {
            setSelectedPlanValue(latestExam.treatment_plan_months_doctor.toString())
            setNextRenewalDate(latestExam.next_renewal_date_doctor ? format(new Date(latestExam.next_renewal_date_doctor), "yyyy-MM-dd") : '')
          }
        }
      }
    } catch (error) {
      console.error('Error fetching patient examination:', error)
    }
  }

  const fetchTreatmentPlans = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/treatment-plans`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTreatmentPlans(data)
      }
    } catch (error) {
      console.error('Error fetching treatment plans:', error)
    }
  }

  const handlePlanChange = (months: string) => {
    const plan = treatmentPlans.find(p => p.months === parseInt(months))
    if (plan) {
      selectPlan(plan)
    }
  }

  const handlePlanSearch = (searchTerm: string) => {
    setPlanSearch(searchTerm)
    const filtered = treatmentPlans.filter(plan =>
      plan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.months.toString().includes(searchTerm)
    )
    setFilteredPlans(filtered)
  }

  const selectPlan = (plan: any) => {
    setSelectedPlan(plan)
    setSelectedPlanValue(plan.months.toString())
    setPlanSearch(`${plan.months} Month${plan.months > 1 ? 's' : ''}`)
    setShowPlanDropdown(false)

    const today = new Date()
    const renewalDate = addMonths(today, plan.months)
    setNextRenewalDate(format(renewalDate, "yyyy-MM-dd"))
  }

  const fetchPaymentMethods = async () => {
    // Use static payment methods like in registration page
    setPaymentMethods([
      { id: 1, code: "cash", name: "Cash" },
      { id: 2, code: "card", name: "Card" },
      { id: 3, code: "upi", name: "UPI" },
      { id: 4, code: "insurance", name: "Insurance" },
      { id: 5, code: "other", name: "Other" }
    ])
  }

  const fetchLocationData = async () => {
    try {
      const token = localStorage.getItem('authToken')
      // Get fresh user data from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const locationId = userData?.primary_location_id

      console.log('Fetching location for ID:', locationId) // Debug log

      if (locationId) {
        const response = await fetch(`${authService.getSettingsApiUrl()}/locations/${locationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Location data fetched:', data) // Debug log
          setLocationData(data)
        } else {
          console.error('Failed to fetch location:', response.status)
        }
      } else {
        console.error('No location ID found in user data')
      }
    } catch (error) {
      console.error('Error fetching location data:', error)
    }
  }

  const handleProcessPayment = async () => {
    if (!currentExamination) {
      alert('No examination record found')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')

      // 1. Calculate financial totals
      const subtotal = billingMode === 'package' ? (newPackage.package_price || 0) : calculateSubtotal()
      const totalDiscount = billingMode === 'package' ? 0 : calculateTotalDiscount()
      const netTotal = calculateNetTotal()
      const totalPaidInThisSession = selectedPaymentMethods.reduce((sum, p) => sum + (parseFloat(p.amount as any) || 0), 0)

      // Calculate final DB values
      // total_amount = subtotal + roundOff
      // paid_amount = previously paid + advance + new payments
      const finalTotalAmount = subtotal + roundOff
      const finalPaidAmount = (parseFloat(currentExamination.paidAmount) || 0) + (parseFloat(advanceReceived as any) || 0) + totalPaidInThisSession
      const finalDueAmount = Math.max(0, finalTotalAmount - totalDiscount - finalPaidAmount)

      // 2. Prepare items for saving - ONLY Services
      const itemsToSave = billItems.filter(item => item.service && (item.type === 'Service' || item.type === 'Product')).map(item => ({
        service: item.service,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount,
        doctor: item.doctor,
        startTime: item.startTime,
        endTime: item.endTime,
        usePackage: item.usePackage,
        packageId: item.packageId,
        packageServiceId: item.packageServiceId,
        type: item.type
      }))

      // 3. Update examination details (Metadata, Services, etc.)
      const updateData = {
        services: itemsToSave,
        treatmentPlanMonthsPro: parseInt(selectedPlanValue) || null,
        nextRenewalDatePro: nextRenewalDate || null,
        consultationStatus: "Billed", // Standardizing to camelCase
        referralCode: referralCode, // Assuming this is a field
        agent: agent, // Assuming this is a field
        totalAmount: finalTotalAmount,
        discountAmount: totalDiscount,
        paidAmount: finalPaidAmount,
        dueAmount: finalDueAmount
      }

      const updateResponse = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (!updateResponse.ok) {
        throw new Error('Failed to update examination details')
      }

      // 4. Save Payments/Installments (Merging with existing if any)
      // Note: Backend savePayments replaces installments, so we send the merged list.
      const existingPayments = installments.map(inst => ({
        method: inst.paymentMethod,
        amount: parseFloat(inst.amount) || 0
      }))

      const newPayments = selectedPaymentMethods.map(p => ({
        method: p.id,
        amount: parseFloat(p.amount as any) || 0
      }))

      // Also include advanceReceived as a payment method if it was just entered
      if (parseFloat(advanceReceived as any) > 0) {
        newPayments.push({
          method: 'cash', // Assuming advance is cash or we should have a way to pick
          amount: parseFloat(advanceReceived as any)
        })
      }

      const allPayments = [...existingPayments, ...newPayments]

      if (allPayments.length > 0) {
        const paymentData = {
          totalAmount: finalTotalAmount,
          discountAmount: totalDiscount,
          paidAmount: finalPaidAmount,
          dueAmount: finalDueAmount,
          paymentMethods: allPayments
        }

        const paymentResponse = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}/payments`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData)
        })

        if (!paymentResponse.ok) {
          throw new Error('Failed to save payment installments')
        }
      }

      // 5. Register Package Usages if any
      const packageItems = billItems.filter(item => item.usePackage && item.packageServiceId)
      for (const item of packageItems) {
        await fetch(`${authService.getSettingsApiUrl()}/packages/use-session`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patient_package_id: item.packageId,
            package_service_id: item.packageServiceId,
            examination_id: currentExamination.id,
            sessions: item.quantity
          })
        })
      }

      alert('Bill processed successfully!')
      // If was package mode, we might want to reset or keep it for the receipt
      router.push('/admin/front-office/consultation-fee-list')
    } catch (error: any) {
      console.error('Error processing bill:', error)
      alert(`Error processing bill: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePaymentDetails = async () => {
    if (!currentExamination) {
      alert('No examination record found')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')

      // Ground truth: if patient has any active package, use that total. Otherwise use bill items.
      const hasActivePackage = patientPackages.length > 0
      const finalTotal = hasActivePackage
        ? patientPackages.reduce((sum, pp) => sum + (parseFloat(pp.amount_paid) || 0), 0)
        : (calculateSubtotal() || 0)
      const finalDiscount = hasActivePackage ? 0 : (calculateTotalDiscount() || 0)
      const currentPaid = parseFloat(currentExamination?.paidAmount as any) || 0
      const finalDue = Math.max(0, finalTotal + roundOff - finalDiscount - currentPaid)

      const updateData = {
        totalAmount: finalTotal + roundOff,
        discountAmount: finalDiscount,
        dueAmount: finalDue,
        referralCode: referralCode,
        agent: agent,
        // Also save services and treatment plan if we want one "Save" for all metadata
        services: billItems.filter(item => item.service && (item.type === 'Service' || item.type === 'Product')).map(item => ({
          service: item.service,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          doctor: item.doctor,
          startTime: item.startTime,
          endTime: item.endTime,
          usePackage: item.usePackage,
          packageId: item.packageId,
          packageServiceId: item.packageServiceId,
          type: item.type
        })),
        treatmentPlanMonthsPro: parseInt(selectedPlanValue) || null,
        nextRenewalDatePro: nextRenewalDate || null,
      }

      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        alert('Payment details saved successfully!')
        fetchPatientExamination()
      } else {
        alert('Failed to save payment details')
      }
    } catch (error) {
      console.error('Error saving payment details:', error)
      alert('Error saving payment details')
    } finally {
      setLoading(false)
    }
  }


  const handleShowTodayReceipt = async () => {
    if (!currentExamination) return
    await fetchLocationData()
    try {
      const token = localStorage.getItem('authToken')
      // Assuming backend supports daily receipt or we filter here
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}/receipt?type=daily`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReceiptData({ ...data, location: locationData, isDailyReceipt: true })
        setShowReceipt(true)
      }
    } catch (error) {
      console.error('Error fetching today\'s receipt:', error)
    }
  }

  const handleSaveTreatmentPlan = async () => {
    if (!currentExamination || !selectedPlanValue) {
      alert('No examination record found or plan selected')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')

      const updateData = {
        treatmentPlanMonthsPro: parseInt(selectedPlanValue),
        nextRenewalDatePro: nextRenewalDate
      }

      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        alert('PRO Treatment plan updated successfully!')
        fetchPatientExamination()
      } else {
        alert('Failed to update treatment plan')
      }
    } catch (error) {
      console.error('Error updating treatment plan:', error)
      alert('Error updating treatment plan')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdditionalPayment = async () => {
    if (!currentExamination || !additionalPaymentMethod || !additionalPaymentAmount) {
      alert('Please select payment method and enter amount')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')

      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}/add-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod: additionalPaymentMethod,
          amount: parseFloat(additionalPaymentAmount),
          notes: paymentNotes
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert('Payment added successfully!')
        setAdditionalPaymentMethod('cash')
        setAdditionalPaymentAmount('0')
        setPaymentNotes('')
        setShowAddPayment(false)

        // Update current examination with new amounts
        if (currentExamination) {
          setCurrentExamination({
            ...currentExamination,
            paidAmount: result.paidAmount,
            dueAmount: result.dueAmount
          })
        }

        fetchPatientExamination()
        fetchInstallments()
        setShowReceipt(true)
      } else {
        alert('Failed to add payment')
      }
    } catch (error) {
      console.error('Error adding payment:', error)
      alert('Error adding payment')
    } finally {
      setLoading(false)
    }
  }

  const fetchInstallments = async () => {
    if (!currentExamination) {
      // Try to fetch with patientId if currentExamination not loaded yet
      if (patientId) {
        try {
          const token = localStorage.getItem('authToken')
          const examResponse = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${patientId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (examResponse.ok) {
            const examData = await examResponse.json()
            const latestExam = Array.isArray(examData) ? examData[0] : examData
            if (latestExam) {
              const installmentResponse = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${latestExam.id}/installments`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              })

              if (installmentResponse.ok) {
                const data = await installmentResponse.json()
                setInstallments(data)
              }
            }
          }
        } catch (error) {
          console.error('Error fetching installments:', error)
        }
      }
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}/installments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setInstallments(data)
      }
    } catch (error) {
      console.error('Error fetching installments:', error)
    }
  }

  const fetchReceipt = async () => {
    if (!currentExamination) return

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}/receipt`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReceiptData({ ...data, location: locationData })
      }
    } catch (error) {
      console.error('Error fetching receipt:', error)
    }
  }

  const fetchPatientPackages = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/packages/patient/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        setPatientPackages(await response.json())
      }
    } catch (error) {
      console.error('Error fetching patient packages:', error)
    }
  }

  const handleCreateNextVisit = async () => {
    if (!nextVisitDays || !nextVisitDoctorId) {
      alert('Please select both the next visit days and a doctor.')
      return
    }
    const days = parseInt(nextVisitDays)
    const nextDate = new Date()
    nextDate.setDate(nextDate.getDate() + days)
    const appointmentDate = nextDate.toISOString().split('T')[0] // YYYY-MM-DD
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/appointments`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: currentExamination?.patientId,
          doctorId: parseInt(nextVisitDoctorId),
          appointmentDate,
          appointmentTime: '10:00',
          appointmentType: 'follow-up',
          notes: `Follow-up after ${days} day(s) — auto-created from Bill Discuss.`
        })
      })
      if (response.ok) {
        setNextVisitCreated(true)
        alert(`Follow-up appointment created for ${appointmentDate}!`)
      } else {
        const err = await response.json()
        alert('Failed to create appointment: ' + (err?.message || 'Unknown error'))
      }
    } catch (error: any) {
      console.error('Error creating next visit:', error)
      alert('Error creating appointment: ' + error.message)
    }
  }

  const handleCreatePackage = async () => {
    try {
      const token = localStorage.getItem('authToken')
      // 1. Create the package definition
      const response = await fetch(`${authService.getSettingsApiUrl()}/packages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPackage),
      })

      if (response.ok) {
        const pkg = await response.json()
        // 2. Assign it to the patient
        const assignResponse = await fetch(`${authService.getSettingsApiUrl()}/packages/assign`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patient_id: patientId,
            package_id: pkg.id,
            amount_paid: newPackage.package_price
          }),
        })

        if (assignResponse.ok) {
          const assignedPkg = await assignResponse.json()
          
           // Append package services to existing bill items
           const packageBillItems = pkg.services.map((s: any) => ({
             service: s.service_name,
             quantity: s.quantity || 1,
             sessions: s.sessions || 1,
             discount: 0,
             doctor: doctors[0]?.first_name ? `${doctors[0].first_name} ${doctors[0].last_name}` : '',
             startTime: '',
             endTime: '',
             price: 0, // Individual price is 0 for package items
             usePackage: true,
             packageId: assignedPkg.id || pkg.id,
             packageServiceId: s.id
           }))
 
           const newBillItems = [...billItems, ...packageBillItems]
           setBillItems(newBillItems)
           
           // Auto-finalize the examination with the new package total
           try {
             const updateData = {
               totalAmount: parseFloat(newPackage.package_price as any || 0) + roundOff,
               discountAmount: 0,
               dueAmount: Math.max(0, parseFloat(newPackage.package_price as any || 0) + roundOff - (parseFloat(currentExamination?.paidAmount as any) || 0)),
               referralCode: referralCode,
               agent: agent,
               services: newBillItems.filter(item => item.service).map(item => ({
                 service: item.service,
                 price: item.price,
                 quantity: item.quantity,
                 discount: item.discount,
                 doctor: item.doctor,
                 startTime: item.startTime,
                 endTime: item.endTime,
                 usePackage: item.usePackage,
                 packageId: item.packageId,
                 packageServiceId: item.packageServiceId
               })),
               treatmentPlanMonthsPro: parseInt(selectedPlanValue) || null,
               nextRenewalDatePro: nextRenewalDate || null,
             }
             await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}`, {
               method: 'PUT',
               headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
               body: JSON.stringify(updateData)
             })
           } catch(e) {
             console.error("Auto finalize failed", e)
           }

           alert('Package finalized and assigned successfully!')
           setBillingMode('package')
           setIsPackageCreated(true)
           fetchPatientPackages()
           fetchPatientExamination() // refresh examination data to get new totals
         }
      }
    } catch (error) {
      console.error('Error creating package:', error)
      alert('Error creating package')
    }
  }

  const handleAddPackageService = () => {
    setNewPackage({
      ...newPackage,
      services: [...newPackage.services, { category: '', service_name: '', sessions: 1, quantity: 1, price: 0 }]
    })
  }

  const handleRemovePackageService = (index: number) => {
    const services = [...newPackage.services]
    services.splice(index, 1)
    setNewPackage({ ...newPackage, services })
  }

  const handlePackageServiceChange = (index: number, updates: any) => {
    const services = [...newPackage.services]
    if (typeof updates === 'string') {
        return;
    }
    services[index] = { ...services[index], ...updates }
    
    setNewPackage({ 
      ...newPackage, 
      services
    })
  }

  const handleUseSession = async (patientPackageId: number, packageServiceId: number) => {
    if (!currentExamination) {
      alert('Please save the examination first to link the session.')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/packages/use-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_package_id: patientPackageId,
          package_service_id: packageServiceId,
          examination_id: currentExamination.id,
          sessions: 1
        }),
      })

      if (response.ok) {
        alert('Session marked as completed!')
        fetchPatientPackages()
      } else {
        alert('Failed to update session usage')
      }
    } catch (error) {
      console.error('Error using session:', error)
      alert('Error recording session usage')
    } finally {
      setLoading(false)
    }
  }

  const handleShowReceipt = () => {
    // Refetch location data to ensure latest location is used
    fetchLocationData().then(() => {
      fetchReceipt()
      setShowReceipt(true)
    })
  }

  const handleShowInstallmentReceipt = async (installmentId: number) => {
    // Refetch location data first
    await fetchLocationData()

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/installment/${installmentId}/receipt`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReceiptData({ ...data, location: locationData })
        setShowReceipt(true)
      }
    } catch (error) {
      console.error('Error fetching installment receipt:', error)
    }
  }

  const handleShowDailyReceipt = async () => {
    if (!currentExamination) return

    // Refetch location data first
    await fetchLocationData()

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}/daily-receipt`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReceiptData({ ...data, location: locationData })
        setShowReceipt(true)
      }
    } catch (error) {
      console.error('Error fetching daily receipt:', error)
    }
  }

  return (
    <PrivateRoute modulePath="admin/manager/patient-bill-discuss" action="view">
      <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full hover:bg-white hover:shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Patient Bill Discussion</h1>
              <p className="text-gray-500 font-medium">Review and finalize treatment billing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-gray-200 shadow-sm bg-white" onClick={() => handleShowReceipt()}>
              <Receipt className="h-4 w-4 mr-2 text-blue-500" />
              View Receipt
            </Button>
            
            {/* Only show toggle when no active package exists */}
            {patientPackages.length === 0 && (
              <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                <Button
                  variant={billingMode === 'items' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBillingMode('items')}
                  className={`rounded-lg px-4 ${billingMode === 'items' ? 'bg-white text-blue-600 shadow-sm hover:bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Bill Items
                </Button>
                <Button
                  variant={billingMode === 'package' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBillingMode('package')}
                  className={`rounded-lg px-4 ${billingMode === 'package' ? 'bg-white text-purple-600 shadow-sm hover:bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <PackageIcon className="h-4 w-4 mr-2" />
                  Package
                </Button>
              </div>
            )}
            {patientPackages.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-xl border border-purple-100">
                <PackageIcon className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-bold text-purple-700">Package Active</span>
              </div>
            )}
            
            <Button 
              className="rounded-xl shadow-md bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all"
              onClick={handleSavePaymentDetails}
            >
              Finalize Bill
            </Button>
          </div>
        </div>

        {/* Patient Info Sticker Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Patient Name</p>
              <p className="font-bold text-gray-900 truncate">{patient?.name}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
              <Tag className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Patient ID</p>
              <p className="font-bold text-gray-900">{patient?.id}</p>
            </div>
          </div>
          {patient?.date_of_birth && (
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Age / DOB</p>
                <p className="font-bold text-gray-900">{`${calculateAge(patient.date_of_birth)} YRS`}</p>
              </div>
            </div>
          )}
          {patient?.phone && (
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                <Phone className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Mobile</p>
                <p className="font-bold text-gray-900">{patient.phone}</p>
              </div>
            </div>
          )}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center shrink-0">
              <User className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gender</p>
              <p className="font-bold text-gray-900">{patient?.gender === 'M' ? 'Male' : 'Female'}</p>
            </div>
          </div>
        </div>

        {/* Billing Table Section — only show when patient has NO active package */}
        {patientPackages.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Bill Items</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="rounded-xl border-blue-100 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest min-w-[280px]">Service / Product</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest min-w-[80px]">Qty</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest min-w-[80px]">Sess</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest min-w-[120px]">Discount</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest min-w-[200px]">Doctor</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest min-w-[150px]">Start Time</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest min-w-[150px]">End Time</th>
                  <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest min-w-[120px]">Price</th>
                  <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest min-w-[120px]">Total</th>
                  <th className="px-6 py-4 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {billItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4 relative">
                      <div className="relative group">
                        <Input
                          placeholder="Select Service..."
                          value={item.service}
                          onChange={(e) => handleUpdateItem(index, 'service', e.target.value)}
                          onFocus={() => setActiveServiceDropdown(index)}
                          onBlur={() => setTimeout(() => setActiveServiceDropdown(null), 200)}
                          className={cn(
                            "rounded-xl border-gray-200 bg-transparent focus:bg-white transition-all shadow-none focus:shadow-sm",
                            item.type === 'Product' && "border-orange-200 bg-orange-50/10"
                          )}
                        />
                        {item.type === 'Product' && (
                          <Badge variant="outline" className="absolute -top-2 -right-2 bg-orange-100 text-orange-700 border-orange-200 text-[8px] h-4 font-bold uppercase tracking-tighter shadow-sm z-10">
                            Product
                          </Badge>
                        )}
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

                        {activeServiceDropdown === index && (
                          <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto py-2">
                            {serviceOptions.filter(opt => opt.name.toLowerCase().includes(item.service.toLowerCase())).map((opt) => (
                              <div
                                key={opt.id}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleUpdateItem(index, 'service', opt.name);
                                  setActiveServiceDropdown(null);
                                }}
                                className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm font-medium text-gray-700 transition-colors"
                              >
                                {opt.name}
                                <span className="ml-2 text-xs text-gray-400">₹{opt.amount || opt.price}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Package Session Indicator/Selection */}
                      <div className="mt-1 flex items-center gap-2">
                        {patientPackages.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <select
                              className="text-[10px] font-black uppercase tracking-tighter bg-purple-50 text-purple-600 border-none rounded px-2 py-0.5 outline-none cursor-pointer hover:bg-purple-100 transition-colors"
                              value={item.packageServiceId || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val) {
                                  // Find the package and service
                                  let foundPkg: any = null;
                                  let foundService: any = null;
                                  patientPackages.forEach(pp => {
                                    const ps = pp.services.find((s: any) => s.id === parseInt(val));
                                    if (ps) {
                                      foundPkg = pp;
                                      foundService = ps;
                                    }
                                  });
                                  
                                  if (foundService) {
                                    handleUpdateItem(index, 'usePackage', true);
                                    handleUpdateItem(index, 'packageId', foundPkg.id);
                                    handleUpdateItem(index, 'packageServiceId', foundService.id);
                                    handleUpdateItem(index, 'service', foundService.service_name);
                                    handleUpdateItem(index, 'price', 0); // Package session is 0 cost in this bill
                                  }
                                } else {
                                  handleUpdateItem(index, 'usePackage', false);
                                  handleUpdateItem(index, 'packageId', null);
                                  handleUpdateItem(index, 'packageServiceId', null);
                                }
                              }}
                            >
                              <option value="">Use Package?</option>
                              {patientPackages.map(pp => (
                                <optgroup key={pp.id} label={pp.package.name}>
                                  {pp.services.filter((s: any) => s.sessions_remaining > 0).map((s: any) => (
                                    <option key={s.id} value={s.id}>
                                      {s.service_name} ({s.sessions_remaining} left)
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                            {item.usePackage && (
                              <Badge className="bg-purple-600 h-4 text-[8px] px-1 animate-pulse">Session</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                        className="h-10 text-center rounded-xl border-gray-200 font-bold"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <Input
                        type="number"
                        min="1"
                        value={item.sessions || 1}
                        onChange={(e) => handleUpdateItem(index, 'sessions', e.target.value)}
                        className="h-10 text-center rounded-xl border-gray-200 font-bold bg-purple-50/50"
                      />
                    </td>
                    <td className="px-3 py-4">
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleUpdateItem(index, 'discount', e.target.value)}
                          className="pl-9 rounded-xl border-gray-200 shadow-none focus:shadow-sm"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 relative">
                      <div className="relative">
                        <Input
                          placeholder="Select Doctor..."
                          value={item.doctor}
                          onChange={(e) => handleUpdateItem(index, 'doctor', e.target.value)}
                          onFocus={() => setActiveDoctorDropdown(index)}
                          onBlur={() => setTimeout(() => setActiveDoctorDropdown(null), 200)}
                          className="rounded-xl border-gray-200 bg-transparent focus:bg-white transition-all shadow-none focus:shadow-sm"
                        />
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

                        {activeDoctorDropdown === index && (
                          <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto py-2">
                            {doctors.filter(d =>
                              !item.doctor || `${d.first_name} ${d.last_name}`.toLowerCase().includes(item.doctor.toLowerCase())
                            ).map((d) => (
                              <div
                                key={d.id}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleUpdateItem(index, 'doctor', `${d.first_name} ${d.last_name}`);
                                  setActiveDoctorDropdown(null);
                                }}
                                className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm font-medium text-gray-700 transition-colors flex items-center gap-2"
                              >
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-[10px]">
                                  {d.first_name?.[0]}{d.last_name?.[0]}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900">{d.first_name} {d.last_name}</p>
                                  <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{d.specialization || 'Consultant'}</p>
                                </div>
                              </div>
                            ))}
                            {doctors.length === 0 && <div className="px-4 py-2 text-sm text-gray-400 font-medium">No doctors found</div>}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                          type="time"
                          value={item.startTime}
                          onChange={(e) => handleUpdateItem(index, 'startTime', e.target.value)}
                          className="pl-8 rounded-xl border-gray-200 text-xs shadow-none focus:shadow-sm"
                        />
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                          type="time"
                          value={item.endTime}
                          onChange={(e) => handleUpdateItem(index, 'endTime', e.target.value)}
                          className="pl-8 rounded-xl border-gray-200 text-xs shadow-none focus:shadow-sm"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleUpdateItem(index, 'price', e.target.value)}
                          className="pl-7 rounded-xl border-gray-200 text-right font-bold text-gray-900 shadow-none focus:shadow-sm"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        "text-sm font-black text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100",
                        item.type === 'Product' && "text-gray-400 line-through opacity-50"
                      )}>
                        ₹{((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)).toLocaleString()}
                      </span>
                      {item.type === 'Product' && (
                        <p className="text-[9px] font-bold text-orange-500 uppercase tracking-tighter mt-1 mr-2">Excluded</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50/30">
                <tr>
                  <td colSpan={10} className="px-6 py-4">
                    <div className="flex items-center justify-end gap-6">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex flex-col items-end">
                          <span>{billingMode === 'package' ? 'Selected Package Total:' : 'Bill Items Section Grand Total:'}</span>
                          {billItems.some(item => item.type === 'Product') && (
                            <span className="text-orange-500 normal-case font-bold text-[9px] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 mt-0.5">
                              (Excludes Products)
                            </span>
                          )}
                        </span>
                        <span className="text-2xl font-black text-gray-900">
                          ₹{(billingMode === 'package' ? (newPackage.package_price || 0) : calculateSubtotal()).toLocaleString()}
                        </span>
                      </div>
                      <Button
                        onClick={handleSavePaymentDetails}
                        disabled={loading}
                        className="bg-[#3b82f6] hover:bg-blue-600 text-white px-6 h-11 rounded-xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {billingMode === 'package' ? 'Finalize Package' : 'Finalize Bill Items'}
                      </Button>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          </div>
        )}

        {/* Active Patient Packages List */}
        {patientPackages.length > 0 && (
          <div className="space-y-6 mb-8 mt-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200">
                  <PackageIcon className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Active Treatment Packages ({patientPackages.length})</h3>
              </div>
            </div>

            {patientPackages.map((pp, pkgIdx) => (
              <div key={pp.id} className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 bg-orange-50/30 border-b border-orange-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-orange-600 font-bold border border-orange-100">
                      {pkgIdx + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 tracking-tight">{pp.package?.name || 'Treatment Plan'}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Purchased: {format(new Date(pp.purchase_date), 'dd MMM yyyy')} • 
                          Expires: {format(new Date(pp.expiry_date), 'dd MMM yyyy')}
                        </p>
                        <Badge variant="outline" className="text-[10px] h-4 font-black bg-orange-50 text-orange-700 border-orange-100">
                          Total Paid: ₹{parseFloat(pp.amount_paid || 0).toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                    {pp.status}
                  </div>
                </div>
                
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Included Service / Treatment</th>
                        <th className="px-4 py-3 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Sessions</th>
                        <th className="px-4 py-3 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Completed</th>
                        <th className="px-4 py-3 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Remaining</th>
                        <th className="px-6 py-3 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pp.services.map((s: any) => (
                        <tr key={s.id} className="hover:bg-gray-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900">{s.service_name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{s.category}</p>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 font-black text-sm">{s.sessions}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 font-black text-sm">{s.sessions_used || 0}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="px-3 py-1 rounded-lg bg-red-50 text-red-600 font-black text-sm">{s.sessions_remaining}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              size="sm"
                              onClick={() => handleUseSession(pp.id, s.id)}
                              disabled={s.sessions_remaining <= 0 || loading}
                              className={`rounded-xl h-9 px-4 font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm active:scale-95 ${
                                s.sessions_remaining > 0 
                                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-100' 
                                : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              {s.sessions_remaining > 0 ? (
                                <>
                                  <CheckSquare className="h-3.5 w-3.5 mr-2" />
                                  Complete Session
                                </>
                              ) : 'Fully Utilized'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inline Package Creation / Summary Section */}
        {billingMode === 'package' && !isPackageCreated && (
          <div className="space-y-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Inline Package Creation Form */}
              <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 border border-purple-200">
                      <PackageIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 leading-tight">Create & Assign Package</h2>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Setup new treatment plan</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setBillingMode('items')}
                    className="rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </div>

                <div className="p-8 space-y-8">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Package Name</Label>
                      <div className="relative group">
                        <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                        <Input 
                          placeholder="e.g., Skin Glowing Pack"
                          className="pl-10 h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 shadow-sm transition-all"
                          value={newPackage.name}
                          onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Duration (Days)</Label>
                      <div className="relative group">
                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                        <Input 
                          type="number"
                          className="pl-10 h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 shadow-sm transition-all"
                          value={newPackage.duration_days}
                          onChange={(e) => setNewPackage({ ...newPackage, duration_days: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Package Total Price</Label>
                      <div className="relative group">
                        <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                        <Input 
                          type="number"
                          className="pl-10 h-12 rounded-xl border-gray-200 border-2 border-purple-100 bg-purple-50/30 focus:border-purple-500 focus:ring-purple-500 shadow-sm font-black text-purple-700"
                          value={newPackage.package_price}
                          onChange={(e) => setNewPackage({ ...newPackage, package_price: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <hr className="border-gray-100 my-4" />

                  {/* Services Heading */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">Package Services</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Add individual treatments</p>
                    </div>
                    <Button 
                      type="button"
                      onClick={() => handleAddPackageService()}
                      size="sm"
                      className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-6 h-10 font-bold shadow-lg shadow-purple-200 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Add Item
                    </Button>
                  </div>

                  {/* Services List */}
                  <div className="space-y-4">
                    {(newPackage.services || []).map((service, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50/50 items-end animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="md:col-span-2 space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Service / Product</Label>
                          <div className="relative group">
                            <Input 
                              placeholder="Search Service..."
                              className="h-11 rounded-lg border-gray-200 bg-white pl-4 font-bold"
                              value={service.service_name}
                              onChange={(e) => handlePackageServiceChange(index, { service_name: e.target.value })}
                              onFocus={() => setActivePackageServiceDropdown(index)}
                              onBlur={() => setTimeout(() => setActivePackageServiceDropdown(null), 200)}
                            />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

                            {activePackageServiceDropdown === index && (
                              <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto py-2">
                                {serviceOptions
                                  .filter(opt => opt.name.toLowerCase().includes((service.service_name || '').toLowerCase()))
                                  .map((opt) => (
                                    <div
                                      key={opt.id}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        handlePackageServiceChange(index, {
                                          service_name: opt.name,
                                          category: opt.type,
                                          price: parseFloat(opt.amount as any) || parseFloat(opt.price as any) || 0
                                        });
                                        setActivePackageServiceDropdown(null);
                                      }}
                                      className="px-4 py-2.5 hover:bg-purple-50 cursor-pointer text-sm font-medium text-gray-700 transition-colors flex items-center justify-between"
                                    >
                                      <div>
                                        <span className="font-bold">{opt.name}</span>
                                        <Badge className={`ml-2 text-[8px] h-4 px-1 ${opt.type === 'Service' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                          {opt.type}
                                        </Badge>
                                      </div>
                                      <span className="text-xs text-gray-400 font-bold">₹{opt.amount || opt.price || 0}</span>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Sessions</Label>
                          <Input 
                            type="number"
                            min="1"
                            className="h-11 rounded-lg border-gray-200 bg-white text-center font-bold"
                            value={service.sessions}
                            onChange={(e) => handlePackageServiceChange(index, { sessions: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Quantity</Label>
                          <Input 
                            type="number"
                            min="1"
                            className="h-11 rounded-lg border-gray-200 bg-white text-center font-bold"
                            value={service.quantity}
                            onChange={(e) => handlePackageServiceChange(index, { quantity: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="pb-1 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemovePackageService(index)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={handleCreatePackage}
                      disabled={!newPackage.name || newPackage.services.length === 0}
                      className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-6 h-11 font-bold shadow-lg shadow-purple-200 active:scale-95 transition-all text-sm"
                    >
                      Confirm & Assign Package
                    </Button>
                  </div>
                </div>
              </div>
          </div>
        )}

        {/* Modal-style Sectional Payment UI */}
        <div className="space-y-6 pb-20">


          {/* Card 2: Add Additional Payment */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-gray-900 border border-gray-100">
                <IndianRupee className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-gray-900">Add Additional Payment</h3>
            </div>

            <div className="p-8 space-y-8">
              {/* Summary Bar */}
              <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-xl p-6 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-[#92400e] font-bold text-sm">Total:</span>
                  <span className="text-gray-900 font-black text-lg">
                    ₹{( patientPackages.length > 0
                      ? patientPackages.reduce((sum, pp) => sum + (parseFloat(pp.amount_paid) || 0), 0)
                      : (calculateSubtotal() || 0)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#92400e] font-bold text-sm">Discount:</span>
                  <span className="text-gray-900 font-black text-lg">
                    ₹{( patientPackages.length > 0 ? 0 : (calculateTotalDiscount() || 0) ).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#92400e] font-bold text-sm">Paid:</span>
                  <span className="text-[#10b981] font-black text-lg">₹{(parseFloat(currentExamination?.paidAmount as any) || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#92400e] font-bold text-sm">Due:</span>
                  <span className="text-[#ef4444] font-black text-lg">
                    ₹{Math.max(0,
                      ( patientPackages.length > 0
                        ? patientPackages.reduce((sum, pp) => sum + (parseFloat(pp.amount_paid) || 0), 0)
                        : (calculateSubtotal() || 0)
                      ) - ( patientPackages.length > 0 ? 0 : (calculateTotalDiscount() || 0) )
                      - (parseFloat(currentExamination?.paidAmount as any) || 0)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Entry Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-2">
                  <Label className="text-sm font-black text-gray-700">Payment Method</Label>
                  <select
                    value={additionalPaymentMethod}
                    onChange={(e) => setAdditionalPaymentMethod(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                  >
                    {paymentMethods.map(method => (
                      <option key={method.code} value={method.code}>{method.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-black text-gray-700">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={additionalPaymentAmount}
                      onChange={(e) => setAdditionalPaymentAmount(e.target.value)}
                      className="pl-9 h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-black text-gray-700">Notes (Optional)</Label>
                <textarea
                  placeholder="Payment notes..."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full h-24 p-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddAdditionalPayment}
                  disabled={loading}
                  className="bg-[#10b981] hover:bg-emerald-600 text-white px-8 h-12 rounded-xl font-bold shadow-sm active:scale-95 transition-all"
                >
                  Add Payment
                </Button>
                <Button
                  variant="outline"
                  className="px-8 h-12 rounded-xl font-bold border-gray-200 hover:bg-gray-50 active:scale-95 transition-all"
                  onClick={() => {
                    setAdditionalPaymentAmount('0')
                    setPaymentNotes('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>

          {/* Card: Next Visit (Follow-up Appointment) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-emerald-50/40 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-emerald-600 border border-emerald-100">
                <LucideCalendar className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-gray-900">Next Visit Appointment</h3>
            </div>

            <div className="p-6 space-y-6">
              {nextVisitCreated ? (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckSquare className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-700 text-sm">Follow-up appointment created successfully!</p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      {nextVisitDays && (() => {
                        const d = new Date(); d.setDate(d.getDate() + parseInt(nextVisitDays));
                        return d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                      })()}
                    </p>
                  </div>
                  <button onClick={() => { setNextVisitCreated(false); setNextVisitDays(''); }} className="ml-auto text-xs text-emerald-600 underline font-bold">Schedule Another</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  {/* Days Dropdown */}
                  <div className="space-y-2">
                    <Label className="text-sm font-black text-gray-700">Next Visit After</Label>
                    <select
                      value={nextVisitDays}
                      onChange={(e) => {
                        setNextVisitDays(e.target.value)
                        setNextVisitCreated(false)
                      }}
                      className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-100 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select days...</option>
                      {[1, 3, 7, 10, 14, 21, 30, 45, 60, 90].map(d => (
                        <option key={d} value={d}>{d} {d === 1 ? 'Day' : 'Days'}</option>
                      ))}
                    </select>
                  </div>

                  {/* Computed Next Date */}
                  <div className="space-y-2">
                    <Label className="text-sm font-black text-gray-700">Next Appointment Date</Label>
                    <div className={`h-12 rounded-xl border px-4 flex items-center font-black text-sm transition-all ${nextVisitDays ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>
                      {nextVisitDays ? (() => {
                        const d = new Date(); d.setDate(d.getDate() + parseInt(nextVisitDays));
                        return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
                      })() : 'Select days above'}
                    </div>
                  </div>

                  {/* Doctor */}
                  <div className="space-y-2">
                    <Label className="text-sm font-black text-gray-700">Assign Doctor</Label>
                    <select
                      value={nextVisitDoctorId}
                      onChange={(e) => setNextVisitDoctorId(e.target.value)}
                      className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-100 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select doctor...</option>
                      {doctors.map((d: any) => (
                        <option key={d.id} value={d.id}>{d.first_name} {d.last_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {!nextVisitCreated && (
                <div className="flex items-center gap-4 pt-2">
                  <Button
                    onClick={handleCreateNextVisit}
                    disabled={!nextVisitDays || !nextVisitDoctorId || loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 rounded-xl font-bold shadow-sm active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LucideCalendar className="h-4 w-4 mr-2" />
                    Create Follow-up Appointment
                  </Button>
                  {nextVisitDays && nextVisitDoctorId && (
                    <p className="text-xs text-gray-500 font-medium">
                      Will schedule a <span className="text-emerald-600 font-black">follow-up</span> on{' '}
                      <span className="text-gray-900 font-black">
                        {(() => {
                          const d = new Date(); d.setDate(d.getDate() + parseInt(nextVisitDays));
                          return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                        })()}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Payment Installments */}
          {installments.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-gray-900 border border-gray-100">
                  <History className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-gray-900">Payment Installments</h3>
              </div>
              <div className="p-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-gray-400 text-[11px] font-black uppercase tracking-widest border-b border-gray-50">
                        <th className="pb-4 pt-0 px-2 w-16">#</th>
                        <th className="pb-4 pt-0">Payment Method</th>
                        <th className="pb-4 pt-0">Amount</th>
                        <th className="pb-4 pt-0">Date</th>
                        <th className="pb-4 pt-0">Notes</th>
                        <th className="pb-4 pt-0 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {installments.map((inst, idx) => (
                        <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-2 text-sm font-bold text-gray-400">#{idx + 1}</td>
                          <td className="py-4 text-sm font-bold text-gray-700 uppercase">{inst.paymentMethod || inst.payment_method}</td>
                          <td className="py-4 text-sm font-black text-emerald-600">₹{parseFloat(inst.amount).toLocaleString()}</td>
                          <td className="py-4 text-sm font-bold text-gray-400">
                            {format(new Date(inst.paymentDate || inst.payment_date || new Date()), "dd/MM/yyyy")}
                          </td>
                          <td className="py-4 text-xs font-medium text-gray-500 max-w-[250px]" title={inst.notes}>
                            {inst.notes || '-'}
                          </td>
                          <td className="py-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-lg border-gray-200 text-[10px] font-black uppercase text-blue-600 hover:bg-blue-50 hover:border-blue-200 flex items-center gap-2 ml-auto shadow-sm active:scale-95 transition-all"
                              onClick={() => handleShowInstallmentReceipt(inst.id)}
                            >
                              <Receipt className="h-3.5 w-3.5" />
                              Receipt
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-gray-100">
                        <td colSpan={2} className="pt-6 pb-0 text-sm font-black text-gray-900">Total Paid:</td>
                        <td className="pt-6 pb-0 text-xl font-black text-emerald-600">
                          ₹{installments.reduce((sum, inst) => sum + parseFloat(inst.amount), 0).toLocaleString()}
                        </td>
                        <td colSpan={3}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Card 4: Receipt */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-blue-500" />
                Receipt
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleShowReceipt}
                  className="bg-[#3b82f6] hover:bg-blue-600 text-white px-8 h-11 rounded-xl font-bold shadow-sm active:scale-95 transition-all flex items-center gap-2"
                >
                  <Receipt className="h-4 w-4" />
                  All Payments Receipt
                </Button>
                <Button
                  onClick={handleShowTodayReceipt}
                  className="bg-[#10b981] hover:bg-emerald-600 text-white px-8 h-11 rounded-xl font-bold shadow-sm active:scale-95 transition-all flex items-center gap-2"
                >
                  <Receipt className="h-4 w-4" />
                  Today's Receipt
                </Button>
              </div>
            </div>
          </div>

        </div>


        {showReceipt && receiptData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print-receipt-modal">
            <div className="bg-white p-6 w-full h-full overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible print:p-4">
              <div className="max-w-4xl mx-auto">
                <style jsx>{`
                @media print {
                  @page { margin: 0; size: A4; }
                  html, body { height: auto !important; overflow: visible !important; }
                  body > div:not(.print-receipt-modal) { display: none !important; }
                  .print-receipt-modal { display: block !important; position: static !important; width: 100% !important; height: auto !important; background: white !important; }
                  .fixed { position: static !important; }
                  .bg-black, .bg-opacity-50 { background: transparent !important; }
                  .print\:hidden { display: none !important; }
                }
              `}</style>
                <div className="receipt-content text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <img src="/images/patientrecipts.jpeg" alt="Hospital Logo" className="w-50 h-40 object-contain mx-auto" />
                  </div>

                  <p className="text-sm text-gray-600">ISO 9001:2015 Certified</p>
                  <p className="text-sm text-gray-600">{receiptData.location?.address || 'Address not available'}</p>
                  <p className="text-sm text-gray-600">Helpline: {receiptData.location?.phone || 'Phone not available'}</p>
                  <hr className="my-4" />
                  <h3 className="text-lg font-semibold">Payment Receipt</h3>
                  {(billingMode === 'package') && (
                    <p className="text-sm font-bold text-purple-600">Treatment Package: {newPackage.name || 'Custom Package'}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p><strong>Date:</strong> {receiptData.date ? format(new Date(receiptData.date), "dd/MM/yyyy") : format(new Date(), "dd/MM/yyyy")}</p>
                    <p><strong>Name:</strong> {receiptData.patient.first_name || ''} {receiptData.patient.last_name || ''}</p>
                    {receiptData.patient.date_of_birth && (
                      <p><strong>Age/DOB:</strong> {`${calculateAge(receiptData.patient.date_of_birth)} Y / ${format(new Date(receiptData.patient.date_of_birth), "dd/MM/yyyy")}`}</p>
                    )}
                    <p><strong>Renewal Date:</strong> {receiptData.nextRenewalDatePro ? format(new Date(receiptData.nextRenewalDatePro), "dd/MM/yyyy") : (currentExamination?.nextRenewalDatePro ? format(new Date(currentExamination.nextRenewalDatePro), "dd/MM/yyyy") : '')}</p>
                  </div>
                  <div>
                    <p><strong>UHID:</strong> {receiptData.patient.patient_id || ''}</p>
                    {receiptData.patient.mobile && (
                      <p><strong>Mobile:</strong> {receiptData.patient.mobile}</p>
                    )}
                    <p><strong>Address:</strong> {receiptData.patient.address1 || ''}</p>
                  </div>
                </div>

                <table className="w-full border-collapse border border-gray-300 mb-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">S.No.</th>
                      <th className="border border-gray-300 p-2">Mode</th>
                      <th className="border border-gray-300 p-2">Amount(Rs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receiptData.installments ? receiptData.installments.map((installment: any, index: number) => (
                      <tr key={installment.id}>
                        <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                        <td className="border border-gray-300 p-2 text-center">{installment.paymentMethod || installment.payment_method}</td>
                        <td className="border border-gray-300 p-2 text-right">{installment.amount}</td>
                      </tr>
                    )) : receiptData.installment && (
                      <tr>
                        <td className="border border-gray-300 p-2 text-center">1</td>
                        <td className="border border-gray-300 p-2 text-center">{receiptData.installment.paymentMethod || receiptData.installment.payment_method}</td>
                        <td className="border border-gray-300 p-2 text-right">{receiptData.installment.amount}</td>
                      </tr>
                    )}
                    <tr className="font-bold">
                      <td colSpan={2} className="border border-gray-300 p-2 text-right">
                        {receiptData.isDailyReceipt ? 'Today\'s Payment' : 'Paid Amount'} (Rupees {receiptData.paidAmount} Only)
                      </td>
                      <td className="border border-gray-300 p-2 text-right">{receiptData.paidAmount}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-sm mb-4">
                  <p>Received with thanks Rs. {receiptData.paidAmount}/- from Mr. {receiptData.patient.first_name} {receiptData.patient.last_name}.</p>
                </div>



                <div className="mt-8 text-xs">
                  <h4 className="font-bold mb-3 text-center">TERMS & CONDITIONS</h4>
                  <ul className="space-y-1 text-justify">
                    <li>• The facilities of joining the card includes any number of consultations with physician.</li>
                    <li>• Only the bearer can avail the facilities of the card. The card facilities are given only to the one on whose name the card is made.</li>
                    <li>• The fee is non transferable, non refundable and non extendable.</li>
                    <li>• Patients are strictly advised to use medicines as per attending physicians recommendation. We assume patients have the responsibility to inform the attending physician about the status of the health or any serious disorder during the course of treatment.</li>
                    <li>• We expect & would appreciate patients to visit the clinic as per the due date of their consultations.</li>
                    <li>• Patients are requested to co-operate with the mode of treatment, as sometimes, the speed of recovery is slow (the time of recovery may vary).</li>
                    <li>• The duration of treatment and results may vary from patient.</li>
                    <li>• The Doctor and the clinic has given no guarantee to me (Patient) about the results and duration of the treatment.</li>
                    <li>• During critical emergencies patients / attendants are advised to inform the attending physician.</li>
                    <li>• Case Sheet Record are(Digital) and kept with the Doctor (in Server) till the end of the course of the treatment.</li>
                    <li>• This Corporate Clinic, promises to provide Best Service and Treatment to all Patients.</li>
                    <li>• All disputes are subject to Narasaraopet Court Jurisdication only.E&OE.</li>
                  </ul>
                </div>

                <div className="flex justify-between mt-8 text-sm">
                  <div>
                    <p>Patients Signature</p>
                    <div className="border-b border-gray-400 w-32 mt-4"></div>
                  </div>
                  <div>
                    <p>Authorised Signature</p>
                    <div className="border-b border-gray-400 w-32 mt-4"></div>
                  </div>
                </div>

                <div className="flex gap-2 print:hidden">
                  <Button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700">
                    Print Receipt
                  </Button>
                  <Button variant="outline" onClick={() => setShowReceipt(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </PrivateRoute>
  )
}