"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Building2, Users, Lock, Globe, ExternalLink, Plus } from "lucide-react"
import { getOrganizers, type Organizer } from "@/lib/api"
import Link from "next/link"
import { isTenantAdmin } from "@/lib/admin-access"

export default function ClubsPage() {
  const router = useRouter()
  const [clubs, setClubs] = useState<Organizer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Load user info
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }

    loadClubs()
  }, [])

  const loadClubs = async () => {
    setIsLoading(true)
    setError("")

    try {
      console.log('Loading clubs...')
      const result = await getOrganizers()
      console.log('Clubs result:', result.data)

      if (result.success && result.data) {
        // Filter only CLUB type
        const clubList = result.data.filter(org => org.type === 'CLUB')
        console.log('Filtered clubs:', clubList)
        setClubs(clubList)
      } else {
        console.error('Error loading clubs:', result.error)
        setError(result.error || "Không thể tải danh sách câu lạc bộ")
      }
    } catch (err) {
      console.error('Exception loading clubs:', err)
      setError("Đã có lỗi xảy ra khi tải dữ liệu")
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'CLUB': 'Câu lạc bộ',
      'DEPARTMENT': 'Phòng ban',
      'EXTERNAL': 'Bên ngoài'
    }
    return labels[type] || type
  }

  const tenantAdmin = isTenantAdmin(user)
  const filteredClubs = clubs

  if (isLoading) {
    return (
      <div>
        <AdminHeader title="Câu lạc bộ" description="Quản lý các câu lạc bộ trong hệ thống" />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminHeader 
        title="Câu lạc bộ" 
        description="Quản lý các câu lạc bộ trong tenant" 
      />

      <div className="p-8 space-y-6">
        {/* Create Button for Campus Admin */}
        {tenantAdmin && (
          <div className="flex justify-end">
                    {!tenantAdmin && (
                      <Alert>
                        <AlertDescription>
                          Chức năng quản lý câu lạc bộ chỉ dành cho Tenant Admin.
                        </AlertDescription>
                      </Alert>
                    )}

            <Button asChild>
              <Link href="/admin/clubs/new">
                <Plus className="h-4 w-4 mr-2" />
                Tạo câu lạc bộ mới
              </Link>
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng câu lạc bộ</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredClubs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
              <Building2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredClubs.filter(c => c.is_active).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Riêng tư</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredClubs.filter(c => c.is_private).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Club List */}
        {tenantAdmin && filteredClubs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Chưa có câu lạc bộ nào
              </p>
            </CardContent>
          </Card>
        ) : tenantAdmin ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClubs.map((club) => (
              <Card key={club._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {club.logo_url ? (
                        <img 
                          src={club.logo_url} 
                          alt={club.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{club.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={club.is_active ? "default" : "secondary"} className="text-xs">
                            {club.is_active ? "Hoạt động" : "Tạm dừng"}
                          </Badge>
                          {club.is_private && (
                            <Badge variant="outline" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              Riêng tư
                            </Badge>
                          )}
                          {!club.is_private && (
                            <Badge variant="outline" className="text-xs">
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
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {club.description}
                    </p>
                  )}

                  {club.contact?.email && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Email:</span> {club.contact.email}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/admin/clubs/${club._id}`}>
                        <Users className="h-4 w-4 mr-2" />
                        Xem thành viên
                      </Link>
                    </Button>

                    {club.contact?.website && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a href={club.contact.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
