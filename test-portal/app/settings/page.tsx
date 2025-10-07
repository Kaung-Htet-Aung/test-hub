"use client"

import { useState } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  Settings, 
  User, 
  Bell, 
  Database, 
  Mail, 
  Palette,
  Globe,
  Clock,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Users,
  BarChart3,
  FileText,
  BookOpen,
  GraduationCap,
  Plus,
  Edit,
  Trash
} from "lucide-react"

interface UserSettings {
  name: string
  email: string
  role: string
  avatar: string
  timezone: string
  language: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
}

interface SystemSettings {
  maintenanceMode: boolean
  registrationEnabled: boolean
  defaultLanguage: string
  defaultTimezone: string
  sessionTimeout: number
}

interface TestTemplate {
  id: string
  name: string
  subject: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  questionCount: number
  description: string
  isActive: boolean
  lastUsed: string
}

interface StudentGroup {
  id: string
  name: string
  description: string
  studentCount: number
  color: string
  createdAt: string
}

interface TestSchedule {
  id: string
  title: string
  templateName: string
  scheduledDate: string
  startTime: string
  endTime: string
  assignedGroups: string[]
  reminderEnabled: boolean
  reminderTime: number // minutes before test
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
}

interface LearningPath {
  id: string
  name: string
  description: string
  targetGroup: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedDuration: number // in days
  milestones: {
    title: string
    description: string
    targetScore: number
    order: number
  }[]
  isActive: boolean
  createdAt: string
}

interface TeacherSettings {
  autoGrade: boolean
  allowRetakes: boolean
  showResultsImmediately: boolean
  enableTimeLimits: boolean
  randomizeQuestions: boolean
  templates: TestTemplate[]
  reportSettings: {
    autoGenerate: boolean
    sendEmail: boolean
    includeCharts: boolean
    includeFeedback: boolean
    scheduleFrequency: 'daily' | 'weekly' | 'monthly' | 'never'
    customRecipients: string[]
  }
  studentGroups: StudentGroup[]
  testSchedules: TestSchedule[]
  reminderSettings: {
    emailReminders: boolean
    pushReminders: boolean
    smsReminders: boolean
    defaultReminderTime: number
  }
  learningPaths: LearningPath[]
  adaptiveLearning: {
    enabled: boolean
    adjustDifficulty: boolean
    recommendContent: boolean
    progressTracking: boolean
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: "Admin User",
    email: "admin@testhub.com",
    role: "Administrator",
    avatar: "",
    timezone: "UTC-5",
    language: "en",
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  })

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    registrationEnabled: true,
    defaultLanguage: "en",
    defaultTimezone: "UTC-5",
    sessionTimeout: 30
  })

  const [teacherSettings, setTeacherSettings] = useState<TeacherSettings>({
    autoGrade: true,
    allowRetakes: false,
    showResultsImmediately: true,
    enableTimeLimits: true,
    randomizeQuestions: true,
    templates: [
      {
        id: "1",
        name: "Math Assessment",
        subject: "Mathematics",
        difficulty: "medium",
        duration: 60,
        questionCount: 20,
        description: "Standard math assessment covering algebra and geometry",
        isActive: true,
        lastUsed: "2024-01-15"
      },
      {
        id: "2",
        name: "English Proficiency",
        subject: "English",
        difficulty: "easy",
        duration: 45,
        questionCount: 25,
        description: "Basic English language proficiency test",
        isActive: true,
        lastUsed: "2024-01-10"
      },
      {
        id: "3",
        name: "Programming Challenge",
        subject: "Computer Science",
        difficulty: "hard",
        duration: 90,
        questionCount: 15,
        description: "Advanced programming concepts and problem-solving",
        isActive: false,
        lastUsed: "2024-01-05"
      }
    ],
    reportSettings: {
      autoGenerate: true,
      sendEmail: true,
      includeCharts: true,
      includeFeedback: true,
      scheduleFrequency: "weekly",
      customRecipients: ["principal@school.edu", "department@school.edu"]
    },
    studentGroups: [
      {
        id: "1",
        name: "Advanced Students",
        description: "High-performing students who need challenging content",
        studentCount: 12,
        color: "bg-green-600",
        createdAt: "2024-01-10"
      },
      {
        id: "2",
        name: "Beginner Level",
        description: "Students who need additional support and guidance",
        studentCount: 18,
        color: "bg-blue-600",
        createdAt: "2024-01-12"
      },
      {
        id: "3",
        name: "Intermediate Group",
        description: "Students with moderate skill levels",
        studentCount: 25,
        color: "bg-yellow-600",
        createdAt: "2024-01-08"
      }
    ],
    testSchedules: [
      {
        id: "1",
        title: "Midterm Math Exam",
        templateName: "Math Assessment",
        scheduledDate: "2024-02-15",
        startTime: "10:00",
        endTime: "11:00",
        assignedGroups: ["Advanced Students", "Intermediate Group"],
        reminderEnabled: true,
        reminderTime: 30,
        status: "scheduled"
      },
      {
        id: "2",
        title: "English Placement Test",
        templateName: "English Proficiency",
        scheduledDate: "2024-02-20",
        startTime: "14:00",
        endTime: "14:45",
        assignedGroups: ["Beginner Level"],
        reminderEnabled: true,
        reminderTime: 15,
        status: "scheduled"
      }
    ],
    reminderSettings: {
      emailReminders: true,
      pushReminders: true,
      smsReminders: false,
      defaultReminderTime: 30
    },
    learningPaths: [
      {
        id: "1",
        name: "Math Mastery Path",
        description: "Comprehensive mathematics learning path from basics to advanced concepts",
        targetGroup: "All Students",
        difficulty: "beginner",
        estimatedDuration: 90,
        milestones: [
          {
            title: "Basic Arithmetic",
            description: "Master fundamental arithmetic operations",
            targetScore: 85,
            order: 1
          },
          {
            title: "Algebra Fundamentals",
            description: "Understand basic algebraic concepts",
            targetScore: 80,
            order: 2
          },
          {
            title: "Geometry Basics",
            description: "Learn geometric principles and theorems",
            targetScore: 75,
            order: 3
          }
        ],
        isActive: true,
        createdAt: "2024-01-05"
      },
      {
        id: "2",
        name: "Programming Excellence",
        description: "From beginner to advanced programming skills",
        targetGroup: "Advanced Students",
        difficulty: "intermediate",
        estimatedDuration: 120,
        milestones: [
          {
            title: "Programming Basics",
            description: "Learn programming fundamentals",
            targetScore: 90,
            order: 1
          },
          {
            title: "Data Structures",
            description: "Master essential data structures",
            targetScore: 85,
            order: 2
          }
        ],
        isActive: true,
        createdAt: "2024-01-08"
      }
    ],
    adaptiveLearning: {
      enabled: true,
      adjustDifficulty: true,
      recommendContent: true,
      progressTracking: true
    }
  })

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    console.log("Settings saved:", { userSettings, systemSettings, teacherSettings })
  }

  const actions = (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
        <RefreshCw className="h-4 w-4 mr-2" />
        Reset to Defaults
      </Button>
      <Button className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700" onClick={handleSaveSettings}>
        <Save className="h-4 w-4 mr-2" />
        Save Changes
      </Button>
    </div>
  )

  return (
    <PageLayout 
      title="Settings"
      description="Configure your testing platform preferences"
      actions={actions}
    >

        <Tabs defaultValue="user" className="space-y-4">
          <TabsList className="bg-gray-900 border-gray-800 w-full">
            <TabsTrigger value="user" className="text-gray-300 data-[state=active]:bg-gray-800">
              <User className="h-4 w-4 mr-2" />
              User Profile
            </TabsTrigger>
            <TabsTrigger value="general" className="text-gray-300 data-[state=active]:bg-gray-800">
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-gray-300 data-[state=active]:bg-gray-800">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="teacher" className="text-gray-300 data-[state=active]:bg-gray-800">
              <GraduationCap className="h-4 w-4 mr-2" />
              Teacher Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-light text-gray-100">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Full Name</label>
                    <Input
                      value={userSettings.name}
                      onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Email Address</label>
                    <Input
                      value={userSettings.email}
                      onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Role</label>
                    <Input
                      value={userSettings.role}
                      disabled
                      className="bg-gray-800 border-gray-700 text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Timezone</label>
                    <Select value={userSettings.timezone}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-800">
                        <SelectItem value="UTC-8">UTC-8 (Pacific Time)</SelectItem>
                        <SelectItem value="UTC-5">UTC-5 (Eastern Time)</SelectItem>
                        <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                        <SelectItem value="UTC+1">UTC+1 (Central European Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-light text-gray-100">Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Default Language</label>
                    <Select value={systemSettings.defaultLanguage}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-800">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Session Timeout (minutes)</label>
                    <Input
                      type="number"
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: parseInt(e.target.value)})}
                      className="bg-gray-800 border-gray-700 text-gray-100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-light text-gray-100">Platform Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Maintenance Mode</div>
                    <div className="text-xs text-gray-400">Temporarily disable the platform for maintenance</div>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">User Registration</div>
                    <div className="text-xs text-gray-400">Allow new users to register</div>
                  </div>
                  <Switch
                    checked={systemSettings.registrationEnabled}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, registrationEnabled: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-light text-gray-100">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Email Notifications</div>
                    <div className="text-xs text-gray-400">Receive notifications via email</div>
                  </div>
                  <Switch
                    checked={userSettings.notifications.email}
                    onCheckedChange={(checked) => setUserSettings({
                      ...userSettings,
                      notifications: {...userSettings.notifications, email: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Push Notifications</div>
                    <div className="text-xs text-gray-400">Receive push notifications in browser</div>
                  </div>
                  <Switch
                    checked={userSettings.notifications.push}
                    onCheckedChange={(checked) => setUserSettings({
                      ...userSettings,
                      notifications: {...userSettings.notifications, push: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">SMS Notifications</div>
                    <div className="text-xs text-gray-400">Receive notifications via SMS</div>
                  </div>
                  <Switch
                    checked={userSettings.notifications.sms}
                    onCheckedChange={(checked) => setUserSettings({
                      ...userSettings,
                      notifications: {...userSettings.notifications, sms: checked}
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teacher" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-light text-gray-100">Teaching Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Auto-Grade Tests</div>
                    <div className="text-xs text-gray-400">Automatically grade objective questions</div>
                  </div>
                  <Switch
                    checked={teacherSettings.autoGrade}
                    onCheckedChange={(checked) => setTeacherSettings({...teacherSettings, autoGrade: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Allow Test Retakes</div>
                    <div className="text-xs text-gray-400">Let students retake tests for better scores</div>
                  </div>
                  <Switch
                    checked={teacherSettings.allowRetakes}
                    onCheckedChange={(checked) => setTeacherSettings({...teacherSettings, allowRetakes: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Show Results Immediately</div>
                    <div className="text-xs text-gray-400">Display test results right after completion</div>
                  </div>
                  <Switch
                    checked={teacherSettings.showResultsImmediately}
                    onCheckedChange={(checked) => setTeacherSettings({...teacherSettings, showResultsImmediately: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Enable Time Limits</div>
                    <div className="text-xs text-gray-400">Enforce time limits for all tests</div>
                  </div>
                  <Switch
                    checked={teacherSettings.enableTimeLimits}
                    onCheckedChange={(checked) => setTeacherSettings({...teacherSettings, enableTimeLimits: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Randomize Questions</div>
                    <div className="text-xs text-gray-400">Show questions in random order to each student</div>
                  </div>
                  <Switch
                    checked={teacherSettings.randomizeQuestions}
                    onCheckedChange={(checked) => setTeacherSettings({...teacherSettings, randomizeQuestions: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-light text-gray-100">Report Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Auto-Generate Reports</div>
                    <div className="text-xs text-gray-400">Automatically create performance reports</div>
                  </div>
                  <Switch
                    checked={teacherSettings.reportSettings.autoGenerate}
                    onCheckedChange={(checked) => setTeacherSettings({
                      ...teacherSettings,
                      reportSettings: {...teacherSettings.reportSettings, autoGenerate: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Send Email Reports</div>
                    <div className="text-xs text-gray-400">Email reports to students and parents</div>
                  </div>
                  <Switch
                    checked={teacherSettings.reportSettings.sendEmail}
                    onCheckedChange={(checked) => setTeacherSettings({
                      ...teacherSettings,
                      reportSettings: {...teacherSettings.reportSettings, sendEmail: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Include Charts</div>
                    <div className="text-xs text-gray-400">Add visual charts to reports</div>
                  </div>
                  <Switch
                    checked={teacherSettings.reportSettings.includeCharts}
                    onCheckedChange={(checked) => setTeacherSettings({
                      ...teacherSettings,
                      reportSettings: {...teacherSettings.reportSettings, includeCharts: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Include Feedback</div>
                    <div className="text-xs text-gray-400">Add personalized feedback to reports</div>
                  </div>
                  <Switch
                    checked={teacherSettings.reportSettings.includeFeedback}
                    onCheckedChange={(checked) => setTeacherSettings({
                      ...teacherSettings,
                      reportSettings: {...teacherSettings.reportSettings, includeFeedback: checked}
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Schedule Frequency</label>
                  <Select value={teacherSettings.reportSettings.scheduleFrequency}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Additional Recipients</label>
                  <div className="space-y-2">
                    {teacherSettings.reportSettings.customRecipients.map((recipient, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={recipient}
                          onChange={(e) => {
                            const newRecipients = [...teacherSettings.reportSettings.customRecipients]
                            newRecipients[index] = e.target.value
                            setTeacherSettings({
                              ...teacherSettings,
                              reportSettings: {...teacherSettings.reportSettings, customRecipients: newRecipients}
                            })
                          }}
                          className="bg-gray-800 border-gray-700 text-gray-100"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-red-400"
                          onClick={() => {
                            const newRecipients = teacherSettings.reportSettings.customRecipients.filter((_, i) => i !== index)
                            setTeacherSettings({
                              ...teacherSettings,
                              reportSettings: {...teacherSettings.reportSettings, customRecipients: newRecipients}
                            })
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => {
                        setTeacherSettings({
                          ...teacherSettings,
                          reportSettings: {
                            ...teacherSettings.reportSettings, 
                            customRecipients: [...teacherSettings.reportSettings.customRecipients, ""]
                          }
                        })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Recipient
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-light text-gray-100">Student Groups</CardTitle>
                  <Button className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {teacherSettings.studentGroups.map((group) => (
                  <div key={group.id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${group.color}`}></div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-100">{group.name}</h3>
                          <p className="text-xs text-gray-400">{group.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          {group.studentCount} students
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Created: {group.createdAt}</span>
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                        <Users className="h-3 w-3 mr-1" />
                        Manage Students
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-light text-gray-100">Test Schedules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Email Reminders</div>
                    <div className="text-xs text-gray-400">Send reminder emails before tests</div>
                  </div>
                  <Switch
                    checked={teacherSettings.reminderSettings.emailReminders}
                    onCheckedChange={(checked) => setTeacherSettings({
                      ...teacherSettings,
                      reminderSettings: {...teacherSettings.reminderSettings, emailReminders: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Push Reminders</div>
                    <div className="text-xs text-gray-400">Send push notifications before tests</div>
                  </div>
                  <Switch
                    checked={teacherSettings.reminderSettings.pushReminders}
                    onCheckedChange={(checked) => setTeacherSettings({
                      ...teacherSettings,
                      reminderSettings: {...teacherSettings.reminderSettings, pushReminders: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">SMS Reminders</div>
                    <div className="text-xs text-gray-400">Send SMS reminders before tests</div>
                  </div>
                  <Switch
                    checked={teacherSettings.reminderSettings.smsReminders}
                    onCheckedChange={(checked) => setTeacherSettings({
                      ...teacherSettings,
                      reminderSettings: {...teacherSettings.reminderSettings, smsReminders: checked}
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Default Reminder Time (minutes before test)</label>
                  <Input
                    type="number"
                    value={teacherSettings.reminderSettings.defaultReminderTime}
                    onChange={(e) => setTeacherSettings({
                      ...teacherSettings,
                      reminderSettings: {...teacherSettings.reminderSettings, defaultReminderTime: parseInt(e.target.value)}
                    })}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-light text-gray-100">Upcoming Tests</CardTitle>
                  <Button className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Test
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {teacherSettings.testSchedules.map((schedule) => (
                  <div key={schedule.id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-medium text-gray-100">{schedule.title}</h3>
                        <p className="text-xs text-gray-400">Template: {schedule.templateName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={
                          schedule.status === 'scheduled' ? 'border-blue-600 text-blue-300' :
                          schedule.status === 'in-progress' ? 'border-green-600 text-green-300' :
                          schedule.status === 'completed' ? 'border-gray-600 text-gray-300' :
                          'border-red-600 text-red-300'
                        }>
                          {schedule.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-3">
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <span className="ml-1 font-medium text-gray-300">{schedule.scheduledDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Time:</span>
                        <span className="ml-1 font-medium text-gray-300">{schedule.startTime} - {schedule.endTime}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Groups:</span>
                        <span className="ml-1 font-medium text-gray-300">{schedule.assignedGroups.join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {schedule.reminderEnabled && (
                          <Badge variant="outline" className="border-yellow-600 text-yellow-300">
                            Reminder: {schedule.reminderTime}m before
                          </Badge>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                        <Clock className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-light text-gray-100">Adaptive Learning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Enable Adaptive Learning</div>
                    <div className="text-xs text-gray-400">Use AI to personalize learning experiences</div>
                  </div>
                  <Switch
                    checked={teacherSettings.adaptiveLearning.enabled}
                    onCheckedChange={(checked) => setTeacherSettings({
                      ...teacherSettings,
                      adaptiveLearning: {...teacherSettings.adaptiveLearning, enabled: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Adjust Difficulty Automatically</div>
                    <div className="text-xs text-gray-400">Automatically adjust question difficulty based on performance</div>
                  </div>
                  <Switch
                    checked={teacherSettings.adaptiveLearning.adjustDifficulty}
                    onCheckedChange={(checked) => setTeacherSettings({
                      ...teacherSettings,
                      adaptiveLearning: {...teacherSettings.adaptiveLearning, adjustDifficulty: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Recommend Content</div>
                    <div className="text-xs text-gray-400">Suggest additional learning materials based on progress</div>
                  </div>
                  <Switch
                    checked={teacherSettings.adaptiveLearning.recommendContent}
                    onCheckedChange={(checked) => setTeacherSettings({
                      ...teacherSettings,
                      adaptiveLearning: {...teacherSettings.adaptiveLearning, recommendContent: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-100">Progress Tracking</div>
                    <div className="text-xs text-gray-400">Track and analyze student learning progress</div>
                  </div>
                  <Switch
                    checked={teacherSettings.adaptiveLearning.progressTracking}
                    onCheckedChange={(checked) => setTeacherSettings({
                      ...teacherSettings,
                      adaptiveLearning: {...teacherSettings.adaptiveLearning, progressTracking: checked}
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-light text-gray-100">Learning Paths</CardTitle>
                  <Button className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Path
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {teacherSettings.learningPaths.map((path) => (
                  <div key={path.id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-medium text-gray-100">{path.name}</h3>
                        <p className="text-xs text-gray-400">{path.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={
                          path.difficulty === 'beginner' ? 'border-green-600 text-green-300' :
                          path.difficulty === 'intermediate' ? 'border-yellow-600 text-yellow-300' :
                          'border-red-600 text-red-300'
                        }>
                          {path.difficulty}
                        </Badge>
                        {path.isActive && (
                          <Badge variant="outline" className="border-blue-600 text-blue-300">
                            Active
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-3">
                      <div>
                        <span className="text-gray-500">Target Group:</span>
                        <span className="ml-1 font-medium text-gray-300">{path.targetGroup}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-1 font-medium text-gray-300">{path.estimatedDuration} days</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Milestones:</span>
                        <span className="ml-1 font-medium text-gray-300">{path.milestones.length}</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-2">Milestones:</div>
                      <div className="space-y-1">
                        {path.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center justify-between text-xs bg-gray-700 p-2 rounded">
                            <div>
                              <span className="font-medium text-gray-300">{milestone.title}</span>
                              <span className="text-gray-400 ml-2">Target: {milestone.targetScore}%</span>
                            </div>
                            <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                              Step {milestone.order}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Created: {path.createdAt}</span>
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                        <BookOpen className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageLayout>
  )
}