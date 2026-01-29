"use client"

import React from "react"

import { useState } from "react"
import type { Event } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CheckInSessionFormProps {
  events: Event[]
  onCreateSession: (data: {
    event_id: string
    start_time: string
    end_time: string
  }) => void
}

export function CheckInSessionForm({
  events,
  onCreateSession,
}: CheckInSessionFormProps) {
  const [selectedEvent, setSelectedEvent] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const approvedEvents = events.filter((e) => e.status === "APPROVED")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedEvent && startTime && endTime) {
      onCreateSession({
        event_id: selectedEvent,
        start_time: startTime,
        end_time: endTime,
      })
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Tạo phiên check-in mới</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Chọn sự kiện</Label>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="bg-secondary">
                <SelectValue placeholder="Chọn sự kiện đã duyệt" />
              </SelectTrigger>
              <SelectContent>
                {approvedEvents.map((event) => (
                  <SelectItem key={event._id} value={event._id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_time">Bắt đầu check-in</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-secondary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">Kết thúc check-in</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-secondary"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedEvent || !startTime || !endTime}
          >
            Tạo phiên check-in
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
