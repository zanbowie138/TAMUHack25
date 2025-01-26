import React from "react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface SpiderChartProps {
  data: {
    category: string
    value: number
    fullMark: number
  }[]
}

export default function SpiderChart({ data }: SpiderChartProps) {
  return (
    <div className="w-full h-[200px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
          <PolarAngleAxis dataKey="category" tick={{ fill: "rgba(255, 255, 255, 0.8)", fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "rgba(255, 255, 255, 0.6)", fontSize: 8 }} />
          <Radar
            name="Performance"
            dataKey="value"
            stroke="rgba(255, 255, 255, 0.8)"
            fill="rgba(255, 255, 255, 0.2)"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

