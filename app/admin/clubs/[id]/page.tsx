"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Loader2, 
  Building2, 
  Users, 
  Lock, 
  Globe, 
  Mail, 
  Phone, 
  ExternalLink,
  ArrowLeft,
  Shield,
  UserCog,
  Calendar,
  Pencil,
  Trash2,
  UserPlus,
  Search,
  UserMinus
} from "lucide-react"
import { 
  getOrganizerById, 
  getOrganizerMembers,
  deleteOrganizer,
  addOrganizerMember,
  removeOrganizerMember,
  searchUsers,
  type Organizer, 
  type OrganizerMember 
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"

export default function ClubDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const clubId = params.id as string

  const [club, setClub] = useState<Organizer | null>(null)
  const [members, setMembers] = useState<OrganizerMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  // Member management states
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [showRemoveMemberDialog, setShowRemoveMemberDialog] = useState(false)
  const [selectedMemberToRemove, setSelectedMemberToRemove] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [selectedRole, setSelectedRole] = useState("MEMBER")
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [isRemovingMember, setIsRemovingMember] = useState(false)

  useEffect(() => {
    if (clubId) {
      loadClubDetails()
    }
  }, [clubId])

  const loadClubDetails = async () => {
    setIsLoading(true)
    setError("")

    try {
      console.log('Loading club with ID:', clubId)
      
      // Load club info and members in parallel
      const [clubResult, membersResult] = await Promise.all([
        getOrganizerById(clubId),
        getOrganizerMembers(clubId)
      ])

      console.log('Club result:', clubResult)
      console.log('Members result:', membersResult)

      if (clubResult.success) {
        // Backend trả về { success: true, organizer: {...} }
        const clubData = (clubResult as any).organizer || clubResult.data
        if (clubData) {
          setClub(clubData)
        } else {
          console.error('No club data in response')
          setError("Không thể tải thông tin câu lạc bộ")
        }
      } else {
        console.error('Club load error:', clubResult.error)
        setError(clubResult.error || "Không thể tải thông tin câu lạc bộ")
      }

      if (membersResult.success && membersResult.data) {
        // Backend trả về members với structure: { user: {...}, role: "...", joined_at: "..." }
        const membersData = membersResult.data.members || []
        // Transform to match frontend type - user chứa thông tin user đã populate
        const transformedMembers = membersData.map((m: any) => ({
          user_id: m.user || m.user_id, // Backend trả về user (populated)
          role: m.role,
          joined_at: m.joined_at
        }))
        setMembers(transformedMembers)
      }
    } catch (err) {
      console.error('Exception loading club:', err)
      setError("Đã có lỗi xảy ra khi tải dữ liệu")
    } finally {
      setIsLoading(false)
    }
  }

  // Search for users to add as members
  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      const result = await searchUsers(searchQuery)
      if (result.success && result.data) {
        // Filter out users already in the club
        const existingMemberIds = members.map(m => m.user_id?._id || m.user_id)
        const filteredResults = ((result.data as any).users || (result.data as any).items || []).filter(
          (user: { _id: string }) => !existingMemberIds.includes(user._id)
        )
        setSearchResults(filteredResults)
      }
    } catch (err) {
      console.error('Error searching users:', err)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tìm kiếm người dùng",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Add member to club
  const handleAddMember = async () => {
    if (!selectedUser) return
    
    setIsAddingMember(true)
    try {
      const result = await addOrganizerMember(clubId, selectedUser._id, selectedRole)
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã thêm thành viên vào câu lạc bộ",
        })
        // Reload members
        loadClubDetails()
        // Reset states
        setShowAddMemberDialog(false)
        setSelectedUser(null)
        setSearchQuery("")
        setSearchResults([])
        setSelectedRole("MEMBER")
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể thêm thành viên",
        })
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể thêm thành viên",
      })
    } finally {
      setIsAddingMember(false)
    }
  }

  // Remove member from club
  const handleRemoveMember = async () => {
    if (!selectedMemberToRemove) return
    
    setIsRemovingMember(true)
    try {
      const userId = selectedMemberToRemove.user_id?._id || selectedMemberToRemove.user_id
      const result = await removeOrganizerMember(clubId, userId)
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã xóa thành viên khỏi câu lạc bộ",
        })
        // Reload members
        loadClubDetails()
        setShowRemoveMemberDialog(false)
        setSelectedMemberToRemove(null)
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể xóa thành viên",
        })
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa thành viên",
      })
    } finally {
      setIsRemovingMember(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const result = await deleteOrganizer(clubId)
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã xóa câu lạc bộ",
        })
        router.push("/admin/clubs")
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể xóa câu lạc bộ",
        })
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa câu lạc bộ",
      })
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      'CLUB_ADMIN': 'Quản trị viên',
      'EVENT_MANAGER': 'Quản lý sự kiện',
      'REVIEWER': 'Người đánh giá',
      'APPROVER': 'Người phê duyệt'
    }
    return labels[role] || role
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'CLUB_ADMIN':
        return 'default'
      case 'EVENT_MANAGER':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  if (isLoading) {
    return (
      <div>
        <AdminHeader title="Chi tiết câu lạc bộ" />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!club) {
    return (
      <div>
        <AdminHeader title="Chi tiết câu lạc bộ" />
        <div className="p-8">
          <Alert variant="destructive">
            <AlertDescription>Không tìm thấy thông tin câu lạc bộ</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => router.push('/admin/clubs')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminHeader title={club.name} description="Thông tin chi tiết và danh sách thành viên" />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/clubs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/clubs/${clubId}/edit`}>
                <Pencil className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Link>
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Club Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {club.logo_url ? (
                  <img 
                    src={club.logo_url} 
                    alt={club.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-10 w-10 text-primary" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-2xl">{club.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={club.is_active ? "default" : "secondary"}>
                      {club.is_active ? "Đang hoạt động" : "Tạm dừng"}
                    </Badge>
                    {club.is_private ? (
                      <Badge variant="outline">
                        <Lock className="h-3 w-3 mr-1" />
                        Riêng tư
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Globe className="h-3 w-3 mr-1" />
                        Công khai
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {club.description && (
              <div>
                <h3 className="font-semibold mb-2">Giới thiệu</h3>
                <p className="text-muted-foreground">{club.description}</p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {club.contact?.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <a href={`mailto:${club.contact.email}`} className="text-primary hover:underline">
                    {club.contact.email}
                  </a>
                </div>
              )}

              {club.contact?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Điện thoại:</span>
                  <a href={`tel:${club.contact.phone}`} className="text-primary hover:underline">
                    {club.contact.phone}
                  </a>
                </div>
              )}

              {club.contact?.website && (
                <div className="flex items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Website:</span>
                  <a 
                    href={club.contact.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {club.contact.website}
                  </a>
                </div>
              )}
            </div>

            {(club.social_links?.facebook || club.social_links?.instagram || club.social_links?.twitter) && (
              <div>
                <h3 className="font-semibold mb-2">Mạng xã hội</h3>
                <div className="flex gap-3">
                  {club.social_links.facebook && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={club.social_links.facebook} target="_blank" rel="noopener noreferrer">
                        Facebook
                      </a>
                    </Button>
                  )}
                  {club.social_links.instagram && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={club.social_links.instagram} target="_blank" rel="noopener noreferrer">
                        Instagram
                      </a>
                    </Button>
                  )}
                  {club.social_links.twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={club.social_links.twitter} target="_blank" rel="noopener noreferrer">
                        Twitter
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Members Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Thành viên câu lạc bộ</CardTitle>
                <CardDescription>
                  Danh sách {members.length} thành viên trong câu lạc bộ
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Users className="h-4 w-4 mr-2" />
                  {members.length}
                </Badge>
                <Button onClick={() => setShowAddMemberDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Thêm thành viên
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mb-4" />
                <p>Chưa có thành viên nào trong câu lạc bộ</p>
                <Button className="mt-4" onClick={() => setShowAddMemberDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Thêm thành viên đầu tiên
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.user_id?._id || Math.random()}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={member.user_id?.profile?.avatar_url} 
                          alt={member.user_id?.profile?.full_name || member.user_id?.email} 
                        />
                        <AvatarFallback>
                          {member.user_id?.profile?.full_name?.charAt(0) || 
                           member.user_id?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {member.user_id?.profile?.full_name || "Chưa cập nhật tên"}
                        </p>
                        <p className="text-sm text-muted-foreground">{member.user_id?.email}</p>
                        {member.user_id?.profile?.student_id && (
                          <p className="text-xs text-muted-foreground">
                            MSSV: {member.user_id.profile.student_id}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getRoleBadgeVariant(member.role)}>
                        {member.role === 'CLUB_ADMIN' && <Shield className="h-3 w-3 mr-1" />}
                        {member.role === 'EVENT_MANAGER' && <Calendar className="h-3 w-3 mr-1" />}
                        {member.role === 'REVIEWER' && <UserCog className="h-3 w-3 mr-1" />}
                        {getRoleLabel(member.role)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(member.joined_at).toLocaleDateString('vi-VN')}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setSelectedMemberToRemove(member)
                          setShowRemoveMemberDialog(true)
                        }}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa câu lạc bộ?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Câu lạc bộ &quot;{club.name}&quot; và tất cả
              dữ liệu liên quan sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm thành viên mới</DialogTitle>
            <DialogDescription>
              Tìm kiếm và thêm thành viên vào câu lạc bộ
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Tìm theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()}
              />
              <Button onClick={handleSearchUsers} disabled={isSearching}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="border rounded-lg max-h-60 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-accent transition-colors ${
                      selectedUser?._id === user._id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profile?.avatar_url} />
                      <AvatarFallback>
                        {user.profile?.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.profile?.full_name || user.email}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    {selectedUser?._id === user._id && (
                      <Badge variant="default">Đã chọn</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}

            {searchResults.length === 0 && searchQuery && !isSearching && (
              <p className="text-center text-muted-foreground py-4">
                Không tìm thấy người dùng nào
              </p>
            )}

            {/* Role Selection */}
            {selectedUser && (
              <div className="space-y-2">
                <Label>Vai trò trong câu lạc bộ</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEMBER">Thành viên</SelectItem>
                    <SelectItem value="EVENT_MANAGER">Quản lý sự kiện</SelectItem>
                    <SelectItem value="REVIEWER">Người đánh giá</SelectItem>
                    <SelectItem value="APPROVER">Người phê duyệt</SelectItem>
                    <SelectItem value="CLUB_ADMIN">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddMemberDialog(false)
                setSelectedUser(null)
                setSearchQuery("")
                setSearchResults([])
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleAddMember} disabled={!selectedUser || isAddingMember}>
              {isAddingMember && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Thêm thành viên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog open={showRemoveMemberDialog} onOpenChange={setShowRemoveMemberDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa thành viên?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa &quot;{selectedMemberToRemove?.user_id?.profile?.full_name || selectedMemberToRemove?.user_id?.email}&quot; khỏi câu lạc bộ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovingMember}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              disabled={isRemovingMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemovingMember && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa thành viên
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
