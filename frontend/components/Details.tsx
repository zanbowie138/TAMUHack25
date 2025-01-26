import React from "react"

const DetailsComponent = () => {
  const pages = [
    {
      title: "Comparison Page",
      description:
        "Use AI to generate sentiment summaries and explore a wide range of Toyota models to compare and filter through.",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="h-16 w-16 text-gray-200 transition-transform duration-300 hover:scale-110"
        >
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
        </svg>
      ),
    },
    {
      title: "Finance Page",
      description: "Explore financing options and calculate payments for your chosen Toyota model.",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="h-16 w-16 text-gray-200 transition-transform duration-300 hover:scale-110"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex items-center justify-center bg-[#1C1C1C] pt-8 pb-16">
      {" "}
      {/* Added pb-16 for bottom padding */}
      <div className="max-w-4xl w-full flex flex-row bg-[#1C1C1C] text-gray-200 divide-x divide-gray-600 shadow-lg rounded-lg">
        {pages.map((page, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-700"
          >
            {page.svg}
            <h2 className="text-2xl font-semibold mt-4">{page.title}</h2>
            <p className="text-center mt-2 text-sm">{page.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DetailsComponent

