import { BsExclamationOctagon } from "react-icons/bs";
import { CgOrganisation } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import { GiAutoRepair, GiAwareness } from "react-icons/gi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdApartment, MdOutlinePayment } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { SlQuestion } from "react-icons/sl";
import { SideNavItem } from "./types";
import { AppEnums } from "./enums/app.enum";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: <RxDashboard />,
    roles: [AppEnums.RoleSuperAdmin, AppEnums.RoleAdmin, AppEnums.RoleAgent],
  },
  {
    title: "Organisations",
    path: "/organisations",
    icon: <CgOrganisation />,
    roles: [AppEnums.RoleSuperAdmin],
  },
  {
    title: "Users",
    path: "/users",
    icon: <FaUsers />,
    roles: [AppEnums.RoleSuperAdmin, AppEnums.RoleAdmin, AppEnums.RoleAgent],
  },
  {
    title: "Apartments",
    path: "/apartments",
    icon: <MdApartment />,
    roles: [AppEnums.RoleSuperAdmin, AppEnums.RoleAdmin, AppEnums.RoleAgent],
  },
  {
    title: "Inquiries",
    path: "/inquiries",
    icon: <SlQuestion />,
    roles: [AppEnums.RoleSuperAdmin, AppEnums.RoleAdmin, AppEnums.RoleAgent],
  },
  {
    title: "Complaints",
    path: "/complaints",
    icon: <BsExclamationOctagon />,
    roles: [AppEnums.RoleSuperAdmin, AppEnums.RoleAdmin, AppEnums.RoleAgent],
  },
  {
    title: "Leave Notices",
    path: "/leave-notices",
    icon: <GiAwareness />,
    roles: [AppEnums.RoleSuperAdmin, AppEnums.RoleAdmin, AppEnums.RoleAgent],
  },
  {
    title: "Repairs",
    path: "/repairs",
    icon: <GiAutoRepair />,
    roles: [AppEnums.RoleSuperAdmin, AppEnums.RoleAdmin, AppEnums.RoleAgent],
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: <IoIosNotificationsOutline />,
    roles: [AppEnums.RoleSuperAdmin, AppEnums.RoleAdmin, AppEnums.RoleAgent],
  },
  {
    title: "Transactions",
    path: "/transactions",
    icon: <MdOutlinePayment />,
    submenu: true,
    subMenuItems: [
      { title: "Summary", path: "/transactions/summary" },
      { title: "Mobile", path: "/transactions/mobile" },
      { title: "Card", path: "/transactions/card" },
    ],
    roles: [AppEnums.RoleSuperAdmin, AppEnums.RoleAdmin, AppEnums.RoleAgent],
  },
  // {
  //   title: "User Manual",
  //   path: "/user-manual",
  //   icon: <IoBook />,
  //   roles: ['admin', 'superadmin', 'agent', 'caretaker']
  // },
];
