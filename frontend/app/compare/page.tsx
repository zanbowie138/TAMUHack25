"use client"
import React from "react"
import BlockHeader from "@/components/headers/BlockHeader"
import SelectorGroup from "./components/SelectorGroup"
import FooterComponent from "@/components/Footer"
import SmoothScroll from "@/components/SmoothScroll"
export default function Compare() {
  return (
    <SmoothScroll>
      <main className="min-h-screen relative overflow-hidden font-inter">
        <div className="fixed inset-0 h-full z-0">
          <img src="/gradient.svg" alt="Gradient" className="object-cover w-full h-full backdrop-opacity-1" />
        </div>
        <BlockHeader />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <SelectorGroup />
        </div>
        <FooterComponent />
      </main>
    </SmoothScroll>
  )
}

