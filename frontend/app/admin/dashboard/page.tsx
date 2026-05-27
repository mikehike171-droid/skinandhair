"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  Stethoscope,
  Pill,
  ArrowUpRight,
  Plus
} from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("Administrator")

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.push('/admin/login')
      return
    }
    const fullName = `${user.firstName || user.first_name || 'Admin'} ${user.lastName || user.last_name || ''}`.trim()
    setUserName(fullName)
  }, [router])

  const stats = [
    {
      title: "Total Patients",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "blue",
      glow: "shadow-glow-blue"
    },
    {
      title: "Today's Appointments",
      value: "156",
      change: "+8%",
      trend: "up",
      icon: Calendar,
      color: "green",
      glow: "shadow-glow-green"
    },
    {
      title: "Revenue (Month)",
      value: "$284,750",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "purple",
      glow: "shadow-glow-purple"
    },
    {
      title: "Bed Occupancy",
      value: "87%",
      change: "-3%",
      trend: "down",
      icon: Activity,
      color: "orange",
      glow: ""
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: "New Patient",
      description: "John Smith registered as new patient",
      time: "5m ago",
      status: "success"
    },
    {
      id: 2,
      type: "Emergency",
      description: "Emergency admission in Room 205",
      time: "12m ago",
      status: "urgent"
    },
    {
      id: 3,
      type: "Discharge",
      description: "Patient P001234 discharged successfully",
      time: "25m ago",
      status: "success"
    },
    {
      id: 4,
      type: "Lab Result",
      description: "Critical lab result requires attention",
      time: "1h ago",
      status: "warning"
    }
  ]

  const departmentStats = [
    { name: "Emergency", patients: 45, capacity: 50, utilization: 90 },
    { name: "Cardiology", patients: 32, capacity: 40, utilization: 80 },
    { name: "Orthopedics", patients: 28, capacity: 35, utilization: 80 },
    { name: "Pediatrics", patients: 18, capacity: 25, utilization: 72 }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <div className="p-1.5 bg-green-100/50 rounded-full"><CheckCircle className="h-4 w-4 text-green-500" /></div>
      case "warning": return <div className="p-1.5 bg-yellow-100/50 rounded-full"><AlertTriangle className="h-4 w-4 text-yellow-500" /></div>
      case "urgent": return <div className="p-1.5 bg-red-100/50 rounded-full"><AlertTriangle className="h-4 w-4 text-red-500" /></div>
      default: return <div className="p-1.5 bg-gray-100/50 rounded-full"><Clock className="h-4 w-4 text-gray-500" /></div>
    }
  }

  return (
    <PrivateRoute modulePath="admin/dashboard" action="view">
      <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
        {/* Animated Background Mesh */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#00C9FF] rounded-full blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-[#92FE9D] rounded-full blur-[120px]" />
          <div className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-[#3b82f6] rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2 animate-reveal">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-gray-900 flex items-center gap-4">
                Dashboard
                <Badge variant="secondary" className="bg-blue-600 text-white border-0 px-3 py-1 text-xs font-bold tracking-wider">
                  PREMIUM
                </Badge>
              </h1>
              <p className="text-gray-500 mt-2 font-medium text-lg">Hello, {userName}. Here&apos;s your facility overview.</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="hidden lg:flex border-slate-200 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl h-12 px-6">
                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                Live Status
              </Button>
              <Button className="bg-vpride-blue hover:opacity-90 shadow-xl shadow-blue-500/20 text-white border-0 rounded-2xl h-12 px-6 transition-all hover:scale-105">
                <Plus className="h-5 w-5 mr-1" />
                Admission
              </Button>
            </div>
          </div>

          <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div 
                    key={index} 
                    className="animate-reveal group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="glass-card p-6 rounded-[24px] hover:translate-y-[-4px] transition-all duration-300 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-2xl ${
                          stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                          stat.color === 'green' ? 'bg-green-50 text-green-600' :
                          stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                          'bg-orange-50 text-orange-600'
                        } ${stat.glow} transition-all duration-300 group-hover:scale-110`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                          stat.trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                        }`}>
                          {stat.change}
                          <ArrowUpRight className={`h-3 w-3 ${stat.trend === 'down' && 'rotate-90'}`} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        <p className="text-xs text-gray-400 mt-2 font-medium">Increased by 12% vs last month</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2 animate-reveal" style={{ animationDelay: '400ms' }}>
                <div className="glass-card rounded-[24px] h-full overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2">View All</Button>
                  </div>
                  <div className="p-6 space-y-6 flex-1">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex gap-4 group cursor-pointer transition-all">
                        {getStatusIcon(activity.status)}
                        <div className="flex-1 border-b border-gray-100 pb-4 group-last:border-0 group-last:pb-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-bold text-gray-900">{activity.type}</h4>
                            <span className="text-xs font-bold text-gray-400">{activity.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed font-medium">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="animate-reveal" style={{ animationDelay: '500ms' }}>
                <div className="glass-card rounded-[24px] p-6 space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                  <div className="grid grid-cols-1 gap-3">
                    <Button className="w-full h-14 justify-start bg-vpride-blue hover:opacity-90 shadow-md shadow-blue-500/20 rounded-2xl group" asChild>
                      <a href="/admin/patients/register">
                        <div className="p-2 bg-white/20 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-white">Register New Patient</span>
                      </a>
                    </Button>
                    {[
                      { icon: Calendar, text: "Schedule Appointment", href: "/admin/front-office/appointments", color: "text-blue-600", bg: "bg-blue-50" },
                      { icon: Building2, text: "Patient Admission", href: "/admin/inpatient/admission", color: "text-purple-600", bg: "bg-purple-50" },
                      { icon: Activity, text: "Laboratory Orders", href: "/admin/lab/orders", color: "text-green-600", bg: "bg-green-50" },
                      { icon: Pill, text: "Pharmacy Records", href: "/admin/pharmacy/dispensing", color: "text-orange-600", bg: "bg-orange-50" },
                    ].map((action, i) => (
                      <Button key={i} variant="outline" className="w-full h-14 justify-start border-gray-100 hover:bg-gray-50 rounded-2xl transition-all duration-300 group" asChild>
                        <a href={action.href}>
                          <div className={`p-2 ${action.bg} rounded-lg mr-3 group-hover:scale-110 transition-transform`}>
                            <action.icon className={`h-5 w-5 ${action.color}`} />
                          </div>
                          <span className="font-bold text-gray-700">{action.text}</span>
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Department Status */}
            <div className="animate-reveal lg:col-span-3" style={{ animationDelay: '600ms' }}>
              <div className="glass-card rounded-[24px] p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Stethoscope className="h-6 w-6 text-purple-600" />
                    Department Load Overview
                  </h2>
                  <Badge variant="outline" className="px-3 py-1 font-bold text-gray-500">Real-time status</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                  {departmentStats.map((dept, index) => (
                    <div key={index} className="p-5 rounded-[20px] bg-white/40 border border-gray-100/50 hover:bg-white/60 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">{dept.name}</span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded ${
                          dept.utilization >= 90 ? "bg-red-100 text-red-700" :
                          dept.utilization >= 80 ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>{dept.utilization}%</span>
                      </div>
                      <div className="w-full bg-gray-200/50 rounded-full h-2.5 mb-4 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            dept.utilization >= 90 ? "bg-red-500" :
                            dept.utilization >= 80 ? "bg-yellow-500" :
                            "bg-vpride-blue"
                          }`}
                          style={{ width: `${dept.utilization}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                        <span>{dept.patients} Patients</span>
                        <span>{dept.capacity} Cap.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PrivateRoute>
  )
}
