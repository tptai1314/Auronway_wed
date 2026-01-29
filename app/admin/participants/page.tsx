"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getEvents, getRegistrations, type Registration, type Event } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function ParticipantsPage() {
  const searchParams = useSearchParams()
  const eventIdFromUrl = searchParams.get("event")

  const [events, setEvents] = useState<Event[]>([])
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingRegistrations, setLoadingRegistrations] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState(eventIdFromUrl || "")

  const { toast } = useToast()

  // Fetch events list
  useEffect(() => {
    async function fetchEvents() {
      try {
        const result = await getEvents({ limit: 100 })
        if (result.success && result.data) {
          setEvents(result.data.items)
          // If no event selected, select the first one
          if (!eventFilter && result.data.items.length > 0) {
            setEventFilter(result.data.items[0]._id)
          }
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Fetch registrations when event changes
  const fetchRegistrations = useCallback(async () => {
    if (!eventFilter) return

    setLoadingRegistrations(true)
    try {
      const result = await getRegistrations(eventFilter)
      if (result.success && result.data) {
        setRegistrations(result.data)
      } else {
        setRegistrations([])
      }
    } catch (error) {
      console.error("Error fetching registrations:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách người tham gia",
      })
    } finally {
      setLoadingRegistrations(false)
    }
  }, [eventFilter, toast])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  // Filter registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const user = typeof reg.user_id === "object" ? reg.user_id : null
    const userName = user?.profile?.full_name || ""
    const userEmail = user?.email || ""

    const matchesSearch =
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || reg.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: registrations.length,
    attended: registrations.filter((r) => r.status === "ATTENDED").length,
    registered: registrations.filter((r) => r.status === "REGISTERED").length,
    cancelled: registrations.filter((r) => r.status === "CANCELLED").length,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ATTENDED":
        return (
          <Badge className="bg-accent/20 text-accent hover:bg-accent/30">
            Đã tham dự
          </Badge>
        )
      case "REGISTERED":
        return <Badge variant="secondary">Đã đăng ký</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Đã hủy</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const selectedEvent = events.find((e) => e._id === eventFilter)

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Quản lý Người tham gia"
        description={selectedEvent ? `Sự kiện: ${selectedEvent.title}` : "Chọn sự kiện để xem"}
      />

      <div className="p-6">
        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Tổng số</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Đã tham dự</p>
            <p className="text-2xl font-bold text-accent">{stats.attended}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Đã đăng ký</p>
            <p className="text-2xl font-bold">{stats.registered}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Đã hủy</p>
            <p className="text-2xl font-bold text-destructive">
              {stats.cancelled}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary pl-9 sm:w-64"
              />
            </div>

            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-full bg-secondary sm:w-56">
                <SelectValue placeholder="Chọn sự kiện" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event._id} value={event._id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full bg-secondary sm:w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="ATTENDED">Đã tham dự</SelectItem>
                <SelectItem value="REGISTERED">Đã đăng ký</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
        </div>

        {/* Table */}
        {loading || loadingRegistrations ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !eventFilter ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">
                Chọn sự kiện
              </p>
              <p className="text-sm text-muted-foreground">
                Vui lòng chọn một sự kiện để xem danh sách người tham gia
              </p>
            </div>
          </div>
        ) : filteredRegistrations.length > 0 ? (
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[250px]">Người tham gia</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead>Ngày tham dự</TableHead>
                  <TableHead>XP</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((reg) => {
                  const user = typeof reg.user_id === "object" ? reg.user_id : null
                  return (
                    <TableRow key={reg._id} className="hover:bg-secondary/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={user?.profile?.avatar_url || "/placeholder.svg"}
                              alt={user?.profile?.full_name || user?.email}
                            />
                            <AvatarFallback>
                              {(user?.profile?.full_name || user?.email || "U").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">
                            {user?.profile?.full_name || "Chưa cập nhật"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user?.email || "N/A"}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(reg.registered_at).toLocaleDateString("vi-VN")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {reg.attended_at
                            ? new Date(reg.attended_at).toLocaleDateString("vi-VN")
                            : "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {reg.xp_awarded ? "Đã nhận" : "Chưa nhận"}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(reg.status)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">
                Không tìm thấy người tham gia
              </p>
              <p className="text-sm text-muted-foreground">
                Thử thay đổi bộ lọc để xem kết quả khác
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
