"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { ClubForm } from "@/components/admin/club-form"
import { getOrganizerById, updateOrganizer, type Organizer } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function EditClubPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [club, setClub] = useState<Organizer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const clubId = params.id as string

  useEffect(() => {
    async function fetchClub() {
      try {
        const result = await getOrganizerById(clubId)
        if (result.success && result.data) {
          setClub(result.data)
        } else {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Không tìm thấy câu lạc bộ",
          })
          router.push("/admin/clubs")
        }
      } catch {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải thông tin câu lạc bộ",
        })
        router.push("/admin/clubs")
      } finally {
        setIsLoading(false)
      }
    }

    fetchClub()
  }, [clubId, router, toast])

  const handleSubmit = async (data: any) => {
    setIsSaving(true)
    try {
      const updateData = {
        name: data.name,
        description: data.description,
        contact_email: data.contact?.email,
        logo_url: data.logo,
      }

      const result = await updateOrganizer(clubId, updateData)

      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật câu lạc bộ",
        })
        router.push(`/admin/clubs/${clubId}`)
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể cập nhật câu lạc bộ",
        })
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật câu lạc bộ",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.push(`/admin/clubs/${clubId}`)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!club) {
    return null
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Chỉnh sửa câu lạc bộ"
        description={club.name}
      />

      <div className="p-6">
        <ClubForm
          club={club}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSaving}
        />
      </div>
    </div>
  )
}
