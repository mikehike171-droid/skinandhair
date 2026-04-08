"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, HelpCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"

export default function EnquiryTypesPage() {
  const [enquiryTypes, setEnquiryTypes] = useState<any[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [editingType, setEditingType] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    isActive: true
  })

  useEffect(() => {
    fetchEnquiryTypes()
  }, [])

  const fetchEnquiryTypes = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getEnquiryTypes()
      setEnquiryTypes(data || [])
    } catch (error) {
      console.error('Error fetching enquiry types:', error)
      toast({
        title: "Error",
        description: "Failed to fetch enquiry types",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      if (editingType) {
        await settingsApi.updateEnquiryType(editingType.id, formData)
        toast({
          title: "Success",
          description: "Enquiry type updated successfully",
        })
      } else {
        await settingsApi.createEnquiryType(formData)
        toast({
          title: "Success", 
          description: "Enquiry type created successfully",
        })
      }
      setShowDialog(false)
      resetForm()
      fetchEnquiryTypes()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save enquiry type",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (type: any) => {
    setEditingType(type)
    setFormData({
      name: type.name,
      isActive: type.isActive
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enquiry type?')) return
    
    try {
      setLoading(true)
      await settingsApi.deleteEnquiryType(id)
      toast({
        title: "Success",
        description: "Enquiry type deleted successfully",
      })
      fetchEnquiryTypes()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete enquiry type",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      isActive: true
    })
    setEditingType(null)
  }

  const handleAddNew = () => {
    resetForm()
    setShowDialog(true)
  }

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enquiry Types</h1>
            <p className="text-gray-600">Manage enquiry types for lead generation</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span>Enquiry Types</span>
              </CardTitle>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Enquiry Type
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && enquiryTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : enquiryTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">No enquiry types found</TableCell>
                  </TableRow>
                ) : (
                  enquiryTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          type.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {type.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(type)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(type.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingType ? 'Edit Enquiry Type' : 'Add Enquiry Type'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter enquiry type name"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading || !formData.name}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}
