"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, Save, User as UserIcon, Mail, Phone, Briefcase, Calendar, Github, Linkedin, Link as LinkIcon } from "lucide-react"
import { getMyProfile, updateMyProfile, uploadUserAvatar, type UserProfile } from "@/lib/api"

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    student_id: "",
    major: "",
    bio: "",
    date_of_birth: "",
    phone: "",
    github: "",
    linkedin: "",
    portfolio: "",
  })

  // Load profile
  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const result = await getMyProfile()
      
      if (result.success && result.data) {
        setProfile(result.data)
        
        // Populate form with existing data
        setFormData({
          full_name: result.data.profile?.full_name || "",
          student_id: result.data.profile?.student_id || "",
          major: result.data.profile?.major || "",
          bio: result.data.profile?.bio || "",
          date_of_birth: result.data.profile?.date_of_birth ? new Date(result.data.profile.date_of_birth).toISOString().split('T')[0] : "",
          phone: result.data.profile?.phone || "",
          github: result.data.profile?.links?.github || "",
          linkedin: result.data.profile?.links?.linkedin || "",
          portfolio: result.data.profile?.links?.portfolio || "",
        })
      } else {
        setError(result.error || "Không thể tải thông tin profile")
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tải profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const updateData = {
        full_name: formData.full_name,
        student_id: formData.student_id,
        major: formData.major,
        bio: formData.bio,
        date_of_birth: formData.date_of_birth || undefined,
        phone: formData.phone,
        links: {
          github: formData.github,
          linkedin: formData.linkedin,
          portfolio: formData.portfolio,
        }
      }

      const result = await updateMyProfile(updateData)

      if (result.success && result.data) {
        setProfile(result.data)
        setSuccess("Cập nhật thông tin thành công!")
        
        // Update localStorage user data
        const userStr = localStorage.getItem("user")
        if (userStr) {
          const user = JSON.parse(userStr)
          user.profile = result.data.profile
          localStorage.setItem("user", JSON.stringify(user))
          
          // Trigger storage event to update sidebar
          window.dispatchEvent(new Event("storage"))
        }
      } else {
        setError(result.error || "Cập nhật thất bại")
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi cập nhật")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Vui lòng chọn file ảnh")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước file không được vượt quá 5MB")
      return
    }

    setIsUploading(true)
    setError("")
    setSuccess("")

    try {
      const result = await uploadUserAvatar(file)

      if (result.success && result.avatar_url) {
        // Update profile state
        if (profile) {
          const updatedProfile = {
            ...profile,
            profile: {
              ...profile.profile,
              avatar_url: result.avatar_url
            }
          }
          setProfile(updatedProfile)
        }

        // Update localStorage
        const userStr = localStorage.getItem("user")
        if (userStr) {
          const user = JSON.parse(userStr)
          if (!user.profile) user.profile = {}
          user.profile.avatar_url = result.avatar_url
          localStorage.setItem("user", JSON.stringify(user))
          
          // Trigger storage event to update sidebar
          window.dispatchEvent(new Event("storage"))
        }

        setSuccess("Upload avatar thành công!")
      } else {
        setError(result.error || "Upload avatar thất bại")
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi upload avatar")
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground mt-1">Quản lý thông tin cá nhân của bạn</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 bg-green-50 text-green-900">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ảnh đại diện</CardTitle>
          <CardDescription>Cập nhật ảnh đại diện của bạn</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile?.profile?.avatar_url} alt={profile?.profile?.full_name || profile?.email} />
            <AvatarFallback className="text-2xl">
              {profile?.profile?.full_name?.charAt(0) || profile?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
            <Label htmlFor="avatar-upload">
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={() => document.getElementById('avatar-upload')?.click()}
                asChild
              >
                <span>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang upload...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload ảnh mới
                    </>
                  )}
                </span>
              </Button>
            </Label>
            <p className="text-sm text-muted-foreground mt-2">
              JPG, PNG hoặc GIF. Tối đa 5MB.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">
                <UserIcon className="inline h-4 w-4 mr-1" />
                Họ và tên
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </Label>
              <Input
                id="email"
                value={profile?.email || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="student_id">
                Mã sinh viên
              </Label>
              <Input
                id="student_id"
                value={formData.student_id}
                onChange={(e) => handleInputChange('student_id', e.target.value)}
                placeholder="SE123456"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="major">
                <Briefcase className="inline h-4 w-4 mr-1" />
                Chuyên ngành
              </Label>
              <Input
                id="major"
                value={formData.major}
                onChange={(e) => handleInputChange('major', e.target.value)}
                placeholder="Software Engineering"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">
                <Calendar className="inline h-4 w-4 mr-1" />
                Ngày sinh
              </Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="inline h-4 w-4 mr-1" />
                Số điện thoại
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="0123456789"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Giới thiệu bản thân</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Viết vài dòng về bản thân..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links Section */}
      <Card>
        <CardHeader>
          <CardTitle>Liên kết mạng xã hội</CardTitle>
          <CardDescription>Thêm các liên kết đến hồ sơ mạng xã hội của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github">
              <Github className="inline h-4 w-4 mr-1" />
              GitHub
            </Label>
            <Input
              id="github"
              value={formData.github}
              onChange={(e) => handleInputChange('github', e.target.value)}
              placeholder="https://github.com/username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">
              <Linkedin className="inline h-4 w-4 mr-1" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio">
              <LinkIcon className="inline h-4 w-4 mr-1" />
              Portfolio
            </Label>
            <Input
              id="portfolio"
              value={formData.portfolio}
              onChange={(e) => handleInputChange('portfolio', e.target.value)}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      {profile?.stats && (
        <Card>
          <CardHeader>
            <CardTitle>Thống kê</CardTitle>
            <CardDescription>Thành tích của bạn trên hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{profile.stats.level}</div>
                <div className="text-sm text-muted-foreground">Cấp độ</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{profile.stats.total_xp}</div>
                <div className="text-sm text-muted-foreground">Tổng XP</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{profile.stats.streak}</div>
                <div className="text-sm text-muted-foreground">Streak</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{profile.stats.completed_events}</div>
                <div className="text-sm text-muted-foreground">Sự kiện</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{profile.stats.certificates_count}</div>
                <div className="text-sm text-muted-foreground">Chứng chỉ</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => router.push('/admin')}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSaveProfile}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
