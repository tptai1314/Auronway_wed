"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pencil,
  Trash2,
  Users,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { getEvent, getRegistrations, deleteEvent, type Event, type Registration } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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

const getModeBadge = (mode: string) => {
  const modeMap: Record<string, string> = {
    OFFLINE: "Trực tiếp",
    ONLINE: "Trực tuyến",
    HYBRID: "Kết hợp",
  }
  return <Badge variant="outline">{modeMap[mode] || mode}</Badge>
}

const getRegStatusBadge = (status: string) => {
  switch (status) {
    case "ATTENDED":
      return <Badge className="bg-accent/20 text-accent">Đã tham dự</Badge>
    case "REGISTERED":
      return <Badge variant="secondary">Đã đăng ký</Badge>
    case "CANCELLED":
      return <Badge variant="destructive">Đã hủy</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function EventDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  const [event, setEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const eventId = params.id as string

  const fetchData = useCallback(async () => {
    try {
      const [eventResult, regResult] = await Promise.all([
        getEvent(eventId),
        getRegistrations(eventId),
      ])

      if (eventResult.success && eventResult.data) {
        setEvent(eventResult.data)
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không tìm thấy sự kiện",
        })
        router.push("/admin/events")
        return
      }

      if (regResult.success && regResult.data) {
        setRegistrations(regResult.data)
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải thông tin sự kiện",
      })
    } finally {
      setLoading(false)
    }
  }, [eventId, router, toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const result = await deleteEvent(eventId)
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã xóa sự kiện",
        })
        router.push("/admin/events")
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể xóa sự kiện",
        })
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa sự kiện",
      })
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!event) {
    return null
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title={event.title}
        description="Chi tiết sự kiện"
      />

      <div className="p-6">
        {/* Back button & Actions */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/admin/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/events/${eventId}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Event Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Image */}
            {event.cover_image_url && (
              <div className="aspect-video overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.cover_image_url}
                  alt={event.title || "Event cover"}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Thông tin sự kiện</CardTitle>
                  <div className="flex gap-2">
                    {event.type && getTypeBadge(event.type)}
                    {event.mode && getModeBadge(event.mode)}
                    {event.status && getStatusBadge(event.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.description && (
                  <p className="text-muted-foreground">{event.description}</p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Thời gian bắt đầu</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.start_at).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Thời gian kết thúc</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.end_at).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                )}

                {event.meeting_url && (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={event.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {event.meeting_url}
                    </a>
                  </div>
                )}

                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Registrations */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Người tham gia ({registrations.length})
                  </CardTitle>
                  <Link
                    href={`/admin/participants?event=${eventId}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Xem tất cả →
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {registrations.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Người dùng</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Ngày đăng ký</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrations.slice(0, 5).map((reg) => {
                        const user = typeof reg.user_id === "object" ? reg.user_id : null
                        return (
                          <TableRow key={reg._id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={user?.profile?.avatar_url}
                                    alt={user?.profile?.full_name}
                                  />
                                  <AvatarFallback>
                                    {(user?.profile?.full_name || user?.email || "U").charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{user?.profile?.full_name || "Chưa cập nhật"}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {user?.email || "N/A"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(reg.registered_at).toLocaleDateString("vi-VN")}
                            </TableCell>
                            <TableCell>{getRegStatusBadge(reg.status)}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">Chưa có người đăng ký</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Đã đăng ký</span>
                  <span className="font-medium">{event.registered_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Đã tham dự</span>
                  <span className="font-medium">{event.attended_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tỷ lệ tham dự</span>
                  <span className="font-medium">
                    {event.registered_count > 0
                      ? Math.round((event.attended_count / event.registered_count) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thời gian</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.registration_open_at && (
                  <div>
                    <p className="text-sm text-muted-foreground">Mở đăng ký</p>
                    <p className="font-medium">
                      {new Date(event.registration_open_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                )}
                {event.registration_close_at && (
                  <div>
                    <p className="text-sm text-muted-foreground">Đóng đăng ký</p>
                    <p className="font-medium">
                      {new Date(event.registration_close_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">
                    {new Date(event.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sự kiện?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Sự kiện &quot;{event.title}&quot; và tất cả
              đăng ký liên quan sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
