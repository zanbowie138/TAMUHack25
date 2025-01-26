import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Car } from "@/config/Car"

interface SearchBarProps {
  className?: string
}

export default function SearchBar({ className }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Car[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

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
      const suggestions = data.suggestions.map((suggestion: any) => new Car(suggestion[0], suggestion[1]))
      setSuggestions(suggestions)
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
    setHighlightedIndex(-1)
  }

  const handleSuggestionClick = (suggestion: Car) => {
    setSearchQuery(suggestion.displayString())
    setShowSuggestions(false)
    router.push(`/compare?cars=${suggestion.model.toLowerCase()}-${suggestion.year}`)
  }

  const handleClickOutside = () => {
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prevIndex) => (prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1))
    } else if (e.key === "Enter" && highlightedIndex !== -1) {
      e.preventDefault()
      handleSuggestionClick(suggestions[highlightedIndex])
    }
  }

  useEffect(() => {
    if (highlightedIndex !== -1 && inputRef.current) {
      setSearchQuery(suggestions[highlightedIndex].displayString())
    }
  }, [highlightedIndex, suggestions])

  return (
    <div className="relative w-3/5">
      <form onSubmit={handleSearch} className="flex w-full mt-12">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for your dream Toyota..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => handleClickOutside(), 200)}
          onKeyDown={handleKeyDown}
          className="px-4 py-[1.3rem] flex-grow bg-transparent border border-[#D9D9D9] text-white rounded-l-[5px] text-lg font-medium transition-all duration-300 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/25 "
        />
        <div className="relative group navbar-contact-button-wrapper">
          <button
            type="submit"
            className="px-[5rem] py-[1.3rem] bg-[#D9D9D9] text-black rounded-r-[5px] text-lg font-medium transition-all duration-300 hover:bg-opacity-80 flex items-center justify-center relative z-10"
          >
            Compare Now
            <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <div className="absolute navbar-contact-button-glow"></div>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full mt-2 bg-[#222222] opacity-100 rounded-md shadow-lg h-full overflow-y-auto z-[50] rounded-md border border-white/20">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`px-4 py-2 cursor-pointer text-white ${
                index === highlightedIndex ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.displayString()}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

