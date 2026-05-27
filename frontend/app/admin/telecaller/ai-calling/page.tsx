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
  Mic,
  Smartphone
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
  const [testCalling, setTestCalling] = useState(false)

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    systemPrompt: `### CRITICAL: STICK TO TELUGU ONLY ###
- You MUST speak ONLY in Telugu (te-IN). 
- NEVER speak English.
- Your name is Rooja from Vpride Skin and Hair.
- OPENING LINE: You MUST start the call with exactly: "Namaskaram, na peru Rooja nenu Vpride skin and hair nundi matladuthunna meku Em anna Arogya samasyalu Unnaya?"`,
    model: "gpt-4o",
    language: "Telugu",
    provider: "sarvam",
    retellAgentId: "sarvam-telugu-agent-1",
    file: null as File | null
  })

  // EDIT STATE
  const [editingCampaign, setEditingCampaign] = useState<any>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [updating, setUpdating] = useState(false)

  // SARVAM AI PLAYGROUND STATE
  const [ttsText, setTtsText] = useState("Namaskaram, na peru Rooja nenu Vpride skin and hair nundi matladuthunna meku Em anna Arogya samasyalu Unnaya?")
  const [ttsSpeaker, setTtsSpeaker] = useState("meera")
  const [synthesizing, setSynthesizing] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetchCampaigns()
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

  const handleGenerateTeluguVoice = async () => {
    if (!ttsText.trim()) {
      toast.error("Please enter some Telugu text to synthesize");
      return;
    }
    setSynthesizing(true);
    try {
      const token = authService.getCurrentToken();
      const response = await fetch(`${authService.getSettingsApiUrl()}/ai-calling/sarvam/synthesize`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: ttsText,
          speaker: ttsSpeaker,
        }),
      });

      const data = await response.json();
      if (response.ok && data.audio) {
        const binaryString = window.atob(data.audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes.buffer], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        toast.success("Telugu voice synthesized successfully!");
        
        setTimeout(() => {
          if (audioPlayerRef.current) {
            audioPlayerRef.current.play().catch(() => {});
          }
        }, 100);
      } else {
        throw new Error(data.message || "Failed to synthesize voice");
      }
    } catch (error: any) {
      console.error("Synthesis error:", error);
      toast.error(error.message || "Failed to synthesize Telugu voice");
    } finally {
      setSynthesizing(false);
    }
  };

  const handleCreateCampaign = async () => {
    const finalAgentId = newCampaign.retellAgentId || (newCampaign.provider === 'sarvam' ? 'sarvam-telugu-agent-1' : '');
    
    if (!newCampaign.name || !newCampaign.systemPrompt || !newCampaign.file || (!finalAgentId && newCampaign.provider === 'edesy')) {
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
    formData.append("provider", newCampaign.provider)
    formData.append("retellAgentId", finalAgentId)
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
        toast.success(`${newCampaign.provider === 'sarvam' ? 'Sarvam' : 'Edesy'} Campaign created successfully!`)
        setShowNewCampaignDialog(false)
        fetchCampaigns()
        setNewCampaign({
          name: "",
          description: "",
          systemPrompt: `### CRITICAL: STICK TO TELUGU ONLY ###
- You MUST speak ONLY in Telugu (te-IN). 
- NEVER speak English.
- Your name is Rooja from Vpride Skin and Hair.
- OPENING LINE: You MUST start the call with exactly: "Namaskaram, na peru Rooja nenu Vpride skin and hair nundi matladuthunna meku Em anna Arogya samasyalu Unnaya?"`,
          model: "gpt-4o",
          language: "Telugu",
          provider: "sarvam",
          retellAgentId: "sarvam-telugu-agent-1",
          file: null
        })
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to create campaign" }))
        throw new Error(errorData.message || "Failed to create campaign")
      }
    } catch (error: any) {
      console.error("Failed to create campaign", error)
      toast.error(error.message || "Error creating campaign. Check file format.")
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
    const csvContent = "Customer Name,Phone Number,Language\nJohn Doe,7382110030,English\nJane Smith,9876543210,Telugu"
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "sample_leads.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDebugTestCall = async () => {
    setTestCalling(true);
    toast.loading("Triggering test call...");
    try {
      const token = authService.getCurrentToken();
      const response = await fetch(`${authService.getSettingsApiUrl()}/ai-calling/debug-test-call`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.dismiss();
        toast.success("Success! Watch your phone for the call.");
      } else {
        throw new Error(data.error || "Failed to trigger call");
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    } finally {
      setTestCalling(false);
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

  const handleUpdateCampaign = async () => {
    if (!editingCampaign) return;
    setUpdating(true);
    try {
      const token = authService.getCurrentToken()
      const response = await fetch(`${authService.getSettingsApiUrl()}/ai-calling/campaigns/${editingCampaign.id}/update`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingCampaign.name,
          language: editingCampaign.language,
          provider: 'edesy',
          systemPrompt: editingCampaign.systemPrompt,
          retellAgentId: editingCampaign.retellAgentId
        })
      })

      if (response.ok) {
        toast.success("Settings updated successfully!")
        setShowEditDialog(false)
        fetchCampaigns()
      } else {
        throw new Error("Failed to update settings")
      }
    } catch (error) {
      toast.error("Error updating settings")
    } finally {
      setUpdating(false);
    }
  }

  return (
    <PrivateRoute modulePath="admin/telecaller/ai-calling" action="view">
      <div className="flex-1 space-y-6 p-6 bg-slate-50/50 min-h-screen">

        {/* EDIT CAMPAIGN DIALOG */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl bg-white border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Settings className="h-6 w-6 text-emerald-600" />
                Edesy AI Settings
              </DialogTitle>
            </DialogHeader>
            {editingCampaign && (
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Language</Label>
                  <Select 
                    value={editingCampaign.language} 
                    onValueChange={(val) => setEditingCampaign({...editingCampaign, language: val})}
                  >
                    <SelectTrigger className="border-slate-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Telugu">Telugu</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Kannada">Kannada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-slate-700 font-semibold text-emerald-600">Edesy Agent ID *</Label>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-[10px] text-emerald-600 font-bold p-0 h-auto"
                      onClick={async () => {
                        try {
                          const token = authService.getCurrentToken();
                          const response = await fetch(`${authService.getSettingsApiUrl()}/ai-calling/verify-agent`, {
                            method: 'POST',
                            headers: { 
                              'Authorization': `Bearer ${token}`,
                              'Content-Type': 'application/json' 
                            },
                            body: JSON.stringify({ 
                              agentId: editingCampaign.retellAgentId,
                              provider: 'edesy'
                            })
                          });
                          const data = await response.json();
                          if (data.success) {
                            toast.success(`Connected to Edesy: ${data.agentName}`);
                          } else {
                            toast.error(data.message);
                          }
                        } catch (err) {
                          toast.error("Failed to connect to Edesy API");
                        }
                      }}
                    >
                      <Mic className="h-3 w-3 mr-1" /> Check Connection
                    </Button>
                  </div>
                  <Input 
                    placeholder="e.g. 1234"
                    value={editingCampaign.retellAgentId || ""} 
                    onChange={(e) => setEditingCampaign({...editingCampaign, retellAgentId: e.target.value})} 
                    className="border-emerald-100 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Campaign Name</Label>
                  <Input 
                    value={editingCampaign.name} 
                    onChange={(e) => setEditingCampaign({...editingCampaign, name: e.target.value})} 
                    className="border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">System Prompt</Label>
                  <Textarea 
                    className="min-h-[120px] border-slate-200"
                    value={editingCampaign.systemPrompt}
                    onChange={(e) => setEditingCampaign({...editingCampaign, systemPrompt: e.target.value})}
                  />
                </div>

                <Button 
                  onClick={handleUpdateCampaign} 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 shadow-lg"
                  disabled={updating}
                >
                  {updating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Apply Changes"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
             <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sarvam AI Telugu Telecalling</h1>
              <p className="text-muted-foreground">Ultra Low-Cost High-Fidelity Telugu AI Calling System</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleDebugTestCall}
              disabled={testCalling}
              className="border-emerald-200 text-emerald-600 shadow-sm"
            >
              {testCalling ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Dialing...</>
              ) : (
                <><Smartphone className="mr-2 h-4 w-4" /> Test AI on Phone</>
              )}
            </Button>
            <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all hover:scale-105">
                  <Plus className="mr-2 h-4 w-4" />
                  New Sarvam AI Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white border-0 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Phone className="h-6 w-6 text-emerald-600" />
                    Configure Sarvam AI Campaign
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="campaign-name" className="text-slate-700 font-semibold">Campaign Name *</Label>
                      <Input
                        id="campaign-name"
                        placeholder="e.g., Patient Reminders"
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign((prev) => ({ ...prev, name: e.target.value }))}
                        className="border-slate-200 focus:ring-emerald-500"
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
                          <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="system-prompt" className="text-slate-700 font-semibold flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-emerald-500" />
                      AI Instructions (System Prompt)
                    </Label>
                    <Textarea
                      id="system-prompt"
                      placeholder="Describe how the AI should talk..."
                      value={newCampaign.systemPrompt}
                      onChange={(e) => setNewCampaign((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                      className="min-h-[120px] border-slate-200 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-slate-700 font-semibold flex items-center gap-2">
                        <Languages className="h-4 w-4 text-emerald-500" />
                        Language
                      </Label>
                      <Select
                        value={newCampaign.language}
                        onValueChange={(value) => setNewCampaign((prev) => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger className="border-slate-200">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Telugu">Telugu</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                          <SelectItem value="Tamil">Tamil</SelectItem>
                          <SelectItem value="Kannada">Kannada</SelectItem>
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
                          className="border-slate-200 file:bg-slate-50 file:border-0 file:text-emerald-600 file:font-semibold"
                        />
                        <Button
                          variant="link"
                          size="sm"
                          className="text-emerald-600 h-auto p-0 justify-start"
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
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-11"
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

        {/* Sarvam AI Telugu TTS Playground */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50/50 to-teal-50/30 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Mic className="h-5 w-5 text-emerald-600 animate-pulse" />
              Sarvam AI Telugu Voice Playground
            </CardTitle>
            <CardDescription>
              Type any sentence in Telugu to experience Sarvam's natural voice quality. Perfect for testing Vpride Patient Campaign greetings!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2 w-full">
                <Label htmlFor="tts-text" className="text-slate-700 font-semibold">Telugu Text</Label>
                <Textarea
                  id="tts-text"
                  placeholder="Enter Telugu text..."
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  className="min-h-[80px] border-slate-200 focus:ring-emerald-500 bg-white"
                />
              </div>
              <div className="space-y-2 w-full md:w-48">
                <Label htmlFor="tts-voice" className="text-slate-700 font-semibold">Voice Speaker</Label>
                <Select value={ttsSpeaker} onValueChange={setTtsSpeaker}>
                  <SelectTrigger className="border-slate-200 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meera">Meera (Female - Warm & Friendly)</SelectItem>
                    <SelectItem value="kavya">Kavya (Female - Clear & Professional)</SelectItem>
                    <SelectItem value="shubh">Shubh (Male - Authoritative)</SelectItem>
                    <SelectItem value="arvind">Arvind (Male - Conversational)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleGenerateTeluguVoice}
                disabled={synthesizing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-6 shadow-md shrink-0 w-full md:w-auto font-semibold"
              >
                {synthesizing ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Synthesizing...</>
                ) : (
                  <>Synthesize Telugu</>
                )}
              </Button>
            </div>
            
            {audioUrl && (
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                <span className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                  <Play className="h-4 w-4" /> Ready to play: {ttsSpeaker} voice ({ttsText.length} characters)
                </span>
                <audio ref={audioPlayerRef} src={audioUrl} controls className="h-10 shrink-0 outline-none" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaign List */}
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-20 grayscale brightness-95 opacity-50">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-4" />
                <p>Loading campaigns...</p>
              </CardContent>
            </Card>
          ) : campaigns.length === 0 ? (
            <Card className="border-dashed border-2 border-slate-200 bg-transparent shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="p-4 bg-white rounded-full shadow-md mb-4">
                  <Phone className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No AI Campaigns Yet</h3>
                <p className="text-slate-500 max-w-xs text-center mb-6">Create your first automated calling campaign by uploading an Excel sheet.</p>
                <Button onClick={() => setShowNewCampaignDialog(true)} variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Edesy Campaign
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden group">
                  <div className="h-1.5 w-full bg-emerald-100 relative overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${(campaign.completedLeads / campaign.totalLeads) * 100}%` }}
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          {campaign.provider === 'sarvam' ? 'Sarvam AI' : 'Edesy.in'}
                        </Badge>
                        {getStatusBadge(campaign.status)}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCampaign(campaign);
                            setShowEditDialog(true);
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="text-xs font-medium text-slate-400">Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800 line-clamp-1">{campaign.name}</CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[40px]">{campaign.description || "No description provided."}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Progress</p>
                        <p className="text-2xl font-bold text-emerald-600">
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
                        <Button onClick={() => handleStartCampaign(campaign.id)} className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all">
                          <Play className="mr-2 h-4 w-4" /> Start AI Calling
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full border-slate-200 text-emerald-600 hover:bg-slate-50" onClick={() => router.push(`/admin/telecaller/ai-calling/${campaign.id}`)}>
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

function Settings(props: any) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0 l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
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
