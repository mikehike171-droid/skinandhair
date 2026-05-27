"use client"

import { useState, useEffect, useCallback } from "react"
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
  History,
  Mic,
  RefreshCw,
  RotateCcw,
  BarChart3,
  Smartphone,
  Zap,
  Volume2
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
  const [retrying, setRetrying] = useState(false)
  const [isSyncingAll, setIsSyncingAll] = useState(false)

  const fetchCampaignDetails = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true)
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
    } finally {
      if (!isSilent) setLoading(false)
    }
  }, [campaignId])

  useEffect(() => {
    fetchCampaignDetails()
  }, [fetchCampaignDetails])

  const handleSync = async (leadId: number, isSilent = false) => {
    try {
      const token = authService.getCurrentToken();
      const response = await fetch(`${authService.getSettingsApiUrl()}/ai-calling/leads/${leadId}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        if (!isSilent) toast.success("Status updated");
        fetchCampaignDetails(true);
      }
    } catch (error) {
      console.error("Sync error:", error);
    }
  };

  const handleSyncAll = async () => {
    // SMARTER SYNC: Include ANY lead that has a Bolna ID and is not finished
    const activeLeads = campaign.leads?.filter((l: any) => l.retellCallId && l.status !== "Completed" && l.status !== "Failed");
    
    if (!activeLeads || activeLeads.length === 0) {
      toast.info("No active calls to sync.");
      fetchCampaignDetails(true);
      return;
    }

    setIsSyncingAll(true);
    toast.loading(`Syncing ${activeLeads.length} active calls...`);
    
    try {
      await Promise.all(activeLeads.map((l: any) => handleSync(l.id, true)));
      toast.dismiss();
      toast.success("Sync complete.");
      fetchCampaignDetails(true);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to sync some leads.");
    } finally {
      setIsSyncingAll(false);
    }
  };

  // SMARTER POLLING: Frequency is 5s, checks ALL leads with Bolna IDs
  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (campaign?.status === "In-Progress") {
        // Find leads that have been assigned a Bolna ID but aren't finished yet
        const leadsToSync = campaign.leads?.filter((l: any) => 
          l.retellCallId && l.status !== "Completed" && l.status !== "Failed"
        );
        
        if (leadsToSync?.length > 0) {
          leadsToSync.forEach((lead: any) => {
            handleSync(lead.id, true); // Silent sync
          });
        } else {
          // If none are "active" but campaign is on, refresh to check for next start
          fetchCampaignDetails(true);
        }
      }
    }, 5000); 

    return () => clearInterval(pollInterval);
  }, [campaign?.status, campaign?.leads, campaignId, fetchCampaignDetails]);

  const handleRetryFailed = async () => {
    setRetrying(true);
    toast.loading("Resetting failed leads and restarting...");
    try {
      const token = authService.getCurrentToken();
      const response = await fetch(`${authService.getSettingsApiUrl()}/ai-calling/campaigns/${campaignId}/retry-failed`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        toast.dismiss();
        toast.success("Failed leads have been reset.");
        fetchCampaignDetails();
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error("Retry failed.");
    } finally {
      setRetrying(false);
    }
  };

  const getStatusBadge = (status: string, summary?: string) => {
    // Check for precise Bolna states stored in summary
    if (summary?.includes("Status: Speaking")) {
      return <Badge className="bg-blue-600 text-white border-0 animate-pulse flex gap-1 items-center px-2">
        <Volume2 className="h-3 w-3" /> Speaking
      </Badge>
    }
    if (summary?.includes("Status: Dialing")) {
      return <Badge className="bg-amber-500 text-white border-0 animate-bounce flex gap-1 items-center px-2">
        <Smartphone className="h-3 w-3" /> Dialing
      </Badge>
    }
    if (status === "Completed" && summary?.includes("Generating recap")) {
      return <Badge className="bg-indigo-100 text-indigo-600 border-indigo-200 animate-pulse">Hangup (Syncing...)</Badge>
    }

    switch (status) {
      case "Completed": return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Completed</Badge>
      case "In-Progress": return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 animate-pulse">Active</Badge>
      case "Failed": return <Badge className="bg-rose-100 text-rose-800 border-rose-200">Failed</Badge>
      case "Pending": return <Badge variant="outline" className="text-slate-400 border-slate-200">Queued</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading && !campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium pb-2">Syncing Bolna dashboard...</p>
      </div>
    )
  }

  if (!campaign) return null

  const activeLead = campaign.leads?.find((l: any) => 
    l.retellCallId && l.status !== "Completed" && l.status !== "Failed"
  );

  return (
    <PrivateRoute modulePath="admin/telecaller/ai-calling" action="view">
      <div className="flex-1 space-y-8 p-8 bg-[#F8FAFC] min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => router.back()} 
              className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all border border-slate-100"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{campaign.name}</h1>
                <Badge className="bg-indigo-600 text-white border-0 px-2 py-0 text-[10px] uppercase font-bold tracking-wider">BOLNA AI</Badge>
              </div>
              <p className="text-slate-500 max-w-xl">{campaign.description || "Active outbound calling campaign via Bolna AI."}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={handleSyncAll}
              disabled={isSyncingAll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 transition-all font-bold rounded-xl"
            >
              <Zap className={`h-4 w-4 mr-2 ${isSyncingAll ? 'animate-spin' : ''}`} />
              Sync Dashboard
            </Button>
            {campaign.leads?.some((l: any) => l.status === "Failed") && (
              <Button 
                onClick={handleRetryFailed} 
                variant="outline"
                className="hover:bg-rose-50 hover:text-rose-600 transition-all font-bold rounded-xl border-slate-200"
                disabled={retrying}
              >
                <RotateCcw className={`h-3 w-3 mr-2 ${retrying ? 'animate-spin' : ''}`} />
                Retry Failed
              </Button>
            )}
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm bg-white overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
             <CardContent className="p-6 flex items-center gap-5">
               <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                 <User className="h-6 w-6" />
               </div>
               <div>
                 <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Total Leads</p>
                 <p className="text-2xl font-black text-slate-800">{campaign.totalLeads}</p>
               </div>
             </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm bg-white overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
             <CardContent className="p-6 flex items-center gap-5">
               <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                 <CheckCircle2 className="h-6 w-6" />
               </div>
               <div>
                 <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Completed</p>
                 <p className="text-2xl font-black text-slate-800">
                   {campaign.leads?.filter((l:any) => l.status === "Completed").length || 0}
                 </p>
               </div>
             </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
             <CardContent className="p-6 flex items-center gap-5">
               <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                 <Smartphone className="h-6 w-6" />
               </div>
               <div>
                 <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Calling Now</p>
                 <p className="text-2xl font-black text-slate-800">
                   {campaign.leads?.filter((l:any) => l.status === "In-Progress").length || 0}
                 </p>
               </div>
             </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-indigo-600 text-white overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
             <div className="absolute top-0 right-0 p-3 opacity-10"><Zap className="h-16 w-16" /></div>
             <CardContent className="p-6 relative z-10">
               <p className="text-[11px] text-indigo-100 uppercase font-bold tracking-wider">Campaign Flow</p>
               <p className="text-2xl font-black uppercase tracking-tighter">{campaign.status}</p>
               {campaign.status === "In-Progress" && (
                 <div className="flex items-center gap-2 mt-1">
                   <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                   <span className="text-[10px] font-bold text-emerald-400 italic">SYNCING DASHBOARD</span>
                 </div>
               )}
             </CardContent>
          </Card>
        </div>

        {/* Live Session Banner */}
        {activeLead && (
          <div className="animate-reveal">
            <div className="bg-indigo-600 rounded-[32px] p-1 shadow-2xl shadow-indigo-200">
              <div className="bg-white/10 backdrop-blur-xl rounded-[30px] p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-white/20">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
                    <Volume2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-2 py-0.5 rounded">Live Agent Status</span>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">
                          {activeLead.summary?.includes("Speaking") ? "AI Speaking" : activeLead.summary?.includes("Dialing") ? "Dialing..." : "Active"}
                        </span>
                      </div>
                    </div>
                    <h2 className="text-3xl font-black">{activeLead.customerName}</h2>
                    <p className="text-indigo-100 font-medium">{activeLead.phoneNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 pr-4">
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-indigo-200 tracking-widest mb-1">Bolna ID</p>
                    <p className="text-xl font-bold font-mono tracking-tighter">{activeLead.retellCallId.slice(0, 8)}...</p>
                  </div>
                  <div className="h-12 w-[1px] bg-white/20 hidden md:block" />
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-indigo-200 tracking-widest mb-1">Sync</p>
                    <p className="text-xl font-bold">5s</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden min-h-[600px]">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-black flex items-center gap-2 text-slate-800">
                    <History className="h-5 w-5 text-indigo-600" />
                    Call Execution Log
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => fetchCampaignDetails()} className="rounded-full text-indigo-600 font-bold">
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Reload List
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-100 hover:bg-transparent">
                      <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest pl-8 py-5">Lead</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Phone</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Status</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Execution Info</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right pr-8">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaign.leads?.map((lead: any) => (
                      <TableRow 
                        key={lead.id} 
                        className={`border-b border-slate-50 transition-colors ${lead.status === "In-Progress" ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50'}`}
                      >
                        <TableCell className="pl-8 py-4">
                          <p className="font-bold text-slate-900">{lead.customerName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Lead #{lead.id}</p>
                        </TableCell>
                        <TableCell className="font-medium text-slate-600">{lead.phoneNumber}</TableCell>
                        <TableCell>{getStatusBadge(lead.status, lead.summary)}</TableCell>
                        <TableCell className="max-w-[200px]">
                          {lead.summary ? (
                            <p className={`text-[11px] line-clamp-2 leading-relaxed italic ${lead.summary.includes("Status:") ? "text-indigo-600 font-bold not-italic" : "text-slate-500"}`}>
                             {lead.summary.replace("Status: ", "")}
                            </p>
                          ) : (
                            <span className="text-[10px] text-slate-300 italic">Waiting in queue...</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          {lead.status === "Completed" ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-indigo-600 hover:bg-indigo-50 font-bold rounded-lg transition-all" 
                                  onClick={() => setSelectedLead(lead)}
                                >
                                  View Recap
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl bg-white border-0 shadow-2xl rounded-3xl overflow-hidden p-0 font-outfit">
                                <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                                  <div className="absolute top-0 right-0 p-4 opacity-10"><Phone className="h-32 w-32" /></div>
                                  <DialogTitle className="text-3xl font-black mb-2 leading-none">Call Insights</DialogTitle>
                                  <p className="text-indigo-100 font-medium">{lead.customerName} • {lead.phoneNumber}</p>
                                </div>
                                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto font-outfit">
                                  <div>
                                    <Label className="uppercase text-[10px] font-black text-slate-400 tracking-widest mb-3 block italic">AI Summary</Label>
                                    <div className="p-6 bg-emerald-50 text-emerald-900 rounded-3xl border border-emerald-100 italic leading-relaxed text-sm">
                                      "{lead.summary || "Summary generation in progress..."}"
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-between mb-3">
                                      <Label className="uppercase text-[10px] font-black text-slate-400 tracking-widest">Transcript</Label>
                                    </div>
                                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-slate-700 whitespace-pre-wrap leading-loose font-mono text-sm">
                                      {lead.transcript || "Transcript is still being processed by Bolna AI..."}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (lead.retellCallId && lead.status !== "Failed") ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 h-8 gap-2 font-bold rounded-lg transition-all" 
                              onClick={() => handleSync(lead.id)}
                            >
                              <RefreshCw className="h-3 w-3 animate-spin" /> Sync
                            </Button>
                          ) : lead.status === "Failed" ? (
                            <span className="text-[10px] text-rose-500 font-black uppercase bg-rose-50 px-2 py-0.5 rounded">FAILED</span>
                          ) : (
                            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest pl-2">QUEUED</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white rounded-3xl p-6">
               <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                 <Mic className="h-5 w-5 text-indigo-600" />
                 Bolna Intel
               </h3>
               <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[9px] uppercase font-black text-slate-400 mb-1">Language</p>
                     <p className="text-xs font-bold text-slate-700">{campaign.language}</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[9px] uppercase font-black text-slate-400 mb-1">Model</p>
                     <p className="text-xs font-bold text-slate-700">{campaign.model}</p>
                   </div>
                 </div>
                 <div>
                    <Label className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2 block font-bold">Execution ID Storage</Label>
                    <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                      <div className="p-2 bg-indigo-600 rounded-lg text-white"><Smartphone className="h-3 w-3" /></div>
                      <div className="overflow-hidden">
                        <p className="text-[9px] font-bold text-indigo-400 uppercase leading-none mb-1">Agent ID</p>
                        <p className="text-[10px] font-mono font-bold text-indigo-800 truncate">{campaign.retellAgentId}</p>
                      </div>
                    </div>
                 </div>
               </div>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Volume2 className="h-16 w-16" /></div>
               <h3 className="text-lg font-black mb-4 relative z-10">Status Sync</h3>
               <p className="text-[11px] text-indigo-100 mb-4 leading-relaxed font-medium relative z-10 opacity-80">
                 The dashboard now tracks precise Bolna states: Dialing, Speaking, and Hangup. The AI transitions sequentially through leads as each call completes.
               </p>
               <div className="flex flex-col gap-2 relative z-10">
                  <Badge className="bg-emerald-500/20 text-[9px] text-emerald-300 border-0 w-fit font-bold tracking-widest uppercase">SMART POLLING: ON</Badge>
                  <Badge className="bg-blue-500/20 text-[9px] text-blue-300 border-0 w-fit font-bold tracking-widest uppercase">SPEAKING DETECTION: ON</Badge>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}
