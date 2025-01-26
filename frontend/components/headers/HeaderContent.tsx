'use client'
import React from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = [
  { name: "About", path: "/#about" },
  { name: "Explore", path: "/explore" },
  { name: "Compare", path: "/compare" }
];

export default function HeaderContent() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="bg-transparent backdrop-blur-md rounded-[20px] w-3/5 h-16 flex items-center justify-between px-4 shadow-lg">
      <Link
        href="/"
        className={`rounded-[5px] px-3 py-1 font-bold text-white text-2xl italic transition-colors duration-300`}
      >
        Kaizen
      </Link>

      <div className="flex space-x-3">
        {links.map((link, index) => (
          <Link 
            key={index} 
            href={link.path}
            className={`px-3 py-2 rounded-[5px] transition-colors duration-400 ${pathname === link.path ? 'bg-white text-black' : 'hover:bg-[#333333] text-white'}`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="relative group navbar-contact-button-wrapper">
        <Link
          href="/compare"
          className="bg-[#D9D9D9] rounded-[5px] px-7 py-3 font-medium text-black flex items-center relative z-10 transition-all duration-300 hover:bg-opacity-80"
        >
          Compare Now
          <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <div className="absolute navbar-contact-button-glow"></div>
      </div>
    </div>
  );
}