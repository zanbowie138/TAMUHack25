'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { models, years } from '@/config/CarList';
import { Car } from '@/config/Car';
import getImage from '@/utils/get_image';

export default function CarCarousel() {
  const [offset, setOffset] = useState(0);
  const placeholderCount = 20;

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => {
        const newOffset = prev - 2; // controls movement
        return newOffset <= -10600 ? 0 : newOffset;
      });
    }, 50); // speed thing adjuster

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden pt-0 pb-15"> 
      <div 
        className="flex transition-transform duration-[50ms] ease-linear" 
        style={{ transform: `translateX(${offset}px)` }}
      >
        {models.map((model, index) => (
          <div 
            key={index} 
            className="w-[500px] h-[350px] bg-[#242424] rounded-[15px] flex-shrink-0 mr-8"
          >
            <Image src={getImage(new Car(model, years[index % years.length]))} alt={`${model} Image`} fill className="object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
