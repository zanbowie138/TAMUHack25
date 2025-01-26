import React, { useState } from 'react';
import CarSelector from './CarSelector';
import { CirclePlus } from 'lucide-react';

export default function SelectorGroup() {
  const[numSelectors, setNumSelectors] = useState(2)

  return (
    <div className='flex flex-row w-full justify-center space-x-12'>
      <CarSelector />
      <div className='fixed left-1/2 border-l-2 border-gray-300 h-full' style={{ height: '100vh' }}></div>
      <CarSelector /> {/* TODO: allow it to add more selectors and remove selectors */}
      {/* {numSelectors < 4 ? <button onClick={() => setNumSelectors(numSelectors + 1)}><CirclePlus color='#ffffff' strokeWidth={1} className='w-20 h-auto'/></button> : <></>} */}
    </div>
  )
}