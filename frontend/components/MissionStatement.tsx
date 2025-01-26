'use client'    
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const AboutSection = () => {
  return (
    <div className="flex items-center justify-between p-8 bg-[#242424]">
      <div className="w-1/2 pr-8 pl-24"> 
        <div className="mb-4">
          <p className="text-sm text-gray-600">What is</p>
          <h2 
            className="text-4xl font-bold bg-gradient-to-r from-white to-pink-300 bg-clip-text text-transparent leading-tight pb-2"
          >
            ToyoFit
          </h2>
        </div>
        <p className="font-poppins font-extralight text-xl text-[#C8C8C8] opacity-80">
          Shopping for your next Toyota just got smarter. ToyoFit blends advanced sentiment analysis with a user-friendly interface, guiding you to vehicles that match your needs and desires. Whether you value reliability, performance, or family-friendly design, our tool curates options based on what real people love. Experience the innovation of Toyota, now tailored for you.
        </p>
      </div>
      <div className="w-1/2">
        <DotLottieReact
          src="https://lottie.host/76a24824-4143-42a0-a893-092156ebf6d2/MIkQNy2FyW.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
};

export default AboutSection;

