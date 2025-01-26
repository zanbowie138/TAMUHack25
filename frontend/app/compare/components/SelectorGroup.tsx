"use client"
import React, { useState, useCallback } from "react"
import CarSelector from "./CarSelector"
import SentimentFilter from "@/components/SentimentFilter"
import { Plus } from "lucide-react"
import { Car } from "@/config/Car"

const cars: Car[] = []
const models = ["prius", "camry", "corolla", "highlander", "rav4", "sienna", "tacoma", "tundra"]
const years = ["2025", "2024", "2023", "2022", "2021", "2020"]

for (const model of models) {
  for (const year of years) {
    cars.push(new Car(model, year))
  }
}

const initialSentiments = [
  "performance",
  "fuel efficiency",
  "interior comfort",
  "build quality",
  "safety",
  "technology",
  "handling",
]

export default function SelectorGroup() {
  const [selectedCars, setSelectedCars] = useState<Car[]>([])
  const [sentimentWeights, setSentimentWeights] = useState<Record<string, number>>(
    Object.fromEntries(initialSentiments.map((sentiment) => [sentiment, 1])),
  )

  const addCar = useCallback(() => {
    if (selectedCars.length < 4) {
      setSelectedCars((prev) => [...prev, cars[0]])
    }
  }, [selectedCars])

  const removeCar = useCallback((index: number) => {
    setSelectedCars((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleSentimentChange = useCallback((sentiment: string, value: number) => {
    setSentimentWeights((prev) => ({ ...prev, [sentiment]: value }))
  }, [])

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto">
      <h2 className="text-6xl font-light text-white mb-4">Select and Compare</h2>
      <p className="text-lg text-gray-300 mb-8 max-w-2xl text-center">
        Explore and compare up to four different car models side by side. Analyze their features, specifications, and
        performance in detail.
      </p>

      <SentimentFilter sentiments={initialSentiments} weights={sentimentWeights} onChange={handleSentimentChange} />

      <div className="flex justify-center gap-4 w-full">
        {selectedCars.map((car, index) => (
          <div key={index} className={`w-1/${selectedCars.length} min-w-[200px] max-w-[300px] animate-fade-in`}>
            <CarSelector
              cars={cars}
              initialCar={car}
              onRemove={() => removeCar(index)}
              sentimentWeights={sentimentWeights}
            />
          </div>
        ))}
      </div>

      {selectedCars.length < 4 && (
        <button
          onClick={addCar}
          className="mt-8 flex items-center justify-center w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
        >
          <Plus size={32} color="#ffffff" />
        </button>
      )}
    </div>
  )
}

