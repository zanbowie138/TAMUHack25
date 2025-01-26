import React from "react"

interface SentimentFilterProps {
  sentiments: string[]
  weights: Record<string, number>
  onChange: (sentiment: string, value: number) => void
}

export default function SentimentFilter({ sentiments, weights, onChange }: SentimentFilterProps) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Customize Your Priorities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sentiments.map((sentiment) => (
          <div key={sentiment} className="space-y-2">
            <label htmlFor={sentiment} className="text-sm font-medium text-white/80">
              {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
            </label>
            <div className="relative">
              <input
                type="range"
                id={sentiment}
                min={0}
                max={1}
                step={0.1}
                value={weights[sentiment]}
                onChange={(e) => onChange(sentiment, Number.parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white/80">
                {weights[sentiment].toFixed(1)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

