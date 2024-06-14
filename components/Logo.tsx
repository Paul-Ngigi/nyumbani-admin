import React from "react";
import { TbHomeHeart } from "react-icons/tb";

export default function Logo() {
  return (
    <div className="flex gap-2 items-center font-bold text-2xl">
      <TbHomeHeart className="text-black dark:text-primary"/>
      <div className="text-primary dark:text-white">NYUMBANI</div>      
    </div>
  );
}
