'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { models, years } from '@/config/CarList';
import { Car } from '@/config/Car';
import getImage from '@/utils/get_image';
import { motion } from 'framer-motion';

export default function CarCarousel() { 
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cars, setCars] = useState<Car[]>([
      new Car(models[0], years[0]),
      new Car(models[1], years[0]), 
      new Car(models[2], years[0])
    ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * 3);
        } while (newIndex === prevIndex);
        return newIndex;
      });
      }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCars(prevCars => {
      const newCars = [...prevCars];
      newCars[currentIndex] = new Car(
        models[Math.floor(Math.random() * models.length)],
        years[Math.floor(Math.random() * years.length)]
      );
      return newCars;
    });
  }, [currentIndex]);

  return (
    <motion.div 
      className="relative w-full overflow-hidden pt-0 pb-15"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex">
        {[0, 1, 2].map((index) => {
          const isCurrentCard = index === currentIndex;
          return (
            <motion.div
              key={index}
              className={`w-full grow h-[350px] bg-[#242424] rounded-[15px] p-2`}
              animate={{ 
                opacity: isCurrentCard ? 1 : 0.5,
                scale: isCurrentCard ? 1 : 0.8,
                filter: isCurrentCard ? "blur(0px)" : "blur(2px)",
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 30
              }}
              whileHover={isCurrentCard ? { scale: 1.05 } : {}}
            >
              <div className="p-4 text-white">
                <h3 className="text-xl font-bold capitalize">Toyota {cars[index].model}</h3>
                <p className="text-gray-400">{cars[index].year}</p>
              </div>
              <img 
                src={getImage(new Car(cars[index].model, cars[index].year))}
                alt={`${cars[index].model} ${cars[index].year}`}
                className="object-contain"
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
