"use client"

import { useState } from "react"
import type { Organizer } from "@/lib/api"
import { uploadImage } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload } from "lucide-react"
import Image from "next/image"

interface ClubFormProps {
  club?: Organizer
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ClubForm({ club, onSubmit, onCancel, isLoading }: ClubFormProps) {
  const [formData, setFormData] = useState({
    name: club?.name || "",
    description: club?.description || "",
    logo: club?.logo_url || "", // Map from backend
    contact: {
      email: club?.contact?.email || "", // Map from backend
      phone: "",
      website: "",
      address: "",
    },
  })

  const [logoPreview, setLogoPreview] = useState<string>(club?.logo_url || "")
  const [isUploading, setIsUploading] = useState(false)

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload immediately
    setIsUploading(true)
    try {
      const result = await uploadImage(file)
      if (result.success && result.data) {
        setFormData({ ...formData, logo: result.data.url })
      } else {
        alert(result.error || "Upload thất bại")
      }
    } catch {
      alert("Lỗi khi upload ảnh")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên câu lạc bộ")
      return
    }

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Info */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên câu lạc bộ *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nhập tên câu lạc bộ"
                required
                className="bg-secondary"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả về câu lạc bộ"
                rows={4}
                className="bg-secondary resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <div className="flex gap-4">
                {logoPreview && (
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg border bg-muted">
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    disabled={isUploading || isLoading}
                    className="bg-secondary"
                  />
                  {isUploading && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                      Đang upload...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.contact.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value },
                  })
                }
                placeholder="email@example.com"
                className="bg-secondary"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.contact.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value },
                  })
                }
                placeholder="0123456789"
                className="bg-secondary"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.contact.website}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, website: e.target.value },
                  })
                }
                placeholder="https://example.com"
                className="bg-secondary"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Textarea
                id="address"
                value={formData.contact.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, address: e.target.value },
                  })
                }
                placeholder="Địa chỉ văn phòng câu lạc bộ"
                rows={3}
                className="bg-secondary resize-none"
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading || isUploading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {club ? "Cập nhật" : "Tạo câu lạc bộ"}
        </Button>
      </div>
    </form>
  )
}
