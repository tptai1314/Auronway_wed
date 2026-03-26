"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Clock, 
  Users, 
  QrCode, 
  Play, 
  Pause, 
  Loader2, 
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Trash2,
  AlertTriangle
} from "lucide-react"
import { Suspense } from "react"
import { 
  getEvents, 
  generateEventQRCode, 
  getEventQRCode,
  deactivateEventQRCode,
  deleteEventQRCode,
  getEventRegistrations,
  type Event,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import QRCode from "react-qr-code"

// Local types for this page
interface UserInfo {
  affiliations?: Array<{
    role: string;
    organizer_id?: string;
  }>;
}

interface RegistrationItem {
  _id: string;
  status: string;
  attended_at?: string;
  user_id?: {
    _id: string;
    email: string;
    profile?: {
      full_name?: string;
      avatar_url?: string;
    };
  } | string;
}

interface CheckInSession {
  event_id: string
  event_title: string
  qr_code_token: string
  expires_at: string
  is_active: boolean
  scan_count: number
}

function LoadingState() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default function CheckInPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CheckInPageContent />
    </Suspense>
  )
}

function CheckInPageContent() {
  const searchParams = useSearchParams()
  const eventIdFromUrl = searchParams.get("event")
  const { toast } = useToast()

  // State
  const [events, setEvents] = useState<Event[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [sessions, setSessions] = useState<CheckInSession[]>([])
  const [activeSession, setActiveSession] = useState<CheckInSession | null>(null)
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([])
  const [loadingRegistrations, setLoadingRegistrations] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null)

  // Form state
  const [selectedEventId, setSelectedEventId] = useState("")
  const [expiresInHours, setExpiresInHours] = useState("24")
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [isDeletingSession, setIsDeletingSession] = useState<string | null>(null)

  // Kiểm tra sự kiện đã có session chưa
  const eventHasSession = useCallback((eventId: string) => {
    return sessions.some(s => s.event_id === eventId)
  }, [sessions])

  // Lọc sự kiện chưa có session
  const availableEvents = useMemo(() => {
    return events.filter(e => !eventHasSession(e._id))
  }, [events, eventHasSession])

  // Kiểm tra session đã hết hạn
  const isSessionExpired = useCallback((session: CheckInSession) => {
    return new Date(session.expires_at) < new Date()
  }, [])

  // Load current user
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setCurrentUser(JSON.parse(userStr))
    }
  }, [])

  // Get organizer_id from user's affiliations
  const myOrganizerId = useMemo(() => {
    if (!currentUser) return null
    const affiliation = currentUser.affiliations?.find((aff) => 
      aff.role === 'CLUB_ADMIN' || aff.role === 'EVENT_MANAGER'
    )
    return affiliation?.organizer_id || null
  }, [currentUser])

  // Load events for today
  const loadEvents = useCallback(async () => {
    setLoadingEvents(true)
    try {
      // Load events that user can manage
      const result = await getEvents({
        status: 'APPROVED',
        organizer_id: myOrganizerId || undefined,
        limit: 50,
      })
      
      if (result.success && result.data) {
        // Filter events happening today or in the future
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const filteredEvents = (result.data.items || []).filter((event: Event) => {
          const eventDate = new Date(event.end_at)
          return eventDate >= today
        })
        
        setEvents(filteredEvents)

        // Hydrate existing QR sessions from backend (fix mất phiên sau reload)
        const qrResults = await Promise.all(
          filteredEvents.map(async (event) => {
            const qrRes = await getEventQRCode(event._id)
            if (!qrRes.success || !qrRes.data) return null

            return {
              event_id: event._id,
              event_title: event.title,
              qr_code_token: qrRes.data.qr_code_token,
              expires_at: qrRes.data.expires_at,
              is_active: qrRes.data.is_active,
              scan_count: qrRes.data.scan_count,
            } as CheckInSession
          })
        )

        const loadedSessions = qrResults.filter(Boolean) as CheckInSession[]
        setSessions(loadedSessions)

        const active = loadedSessions.find((s) => s.is_active && !isSessionExpired(s)) || null
        setActiveSession(active)
        
        // If event ID from URL, set it as selected
        if (eventIdFromUrl) {
          setSelectedEventId(eventIdFromUrl)
        }
      }
    } catch (error) {
      console.error('Error loading events:', error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách sự kiện",
      })
    } finally {
      setLoadingEvents(false)
    }
  }, [myOrganizerId, eventIdFromUrl, toast, isSessionExpired])

  useEffect(() => {
    if (currentUser) {
      loadEvents()
    }
  }, [loadEvents, currentUser])

  // Load registrations for active session
  const loadRegistrations = useCallback(async (eventId: string) => {
    setLoadingRegistrations(true)
    try {
      const result = await getEventRegistrations(eventId)
      if (result.success && result.data) {
        setRegistrations(result.data)
      }
    } catch (error) {
      console.error('Error loading registrations:', error)
    } finally {
      setLoadingRegistrations(false)
    }
  }, [])

  // Auto-refresh registrations when active session
  useEffect(() => {
    if (activeSession) {
      loadRegistrations(activeSession.event_id)
      
      // Refresh every 10 seconds
      const interval = setInterval(() => {
        loadRegistrations(activeSession.event_id)
      }, 10000)
      
      return () => clearInterval(interval)
    }
  }, [activeSession, loadRegistrations])

  // Create new QR check-in session
  const handleCreateSession = async () => {
    if (!selectedEventId) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn sự kiện",
      })
      return
    }

    // Kiểm tra sự kiện đã có session chưa
    if (eventHasSession(selectedEventId)) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Sự kiện này đã có phiên check-in. Vui lòng xóa phiên cũ trước khi tạo mới.",
      })
      return
    }

    setIsCreatingSession(true)
    try {
      const result = await generateEventQRCode(selectedEventId, {
        expires_in_hours: parseInt(expiresInHours),
      })

      if (result.success && result.data) {
        const event = events.find(e => e._id === selectedEventId)
        const newSession: CheckInSession = {
          event_id: selectedEventId,
          event_title: event?.title || 'Unknown Event',
          qr_code_token: result.data.qr_code_token,
          expires_at: result.data.expires_at,
          is_active: true,
          scan_count: 0,
        }
        
        // Deactivate other sessions
        setSessions(prev => [...prev.map(s => ({ ...s, is_active: false })), newSession])
        setActiveSession(newSession)
        setSelectedEventId("") // Reset selection
        
        toast({
          title: "Thành công",
          description: "Đã tạo phiên check-in mới",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể tạo phiên check-in",
        })
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tạo phiên check-in",
      })
    } finally {
      setIsCreatingSession(false)
    }
  }

  // Xóa session
  const handleDeleteSession = async (session: CheckInSession) => {
    setIsDeletingSession(session.qr_code_token)
    try {
      await deleteEventQRCode(session.event_id)
      setSessions(prev => prev.filter(s => s.qr_code_token !== session.qr_code_token))
      if (activeSession?.qr_code_token === session.qr_code_token) {
        setActiveSession(null)
      }
      toast({
        title: "Đã xóa",
        description: "Phiên check-in đã được xóa",
      })
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa phiên check-in",
      })
    } finally {
      setIsDeletingSession(null)
    }
  }

  // Toggle session active state
  const toggleSession = async (session: CheckInSession) => {
    if (session.is_active) {
      // Deactivate
      try {
        await deactivateEventQRCode(session.event_id)
        setSessions(prev => prev.map(s => 
          s.qr_code_token === session.qr_code_token 
            ? { ...s, is_active: false } 
            : s
        ))
        setActiveSession(null)
        toast({
          title: "Đã dừng",
          description: "Phiên check-in đã được tạm dừng",
        })
      } catch {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể dừng phiên check-in",
        })
      }
    } else {
      // Activate - regenerate QR
      try {
        const result = await generateEventQRCode(session.event_id, {
          expires_in_hours: 24,
        })
        
        if (result.success && result.data) {
          const updatedSession = {
            ...session,
            qr_code_token: result.data.qr_code_token,
            expires_at: result.data.expires_at,
            is_active: true,
          }
          
          setSessions(prev => prev.map(s => 
            s.event_id === session.event_id 
              ? updatedSession 
              : { ...s, is_active: false }
          ))
          setActiveSession(updatedSession)
          
          toast({
            title: "Đã kích hoạt",
            description: "Phiên check-in đã được kích hoạt",
          })
        }
      } catch {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể kích hoạt phiên check-in",
        })
      }
    }
  }

  // Calculate session stats
  const sessionStats = useMemo(() => {
    if (!activeSession || !registrations.length) return { total: 0, checkedIn: 0 }
    return {
      total: registrations.length,
      checkedIn: registrations.filter(r => r.status === 'ATTENDED').length,
    }
  }, [activeSession, registrations])

  // Recent check-ins
  const recentCheckIns = useMemo(() => {
    return registrations
      .filter(r => r.status === 'ATTENDED')
      .sort((a, b) => new Date(b.attended_at || 0).getTime() - new Date(a.attended_at || 0).getTime())
      .slice(0, 5)
  }, [registrations])

  if (loadingEvents) {
    return (
      <div className="flex flex-col">
        <AdminHeader
          title="QR Check-in"
          description="Quản lý check-in cho sự kiện"
        />
        <LoadingState />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="QR Check-in"
        description="Quản lý check-in cho sự kiện bằng QR code"
      />

      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Session Form & List */}
          <div className="space-y-6 lg:col-span-1">
            {/* Create Session Form */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Tạo phiên Check-in</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Chọn sự kiện</Label>
                  <Select 
                    value={selectedEventId} 
                    onValueChange={setSelectedEventId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn sự kiện..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEvents.length === 0 ? (
                        <SelectItem value="no-events" disabled>
                          {events.length === 0 ? "Không có sự kiện nào" : "Tất cả sự kiện đã có phiên check-in"}
                        </SelectItem>
                      ) : (
                        availableEvents.map((event) => (
                          <SelectItem key={event._id} value={event._id}>
                            {event.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Thời hạn QR (giờ)</Label>
                  <Select value={expiresInHours} onValueChange={setExpiresInHours}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 giờ</SelectItem>
                      <SelectItem value="2">2 giờ</SelectItem>
                      <SelectItem value="4">4 giờ</SelectItem>
                      <SelectItem value="8">8 giờ</SelectItem>
                      <SelectItem value="12">12 giờ</SelectItem>
                      <SelectItem value="24">24 giờ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleCreateSession}
                  disabled={!selectedEventId || isCreatingSession}
                >
                  {isCreatingSession && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <QrCode className="mr-2 h-4 w-4" />
                  Tạo QR Check-in
                </Button>
              </CardContent>
            </Card>

            {/* Sessions List */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Phiên check-in</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <QrCode className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p className="text-sm">Chưa có phiên check-in nào</p>
                    <p className="text-xs mt-1">Tạo phiên mới để bắt đầu</p>
                  </div>
                ) : (
                  sessions.map((session) => {
                    const expired = isSessionExpired(session);
                    return (
                      <div
                        key={session.qr_code_token}
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          expired 
                            ? "border-red-500/50 bg-red-500/10" 
                            : "border-border bg-secondary/50"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {session.event_title}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span className={`truncate ${expired ? "text-red-500" : ""}`}>
                              Hết hạn: {new Date(session.expires_at).toLocaleString("vi-VN")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {expired ? (
                            <Badge className="bg-red-500/20 text-red-500">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Hết hạn
                            </Badge>
                          ) : session.is_active ? (
                            <Badge className="bg-green-500/20 text-green-500">
                              Đang hoạt động
                            </Badge>
                          ) : null}
                          {!expired && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleSession(session)}
                              className={
                                session.is_active
                                  ? "text-green-500 hover:text-green-500"
                                  : ""
                              }
                            >
                              {session.is_active ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSession(session)}
                            disabled={isDeletingSession === session.qr_code_token}
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            title="Xóa phiên check-in"
                          >
                            {isDeletingSession === session.qr_code_token ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - QR Display & Stats */}
          <div className="space-y-6 lg:col-span-2">
            {activeSession ? (
              <>
                {/* QR Code */}
                <Card className="border-border bg-card">
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{activeSession.event_title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Quét QR code này để check-in
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <QRCode 
                        value={activeSession.qr_code_token} 
                        size={256}
                        level="H"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Token: <code className="bg-muted px-2 py-1 rounded text-xs">{activeSession.qr_code_token.substring(0, 20)}...</code>
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Hết hạn: {new Date(activeSession.expires_at).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats & Recent Check-ins */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Stats */}
                  <Card className="border-border bg-card">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Thống kê</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => loadRegistrations(activeSession.event_id)}
                          disabled={loadingRegistrations}
                        >
                          <RefreshCw className={`h-4 w-4 ${loadingRegistrations ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-secondary p-4 text-center">
                          <Users className="mx-auto h-6 w-6 text-muted-foreground" />
                          <p className="mt-2 text-2xl font-bold">
                            {sessionStats.total}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Đã đăng ký
                          </p>
                        </div>
                        <div className="rounded-lg bg-secondary p-4 text-center">
                          <CheckCircle2 className="mx-auto h-6 w-6 text-green-500" />
                          <p className="mt-2 text-2xl font-bold text-green-500">
                            {sessionStats.checkedIn}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Đã check-in
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Tỷ lệ tham dự
                          </span>
                          <span className="font-medium">
                            {sessionStats.total > 0
                              ? Math.round(
                                  (sessionStats.checkedIn / sessionStats.total) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-secondary">
                          <div
                            className="h-2 rounded-full bg-green-500 transition-all"
                            style={{
                              width: `${
                                sessionStats.total > 0
                                  ? (sessionStats.checkedIn /
                                      sessionStats.total) *
                                    100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Check-ins */}
                  <Card className="border-border bg-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Check-in gần đây
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {recentCheckIns.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <AlertCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                          <p className="text-sm">Chưa có ai check-in</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {recentCheckIns.map((registration) => {
                            const user = typeof registration.user_id === 'object' ? registration.user_id : null;
                            const userName = user?.profile?.full_name || user?.email || 'Unknown';
                            const userAvatar = user?.profile?.avatar_url;
                            
                            return (
                              <div
                                key={registration._id}
                                className="flex items-center gap-3"
                              >
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={userAvatar}
                                    alt={userName}
                                  />
                                  <AvatarFallback>
                                    {userName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {userName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {registration.attended_at &&
                                      new Date(
                                        registration.attended_at
                                      ).toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                  </p>
                                </div>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="flex h-96 flex-col items-center justify-center">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium text-muted-foreground">
                    Chưa có phiên check-in nào đang hoạt động
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
                    Tạo một phiên check-in mới hoặc kích hoạt một phiên đã có để hiển thị QR code cho người tham dự quét
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
