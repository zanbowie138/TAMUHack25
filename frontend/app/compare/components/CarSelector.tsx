import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useState } from 'react'

// Define the Car type
interface Car {
  id: number;
  name: string;
}

const cars: Car[] = [
  { id: 1, name: 'Camry' },
  { id: 2, name: 'Tundra' },
  { id: 3, name: 'Rav4' },
  { id: 4, name: 'Corolla' },
  { id: 5, name: 'Prius' },
]

export default function CarSelector() {
  const [selectedCar, setSelectedCar] = useState(cars[0])
  const [query, setQuery] = useState('')

  const filteredCars =
  query === ''
    ? cars
    : cars.filter((car) => {
        return car.name.toLowerCase().includes(query.toLowerCase())
      })

  return (
    <div className="w-80 h-96 bg-zinc-800 rounded-xl border-gray-500 border-2 p-4 flex flex-col">
      <div className='mt-auto'>
        <Combobox value={selectedCar} onChange={(value) => setSelectedCar(value ?? cars[0])} onClose={() => setQuery('')}>
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(car: Car) => car?.name}
            onChange={(event) => setQuery(event.target.value)}
            className={`w-full h-14 border-2 border-slate-200 rounded-md text-xl text-white p-2`}
          />
          <ComboboxOptions anchor="bottom" className="border empty:invisible w-72">
            {filteredCars.map((car) => (
              <ComboboxOption key={car.id} value={car} className="flex gap-2 bg-white data-[focus]:bg-blue-100">
                {car.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      </div>
    </div>
  );
}