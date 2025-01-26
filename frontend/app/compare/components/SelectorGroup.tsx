"use client"
import React, { useState } from "react"
import CarSelector from "./CarSelector"
import { Plus } from "lucide-react"

export default function SelectorGroup() {
  const [selectors, setSelectors] = useState<string[]>([])

  const addSelector = () => {
    if (selectors.length < 4) {
      setSelectors([...selectors, `car-${selectors.length + 1}`])
    }
  }

  const removeSelector = (index: number) => {
    setSelectors(selectors.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto">
      <h2 className="text-6xl font-light text-white mb-4">Select and Compare</h2>
      <p className="text-lg text-gray-400 mb-8 max-w-2xl text-center">
        Explore and compare up to four different car models side by side. Analyze their features, specifications, and
        performance in detail.
      </p>

      <div className="flex justify-center gap-4 w-full">
        {selectors.map((selector, index) => (
          <div key={selector} className="w-1/4 min-w-[250px] animate-fade-in">
            <CarSelector
              onCarSelect={(carName: string) => {
                console.log(`Selected car: ${carName}`)
              }}
              onRemove={() => removeSelector(index)}
            />
          </div>
        ))}
      </div>

      {selectors.length < 4 && (
        <button
          onClick={addSelector}
          className="mt-8 flex items-center justify-center w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
        >
          <Plus size={32} color="#ffffff" />
        </button>
      )}
    </div>
  )
}

