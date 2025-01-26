"use client";

import React, { useState } from "react";

import SmoothScroll from "@/components/SmoothScroll";
import LandingPage from "@/components/LandingPage";
import CarCarousel from "@/components/CarCarousel";

import ReviewAnalysis from "@/components/ReviewAnalysis";

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const reviewData = {
        'Performance': {
            label: 'Performance',
            count: { total: 2100, positive: 1750, negative: 350 },
            description: 'Customers praise the car\'s performance capabilities. The engine power and acceleration receive consistently positive feedback.',
            quotes: [
                { text: 'The acceleration is impressive, especially for this price point', hasMore: true },
                { text: 'Engine response is smooth and powerful' },
            ]
        },
        'Fuel efficiency': {
            label: 'Fuel efficiency',
            count: { total: 2336, positive: 1865, negative: 471 },
            description: 'The fuel economy is highly rated by users, particularly during highway driving.',
            quotes: [
                { text: 'Getting amazing mileage on both city and highway drives', hasMore: true },
                { text: 'Fuel efficiency exceeds EPA estimates in real-world driving', hasMore: true },
            ]
        },
        'Interior comfort': {
            label: 'Interior comfort',
            count: { total: 1800, positive: 1500, negative: 300 },
            description: 'Users appreciate the comfortable and well-designed interior space.',
            quotes: [
                { text: 'Premium feel with excellent seat comfort on long drives', hasMore: true },
                { text: 'Spacious cabin with quality materials throughout' },
            ]
        },
        'Build quality': {
            label: 'Build quality',
            count: { total: 1500, positive: 1200, negative: 300 },
            description: 'The overall build quality and reliability receive strong praise.',
            quotes: [
                { text: 'Solid construction with no rattles or squeaks', hasMore: true },
                { text: 'Exceptional fit and finish throughout' },
            ]
        },
        'Safety features': {
            label: 'Safety features',
            count: { total: 1200, positive: 1000, negative: 200 },
            description: 'Advanced safety features are highly valued by owners.',
            quotes: [
                { text: 'Comprehensive safety systems provide peace of mind', hasMore: true },
                { text: 'The collision avoidance system has already saved me once' },
            ]
        },
        'Value for money': {
            label: 'Value for money',
            count: { total: 2000, positive: 1600, negative: 400 },
            description: 'Customers find the car offers excellent value for its price point.',
            quotes: [
                { text: 'You get a lot of features for the price', hasMore: true },
                { text: 'Best value in its class by far' },
            ]
        },
        'Technology': {
            label: 'Technology',
            count: { total: 1900, positive: 1600, negative: 300 },
            description: 'The infotainment system and tech features receive positive feedback.',
            quotes: [
                { text: 'Intuitive infotainment system with great connectivity', hasMore: true },
                { text: 'All the latest tech features work seamlessly' },
            ]
        },
        'Handling': {
            label: 'Handling',
            count: { total: 2200, positive: 1800, negative: 400 },
            description: 'Driving dynamics and handling characteristics are highly rated.',
            quotes: [
                { text: 'Corners like it\'s on rails, very confidence-inspiring', hasMore: true },
                { text: 'Precise steering with excellent road feel' },
            ]
        }
    };

    const options = ['Performance', 'Fuel efficiency', 'Interior comfort', 'Build quality', 'Safety features', 'Value for money', 'Technology', 'Handling'];

    async function fetchAnalysis(category: string, reviews: string[]) {
        const response = await fetch('/api/analyze-reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category, reviews }),
        });
        return await response.json();
    }



  return (
    <SmoothScroll>
      <div className="relative">
        <LandingPage />
        <CarCarousel />
        <section className="relative w-full bg-white">
          <ReviewAnalysis
            selectedOption={selectedOption}
            reviewData={reviewData}
            options={options}
            onOptionSelect={setSelectedOption}
          />
        </section>
      </div>
    </SmoothScroll>
  );
}
