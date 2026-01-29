"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { QRCodeDisplay } from "@/components/admin/qr-code-display"
import { CheckInSessionForm } from "@/components/admin/checkin-session-form"
import { mockEvents, mockCheckInSessions, mockParticipants } from "@/lib/mock-data"
import type { CheckInSession } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, QrCode, Play, Pause } from "lucide-react"
import { Suspense } from "react"
import Loading from "./loading"

export default function CheckInPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CheckInPageContent />
    </Suspense>
  )
}

function CheckInPageContent() {
  const searchParams = useSearchParams()
  const eventIdFromUrl = searchParams.get("event")

  const [sessions, setSessions] = useState<CheckInSession[]>(mockCheckInSessions)
  const [activeSession, setActiveSession] = useState<CheckInSession | null>(
    sessions.find((s) => s.is_active) || null
  )

  const handleCreateSession = (data: {
    event_id: string
    start_time: string
    end_time: string
  }) => {
    const event = mockEvents.find((e) => e._id === data.event_id)
    if (!event) return

    const newSession: CheckInSession = {
      event_id: data.event_id,
      event_title: event.title,
      start_time: data.start_time,
      end_time: data.end_time,
      qr_code: `EVT-${data.event_id}-CHECKIN-${Date.now()}`,
      is_active: false,
    }
    setSessions([...sessions, newSession])
  }

  const toggleSession = (session: CheckInSession) => {
    const updatedSessions = sessions.map((s) => ({
      ...s,
      is_active: s.qr_code === session.qr_code ? !s.is_active : false,
    }))
    setSessions(updatedSessions)
    setActiveSession(
      session.is_active ? null : { ...session, is_active: true }
    )
  }

  const recentCheckIns = useMemo(() => {
    if (!activeSession) return []
    return mockParticipants
      .filter(
        (p) =>
          p.event_id === activeSession.event_id && p.status === "CHECKED_IN"
      )
      .slice(0, 5)
  }, [activeSession])

  const sessionStats = useMemo(() => {
    if (!activeSession) return { total: 0, checkedIn: 0 }
    const eventParticipants = mockParticipants.filter(
      (p) => p.event_id === activeSession.event_id
    )
    return {
      total: eventParticipants.length,
      checkedIn: eventParticipants.filter((p) => p.status === "CHECKED_IN")
        .length,
    }
  }, [activeSession])

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="QR Check-in"
        description="Quản lý check-in cho sự kiện"
      />

      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Session Form & List */}
          <div className="space-y-6 lg:col-span-1">
            <CheckInSessionForm
              events={mockEvents}
              onCreateSession={handleCreateSession}
            />

            {/* Sessions List */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Phiên check-in</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">
                    Chưa có phiên check-in nào
                  </p>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.qr_code}
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {session.event_title}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(session.start_time).toLocaleTimeString(
                              "vi-VN",
                              { hour: "2-digit", minute: "2-digit" }
                            )}{" "}
                            -{" "}
                            {new Date(session.end_time).toLocaleTimeString(
                              "vi-VN",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.is_active && (
                          <Badge className="bg-accent/20 text-accent">
                            Đang hoạt động
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSession(session)}
                          className={
                            session.is_active
                              ? "text-accent hover:text-accent"
                              : ""
                          }
                        >
                          {session.is_active ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - QR Display & Stats */}
          <div className="space-y-6 lg:col-span-2">
            {activeSession ? (
              <>
                {/* QR Code */}
                <QRCodeDisplay
                  value={activeSession.qr_code}
                  title={activeSession.event_title}
                  subtitle={`Check-in từ ${new Date(
                    activeSession.start_time
                  ).toLocaleString("vi-VN")} đến ${new Date(
                    activeSession.end_time
                  ).toLocaleString("vi-VN")}`}
                />

                {/* Stats & Recent Check-ins */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Stats */}
                  <Card className="border-border bg-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Thống kê</CardTitle>
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
                          <QrCode className="mx-auto h-6 w-6 text-accent" />
                          <p className="mt-2 text-2xl font-bold text-accent">
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
                            className="h-2 rounded-full bg-accent transition-all"
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
                        <p className="text-center text-sm text-muted-foreground">
                          Chưa có ai check-in
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {recentCheckIns.map((participant) => (
                            <div
                              key={participant._id}
                              className="flex items-center gap-3"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={participant.user_avatar || "/placeholder.svg"}
                                  alt={participant.user_name}
                                />
                                <AvatarFallback>
                                  {participant.user_name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {participant.user_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {participant.checked_in_at &&
                                    new Date(
                                      participant.checked_in_at
                                    ).toLocaleTimeString("vi-VN", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                </p>
                              </div>
                            </div>
                          ))}
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
                  <p className="mt-2 text-sm text-muted-foreground">
                    Tạo hoặc kích hoạt một phiên check-in để hiển thị QR code
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
