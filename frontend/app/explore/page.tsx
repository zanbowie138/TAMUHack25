"use client";

import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/headers/BlockHeader";
import FooterComponent from "@/components/Footer";
import CarTile from "./components/CarTile";
import CompareList from "./components/CompareList";

interface CarOption {
  model: string;
  price: number;
  features: string[];
  mpg: string;
  year: number;
  engineType: string;
  matchScore: number;
}

export default function Explore() {
  const [priceRange, setPriceRange] = useState([20000, 50000]);
  const [sortBy, setSortBy] = useState("match-score");
  const [selectedCars, setSelectedCars] = useState<CarOption[]>([]);
  const [scoreWeights, setScoreWeights] = useState({
    price: 0.2,
    mpg: 0.3,
    year: 0.1,
  });
  const [cars, setCars] = useState<CarOption[]>([]);

  const fetchAllCarData = async () => {
    const response = await fetch(`http://127.0.0.1:5000/all_cars`);
    const data = await response.json();
    const carData = data.all_cars.map((car: any) => ({
      model: car[1],
      price: Number.parseInt(car[4]),
      features: [],
      mpg: car[6] + "",
      year: car[2],
      engineType: "Gas",
      matchScore: 75,
    }));
    setCars(carData);
  }

  useEffect(() => {
    fetchAllCarData();
  }, []);

  const calculateMatchScore = (car: CarOption) => {
    const priceScore = 1 - car.price / 40090;
    const mpgScore = Number(car.mpg) / 60;
    const yearScore = (car.year - 2020) / 5;

    const weightedScore =
      priceScore * scoreWeights.price +
      mpgScore * scoreWeights.mpg +
      yearScore * scoreWeights.year;

    const totalWeight = Object.values(scoreWeights).reduce(
      (sum, weight) => sum + weight,
      0,
    );
    const normalizedScore = (weightedScore / totalWeight) * 100;

    return Math.round(Math.max(0, Math.min(100, normalizedScore)));
  };

  function onCompareClicked(car: CarOption) {
    setSelectedCars((selectedCars) => {
      const carExists = selectedCars.some(
        (selectedCar) =>
          selectedCar.model === car.model && selectedCar.year === car.year,
      );

      if (carExists) {
        return selectedCars.filter(
          (selectedCar) =>
            !(selectedCar.model === car.model && selectedCar.year === car.year),
        );
      }

      if (selectedCars.length < 3) {
        return [...selectedCars, car];
      }
      return selectedCars;
    });
  }

  function onRemoveCar(car: CarOption) {
    setSelectedCars((selectedCars) =>
      selectedCars.filter(
        (selectedCar) =>
          !(selectedCar.model === car.model && selectedCar.year === car.year),
      ),
    );
  }

  useEffect(() => {
    console.log("Selected Cars Callback", selectedCars);
    console.log("Length: ", selectedCars.length);
  }, [selectedCars]);

  useEffect(() => {
    if (cars.length > 0) {
      const updatedCars = cars.map((car) => ({
        ...car,
        matchScore: calculateMatchScore(car),
      }));
      setCars(updatedCars);
    }
  }, [scoreWeights]);

  const sortCars = (a: CarOption, b: CarOption) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "mpg":
        return Number(b.mpg) - Number(a.mpg);
      case "match-score":
        return b.matchScore - a.matchScore;
      default:
        return 0;
    }
  };

  const filteredCars = cars
    .filter((car) => car.price >= priceRange[0] && car.price <= priceRange[1])
    .sort(sortCars);

  const formatPrice = (price: number) => `$${price.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-[#1C1C1C] relative">
      <div className="fixed inset-0 h-full z-0">
        <img
          src="/gradient3.svg"
          alt="Gradient"
          className="object-cover w-full h-full opacity-50"
        />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl font-light text-white mb-4 text-center pb-5"
          >
            Explore Cars in Your Budget
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="text-lg text-[#A6A6A6] font-light text-center font-inter mb-8 pb-10"
          >
            Discover the perfect Toyota for your lifestyle and budget. Use our
            powerful filters and comparison tools.
            <br />
            Explore detailed insights into each model’s performance, features,
            and value.
          </motion.p>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-1 bg-transparent bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-lg h-fit"
              >
                <div className="mb-8">
                  <h2 className="text-2xl mb-4 text-gray-100">Price Range</h2>
                  <div className="px-4">
                    <Slider
                      range
                      min={15000}
                      max={100000}
                      step={1000}
                      value={priceRange}
                      onChange={(value: number | number[]) =>
                        setPriceRange(value as number[])
                      }
                      dotStyle={{
                        borderColor: "white",
                        backgroundColor: "white",
                      }}
                      activeDotStyle={{
                        borderColor: "white",
                        backgroundColor: "white",
                      }}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-lg text-gray-100">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl mb-4 text-gray-100">Score Weights</h2>
                  <div className="space-y-4">
                    {Object.entries(scoreWeights).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <label className="text-gray-100 mb-1 capitalize">
                          {key}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={value}
                          onChange={(e) =>
                            setScoreWeights((prev) => ({
                              ...prev,
                              [key]: Number.parseFloat(e.target.value),
                            }))
                          }
                          className="w-full"
                        />
                        <span className="text-sm text-gray-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl mb-4 text-gray-100">Sort By</h2>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-transparent text-white py-2 px-4 rounded transition-colors hover:bg-gray-700 border border-gray-600"
                    style={{ backgroundColor: "#2D2D2D" }}
                  >
                    <option value="match-score">Best Match</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="mpg">Best MPG</option>
                  </select>
                </div>
              </motion.div>

              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-4 text-gray-300"
                >
                  {cars.length} vehicles found
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                  {filteredCars.map((car) => {
                      const isSelected = selectedCars.some(
                        (selectedCar) =>
                          selectedCar.model === car.model && selectedCar.year === car.year
                      );
                      console.log('Car:', car.model, car.year, 'isSelected:', isSelected);
                      console.log('selectedCars:', selectedCars);
                      
                      return (
                        <CarTile
                          key={`${car.model}-${car.year}`}
                          car={car}
                          onCompare={onCompareClicked}
                          isSelected={isSelected}
                          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-4 transition-all hover:scale-105"
                        />
                      );
                    })}
                  </AnimatePresence>
                </motion.div>

                {selectedCars.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed bottom-8 right-8 p-4 bg-[#2D2D2D] rounded-lg shadow-lg z-50"
                  >
                    <CompareList 
                      cars={selectedCars}
                      removeCar={(car: CarOption) => onRemoveCar(car)}
                      clearCars={() => setSelectedCars([])}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>

        <FooterComponent />
      </div>
    </div>
  );
}
