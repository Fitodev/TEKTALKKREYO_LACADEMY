export type Role = "student" | "editor" | "admin";
export type Capability = "learn" | "edit" | "publish" | "manage_users";
export function can(
  role: string | null | undefined,
  capability: Capability,
  aal: string | null = null,
): boolean {
  if (capability === "learn")
    return ["student", "editor", "admin"].includes(role ?? "");
  if (capability === "edit" && role === "editor") return true;
  return role === "admin" && aal === "aal2";
}
