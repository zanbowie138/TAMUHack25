import React from "react";

import SmoothScroll from "@/components/SmoothScroll";
import LandingPage from "@/components/LandingPage";
import CarCarousel from "@/components/CarCarousel";

export default function Home() {
  return (
    <SmoothScroll>
      <div>
        <div className="h-screen">
          {/*The Navbar for the Home Page is IN the landing page component */}
          <LandingPage />
          <CarCarousel />
        </div>
      </div>
    </SmoothScroll>
  );
}
