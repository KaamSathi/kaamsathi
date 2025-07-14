"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Bell, Plus, Trash2, Edit, Mail, Smartphone } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface JobAlert {
  id: string
  title: string
  keywords: string
  location: string
  jobType: string
  salaryMin: string
  frequency: string
  isActive: boolean
  createdAt: string
  lastNotified?: string
  matchCount: number
}

export default function JobAlerts() {
  const [alerts, setAlerts] = useState<JobAlert[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    keywords: "",
    location: "",
    jobType: "",
    salaryMin: "",
    frequency: "daily",
  })

  useEffect(() => {
    loadJobAlerts()
  }, [])

  const loadJobAlerts = () => {
    const savedAlerts = JSON.parse(localStorage.getItem("job_alerts") || "[]")
    setAlerts(savedAlerts)
  }

  const saveJobAlerts = (updatedAlerts: JobAlert[]) => {
    setAlerts(updatedAlerts)
    localStorage.setItem("job_alerts", JSON.stringify(updatedAlerts))
  }

  const createAlert = () => {
    if (!formData.title || !formData.keywords) {
      toast({
        title: "Error",
        description: "Please fill in the required fields.",
        variant: "destructive",
      })
      return
    }

    const newAlert: JobAlert = {
      id: Date.now().toString(),
      title: formData.title,
      keywords: formData.keywords,
      location: formData.location,
      jobType: formData.jobType,
      salaryMin: formData.salaryMin,
      frequency: formData.frequency,
      isActive: true,
      createdAt: new Date().toISOString(),
      matchCount: Math.floor(Math.random() * 10) + 1, // Simulated match count
    }

    const updatedAlerts = [...alerts, newAlert]
    saveJobAlerts(updatedAlerts)

    setFormData({
      title: "",
      keywords: "",
      location: "",
      jobType: "",
      salaryMin: "",
      frequency: "daily",
    })
    setShowCreateForm(false)

    toast({
      title: "Alert Created",
      description: "Your job alert has been created successfully.",
    })
  }

  const updateAlert = () => {
    if (!editingAlert) return

    const updatedAlerts = alerts.map((alert) =>
      alert.id === editingAlert.id ? { ...editingAlert, ...formData } : alert,
    )
    saveJobAlerts(updatedAlerts)
    setEditingAlert(null)
    setShowCreateForm(false)

    toast({
      title: "Alert Updated",
      description: "Your job alert has been updated successfully.",
    })
  }

  const deleteAlert = (alertId: string) => {
    const updatedAlerts = alerts.filter((alert) => alert.id !== alertId)
    saveJobAlerts(updatedAlerts)

    toast({
      title: "Alert Deleted",
      description: "Your job alert has been deleted.",
    })
  }

  const toggleAlert = (alertId: string) => {
    const updatedAlerts = alerts.map((alert) =>
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert,
    )
    saveJobAlerts(updatedAlerts)

    const alert = alerts.find((a) => a.id === alertId)
    toast({
      title: alert?.isActive ? "Alert Disabled" : "Alert Enabled",
      description: alert?.isActive
        ? "You will no longer receive notifications for this alert."
        : "You will now receive notifications for this alert.",
    })
  }

  const startEdit = (alert: JobAlert) => {
    setEditingAlert(alert)
    setFormData({
      title: alert.title,
      keywords: alert.keywords,
      location: alert.location,
      jobType: alert.jobType,
      salaryMin: alert.salaryMin,
      frequency: alert.frequency,
    })
    setShowCreateForm(true)
  }

  const cancelEdit = () => {
    setEditingAlert(null)
    setShowCreateForm(false)
    setFormData({
      title: "",
      keywords: "",
      location: "",
      jobType: "",
      salaryMin: "",
      frequency: "daily",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-orange-500" />
            Job Alerts
          </h2>
          <p className="text-gray-600">Get notified when new jobs match your criteria</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Alert
        </Button>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{alerts.length}</p>
                <p className="text-sm text-gray-600">Total Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{alerts.filter((a) => a.isActive).length}</p>
                <p className="text-sm text-gray-600">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{alerts.reduce((sum, alert) => sum + alert.matchCount, 0)}</p>
                <p className="text-sm text-gray-600">Total Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Alert Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingAlert ? "Edit Job Alert" : "Create New Job Alert"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Alert Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Construction Jobs in Mumbai"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords *</Label>
                <Input
                  id="keywords"
                  placeholder="e.g., construction, plumber, electrician"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Location</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) => setFormData({ ...formData, jobType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Type</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary</Label>
                <Input
                  id="salaryMin"
                  placeholder="e.g., 15000"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Notification Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={editingAlert ? updateAlert : createAlert}>
                {editingAlert ? "Update Alert" : "Create Alert"}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <Card key={alert.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{alert.title}</h3>
                      <Badge variant={alert.isActive ? "default" : "secondary"}>
                        {alert.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{alert.matchCount} matches</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <strong>Keywords:</strong> {alert.keywords}
                      </p>
                      {alert.location && (
                        <p>
                          <strong>Location:</strong> {alert.location}
                        </p>
                      )}
                      {alert.jobType && (
                        <p>
                          <strong>Type:</strong> {alert.jobType}
                        </p>
                      )}
                      {alert.salaryMin && (
                        <p>
                          <strong>Min Salary:</strong> ₹{alert.salaryMin}
                        </p>
                      )}
                      <p>
                        <strong>Frequency:</strong> {alert.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={alert.isActive} onCheckedChange={() => toggleAlert(alert.id)} />
                    <Button variant="ghost" size="sm" onClick={() => startEdit(alert)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAlert(alert.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Created {new Date(alert.createdAt).toLocaleDateString()}
                  {alert.lastNotified && (
                    <span> • Last notified {new Date(alert.lastNotified).toLocaleDateString()}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No job alerts yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first job alert to get notified about relevant opportunities.
              </p>
              <Button onClick={() => setShowCreateForm(true)}>Create Your First Alert</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
