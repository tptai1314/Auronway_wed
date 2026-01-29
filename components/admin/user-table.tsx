"use client"

import type { User } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Ban, CheckCircle } from "lucide-react"

interface UserTableProps {
  users: User[]
  onEdit?: (user: User) => void
  onToggleStatus?: (user: User) => void
}

const getStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return (
      <Badge className="bg-accent/20 text-accent hover:bg-accent/30">
        Hoạt động
      </Badge>
    )
  }
  return <Badge variant="destructive">Đã khóa</Badge>
}

const getRoleBadge = (roles: string[]) => {
  if (roles?.includes("SUPER_ADMIN")) {
    return (
      <Badge variant="outline" className="bg-chart-1/20 text-chart-1">
        Super Admin
      </Badge>
    )
  }
  if (roles?.includes("TENANT_ADMIN")) {
    return (
      <Badge variant="outline" className="bg-chart-2/20 text-chart-2">
        Tenant Admin
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="bg-chart-3/20 text-chart-3">
      Người dùng
    </Badge>
  )
}

export function UserTable({ users, onEdit, onToggleStatus }: UserTableProps) {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[250px]">Người dùng</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>XP / Level</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id} className="hover:bg-secondary/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user.profile?.avatar_url || "/placeholder.svg"}
                      alt={user.profile?.full_name || user.email}
                    />
                    <AvatarFallback>
                      {(user.profile?.full_name || user.email).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">
                    {user.profile?.full_name || "Chưa cập nhật"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>{getRoleBadge(user.roles)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {user.stats?.total_xp || 0} XP / Lv.{user.stats?.level || 1}
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </TableCell>
              <TableCell>{getStatusBadge(user.is_active)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(user)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.is_active ? (
                      <DropdownMenuItem
                        onClick={() => onToggleStatus?.(user)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Khóa tài khoản
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onToggleStatus?.(user)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mở khóa
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
