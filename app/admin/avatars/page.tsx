"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { AdminHeader } from "@/components/admin/admin-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import {
  createAdminAvatar,
  deleteAdminAvatar,
  getAdminAvatars,
  uploadImage,
  updateAdminAvatar,
  type AdminAvatar,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Search, Pencil, Trash2, Camera } from "lucide-react"

export default function AvatarsPage() {
  const [avatars, setAvatars] = useState<AdminAvatar[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState("")

  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editAvatar, setEditAvatar] = useState<AdminAvatar | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    image_url: "",
    order: "1",
    is_default: false,
    is_active: true,
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

  const resetForm = () => {
    setForm({
      name: "",
      image_url: "",
      order: "1",
      is_default: false,
      is_active: true,
    })
  }

  const fetchAvatars = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAdminAvatars({
        q: query,
        limit: 100,
      })

      if (res.success && res.data) {
        setAvatars(res.data.items)
        setTotal(res.data.total)
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: res.error || "Không thể tải danh sách avatar",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: getErrorMessage(error, "Không thể tải danh sách avatar"),
      })
    } finally {
      setLoading(false)
    }
  }, [query, toast])

  useEffect(() => {
    fetchAvatars()
  }, [fetchAvatars])

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImageUploading(true)
    try {
      const result = await uploadImage(file)
      if (result.success && result.data?.url) {
        setForm((prev) => ({ ...prev, image_url: result.data?.url || "" }))
        toast({ title: "Thành công", description: "Đã tải ảnh avatar" })
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể tải ảnh avatar",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: getErrorMessage(error, "Không thể tải ảnh avatar"),
      })
    } finally {
      setIsImageUploading(false)
      event.target.value = ""
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await createAdminAvatar({
        name: form.name,
        image_url: form.image_url,
        is_default: form.is_default,
        is_active: form.is_active,
      })

      if (res.success) {
        toast({ title: "Thành công", description: "Đã tạo avatar" })
        setOpenCreate(false)
        resetForm()
        fetchAvatars()
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: res.error || "Không thể tạo avatar",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: getErrorMessage(error, "Không thể tạo avatar"),
      })
    } finally {
      setSubmitting(false)
    }
  }

  const openEditDialog = (avatar: AdminAvatar) => {
    setEditAvatar(avatar)
    setForm({
      name: avatar.name,
      image_url: avatar.image_url,
      order: String(avatar.order || 1),
      is_default: Boolean(avatar.is_default),
      is_active: avatar.is_active !== false,
    })
    setOpenEdit(true)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editAvatar) return

    setSubmitting(true)
    try {
      const res = await updateAdminAvatar(editAvatar._id, {
        name: form.name,
        image_url: form.image_url,
        order: Number(form.order) || 0,
        is_default: form.is_default,
        is_active: form.is_active,
      })

      if (res.success) {
        toast({ title: "Thành công", description: "Đã cập nhật avatar" })
        setOpenEdit(false)
        setEditAvatar(null)
        resetForm()
        fetchAvatars()
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: res.error || "Không thể cập nhật avatar",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: getErrorMessage(error, "Không thể cập nhật avatar"),
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setSubmitting(true)
    try {
      const res = await deleteAdminAvatar(deleteId)
      if (res.success) {
        toast({ title: "Thành công", description: "Đã xóa avatar" })
        fetchAvatars()
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: res.error || "Không thể xóa avatar",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: getErrorMessage(error, "Không thể xóa avatar"),
      })
    } finally {
      setDeleteId(null)
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col">
      <AdminHeader title="Quản lý Avatar" description={`Tổng cộng ${total} avatar`} />

      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm avatar theo tên..."
              className="bg-secondary pl-9"
            />
          </div>

          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm avatar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Tạo avatar mới</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleCreate}>
                <div className="space-y-2">
                  <Label htmlFor="create-name">Tên avatar</Label>
                  <Input
                    id="create-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-secondary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ảnh avatar</Label>
                  <div className="flex items-start gap-4 rounded-lg border bg-secondary/30 p-4">
                    <label
                      htmlFor="create-avatar-file"
                      className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/40 bg-background text-muted-foreground hover:border-blue-500 hover:text-blue-600"
                    >
                      {form.image_url ? (
                        <Image src={form.image_url} alt="avatar preview" width={80} height={80} unoptimized className="h-full w-full object-cover" />
                      ) : (
                        <Camera className="h-6 w-6" />
                      )}
                    </label>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Chọn ảnh từ máy tính</p>
                      <p className="text-xs text-muted-foreground">Không cần nhập URL. Nhấn vào ô ảnh để tải lên.</p>
                      {isImageUploading && <p className="text-xs text-blue-600">Đang tải ảnh...</p>}
                      {!isImageUploading && form.image_url && <p className="text-xs text-emerald-600">Đã tải ảnh thành công</p>}
                    </div>
                    <Input
                      id="create-avatar-file"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFileChange}
                      disabled={submitting || isImageUploading}
                    />
                  </div>
                </div>

                <div className="rounded-lg border bg-secondary/20 p-3 text-sm text-muted-foreground">
                  STT sẽ tự tăng theo thứ tự hiện có (không cần nhập thủ công khi tạo mới).
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <Label htmlFor="create-default">Avatar mặc định</Label>
                  <Switch
                    id="create-default"
                    checked={form.is_default}
                    onCheckedChange={(checked) => setForm({ ...form, is_default: checked })}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <Label htmlFor="create-active">Đang hoạt động</Label>
                  <Switch
                    id="create-active"
                    checked={form.is_active}
                    onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                  />
                </div>

                <Button className="w-full" type="submit" disabled={submitting || isImageUploading || !form.image_url}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Lưu avatar
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : avatars.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Ảnh</th>
                  <th className="px-4 py-3 text-left font-medium">Tên</th>
                  <th className="px-4 py-3 text-left font-medium">Thứ tự</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-right font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {avatars.map((avatar) => (
                  <tr key={avatar._id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <Image
                        src={avatar.image_url}
                        alt={avatar.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 min-h-12 min-w-12 aspect-square border object-cover rounded-none"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{avatar.name}</div>
                      <div className="text-xs text-muted-foreground">{avatar.image_url}</div>
                    </td>
                    <td className="px-4 py-3">{avatar.order || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {avatar.is_default && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            Mặc định
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            avatar.is_active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {avatar.is_active ? "Hoạt động" : "Ẩn"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(avatar)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setDeleteId(avatar._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">Chưa có avatar</p>
              <p className="text-sm text-muted-foreground">Bấm &quot;Thêm avatar&quot; để tạo mới</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cập nhật avatar</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleEdit}>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên avatar</Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-secondary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Ảnh avatar</Label>
              <div className="flex items-start gap-4 rounded-lg border bg-secondary/30 p-4">
                <label
                  htmlFor="edit-avatar-file"
                  className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/40 bg-background text-muted-foreground hover:border-blue-500 hover:text-blue-600"
                >
                  {form.image_url ? (
                    <Image src={form.image_url} alt="avatar preview" width={80} height={80} unoptimized className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-6 w-6" />
                  )}
                </label>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Đổi ảnh từ máy tính</p>
                  <p className="text-xs text-muted-foreground">Nhấn vào ô ảnh để upload ảnh mới.</p>
                  {isImageUploading && <p className="text-xs text-blue-600">Đang tải ảnh...</p>}
                </div>
                <Input
                  id="edit-avatar-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                  disabled={submitting || isImageUploading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-order">Thứ tự</Label>
              <Input
                id="edit-order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                className="bg-secondary"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="edit-default">Avatar mặc định</Label>
              <Switch
                id="edit-default"
                checked={form.is_default}
                onCheckedChange={(checked) => setForm({ ...form, is_default: checked })}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="edit-active">Đang hoạt động</Label>
              <Switch
                id="edit-active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
              />
            </div>

            <Button className="w-full" type="submit" disabled={submitting || isImageUploading || !form.image_url}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa avatar?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Avatar đã xóa sẽ không còn hiển thị cho người dùng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={submitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
