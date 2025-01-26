'use client';
import CarSelector from "./components/CarSelector";
import SelectorGroup from "./components/SelectorGroup";

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
      <div className="w-full items-center justify-center text-center align-center h-20 mt-30 mb-20 text-7xl text-slate-100">
        Compare
      </div>
      <SelectorGroup />
    </>
  );
}