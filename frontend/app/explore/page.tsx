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

interface CarOption {
  model: string;
  price: number;
  features: string[];
  mpg: string;
  year: number;
  engineType: string;
}

export default function Explore() {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([20000, 50000]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('price-low');

  const car_models = ['prius', 'camry', 'corolla', 'highlander', 'rav4', 'sienna', 'tacoma', 'tundra']
  const car_years = ['2025', '2024', '2023', '2022', '2021', '2020']

  const [cars, setCars] = useState<CarOption[]>([]);


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
                price: parseInt(data.car_data[2]),
                features: [],
                mpg: "30/35", // Default MPG, should be updated with actual data
                year: parseInt(year),
                engineType: "Gas" // Default engine type, should be updated with actual data
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

  const filterCar = (car: CarOption) => {
    if (selectedFilters.length === 0) return true;
    return selectedFilters.some(filter => {
      switch(filter) {
        case 'Hybrid/Electric': return car.engineType === 'Hybrid' || car.engineType === 'Electric';
        case 'High MPG': return Number(car.mpg.split('/')[0]) > 30;
        case 'Latest Models': return car.year >= 2024;
        default: return true;
      }
    });
  };

  const sortCars = (a: CarOption, b: CarOption) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'mpg': return Number(b.mpg.split('/')[0]) - Number(a.mpg.split('/')[0]);
      default: return 0;
    }
  };

  // const filteredCars = cars
  //   .filter(car => car.price >= priceRange[0] && car.price <= priceRange[1])
  //   .filter(filterCar)
  //   .sort(sortCars);

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
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8"
    >
      <motion.button 
        whileHover={{ x: -5 }}
        onClick={() => router.push('/')} 
        className="absolute top-8 left-8 flex items-center text-gray-300 hover:text-white"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Home
      </motion.button>

      <Header />

      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold text-center mb-12"
      >
        Find Cars Within Your Budget
      </motion.h1>
      
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
              <h2 className="text-2xl mb-4">Filters</h2>
              <div className="space-y-2">
                {filterOptions.map(filter => (
                  <motion.button
                    key={filter}
                    onClick={() => handleFilterToggle(filter)}
                    variants={animations.filter}
                    animate={selectedFilters.includes(filter) ? "active" : "inactive"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-2 px-4 rounded ${
                      selectedFilters.includes(filter) ? 'bg-[#D1B8E1] text-white' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {filter}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl mb-4">Sort By</h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600"
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
                {cars.map(CarTile)}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}