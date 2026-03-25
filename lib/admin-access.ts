export interface AdminUserLike {
  roles?: string[]
  permissions?: {
    canAccessAdmin?: boolean
    isOrganizerManager?: boolean
  }
  affiliations?: Array<{
    organizer_id?: string
    role?: string
  }>
}

const CLUB_AFFILIATION_ROLES = new Set(["CLUB_ADMIN", "EVENT_MANAGER"])

export function isTenantAdmin(user: AdminUserLike | null | undefined): boolean {
  return !!user?.roles?.includes("TENANT_ADMIN")
}

export function getTenantClubOrganizerIds(user: AdminUserLike | null | undefined): string[] {
  if (!user?.affiliations?.length) return []

  return user.affiliations
    .filter((aff) => aff.organizer_id && aff.role && CLUB_AFFILIATION_ROLES.has(aff.role))
    .map((aff) => aff.organizer_id as string)
}

export function isTenantClub(user: AdminUserLike | null | undefined): boolean {
  if (user?.roles?.includes("TENANT_CLUB")) return true
  return getTenantClubOrganizerIds(user).length > 0
}

export function canAccessWebAdmin(user: AdminUserLike | null | undefined): boolean {
  return isTenantAdmin(user) || isTenantClub(user)
}

export function getPrimaryTenantClubOrganizerId(user: AdminUserLike | null | undefined): string | null {
  const ids = getTenantClubOrganizerIds(user)
  return ids.length > 0 ? ids[0] : null
}

export function canManageEventByOrganizerId(
  user: AdminUserLike | null | undefined,
  organizerId: string | null | undefined
): boolean {
  if (!organizerId) return false
  if (isTenantAdmin(user)) return true
  return getTenantClubOrganizerIds(user).includes(organizerId)
}

export function canManageEvent(
  user: AdminUserLike | null | undefined,
  event:
    | {
        organizer_id?: string | { _id?: string }
      }
    | null
    | undefined
): boolean {
  if (!event) return false

  const organizerId =
    typeof event.organizer_id === "string"
      ? event.organizer_id
      : event.organizer_id?._id

  return canManageEventByOrganizerId(user, organizerId)
}
