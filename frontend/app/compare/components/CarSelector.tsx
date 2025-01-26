"use client"
import React, { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { X, ChevronDownIcon } from "lucide-react"
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import CircularProgress from "@mui/joy/CircularProgress"
import SpiderChart from "@/components/SpiderChart"
import getImage from "@/utils/get_image"
import type { Car } from "@/config/Car"

interface CarSelectorProps {
  cars: Car[]
  initialCar: Car
  onRemove: () => void
  sentimentWeights: Record<string, number>
  onCarChange: (car: Car) => void
}

export default function CarSelector({ cars, initialCar, onRemove, sentimentWeights, onCarChange }: CarSelectorProps) {
  const [selectedCar, setSelectedCar] = useState(initialCar)
  const [query, setQuery] = useState("")
  const [spiderData, setSpiderData] = useState([
    { category: "Performance", value: 83, fullMark: 100 },
    { category: "Fuel Efficiency", value: 80, fullMark: 100 },
    { category: "Interior Comfort", value: 83, fullMark: 100 },
    { category: "Build Quality", value: 80, fullMark: 100 },
    { category: "Safety", value: 83, fullMark: 100 },
    { category: "Technology", value: 84, fullMark: 100 },
    { category: "Handling", value: 100, fullMark: 100 },
  ])

  const filteredCars =
    query === ""
      ? cars
      : cars.filter((car) => {
          return car.model.toLowerCase().includes(query.toLowerCase())
        })

  const overallScore = useMemo(() => {
    return Math.round(
      spiderData.reduce((acc, item) => acc + item.value * (sentimentWeights[item.category.toLowerCase()] || 1), 0) /
        spiderData.length,
    )
  }, [spiderData, sentimentWeights])

  useEffect(() => {
    setSpiderData((prevData) =>
      prevData.map((item) => ({
        ...item,
        value: Math.min(item.value * (sentimentWeights[item.category.toLowerCase()] || 1), 100),
      })),
    )
  }, [sentimentWeights])

  const handleCarChange = (car: Car | null) => {
    if (car) {
      setSelectedCar(car)
      onCarChange(car)
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 z-[1]">
        <Combobox immediate value={selectedCar} onChange={handleCarChange} onClose={() => setQuery("")}>
          <div className="relative">
            <ComboboxInput
              aria-label="Select car"
              displayValue={(car: Car) => `${car.year} ${car.model.charAt(0).toUpperCase() + car.model.slice(1)}`}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full h-12 rounded-lg border border-white/20 bg-white/10 py-1.5 pr-8 pl-3 text-sm/6 text-white/80 focus:outline-none focus:border-white/40 transition-colors duration-200"
            />
            <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
              <ChevronDownIcon className="size-4 text-white/60 group-hover:text-white/80" />
            </ComboboxButton>
          </div>
          <ComboboxOptions className="absolute w-full mt-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md p-1 max-h-60 overflow-auto scrollbar-hide">
            {filteredCars.map((car, index) => (
              <ComboboxOption
                key={index}
                value={car}
                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/20 transition-colors duration-200"
              >
                <div className="text-sm/6 text-white/80 group-data-[focus]:text-white">
                  {car.year} {car.model.charAt(0).toUpperCase() + car.model.slice(1)}
                </div>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      </div>

      <div className="w-full p-4 flex flex-col relative bg-white/10 backdrop-blur-md rounded-lg transition-all duration-300 ease-in-out border border-white/20 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-2xl font-light text-white/80">{selectedCar.year}</h3>
            <h4 className="text-lg font-medium text-white">
              {selectedCar.model.charAt(0).toUpperCase() + selectedCar.model.slice(1)}
            </h4>
          </div>
          <div className="flex items-center gap-4">
            <CircularProgress
              determinate
              value={overallScore}
              sx={{
                "--CircularProgress-trackThickness": "2px",
                "--CircularProgress-progressThickness": "2px",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              <div className="text-lg font-medium text-white/80">{overallScore}</div>
            </CircularProgress>
            <button onClick={onRemove} className="text-white/60 hover:text-pink-400 transition-colors duration-200">
              <X strokeWidth={1} className="w-6 h-auto" />
            </button>
          </div>
        </div>

        <Image
          src={getImage(selectedCar) || "/placeholder.svg"}
          alt={`${selectedCar.year} ${selectedCar.model}`}
          width={1000}
          height={1000}
          className="w-full h-auto object-contain"
        />

        <div className="w-full grow border border-white/20 rounded-md my-4 h-32 p-2 text-white/80 bg-white/10 backdrop-blur-sm">
          [AI summary and sparkle placeholder]
        </div>

        <SpiderChart data={spiderData} />
      </div>
    </div>
  )
}

