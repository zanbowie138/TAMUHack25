'use client'
import React, { useState, useCallback, useEffect, Suspense } from "react"
import CarSelector from "./CarSelector"
import SentimentFilter from "@/components/SentimentFilter"
import { Plus } from "lucide-react"
import { Car } from "@/config/Car"
import { getCarUrl, getCarFromUrl } from "@/utils/car_url"
import { useSearchParams } from "next/navigation"

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

function SelectorGroupContent() {
  const searchParams = useSearchParams()
  const [selectedCars, setSelectedCars] = useState<Car[]>([])
  const [sentimentWeights, setSentimentWeights] = useState<Record<string, number>>(
    Object.fromEntries(initialSentiments.map((sentiment) => [sentiment, 1]))
  )

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const carsParam = params.get("cars")
    console.log("carsParam", carsParam)
    if (carsParam) {
      const initialCars = getCarFromUrl(carsParam)
      setSelectedCars(initialCars)
    } else {
      setSelectedCars([])
    }
  }, [])

  function updateURL() {
    const url = getCarUrl(selectedCars)
    console.log(selectedCars)
    window.history.pushState({}, "", `?cars=${url}`)
  }

  function handleCarChange(car: Car, index: number) {
    setSelectedCars((prev) => {
      const newCars = [...prev]
      newCars[index] = car
      return newCars
    })
  }

  useEffect(() => {
    updateURL()
  }, [selectedCars])

  const addCar = useCallback(() => {
    if (selectedCars.length < 4) {
      setSelectedCars((prev) => {
        const newCars = [...prev, cars[0]]
        return newCars
      })
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
              onCarChange={(car) => handleCarChange(car, index)}
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

export default function SelectorGroup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SelectorGroupContent />
    </Suspense>
  )
}
