"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Calendar,
  Users,
  QrCode,
  UserCog,
  Image,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { isTenantAdmin, isTenantClub } from "@/lib/admin-access"

type AdminRole = "TENANT_ADMIN" | "TENANT_CLUB"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["TENANT_ADMIN", "TENANT_CLUB"] as AdminRole[],
  },
  {
    name: "Sự kiện",
    href: "/admin/events",
    icon: Calendar,
    roles: ["TENANT_ADMIN", "TENANT_CLUB"] as AdminRole[],
  },
  {
    name: "Người tham gia",
    href: "/admin/participants",
    icon: Users,
    roles: ["TENANT_ADMIN", "TENANT_CLUB"] as AdminRole[],
  },
  {
    name: "QR Check-in",
    href: "/admin/checkin",
    icon: QrCode,
    roles: ["TENANT_ADMIN", "TENANT_CLUB"] as AdminRole[],
  },
  {
    name: "Người dùng",
    href: "/admin/users",
    icon: UserCog,
    roles: ["TENANT_ADMIN"] as AdminRole[],
  },
  {
    name: "Avatar",
    href: "/admin/avatars",
    icon: Image,
    roles: ["TENANT_ADMIN"] as AdminRole[],
  },
]

const bottomNavigation = [
  {
    name: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  // Check if user has required role for menu item
  const hasRole = (requiredRoles: AdminRole[]) => {
    if (!requiredRoles || requiredRoles.length === 0) return true
    if (!user) return false

    if (requiredRoles.includes("TENANT_ADMIN") && isTenantAdmin(user)) return true
    if (requiredRoles.includes("TENANT_CLUB") && isTenantClub(user)) return true

    return false
  }

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Calendar className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">
              Event Admin
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          if (!hasRole(item.roles)) return null
          
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-border p-2">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
