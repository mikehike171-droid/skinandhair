"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Search,
  RefreshCw,
  User,
  Clock
} from "lucide-react"
import { format, addDays, subDays, startOfDay, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, startOfMonth, endOfMonth } from "date-fns"
import { cn } from "@/lib/utils"
import authService from "@/lib/authService"
import { appointmentsApi } from "@/lib/appointmentsApi"
import { doctorsApi } from "@/lib/doctorsApi"
import PrivateRoute from "@/components/auth/PrivateRoute"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export default function HourlyAppointmentPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day')
  const [doctors, setDoctors] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  const fetchingRef = useRef(false)

  useEffect(() => {
    fetchData()
  }, [selectedDate, viewMode])

  const fetchData = async () => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)
    try {
      const locationId = authService.getLocationId()
      if (!locationId) return

      let fromDate = format(selectedDate, "yyyy-MM-dd")
      let toDate = format(selectedDate, "yyyy-MM-dd")

      if (viewMode === 'week') {
        const weekStart = new Date(selectedDate)
        weekStart.setDate(selectedDate.getDate() - selectedDate.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        fromDate = format(weekStart, "yyyy-MM-dd")
        toDate = format(weekEnd, "yyyy-MM-dd")
      } else if (viewMode === 'month') {
        const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
        fromDate = format(monthStart, "yyyy-MM-dd")
        toDate = format(monthEnd, "yyyy-MM-dd")
      }

      // Fetch doctors and appointments in parallel
      const [docsData, apptsData] = await Promise.all([
        doctorsApi.getDoctors(parseInt(locationId)),
        appointmentsApi.getAppointments({
          locationId: parseInt(locationId),
          fromDate,
          toDate,
          limit: 2000 // Get more for week/month
        })
      ])

      setDoctors(docsData || [])
      setAppointments(apptsData?.data || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  const navigateDate = (amount: number) => {
    setSelectedDate(prev => {
      if (viewMode === 'day') return amount > 0 ? addDays(prev, amount) : subDays(prev, Math.abs(amount))
      if (viewMode === 'week') return amount > 0 ? addDays(prev, amount * 7) : subDays(prev, Math.abs(amount * 7))
      if (viewMode === 'month') return new Date(prev.getFullYear(), prev.getMonth() + amount, 1)
      return prev
    })
  }

  const getAppointmentsForSlot = (doctorId: number, hour: number) => {
    return appointments.filter(apt => {
      if (apt.doctorId !== doctorId) return false

      const aptTime = apt.appointmentTime // Expected format "HH:mm:ss" or "HH:mm"
      if (!aptTime) return false

      const aptHour = parseInt(aptTime.split(':')[0])
      return aptHour === hour
    })
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          bg: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
          text: "text-emerald-700",
          indicator: "bg-emerald-500",
          badge: "bg-emerald-100 text-emerald-700 border-emerald-200"
        }
      case "pending":
        return {
          bg: "bg-amber-50 border-amber-200 hover:bg-amber-100",
          text: "text-amber-700",
          indicator: "bg-amber-500",
          badge: "bg-amber-100 text-amber-700 border-amber-200"
        }
      case "cancelled":
        return {
          bg: "bg-rose-50 border-rose-200 hover:bg-rose-100",
          text: "text-rose-700",
          indicator: "bg-rose-500",
          badge: "bg-rose-100 text-rose-700 border-rose-200"
        }
      case "completed":
        return {
          bg: "bg-sky-50 border-sky-200 hover:bg-sky-100",
          text: "text-sky-700",
          indicator: "bg-sky-500",
          badge: "bg-sky-100 text-sky-700 border-sky-200"
        }
      default:
        return {
          bg: "bg-slate-50 border-slate-200 hover:bg-slate-100",
          text: "text-slate-700",
          indicator: "bg-slate-500",
          badge: "bg-slate-100 text-slate-700 border-slate-200"
        }
    }
  }

  // Format hour for display (e.g., 0 -> 12am, 13 -> 1pm)
  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM"
    if (hour < 12) return `${hour} AM`
    if (hour === 12) return "12 PM"
    return `${hour - 12} PM`
  }

  const WeekView = () => {
    const weekStart = startOfWeek(selectedDate)
    const weekEnd = endOfWeek(selectedDate)
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

    return (
      <div className="flex-1 overflow-auto p-4 hide-scrollbar">
        <div className="bg-white rounded-2xl shadow-xl border border-[#E1E3E8] overflow-hidden min-w-max h-full flex flex-col">
          <div className="flex-1 overflow-auto hide-scrollbar">
            <div className="flex border-b border-[#E1E3E8] sticky top-0 z-20 bg-white shadow-sm">
              <div className="w-24 flex-shrink-0 border-r border-[#E1E3E8] bg-[#F8F9FC] flex items-center justify-center p-3 font-bold text-[11px] text-[#44474E] uppercase tracking-wider">
                Time
              </div>
              {days.map(day => (
                <div key={day.toString()} className="w-[300px] shrink-0 border-r border-[#E1E3E8] p-4 text-center bg-white">
                  <div className="font-extrabold text-[#1A1C1E] text-lg">
                    {format(day, "EEEE")}
                  </div>
                  <div className="text-xs text-[#005FB8] font-bold tracking-wider mt-0.5 uppercase">
                    {format(day, "dd MMM")}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white">
              {HOURS.map(hour => (
                <div key={hour} className="flex border-b border-[#F1F3F9] min-h-[90px] group/row">
                  <div className="w-24 shrink-0 border-r border-[#E1E3E8] bg-[#F8F9FC] flex items-center justify-center text-xs font-bold text-[#44474E] group-hover/row:bg-[#EDF1F9] transition-colors">
                    {formatHour(hour)}
                  </div>
                  {days.map(day => {
                    const dayAndHourAppts = appointments.filter(apt => {
                      const aptTime = apt.appointmentTime
                      const aptDate = apt.appointmentDate
                      if (!aptTime || !aptDate) return false
                      const aptHour = parseInt(aptTime.split(':')[0])
                      return aptHour === hour && isSameDay(parseISO(aptDate), day)
                    })

                    return (
                      <div key={day.toString()} className="w-[300px] shrink-0 border-r border-[#F1F3F9] p-2 group-hover/row:bg-[#FBFCFF] transition-colors overflow-hidden">
                        <div className="flex flex-col gap-1.5">
                          {dayAndHourAppts.map((apt, i) => {
                            const style = getStatusStyles(apt.status)
                            return (
                              <div
                                key={i}
                                onClick={() => {
                                  setSelectedAppointment(apt)
                                  setShowDetails(true)
                                }}
                                className={cn(
                                  "relative p-2 rounded-lg border-l-[3px] shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden",
                                  style.bg
                                )}
                              >
                                <div className="font-bold text-[#1A1C1E] text-[11px] truncate">
                                  {apt.patientName || `${apt.patientFirstName} ${apt.patientLastName}`}
                                </div>
                                <div className="text-[9px] text-[#74777F] font-semibold">
                                  {apt.appointmentTime.substring(0, 5)} - {apt.doctorName || "Doc"}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const MonthView = () => {
    const monthStart = startOfMonth(selectedDate)
    const monthEnd = endOfMonth(selectedDate)
    const weekStartDate = startOfWeek(monthStart)
    const weekEndDate = endOfWeek(monthEnd)
    const days = eachDayOfInterval({ start: weekStartDate, end: weekEndDate })

    return (
      <div className="flex-1 overflow-auto p-4 hide-scrollbar">
        <div className="bg-white rounded-2xl shadow-xl border border-[#E1E3E8] overflow-hidden flex flex-col h-full">
          <div className="grid grid-cols-7 border-b border-[#E1E3E8] bg-[#F8F9FC] sticky top-0 z-10">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center font-bold text-[11px] text-[#74777F] uppercase tracking-widest border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          <div className="flex-1 grid grid-cols-7 grid-rows-6">
            {days.map((day, idx) => {
              const dayAppts = appointments.filter(apt => {
                const aptDate = apt.appointmentDate
                return aptDate && isSameDay(parseISO(aptDate), day)
              })

              return (
                <div
                  key={idx}
                  className={cn(
                    "border-r border-b border-[#F1F3F9] p-2 flex flex-col gap-1 overflow-hidden transition-colors hover:bg-[#F8F9FC]",
                    !isSameMonth(day, monthStart) && "bg-gray-50/50 opacity-50",
                    isSameDay(day, new Date()) && "bg-[#EDF1F9]/50"
                  )}
                >
                  <div className={cn(
                    "text-xs font-bold mb-1 w-6 h-6 flex items-center justify-center rounded-full",
                    isSameDay(day, new Date()) ? "bg-[#005FB8] text-white" : "text-[#44474E]"
                  )}>
                    {format(day, "d")}
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1 hide-scrollbar">
                    {dayAppts.slice(0, 5).map((apt, i) => {
                      const style = getStatusStyles(apt.status)
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            setSelectedAppointment(apt)
                            setShowDetails(true)
                          }}
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[9px] font-bold truncate cursor-pointer hover:shadow-sm transition-all",
                            style.bg,
                            style.text
                          )}
                        >
                          {apt.appointmentTime.substring(0, 5)} {apt.patientName || apt.patientFirstName}
                        </div>
                      )
                    })}
                    {dayAppts.length > 5 && (
                      <div className="text-[9px] font-black text-[#005FB8] px-1.5">
                        +{dayAppts.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const DayView = () => (
    <div className="flex-1 overflow-auto p-4 hide-scrollbar">
      <div className="bg-white rounded-2xl shadow-xl border border-[#E1E3E8] overflow-hidden min-w-max h-full flex flex-col">
        <div className="flex-1 overflow-auto hide-scrollbar">
          <div className="border-collapse">
            {/* Header Row (Doctors) */}
            <div className="flex sticky top-0 z-20 bg-white border-b border-[#E1E3E8] shadow-sm">
              <div className="w-24 flex-shrink-0 border-r border-[#E1E3E8] bg-[#F8F9FC] flex items-center justify-center p-3 font-bold text-[11px] text-[#74777F] uppercase tracking-[0.1em]">
                Time
              </div>
              {doctors.map(doc => (
                <div key={doc.id} className="w-[350px] shrink-0 border-r border-[#E1E3E8] p-4 text-center bg-white group transition-colors">
                  <div className="font-extrabold text-[#1A1C1E] text-lg group-hover:text-[#005FB8] transition-colors truncate">
                    {doc.firstName} {doc.lastName}
                  </div>
                  <div className="text-xs text-[#005FB8] font-bold tracking-wider mt-0.5 uppercase flex items-center justify-center gap-1.5 opacity-80">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#005FB8]"></div>
                    {doc.departmentName || "Doctor"}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Rows */}
            <div className="bg-white">
              <div className="flex border-b border-[#F1F3F9] h-12">
                <div className="w-24 shrink-0 border-r border-[#E1E3E8] bg-[#F8F9FC] flex items-center justify-center text-[10px] font-bold text-[#74777F] uppercase tracking-wider">
                  All-Day
                </div>
                {doctors.map(doc => (
                  <div key={doc.id} className="w-[350px] shrink-0 border-r border-[#F1F3F9]"></div>
                ))}
              </div>

              {HOURS.map(hour => (
                <div key={hour} className="flex border-b border-[#F1F3F9] min-h-[100px] group/row">
                  <div className="w-24 shrink-0 border-r border-[#E1E3E8] bg-[#F8F9FC] flex items-center justify-center text-xs font-bold text-[#44474E] group-hover/row:bg-[#EDF1F9] transition-colors">
                    {formatHour(hour)}
                  </div>
                  {doctors.map(doc => {
                    const slotAppointments = getAppointmentsForSlot(doc.id, hour)
                    return (
                      <div key={doc.id} className="w-[350px] shrink-0 border-r border-[#F1F3F9] p-2.5 group-hover/row:bg-[#FBFCFF] transition-colors overflow-hidden">
                        {/* Vertical Column Stack (One by One) */}
                        <div className="flex flex-col gap-2">
                          {slotAppointments.map((apt, i) => {
                            const style = getStatusStyles(apt.status)
                            return (
                              <div
                                key={i}
                                onClick={() => {
                                  setSelectedAppointment(apt)
                                  setShowDetails(true)
                                }}
                                className={cn(
                                  "relative p-3 rounded-xl border-l-[4px] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden group/apt active:scale-[0.98]",
                                  style.bg,
                                  style.bg.replace('hover:', '')
                                )}
                              >
                                {/* Indicator Bar */}
                                <div className={cn("absolute left-0 top-0 bottom-0 w-1", style.indicator)}></div>

                                <div className="flex items-center justify-between gap-3">
                                  <div className="font-extrabold text-[#1A1C1E] text-[13px] leading-tight group-hover/apt:text-[#005FB8] transition-colors truncate flex-1">
                                    {apt.patientName || `${apt.patientFirstName} ${apt.patientLastName}`}
                                  </div>

                                  <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#74777F]">
                                      <Clock className="h-3 w-3 text-[#005FB8] opacity-70" />
                                      {apt.appointmentTime.substring(0, 5)}
                                    </div>
                                    <div className={cn("shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider border whitespace-nowrap", style.badge)}>
                                      {apt.type}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <PrivateRoute modulePath="admin/hourlyappointment" action="view">
      <div className="flex flex-col h-[100dvh] bg-[#F8F9FC] overflow-hidden font-sans hide-scrollbar">
        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          body {
            overflow: hidden !important;
          }
        `}</style>

        {/* Sticky Header */}
        <div className="bg-white border-b px-8 py-4 flex items-center justify-between z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-extrabold text-[#1A1C1E] tracking-tight">Hourly Appointments</h1>
            <div className="flex items-center bg-[#F1F3F9] rounded-xl p-1 shadow-inner">
              <Button variant="ghost" size="icon" onClick={() => navigateDate(-1)} className="rounded-lg hover:bg-white hover:shadow-sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-6 font-semibold min-w-[220px] text-center text-[#44474E]">
                {viewMode === 'day' && format(selectedDate, "EEEE, dd MMM yyyy")}
                {viewMode === 'week' && `${format(startOfWeek(selectedDate), "dd MMM")} - ${format(endOfWeek(selectedDate), "dd MMM yyyy")}`}
                {viewMode === 'month' && format(selectedDate, "MMMM yyyy")}
              </div>
              <Button variant="ghost" size="icon" onClick={() => navigateDate(1)} className="rounded-lg hover:bg-white hover:shadow-sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

          </div>

          {/* View Toggle - Segmented Control */}
          <div className="flex bg-[#F1F3F9] rounded-xl p-1 shadow-inner border border-[#E1E3E8]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('day')}
              className={cn(
                "rounded-lg px-6 font-bold text-xs transition-all",
                viewMode === 'day' ? "bg-white text-[#1A1C1E] shadow-sm" : "text-[#74777F] hover:text-[#1A1C1E] hover:bg-white/50"
              )}
            >
              Day
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('week')}
              className={cn(
                "rounded-lg px-6 font-bold text-xs transition-all",
                viewMode === 'week' ? "bg-white text-[#1A1C1E] shadow-sm" : "text-[#74777F] hover:text-[#1A1C1E] hover:bg-white/50"
              )}
            >
              Week
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('month')}
              className={cn(
                "rounded-lg px-6 font-bold text-xs transition-all",
                viewMode === 'month' ? "bg-white text-[#1A1C1E] shadow-sm" : "text-[#74777F] hover:text-[#1A1C1E] hover:bg-white/50"
              )}
            >
              Month
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="sm"
              onClick={fetchData}
              disabled={loading}
              className="bg-[#005FB8] hover:bg-[#004A8F] text-white rounded-xl px-5 py-2.5 font-semibold transition-all shadow-md active:scale-95"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Refresh Schedule
            </Button>
          </div>
        </div>

        {/* Main Grid Area */}
        {viewMode === 'day' && <DayView />}
        {viewMode === 'week' && <WeekView />}
        {viewMode === 'month' && <MonthView />}
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedAppointment.patientName || `${selectedAppointment.patientFirstName} ${selectedAppointment.patientLastName}`}</h2>
                  <p className="text-gray-500">{selectedAppointment.patientPhone || "No phone provided"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Doctor</Label>
                  <p className="font-medium">{selectedAppointment.doctorName || `Dr. ${selectedAppointment.doctorFirstName} ${selectedAppointment.doctorLastName}`}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Status</Label>
                  <div>
                    <Badge className={cn(getStatusStyles(selectedAppointment.status).badge, "border")}>
                      {selectedAppointment.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Time</Label>
                  <p className="font-medium">{selectedAppointment.appointmentTime}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Type</Label>
                  <p className="font-medium">{selectedAppointment.type}</p>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Notes</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg border italic">
                    "{selectedAppointment.notes}"
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDetails(false)}>Close</Button>
                <Button onClick={() => window.location.href = `/admin/telecaller/call-patient?patientId=${selectedAppointment.patientId}`}>
                  Call Patient
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PrivateRoute>
  )
}
