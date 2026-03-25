"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { EventForm } from "@/components/admin/event-form"
import { getEvent, updateEvent, type Event, type EventData } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { canManageEvent, isTenantAdmin } from "@/lib/admin-access"

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [canEditStatus, setCanEditStatus] = useState(false)

  const eventId = params.id as string

  useEffect(() => {
    async function fetchEvent() {
      try {
        const userStr = localStorage.getItem("user")
        const currentUser = userStr ? JSON.parse(userStr) : null
        setCanEditStatus(isTenantAdmin(currentUser))

        const result = await getEvent(eventId)
        if (result.success && result.data) {
          if (!canManageEvent(currentUser, result.data)) {
            toast({
              variant: "destructive",
              title: "Không có quyền",
              description: "Bạn chỉ có thể chỉnh sửa sự kiện thuộc câu lạc bộ của mình",
            })
            router.push("/admin/events")
            return
          }

          // Normalize populated fields back to IDs
          const normalizedEvent = {
            ...result.data,
            skills: result.data.skills?.map((skill: { skill_id: string | { _id: string }; xp_reward: number }) => ({
              skill_id: typeof skill.skill_id === 'object' ? skill.skill_id._id : skill.skill_id,
              xp_reward: skill.xp_reward
            })) || []
          }
          setEvent(normalizedEvent)
        } else {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Không tìm thấy sự kiện",
          })
          router.push("/admin/events")
        }
      } catch {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải thông tin sự kiện",
        })
        router.push("/admin/events")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [eventId, router, toast])

  const handleSubmit = async (data: Partial<Event>) => {
    setIsSaving(true)
    try {
      const eventData: Partial<EventData> = {
        ...data,
        start_at: data.start_at ? new Date(data.start_at).toISOString() : undefined,
        end_at: data.end_at ? new Date(data.end_at).toISOString() : undefined,
        registration_open_at: data.registration_open_at
          ? new Date(data.registration_open_at).toISOString()
          : undefined,
        registration_close_at: data.registration_close_at
          ? new Date(data.registration_close_at).toISOString()
          : undefined,
      }

      if (!canEditStatus) {
        delete eventData.status
      }

      const result = await updateEvent(eventId, eventData)

      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật sự kiện",
        })
        router.push("/admin/events")
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể cập nhật sự kiện",
        })
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật sự kiện",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.push("/admin/events")
  }

  if (isLoading) {
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
        title="Chỉnh sửa sự kiện"
        description={event.title}
      />

      <div className="p-6">
        <EventForm
          event={event}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSaving}
          canEditStatus={canEditStatus}
        />
      </div>
    </div>
  )
}
