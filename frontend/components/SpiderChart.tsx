import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface SpiderChartProps {
  data: {
    category: string;
    value: number;
    fullMark: number;
  }[];
}

export default function SpiderChart({ data }: SpiderChartProps) {
  return (
    <div className="w-full h-[250px] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Model Performance"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
} 