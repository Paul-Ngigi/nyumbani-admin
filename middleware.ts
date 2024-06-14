export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/agents",
    "/apartments",
    "/complaints",
    "/dashboard",
    "/inquiries",
    "/leave-notices",
    "/notifications",
    "/repairs",
    "/roles-permissions",
    "/users", 
  ],
};
