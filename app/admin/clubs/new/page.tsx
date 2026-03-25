"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { ClubForm } from "@/components/admin/club-form"
import { createOrganizer } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { DEFAULT_TENANT_ID, DEFAULT_CAMPUS_ID } from "@/lib/config"

export default function NewClubPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const clubData: Parameters<typeof createOrganizer>[0] = {
        name: data.name,
        description: data.description,
        contact_email: data.contact?.email, // Map to backend field
        logo_url: data.logo, // Map to backend field
        type: "CLUB", // Required by backend
        tenant_id: DEFAULT_TENANT_ID,
        campus_id: DEFAULT_CAMPUS_ID,
      }

      const result = await createOrganizer(clubData)

      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã tạo câu lạc bộ mới",
        })
        router.push("/admin/clubs")
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể tạo câu lạc bộ",
        })
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tạo câu lạc bộ",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/admin/clubs")
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Tạo câu lạc bộ mới"
        description="Điền thông tin để tạo câu lạc bộ"
      />

      <div className="p-6">
        <ClubForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
