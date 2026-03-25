"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { EventForm } from "@/components/admin/event-form"
import { createEvent, type Event, type EventData } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { DEFAULT_TENANT_ID, DEFAULT_CAMPUS_ID, DEFAULT_ORGANIZER_ID } from "@/lib/config"
import { getPrimaryTenantClubOrganizerId, isTenantAdmin } from "@/lib/admin-access"

export default function NewEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [myClubId, setMyClubId] = useState<string | null>(null)
  const [canEditStatus, setCanEditStatus] = useState(false)

  useEffect(() => {
    // Load user from localStorage
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      setCanEditStatus(isTenantAdmin(user))

      const organizerId = getPrimaryTenantClubOrganizerId(user)
      if (organizerId) {
        setMyClubId(organizerId)
        console.log("Tenant Club detected. Club ID:", organizerId)
      }
    }
  }, [])

  const handleSubmit = async (data: Partial<Event>) => {
    setIsLoading(true)
    try {
      // Use club's organizer_id if user is club manager, otherwise use default
      const organizerId = myClubId || DEFAULT_ORGANIZER_ID

      const eventData = {
        ...data,
        tenant_id: DEFAULT_TENANT_ID,
        campus_id: DEFAULT_CAMPUS_ID,
        organizer_id: organizerId,
        start_at: data.start_at ? new Date(data.start_at as string).toISOString() : "",
        end_at: data.end_at ? new Date(data.end_at as string).toISOString() : "",
        registration_open_at: data.registration_open_at
          ? new Date(data.registration_open_at as string).toISOString()
          : undefined,
        registration_close_at: data.registration_close_at
          ? new Date(data.registration_close_at as string).toISOString()
          : undefined,
      }

      if (!canEditStatus) {
        delete eventData.status
      }

      console.log("Creating event with organizer_id:", organizerId)

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
          canEditStatus={canEditStatus}
        />
      </div>
    </div>
  )
}
