import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

interface SentimentFilterProps {
  sentiments: string[]
  weights: Record<string, number>
  onChange: (sentiment: string, value: number) => void
  onFilterChange: (selectedFilters: string[]) => void
}

const defaultFilters = ["performance", "fuel efficiency", "safety", "technology"]

export default function SentimentFilter({ sentiments, weights, onChange, onFilterChange }: SentimentFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>(defaultFilters)

  const handleFilterToggle = (sentiment: string) => {
    setSelectedFilters((prev) => {
      const newFilters = prev.includes(sentiment) ? prev.filter((f) => f !== sentiment) : [...prev, sentiment]
      onFilterChange(newFilters)
      return newFilters
    })
  }

  const displayedFilters = isExpanded ? sentiments : selectedFilters

  return (
    <motion.div
      layout
      className="w-full max-w-3xl mx-auto bg-transparent backdrop-blur-md rounded-lg p-6 mb-8 border border-white/20"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Customize Your Priorities</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white bg-white/10 hover:bg-white/20 transition-colors duration-200 px-4 py-2 rounded-md flex items-center"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2" size={18} />
              Less Filters
            </>
          ) : (
            <>
              <ChevronDown className="mr-2" size={18} />
              More Filters
            </>
          )}
        </button>
      </div>
      <AnimatePresence>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedFilters.map((sentiment) => (
            <motion.div
              key={sentiment}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <label htmlFor={sentiment} className="text-sm font-medium text-white/80">
                  {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                </label>
                {isExpanded && (
                  <button
                    onClick={() => handleFilterToggle(sentiment)}
                    className={`text-xs px-2 py-1 rounded-full ${
                      selectedFilters.includes(sentiment)
                        ? "bg-white/20 text-white"
                        : "bg-transparent border border-white/20 text-white/60"
                    }`}
                  >
                    {selectedFilters.includes(sentiment) ? "Remove" : "Add"}
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="range"
                  id={sentiment}
                  min={0}
                  max={2}
                  step={0.1}
                  value={weights[sentiment]}
                  onChange={(e) => onChange(sentiment, Number.parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white/80">
                  {weights[sentiment].toFixed(1)}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

