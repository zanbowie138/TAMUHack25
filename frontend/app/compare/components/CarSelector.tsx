"use client"
import React, { useState } from "react"
import Image from "next/image"
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { ChevronDownIcon, X } from "lucide-react"
import CircularProgress from "@mui/joy/CircularProgress"
import SpiderChart from "@/components/SpiderChart"

// Define the Car type
interface Car {
  id: number
  model: string
  year: string
  name: string
}

const cars: Car[] = []

const models = ["prius", "camry", "corolla", "highlander", "rav4", "sienna", "tacoma", "tundra"]
const years = ["2025", "2024", "2023", "2022", "2021", "2020"]

for (const model of models) {
  for (const year of years) {
    cars.push({ id: cars.length, model: `${model}`, year: `${year}`, name: `${year} ${model}` })
  }
}

const spiderData = [
  { category: "Performance", value: 83, fullMark: 100 },
  { category: "Fuel Efficiency", value: 80, fullMark: 100 },
  { category: "Interior Comfort", value: 83, fullMark: 100 },
  { category: "Build Quality", value: 80, fullMark: 100 },
  { category: "Safety", value: 83, fullMark: 100 },
  { category: "Technology", value: 84, fullMark: 100 },
  { category: "Handling", value: 100, fullMark: 100 },
]

export default function CarSelector({ onCarSelect }: { onCarSelect: (carName: string) => void }) {
  const [selectedCar, setSelectedCar] = useState(cars[0])
  const [query, setQuery] = useState("")

  const filteredCars =
    query === ""
      ? cars
      : cars.filter((car) => {
          return car.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <div className="w-80 p-4 flex flex-col relative bg-black/30 backdrop-blur-md rounded-lg">
      <div className="absolute top-4 right-4">
        <X color="#ffffff" strokeWidth={1} className="w-6 h-auto" />
      </div>
      <div className="absolute top-4 left-4">
        <CircularProgress
          determinate
          value={75}
          sx={{ "--CircularProgress-trackThickness": "3px", "--CircularProgress-progressThickness": "3px" }}
        >
          <div className="text-lg font-medium">75</div>
        </CircularProgress>
      </div>

      <Image
        src={`https://www.toyota.com/imgix/content/dam/toyota/jellies/relative/${selectedCar.year}/${selectedCar.model}/base.png`}
        alt="Car Image"
        width={1000}
        height={1000}
      />
      <div className="w-full grow border-2 border-white rounded-md my-1.5 h-32 p-2 text-white">
        [AI summary and sparkle placeholder]
      </div>
      <div className="mt-auto">
        <Combobox
          immediate
          value={selectedCar}
          onChange={(value) => {
            setSelectedCar(value ?? cars[0])
            onCarSelect(value?.name ?? cars[0].name)
          }}
          onClose={() => setQuery("")}
        >
          <div className="relative">
            <ComboboxInput
              aria-label="Assignee"
              displayValue={(car: Car) => car?.name}
              onChange={(event) => setQuery(event.target.value)}
              className={`w-full h-12 rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25`}
            />
            <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
              <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
            </ComboboxButton>
          </div>
          <ComboboxOptions
            anchor="bottom"
            className="w-72 mt-1 rounded-xl border border-white/5 bg-white/5 backdrop-blur-xl p-1 [--anchor-gap:var(--spacing-1)] empty:invisible transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
          >
            {filteredCars.map((car) => (
              <ComboboxOption
                key={car.id}
                value={car}
                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
              >
                <div className="text-sm/6 text-white">{car.name}</div>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      </div>
      <SpiderChart data={spiderData} />
    </div>
  )
}

