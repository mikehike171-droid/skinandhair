"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"
import authService from "@/lib/authService"
import { Search, Clock, PackageCheck, ChevronLeft, ChevronRight, Calendar, Plus, Save, Phone, History } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function DispatchedListPage() {
  const [dispatchedProducts, setDispatchedProducts] = useState<any[]>([])
  const [dispatchedPage, setDispatchedPage] = useState(1)
  const [dispatchedTotalPages, setDispatchedTotalPages] = useState(1)
  const [dispatchedTotalCount, setDispatchedTotalCount] = useState(0)
  const [dispatchedLoading, setDispatchedLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [refillModalOpen, setRefillModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [refillDays, setRefillDays] = useState("0")
  const [refillQty, setRefillQty] = useState("0")
  const [isSavingRefill, setIsSavingRefill] = useState(false)
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState<any>(null);
  const [patientHistoryPage, setPatientHistoryPage] = useState(1);
  const [patientHistoryTotalPages, setPatientHistoryTotalPages] = useState(1);
  const [patientHistoryTotalCount, setPatientHistoryTotalCount] = useState(0);
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [patientHistoryLoading, setPatientHistoryLoading] = useState(false);
  const [showPatientHistory, setShowPatientHistory] = useState(false);
  const limit = 10

  useEffect(() => {
    fetchDispatchedData(dispatchedPage, searchTerm)
  }, [dispatchedPage])

  const fetchDispatchedData = async (currentPage: number = 1, search: string = "") => {
    try {
      setDispatchedLoading(true)
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const locationId = userData.locationId || userData.primary_location_id || 1;

      const result = await settingsApi.getDispatchHistory(locationId, currentPage, limit)
      if (result && result.data) {
        setDispatchedProducts(result.data)
        setDispatchedTotalPages(Number(result.totalPages) || 1)
        setDispatchedTotalCount(Number(result.total) || 0)
      }
    } catch (error) {
      console.error('Error fetching dispatch history:', error)
      toast({ title: "Error", description: "Failed to load dispatch history", variant: "destructive" })
    } finally {
      setDispatchedLoading(false)
    }
  }

  const handleSearch = () => {
    setDispatchedPage(1)
    fetchDispatchedData(1, searchTerm)
  }

  const openRefillModal = (record: any) => {
    setSelectedRecord(record)
    setRefillDays(record.dispatchedDays.toString())
    setRefillQty(record.dispatchedQuantity.toString())
    setRefillModalOpen(true)
  }

  const handleSaveRefill = async () => {
    if (!selectedRecord) return;
    
    try {
      setIsSavingRefill(true)
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const locationId = userData.locationId || userData.primary_location_id || 1;

      const refillData = {
        examinationId: Number(selectedRecord.examinationId),
        patientId: Number(selectedRecord.patientId),
        productName: selectedRecord.productName,
        doctorQuantity: Number(selectedRecord.doctorQuantity || 0),
        doctorDays: Number(selectedRecord.doctorDays || 0),
        dispatchedQuantity: Number(refillQty) || 0,
        dispatchedDays: Number(refillDays) || 0,
        locationId: Number(locationId || 1)
      }

      await settingsApi.createPharmacyDispatch(refillData)
      toast({ title: "Success", description: "Refill recorded successfully" })
      setRefillModalOpen(false)
      fetchDispatchedData(dispatchedPage, searchTerm)
    } catch (error) {
      console.error('Refill error:', error)
      toast({ title: "Error", description: "Failed to record refill", variant: "destructive" })
    } finally {
      setIsSavingRefill(false)
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <PrivateRoute modulePath="admin/pharmacy" action="view">
      <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/pharmacy">
              <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 text-gray-600 transition-all active:scale-95">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                <PackageCheck className="h-10 w-10 text-emerald-600" />
                Dispatched Medicines
              </h1>
              <p className="text-gray-500 font-medium mt-1">Full historical log of patient drug dispatches and refill schedules</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patient or medicine..."
                className="pl-11 h-12 rounded-2xl border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
                onClick={() => fetchDispatchedData(dispatchedPage, searchTerm)} 
                variant="outline" 
                className="h-12 px-8 rounded-2xl font-bold border-gray-200 hover:bg-white bg-white shadow-sm transition-all active:scale-95"
                disabled={dispatchedLoading}
            >
              Refresh
            </Button>
          </div>
        </div>

        <Card className="shadow-2xl border-0 overflow-hidden rounded-[2.5rem] bg-white ring-1 ring-gray-100">
          <CardHeader className="bg-gradient-to-r from-emerald-50/80 to-teal-50/30 border-b border-emerald-100/50 py-8 px-10">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-4 text-emerald-900">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-2xl font-black block">Log History</span>
                  <span className="text-sm font-bold text-emerald-600/70 uppercase tracking-widest leading-none">Pharmacy Archive</span>
                </div>
              </CardTitle>
              <div className="flex gap-3">
                 <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 py-2 px-5 font-black rounded-xl shadow-sm text-xs">
                    TOTAL: {dispatchedTotalCount} RECORDS
                 </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-emerald-50 hover:bg-transparent">
                    <TableHead className="py-6 px-10 text-emerald-900 font-extrabold uppercase tracking-widest text-[11px]">Dispatch Date</TableHead>
                    <TableHead className="text-emerald-900 font-extrabold uppercase tracking-widest text-[11px]">Patient Details</TableHead>
                    <TableHead className="text-emerald-900 font-extrabold uppercase tracking-widest text-[11px]">Medicine / Product</TableHead>
                    <TableHead className="text-center text-emerald-900 font-extrabold uppercase tracking-widest text-[11px]">Quantity / Days</TableHead>
                    <TableHead className="text-center text-emerald-900 font-extrabold uppercase tracking-widest text-[11px]">Refill Due Date</TableHead>
                    <TableHead className="text-right px-10 text-emerald-900 font-extrabold uppercase tracking-widest text-[11px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dispatchedLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-32">
                        <div className="flex flex-col items-center gap-6">
                          <div className="h-16 w-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
                          <p className="text-gray-400 font-black text-xl tracking-tight">Syncing Dispatch Archive...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : dispatchedProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-32">
                        <div className="max-w-md mx-auto space-y-4">
                           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                              <PackageCheck className="h-10 w-10 text-gray-300" />
                           </div>
                           <p className="text-gray-400 font-black text-xl italic uppercase tracking-tighter">No Dispatch Records Found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    dispatchedProducts.map((record) => (
                      <TableRow key={record.id} className="hover:bg-emerald-50/20 transition-all border-b border-gray-50 last:border-0 group">
                        <TableCell className="py-8 px-10">
                          <div className="flex flex-col">
                            <span className="font-black text-gray-900 text-lg">{formatDate(record.dispatchDate || record.createdAt)}</span>
                            <span className="text-[10px] text-emerald-500 font-black tracking-widest uppercase mt-1 px-2 py-0.5 bg-emerald-50 w-fit rounded-md border border-emerald-100">
                               Ref: #{record.id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div 
                            className="flex items-center gap-4 cursor-pointer hover:bg-emerald-50 p-2 rounded-2xl transition-all group/patient w-fit"
                            onClick={() => fetchPatientHistory(record.patientId, record.patient)}
                          >
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 font-black text-lg group-hover/patient:bg-emerald-100 group-hover/patient:text-emerald-600 transition-colors">
                               {record.patient?.first_name?.[0]}{record.patient?.last_name?.[0]}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-gray-900 text-lg group-hover/patient:text-emerald-700 transition-colors">{record.patient?.first_name} {record.patient?.last_name}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 text-[10px] font-black px-2">
                                  {record.patient?.patient_code}
                                </Badge>
                                <span className="text-[10px] font-bold text-gray-400">|</span>
                                <span className="text-[10px] text-blue-500 font-black opacity-0 group-hover/patient:opacity-100 transition-all">View History</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                             <span className="font-black text-gray-900 text-lg leading-tight tracking-tight">{record.productName}</span>
                             <span className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-wider opacity-60">Pharmaceutical Item</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-black text-gray-900 text-2xl leading-none tracking-tighter">{record.dispatchedQuantity}</span>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-2 px-2 py-0.5 bg-emerald-50 rounded-lg border border-emerald-100">{record.dispatchedDays} Days Supply</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                             <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="font-black text-gray-900 tracking-tight text-xl leading-none">
                                  {record.dueDate ? formatDate(record.dueDate) : 'N/A'}
                                </span>
                             </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-10">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              onClick={() => {
                                window.location.href = `/admin/telecaller/call-patient?patientId=${record.patientId}`
                              }}
                              variant="outline" 
                              className="h-10 w-10 p-0 rounded-xl border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
                              title="Call Patient"
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button 
                              onClick={() => openRefillModal(record)}
                              variant="outline" 
                              className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white h-10 px-4 rounded-xl font-black text-[10px] uppercase transition-all active:scale-95 flex items-center gap-2 shadow-sm"
                            >
                              <Plus className="h-3 w-3" />
                              Add Days
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

        {/* Main List Pagination */}
        {dispatchedProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-10 pt-6 pb-12 border-t border-gray-100 bg-gray-50/20 gap-6">
            <div className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm italic">
              Showing <span className="text-emerald-600 font-black">{Math.min(((dispatchedPage - 1) * limit) + 1, dispatchedTotalCount)}</span> to <span className="text-emerald-600 font-black">{Math.min(dispatchedPage * limit, dispatchedTotalCount)}</span> of {dispatchedTotalCount} records
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-2xl font-black h-12 px-8 border-gray-200 text-gray-600 hover:bg-white hover:text-emerald-600 shadow-sm transition-all disabled:opacity-20 active:scale-95"
                disabled={dispatchedPage === 1}
                onClick={() => setDispatchedPage(dispatchedPage - 1)}
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Number(dispatchedTotalPages) || 1 }, (_, i) => {
                  const pNum = i + 1;
                  return (
                    <Button
                      key={pNum}
                      variant={dispatchedPage === pNum ? "default" : "outline"}
                      size="sm"
                      className={`w-12 h-12 rounded-2xl font-black transition-all ${
                          dispatchedPage === pNum 
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-200 scale-110' 
                          : 'border-gray-100 bg-white text-gray-400 hover:text-emerald-600 hover:border-emerald-100 shadow-sm'
                      }`}
                      onClick={() => setDispatchedPage(pNum)}
                    >
                      {pNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-2xl font-black h-12 px-8 border-gray-200 text-gray-600 hover:bg-white hover:text-emerald-600 shadow-sm transition-all disabled:opacity-20 active:scale-95"
                disabled={dispatchedPage >= dispatchedTotalPages}
                onClick={() => setDispatchedPage(dispatchedPage + 1)}
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

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
              <p className="text-emerald-100 font-bold mt-2 opacity-80">{selectedRecord?.productName}</p>
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
                      className="pl-12 h-14 rounded-2xl border-gray-200 font-black text-lg focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-gray-400 tracking-widest">Refill Quantity</Label>
                  <div className="relative">
                    <PackageCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <Input 
                      type="number"
                      value={refillQty}
                      onChange={(e) => setRefillQty(e.target.value)}
                      className="pl-12 h-14 rounded-2xl border-gray-200 font-black text-lg focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
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
          <DialogContent className="max-w-4xl rounded-[2.5rem] p-0 overflow-hidden border-0 shadow-2xl">
            <DialogHeader className="bg-gradient-to-r from-blue-700 to-indigo-800 p-10 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md shadow-inner">
                     <History className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-black tracking-tight">Medication History</DialogTitle>
                    <p className="text-blue-100 font-bold mt-1 opacity-80 text-lg">
                      {selectedPatientForHistory?.first_name} {selectedPatientForHistory?.last_name} ({selectedPatientForHistory?.patient_code})
                    </p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setShowPatientHistory(false)} className="text-white hover:bg-white/10 rounded-2xl font-black px-6 h-12">Close History</Button>
              </div>
            </DialogHeader>

            <div className="p-10 bg-white min-h-[450px] max-h-[650px] overflow-y-auto space-y-10 custom-scrollbar">
              {patientHistoryLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-6">
                  <div className="h-16 w-16 border-4 border-blue-100 border-t-blue-600 animate-spin rounded-full shadow-sm"></div>
                  <p className="text-gray-400 font-black text-xl">Syncing Patient History...</p>
                </div>
              ) : patientHistory.length === 0 ? (
                <div className="text-center py-24">
                  <PackageCheck className="h-20 w-20 mx-auto mb-6 text-gray-100" />
                  <p className="text-gray-400 font-black text-2xl italic tracking-tighter uppercase">No medication history found</p>
                </div>
              ) : (
                <>
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 bg-blue-100 h-20 w-20 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
                      <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest mb-2 relative z-10">Total Dispatches</p>
                      <p className="text-4xl font-black text-blue-900 relative z-10">{patientHistory.length}</p>
                    </div>
                    {calculateMedicationStats().slice(0, 5).map((stat, i) => (
                      <div key={i} className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 bg-emerald-100 h-20 w-20 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
                        <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-2 relative z-10 truncate">{stat.name}</p>
                        <p className="text-4xl font-black text-emerald-900 relative z-10">{stat.count} <span className="text-sm font-bold opacity-50">Times</span></p>
                      </div>
                    ))}
                  </div>

                  {/* Detailed History Table */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <Clock className="h-5 w-5 text-gray-400" />
                       <h3 className="text-xs font-black uppercase text-gray-400 tracking-[0.2em]">Historical Dispatch Log</h3>
                    </div>
                    <div className="rounded-3xl border border-gray-100 overflow-hidden shadow-xl shadow-gray-100/50">
                      <Table>
                        <TableHeader className="bg-gray-50/50">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-black text-gray-800 py-6 px-8 text-[11px] uppercase tracking-widest">Medicine / Product</TableHead>
                            <TableHead className="font-black text-gray-800 text-center text-[11px] uppercase tracking-widest">Date Given</TableHead>
                            <TableHead className="font-black text-gray-800 text-center text-[11px] uppercase tracking-widest">Qty / Days</TableHead>
                            <TableHead className="font-black text-gray-800 px-8 text-[11px] uppercase tracking-widest">Source/Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {patientHistory.map((h, idx) => (
                            <TableRow key={idx} className="hover:bg-gray-50/30 transition-all border-b last:border-0 border-gray-50">
                              <TableCell className="py-6 px-8 font-black text-gray-900 text-lg tracking-tight">{h.productName}</TableCell>
                              <TableCell className="text-center">
                                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    <span className="font-bold text-gray-700">{formatDate(h.dispatchDate || h.createdAt)}</span>
                                 </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex flex-col items-center">
                                  <span className="font-black text-blue-600 text-xl tracking-tighter">{h.dispatchedQuantity} U</span>
                                  <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{h.dispatchedDays} Days</span>
                                </div>
                              </TableCell>
                              <TableCell className="px-8 text-xs text-gray-400 italic font-medium">
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
                  <div className="flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-gray-100 mt-10 gap-6">
                    <div className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 shadow-inner">
                      Showing <span className="text-blue-600 font-black">{Math.min(((patientHistoryPage - 1) * limit) + 1, patientHistoryTotalCount)}</span> - <span className="text-blue-600 font-black">{Math.min(patientHistoryPage * limit, patientHistoryTotalCount)}</span> of {patientHistoryTotalCount} records
                    </div>
                    <div className="flex items-center gap-2">
                       <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-black h-12 px-6 border-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
                        disabled={patientHistoryPage === 1}
                        onClick={() => fetchPatientHistory(selectedPatientForHistory.id || selectedPatientForHistory.patient_id, selectedPatientForHistory, patientHistoryPage - 1)}
                       >
                         <ChevronLeft className="h-5 w-5 mr-1" />
                         Prev
                       </Button>

                       <div className="flex items-center gap-2 mx-1">
                        {Array.from({ length: Number(patientHistoryTotalPages) || 1 }, (_, i) => {
                          const pgNum = i + 1;
                          return (
                            <Button
                              key={pgNum}
                              variant={patientHistoryPage === pgNum ? "default" : "outline"}
                              size="sm"
                              className={`w-12 h-12 rounded-xl font-black transition-all ${
                                  patientHistoryPage === pgNum 
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100 scale-105' 
                                  : 'border-gray-50 bg-white text-gray-400 hover:text-blue-600 hover:border-blue-100 shadow-sm'
                              }`}
                              onClick={() => fetchPatientHistory(selectedPatientForHistory.id || selectedPatientForHistory.patient_id, selectedPatientForHistory, pgNum)}
                            >
                              {pgNum}
                            </Button>
                          );
                        })}
                      </div>

                       <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-black h-12 px-6 border-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
                        disabled={patientHistoryPage >= patientHistoryTotalPages}
                        onClick={() => fetchPatientHistory(selectedPatientForHistory.id || selectedPatientForHistory.patient_id, selectedPatientForHistory, patientHistoryPage + 1)}
                       >
                         Next
                         <ChevronRight className="h-5 w-5 ml-1" />
                       </Button>
                    </div>
                  </div>
                )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}
