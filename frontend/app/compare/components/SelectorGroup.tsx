import React, { useState } from "react";
import CarSelector from "./CarSelector";
import { CirclePlus } from "lucide-react";
import { Car } from "@/config/Car";

const cars: Car[] = [];
const models = [
  "prius",
  "camry",
  "corolla",
  "highlander",
  "rav4",
  "sienna",
  "tacoma",
  "tundra",
];
const years = ["2025", "2024", "2023", "2022", "2021", "2020"];

for (const model of models) {
  for (const year of years) {
    cars.push(new Car(model, year));
  }
}

export default function SelectorGroup() {
  const [selectors, setSelectors] = useState<Car[]>([new Car("prius", "2025")]);

  const addSelector = () => {
    if (selectors.length < 4) {
      setSelectors([...selectors, new Car("prius", "2025")]);
    }
  };

  return (
    <div>
      <div className="flex flex-row w-full justify-center space-x-12">
        {selectors.map((car, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="bg-gray-800 rounded-lg p-4 w-full mb-4">
              <h3 className="text-white text-xl font-semibold mb-4">Car {index + 1}</h3>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="text-white text-sm mb-2">Model Year</label>
                  <select 
                    className="bg-white/5 text-white rounded-lg p-2 border border-white/20"
                    value={car.year}
                    onChange={(e) => {
                      const newSelectors = [...selectors];
                      newSelectors[index] = new Car(car.model, e.target.value);
                      setSelectors(newSelectors);
                    }}
                  >
                    {years.map((year) => (
                      <option key={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-white text-sm mb-2">Model</label>
                  <select 
                    className="bg-white/5 text-white rounded-lg p-2 border border-white/20"
                    value={car.model}
                    onChange={(e) => {
                      const newSelectors = [...selectors];
                      newSelectors[index] = new Car(e.target.value.toLowerCase(), car.year);
                      setSelectors(newSelectors);
                    }}
                  >
                    {models.map((model) => (
                      <option key={model}>{model.charAt(0).toUpperCase() + model.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <CarSelector 
              onCarSelect={(carName: string) => {
                const newSelectors = [...selectors];
                const [model, year] = carName.split(' ');
                newSelectors[index] = new Car(model.toLowerCase(), year);
                setSelectors(newSelectors);
              }}
            />
          </div>
        ))}
        {selectors.length < 4 ? (
          <button onClick={addSelector}>
            <CirclePlus color="#ffffff" strokeWidth={1} className="w-20 h-auto" />
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
