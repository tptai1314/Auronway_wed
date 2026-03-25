"use client"

import type { Event } from "@/lib/api"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  QrCode,
  Users,
} from "lucide-react"
import Link from "next/link"

interface EventTableProps {
  events: Event[]
  onDelete?: (id: string) => void
}

const getStatusBadge = (status?: string) => {
  switch (status) {
    case "APPROVED":
      return (
        <Badge className="bg-accent/20 text-accent hover:bg-accent/30">
          Đã duyệt
        </Badge>
      )
    case "DRAFT":
      return <Badge variant="secondary">Bản nháp</Badge>
    case "CANCELLED":
      return <Badge variant="destructive">Đã hủy</Badge>
    default:
      return <Badge variant="secondary">{status || "Chưa xác định"}</Badge>
  }
}

const getTypeBadge = (type: string) => {
  const typeMap: Record<string, { label: string; color: string }> = {
    WORKSHOP: { label: "Workshop", color: "bg-chart-1/20 text-chart-1" },
    COMPETITION: { label: "Cuộc thi", color: "bg-chart-2/20 text-chart-2" },
    SEMINAR: { label: "Seminar", color: "bg-chart-3/20 text-chart-3" },
    VOLUNTEER: { label: "Tình nguyện", color: "bg-chart-4/20 text-chart-4" },
    TRAINING: { label: "Đào tạo", color: "bg-chart-5/20 text-chart-5" },
  }
  const config = typeMap[type] || { label: type, color: "" }
  return (
    <Badge variant="outline" className={config.color}>
      {config.label}
    </Badge>
  )
}

const getModeBadge = (mode: string) => {
  const modeMap: Record<string, string> = {
    OFFLINE: "Trực tiếp",
    ONLINE: "Trực tuyến",
    HYBRID: "Kết hợp",
  }
  return (
    <span className="text-sm text-muted-foreground">
      {modeMap[mode] || mode}
    </span>
  )
}

export function EventTable({ events, onDelete }: EventTableProps) {
  const getOrganizerName = (organizer: any) => {
    if (!organizer) return "Chưa xác định"
    if (typeof organizer === 'string') return "Đang tải..."
    return organizer.name || "Chưa xác định"
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[300px]">Sự kiện</TableHead>
            <TableHead>Tổ chức</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Hình thức</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead className="text-center">Đăng ký</TableHead>
            <TableHead className="text-center">Tham dự</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event._id} className="hover:bg-secondary/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  {event.cover_image_url ? (
                    <img 
                      src={event.cover_image_url} 
                      alt={event.title}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-primary/10">
                      <QrCode className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {event.title}
                    </span>
                    {event.location && (
                      <span className="text-sm text-muted-foreground">
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {getOrganizerName(event.organizer_id)}
                </span>
              </TableCell>
              <TableCell>{getTypeBadge(event.type)}</TableCell>
              <TableCell>{getModeBadge(event.mode)}</TableCell>
              <TableCell>
                <div className="flex flex-col text-sm">
                  <span>
                    {new Date(event.start_at).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(event.start_at).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className="font-medium">{event.registered_count}</span>
              </TableCell>
              <TableCell className="text-center">
                <span className="font-medium">{event.attended_count}</span>
              </TableCell>
              <TableCell>{getStatusBadge(event.status)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/events/${event._id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/events/${event._id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/participants?event=${event._id}`}>
                        <Users className="mr-2 h-4 w-4" />
                        Người tham gia
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/checkin?event=${event._id}`}>
                        <QrCode className="mr-2 h-4 w-4" />
                        QR Check-in
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete?.(event._id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa sự kiện
                    </DropdownMenuItem>
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
