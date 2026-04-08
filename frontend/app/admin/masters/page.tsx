"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  CreditCard, 
  UserCog, 
  HelpCircle,
  ChevronRight,
  Database,
  Package
} from "lucide-react"
import Link from "next/link"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function MastersPage() {
  const masterLinks = [
    {
      title: "Enquiry Types",
      description: "Manage lead and enquiry categories",
      href: "/admin/masters/enquiry-types",
      icon: HelpCircle,
      color: "blue"
    },
    {
      title: "Service Products",
      description: "Manage medical services and products",
      href: "/admin/masters/service-products",
      icon: Package,
      color: "orange"
    },
    {
      title: "Patient Sources",
      description: "Manage how patients find your clinic",
      href: "/admin/masters/patient-sources",
      icon: Users,
      color: "green"
    },
    {
      title: "Payment Types",
      description: "Manage available payment methods",
      href: "/admin/masters/payment-type",
      icon: CreditCard,
      color: "purple"
    },
    {
      title: "User Types",
      description: "Manage system user categories",
      href: "/admin/masters/user-types",
      icon: UserCog,
      color: "blue"
    }
  ]

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Masters</h1>
            <p className="text-gray-600">Global configurations and master data management</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {masterLinks.map((master, index) => {
            const Icon = master.icon
            return (
              <Card key={index} className="hover:shadow-md transition-all group">
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    master.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    master.color === 'green' ? 'bg-green-100 text-green-600' :
                    master.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold">{master.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-6">{master.description}</p>
                  <Button asChild variant="ghost" className="w-full justify-between group-hover:bg-gray-50 p-0 h-auto font-semibold">
                    <Link href={master.href}>
                      Explore Master
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="bg-gray-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Database className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Master Data Management</h3>
            <p className="text-sm text-gray-500 max-w-sm mt-2">
              Use these masters to maintain consistent data across the entire platform. 
              Changes made here will reflect globally.
            </p>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}
