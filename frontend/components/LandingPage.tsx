import React from "react";
import { ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden font-poppins">
      <div className="fixed inset-0 h-90 z-0">
        <img
          src="/gradient.svg"
          alt="Gradient"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Navbar */}
      <nav className="sticky top-8 z-50 flex justify-center w-full bg-transparent">
        <div className="bg-[#232323] rounded-[20px] w-3/5 h-16 flex items-center justify-between px-6">
          <a href="/" className="bg-[#D9D9D9] rounded-[5px] px-9 py-3 font-medium text-black">
            ToyoFit
          </a>

          <div className="flex space-x-8">
            <span className="text-white">Option 1</span>
            <span className="text-white">Option 2</span>
            <span className="text-white">Option 3</span>
          </div>

          {/* Navbar Compare Now Button */}
          <div className="relative group navbar-contact-button-wrapper">
            <button className="bg-[#D9D9D9] rounded-[5px] px-7 py-3 font-medium text-black flex items-center relative z-10 transition-all duration-300 hover:bg-opacity-80">
                Compare Now
                <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <div className="absolute navbar-contact-button-glow"></div>
            </div>

        </div>
      </nav>

      {/* Landing Page Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center pt-15">
        <h1 className="text-[10rem] font-extralight mb-[-60px] text-white leading-tight">
          Find Your
        </h1>
        <h2 className="text-[11rem] font-medium bg-gradient-to-r from-white to-[#CFB4DF] text-transparent bg-clip-text leading-tight">
          Dream Car
        </h2>
        <p className="mt-8 text-4xl font-extralight mx-auto text-white break-words opacity-80">
          Discover your perfect Toyota by exploring detailed comparisons,
          <br />
          key features, and pricing options tailored to your needs
        </p>

        {/* Buttons */}
        <div className="mt-16 flex space-x-8 justify-center">
          {/* Compare Now Button */}
          <div className="relative group navbar-contact-button-wrapper">
            <button className="px-[5rem] py-[1.3rem] bg-[#D9D9D9] text-black rounded-[5px] text-lg font-medium transition-all duration-300 hover:bg-opacity-80 flex items-center relative z-10">
                Compare Now
                <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <div className="absolute navbar-contact-button-glow"></div>
            </div>


          {/* Explore Models Button */}
          <div className="relative group landingpage-contact-button-wrapper">
            <button className="px-[5rem] py-[1.3rem] bg-transparent border border-[#D9D9D9] text-white rounded-[5px] text-lg font-medium transition-all duration-300 hover:bg-white hover:text-black hover:scale-103 group">
              Explore Models
              <ChevronRight className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <div className="absolute landingpage-contact-button-glow"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
