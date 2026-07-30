import { useState } from 'react'
import { useStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { User, Mail, Key, Bell, Palette, Shield, Trash2, Save, Upload } from 'lucide-react'

export function Settings() {
  const { user } = useStore()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [autoSave, setAutoSave] = useState(true)

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <Card className="glass border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-400" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
                <Upload className="h-4 w-4 text-white" />
              </button>
            </div>
            <div>
              <p className="font-semibold text-lg">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-indigo-400 mt-1 capitalize">{user.plan} Plan</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Display Name
              </label>
              <input
                defaultValue={user.name}
                className="w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </label>
              <input
                defaultValue={user.email}
                className="w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="glass border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-indigo-400" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5">
            <div className="flex items-center gap-3">
              <Key className="h-4 w-4 text-muted-foreground" />
              <code className="text-sm font-mono">cf_live_••••••••••••••••</code>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">Reveal</Button>
              <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>
            </div>
          </div>
          <Button variant="outline" size="sm">+ Generate New Key</Button>
        </CardContent>
      </Card>

      <Card className="glass border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-indigo-400" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified when videos finish</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Use dark theme by default</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Auto-save Prompts</p>
                <p className="text-xs text-muted-foreground">Save drafts automatically</p>
              </div>
            </div>
            <Switch checked={autoSave} onCheckedChange={setAutoSave} />
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently delete all data</p>
            </div>
            <Button variant="destructive" size="sm">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
