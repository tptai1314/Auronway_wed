"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"

interface EventFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  typeFilter: string
  onTypeChange: (value: string) => void
}

export function EventFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
}: EventFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm sự kiện..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-secondary pl-9"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full bg-secondary sm:w-40">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="APPROVED">Đã duyệt</SelectItem>
          <SelectItem value="DRAFT">Bản nháp</SelectItem>
          <SelectItem value="CANCELLED">Đã hủy</SelectItem>
        </SelectContent>
      </Select>

      <Select value={typeFilter} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full bg-secondary sm:w-40">
          <SelectValue placeholder="Loại sự kiện" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="WORKSHOP">Workshop</SelectItem>
          <SelectItem value="COMPETITION">Cuộc thi</SelectItem>
          <SelectItem value="SEMINAR">Seminar</SelectItem>
          <SelectItem value="VOLUNTEER">Tình nguyện</SelectItem>
          <SelectItem value="TRAINING">Đào tạo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
