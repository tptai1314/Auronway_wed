"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { EventTable } from "@/components/admin/event-table"
import { EventFilters } from "@/components/admin/event-filters"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { getEvents, deleteEvent as deleteEventAPI, type Event } from "@/lib/api"
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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [total, setTotal] = useState(0)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getEvents({
        status: statusFilter,
        type: typeFilter,
        q: searchQuery,
        limit: 50,
      })

      console.log("Fetched events:", result)
      if (result.success && result.data) {
        setEvents(result.data.items)
        setTotal(result.data.total)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách sự kiện",
      })
    } finally {
      setLoading(false)
    }
  }, [statusFilter, typeFilter, searchQuery, toast])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const result = await deleteEventAPI(deleteId)
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã xóa sự kiện",
        })
        fetchEvents()
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
      setDeleteId(null)
    }
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Quản lý Sự kiện"
        description={`Tổng cộng ${total} sự kiện`}
      />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <EventFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
          />
          <Button asChild className="shrink-0">
            <Link href="/admin/events/new">
              <Plus className="mr-2 h-4 w-4" />
              Tạo sự kiện
            </Link>
          </Button>
        </div>

        {/* Events Table */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : events.length > 0 ? (
          <EventTable events={events} onDelete={(id) => setDeleteId(id)} />
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">
                Không tìm thấy sự kiện
              </p>
              <p className="text-sm text-muted-foreground">
                Thử thay đổi bộ lọc hoặc tạo sự kiện mới
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sự kiện?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Sự kiện và tất cả đăng ký liên quan sẽ bị xóa vĩnh viễn.
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
