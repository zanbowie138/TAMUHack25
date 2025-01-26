'use client';
import React, { useState, useEffect } from 'react';

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
        {[...Array(placeholderCount)].map((_, index) => (
          <div 
            key={index} 
            className="w-[500px] h-[350px] bg-[#242424] rounded-[15px] flex-shrink-0 mr-8"
          />
        ))}
      </div>
    </div>
  );
}
