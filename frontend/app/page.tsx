import React from "react";

import SmoothScroll from "@/components/SmoothScroll";
import LandingPage from "@/components/LandingPage";
import CarCarousel from "@/components/CarCarousel";
import AboutSection from "@/components/MissionStatement";

export default function Home() {
  return (
    <SmoothScroll>
      <div>
        <div>
          {/*The Navbar for the Home Page is IN the landing page component */}
          <LandingPage />
          <CarCarousel />
          <AboutSection />
        </div>
      </div>
    </SmoothScroll>
  );
}
