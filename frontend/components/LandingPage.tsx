"use client"
import type React from "react"
import { useState } from "react"
import { ChevronRight } from "lucide-react"
import Navbar from "@/components/Header"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // For now, just redirect to the compare page
    // Later, this will use the search query for similarity search
    router.push("/compare")
  }

  return (
    <main className="min-h-screen relative overflow-hidden font-poppins">
      <div className="fixed inset-0 h-full z-[-1]">
        <img src="/gradient.svg" alt="Gradient" className="object-cover w-full h-full opacity-75" />
      </div>

      <Navbar />

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

        <form onSubmit={handleSearch} className="mt-12 w-3/5 flex">
          <input
            type="text"
            placeholder="Search for your dream Toyota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-6 py-4 bg-transparent border border-[#D9D9D9] text-white rounded-l-[5px] text-lg font-medium transition-all duration-300 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/25"
          />
          <div className="relative group navbar-contact-button-wrapper">
            <button
              type="submit"
              className="px-[5rem] py-[1.3rem] bg-[#D9D9D9] text-black rounded-r-[5px] text-lg font-medium transition-all duration-300 hover:bg-opacity-80 flex items-center relative z-10"
            >
              Compare Now
              <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <div className="absolute navbar-contact-button-glow"></div>
          </div>
        </form>

        <div className="mt-12 flex justify-center">
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
  )
}

