"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Check, Receipt, DollarSign, Clock, Package, Search, ChevronLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function PharmacyDuePage() {
  const [dueList, setDueList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  // Modal States ( reused from main pharmacy page)
  const [showBillModal, setShowBillModal] = useState(false)
  const [selectedExam, setSelectedExam] = useState<any>(null)
  const [billingData, setBillingData] = useState<any>(null)
  const [billingLoading, setBillingLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentNotes, setPaymentNotes] = useState("")
  const [serviceProducts, setServiceProducts] = useState<any[]>([])
  const [editableProducts, setEditableProducts] = useState<any[]>([])

  useEffect(() => {
    fetchDueList()
    fetchServiceProducts()
  }, [])

  const fetchServiceProducts = async () => {
    try {
      const data = await settingsApi.getServiceProducts()
      setServiceProducts(data)
    } catch (error) {
      console.error('Error fetching service products:', error)
    }
  }

  const fetchDueList = async () => {
    try {
      setLoading(true)
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const locationId = userData.locationId || userData.primary_location_id || 1;
      const response = await settingsApi.getPharmacyDueList(locationId)
      if (response && response.data) {
        setDueList(response.data)
      } else {
        setDueList([])
      }
    } catch (error) {
      console.error('Error fetching due list:', error)
      setDueList([])
    } finally {
      setLoading(false)
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

  const handleOpenBillModal = (dueItem: any) => {
    const exam = {
      examination_id: dueItem.examinationId,
      patient_name: `${dueItem.patient?.first_name || ''} ${dueItem.patient?.last_name || ''}`.trim() || 'Unknown Patient',
      patient_code: dueItem.patient?.patient_code,
      mobile: dueItem.patient?.mobile,
      created_at: dueItem.examDate || dueItem.createdAt,
      products: dueItem.products || []
    }
    
    setSelectedExam(exam)
    setEditableProducts(JSON.parse(JSON.stringify(exam.products || [])))
    setShowBillModal(true)
    fetchBillingData(dueItem.examinationId)
  }

  const handleProductChange = (index: number, field: string, value: string) => {
    const updated = [...editableProducts]
    if (field === 'quantity') {
      updated[index].quantity = value === '' ? '' : (parseInt(value) || 0)
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
      // Refresh list
      await fetchDueList()
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
      await fetchDueList()
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to add payment", variant: "destructive" })
    } finally {
      setBillingLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <PrivateRoute modulePath="admin/pharmacy" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/pharmacy">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pharmacy Dues</h1>
              <p className="text-gray-600">Track and manage outstanding pharmacy balances</p>
            </div>
          </div>
          <Button onClick={fetchDueList} variant="outline" disabled={loading}>
            Refresh
          </Button>
        </div>

        <Card className="shadow-sm border-gray-100">
          <CardHeader className="bg-red-50/50 border-b border-gray-100">
            <CardTitle className="flex items-center space-x-2 text-red-900">
              <Clock className="h-5 w-5 text-red-600" />
              <span>Outstanding Balances</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold">Patient ID</TableHead>
                    <TableHead className="font-bold">Patient Name</TableHead>
                    <TableHead className="font-bold">Mobile</TableHead>
                    <TableHead className="font-bold text-right">Total Bill</TableHead>
                    <TableHead className="font-bold text-right">Paid</TableHead>
                    <TableHead className="font-bold text-right">Due</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-400">Loading dues...</TableCell>
                    </TableRow>
                  ) : dueList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <Check className="h-8 w-8 text-emerald-300 mx-auto mb-2" />
                        <p className="text-gray-500 font-medium">No outstanding dues found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    dueList.map((due) => (
                      <TableRow key={due.examinationId} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="text-xs text-gray-600">{formatDate(due.createdAt)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-black text-blue-700">{due.patient?.patient_code}</Badge>
                        </TableCell>
                        <TableCell className="font-bold text-gray-900">
                          {due.patient ? `${due.patient.first_name} ${due.patient.last_name}` : 'Unknown Patient'}
                        </TableCell>
                        <TableCell className="text-gray-600">{due.patient?.mobile || '-'}</TableCell>
                        <TableCell className="text-right font-bold">₹{parseFloat(due.totalAmount).toLocaleString()}</TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">₹{parseFloat(due.paidAmount).toLocaleString()}</TableCell>
                        <TableCell className="text-right font-bold text-red-600">₹{parseFloat(due.dueAmount).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            onClick={() => handleOpenBillModal(due)}
                          >
                            <Receipt className="h-4 w-4 mr-2" />
                            Pay Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pharmacy Billing Modal (Shared/Duplicate for now for simplicity) */}
        <Dialog open={showBillModal} onOpenChange={setShowBillModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="flex items-center text-2xl font-bold text-gray-900 gap-2">
                <Receipt className="h-6 w-6 text-blue-600" />
                Pharmacy Billing - {selectedExam?.patient_name}
              </DialogTitle>
            </DialogHeader>

            {billingLoading && !billingData ? (
              <div className="py-20 text-center text-gray-500">Loading billing details...</div>
            ) : (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider">Patient ID</Label>
                    <p className="font-bold text-blue-700">{selectedExam?.patient_code}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider">Mobile</Label>
                    <p className="font-bold text-gray-900">{selectedExam?.mobile || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider">Bill Date</Label>
                    <p className="font-bold text-gray-900">{selectedExam && formatDate(selectedExam.created_at)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-gray-700">
                    <Package className="h-4 w-4 text-blue-500" />
                    Product Details
                  </h3>
                  <div className="border rounded-lg overflow-hidden border-gray-100">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="py-2 text-xs font-bold">Product Name</TableHead>
                          <TableHead className="py-2 text-xs font-bold text-center">Days</TableHead>
                          <TableHead className="py-2 text-xs font-bold text-center">Qty</TableHead>
                          <TableHead className="py-2 text-xs font-bold text-right">Unit Price</TableHead>
                          <TableHead className="py-2 text-xs font-bold text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editableProducts
                          .filter((p: any) => {
                            const master = serviceProducts.find(sp => sp.name.toLowerCase().trim() === (p.service || "").toLowerCase().trim());
                            return !master || master.type === 'Product';
                          })
                          .map((p: any, idx: number) => {
                            const masterProduct = serviceProducts.find(sp => sp.name.toLowerCase().trim() === (p.service || "").toLowerCase().trim());
                            const masterPrice = masterProduct ? parseFloat(masterProduct.amount) : 0;
                            
                            // User requested unit price to be dynamic (from master) and not editable
                            const price = masterProduct ? masterPrice : ((p.price === undefined || p.price === null || p.price === '') ? 0 : parseFloat(p.price));
                            const qty = (p.quantity === undefined || p.quantity === null || p.quantity === '') ? 1 : parseInt(p.quantity);
                            const total = price * qty;
                            
                            return (
                              <TableRow key={idx}>
                                <TableCell className="py-2 text-sm font-medium">{p.service}</TableCell>
                                <TableCell className="py-2 text-sm text-center">
                                  {p.days ? (
                                    <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">{p.days}d</span>
                                  ) : '-'}
                                </TableCell>
                                <TableCell className="py-1 text-sm text-center">
                                  <Input 
                                    type="number" 
                                    className="w-16 h-8 text-center mx-auto" 
                                    value={p.quantity} 
                                    onChange={(e) => handleProductChange(idx, 'quantity', e.target.value)}
                                  />
                                </TableCell>
                                <TableCell className="py-1 text-sm text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <span className="text-gray-400 text-xs text-nowrap">Unit: ₹{price.toLocaleString()}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-2 text-sm text-right font-bold text-blue-600">₹{total.toLocaleString()}</TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50/30 rounded-lg">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={handleUpdateProducts}
                      disabled={billingLoading}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Update Quantities & Prices
                    </Button>
                    <p className="text-sm font-bold text-blue-900">
                      Total Pharmacy Bill: <span className="text-lg ml-2">₹{(() => {
                        let total = 0;
                        editableProducts.forEach(p => {
                          const master = serviceProducts.find(sp => sp.name.toLowerCase().trim() === (p.service || "").toLowerCase().trim());
                          if (!master || master.type === 'Product') {
                            const masterPrice = master ? parseFloat(master.amount) : 0;
                            const price = master ? masterPrice : ((p.price === undefined || p.price === null || p.price === '') ? 0 : parseFloat(p.price));
                            const qty = (p.quantity === undefined || p.quantity === null || p.quantity === '') ? 1 : parseInt(p.quantity);
                            total += (price * qty);
                          }
                        });
                        return total.toLocaleString();
                      })()}</span>
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-gray-700">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    Add Additional Payment
                  </h3>
                  <div className="grid grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-gray-600">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="upi">UPI / Online</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-gray-600">Amount (₹)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="h-10"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                      />
                    </div>
                    <Button
                      className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                      onClick={handleAddPayment}
                      disabled={billingLoading}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Add Payment
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600">Notes (Optional)</Label>
                    <Input
                      placeholder="Transaction ID, remarks, etc."
                      className="h-10"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 py-4 px-6 bg-gray-900 rounded-xl text-white">
                  <div className="text-center space-y-1">
                    <p className="text-[10px] text-gray-400 uppercase font-black">Total Bill</p>
                    <p className="text-xl font-bold">₹{parseFloat(billingData?.totalAmount || 0).toLocaleString()}</p>
                  </div>
                  <div className="text-center space-y-1 border-x border-gray-700">
                    <p className="text-[10px] text-emerald-400 uppercase font-black">Total Paid</p>
                    <p className="text-xl font-bold text-emerald-400">₹{parseFloat(billingData?.paidAmount || 0).toLocaleString()}</p>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-[10px] text-red-400 uppercase font-black">Remaining Due</p>
                    <p className="text-xl font-bold text-red-500">₹{parseFloat(billingData?.dueAmount || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-gray-700">
                    <Clock className="h-4 w-4 text-orange-500" />
                    Payment Installments
                  </h3>
                  <div className="border rounded-lg overflow-hidden border-gray-100">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="py-2 text-xs font-bold small">#</TableHead>
                          <TableHead className="py-2 text-xs font-bold">Date</TableHead>
                          <TableHead className="py-2 text-xs font-bold">Method</TableHead>
                          <TableHead className="py-2 text-xs font-bold text-right">Amount</TableHead>
                          <TableHead className="py-2 text-xs font-bold">Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {billingData?.installments && billingData.installments.length > 0 ? (
                          billingData.installments.map((inst: any) => (
                            <TableRow key={inst.id}>
                              <TableCell className="py-2 text-xs">{inst.installmentNumber}</TableCell>
                              <TableCell className="py-2 text-xs">{formatDate(inst.paymentDate)}</TableCell>
                              <TableCell className="py-2 text-xs capitalize">{inst.paymentMethod}</TableCell>
                              <TableCell className="py-2 text-xs text-right font-bold">₹{parseFloat(inst.amount).toLocaleString()}</TableCell>
                              <TableCell className="py-2 text-xs text-gray-500">{inst.notes || '-'}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="py-4 text-center text-xs text-gray-400">No installments found</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="border-t pt-4">
              <Button variant="outline" onClick={() => setShowBillModal(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}
