import { memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import getImage from "@/utils/get_image"
import { Car } from "@/config/Car"
import { CircularProgress } from "@mui/joy"

interface CarOption {
  model: string
  price: number
  features: string[]
  mpg: string
  year: number
  engineType: string
  matchScore: number
}

interface CarTileProps {
  car: CarOption
  className?: string
}

const CarTile = memo(
  ({ car }: CarTileProps) => {
    console.log(`Rendering CarTile for ${car.model} with score ${car.matchScore}`)

    const animations = {
      container: {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            mass: 1,
          },
        },
        hover: {
          y: -8,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
          },
        },
      },
      image: {
        hover: {
          scale: 1.05,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
          },
        },
      },
      button: {
        tap: { scale: 0.95 },
      },
    }

    const formatPrice = (price: number) => `$${price.toLocaleString()}`

    const base_url = "https://www.toyota.com/"

    return (
      <motion.div
        variants={animations.container}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        layout
        className="bg-[#1C1C1C] rounded-lg overflow-hidden shadow-lg"
      >
        <motion.div className="h-48 bg-[#262527] relative" variants={animations.image}>
          <div className="absolute top-4 left-4">
            <CircularProgress
              determinate
              value={car.matchScore}
              sx={{
                "--CircularProgress-trackThickness": "3px",
                "--CircularProgress-progressThickness": "3px",
                "--CircularProgress-progressColor": "#D1B8E1",
              }}
            >
              <div className="text-lg font-medium text-white">{car.matchScore}</div>
            </CircularProgress>
          </div>
          <Image
            src={getImage(new Car(car.model.toLowerCase(), car.year.toString())) || "/placeholder.svg"}
            alt={`${car.model} Image`}
            fill
            className="object-contain"
          />
        </motion.div>
        <div className="p-4">
          <h3 className="text-sm font-medium mb-0.5">
            <span className="text-gray-400">{car.year}</span>
          </h3>
          <h4 className="text-2xl font-semibold mb-2 text-white">
            Toyota {car.model.charAt(0).toUpperCase() + car.model.slice(1)}
          </h4>
          <p className="text-[#98FB98] text-lg mb-3">{formatPrice(car.price)}</p>
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-300">
            <span>MPG: {car.mpg}</span>
            <span>{car.engineType}</span>
          </div>
          <AnimatePresence>
            <ul className="text-sm text-gray-300">
              {car.features.map((feature, index) => (
                <motion.li
                  key={index}
                  className="mb-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  • {feature}
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
          <div className="mt-4 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap="tap"
              variants={animations.button}
              className="flex-1 bg-gradient-to-r from-[#1C1C1C] to-[#262527] text-white py-2 px-4 rounded hover:opacity-90"
              onClick={() => window.open(`${base_url}${car.model}/${car.year}`, "_blank")}
            >
              Learn More
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, background: "linear-gradient(to right, #1C1C1C, #262527)" }}
              whileTap="tap"
              variants={animations.button}
              className="flex-1 border border-[#D1B8E1] text-[#D1B8E1] py-2 px-4 rounded"
              onClick={() => window.open(`/compare?cars=${car.model}-${car.year}`, "_blank")}
            >
              Compare
            </motion.button>
          </div>
        </div>
      </motion.div>
    )
  },
  (prevProps, nextProps) => {
    return JSON.stringify(prevProps.car) === JSON.stringify(nextProps.car)
  },
)

CarTile.displayName = "CarTile"

export default CarTile

