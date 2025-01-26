import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Car } from "@/config/Car";

interface DropdownProps {
  car: Car;
  cars: Car[];
  onChange?: (car: Car) => void;
}

export default function Dropdown({ car, cars, onChange }: DropdownProps) {
  const [query, setQuery] = useState("");

  const filteredCars =
    query === ""
      ? cars
      : cars.filter((car) => {
          return car.model.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      immediate
      value={car}
      onChange={onChange || (() => {})}
      onClose={() => setQuery("")}
    >
      <div className="relative">
        <ComboboxInput
          displayValue={(car: Car) => car?.string()}
          onChange={(event) => setQuery(event.target.value)}
          className={`w-full h-12 rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white 'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25`}
        />

        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
          <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
        </ComboboxButton>
      </div>
      <ComboboxOptions
        anchor="top"
        className="w-[var(--input-width)] bg-white/20 backdrop-blur-xl rounded-md"
      >
        {filteredCars.map((car, index) => (
          <ComboboxOption
            key={index}
            value={car}
            className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
          >
            <div className="text-sm my-1 text-white">{car.string()}</div>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}
