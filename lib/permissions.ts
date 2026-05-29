type Role = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER" | string;

export function isOwner(role?: Role | null) {
  return role === "OWNER";
}

export function isAdmin(role?: Role | null) {
  return role === "OWNER" || role === "ADMIN";
}

export function canManageUsers(role?: Role | null) {
  return role === "OWNER" || role === "ADMIN";
}

export function canManageSupport(role?: Role | null) {
  return role === "OWNER" || role === "ADMIN";
}

export function canManageSystem(role?: Role | null) {
  return role === "OWNER";
}

export function canViewAdmin(role?: Role | null) {
  return role === "OWNER" || role === "ADMIN";
}