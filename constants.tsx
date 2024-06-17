import { BsExclamationOctagon } from "react-icons/bs";
import { CgOrganisation } from "react-icons/cg";
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
    roles: ["SUPER_ADMIN", "ADMIN", "agent"],
  },
  {
    title: "Organisations",
    path: "/organisations",
    icon: <CgOrganisation />,
    roles: ["SUPER_ADMIN"],
  },
  {
    title: "Users",
    path: "/users",
    icon: <FaUsers />,
    roles: ["SUPER_ADMIN", "ADMIN", "agent"],
  },
  {
    title: "Apartments",
    path: "/apartments",
    icon: <MdApartment />,
    roles: ["SUPER_ADMIN", "ADMIN", "agent"],
  },
  {
    title: "Inquiries",
    path: "/inquiries",
    icon: <SlQuestion />,
    roles: ["SUPER_ADMIN", "ADMIN", "agent"],
  },
  {
    title: "Complaints",
    path: "/complaints",
    icon: <BsExclamationOctagon />,
    roles: ["SUPER_ADMIN", "ADMIN", "agent"],
  },
  {
    title: "Leave Notices",
    path: "/leave-notices",
    icon: <GiAwareness />,
    roles: ["SUPER_ADMIN", "ADMIN", "agent"],
  },
  {
    title: "Repairs",
    path: "/repairs",
    icon: <GiAutoRepair />,
    roles: ["SUPER_ADMIN", "ADMIN", "agent"],
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: <IoIosNotificationsOutline />,
    roles: ["SUPER_ADMIN", "ADMIN", "agent"],
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
    roles: ["SUPER_ADMIN", "ADMIN", "agent"],
  },
  // {
  //   title: "User Manual",
  //   path: "/user-manual",
  //   icon: <IoBook />,
  //   roles: ['admin', 'superadmin', 'agent', 'caretaker']
  // },
];
