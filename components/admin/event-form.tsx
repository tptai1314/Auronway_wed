"use client"

import React from "react"
import Image from "next/image"

import { useState, useEffect } from "react"
import type { Event, Skill } from "@/lib/api"
import { uploadImage, getAllSkills } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Loader2 } from "lucide-react"

type EventType = "WORKSHOP" | "COMPETITION" | "SEMINAR" | "VOLUNTEER" | "TRAINING"
type EventMode = "OFFLINE" | "ONLINE" | "HYBRID"
type EventStatus = "DRAFT" | "APPROVED" | "CANCELLED"

interface EventFormProps {
  event?: Event
  onSubmit: (data: Partial<Event>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  canEditStatus?: boolean
}

function toLocalDateTimeInput(value?: string) {
  if (!value) return ""
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ""

  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  const hh = String(d.getHours()).padStart(2, "0")
  const mi = String(d.getMinutes()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

function toLocalDateInput(value?: string) {
  if (!value) return ""
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ""

  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export function EventForm({ event, onSubmit, onCancel, isLoading, canEditStatus = false }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    type: event?.type || ("WORKSHOP" as EventType),
    mode: event?.mode || ("OFFLINE" as EventMode),
    status: event?.status || ("DRAFT" as EventStatus),
    start_at: toLocalDateTimeInput(event?.start_at),
    end_at: toLocalDateTimeInput(event?.end_at),
    registration_open_at: toLocalDateInput(event?.registration_open_at),
    registration_close_at: toLocalDateInput(event?.registration_close_at),
    location: event?.location || "",
    meeting_url: event?.meeting_url || "",
    cover_image_url: event?.cover_image_url || "",
    tags: event?.tags || [],
    skills: event?.skills || [] as { skill_id: string; xp_reward: number }[],
  })

  const [tagInput, setTagInput] = useState("")
  const [imagePreview, setImagePreview] = useState<string>(event?.cover_image_url || "")
  const [isUploading, setIsUploading] = useState(false)
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [selectedSkillId, setSelectedSkillId] = useState("")
  const [skillXp, setSkillXp] = useState("")

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = async () => {
    const result = await getAllSkills()
    if (result.success && result.data) {
      setAvailableSkills(result.data)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload immediately
    setIsUploading(true)
    try {
      const result = await uploadImage(file)
      if (result.success && result.data) {
        setFormData({ ...formData, cover_image_url: result.data.url })
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
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tên sự kiện")
      return
    }
    
    if (!formData.start_at || !formData.end_at) {
      alert("Vui lòng chọn thời gian bắt đầu và kết thúc")
      return
    }
    
    // Validate dates
    const startDate = new Date(formData.start_at)
    const endDate = new Date(formData.end_at)
    const now = new Date()
    
    if (startDate >= endDate) {
      alert("Thời gian bắt đầu phải trước thời gian kết thúc")
      return
    }
    
    if (startDate < now && !event) {
      alert("Thời gian bắt đầu không được trong quá khứ")
      return
    }
    
    // Validate registration dates if provided
    if (formData.registration_open_at && formData.registration_close_at) {
      const regOpen = new Date(`${formData.registration_open_at}T00:00:00`)
      const regClose = new Date(`${formData.registration_close_at}T23:59:59`)
      const eventStartDateOnly = new Date(startDate)
      eventStartDateOnly.setHours(0, 0, 0, 0)
      
      if (regOpen >= regClose) {
        alert("Ngày mở đăng ký phải trước ngày đóng đăng ký")
        return
      }
      
      if (regClose > eventStartDateOnly) {
        alert("Ngày đóng đăng ký phải trước ngày bắt đầu sự kiện")
        return
      }
    }
    
    // Validate meeting_url based on mode
    if ((formData.mode === "ONLINE" || formData.mode === "HYBRID") && !formData.meeting_url) {
      alert("Link họp trực tuyến là bắt buộc cho sự kiện trực tuyến hoặc kết hợp")
      return
    }
    
    // Validate location for offline/hybrid events
    if ((formData.mode === "OFFLINE" || formData.mode === "HYBRID") && !formData.location) {
      alert("Địa điểm là bắt buộc cho sự kiện trực tiếp hoặc kết hợp")
      return
    }
    
    await onSubmit(formData)
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      })
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  const addSkill = () => {
    if (!selectedSkillId || !skillXp) {
      alert("Vui lòng chọn skill và nhập điểm thưởng")
      return
    }

    const xp = parseInt(skillXp)
    if (xp <= 0) {
      alert("Điểm thưởng phải lớn hơn 0")
      return
    }

    // Check if skill already added
    if (formData.skills.some((s: { skill_id: string; xp_reward: number }) => s.skill_id === selectedSkillId)) {
      alert("Skill này đã được thêm")
      return
    }

    setFormData({
      ...formData,
      skills: [...formData.skills, { skill_id: selectedSkillId, xp_reward: xp }],
    })

    setSelectedSkillId("")
    setSkillXp("")
  }

  const removeSkill = (skillId: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s: { skill_id: string; xp_reward: number }) => s.skill_id !== skillId),
    })
  }

  const getSkillName = (skillId: string) => {
    const skill = availableSkills.find((s) => s._id === skillId)
    return skill ? (skill.label_vi || skill.name) : skillId
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
              <Label htmlFor="title">Tên sự kiện *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Nhập tên sự kiện"
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
                placeholder="Nhập mô tả sự kiện"
                rows={4}
                className="bg-secondary"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Loại sự kiện *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: EventType) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="bg-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WORKSHOP">Workshop</SelectItem>
                    <SelectItem value="COMPETITION">Cuộc thi</SelectItem>
                    <SelectItem value="SEMINAR">Seminar</SelectItem>
                    <SelectItem value="VOLUNTEER">Tình nguyện</SelectItem>
                    <SelectItem value="TRAINING">Đào tạo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Hình thức *</Label>
                <Select
                  value={formData.mode}
                  onValueChange={(value: EventMode) =>
                    setFormData({ ...formData, mode: value })
                  }
                >
                  <SelectTrigger className="bg-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OFFLINE">Trực tiếp</SelectItem>
                    <SelectItem value="ONLINE">Trực tuyến</SelectItem>
                    <SelectItem value="HYBRID">Kết hợp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value: EventStatus) =>
                  setFormData({ ...formData, status: value })
                }
                disabled={!canEditStatus}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Bản nháp</SelectItem>
                  <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
              {!canEditStatus && (
                <p className="text-xs text-muted-foreground">
                  Chỉ Tenant Admin mới có quyền chỉnh sửa trạng thái sự kiện.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Nhập tag"
                  className="bg-secondary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={addTag}>
                  Thêm
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="rounded-full p-0.5 hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Location */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Thời gian & Địa điểm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_at">Bắt đầu *</Label>
                <Input
                  id="start_at"
                  type="datetime-local"
                  value={formData.start_at}
                  onChange={(e) =>
                    setFormData({ ...formData, start_at: e.target.value })
                  }
                  required
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_at">Kết thúc *</Label>
                <Input
                  id="end_at"
                  type="datetime-local"
                  value={formData.end_at}
                  onChange={(e) =>
                    setFormData({ ...formData, end_at: e.target.value })
                  }
                  required
                  className="bg-secondary"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="registration_open_at">Mở đăng ký</Label>
                <Input
                  id="registration_open_at"
                  type="date"
                  value={formData.registration_open_at}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registration_open_at: e.target.value,
                    })
                  }
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_close_at">Đóng đăng ký</Label>
                <Input
                  id="registration_close_at"
                  type="date"
                  value={formData.registration_close_at}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registration_close_at: e.target.value,
                    })
                  }
                  className="bg-secondary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Địa điểm</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Nhập địa điểm tổ chức"
                className="bg-secondary"
              />
            </div>

            {(formData.mode === "ONLINE" || formData.mode === "HYBRID") && (
              <div className="space-y-2">
                <Label htmlFor="meeting_url">
                  Link họp trực tuyến {(formData.mode === "ONLINE" || formData.mode === "HYBRID") && "*"}
                </Label>
                <Input
                  id="meeting_url"
                  type="url"
                  value={formData.meeting_url}
                  onChange={(e) =>
                    setFormData({ ...formData, meeting_url: e.target.value })
                  }
                  placeholder="https://meet.google.com/..."
                  className="bg-secondary"
                  required={formData.mode === "ONLINE" || formData.mode === "HYBRID"}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="cover_image">Ảnh bìa</Label>
              <div className="space-y-2">
                {imagePreview && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="object-cover"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    id="cover_image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploading || isLoading}
                    className="bg-secondary"
                  />
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setImagePreview("")
                        setFormData({ ...formData, cover_image_url: "" })
                      }}
                      disabled={isUploading || isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills & Rewards */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Kỹ năng & Điểm thưởng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
                <SelectTrigger className="flex-1 bg-secondary">
                  <SelectValue placeholder="Chọn kỹ năng" />
                </SelectTrigger>
                <SelectContent>
                  {availableSkills.map((skill) => (
                    <SelectItem key={skill._id} value={skill._id}>
                      {skill.label_vi || skill.name}
                      {skill.category_id && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({skill.category_id.label_vi || skill.category_id.name})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Điểm XP"
                value={skillXp}
                onChange={(e) => setSkillXp(e.target.value)}
                className="w-32 bg-secondary"
                min="1"
              />
              <Button type="button" onClick={addSkill} variant="secondary">
                Thêm
              </Button>
            </div>

            {formData.skills.length > 0 && (
              <div className="space-y-2">
                <Label>Kỹ năng đã chọn:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill: { skill_id: string; xp_reward: number }) => (
                    <Badge
                      key={skill.skill_id}
                      variant="secondary"
                      className="gap-2 pr-1"
                    >
                      <span>{getSkillName(skill.skill_id)}</span>
                      <span className="text-xs text-muted-foreground">
                        +{skill.xp_reward} XP
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill.skill_id)}
                        className="rounded-full p-0.5 hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {event ? "Cập nhật sự kiện" : "Tạo sự kiện"}
        </Button>
      </div>
    </form>
  )
}
