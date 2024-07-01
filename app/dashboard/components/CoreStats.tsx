import CurrencyFormatter from "@/components/shared/CurrencyFormatter";
import { useState } from "react";
import { FiUsers } from "react-icons/fi";
import { MdApartment, MdOutlinePayment } from "react-icons/md";

export default function CoreStats() {
  const [organisations, setOrganisations] = useState<number>(0);
  const [users, setUsers] = useState<number>(0);
  const [superadmins, setSuperAdmins] = useState<number>(0);
  const [admins, setAdmins] = useState<number>(0);

  return (
    <div className="grid grid-cols-3 lg:grid-cols-4">
      <div className="border rounded px-3 py-2 w-48 shadow-md">
        <div className="flex items-center justify-center bg-[#f3d5b5] w-8 h-8 rounded-full mb-1">
          <MdOutlinePayment />
        </div>
        <div className="text-[#8b8c89] mb-1">Organisations</div>
        <div className="text-base font-medium">{organisations}</div>
      </div>

      <div className="border rounded px-3 py-2 w-48 shadow-md">
        <div className="flex items-center justify-center bg-[#ffc8dd] w-8 h-8 rounded-full mb-1">
          <MdApartment />
        </div>
        <div className="text-[#8b8c89] mb-1">Apartments</div>
        <div className="text-base font-medium">{users}</div>
      </div>

      <div className="border rounded px-3 py-2 w-48 shadow-md">
        <div className="flex items-center justify-center bg-[#bfd7ea] w-8 h-8 rounded-full mb-1">
          <FiUsers />
        </div>
        <div className="text-[#8b8c89] mb-1">Agents</div>
        <div className="text-base font-medium">{superadmins}</div>
      </div>

      <div className="border rounded px-3 py-2 w-48 shadow-md">
        <div className="flex items-center justify-center bg-[#a2d2ff] w-8 h-8 rounded-full mb-1">
          <FiUsers />
        </div>
        <div className="text-[#8b8c89] mb-1">House Managers</div>
        <div className="text-base font-medium">{admins}</div>
      </div>
    </div>
  );
}
