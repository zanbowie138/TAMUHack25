"use client"

import React, { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { useSearchParams } from "next/navigation"
import CarSelector from "./CarSelector"
import SentimentFilter from "@/components/SentimentFilter"
import { Car } from "@/config/Car"
import { getCarFromUrl } from "@/utils/car_url"

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
  "safety",
  "interior comfort",
  "build quality",
  "technology",
  "handling",
]

export default function SelectorGroup() {
  const searchParams = useSearchParams()
  const [selectedCars, setSelectedCars] = useState<Car[]>([])
  const [sentimentWeights, setSentimentWeights] = useState<Record<string, number>>(
    Object.fromEntries(initialSentiments.map((sentiment) => [sentiment, 1])),
  )
  const [activeFilters, setActiveFilters] = useState<string[]>(["performance", "fuel efficiency", "safety", "technology"])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const carsParam = params.get("cars")
    if (carsParam) {
      const initialCars = getCarFromUrl(carsParam)
      setSelectedCars(initialCars)
    } else {
      setSelectedCars([cars[0]])
    }
  }, [searchParams])

  const handleCarChange = useCallback((car: Car, index: number) => {
    setSelectedCars((prev) => {
      const newCars = [...prev]
      newCars[index] = car
      return newCars
    })
  }, [])

  const addCar = useCallback(() => {
    if (selectedCars.length < 7) {
      setSelectedCars((prev) => [...prev, cars[0]])
    }
  }, [selectedCars])

  const removeCar = useCallback((index: number) => {
    setSelectedCars((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleSentimentChange = useCallback((sentiment: string, value: number) => {
    setSentimentWeights((prev) => ({ ...prev, [sentiment]: value }))
  }, [])

  const handleFilterChange = useCallback((selectedFilters: string[]) => {
    setActiveFilters(selectedFilters)
    console.log("Updated active filters:", selectedFilters)
  }, [])

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4">
      <h2 className="text-6xl font-light text-white mb-4 text-center">Select and Compare</h2>
      <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto text-center">
        Explore and compare up to seven different car models side by side. Analyze their features, specifications, and
        performance in detail.
      </p>

      <SentimentFilter
        sentiments={initialSentiments}
        weights={sentimentWeights}
        onChange={handleSentimentChange}
        onFilterChange={handleFilterChange}
      />

      <div className="flex flex-wrap justify-center gap-6">
        <AnimatePresence>
          {selectedCars.map((car, index) => (
            <motion.div
              key={`${car.model}-${car.year}-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="w-[calc(25%-1.5rem)] min-w-[280px]"
            >
              <CarSelector
                cars={cars}
                initialCar={car}
                onRemove={() => removeCar(index)}
                sentimentWeights={sentimentWeights}
                onCarChange={(newCar) => handleCarChange(newCar, index)}
                totalSelections={selectedCars.length}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {selectedCars.length < 7 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addCar}
          className="mt-8 flex items-center justify-center w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 mx-auto"
        >
          <Plus size={32} color="#ffffff" />
        </motion.button>
      )}
    </div>
  )
}

