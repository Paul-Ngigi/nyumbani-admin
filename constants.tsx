import { BsExclamationOctagon } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { GiAutoRepair, GiAwareness } from "react-icons/gi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdApartment, MdOutlinePayment } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { SlQuestion } from "react-icons/sl";
import { SideNavItem } from "./types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: <RxDashboard />,
    roles: ["admin", "superadmin", "agent"],
  },
  {
    title: "Agents",
    path: "/agents",
    icon: <FaUsers />,
    roles: ["admin", "superadmin"],
  },
  {
    title: "Users",
    path: "/users",
    icon: <FaUsers />,
    roles: ["admin", "superadmin", "agent"],
  },
  {
    title: "Apartments",
    path: "/apartments",
    icon: <MdApartment />,
    roles: ["admin", "superadmin", "agent"],
  },
  {
    title: "Inquiries",
    path: "/inquiries",
    icon: <SlQuestion />,
    roles: ["admin", "superadmin", "agent"],
  },
  {
    title: "Complaints",
    path: "/complaints",
    icon: <BsExclamationOctagon />,
    roles: ["admin", "superadmin", "agent"],
  },
  {
    title: "Leave Notices",
    path: "/leave-notices",
    icon: <GiAwareness />,
    roles: ["admin", "superadmin", "agent"],
  },
  {
    title: "Repairs",
    path: "/repairs",
    icon: <GiAutoRepair />,
    roles: ["admin", "superadmin", "agent"],
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: <IoIosNotificationsOutline />,
    roles: ["admin", "superadmin", "agent"],
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
    roles: ["admin", "superadmin", "agent"],
  },
  // {
  //   title: "User Manual",
  //   path: "/user-manual",
  //   icon: <IoBook />,
  //   roles: ['admin', 'superadmin', 'agent', 'caretaker']
  // },
];
