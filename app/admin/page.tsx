"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { StatsCard } from "@/components/admin/stats-card"
import { Calendar, Users, UserCheck, Activity, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getEvents, getDashboardStats } from "@/lib/api"
import type { Event } from "@/lib/api"
import Link from "next/link"

const getStatusBadge = (status: string) => {
  switch (status) {
    case "APPROVED":
      return <Badge className="bg-accent/20 text-accent hover:bg-accent/30">Đã duyệt</Badge>
    case "DRAFT":
      return <Badge variant="secondary">Bản nháp</Badge>
    case "CANCELLED":
      return <Badge variant="destructive">Đã hủy</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getTypeBadge = (type: string) => {
  const typeMap: Record<string, string> = {
    WORKSHOP: "Workshop",
    COMPETITION: "Cuộc thi",
    SEMINAR: "Seminar",
    VOLUNTEER: "Tình nguyện",
    TRAINING: "Đào tạo",
  }
  return <Badge variant="outline">{typeMap[type] || type}</Badge>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    checkedInCount: 0,
  })
  const [recentEvents, setRecentEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsResult, eventsResult] = await Promise.all([
          getDashboardStats(),
          getEvents({ limit: 5 }),
        ])

        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data)
        }

        if (eventsResult.success && eventsResult.data) {
          setRecentEvents(eventsResult.data.items)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Dashboard"
        description="Tổng quan về hoạt động sự kiện"
      />

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Tổng sự kiện"
            value={stats.totalEvents}
            description={`${stats.activeEvents} sự kiện đang hoạt động`}
            icon={Calendar}
          />
          <StatsCard
            title="Người tham gia"
            value={stats.totalRegistrations}
            description="Tổng số đăng ký"
            icon={Users}
          />
          <StatsCard
            title="Đã check-in"
            value={stats.checkedInCount}
            description={`${stats.totalRegistrations > 0 ? Math.round((stats.checkedInCount / stats.totalRegistrations) * 100) : 0}% tỷ lệ tham dự`}
            icon={UserCheck}
          />
          <StatsCard
            title="Người dùng"
            value={stats.totalUsers}
            description="Tài khoản đã đăng ký"
            icon={Activity}
          />
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          {/* Recent Events */}
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Sự kiện gần đây</CardTitle>
              <Link
                href="/admin/events"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Xem tất cả →
              </Link>
            </CardHeader>
            <CardContent>
              {recentEvents.length > 0 ? (
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <Link
                      key={event._id}
                      href={`/admin/events/${event._id}/edit`}
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4 transition-colors hover:bg-secondary"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {event.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          {event.type && getTypeBadge(event.type)}
                          <span className="text-sm text-muted-foreground">
                            {new Date(event.start_at || "").toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {event.registered_count} đăng ký
                        </span>
                        {event.status && getStatusBadge(event.status)}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
                  <p className="text-muted-foreground">Chưa có sự kiện nào</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
