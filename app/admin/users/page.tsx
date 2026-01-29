"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { UserTable } from "@/components/admin/user-table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, UserPlus, Loader2 } from "lucide-react"
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
import { getUsers, createUser, updateUser, toggleUserStatus, type User } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [total, setTotal] = useState(0)

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [toggleStatusUser, setToggleStatusUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "PUBLIC_USER",
  })

  const { toast } = useToast()

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getUsers({
        q: searchQuery,
        status: statusFilter,
        role: roleFilter,
        limit: 50,
      })
      if (result.success && result.data) {
        setUsers(result.data.items)
        setTotal(result.data.total)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng",
      })
    } finally {
      setLoading(false)
    }
  }, [searchQuery, statusFilter, roleFilter, toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      full_name: "",
      role: "PUBLIC_USER",
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
        },
        roles: [formData.role],
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
        description: "Không thể tạo người dùng",
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
      const updateData: any = {
        email: formData.email,
        profile: {
          full_name: formData.full_name,
        },
        roles: [formData.role],
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
        description: "Không thể cập nhật người dùng",
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
        description: "Không thể thay đổi trạng thái",
      })
    } finally {
      setIsSubmitting(false)
      setToggleStatusUser(null)
    }
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: "",
      full_name: user.profile?.full_name || "",
      role: user.roles?.[0] || "PUBLIC_USER",
    })
    setIsEditDialogOpen(true)
  }

  const stats = {
    total,
    active: users.filter((u) => u.is_active).length,
    admins: users.filter((u) => u.roles?.includes("SUPER_ADMIN") || u.roles?.includes("TENANT_ADMIN")).length,
    organizers: users.filter((u) =>
      u.affiliations?.some((a) => a.role === "EVENT_MANAGER")
    ).length,
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

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full bg-secondary sm:w-40">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="TENANT_ADMIN">Tenant Admin</SelectItem>
                <SelectItem value="PUBLIC_USER">Người dùng</SelectItem>
              </SelectContent>
            </Select>

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
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm người dùng mới</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleCreateUser}>
                <div className="space-y-2">
                  <Label htmlFor="create-name">Họ và tên</Label>
                  <Input
                    id="create-name"
                    placeholder="Nhập họ và tên"
                    className="bg-secondary"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-email">Email</Label>
                  <Input
                    id="create-email"
                    type="email"
                    placeholder="Nhập email"
                    className="bg-secondary"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-password">Mật khẩu</Label>
                  <Input
                    id="create-password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="bg-secondary"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vai trò</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                      <SelectItem value="TENANT_ADMIN">Tenant Admin</SelectItem>
                      <SelectItem value="PUBLIC_USER">Người dùng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      resetForm()
                    }}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Thêm người dùng
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
            onEdit={openEditDialog}
            onToggleStatus={(user) => setToggleStatusUser(user)}
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

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleEditUser}>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Họ và tên</Label>
              <Input
                id="edit-name"
                placeholder="Nhập họ và tên"
                className="bg-secondary"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Nhập email"
                className="bg-secondary"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Mật khẩu mới (để trống nếu không đổi)</Label>
              <Input
                id="edit-password"
                type="password"
                placeholder="Nhập mật khẩu mới"
                className="bg-secondary"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="TENANT_ADMIN">Tenant Admin</SelectItem>
                  <SelectItem value="PUBLIC_USER">Người dùng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditingUser(null)
                  resetForm()
                }}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
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
    </div>
  )
}
