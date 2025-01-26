import React from "react";
import { useRouter } from "next/navigation"; // Import for routing
import { ChevronRight } from "lucide-react";
import SearchBar from "./SearchBar";

export default function LandingPage() {
  const router = useRouter();

  const handleExploreModels = () => {
    router.push("/explore");
  };

  return (
    <main className="min-h-screen relative overflow-hidden font-poppins">
      <div className="fixed inset-0 h-full z-[-1]">
        <img src="/gradient.svg" alt="Gradient" className="object-cover w-full h-full opacity-75" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center pt-30">
        <h1 className="text-[10rem] font-extralight mb-[-60px] text-white leading-tight">Find Your</h1>
        <h2 className="text-[11rem] font-medium bg-gradient-to-r from-white to-[#CFB4DF] text-transparent bg-clip-text leading-tight">
          Dream Car
        </h2>
        <p className="mt-8 text-4xl font-extralight mx-auto text-white break-words opacity-80">
          Discover your perfect Toyota by exploring detailed comparisons,
          <br />
          key features, and pricing options tailored to your needs
        </p>

        <SearchBar className="mt-12 w-3/5 mx-auto" />

        <div className="mt-12 flex justify-center">
          <div className="relative group landingpage-contact-button-wrapper">
            <button
              onClick={handleExploreModels}
              className="px-[5rem] py-[1.3rem] bg-transparent border border-[#D9D9D9] text-white rounded-[5px] text-lg font-medium transition-all duration-300 hover:bg-white hover:text-black hover:scale-103 group"
            >
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
