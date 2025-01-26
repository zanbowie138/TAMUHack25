"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

import SmoothScroll from "@/components/SmoothScroll";
import LandingPage from "@/components/LandingPage";
import CarCarousel from "@/components/CarCarousel";
import AboutSection from "@/components/MissionStatement";
import DetailsComponent from "@/components/Details";
import FooterComponent from "@/components/Footer";
import FixedHeader from "@/components/headers/FixedHeader"

export default function Home() {

  return (
    <SmoothScroll>
      <div>
        <div>
          <FixedHeader />
          {/*The Navbar for the Home Page is IN the landing page component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          >
            <LandingPage />
          </motion.div>
          <CarCarousel />
          <AboutSection />
          <DetailsComponent />
          <FooterComponent />
        </div>
        </div>
      <div className="relative"> 
    
        
      </div>
    </SmoothScroll>
  );
}
