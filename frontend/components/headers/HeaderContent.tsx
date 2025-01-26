import React from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const links = [
  { name: "Home", path: "/" },
  { name: "Explore", path: "/explore" },
  { name: "Placeholder", path: "/compare" }
];

export default function HeaderContent() {
  const router = useRouter();

  return (
    <div className="bg-transparent backdrop-blur-md rounded-[20px] w-3/5 h-16 flex items-center justify-between px-6 shadow-lg">
      <Link
        href="/"
        className="bg-[#D9D9D9] rounded-[5px] px-9 py-3 font-bold text-black"
      >
        Kaizen
      </Link>

      <div className="flex space-x-8">
        {links.map((link) => (
          <Link key={link.path} href={link.path} className="text-white">{link.name}</Link>
        ))}
      </div>

      <div className="relative group navbar-contact-button-wrapper">
        <button className="bg-[#D9D9D9] rounded-[5px] px-7 py-3 font-medium text-black flex items-center relative z-10 transition-all duration-300 hover:bg-opacity-80"
        onClick={() => router.push('/compare')}>
          Compare Now
          <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
        <div className="absolute navbar-contact-button-glow"></div>
      </div>
    </div>
  );
}
