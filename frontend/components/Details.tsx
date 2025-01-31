'use client'
import React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const DetailsComponent = () => {
  const router = useRouter();

  const pages = [
    {
      title: "Comparison Page",
      description:
        "Use AI to generate sentiment summaries and explore a wide range of Toyota models to compare and filter through.",
      slug: "/compare",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-20 w-20 text-gray-200 transition-transform duration-300 group-hover:scale-125"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      title: "Explore Page",
      description: "Discover and search through our comprehensive collection of Toyota models and features.",
      slug: "/explore",
      svg: (
        <Search 
          className="h-20 w-20 text-gray-200 transition-transform duration-300 group-hover:scale-125"
          strokeWidth={1.5}
        />
      ),
    },
  ];

  return (
    <div className="flex items-center justify-center bg-[#1C1C1C] pt-20 pb-20">
      <div className="max-w-4xl w-full flex flex-row bg-[#1C1C1C] text-gray-200 divide-x divide-gray-600 shadow-lg rounded-lg">
        {pages.map((page, index) => (
          <div
            key={index}
            onClick={() => router.push(page.slug)}
            className="flex-1 flex flex-col items-center justify-center p-8 cursor-pointer relative group"
          >
            <div className="absolute inset-0 bg-[#a783ae] opacity-0 transition-opacity duration-300 group-hover:opacity-10 pointer-events-none"></div>
            {page.svg}
            <h2 className="text-3xl font-bold mt-6 relative z-10">{page.title}</h2>
            <p className="text-center mt-4 text-base relative z-10">{page.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailsComponent;