"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"
import authService from "@/lib/authService"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Receipt, CreditCard, DollarSign, IndianRupee, Calendar, Clock, Info, Check, X, Package, ChevronLeft, PackageCheck, Trash2, Plus, User as UserIcon, Phone, Save, ChevronRight, History, Printer } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PharmacyPage() {
  const [billedProducts, setBilledProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [serviceProducts, setServiceProducts] = useState<any[]>([])
  const limit = 10
  const hasLoadedRef = useRef(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  
  // Dispatched History States
  const [dispatchedProducts, setDispatchedProducts] = useState<any[]>([])
  const [dispatchedPage, setDispatchedPage] = useState(1)
  const [dispatchedTotalPages, setDispatchedTotalPages] = useState(1)
  const [dispatchedTotalCount, setDispatchedTotalCount] = useState(0)
  const [dispatchedLoading, setDispatchedLoading] = useState(false)
  const [refillModalOpen, setRefillModalOpen] = useState(false);
  const [selectedRefillRecord, setSelectedRefillRecord] = useState<any>(null);
  const [refillDays, setRefillDays] = useState("0");
  const [refillQty, setRefillQty] = useState("0");
  const [isSavingRefill, setIsSavingRefill] = useState(false);
  const [showPatientHistory, setShowPatientHistory] = useState(false);
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [patientHistoryLoading, setPatientHistoryLoading] = useState(false);
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState<any>(null);
  const [patientHistoryPage, setPatientHistoryPage] = useState(1);
  const [patientHistoryTotalPages, setPatientHistoryTotalPages] = useState(1);
  const [patientHistoryTotalCount, setPatientHistoryTotalCount] = useState(0);
  
  // Pharmacy Billing Modal States
  const [showBillModal, setShowBillModal] = useState(false)
  const [selectedExam, setSelectedExam] = useState<any>(null)
  const [billingData, setBillingData] = useState(null)
  const [billingLoading, setBillingLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentNotes, setPaymentNotes] = useState("")
  const [editableProducts, setEditableProducts] = useState<any[]>([])
  
  // Dispatch (Product Modification) Modal States
  const [isDispatchView, setIsDispatchView] = useState(false)
  const [selectedDispatchExam, setSelectedDispatchExam] = useState<any>(null)
  const [dispatchItems, setDispatchItems] = useState<any[]>([])
  const [dispatchLoading, setDispatchLoading] = useState(false)
  const [activeProductDropdown, setActiveProductDropdown] = useState<number | null>(null)

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchData(page, searchTerm)
    } else {
      fetchDispatchedData(dispatchedPage)
    }
    fetchServiceProducts()
  }, [page, activeTab, dispatchedPage])

  const fetchServiceProducts = async () => {
    try {
      const data = await settingsApi.getServiceProducts()
      setServiceProducts(data)
    } catch (error) {
      console.error('Error fetching service products:', error)
    }
  }

  const handleSearch = () => {
    if (page === 1) {
      fetchData(1, searchTerm);
    } else {
      setPage(1); // will trigger the useEffect
    }
  }

  const handleClearSearch = () => {
    setSearchTerm("");
    if (page === 1) {
      fetchData(1, "");
    } else {
      setPage(1);
    }
  }

  const fetchData = async (currentPage: number = 1, search: string = "") => {
    try {
      setLoading(true)
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const locationId = userData.locationId || userData.primary_location_id || 1;

      const result = await settingsApi.getPharmacyBilledProducts(locationId, currentPage, limit, search)
      if (result && result.data && Array.isArray(result.data)) {
        setBilledProducts(result.data)
        setTotalPages(result.totalPages || 1)
        setTotalCount(result.totalCount || 0)
      } else if (Array.isArray(result)) {
        setBilledProducts(result)
        setTotalPages(1)
        setTotalCount(result.length)
      } else {
        setBilledProducts([])
        setTotalPages(1)
        setTotalCount(0)
      }
    } catch (error) {
      console.error('Error fetching pharmacy data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDispatchedData = async (currentPage: number = 1) => {
    try {
      setDispatchedLoading(true)
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const locationId = userData.locationId || userData.primary_location_id || 1;

      const result = await settingsApi.getDispatchHistory(locationId, currentPage, limit)
      if (result && result.data) {
        setDispatchedProducts(result.data)
        setDispatchedTotalPages(result.totalPages || 1)
        setDispatchedTotalCount(result.total || 0)
      }
    } catch (error) {
      console.error('Error fetching dispatch history:', error)
      toast({ title: "Error", description: "Failed to load dispatch history", variant: "destructive" })
    } finally {
      setDispatchedLoading(false)
    }
  }

  const fetchBillingData = async (examinationId: number) => {
    try {
      setBillingLoading(true)
      const data = await settingsApi.getPharmacyBilling(examinationId)
      setBillingData(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch billing details",
        variant: "destructive",
      })
    } finally {
      setBillingLoading(false)
    }
  }

  const handleOpenBillModal = (exam: any) => {
    setSelectedExam(exam)
    setEditableProducts(JSON.parse(JSON.stringify(exam.products || []))) // Deep copy
    setShowBillModal(true)
    fetchBillingData(exam.examination_id)
  }

  const handlePrintReceipt = () => {
    const printContent = document.getElementById('pharmacy-receipt-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Pharmacy Receipt - ${selectedExam?.patient_name}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .hospital-name { font-size: 24px; font-weight: bold; margin: 0; }
            .receipt-title { font-size: 18px; color: #666; margin-top: 5px; }
            .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .patient-info p, .bill-info p { margin: 5px 0; }
            .label { font-weight: bold; color: #888; text-transform: uppercase; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; background: #f9f9f9; padding: 12px; border-bottom: 2px solid #eee; font-size: 13px; }
            td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
            .totals { float: right; width: 300px; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .grand-total { border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 18px; }
            .footer { margin-top: 100px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eee; padding-top: 20px; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="hospital-name">Skin & Hair Clinic</h1>
            <p class="receipt-title">Pharmacy Bill Receipt</p>
          </div>
          <div class="details">
            <div class="patient-info">
              <p><span class="label">Patient Name:</span><br>${selectedExam?.patient_name}</p>
              <p><span class="label">Patient ID:</span><br>${selectedExam?.patient_code}</p>
              <p><span class="label">Contact:</span><br>${selectedExam?.mobile || 'N/A'}</p>
            </div>
            <div class="bill-info">
              <p><span class="label">Receipt No:</span><br>#PH-${billingData?.id || 'NEW'}</p>
              <p><span class="label">Date:</span><br>${new Date().toLocaleDateString()}</p>
              <p><span class="label">Status:</span><br>${billingData?.balanceAmount > 0 ? 'PARTIAL' : 'PAID'}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${editableProducts.map((p: any) => {
                const price = parseFloat(p.price) || 0;
                const qty = parseInt(p.quantity) || 0;
                return `
                  <tr>
                    <td>${p.service}</td>
                    <td>${qty}</td>
                    <td style="text-align: right;">₹${price.toLocaleString()}</td>
                    <td style="text-align: right;">₹${(price * qty).toLocaleString()}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <div class="totals">
            <div class="total-row">
              <span>Total Bill Amount:</span>
              <span>₹${(billingData?.totalAmount || 0).toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span>Paid Amount:</span>
              <span>₹${(billingData?.paidAmount || 0).toLocaleString()}</span>
            </div>
            <div class="total-row grand-total">
              <span>Balance Due:</span>
              <span>₹${(billingData?.balanceAmount || 0).toLocaleString()}</span>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for choosing our services.</p>
            <p>This is a computer-generated receipt.</p>
          </div>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  const handleProductChange = (index: number, field: string, value: string) => {
    const updated = [...editableProducts]
    if (field === 'quantity') {
      updated[index].quantity = parseInt(value) || 0
    } else if (field === 'price') {
      updated[index].price = value
    }
    setEditableProducts(updated)
  }

  const handleUpdateProducts = async () => {
    try {
      setBillingLoading(true)
      await settingsApi.updatePatientExamination(selectedExam.examination_id, {
        services: editableProducts
      })
      toast({ title: "Success", description: "Quantities and prices updated successfully" })
      
      // Update local exam data too
      const updatedExam = { ...selectedExam, products: editableProducts }
      setSelectedExam(updatedExam)
      
      // Re-fetch billing to sync totals
      await fetchBillingData(selectedExam.examination_id)
      // Refresh main list
      await fetchData(page, searchTerm)
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to update products", variant: "destructive" })
    } finally {
      setBillingLoading(false)
    }
  }

  const handleAddPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid payment amount", variant: "destructive" })
      return
    }

    try {
      setBillingLoading(true)
      await settingsApi.addPharmacyPayment(billingData.id, {
        method: paymentMethod,
        amount: parseFloat(paymentAmount),
        notes: paymentNotes
      })
      toast({ title: "Success", description: "Payment added successfully" })
      setPaymentAmount("")
      setPaymentNotes("")
      await fetchBillingData(selectedExam.examination_id)
      await fetchData(page, searchTerm)
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to add payment", variant: "destructive" })
    } finally {
      setBillingLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleBulkStatus = async (examinationId: number, status: string) => {
    try {
      setLoading(true)
      await settingsApi.updateAllBilledProductsStatus(examinationId, status)
      toast({
        title: "Success",
        description: `All products marked as ${status} successfully`,
      })
      await fetchData(page, searchTerm) 
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to update products`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDispatchModal = (exam: any) => {
    setSelectedDispatchExam(exam)
    // Map existing products and ensure they have necessary fields
    const formattedItems = (exam.products || []).map((p: any) => ({
      service: p.service || '',
      quantity: p.quantity || 1,
      days: p.days || '',
      price: p.price || 0,
      status: p.status || 'Pending',
      type: 'Product'
    }))
    setDispatchItems(formattedItems)
    setIsDispatchView(true)
  }

  const handleUpdateDispatchItem = (index: number, field: string, value: any) => {
    const updated = [...dispatchItems]
    updated[index] = { ...updated[index], [field]: value }
    
    // If service changes, try to update price from master list
    if (field === 'service') {
      const master = serviceProducts.find(sp => sp.name.toLowerCase().trim() === value.toLowerCase().trim())
      if (master) {
        updated[index].price = master.amount || master.price || 0
      }
    }
    
    setDispatchItems(updated)
  }

  const handleAddDispatchItem = () => {
    setDispatchItems([...dispatchItems, { service: '', quantity: 1, days: '', price: 0, type: 'Product' }])
  }

  const handleRemoveDispatchItem = (index: number) => {
    if (dispatchItems.length > 1) {
      setDispatchItems(dispatchItems.filter((_, i) => i !== index))
    }
  }

  const handleSaveDispatch = async () => {
    if (!selectedDispatchExam) return
    
    try {
      setDispatchLoading(true)
      const updatedItems = dispatchItems.map(item => ({
        ...item,
        status: 'Received'
      }))

      await settingsApi.updatePatientExamination(selectedDispatchExam.examination_id, {
        services: updatedItems
      })

      // Format dispatch data for the tracking table
      const dispatchRecords = updatedItems.map((item: any) => ({
        examinationId: selectedDispatchExam.examination_id,
        patientId: selectedDispatchExam.patient_id,
        productName: item.service,
        doctorQuantity: item.quantity, 
        doctorDays: item.days ? parseInt(item.days.toString()) : 0,
        dispatchedQuantity: item.quantity,
        dispatchedDays: item.days ? parseInt(item.days.toString()) : 0,
        locationId: selectedDispatchExam.location_id,
        notes: "Direct dispatch from pharmacy"
      }))

      // Record dispatch in dedicated table
      await settingsApi.createBulkPharmacyDispatch({ dispatches: dispatchRecords })

      toast({ title: "Success", description: "Prescription updated and dispatch recorded successfully" })
      setIsDispatchView(false)
      setSelectedDispatchExam(null)
      fetchData(page, searchTerm)
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to save dispatch details", variant: "destructive" })
    } finally {
      setDispatchLoading(false)
    }
  }

  const openRefillModal = (record: any) => {
    setSelectedRefillRecord(record);
    setRefillDays("0");
    setRefillQty("0");
    setRefillModalOpen(true);
  }

  const handleSaveRefill = async () => {
    if (!selectedRefillRecord) return;
    setIsSavingRefill(true);
    try {
      await settingsApi.createPharmacyDispatch({
        examinationId: Number(selectedRefillRecord.examinationId),
        patientId: Number(selectedRefillRecord.patientId),
        productName: selectedRefillRecord.productName,
        doctorQuantity: Number(selectedRefillRecord.doctorQuantity || 0),
        doctorDays: Number(selectedRefillRecord.doctorDays || 0),
        dispatchedQuantity: Number(refillQty) || 0,
        dispatchedDays: Number(refillDays) || 0,
        locationId: Number(selectedRefillRecord.locationId || 1),
        notes: "Refill"
      });
      toast({ title: "Success", description: "Refill recorded successfully" });
      setRefillModalOpen(false);
      fetchDispatchedData(dispatchedPage);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save refill", variant: "destructive" });
    } finally {
      setIsSavingRefill(false);
    }
  }

  const fetchPatientHistory = async (patientId: number, patientInfo: any, pageNum: number = 1) => {
    try {
      setPatientHistoryLoading(true);
      setSelectedPatientForHistory(patientInfo);
      setPatientHistoryPage(pageNum);
      setShowPatientHistory(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const locationId = userData.locationId || userData.primary_location_id || 1;
      
      const response = await fetch(`${authService.getSettingsApiUrl()}/pharmacy-dispatch/list?locationId=${locationId}&patientId=${patientId}&page=${pageNum}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${authService.getCurrentToken()}`,
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (result && result.data) {
        setPatientHistory(result.data);
        setPatientHistoryTotalPages(result.totalPages || 1);
        setPatientHistoryTotalCount(result.total || 0);
      }
    } catch (error) {
      console.error('Error fetching patient history:', error);
      toast({ title: "Error", description: "Failed to load medication history", variant: "destructive" });
    } finally {
      setPatientHistoryLoading(false);
    }
  };

  const calculateMedicationStats = () => {
    const stats: { [key: string]: number } = {};
    patientHistory.forEach(d => {
      const name = d.productName;
      stats[name] = (stats[name] || 0) + 1;
    });
    return Object.entries(stats).map(([name, count]) => ({ name, count }));
  };

  return (
    <PrivateRoute modulePath="admin/pharmacy" action="view">
      <div className="p-6 space-y-6">
        {isDispatchView ? (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 w-9 p-0 rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
                onClick={() => setIsDispatchView(false)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dispatch & Modification</h1>
                <p className="text-gray-600">Modify and record prescription dispatch</p>
              </div>
            </div>

            <Card className="border-2 border-blue-200 shadow-xl overflow-hidden rounded-2xl">
              <CardHeader className="bg-blue-600 text-white py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <PackageCheck className="h-6 w-6" />
                    Prescription Dispatch Detail
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-8 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                      <UserIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-blue-400 tracking-widest mb-0.5">Patient Name</p>
                      <p className="font-bold text-gray-900 text-lg leading-tight">{selectedDispatchExam?.patient_name}</p>
                    </div>
                  </div>
                  <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-sm">
                      <Info className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-purple-400 tracking-widest mb-0.5">Patient ID</p>
                      <p className="font-bold text-gray-900 text-lg leading-tight">{selectedDispatchExam?.patient_code}</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                      <Check className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-emerald-400 tracking-widest mb-0.5">Assigned Doctor</p>
                      <p className="font-bold text-emerald-700 text-lg leading-tight">{selectedDispatchExam?.doctor_name || 'Not Assigned'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-500" />
                      Product & Service List
                    </h3>
                  </div>
                  
                  <div className="border rounded-2xl overflow-hidden border-gray-100 shadow-sm ring-1 ring-gray-50">
                    <Table>
                      <TableHeader className="bg-gray-50/80">
                        <TableRow>
                          <TableHead className="py-6 px-8 text-emerald-900 font-extrabold uppercase tracking-widest text-[11px]">Product</TableHead>
                          <TableHead className="text-center text-emerald-900 font-extrabold uppercase tracking-widest text-[11px]">Days</TableHead>
                          <TableHead className="text-center text-emerald-900 font-extrabold uppercase tracking-widest text-[11px]">Quantity</TableHead>
                          <TableHead className="text-center text-emerald-900 font-extrabold uppercase tracking-widest text-[11px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dispatchItems.map((item, idx) => (
                          <TableRow key={idx} className="hover:bg-blue-50/20 transition-colors border-b last:border-0 border-gray-50">
                            <TableCell className="py-4 px-6 relative">
                              <div className="relative">
                                <Input
                                  placeholder="Search product..."
                                  value={item.service}
                                  onChange={(e) => handleUpdateDispatchItem(idx, 'service', e.target.value)}
                                  onFocus={() => setActiveProductDropdown(idx)}
                                  onBlur={() => setTimeout(() => setActiveProductDropdown(null), 200)}
                                  className="rounded-xl border-gray-200 h-10 shadow-sm focus:ring-blue-500"
                                />
                                {activeProductDropdown === idx && (
                                  <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-72 overflow-y-auto py-3 ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-200">
                                    {serviceProducts
                                      .filter(p => p.name.toLowerCase().includes(item.service.toLowerCase()))
                                      .map(p => (
                                        <div
                                          key={p.id}
                                          className="px-6 py-2.5 hover:bg-blue-50 cursor-pointer text-sm font-semibold text-gray-700 transition-colors"
                                          onMouseDown={() => {
                                            handleUpdateDispatchItem(idx, 'service', p.name);
                                            setActiveProductDropdown(null);
                                          }}
                                        >
                                          {p.name}
                                        </div>
                                      ))
                                    }
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                value={item.days}
                                onChange={(e) => handleUpdateDispatchItem(idx, 'days', e.target.value)}
                                className="text-center rounded-xl border-gray-200 h-10 shadow-sm text-lg"
                                placeholder="Days"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleUpdateDispatchItem(idx, 'quantity', e.target.value)}
                                className="text-center rounded-xl border-gray-200 h-10 shadow-sm text-lg font-black text-blue-700"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-400 hover:text-red-600 hover:bg-red-50 h-10 w-10 p-0 rounded-full"
                                onClick={() => handleRemoveDispatchItem(idx)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <div className="p-6 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl border-blue-300 text-blue-700 h-12 px-6 font-bold hover:bg-blue-100 shadow-sm transition-all active:scale-95" 
                        onClick={handleAddDispatchItem}
                      >
                        <Plus className="h-5 w-5 mr-2" /> Add Product
                      </Button>
                      <div className="flex items-center gap-10">
                        <div className="text-right">
                          <p className="text-[11px] uppercase font-black text-gray-400 tracking-[0.2em] mb-1">Total Payable</p>
                          <p className="text-3xl font-black text-blue-900 tracking-tight">
                            ₹{dispatchItems.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0), 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-4">
                           <Button 
                            variant="outline" 
                            className="rounded-2xl h-14 px-10 font-bold border-gray-200 hover:bg-gray-100 text-gray-700 shadow-sm" 
                            onClick={() => setIsDispatchView(false)}
                           >
                            Cancel
                           </Button>
                           <Button 
                            className="rounded-2xl bg-blue-600 hover:bg-blue-700 h-14 px-14 font-black text-lg shadow-lg shadow-blue-200 transition-all hover:translate-y-[-2px] active:translate-y-[1px]" 
                            onClick={handleSaveDispatch} 
                            disabled={dispatchLoading}
                           >
                             {dispatchLoading ? (
                               <div className="flex items-center gap-2">
                                 <Clock className="h-5 w-5 animate-spin" /> Saving...
                               </div>
                             ) : 'Confirm & Dispatch'}
                           </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Pharmacy</h1>
                <p className="text-gray-500 font-medium">Manage prescriptions, billing, and medicine dispatch tracking</p>
              </div>
              <div className="flex gap-3">
                <Link href="/admin/pharmacy/dispatched">
                  <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 h-11 px-6 rounded-xl font-bold shadow-sm transition-all hover:shadow-md">
                    <PackageCheck className="h-4 w-4 mr-2" />
                    Dispatched List
                  </Button>
                </Link>
                <Link href="/admin/pharmacy/due">
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 h-11 px-6 rounded-xl font-bold shadow-sm transition-all hover:shadow-md">
                    <Clock className="h-4 w-4 mr-2" />
                    View Dues
                  </Button>
                </Link>
                <Button 
                  onClick={() => activeTab === 'pending' ? fetchData(page, searchTerm) : fetchDispatchedData(dispatchedPage)} 
                  variant="outline" 
                  disabled={loading || dispatchedLoading}
                  className="h-11 px-6 rounded-xl font-bold border-gray-200 hover:bg-gray-50 shadow-sm"
                >
                  Refresh List
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-gray-100/80 p-1.5 rounded-2xl mb-8 flex w-fit gap-2 border border-gray-100 shadow-inner">
                <TabsTrigger 
                  value="pending" 
                  className="rounded-xl px-10 h-12 font-black text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg transition-all"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Pending Prescriptions ({totalCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="dispatched" 
                  className="rounded-xl px-10 h-12 font-black text-sm data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-lg transition-all"
                >
                  <PackageCheck className="h-4 w-4 mr-2" />
                  Dispatched History ({dispatchedTotalCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-0 space-y-6 animate-in slide-in-from-left-4 duration-500">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 max-w-md flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search Patient Name, ID, or Mobile..."
                        className="pl-11 h-12 rounded-2xl border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      {searchTerm && (
                        <button 
                          onClick={handleClearSearch}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <Button onClick={handleSearch} className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-100 transition-all active:scale-95">
                      Search
                    </Button>
                  </div>
                </div>

                <Card className="shadow-2xl border-gray-100 w-full overflow-hidden rounded-3xl border-0 ring-1 ring-gray-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50/80 to-indigo-50/30 border-b border-blue-100/50 py-5">
                    <CardTitle className="flex items-center space-x-3 text-blue-900">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xl font-black">Billed Products Listing</span>
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-0.5">Pending Action</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50/50 border-b border-gray-100">
                            <TableHead className="font-black text-gray-800 py-5 px-8 text-xs uppercase tracking-wider">Date/Time</TableHead>
                            <TableHead className="font-black text-gray-800 text-xs uppercase tracking-wider">Patient Info</TableHead>
                            <TableHead className="font-black text-gray-800 text-xs uppercase tracking-wider">Prescribed Items</TableHead>
                            <TableHead className="font-black text-gray-800 text-center text-xs uppercase tracking-wider">Total Amount</TableHead>
                            <TableHead className="font-black text-gray-800 text-center text-xs uppercase tracking-wider">Due Amount</TableHead>
                            <TableHead className="font-black text-gray-800 text-center text-xs uppercase tracking-wider">Status</TableHead>
                            <TableHead className="font-black text-gray-800 text-right py-5 px-8 text-xs uppercase tracking-wider">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-24">
                                <div className="flex flex-col items-center gap-4">
                                  <div className="relative">
                                    <div className="h-14 w-14 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                                  </div>
                                  <p className="text-gray-400 font-bold text-lg">Retrieving pending prescriptions...</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : billedProducts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-24">
                                <div className="max-w-md mx-auto space-y-3 opacity-60">
                                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <Search className="h-10 w-10 text-gray-400" />
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-900">No Pending Requests</h3>
                                  <p className="text-gray-500 font-medium">All prescribes medicines for the current location have been processed.</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            billedProducts.map((exam) => (
                              <TableRow key={exam.examination_id} className="hover:bg-blue-50/10 transition-colors border-b border-gray-50 last:border-0 group">
                                <TableCell className="py-6 px-8">
                                  <div className="flex flex-col">
                                    <span className="font-black text-gray-900">{formatDate(exam.created_at)}</span>
                                    <span className="text-[11px] text-blue-400 font-bold uppercase tracking-tight">
                                      {new Date(exam.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="font-black text-gray-900 text-base">{exam.patient_name}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] font-black px-2">{exam.patient_code}</Badge>
                                      <span className="text-xs text-gray-400 font-medium">{exam.mobile || 'No Mobile'}</span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                                    {(exam.products || []).map((p: any, idx: number) => (
                                      <Badge key={idx} variant="outline" className="bg-white text-[11px] font-bold text-gray-700 py-1 px-2.5 border-gray-100 shadow-sm">
                                        {p.service}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <span className="text-lg font-black text-gray-900">
                                    ₹{((exam.total_amount !== undefined && exam.total_amount !== null)
                                      ? exam.total_amount
                                      : (exam.products?.reduce((acc: number, p: any) => acc + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0), 0) || 0)
                                    ).toLocaleString()}
                                  </span>
                                </TableCell>
                                <TableCell className="text-center">
                                  <span className="text-lg font-black text-red-600">
                                    ₹{((exam.due_amount !== undefined && exam.due_amount !== null)
                                      ? exam.due_amount
                                      : (exam.products?.reduce((acc: number, p: any) => acc + (parseFloat(p.price) || 0) * (parseInt(p.quantity) || 0), 0) || 0)
                                    ).toLocaleString()}
                                  </span>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge 
                                    className={`font-black px-4 py-1.5 rounded-2xl text-[11px] tracking-wide uppercase transition-all ${
                                      exam.pharmacy_status === 'Received' || exam.pharmacy_status === 'Issued'
                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                        : 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse'
                                    }`}
                                  >
                                    {exam.pharmacy_status || 'Pending'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right py-6 px-8">
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                    <Button 
                                      size="sm" 
                                      className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl px-5 h-10 shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                      onClick={() => handleOpenDispatchModal(exam)}
                                    >
                                      <PackageCheck className="h-4 w-4 mr-2" />
                                      Dispatch
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="icon" 
                                      className="h-10 w-10 text-emerald-600 border-emerald-200 hover:bg-emerald-50 rounded-xl transition-all"
                                      onClick={() => handleBulkStatus(exam.examination_id, 'Received')}
                                      title="Mark Received"
                                    >
                                      <Check className="h-5 w-5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Pending Pagination */}
                {billedProducts.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-50 bg-gray-50/30 gap-4 mt-4 rounded-b-3xl">
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 italic">
                      Showing <span className="text-blue-600 font-black">{Math.min(((page - 1) * limit) + 1, totalCount)}</span> to <span className="text-blue-600 font-black">{Math.min(page * limit, totalCount)}</span> of {totalCount} records
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-bold h-11 px-6 border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 transition-all active:scale-95 disabled:opacity-20"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1.5 mx-1">
                        {Array.from({ length: Number(totalPages) || 1 }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? "default" : "outline"}
                              size="sm"
                              className={`w-11 h-11 rounded-xl font-black transition-all ${
                                page === pageNum 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100 scale-110' 
                                : 'border-gray-100 bg-white text-gray-400 hover:text-blue-600 hover:border-blue-100'
                              }`}
                              onClick={() => setPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-bold h-11 px-6 border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 transition-all active:scale-95 disabled:opacity-20"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="dispatched" className="mt-0 space-y-6 animate-in slide-in-from-right-4 duration-500">
                <Card className="shadow-2xl border-gray-100 w-full overflow-hidden rounded-3xl border-0 ring-1 ring-gray-100">
                  <CardHeader className="bg-gradient-to-r from-emerald-50/80 to-teal-50/30 border-b border-emerald-100/50 py-5">
                    <CardTitle className="flex items-center space-x-3 text-emerald-900">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <PackageCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xl font-black">Dispatched Item Tracking</span>
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-0.5">Refill & History</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50/50 border-b border-gray-100">
                            <TableHead className="font-black text-gray-800 py-5 px-8 text-xs uppercase tracking-wider">Dispensed On</TableHead>
                            <TableHead className="font-black text-gray-800 text-xs uppercase tracking-wider">Patient</TableHead>
                            <TableHead className="font-black text-gray-800 text-xs uppercase tracking-wider">Product Info</TableHead>
                            <TableHead className="font-black text-gray-800 text-center text-xs uppercase tracking-wider">Duration/Qty</TableHead>
                            <TableHead className="font-black text-gray-800 text-center text-xs uppercase tracking-wider">Refill Due</TableHead>
                            <TableHead className="font-black text-gray-800 text-center py-5 px-8 text-xs uppercase tracking-wider">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dispatchedLoading ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-24">
                                <div className="flex flex-col items-center gap-4">
                                  <div className="h-14 w-14 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
                                  <p className="text-gray-400 font-bold text-lg">Calculating history...</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : dispatchedProducts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-24 text-gray-400 font-bold text-lg italic">
                                NO DISPATCH RECORDS FOUND
                              </TableCell>
                            </TableRow>
                          ) : (
                            dispatchedProducts.map((record) => (
                              <TableRow key={record.id} className="hover:bg-emerald-50/10 transition-colors border-b border-gray-50 last:border-0 group">
                                <TableCell className="py-6 px-8">
                                  <div className="flex flex-col">
                                    <span className="font-black text-gray-900">{formatDate(record.dispatchDate || record.createdAt)}</span>
                                    <span className="text-[10px] text-emerald-400 font-bold tracking-tighter uppercase font-black">Ref: #{record.id}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                   <div 
                                    className="flex flex-col cursor-pointer hover:bg-emerald-50 p-1 rounded-lg transition-colors group/patient"
                                    onClick={() => fetchPatientHistory(record.patientId, record.patient)}
                                   >
                                     <span className="font-black text-gray-900 text-base group-hover/patient:text-emerald-700">{record.patient?.first_name} {record.patient?.last_name}</span>
                                     <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-black w-fit mt-1 px-2">
                                       {record.patient?.patient_code}
                                     </Badge>
                                     <span className="text-[10px] text-blue-500 font-bold mt-1 opacity-0 group-hover/patient:opacity-100 transition-opacity">Click for history</span>
                                   </div>
                                 </TableCell>
                                <TableCell>
                                  <span className="font-extrabold text-emerald-900 text-base tracking-tight">{record.productName}</span>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex flex-col items-center">
                                    <span className="font-black text-gray-900 text-lg leading-tight">{record.dispatchedQuantity} U</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{record.dispatchedDays} Days Supply</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex flex-col items-center">
                                    <span className="font-black text-gray-800 tracking-tighter text-lg leading-tight">
                                      {record.dueDate ? formatDate(record.dueDate) : 'N/A'}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right px-8">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button 
                                      onClick={() => {
                                        window.location.href = `/admin/telecaller/call-patient?patientId=${record.patientId}`
                                      }}
                                      variant="outline" 
                                      className="h-9 w-9 p-0 rounded-xl border-gray-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                                      title="Call Patient"
                                    >
                                      <Phone className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      onClick={() => openRefillModal(record)}
                                      variant="outline" 
                                      className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white h-9 px-3 rounded-xl font-black text-[10px] uppercase transition-all shadow-sm flex items-center gap-1.5"
                                    >
                                      <Plus className="h-3 w-3" />
                                      Refill
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Dispatched Pagination */}
                {dispatchedProducts.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-50 bg-gray-50/30 gap-4 mt-4 rounded-b-3xl">
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 italic">
                      Showing <span className="text-emerald-600 font-black">{Math.min(((dispatchedPage - 1) * limit) + 1, dispatchedTotalCount)}</span> to <span className="text-emerald-600 font-black">{Math.min(dispatchedPage * limit, dispatchedTotalCount)}</span> of {dispatchedTotalCount} items
                    </div>
                    <div className="flex items-center gap-2">
                       <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-bold h-11 px-6 border-emerald-100 text-emerald-700 disabled:opacity-30 hover:bg-white transition-all active:scale-95"
                        disabled={dispatchedPage === 1}
                        onClick={() => setDispatchedPage(dispatchedPage - 1)}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Prev
                      </Button>
                      <div className="flex items-center gap-1.5 mx-1">
                        {Array.from({ length: Number(dispatchedTotalPages) || 1 }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={dispatchedPage === pageNum ? "default" : "outline"}
                              size="sm"
                              className={`w-11 h-11 rounded-xl font-black transition-all ${
                                dispatchedPage === pageNum 
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-200 scale-110' 
                                : 'border-emerald-100 bg-white text-emerald-600 hover:border-emerald-200'
                              }`}
                              onClick={() => setDispatchedPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-bold h-11 px-6 border-emerald-100 text-emerald-700 disabled:opacity-30 hover:bg-white transition-all active:scale-95"
                        disabled={dispatchedPage >= dispatchedTotalPages}
                        onClick={() => setDispatchedPage(dispatchedPage + 1)}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Pharmacy Billing Modal */}
            <Dialog open={showBillModal} onOpenChange={setShowBillModal}>
              <DialogContent className="max-w-[98vw] w-full p-0 overflow-hidden border-0 rounded-3xl shadow-2xl h-[95vh] flex flex-col">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <DialogTitle className="flex items-center text-3xl font-black gap-3">
                        <Receipt className="h-8 w-8" />
                        Billing Overview
                      </DialogTitle>
                      <Badge className="bg-white/20 text-white border-0 py-1.5 px-4 font-bold rounded-lg text-xs backdrop-blur-md">
                        {selectedExam?.patient_code}
                      </Badge>
                    </div>
                    <p className="text-blue-100 font-medium mt-2 text-lg">Patient: {selectedExam?.patient_name}</p>
                  </DialogHeader>
                </div>

                {billingLoading && !billingData ? (
                  <div className="py-32 text-center">
                    <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent animate-spin rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400 font-bold">Synchronizing billing records...</p>
                  </div>
                ) : (
                  <div className="p-4 md:p-8 space-y-8 flex-1 overflow-y-auto bg-white custom-scrollbar">
                    {/* Patient and Billing Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="md:col-span-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Patient Info</p>
                        <p className="font-bold text-gray-900 truncate">{selectedExam?.patient_name}</p>
                        <p className="text-xs text-blue-500 font-bold">{selectedExam?.patient_code}</p>
                        <p className="text-xs text-gray-400 mt-1">{selectedExam?.mobile || 'No Mobile'}</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Bill</p>
                        <p className="text-2xl font-black text-blue-900">₹{(billingData?.totalAmount || 0).toLocaleString()}</p>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Paid Amount</p>
                        <p className="text-2xl font-black text-emerald-900">₹{(billingData?.paidAmount || 0).toLocaleString()}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Due Amount</p>
                        <p className="text-2xl font-black text-red-900">₹{(billingData?.balanceAmount || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <Separator className="bg-gray-100" />

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                      <div className="xl:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-500" />
                            Prescribed Medicines
                          </h3>
                        </div>
                        <div className="space-y-3" id="pharmacy-receipt-content">
                          {editableProducts
                            .filter((p: any) => {
                              const master = serviceProducts.find(sp => sp.name.toLowerCase().trim() === (p.service || "").toLowerCase().trim());
                              return !master || master.type === 'Product';
                            })
                            .map((p: any, idx: number) => {
                              const masterProduct = serviceProducts.find(sp => sp.name.toLowerCase().trim() === (p.service || "").toLowerCase().trim());
                              const price = masterProduct ? parseFloat(masterProduct.amount) : (parseFloat(p.price) || 0);
                              const qty = parseInt(p.quantity) || 0;
                              
                              return (
                                <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                  <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold text-gray-900">{p.service}</p>
                                      {masterProduct && <Badge className="bg-blue-50 text-blue-600 text-[9px] h-4">Stock</Badge>}
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-gray-400 uppercase">Unit Price</span>
                                        <span className="text-sm font-bold text-gray-600">₹{price.toLocaleString()}</span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-gray-400 uppercase">Subtotal</span>
                                        <span className="text-sm font-black text-blue-600">₹{(price * qty).toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-center">
                                      <span className="text-[9px] font-black text-gray-400 uppercase">Days</span>
                                      <Input
                                        type="number"
                                        className="h-9 w-14 text-center text-xs font-bold rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all"
                                        value={p.days}
                                        onChange={(e) => handleProductChange(idx, 'days', e.target.value)}
                                      />
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <span className="text-[9px] font-black text-gray-400 uppercase">Qty</span>
                                      <Input 
                                        type="number" 
                                        className="h-9 w-14 text-center text-xs font-black rounded-xl border-gray-100 bg-blue-50/30 text-blue-700 focus:bg-white transition-all" 
                                        value={p.quantity} 
                                        onChange={(e) => handleProductChange(idx, 'quantity', e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        <Button 
                          className="w-full h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100 border-none transition-all"
                          onClick={handleUpdateProducts}
                          disabled={billingLoading}
                        >
                          Recalculate & Update Items
                        </Button>
                      </div>

                      <div className="xl:col-span-1 space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-emerald-500" />
                          Payment Collection
                        </h3>
                        <Card className="bg-slate-900 border-0 rounded-3xl overflow-hidden shadow-xl">
                          <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</Label>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                  <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl focus:ring-emerald-500/20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="card">Credit Card</SelectItem>
                                    <SelectItem value="upi">UPI / GPay</SelectItem>
                                    <SelectItem value="bank">Transfer</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payable Amount</Label>
                                <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">₹</span>
                                  <Input
                                    type="number"
                                    className="h-12 pl-8 bg-white/5 border-white/10 text-white rounded-xl font-bold focus:ring-emerald-500/20"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>
                            </div>
                            <Button
                              className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:translate-y-[-2px] active:translate-y-0"
                              onClick={handleAddPayment}
                              disabled={billingLoading || !paymentAmount || parseFloat(paymentAmount) <= 0}
                            >
                              Confirm Payment
                            </Button>
                          </CardContent>
                        </Card>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payment History</h4>
                            <Badge variant="outline" className="text-[9px] border-gray-100 text-gray-400">{billingData?.installments?.length || 0} Records</Badge>
                          </div>
                          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                            {billingData?.installments?.length === 0 ? (
                              <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-xs text-gray-400 font-bold">No payments recorded yet</p>
                              </div>
                            ) : (
                              billingData?.installments?.map((inst: any) => (
                                <div key={inst.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                      <Check className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-gray-900 capitalize">{inst.paymentMethod}</span>
                                      <span className="text-[9px] font-bold text-gray-400">{formatDate(inst.paymentDate)}</span>
                                    </div>
                                  </div>
                                  <span className="font-black text-emerald-600 text-sm">₹{parseFloat(inst.amount).toLocaleString()}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    className="rounded-xl h-12 px-6 font-bold border-emerald-200 text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-all shadow-sm"
                    onClick={handlePrintReceipt}
                    disabled={!billingData}
                  >
                    <Printer className="h-4 w-4" />
                    Generate Receipt
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="rounded-xl h-12 px-8 font-bold text-gray-500 hover:bg-gray-100"
                    onClick={() => setShowBillModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Refill Modal */}
      <Dialog open={refillModalOpen} onOpenChange={setRefillModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                 <Plus className="h-6 w-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight">Record Refill</DialogTitle>
            </div>
            <p className="text-emerald-100 font-bold mt-2 opacity-80">{selectedRefillRecord?.productName}</p>
          </DialogHeader>

          <div className="p-8 space-y-6 bg-white">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-gray-400 tracking-widest">Added Days</Label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                  <Input 
                    type="number"
                    value={refillDays}
                    onChange={(e) => setRefillDays(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-gray-100 font-black text-lg focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-gray-400 tracking-widest">Refill Quantity</Label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                  <Input 
                    type="number"
                    value={refillQty}
                    onChange={(e) => setRefillQty(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-gray-100 font-black text-lg focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="bg-gray-50 p-6 flex justify-end gap-3 mt-0">
             <Button variant="ghost" onClick={() => setRefillModalOpen(false)} className="rounded-xl font-bold h-12 px-6">Cancel</Button>
             <Button 
              onClick={handleSaveRefill}
              disabled={isSavingRefill}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 h-12 px-10 font-black text-white shadow-lg shadow-emerald-200 transition-all active:scale-95"
             >
               {isSavingRefill ? <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : (
                 <div className="flex items-center gap-2">
                   <Save className="h-4 w-4" /> Save Refill
                 </div>
               )}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patient Medication History Modal */}
      <Dialog open={showPatientHistory} onOpenChange={setShowPatientHistory}>
        <DialogContent className="max-w-4xl rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                   <History className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black tracking-tight">Medication History</DialogTitle>
                  <p className="text-blue-100 font-bold mt-1 opacity-80">
                    {selectedPatientForHistory?.first_name} {selectedPatientForHistory?.last_name} ({selectedPatientForHistory?.patient_code})
                  </p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setShowPatientHistory(false)} className="text-white hover:bg-white/10 rounded-xl font-bold">Close History</Button>
            </div>
          </DialogHeader>

          <div className="p-8 bg-white min-h-[400px] max-h-[600px] overflow-y-auto space-y-8 custom-scrollbar">
            {patientHistoryLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-12 w-12 border-4 border-blue-100 border-t-blue-600 animate-spin rounded-full"></div>
                <p className="text-gray-400 font-bold">Syncing Patient History...</p>
              </div>
            ) : patientHistory.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-bold italic">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                No medication history found for this patient.
              </div>
            ) : (
              <>
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Dispatches</p>
                    <p className="text-2xl font-black text-blue-900">{patientHistory.length}</p>
                  </div>
                  {calculateMedicationStats().slice(0, 5).map((stat, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 truncate">{stat.name}</p>
                      <p className="text-2xl font-black text-emerald-900">{stat.count} Times Given</p>
                    </div>
                  ))}
                </div>

                {/* Detailed History Table */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest">Historical Dispatch Log</h3>
                  <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-gray-50/80">
                        <TableRow>
                          <TableHead className="font-bold text-gray-800 py-4 px-6">Product</TableHead>
                          <TableHead className="font-bold text-gray-800 text-center">Date Given</TableHead>
                          <TableHead className="font-bold text-gray-800 text-center">Qty / Days</TableHead>
                          <TableHead className="font-bold text-gray-800 px-6">Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientHistory.map((h, idx) => (
                          <TableRow key={idx} className="hover:bg-gray-50/50 transition-all border-b last:border-0">
                            <TableCell className="py-4 px-6 font-bold text-gray-900">{h.productName}</TableCell>
                            <TableCell className="text-center font-semibold text-gray-600">{formatDate(h.dispatchDate || h.createdAt)}</TableCell>
                            <TableCell className="text-center">
                              <span className="font-black text-blue-600">{h.dispatchedQuantity} U</span>
                              <span className="text-[10px] text-gray-400 block uppercase font-bold">{h.dispatchedDays} Days</span>
                            </TableCell>
                            <TableCell className="px-6 text-xs text-gray-400 italic">
                               {h.notes || '---'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Modal Pagination Controls */}
                {patientHistory.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-gray-100 mt-8 gap-4 px-2">
                    <div className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 shadow-inner">
                       Showing <span className="text-blue-600 font-black">{Math.min(((patientHistoryPage - 1) * 10) + 1, patientHistoryTotalCount)}</span> - <span className="text-blue-600 font-black">{Math.min(patientHistoryPage * 10, patientHistoryTotalCount)}</span> of {patientHistoryTotalCount} records
                    </div>
                    <div className="flex items-center gap-1">
                       <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-black h-10 px-4 border-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
                        disabled={patientHistoryPage === 1}
                        onClick={() => fetchPatientHistory(selectedPatientForHistory.id || selectedPatientForHistory.patient_id, selectedPatientForHistory, patientHistoryPage - 1)}
                       >
                         <ChevronLeft className="h-4 w-4 mr-1" />
                         Prev
                       </Button>

                       <div className="flex items-center gap-1 mx-1">
                        {Array.from({ length: Number(patientHistoryTotalPages) || 1 }, (_, i) => {
                          const pNum = i + 1;
                          return (
                            <Button
                              key={pNum}
                              variant={patientHistoryPage === pNum ? "default" : "outline"}
                              size="sm"
                              className={`w-10 h-10 rounded-xl font-black transition-all ${
                                  patientHistoryPage === pNum 
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-105' 
                                  : 'border-gray-50 bg-white text-gray-400 hover:text-blue-600 hover:border-blue-100'
                              }`}
                              onClick={() => fetchPatientHistory(selectedPatientForHistory.id || selectedPatientForHistory.patient_id, selectedPatientForHistory, pNum)}
                            >
                              {pNum}
                            </Button>
                          );
                        })}
                      </div>

                       <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-black h-10 px-4 border-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
                        disabled={patientHistoryPage >= patientHistoryTotalPages}
                        onClick={() => fetchPatientHistory(selectedPatientForHistory.id || selectedPatientForHistory.patient_id, selectedPatientForHistory, patientHistoryPage + 1)}
                       >
                         Next
                         <ChevronRight className="h-4 w-4 ml-1" />
                       </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PrivateRoute>
  );
}