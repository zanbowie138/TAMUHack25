import React from 'react';
import CarSelector from './CarSelector';

export default function SelectorGroup() {
  return (
    <div className='flex flex-row w-full justify-center space-x-12'>
      <CarSelector />
      <CarSelector />
    </div>
  )
}