"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft, 
  Upload, 
  Play, 
  Plus, 
  Phone, 
  Loader2,
  FileSpreadsheet,
  MessageSquare,
  Languages,
  Mic
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"

export default function AiCalling() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewCampaignDialog, setShowNewCampaignDialog] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isWebCalling, setIsWebCalling] = useState(false)
  const vapiInstanceRef = useRef<any>(null);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    systemPrompt: "You are a helpful assistant for Dr. Care Homeopathy. Your goal is to follow up with the patient about their symptoms and book an appointment if they are interested. Speak in the patient's language.",
    model: "gemini-1.5-flash",
    language: "English",
    file: null as File | null
  })

  useEffect(() => {
    fetchCampaigns()
    
    // Load Vapi official voice widget script (provides vapiSDK globally)
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js';
    script.defer = true;
    script.async = true;
    
    script.onload = () => {
      console.log("Vapi SDK initialized");
    };
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [])

  const fetchCampaigns = async () => {
    try {
      const token = authService.getCurrentToken()
      const response = await fetch(`${authService.getSettingsApiUrl()}/ai-calling/campaigns`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data)
      }
    } catch (error) {
      console.error("Failed to fetch campaigns", error)
      toast.error("Failed to load campaigns")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewCampaign({ ...newCampaign, file: e.target.files[0] })
    }
  }

  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.systemPrompt || !newCampaign.file) {
      toast.error("Please fill all required fields and upload an Excel file")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("name", newCampaign.name)
    formData.append("description", newCampaign.description)
    formData.append("systemPrompt", newCampaign.systemPrompt)
    formData.append("model", newCampaign.model)
    formData.append("language", newCampaign.language)
    formData.append("file", newCampaign.file)

    try {
      const token = authService.getCurrentToken()
      const response = await fetch(`${authService.getSettingsApiUrl()}/ai-calling/campaign`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      })

      if (response.ok) {
        toast.success("Campaign created successfully!")
        setShowNewCampaignDialog(false)
        fetchCampaigns()
        setNewCampaign({
          name: "",
          description: "",
          systemPrompt: "You are a helpful assistant for Dr. Care Homeopathy. Your goal is to follow up with the patient about their symptoms and book an appointment if they are interested. Speak in the patient's language.",
          model: "gemini-1.5-flash",
          language: "English",
          file: null
        })
      } else {
        throw new Error("Failed to create campaign")
      }
    } catch (error) {
      console.error("Failed to create campaign", error)
      toast.error("Error creating campaign. Check file format.")
    } finally {
      setUploading(false)
    }
  }

  const handleStartCampaign = async (id: number) => {
    try {
      const token = authService.getCurrentToken()
      const response = await fetch(`${authService.getSettingsApiUrl()}/ai-calling/campaigns/${id}/start`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      if (response.ok) {
        toast.success("Campaign started!")
        fetchCampaigns()
      }
    } catch (error) {
      toast.error("Failed to start campaign")
    }
  }

  const downloadSampleCSV = () => {
    const csvContent = "Customer Name,Phone Number,Language\nJohn Doe,8500089203,English\nJane Smith,9876543210,Telugu"
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "sample_leads.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleWebCall = () => {
    const vapiSDK = (window as any).vapiSDK;
    if (!vapiSDK) {
      toast.error("Vapi SDK is still loading. Please wait a moment...");
      return;
    }

    if (isWebCalling) {
      if (vapiInstanceRef.current) {
        vapiInstanceRef.current.stop();
      }
      setIsWebCalling(false);
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "ad6b49ed-c57c-4650-b7d1-ea35586c1efd";

    try {
      // The Voice Widget SDK uses .run() to initialize and start
      vapiInstanceRef.current = vapiSDK.run({
        apiKey: publicKey,
        assistant: {
          model: {
            provider: 'google',
            model: 'gemini-1.5-flash',
            messages: [{ role: 'system', content: 'You are a helpful assistant for Dr. Care Homeopathy. Your goal is to help patients book an appointment. Speak in an empathetic tone.' }]
          },
          voice: {
            provider: 'playht',
            voiceId: 'jennifer',
          },
          firstMessage: 'Hello! This is the Care Homeopathy AI assistant. How can I help you today?'
        },
        config: {
          showButton: false, // Hide the default floating button to use our custom UI
        }
      });
      
      setIsWebCalling(true);
      toast.success("AI Session Started");

      // Stop after 2 seconds to simulate "Stop" or handle events
      // In a real app, we'd listen to the instance events if supported
    } catch (e) {
      console.error("Vapi Web Call Error:", e);
      toast.error("Could not start session.");
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In-Progress": return <Badge className="bg-blue-100 text-blue-800 animate-pulse">In Progress</Badge>
      case "Completed": return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "Pending": return <Badge variant="outline">Pending</Badge>
      case "Paused": return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <PrivateRoute modulePath="admin/telecaller/ai-calling" action="view">
      <div className="flex-1 space-y-6 p-6 bg-slate-50/50 min-h-screen">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Outbound Calling</h1>
              <p className="text-muted-foreground">Automate your patient follow-ups with AI</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleWebCall}
              className={`${isWebCalling ? 'border-red-500 text-red-500 bg-red-50' : 'border-indigo-200 text-indigo-600'} shadow-sm`}
            >
              {isWebCalling ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Stop session</>
              ) : (
                <><Mic className="mr-2 h-4 w-4" /> Test AI in Browser</>
              )}
            </Button>
            <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all hover:scale-105">
                  <Plus className="mr-2 h-4 w-4" />
                  New AI Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white border-0 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Phone className="h-6 w-6 text-indigo-600" />
                    Configure AI Campaign
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="campaign-name" className="text-slate-700 font-semibold">Campaign Name *</Label>
                      <Input
                        id="campaign-name"
                        placeholder="e.g., January Follow-ups"
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign((prev) => ({ ...prev, name: e.target.value }))}
                        className="border-slate-200 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ai-model" className="text-slate-700 font-semibold">AI Model</Label>
                      <Select
                        value={newCampaign.model}
                        onValueChange={(value) => setNewCampaign((prev) => ({ ...prev, model: value }))}
                      >
                        <SelectTrigger className="border-slate-200">
                          <SelectValue placeholder="Select AI model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</SelectItem>
                          <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro (Powerful)</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="system-prompt" className="text-slate-700 font-semibold flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-indigo-500" />
                      AI System Prompt / Instructions
                    </Label>
                    <Textarea
                      id="system-prompt"
                      placeholder="Describe how the AI should talk..."
                      value={newCampaign.systemPrompt}
                      onChange={(e) => setNewCampaign((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                      className="min-h-[120px] border-slate-200 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-500 italic">Tell the AI its role, goal, and what information to collect.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-slate-700 font-semibold flex items-center gap-2">
                        <Languages className="h-4 w-4 text-indigo-500" />
                        Primary Language
                      </Label>
                      <Select
                        value={newCampaign.language}
                        onValueChange={(value) => setNewCampaign((prev) => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger className="border-slate-200">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                          <SelectItem value="Telugu">Telugu</SelectItem>
                          <SelectItem value="Tamil">Tamil</SelectItem>
                          <SelectItem value="Bengali">Bengali</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excel-file" className="text-slate-700 font-semibold flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                        Contact List (Excel) *
                      </Label>
                      <div className="flex flex-col gap-2">
                        <Input
                          id="excel-file"
                          type="file"
                          accept=".xlsx, .xls, .csv"
                          onChange={handleFileChange}
                          className="border-slate-200 file:bg-slate-50 file:border-0 file:text-indigo-600 file:font-semibold"
                        />
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="text-indigo-600 h-auto p-0 justify-start"
                          onClick={downloadSampleCSV}
                        >
                          Download sample Contact List (CSV)
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleCreateCampaign} 
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-11"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                      ) : (
                        <><Upload className="mr-2 h-4 w-4" /> Create & Parse Leads</>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewCampaignDialog(false)} className="h-11 border-slate-200 text-slate-600">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Campaign List */}
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-20 grayscale brightness-95 opacity-50">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                <p>Loading campaigns...</p>
              </CardContent>
            </Card>
          ) : campaigns.length === 0 ? (
            <Card className="border-dashed border-2 border-slate-200 bg-transparent shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="p-4 bg-white rounded-full shadow-md mb-4">
                  <Phone className="h-8 w-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No AI Campaigns Yet</h3>
                <p className="text-slate-500 max-w-xs text-center mb-6">Create your first automated calling campaign by uploading an Excel sheet.</p>
                <Button onClick={() => setShowNewCampaignDialog(true)} variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Campaign
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden group">
                  <div className="h-1.5 w-full bg-indigo-100 relative overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-indigo-600 transition-all duration-500" 
                      style={{ width: `${(campaign.completedLeads / campaign.totalLeads) * 100}%` }}
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      {getStatusBadge(campaign.status)}
                      <span className="text-xs font-medium text-slate-400">Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800 line-clamp-1">{campaign.name}</CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[40px]">{campaign.description || "No description provided."}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Progress</p>
                        <p className="text-2xl font-bold text-indigo-600">
                          {campaign.completedLeads} <span className="text-slate-300 text-lg">/ {campaign.totalLeads}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Model</p>
                        <Badge variant="secondary" className="bg-slate-100 font-mono text-[10px]">{campaign.model}</Badge>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                       {campaign.status === "Pending" ? (
                         <Button onClick={() => handleStartCampaign(campaign.id)} className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all">
                            <Play className="mr-2 h-4 w-4" /> Start AI Calling
                         </Button>
                       ) : (
                         <Button variant="outline" className="w-full border-slate-200 text-indigo-600 hover:bg-slate-50" onClick={() => router.push(`/admin/telecaller/ai-calling/${campaign.id}`)}>
                            <BarChart3 className="mr-2 h-4 w-4 mr-1" /> View detailed results
                         </Button>
                       )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PrivateRoute>
  )
}

function BarChart3(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M7 16h3" />
      <path d="M7 11h7" />
      <path d="M7 6h10" />
    </svg>
  )
}
