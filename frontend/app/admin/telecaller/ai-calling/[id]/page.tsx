"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  ArrowLeft, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Clock,
  MessageSquare,
  FileText,
  User,
  History
} from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function CampaignDetails() {
  const router = useRouter()
  const params = useParams()
  const campaignId = params.id
  
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<any>(null)

  useEffect(() => {
    fetchCampaignDetails()
    const interval = setInterval(() => {
      if (campaign?.status === "In-Progress") {
        fetchCampaignDetails()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [campaignId, campaign?.status])

  const fetchCampaignDetails = async () => {
    try {
      const token = authService.getCurrentToken()
      const response = await fetch(`${authService.getSettingsApiUrl()}/ai-calling/campaigns/${campaignId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCampaign(data)
      }
    } catch (error) {
      console.error("Failed to fetch campaign details", error)
      toast.error("Failed to load details")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed": return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
      case "In-Progress": return <Badge className="bg-blue-100 text-blue-800 border-blue-200 animate-pulse">Calling...</Badge>
      case "Failed": return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>
      case "Pending": return <Badge variant="outline" className="text-slate-400">Waiting</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading && !campaign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!campaign) return null

  return (
    <PrivateRoute modulePath="admin/telecaller/ai-calling" action="view">
      <div className="flex-1 space-y-6 p-6 bg-slate-50/50 min-h-screen">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{campaign.name}</h1>
                <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 uppercase text-[10px]">AI Campaign</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{campaign.description || "No description provided."}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Progress</p>
                <p className="font-bold text-lg">{Math.round((campaign.completedLeads / campaign.totalLeads) * 100)}%</p>
             </div>
             <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${(campaign.completedLeads / campaign.totalLeads) * 100}%` }} />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><User className="h-5 w-5" /></div><div><p className="text-xs text-slate-500 font-medium">Total Leads</p><p className="text-xl font-bold">{campaign.totalLeads}</p></div></div></CardContent></Card>
          <Card className="border-0 shadow-sm"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 bg-green-50 rounded-lg text-green-600"><CheckCircle2 className="h-5 w-5" /></div><div><p className="text-xs text-slate-500 font-medium">Successful</p><p className="text-xl font-bold">{campaign.leads?.filter((l:any) => l.status === "Completed").length || 0}</p></div></div></CardContent></Card>
          <Card className="border-0 shadow-sm"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Clock className="h-5 w-5" /></div><div><p className="text-xs text-slate-500 font-medium">Pending</p><p className="text-xl font-bold">{campaign.leads?.filter((l:any) => l.status === "Pending").length || 0}</p></div></div></CardContent></Card>
          <Card className="border-0 shadow-sm"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><History className="h-5 w-5" /></div><div><p className="text-xs text-slate-500 font-medium">Avg Duration</p><p className="text-xl font-bold">45s</p></div></div></CardContent></Card>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Call Log & Transcripts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaign.leads?.map((lead: any) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.customerName}</TableCell>
                      <TableCell>{lead.phoneNumber}</TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell>{lead.callDuration ? `${lead.callDuration}s` : "-"}</TableCell>
                      <TableCell className="text-right">
                        {lead.status === "Completed" ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-indigo-600" onClick={() => setSelectedLead(lead)}>View Transcript</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl bg-white">
                              <DialogHeader>
                                <DialogTitle>Call Summary: {lead.customerName}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6 pt-6">
                                <div><Label className="uppercase text-[10px] font-bold text-slate-400">Summary</Label><div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-100 mt-2">{lead.summary}</div></div>
                                <div><Label className="uppercase text-[10px] font-bold text-slate-400">Full Transcript</Label><div className="p-6 bg-slate-50 rounded-xl border border-slate-200 mt-2 max-h-[300px] overflow-y-auto whitespace-pre-wrap">{lead.transcript}</div></div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : <span className="text-xs text-slate-400">Wait for call</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}
