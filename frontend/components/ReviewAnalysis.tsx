import React from 'react';

interface SentimentData {
  total: number;
  positive: number;
  negative: number;
}

interface ReviewOption {
  label: string;
  count: SentimentData;
  description: string;
  quotes: Array<{ text: string, hasMore?: boolean }>;
}

interface ReviewAnalysisProps {
  selectedOption: string | null;
  reviewData: Record<string, ReviewOption>;
  options: string[];
  onOptionSelect: (option: string) => void;
}

export default function ReviewAnalysis({ 
  selectedOption, 
  reviewData, 
  options,
  onOptionSelect 
}: ReviewAnalysisProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Customers say</h2>
        <p className="text-gray-700 mb-4">
          {selectedOption 
            ? reviewData[selectedOption]?.description 
            : "Select a category to see what customers are saying"}
        </p>
        <p className="text-gray-500 text-sm">AI-generated from the text of customer reviews</p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg mb-2">Select to learn more</h3>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border
                ${selectedOption === option 
                  ? 'border-blue-500 text-blue-500' 
                  : 'border-gray-300 hover:border-gray-400'}`}
              onClick={() => onOptionSelect(option)}
            >
              <span className="text-green-600">✓</span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {selectedOption && reviewData[selectedOption] && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-medium">{reviewData[selectedOption].count.total}</span>
              <span className="text-gray-600"> customers mention "{selectedOption}"</span>
            </div>
            <div className="flex gap-4">
              <span className="text-green-600">
                {reviewData[selectedOption].count.positive} positive
              </span>
              <span className="text-red-500">
                {reviewData[selectedOption].count.negative} negative
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {reviewData[selectedOption].quotes.map((quote, index) => (
              <div key={index} className="border-b border-gray-100 pb-4">
                <p className="text-gray-800">"{quote.text}"</p>
                {quote.hasMore && (
                  <button className="text-blue-500 text-sm mt-1">
                    Read more›
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 