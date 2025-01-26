"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Gradient2 from "/public/gradient2.svg";

import BlockHeader from "@/components/headers/BlockHeader";
import SelectorGroup from "./components/SelectorGroup";
import FooterComponent from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function Compare() {
  return (
    <SmoothScroll>
      <div className="min-h-screen relative overflow-hidden font-inter bg-[#1C1C1C]">
        {/* Background color layer */}
        <div className="fixed inset-0 z-0 bg-[#1C1C1C]"></div>

        {/* Gradient layer */}
        <div className="fixed inset-0 z-10">
          <Image
            src={Gradient2}
            alt="Gradient"
            layout="fill"
            objectFit="cover"
            className="opacity-50"
            priority
          />
        </div>

        {/* Content layer */}
        <div className="relative z-20">
          <BlockHeader />

          <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<div>Loading...</div>}>
            <SelectorGroup />
            </Suspense>
          </main>

          <FooterComponent />
        </div>
      </div>
    </SmoothScroll>
  );
}
