import React from "react"
import Link from "next/link"
import { ChevronUp } from "lucide-react"

const FooterComponent = () => {
  return (
    <footer className="bg-[#1C1C1C] text-gray-200 py-8">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-end">
        <div className="flex items-end">
          <h2 className="text-9xl italic font-bold text-white -ml-2 opacity-10">
            Kaizen
          </h2>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="ml-12 mb-4 rounded-full p-2 border border-white/40 transition-all hover:border-white"
            style={{
              backgroundColor: "transparent",
            }}
          >
            <ChevronUp className="h-10 w-10 text-white opacity-40" />
          </button>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-gray-200 transition-colors opacity-50 hover:opacity-100 hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/finance" className="text-gray-200 transition-colors opacity-50 hover:opacity-100 hover:underline">
                Financial Page
              </Link>
            </li>
            <li>
              <Link href="/compare" className="text-gray-200 transition-colors opacity-50 hover:opacity-100 hover:underline">
                Comparison Page
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}

export default FooterComponent