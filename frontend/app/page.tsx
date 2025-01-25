import React from "react";

import SmoothScroll from "@/components/SmoothScroll";
import LandingPage from "@/components/LandingPage";
export default function Home() {
  return (
    <SmoothScroll>
      <div>
        <div className="h-screen">
          
          <LandingPage />
        </div>
      </div>
    </SmoothScroll>
  );
}
