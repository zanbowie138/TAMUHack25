"use client";
import React from "react";
import BlockHeader from "@/components/headers/BlockHeader"
import SelectorGroup from "./components/SelectorGroup";
import FooterComponent
 from "@/components/Footer";
export default function Compare() {
  return (
    <main className="min-h-screen relative overflow-hidden font-poppins">
      <div className="fixed inset-0 h-full z-0">
        <img
          src="/gradient.svg"
          alt="Gradient"
          className="object-cover w-full h-full backdrop-opacity-1"
        />
      </div>
      <BlockHeader />
      <div className="relative z-10">
        
        <div className="w-full items-center justify-center text-center align-center h-20 mt-30 mb-20 text-7xl text-slate-100">
          Discover and Compare
        </div>
        <SelectorGroup />
        <FooterComponent />
      </div>
    </main>
  );
}
