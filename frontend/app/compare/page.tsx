"use client";
import CarSelector from "./components/CarSelector";
import SelectorGroup from "./components/SelectorGroup";
import Header from "@/components/headers/BlockHeader";

/* TODOLIST
- add selectors with plus and remove selectors with x
- make spider chart work
- weighted formula
- AI sparkle to summary box
- sliders to adjust weights
- add details about the cars
*/

export default function Compare() {
  return (
    <>
      {/*<Header />*/}
      {/* <div className="w-full text-center mb-20 text-7xl text-slate-100">
        Compare
      </div> */}
      <Header />
      <div className="w-full text-center mb-20">
        <h1 className="text-7xl text-slate-100">Select and Compare</h1>
      </div>
      <SelectorGroup />
    </>
  );
}
