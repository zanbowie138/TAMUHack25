"use client";

import React, { useState } from 'react';
import ReviewAnalysis from '../../components/ReviewAnalysis';

export default function Home() {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const reviewData = {
        'Sound quality': {
            label: 'Sound quality',
            count: { total: 2100, positive: 1750, negative: 350 },
            description: 'Customers appreciate the Echo Dot\'s sound quality. They find the sound powerful for a small unit that conveniently fits in many spaces.',
            quotes: [
                { text: 'The sound quality is impressive for such a compact device', hasMore: true },
                { text: 'Crystal clear audio that fills the room perfectly' },
            ]
        },
        'Functionality': {
            label: 'Functionality',
            count: { total: 2336, positive: 1865, negative: 471 },
            description: 'Customers like the functionality of the digital device. They say it works well, is a good device, and its small size makes it easy to use.',
            quotes: [
                { text: 'Highly recommend it for anyone looking for style, functionality, and affordability all in one!', hasMore: true },
                { text: 'I feel more informed and safer with Alexa.', hasMore: true },
            ]
        },
        // Add more options as needed
    };

    const options = ['Sound quality', 'Functionality', 'Design', 'Ease of setup', 'Size', 'Value for money', 'Music playback', 'Alexa integration'];

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
        <ReviewAnalysis
            selectedOption={selectedOption}
            reviewData={reviewData}
            options={options}
            onOptionSelect={setSelectedOption}
        />
    );
}