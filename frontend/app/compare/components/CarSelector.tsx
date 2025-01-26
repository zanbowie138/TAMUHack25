import SpiderChart from "@/components/SpiderChart";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Progress from "./Progress";
import { Car } from "@/config/Car";



const spiderData = [
  { category: "Performance", value: 83, fullMark: 100 },
  { category: "Fuel Efficiency", value: 80, fullMark: 100 },
  { category: "Interior Comfort", value: 83, fullMark: 100 },
  { category: "Build Quality", value: 80, fullMark: 100 },
  { category: "Safety", value: 83, fullMark: 100 },
  { category: "Technology", value: 84, fullMark: 100 },
  { category: "Handling", value: 100, fullMark: 100 },
];

export default function CarSelector({ car, onRemove }: { car: Car; onRemove?: () => void }) {
  return (
    <div className="w-100 p-4 flex flex-col relative bg-gray-800 rounded-lg">
      <div className="flex justify-between">
        <Progress value={76} />
        <h2 className="text-3xl text-white font-bold">{car.displayString()}</h2>
        <button onClick={onRemove}>
          <X color="#ffffff" strokeWidth={1} className="w-6 h-auto cursor-pointer hover:text-gray-300" />
        </button>
      </div>

      <div className="bg-white mt-5 rounded-md">
        <Image
          src={`https://www.toyota.com/imgix/content/dam/toyota/jellies/relative/${car.year}/${car.model}/base.png`}
          alt="Car Image"
          width={1000}
          height={1000}
        />
      </div>

      <div className="w-full grow border-2 border-white rounded-md my-1.5 h-32 text-white p-2">
        [ai summary and sparkle]
      </div>

      <SpiderChart data={spiderData} />
    </div>
  );
}
