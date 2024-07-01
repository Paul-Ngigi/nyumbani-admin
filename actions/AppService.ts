import { IRole } from "@/interfaces/user.interface";
import { useSession } from "next-auth/react";

export const getTrueRoles = (userRoles: any[]): string[] => {
  const trueRoles = userRoles
    .filter((role) => Object.values(role)[0] === true)
    .map((role) => Object.keys(role)[0]);

  return trueRoles;
};

export function isSuperAdmin(roles: IRole[]): boolean {
  return roles.some((role) => role.superadmin === true);
}

export function isAdmin(roles: IRole[]): boolean {
  return roles.some((role) => role.admin === true);
}

export function isAgent(roles: IRole[]): boolean {
  return roles.some((role) => role.agent === true);
}

export function isClient(roles: IRole[]): boolean {
  return roles.some((role) => role.client === true);
}

export function currentUser() {
  const { data: session } = useSession();
  return session?.user;
}

export function currentUserRoles() {  
  const { data: session } = useSession();
  return session?.roles;
}

export function currentUserOrganisationID() {  
  const { data: session } = useSession();
  return session?.organisationID;
}