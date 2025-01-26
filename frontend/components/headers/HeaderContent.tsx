import React from "react";
import { ChevronRight } from "lucide-react";

export default function HeaderContent() {
  return (
    <div className="bg-[#232323] rounded-[20px] w-3/5 h-16 flex items-center justify-between px-6">
      <a
        href="/"
        className="bg-[#D9D9D9] rounded-[5px] px-9 py-3 font-medium text-black"
      >
        ToyoFit
      </a>

      <div className="flex space-x-8">
        <span className="text-white">Option 1</span>
        <span className="text-white">Option 2</span>
        <span className="text-white">Option 3</span>
      </div>

      <div className="relative group navbar-contact-button-wrapper">
        <button className="bg-[#D9D9D9] rounded-[5px] px-7 py-3 font-medium text-black flex items-center relative z-10 transition-all duration-300 hover:bg-opacity-80">
          Compare Now
          <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
        <div className="absolute navbar-contact-button-glow"></div>
      </div>
    </div>
  );
}
