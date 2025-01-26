'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { models, years } from '@/config/CarList';
import { Car } from '@/config/Car';
import getImage from '@/utils/get_image';
import { motion } from 'framer-motion';

export default function CarCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = models.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % itemsToShow);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden pt-0 pb-15">
      <motion.div 
        className="flex items-center justify-center"
        animate={{
          x: `${-currentIndex * 100}%`
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut"
        }}
      >
        {models.map((model, index) => {
          const year = years[index % years.length];
          const isCurrent = index === currentIndex;
          
          return (
            <motion.div
              key={`${model}-${index}`}
              className="w-[500px] h-[350px] bg-[#242424] rounded-[15px] flex-shrink-0 mx-4"
              animate={{
                scale: isCurrent ? 1.1 : 0.9,
                filter: isCurrent ? 'blur(0px)' : 'blur(4px)',
              }}
              transition={{
                duration: 0.3
              }}
            >
              <div className="p-4 text-white">
                <h3 className="text-xl font-bold capitalize">{model}</h3>
                <p className="text-gray-400">{year}</p>
              </div>
              <motion.img 
                src={getImage(new Car(model, year))}
                alt={`${model} ${year}`}
                className="object-contain w-full h-[250px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
