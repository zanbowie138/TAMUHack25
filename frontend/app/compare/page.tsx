'use client';
import CarSelector from "./components/CarSelector";
import SelectorGroup from "./components/SelectorGroup";



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