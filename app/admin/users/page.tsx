"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { AdminHeader } from "@/components/admin/admin-header"
import { UserTable } from "@/components/admin/user-table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, UserPlus, Loader2, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
import { getUsers, createUser, updateUser, toggleUserStatus, deleteUser, uploadImage, type User } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { isTenantAdmin } from "@/lib/admin-access"

type LocalUser = {
  roles?: string[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [total, setTotal] = useState(0)
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(null)
  const [authorized, setAuthorized] = useState(false)

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [detailUser, setDetailUser] = useState<User | null>(null)
  const [toggleStatusUser, setToggleStatusUser] = useState<User | null>(null)
  const [deleteTargetUser, setDeleteTargetUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAvatarUploading, setIsAvatarUploading] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    student_id: "",
    date_of_birth: "",
    major: "",
    bio: "",
    phone: "",
    avatar_url: "",
  })

  const { toast } = useToast()

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === "string" && error.trim()) return error
    if (error && typeof error === "object") {
      const err = error as { message?: string; response?: { data?: { message?: string } } }
      if (err.response?.data?.message) return err.response.data.message
      if (err.message) return err.message
    }
    return fallback
  }

  // Load current user info
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr) as LocalUser
      setCurrentUser(user)
      setAuthorized(isTenantAdmin(user))
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getUsers({
        q: searchQuery,
        status: statusFilter,
        role: "PUBLIC_USER",
        limit: 50,
      })
      if (result.success && result.data) {
        const filteredItems = result.data.items.filter(
          (u) =>
            u.roles?.includes("PUBLIC_USER") &&
            !u.roles?.includes("TENANT_ADMIN") &&
            !u.roles?.includes("SUPER_ADMIN")
        )
        setUsers(filteredItems)
        setTotal(filteredItems.length)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: getErrorMessage(error, "Không thể tải danh sách người dùng"),
      })
    } finally {
      setLoading(false)
    }
  }, [searchQuery, statusFilter, toast])

  useEffect(() => {
    if (authorized) {
      fetchUsers()
    } else if (currentUser) {
      setLoading(false)
    }
  }, [fetchUsers, authorized, currentUser])

  if (currentUser && !authorized) {
    return (
      <div className="flex flex-col">
        <AdminHeader title="Quản lý Người dùng" description="Bạn không có quyền truy cập" />
        <div className="p-6 text-muted-foreground">Chức năng này chỉ dành cho Tenant Admin.</div>
      </div>
    )
  }

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      full_name: "",
      student_id: "",
      date_of_birth: "",
      major: "",
      bio: "",
      phone: "",
      avatar_url: "",
    })
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const result = await createUser({
        email: formData.email,
        password: formData.password,
        profile: {
          full_name: formData.full_name,
          student_id: formData.student_id || undefined,
          date_of_birth: formData.date_of_birth || undefined,
          major: formData.major || undefined,
          bio: formData.bio || undefined,
          phone: formData.phone || undefined,
          avatar_url: formData.avatar_url || undefined,
        },
        roles: ["PUBLIC_USER"],
      })

      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã tạo người dùng mới",
        })
        setIsCreateDialogOpen(false)
        resetForm()
        fetchUsers()
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể tạo người dùng",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: getErrorMessage(error, "Không thể tạo người dùng"),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setIsSubmitting(true)
    try {
      const updateData: {
        email: string
        profile: {
          full_name: string
          student_id?: string
          date_of_birth?: string
          major?: string
          bio?: string
          phone?: string
          avatar_url?: string
        }
        password?: string
      } = {
        email: formData.email,
        profile: {
          full_name: formData.full_name,
          student_id: formData.student_id || undefined,
          date_of_birth: formData.date_of_birth || undefined,
          major: formData.major || undefined,
          bio: formData.bio || undefined,
          phone: formData.phone || undefined,
          avatar_url: formData.avatar_url || undefined,
        },
      }

      if (formData.password) {
        updateData.password = formData.password
      }

      const result = await updateUser(editingUser._id, updateData)

      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật người dùng",
        })
        setIsEditDialogOpen(false)
        setEditingUser(null)
        resetForm()
        fetchUsers()
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể cập nhật người dùng",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: getErrorMessage(error, "Không thể cập nhật người dùng"),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!toggleStatusUser) return

    setIsSubmitting(true)
    try {
      const newStatus = !toggleStatusUser.is_active
      const result = await toggleUserStatus(toggleStatusUser._id, newStatus)

      if (result.success) {
        toast({
          title: "Thành công",
          description: newStatus ? "Đã mở khóa người dùng" : "Đã khóa người dùng",
        })
        fetchUsers()
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể thay đổi trạng thái",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: getErrorMessage(error, "Không thể thay đổi trạng thái"),
      })
    } finally {
      setIsSubmitting(false)
      setToggleStatusUser(null)
    }
  }

  const handleDeleteUser = async () => {
    if (!deleteTargetUser) return

    setIsSubmitting(true)
    try {
      const result = await deleteUser(deleteTargetUser._id)

      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã xóa người dùng",
        })
        fetchUsers()
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể xóa người dùng",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: getErrorMessage(error, "Không thể xóa người dùng"),
      })
    } finally {
      setIsSubmitting(false)
      setDeleteTargetUser(null)
    }
  }

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsAvatarUploading(true)
    try {
      const result = await uploadImage(file)
      if (result.success && result.data?.url) {
        setFormData((prev) => ({ ...prev, avatar_url: result.data?.url || "" }))
        toast({
          title: "Thành công",
          description: "Đã upload avatar",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể upload avatar",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: getErrorMessage(error, "Không thể upload avatar"),
      })
    } finally {
      setIsAvatarUploading(false)
      event.target.value = ""
    }
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: "",
      full_name: user.profile?.full_name || "",
      student_id: user.profile?.student_id || "",
      date_of_birth: user.profile?.date_of_birth ? new Date(user.profile.date_of_birth).toISOString().split("T")[0] : "",
      major: user.profile?.major || "",
      bio: user.profile?.bio || "",
      phone: user.profile?.phone || "",
      avatar_url: user.profile?.avatar_url || "",
    })
    setIsEditDialogOpen(true)
  }

  const stats = {
    total,
    active: users.filter((u) => u.is_active).length,
    admins: 0,
    organizers: 0,
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Quản lý Người dùng"
        description={`Tổng cộng ${total} người dùng`}
      />

      <div className="p-6">
        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Tổng người dùng</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Đang hoạt động</p>
            <p className="text-2xl font-bold text-accent">{stats.active}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Admin</p>
            <p className="text-2xl font-bold">{stats.admins}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Quản lý sự kiện</p>
            <p className="text-2xl font-bold">{stats.organizers}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary pl-9 sm:w-64"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full bg-secondary sm:w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Đã khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Create User Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Thêm người dùng
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[92vh] max-w-3xl overflow-hidden p-0">
              <div className="border-b px-6 py-5">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground">Tạo tài khoản mới</DialogTitle>
                </DialogHeader>
                <p className="mt-1 text-sm text-muted-foreground">Điền thông tin cơ bản cho tài khoản học sinh.</p>
              </div>

              <form onSubmit={handleCreateUser}>
                <div className="max-h-[68vh] space-y-6 overflow-y-auto px-6 py-5">
                  <div className="flex items-start gap-4 rounded-lg border bg-secondary/30 p-4">
                    <label
                      htmlFor="create-avatar-file"
                      className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/40 bg-background text-muted-foreground hover:border-blue-500 hover:text-blue-600"
                    >
                      {formData.avatar_url ? (
                        <Image src={formData.avatar_url} alt="avatar preview" width={96} height={96} unoptimized className="h-full w-full object-cover" />
                      ) : (
                        <Camera className="h-7 w-7" />
                      )}
                    </label>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-foreground">Ảnh đại diện</p>
                      <p className="text-sm text-muted-foreground">Chọn ảnh từ máy tính để upload. Tối đa 2MB.</p>
                      {isAvatarUploading && <p className="text-xs text-blue-600">Đang tải ảnh...</p>}
                    </div>
                    <Input
                      id="create-avatar-file"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFileChange}
                      disabled={isSubmitting || isAvatarUploading}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="create-name">Họ và tên</Label>
                      <Input
                        id="create-name"
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="bg-secondary"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-student-id">MSSV</Label>
                      <Input
                        id="create-student-id"
                        placeholder="Ví dụ: HE173456"
                        className="bg-secondary"
                        value={formData.student_id}
                        onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="create-email">Email</Label>
                      <Input
                        id="create-email"
                        type="email"
                        placeholder="student@fpt.edu.vn"
                        className="bg-secondary"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-password">Mật khẩu ban đầu</Label>
                      <Input
                        id="create-password"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className="bg-secondary"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-date-of-birth">Ngày sinh</Label>
                      <Input
                        id="create-date-of-birth"
                        type="date"
                        className="bg-secondary"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Ngành học</Label>
                      <Select
                        value={formData.major || "__none__"}
                        onValueChange={(value) => setFormData({ ...formData, major: value === "__none__" ? "" : value })}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="bg-secondary">
                          <SelectValue placeholder="Chọn ngành học" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">Chưa chọn</SelectItem>
                          <SelectItem value="Công nghệ thông tin">Công nghệ thông tin</SelectItem>
                          <SelectItem value="Kỹ thuật phần mềm">Kỹ thuật phần mềm</SelectItem>
                          <SelectItem value="Trí tuệ nhân tạo">Trí tuệ nhân tạo</SelectItem>
                          <SelectItem value="An toàn thông tin">An toàn thông tin</SelectItem>
                          <SelectItem value="Thiết kế đồ họa">Thiết kế đồ họa</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="create-bio">Giới thiệu ngắn</Label>
                      <Textarea
                        id="create-bio"
                        placeholder="Mô tả ngắn về định hướng học tập của sinh viên..."
                        className="min-h-24 bg-secondary"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t bg-secondary/40 px-6 py-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      resetForm()
                    }}
                    disabled={isSubmitting || isAvatarUploading}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isSubmitting || isAvatarUploading} className="bg-blue-600 hover:bg-blue-700">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Tạo tài khoản
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : users.length > 0 ? (
          <UserTable
            users={users}
            onView={(user) => setDetailUser(user)}
            onEdit={openEditDialog}
            onToggleStatus={(user) => setToggleStatusUser(user)}
            onDelete={(user) => setDeleteTargetUser(user)}
          />
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">
                Không tìm thấy người dùng
              </p>
              <p className="text-sm text-muted-foreground">
                Thử thay đổi bộ lọc để xem kết quả khác
              </p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!detailUser} onOpenChange={() => setDetailUser(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
          </DialogHeader>
          {detailUser && (
            <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
              <div className="flex items-center gap-4 rounded-lg border bg-secondary/30 p-4">
                <div className="h-20 w-20 overflow-hidden rounded-full border bg-background">
                  {detailUser.profile?.avatar_url ? (
                    <Image src={detailUser.profile.avatar_url} alt={detailUser.profile?.full_name || detailUser.email} width={80} height={80} unoptimized className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-muted-foreground">
                      {(detailUser.profile?.full_name || detailUser.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold">{detailUser.profile?.full_name || "Chưa cập nhật"}</p>
                  <p className="text-sm text-muted-foreground">{detailUser.email}</p>
                </div>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div><span className="font-medium">MSSV:</span> {detailUser.profile?.student_id || "Chưa cập nhật"}</div>
                <div><span className="font-medium">Ngày sinh:</span> {detailUser.profile?.date_of_birth ? new Date(detailUser.profile.date_of_birth).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</div>
                <div><span className="font-medium">Ngành:</span> {detailUser.profile?.major || "Chưa cập nhật"}</div>
                <div><span className="font-medium">SĐT:</span> {detailUser.profile?.phone || "Chưa cập nhật"}</div>
                <div><span className="font-medium">Vai trò hệ thống:</span> {detailUser.roles?.join(", ") || "PUBLIC_USER"}</div>
                <div><span className="font-medium">Trạng thái:</span> {detailUser.is_active ? "Hoạt động" : "Đã khóa"}</div>
                <div className="sm:col-span-2"><span className="font-medium">Giới thiệu:</span> {detailUser.profile?.bio || "Chưa cập nhật"}</div>
                <div className="sm:col-span-2"><span className="font-medium">XP/Level:</span> {detailUser.stats?.total_xp || 0} XP / Lv.{detailUser.stats?.level || 1}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[92vh] max-w-3xl overflow-hidden p-0">
          <div className="border-b px-6 py-5">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-foreground">Chỉnh sửa người dùng</DialogTitle>
            </DialogHeader>
            <p className="mt-1 text-sm text-muted-foreground">Cập nhật thông tin tài khoản học sinh.</p>
          </div>

          <form onSubmit={handleEditUser}>
            <div className="max-h-[68vh] space-y-6 overflow-y-auto px-6 py-5">
              <div className="flex items-start gap-4 rounded-lg border bg-secondary/30 p-4">
                <label
                  htmlFor="edit-avatar-file"
                  className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/40 bg-background text-muted-foreground hover:border-blue-500 hover:text-blue-600"
                >
                  {formData.avatar_url ? (
                    <Image src={formData.avatar_url} alt="avatar preview" width={96} height={96} unoptimized className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-7 w-7" />
                  )}
                </label>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-foreground">Ảnh đại diện</p>
                  <p className="text-sm text-muted-foreground">Chọn ảnh mới từ máy tính để thay thế.</p>
                  {isAvatarUploading && <p className="text-xs text-blue-600">Đang tải ảnh...</p>}
                </div>
                <Input
                  id="edit-avatar-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                  disabled={isSubmitting || isAvatarUploading}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Họ và tên</Label>
                  <Input
                    id="edit-name"
                    placeholder="Nhập họ và tên"
                    className="bg-secondary"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-student-id">MSSV</Label>
                  <Input
                    id="edit-student-id"
                    placeholder="Nhập MSSV"
                    className="bg-secondary"
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="Nhập email"
                    className="bg-secondary"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-password">Mật khẩu mới (nếu đổi)</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    placeholder="Để trống nếu không đổi"
                    className="bg-secondary"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date-of-birth">Ngày sinh</Label>
                  <Input
                    id="edit-date-of-birth"
                    type="date"
                    className="bg-secondary"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Ngành học</Label>
                  <Select
                    value={formData.major || "__none__"}
                    onValueChange={(value) => setFormData({ ...formData, major: value === "__none__" ? "" : value })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-secondary">
                      <SelectValue placeholder="Chọn ngành học" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Chưa chọn</SelectItem>
                      <SelectItem value="Công nghệ thông tin">Công nghệ thông tin</SelectItem>
                      <SelectItem value="Kỹ thuật phần mềm">Kỹ thuật phần mềm</SelectItem>
                      <SelectItem value="Trí tuệ nhân tạo">Trí tuệ nhân tạo</SelectItem>
                      <SelectItem value="An toàn thông tin">An toàn thông tin</SelectItem>
                      <SelectItem value="Thiết kế đồ họa">Thiết kế đồ họa</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="edit-bio">Giới thiệu ngắn</Label>
                  <Textarea
                    id="edit-bio"
                    placeholder="Mô tả ngắn về định hướng học tập của sinh viên..."
                    className="min-h-24 bg-secondary"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t bg-secondary/40 px-6 py-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditingUser(null)
                  resetForm()
                }}
                disabled={isSubmitting || isAvatarUploading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting || isAvatarUploading} className="bg-blue-600 hover:bg-blue-700">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cập nhật
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Toggle Status Confirmation Dialog */}
      <AlertDialog
        open={!!toggleStatusUser}
        onOpenChange={() => setToggleStatusUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleStatusUser?.is_active ? "Khóa người dùng?" : "Mở khóa người dùng?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleStatusUser?.is_active
                ? "Người dùng sẽ không thể đăng nhập sau khi bị khóa."
                : "Người dùng sẽ có thể đăng nhập trở lại."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              disabled={isSubmitting}
              className={
                toggleStatusUser?.is_active
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {toggleStatusUser?.is_active ? "Khóa" : "Mở khóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deleteTargetUser}
        onOpenChange={() => setDeleteTargetUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa người dùng?</AlertDialogTitle>
            <AlertDialogDescription>
              Tài khoản {deleteTargetUser?.email} sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
