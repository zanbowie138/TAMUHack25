import React from "react";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="h-screen">
      <Header />
      <div className="w-full py-20 flex-col place-items-center gap-5 bg-slate-800">
        <h1 className="text-6xl text-white text-center">
          Find Your <br /> Dream Car
        </h1>
        <h3 className="text-white font-sans">
          Discover your perfect Toyota by exploring detailed comparisons, key
          features, and pricing options tailored to your needs
        </h3>
        <div className="flex gap-3">
          <button className="bg-white text-black py-2 px-4 rounded-md">
            Compare Now
          </button>
          <button className="bg-white text-black py-2 px-4 rounded-md">
            Explore Models
          </button>
        </div>
      </div>
    </div>
  );
}
