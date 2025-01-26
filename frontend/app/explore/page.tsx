'use client';

import React, { useState } from 'react';
import Slider from 'rc-slider';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import 'rc-slider/assets/index.css';
import Header from '@/components/headers/BlockHeader';
import { useRouter } from 'next/navigation';

interface CarOption {
  model: string;
  price: number;
  image: string;
  features: string[];
  mpg: string;
  year: number;
  engineType: string;
}

export default function BudgetPage() {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([20000, 50000]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('price-low');
  
  const filterOptions = [
    'Hybrid/Electric',
    'SUV',
    'Sedan',
    'High MPG',
    'Latest Models',
  ];

  const carOptions: CarOption[] = [
    {
      model: "Toyota Corolla",
      price: 21550,
      image: "/cars/corolla.jpg",
      features: ["Fuel Efficient", "Reliable", "Low Maintenance"],
      mpg: "31/40",
      year: 2024,
      engineType: "Hybrid"
    },
    {
      model: "Toyota Camry",
      price: 26420,
      image: "/cars/camry.jpg",
      features: ["Spacious", "Comfortable", "Advanced Safety"],
      mpg: "24/35",
      year: 2023,
      engineType: "Gasoline"
    },
    {
      model: "Toyota RAV4",
      price: 27575,
      image: "/cars/rav4.jpg",
      features: ["SUV", "All-Wheel Drive", "Cargo Space"],
      mpg: "22/29",
      year: 2022,
      engineType: "Gasoline"
    },
    // Add more car options as needed
  ];

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredCars = carOptions
    .filter(car => car.price >= priceRange[0] && car.price <= priceRange[1])
    .filter(car => {
      if (selectedFilters.length === 0) return true;
      // Add filter logic based on selectedFilters
      return selectedFilters.some(filter => {
        switch(filter) {
          case 'Hybrid/Electric':
            return car.engineType === 'Hybrid' || car.engineType === 'Electric';
          case 'High MPG':
            const [city] = car.mpg.split('/').map(Number);
            return city > 30;
          case 'Latest Models':
            return car.year >= 2024;
          // Add more filter cases
          default:
            return true;
        }
      });
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'mpg':
          return Number(b.mpg.split('/')[0]) - Number(a.mpg.split('/')[0]);
        default:
          return 0;
      }
    });

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const filterVariants = {
    active: {
      backgroundColor: "#D1B8E1",
      scale: 1.02,
      transition: { type: "spring", stiffness: 300 }
    },
    inactive: {
      backgroundColor: "#374151",
      scale: 1
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
                    variants={filterVariants}
                    animate={selectedFilters.includes(filter) ? "active" : "inactive"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-2 px-4 rounded ${
                      selectedFilters.includes(filter)
                        ? 'bg-[#D1B8E1] text-white'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {filter}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
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
            </motion.div>
          </motion.div>

          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-gray-300"
            >
              {filteredCars.length} vehicles found
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredCars.map((car) => (
                  <motion.div 
                    key={car.model}
                    variants={itemVariants}
                    layout
                    whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                    className="bg-gray-700 rounded-lg overflow-hidden shadow-lg"
                  >
                    <motion.div 
                      className="h-48 bg-gray-600 relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {car.model} Image
                      </div>
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-2 right-2 bg-[#D1B8E1] text-black px-2 py-1 rounded text-sm"
                      >
                        {car.year}
                      </motion.div>
                    </motion.div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{car.model}</h3>
                      <p className="text-[#98FB98] text-lg mb-3">{formatPrice(car.price)}</p>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-4 mb-3 text-sm text-gray-300"
                      >
                        <span>MPG: {car.mpg}</span>
                        <span>{car.engineType}</span>
                      </motion.div>
                      <ul className="text-sm text-gray-300">
                        {car.features.map((feature, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="mb-1"
                          >
                            • {feature}
                          </motion.li>
                        ))}
                      </ul>
                      <div className="mt-4 flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-gradient-to-r from-white to-[#D1B8E1] text-gray-800 py-2 px-4 rounded transition-colors hover:opacity-90"
                        >
                          Learn More
                        </motion.button>
                        <motion.button 
                          whileHover={{ 
                            scale: 1.05, 
                            background: "linear-gradient(to right, white, #D1B8E1)",
                            color: "rgb(31, 41, 55)" // dark gray for contrast
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 border border-[#D1B8E1] text-[#D1B8E1] py-2 px-4 rounded transition-all"
                        >
                          Compare
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 