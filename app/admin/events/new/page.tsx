"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { EventForm } from "@/components/admin/event-form"
import { createEvent, type Event, type EventData } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { DEFAULT_TENANT_ID, DEFAULT_CAMPUS_ID, DEFAULT_ORGANIZER_ID } from "@/lib/config"

export default function NewEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: Partial<Event>) => {
    setIsLoading(true)
    try {
      const eventData = {
        ...data,
        tenant_id: DEFAULT_TENANT_ID,
        campus_id: DEFAULT_CAMPUS_ID,
        organizer_id: DEFAULT_ORGANIZER_ID,
        start_at: data.start_at ? new Date(data.start_at as string).toISOString() : "",
        end_at: data.end_at ? new Date(data.end_at as string).toISOString() : "",
        registration_open_at: data.registration_open_at
          ? new Date(data.registration_open_at as string).toISOString()
          : undefined,
        registration_close_at: data.registration_close_at
          ? new Date(data.registration_close_at as string).toISOString()
          : undefined,
      }

      const result = await createEvent(eventData as EventData)

      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã tạo sự kiện mới",
        })
        router.push("/admin/events")
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể tạo sự kiện",
        })
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tạo sự kiện",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/admin/events")
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Tạo sự kiện mới"
        description="Điền thông tin để tạo sự kiện"
      />

      <div className="p-6">
        <EventForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
