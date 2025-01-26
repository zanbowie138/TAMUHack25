"use client";
import React from "react";
import CarSelector from "./components/CarSelector";
import Navbar from "@/components/Header";
import Image from "next/image";
import SelectorGroup from "./components/SelectorGroup";

export default function Compare() {
  return (
    <main className="min-h-screen relative overflow-hidden font-poppins">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-0">
        <Image
          src="/gradient.svg"
          alt="Gradient"
          width={1600} 
          height={800} 
          className="opacity-50 blur-none"
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="w-full items-center justify-center text-center align-center h-20 mt-30 mb-20 text-7xl text-slate-100">
          Compare
        </div>
        <SelectorGroup />
      </div>
    </main>
  );
}
