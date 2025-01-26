"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"

import SmoothScroll from "@/components/SmoothScroll"
import LandingPage from "@/components/LandingPage"
import CarCarousel from "@/components/CarCarousel"
import AboutSection from "@/components/MissionStatement"
import DetailsComponent from "@/components/Details"
import FooterComponent from "@/components/Footer"
import FixedHeader from "@/components/headers/FixedHeader"
import Gradient from "/public/gradient.svg"
import PurpleBallsAnimation from "@/components/PurpleBallsAnimation"

export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen relative overflow-hidden font-poppins">
        {/* Background color layer */}
        <div className="fixed inset-0 z-0 bg-[#1C1C1C]"></div>
        <div className="fixed inset-0 z-1 opacity-20">
          <PurpleBallsAnimation />
        </div>
        <div className="fixed inset-0 z-19 opacity-40">
          <PurpleBallsAnimation />
        </div>
        <div className="fixed inset-0 z-1 opacity-5">
          <PurpleBallsAnimation />
        </div>
        
        {/* Gradient layer */}
        <div className="fixed inset-0 z-10">
          <Image
            src={Gradient || "/placeholder.svg"}
            alt="Gradient"
            layout="fill"
            objectFit="cover"
            className="opacity-75"
            priority
          />
        </div>

        {/* Content layer */}
        <div className="relative z-20">
          <FixedHeader />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <LandingPage />
          </motion.div>
        </div>
        <div className="relative z-30">
          <CarCarousel />
          <AboutSection />
          <DetailsComponent />
          <FooterComponent />
          </div>
      </div>
    </SmoothScroll>
  )
}

