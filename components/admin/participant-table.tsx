"use client"

import type { Participant } from "@/lib/types"
import { mockEvents } from "@/lib/mock-data"
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
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, UserCheck, UserX, Mail } from "lucide-react"

interface ParticipantTableProps {
  participants: Participant[]
  onCheckIn?: (id: string) => void
  onCancel?: (id: string) => void
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "CHECKED_IN":
      return (
        <Badge className="bg-accent/20 text-accent hover:bg-accent/30">
          Đã check-in
        </Badge>
      )
    case "REGISTERED":
      return <Badge variant="secondary">Đã đăng ký</Badge>
    case "CANCELLED":
      return <Badge variant="destructive">Đã hủy</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function ParticipantTable({
  participants,
  onCheckIn,
  onCancel,
}: ParticipantTableProps) {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[250px]">Người tham gia</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Sự kiện</TableHead>
            <TableHead>Ngày đăng ký</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => {
            const event = mockEvents.find(
              (e) => e._id === participant.event_id
            )
            return (
              <TableRow
                key={participant._id}
                className="hover:bg-secondary/50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={participant.user_avatar || "/placeholder.svg"}
                        alt={participant.user_name}
                      />
                      <AvatarFallback>
                        {participant.user_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">
                      {participant.user_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {participant.user_email}
                </TableCell>
                <TableCell>
                  <span className="text-sm">{event?.title || "N/A"}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {new Date(participant.registered_at).toLocaleDateString(
                      "vi-VN"
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  {participant.checked_in_at ? (
                    <span className="text-sm text-muted-foreground">
                      {new Date(participant.checked_in_at).toLocaleString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                        }
                      )}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(participant.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {participant.status === "REGISTERED" && (
                        <DropdownMenuItem
                          onClick={() => onCheckIn?.(participant._id)}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Check-in
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Gửi email
                      </DropdownMenuItem>
                      {participant.status !== "CANCELLED" && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onCancel?.(participant._id)}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Hủy đăng ký
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
