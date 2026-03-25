"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Eye, CheckCircle, Loader2 } from "lucide-react"
import { getEvents, updateEvent, type Event } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { isTenantAdmin } from "@/lib/admin-access"
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

export default function ApproveEventsPage() {
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState<string | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [authorized, setAuthorized] = useState<boolean>(false)

  useEffect(() => {
    // Load user from localStorage
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      setCurrentUser(user)
      setAuthorized(isTenantAdmin(user))
    }
  }, [])

  useEffect(() => {
    if (currentUser && authorized) {
      fetchDraftEvents()
    }
  }, [currentUser, authorized])

  const fetchDraftEvents = async () => {
    try {
      const params: any = {
        status: "DRAFT",
        limit: 50,
      }

      const result = await getEvents(params)

      if (result.success && result.data) {
        setEvents(result.data.items || [])
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách sự kiện",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApproveClick = (eventId: string) => {
    setSelectedEventId(eventId)
    setShowApproveDialog(true)
  }

  const handleApprove = async () => {
    if (!selectedEventId) return

    setApproving(selectedEventId)
    try {
      const result = await updateEvent(selectedEventId, { status: "APPROVED" })

      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã duyệt sự kiện",
        })
        // Remove from list
        setEvents(events.filter((e) => e._id !== selectedEventId))
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể duyệt sự kiện",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể duyệt sự kiện",
      })
    } finally {
      setApproving(null)
      setShowApproveDialog(false)
      setSelectedEventId(null)
    }
  }

  const getOrganizerName = (organizer: any) => {
    if (!organizer) return "Chưa xác định"
    if (typeof organizer === "string") return "Đang tải..."
    return organizer.name || "Chưa xác định"
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (currentUser && !authorized) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Bạn không có quyền truy cập chức năng duyệt sự kiện.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Duyệt sự kiện"
        description="Danh sách sự kiện đang chờ duyệt"
      />

      <div className="p-6">
        {events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                Không có sự kiện nào đang chờ duyệt
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event._id} className="overflow-hidden">
                {/* Cover Image */}
                {event.cover_image_url ? (
                  <div className="aspect-video overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={event.cover_image_url}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                      {event.title}
                    </h3>
                    {event.organizer_id && (
                      <p className="text-sm text-muted-foreground">
                        {getOrganizerName(event.organizer_id)}
                      </p>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(event.start_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/admin/events/${event._id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Xem
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleApproveClick(event._id)}
                      disabled={approving === event._id}
                    >
                      {approving === event._id ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      Duyệt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận duyệt sự kiện</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn duyệt sự kiện này? Sự kiện sẽ được công khai
              và người dùng có thể đăng ký tham gia.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
