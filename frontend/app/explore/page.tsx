'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import 'rc-slider/assets/index.css';
import Header from '@/components/headers/BlockHeader';
import { useRouter } from 'next/navigation';
import getImage from '@/utils/get_image';
import CarTile from './components/CarTile';
import FooterComponent from '@/components/Footer';

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
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([20000, 50000]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('price-low');
  
  // Add score weights state
  const [scoreWeights, setScoreWeights] = useState({
    price: 0.2,
    mpg: 0.3,
    year: 0.1
  });

  const car_models = ['prius', 'camry', 'corolla', 'highlander', 'rav4', 'sienna', 'tacoma', 'tundra'];
  const car_years = ['2025', '2024', '2023', '2022', '2021', '2020'];

  const [cars, setCars] = useState<CarOption[]>([]);

  // Updated calculation function
  const calculateMatchScore = (car: CarOption) => {
    // Normalize each factor to a 0-1 scale
    const priceScore = 1 - (car.price / 50000); // Lower price is better
    const mpgScore = Number(car.mpg) / 60; // Higher MPG is better
    const yearScore = (car.year - 2020) / 5; // Newer year is better

    // Combine scores using weights
    const weightedScore = (
      priceScore * scoreWeights.price +
      mpgScore * scoreWeights.mpg +
      yearScore * scoreWeights.year
    );

    // Normalize final score to 0-100 range based on total weights
    const totalWeight = Object.values(scoreWeights).reduce((sum, weight) => sum + weight, 0);
    const normalizedScore = (weightedScore / totalWeight) * 100;

    return Math.round(Math.max(0, Math.min(100, normalizedScore))); // Clamp between 0-100
  };

  // Add effect to recalculate scores when weights change
  useEffect(() => {
    if (cars.length > 0) {
      console.log('Recalculating scores with weights:', scoreWeights);
      const updatedCars = cars.map(car => ({
        ...car,
        matchScore: calculateMatchScore(car)
      }));
      setCars(updatedCars);
    }
  }, [scoreWeights]); // Remove cars.length dependency to prevent potential loops

  // Add a debug log for cars updates
  useEffect(() => {
    console.log('Cars updated:', cars.map(car => ({
      model: car.model,
      score: car.matchScore
    })));
  }, [cars]);

  // Fetch car data for each model and year combination
  useEffect(() => {
    const fetchAllCarData = async () => {
      const carData = [];
      
      for (const model of car_models) {
        for (const year of car_years) {
          try {
            const response = await fetch(`http://127.0.0.1:5000/${model}/${year}/data`);
            const data = await response.json();
            if (data.car_data) {
              carData.push({
                model: data.car_data[1],
                price: parseInt(data.car_data[4]),
                features: [],
                mpg: data.car_data[6] + "", // Default MPG, should be updated with actual data
                year: parseInt(year),
                engineType: "Gas", // Default engine type, should be updated with actual data
                matchScore: 75
              });
            }
          } catch (error) {
            console.error(`Error fetching data for ${model} ${year}:`, error);
          }
        }
      }
      setCars(carData);
    };

    fetchAllCarData();
  }, []);

  useEffect(() => {
    console.log(cars);
  }, [cars]);


  const filterOptions = ['Hybrid/Electric', 'SUV', 'Sedan', 'High MPG', 'Latest Models'];


  const handleFilterToggle = (filter: string) => 
    setSelectedFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);


  const sortCars = (a: CarOption, b: CarOption) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'mpg': return Number(b.mpg) - Number(a.mpg);8
      default: return 0;
    }
  };

  const filteredCars = cars
    .filter(car => car.price >= priceRange[0] && car.price <= priceRange[1])
    .sort(sortCars);

  const formatPrice = (price: number) => `$${price.toLocaleString()}`;


  const animations = {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    },
    filter: {
      active: { backgroundColor: "#D1B8E1", scale: 1.02, transition: { type: "spring", stiffness: 300 } },
      inactive: { backgroundColor: "#374151", scale: 1 }
    }
  };




  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#1C1C1C]"
    >
      

      <Header />

      <motion.h2 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="text-6xl font-light text-white mb-4"
    >
      Select and Compare
    </motion.h2>
      
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-1 bg-gray-800 p-6 rounded-lg h-fit"
          >
            <div className="mb-8">
              <h2 className="text-2xl mb-4">Price Range</h2>
              <div className="px-4">
                <Slider
                  range
                  min={15000}
                  max={100000}
                  step={1000}
                  value={priceRange}
                  onChange={(value: number | number[]) => setPriceRange(value as number[])}
                  className="mb-4"
                />
                <div className="flex justify-between text-lg">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl mb-4">Score Weights</h2>
              <div className="space-y-4">
                {Object.entries(scoreWeights).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-gray-300 mb-1 capitalize">{key}</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={value}
                      onChange={(e) => setScoreWeights(prev => ({
                        ...prev,
                        [key]: parseFloat(e.target.value)
                      }))}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-400">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl mb-4">Sort By</h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-700 text-white py-2 px-4 rounded transition-colors hover:bg-gray-600"
              >
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="mpg">Best MPG</option>
              </select>
            </div>
          </motion.div>

          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-gray-300"
            >
              {cars.length} vehicles found
            </motion.div>
            
            <motion.div 
              variants={animations.container}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence>
              {filteredCars.map(car => (
                  <CarTile key={`${car.model}-${car.year}`} car={car} />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </motion.div>
    
  );
} 