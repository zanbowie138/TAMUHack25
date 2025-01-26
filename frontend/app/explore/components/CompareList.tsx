"use client"

import { getCarUrl } from "@/utils/car_url"
import { Car } from "@/config/Car"
import { motion } from "framer-motion"

interface Car_Option {
  model: string
  price: number
  features: string[]
  mpg: string
  year: number
  engineType: string
  matchScore: number
}

const handleCompare = (cars: Car[]) => {
  if (cars.length > 1) {
    const carObjects = cars.map(car => new Car(car.model, car.year.toString()));
    const carUrl = getCarUrl(carObjects);
    window.location.href = `/compare/?cars=${carUrl}`;
  }
}

export default function CompareList({ cars, removeCar, clearCars }: { cars: Car_Option[], removeCar: (car: Car_Option) => void, clearCars: () => void }) {

  return (
    <div className="flex flex-col gap-4 min-w-[300px]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Compare List</h2>
        <button 
          onClick={clearCars}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Clear All
        </button>
      </div>
      {cars.map((car) => (
        <div 
          key={`${car.model}-${car.year}`}
          className="flex items-center justify-between bg-black bg-opacity-20 p-3 rounded-lg"
        >
          <span className="text-white">{car.year} {car.model}</span>
          <button 
            onClick={() => removeCar(car)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Remove
          </button>
        </div>
      ))}
      <motion.button
        onClick={() => handleCompare(cars.map(car => new Car(car.model, car.year.toString())))}
        className="text-sm text-gray-400 hover:text-white transition-colors border border-[#D1B8E1] rounded-lg p-2 relative overflow-hidden"
        whileHover="hover"
        initial="initial"
        variants={{
          hover: {
            boxShadow: "0 0 15px rgba(209, 184, 225, 0.5)",
          }
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D1B8E1] to-transparent opacity-0"
          variants={{
            initial: {
              x: "-100%",
              opacity: 0
            },
            hover: {
              x: "100%",
              opacity: 0.3,
              transition: {
                repeat: Infinity,
                duration: 1.5,
                ease: "linear"
              }
            }
          }}
        />
        Compare
      </motion.button>
    </div>
  )
}
