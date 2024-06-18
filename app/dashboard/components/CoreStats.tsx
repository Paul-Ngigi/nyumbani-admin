import CurrencyFormatter from "@/components/shared/CurrencyFormatter";
import SwiperCustom from "@/components/shared/swiper/swiper";
import { BsTruck } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { MdApartment, MdOutlinePayment } from "react-icons/md";
import { RiAuctionLine } from "react-icons/ri";
import { SwiperSlide } from "swiper/react";

export default function CoreStats() {
  const revenue: number = 0;
  const apartments: number = 0;
  const tenants: number = 0;
  const houseManagers: number = 0;
  const agents: number = 2;
  return (
    <div className="max-w-screen overflow-hidden">
      <SwiperCustom>
        <SwiperSlide key="1" className="mb-8">
          <div className="border rounded px-3 py-2 w-48 shadow-md">
            <div className="flex items-center justify-center bg-[#f3d5b5] w-8 h-8 rounded-full mb-1">
              <MdOutlinePayment />
            </div>
            <div className="text-[#8b8c89] mb-1">Total Revenue</div>
            <div className="text-base font-medium">
              <CurrencyFormatter value={revenue} />
            </div>
          </div>
        </SwiperSlide>{" "}
        <SwiperSlide key="2" className="mb-8">
          <div className="border rounded px-3 py-2 w-48 shadow-md">
            <div className="flex items-center justify-center bg-[#ffc8dd] w-8 h-8 rounded-full mb-1">
              <MdApartment />
            </div>
            <div className="text-[#8b8c89] mb-1">Apartments</div>
            <div className="text-base font-medium">{apartments}</div>
          </div>
        </SwiperSlide>{" "}
        <SwiperSlide key="3" className="mb-8">
          <div className="border rounded px-3 py-2 w-48 shadow-md">
            <div className="flex items-center justify-center bg-[#bfd7ea] w-8 h-8 rounded-full mb-1">
              <FiUsers />
            </div>
            <div className="text-[#8b8c89] mb-1">Agents</div>
            <div className="text-base font-medium">{agents}</div>
          </div>
        </SwiperSlide>{" "}
        <SwiperSlide key="4" className="mb-8">
          <div className="border rounded px-3 py-2 w-48 shadow-md">
            <div className="flex items-center justify-center bg-[#a2d2ff] w-8 h-8 rounded-full mb-1">
              <FiUsers />
            </div>
            <div className="text-[#8b8c89] mb-1">House Managers</div>
            <div className="text-base font-medium">{houseManagers}</div>
          </div>
        </SwiperSlide>{" "}
        <SwiperSlide key="5" className="mb-8">
          <div className="border rounded px-3 py-2 w-48 shadow-md">
            <div className="flex items-center justify-center bg-[#dda15e] w-8 h-8 rounded-full mb-1">
              <FiUsers />
            </div>
            <div className="text-[#8b8c89] mb-1">Tenants</div>
            <div className="text-base font-medium">{tenants}</div>
          </div>
        </SwiperSlide>{" "}
      </SwiperCustom>
    </div>
  );
}
