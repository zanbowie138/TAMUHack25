import React from "react"
import Link from "next/link"

const FooterComponent = () => {
  return (
    <footer className="bg-[#1C1C1C] text-gray-200 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-4xl font-bold mb-4">ToyoFit</h2>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-pink-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/finance" className="hover:text-pink-300 transition-colors">
                  Financial Page
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-pink-300 transition-colors">
                  Comparison Page
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center text-pink-300 hover:text-pink-400 transition-colors"
          >
            Back to Top
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default FooterComponent

