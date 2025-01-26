import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"
import type { Car } from "@/config/Car"

interface DropdownProps {
  car: Car
  cars: Car[]
  onChange?: (car: Car) => void
}

export default function Dropdown({ car, cars, onChange }: DropdownProps) {
  const [query, setQuery] = useState("")

  const filteredCars =
    query === ""
      ? cars
      : cars.filter((car) => {
          return car.model.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox immediate value={car} onChange={onChange || (() => {})} onClose={() => setQuery("")}>
      <div className="relative">
        <ComboboxInput
          displayValue={(car: Car) => car?.string()}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full h-12 rounded-lg border border-white/40 bg-transparent py-1.5 pr-8 pl-3 text-sm/6 text-white focus:outline-none focus:ring-2 focus:ring-white/25"
        />

        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" />
        </ComboboxButton>
      </div>
      <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-black py-1 text-base shadow-lg ring-1 ring-white/20 focus:outline-none sm:text-sm">
        {filteredCars.map((car, index) => (
          <ComboboxOption
            key={index}
            value={car}
            className={({ active }) =>
              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                active ? "bg-white/10 text-white" : "text-gray-300"
              }`
            }
          >
            {({ selected, active }) => (
              <>
                <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{car.string()}</span>
                {selected ? (
                  <span
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                      active ? "text-white" : "text-gray-400"
                    }`}
                  >
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                ) : null}
              </>
            )}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

