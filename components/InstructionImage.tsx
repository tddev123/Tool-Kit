'use client'; // This ensures it's a Client Component

import React, { useState } from 'react';

interface InstructionImageProps {
  src: string;
  alt: string;
  fullSizeSrc: string;
  step: string;
}

const InstructionImage: React.FC<InstructionImageProps> = ({ src, alt, fullSizeSrc }) => {
  const [showDimensions, setShowDimensions] = useState(false);

  const handleMouseEnter = (event: React.MouseEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    console.log(`Image dimensions: ${naturalWidth} x ${naturalHeight}`);
    setShowDimensions(true);
  };

  const handleMouseLeave = () => {
    setShowDimensions(false);
  };

  return (
    <div className="relative group">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-150 transform scale-100 cursor-pointer"
        onClick={() => window.open(fullSizeSrc)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Display image dimensions on hover */}
      {showDimensions && (
        <div className="absolute top-2 left-2  text-white p-2 rounded-md opacity-75">
          
        </div>
      )}
    </div>
  );
};

export default InstructionImage;
