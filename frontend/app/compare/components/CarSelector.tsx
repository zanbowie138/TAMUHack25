import SpiderChart from '@/components/SpiderChart';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react'

// Define the Car type
interface Car {
  id: number;
  model: string;
  year: string;
  name: string;
}

const cars: Car[] = []

const models = ['prius', 'camry', 'corolla', 'highlander', 'rav4', 'sienna', 'tacoma', 'tundra']
const years = ['2025', '2024', '2023', '2022', '2021', '2020']

for (const model of models) {
  for (const year of years) {
    cars.push({ id: cars.length, model: `${model}`, year: `${year}`, name: `${year} ${model}` })
  }
}

const spiderData = [
  { category: 'Performance', value: 83, fullMark: 100 },
  { category: 'Fuel Efficiency', value: 80, fullMark: 100 },
  { category: 'Interior Comfort', value: 83, fullMark: 100 },
  { category: 'Build Quality', value: 80, fullMark: 100 },
  { category: 'Safety', value: 83, fullMark: 100 },
  { category: 'Technology', value: 84, fullMark: 100 },
  { category: 'Handling', value: 100, fullMark: 100 },
];

export default function CarSelector({ onCarSelect }: { onCarSelect: (carName: string) => void }) {
  const [selectedCar, setSelectedCar] = useState(cars[0])
  const [query, setQuery] = useState('')

  const filteredCars =
  query === ''
    ? cars
    : cars.filter((car) => {
        return car.name.toLowerCase().includes(query.toLowerCase())
      })

  return (
    <div className="w-80 p-4 flex flex-col relative">
      <div className='absolute top-4 right-4'>
        <X color='#ffffff' strokeWidth={1} className='w-6 h-auto'/>
      </div>

      <Image src={`https://www.toyota.com/imgix/content/dam/toyota/jellies/relative/${selectedCar.year}/${selectedCar.model}/base.png`} alt="Car Image" width={1000} height={1000}/>
      <div className='w-full grow border-2 border-white rounded-md my-1.5 h-44'>
        [ai summary and sparkle]
      </div>
      <div className='mt-auto'>
        <Combobox immediate value={selectedCar} onChange={(value) => setSelectedCar(value ?? cars[0])} onClose={() => setQuery('')}>
          <ComboboxInput
            aria-label="Assignee"
            displayValue={(car: Car) => car?.name}
            onChange={(event) => setQuery(event.target.value)}
            className={`w-full h-14 border-2 border-slate-200 rounded-md text-xl text-white p-2`}
          />
          <ComboboxOptions anchor="bottom" className="border empty:invisible w-72 mt-1 rounded-md">
            {filteredCars.map((car) => (
              <ComboboxOption key={car.id} value={car} className="flex gap-2 bg-gray-800 data-[focus]:bg-gray-900 p-2 opacity-80 hover:opacity-100 text-white backdrop-blur-lg">
                {car.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      </div>
      <SpiderChart data={spiderData}/>
    </div>
  );
}