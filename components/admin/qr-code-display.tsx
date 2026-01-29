"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Copy, RefreshCw } from "lucide-react"

interface QRCodeDisplayProps {
  value: string
  title: string
  subtitle?: string
  size?: number
  onRefresh?: () => void
}

export function QRCodeDisplay({
  value,
  title,
  subtitle,
  size = 256,
  onRefresh,
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current || !value) return

      // Using QR code generation via canvas
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas size
      canvas.width = size
      canvas.height = size

      // Create QR code pattern (simplified visual representation)
      const moduleCount = 25
      const moduleSize = size / moduleCount

      // Background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, size, size)

      // Generate simple QR pattern based on value hash
      const hash = value.split("").reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc)
      }, 0)

      ctx.fillStyle = "#000000"

      // Draw position patterns (corners)
      const drawPositionPattern = (x: number, y: number) => {
        // Outer square
        ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize)
        ctx.fillStyle = "#ffffff"
        ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize)
        ctx.fillStyle = "#000000"
        ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize)
      }

      drawPositionPattern(0, 0)
      drawPositionPattern(moduleCount - 7, 0)
      drawPositionPattern(0, moduleCount - 7)

      // Draw data pattern
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          // Skip position patterns
          if (
            (row < 8 && col < 8) ||
            (row < 8 && col > moduleCount - 9) ||
            (row > moduleCount - 9 && col < 8)
          ) {
            continue
          }

          // Generate pseudo-random pattern based on position and hash
          const seed = hash + row * moduleCount + col
          if (seed % 3 === 0 || seed % 7 === 0) {
            ctx.fillRect(
              col * moduleSize,
              row * moduleSize,
              moduleSize,
              moduleSize
            )
          }
        }
      }

      // Draw timing patterns
      for (let i = 8; i < moduleCount - 8; i++) {
        if (i % 2 === 0) {
          ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize)
          ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize)
        }
      }
    }

    generateQR()
  }, [value, size])

  const downloadQR = () => {
    if (!canvasRef.current) return
    const url = canvasRef.current.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = `qr-${value}.png`
    link.href = url
    link.click()
  }

  const copyToClipboard = async () => {
    if (!canvasRef.current) return
    canvasRef.current.toBlob(async (blob) => {
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ])
      }
    })
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-lg bg-white p-4">
            <canvas ref={canvasRef} className="h-64 w-64" />
          </div>
          <p className="font-mono text-sm text-muted-foreground">{value}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadQR}>
              <Download className="mr-2 h-4 w-4" />
              Tải xuống
            </Button>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              Sao chép
            </Button>
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Làm mới
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
