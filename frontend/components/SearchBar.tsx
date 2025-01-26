import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    router.push("/compare")
  }

  const fetchSuggestions = async (query: string) => {
    if (query.length < 1) {
      setSuggestions([])
      return
    }
    try {
        console.log("Fetching suggestions for:", query)
      const response = await fetch(`http://localhost:5000/suggestions/${query}`)
      const data = await response.json()
      setSuggestions(data.suggestions)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setSuggestions([])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setShowSuggestions(true)
    fetchSuggestions(query)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
  }

  const handleClickOutside = () => {
    setShowSuggestions(false)
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className={`flex ${className}`}>
        <input
          type="text"
          placeholder="Search for your dream Toyota..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => handleClickOutside(), 200)}
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

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full mt-2 bg-white rounded-md shadow-lg max-h-60 overflow-auto z-50">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
