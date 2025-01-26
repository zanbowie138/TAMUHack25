"use client";

import React, { useState } from "react";

import SmoothScroll from "@/components/SmoothScroll";
import LandingPage from "@/components/LandingPage";
import CarCarousel from "@/components/CarCarousel";
import AboutSection from "@/components/MissionStatement";
import DetailsComponent from "@/components/Details";
import FooterComponent from "@/components/Footer";
export default function Home() {

  return (
    <SmoothScroll>
      <div>
        <div>
          {/*The Navbar for the Home Page is IN the landing page component */}
          <LandingPage />
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
