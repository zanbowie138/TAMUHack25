"use client"
import React, { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import CircularProgress from "@mui/joy/CircularProgress"
import SpiderChart from "@/components/SpiderChart"
import getImage from "@/utils/get_image"
import Dropdown from "./Dropdown"
import type { Car } from "@/config/Car"

interface CarSelectorProps {
  cars: Car[]
  initialCar: Car
  onRemove: () => void
  sentimentWeights: Record<string, number>
  onCarChange: (car: Car) => void
  totalSelections: number
}

const initialSentiments = [
  "performance",
  "fuel efficiency",
  "cost",
  "year"
]
class CarData {
  price: number;
  mpg: number;
  horsepower: number;
  year: number;
  matchScore: number;
  constructor(price: number, mpg: number, horsepower: number, year: number, matchScore: number) {
    this.price = price;
    this.mpg = mpg;
    this.horsepower = horsepower;
    this.year = year;
    this.matchScore = matchScore;
  }
}

export default function CarSelector({
  cars,
  initialCar,
  onRemove,
  sentimentWeights,
  onCarChange,
  totalSelections,
}: CarSelectorProps) {
  const [selectedCar, setSelectedCar] = useState(initialCar)
  const [isExpanded, setIsExpanded] = useState(false)
  const [spiderData, setSpiderData] = useState([
    { category: "Performance", value: 83, fullMark: 100 },
    { category: "Fuel Efficiency", value: 80, fullMark: 100 },
    { category: "Cost", value: 83, fullMark: 100 },
    { category: "Year", value: 80, fullMark: 100 },
  ])
  const [carData, setCarData] = useState<CarData | null>(null)
  const [carMatchScore, setCarMatchScore] = useState<number>(0)

  const searchCar = async (car: Car): Promise<any[]> => {
    const response = await fetch(`http://127.0.0.1:5000/${car.model}/${car.year}/data`)
    const data = await response.json()
    return data.car_data
  }
  const calculateMatchScore = (car: CarData) => {
    const priceScore = 1 - car.price / 40090
    const mpgScore = Number(car.mpg) / 60
    const horsepowerScore = car.horsepower / 500
    const yearScore: number = (car.year - 2020) / 5
    const weightedScore = priceScore * sentimentWeights["cost"] + mpgScore * sentimentWeights["fuel efficiency"] + yearScore * sentimentWeights["year"] + horsepowerScore * sentimentWeights["performance"]
    const totalWeight = Object.values(sentimentWeights).reduce((sum, weight) => sum + weight, 0)
    const normalizedScore = (weightedScore / totalWeight) * 100
    return Math.round(Math.max(0, Math.min(100, normalizedScore)))
  }    
  useEffect(() => {
    const fetchCarData = async () => {
      const data = await searchCar(selectedCar)
      console.log(data)
      const price = data[4]
      const mpg = data[6]
      const horsepower = data[5]
      const year = data[2]
      setSpiderData([
        { category: "Cost", value: (1 - price / 40090) * 100, fullMark: 100 },
        { category: "Year", value: ((year-2020)/5) * 100, fullMark: 100 },
        { category: "Performance", value: (horsepower / 500) * 100, fullMark: 100 },
        { category: "Fuel Efficiency", value: (mpg / 60) * 100, fullMark: 100 },
      ])
      const matchScore = calculateMatchScore(new CarData(price, mpg, horsepower, year, 0))
      setCarMatchScore(matchScore)
      setCarData(new CarData(price, mpg, horsepower, year, matchScore))
    }
    fetchCarData()
  }, [selectedCar])


  useEffect(() => {
    console.log("Updating car match score")
    // const totalScore = spiderData.reduce((sum, item) => sum + item.value, 0)
    if (carData) {
      const matchScore = calculateMatchScore(carData)
      setCarMatchScore(matchScore)
    }
  }, [sentimentWeights])
  const overallScore = carMatchScore!


    useEffect(() => {
      setSpiderData((prevData) =>
        prevData.map((item) => ({
          ...item,
          value: Math.min(item.value * (sentimentWeights[item.category.toLowerCase()] || 1), 100),
        })),
      )
    }, [sentimentWeights])

  const handleCarChange = (car: Car) => {
    setSelectedCar(car)
    onCarChange(car)
  }

  const getSentimentSummary = () => {
    try {
      const summaries = require("/public/car_summaries.json")
      const carKey = `${selectedCar.model} ${selectedCar.year}`
      return summaries[carKey]?.sentiment || "No summary available"
    } catch (e) {
      console.error("Error loading car summaries:", e)
      return "Summary not available"
    }
  }

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
        scale: 1.01,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      },
    },
  }

  return (
    <motion.div
      className="flex flex-col space-y-4 w-full"
      variants={animations.container}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout
    >
      <div className="w-full bg-transparent backdrop-blur-md rounded-lg p-2 border border-white/20 z-[100]">
        <Dropdown car={selectedCar} cars={cars} onChange={handleCarChange} />
      </div>

      <motion.div
        className="w-full flex flex-col relative bg-gradient-to-b from-[#262527] to-[#1C1C1C] rounded-lg overflow-hidden shadow-lg"
        layout
      >
        <motion.div className="h-48 relative" variants={animations.image}>
          <div className="absolute top-4 left-4 z-10">
            <CircularProgress
              determinate
              value={overallScore}
              sx={{
                "--CircularProgress-trackThickness": "3px",
                "--CircularProgress-progressThickness": "3px",
                "--CircularProgress-progressColor": "#D1B8E1",
              }}
            >
              <div className="text-lg font-medium text-white">{overallScore}</div>
            </CircularProgress>
          </div>
          <Image
            src={getImage(selectedCar) || "/placeholder.svg"}
            alt={`${selectedCar.year} ${selectedCar.model}`}
            fill
            className="object-contain"
          />
          <button
            onClick={onRemove}
            className="absolute top-4 right-4 text-white/60 hover:text-pink-200 transition-colors duration-200 z-10"
          >
            <X strokeWidth={1} className="w-6 h-auto" />
          </button>
        </motion.div>

        <div className="p-4">
          <h3 className="text-sm font-medium mb-0.5 text-gray-400">{selectedCar.year}</h3>
          <h4 className="text-2xl font-semibold mb-2 text-white">
            Toyota {selectedCar.model.charAt(0).toUpperCase() + selectedCar.model.slice(1)}
          </h4>

          <div className="relative overflow-hidden">
            <div className={`text-sm text-gray-300 ${isExpanded ? "" : "max-h-24"}`}>{getSentimentSummary()}</div>
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1C1C1C] to-transparent"></div>
            )}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm text-[#D1B8E1] hover:text-white transition-colors duration-200"
          >
            {isExpanded ? "See less" : "See more"}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SpiderChart data={spiderData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

