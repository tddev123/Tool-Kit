"use client"


import React, { useState, useEffect } from 'react';

interface NoteProps {
  angle: number;     // Angle (in radians) for placement
  radius: number;    // Distance from center of container
  noteSize: number;  // Base diameter of the note circle
  initialTitle: string;
}

const Note: React.FC<NoteProps> = ({ angle, radius, noteSize, initialTitle }) => {
  const [expanded, setExpanded] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // State for draggable image (only active in full screen mode)
  const [imagePos, setImagePos] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Our container is 600x600 so center is (300,300)
  const centerX = 300;
  const centerY = 300;
  const currentSize = expanded ? noteSize * 1.5 : noteSize;
  const x = centerX + radius * Math.cos(angle) - currentSize / 2;
  const y = centerY + radius * Math.sin(angle) - currentSize / 2;

  // Handle drag & drop for images (non-fullscreen, simply sets imageSrc)
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setImageSrc(ev.target?.result as string);
          // Reset image position when a new image is dropped.
          setImagePos({ x: 20, y: 20 });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // When in full screen, update container style and class accordingly.
  const containerStyle: React.CSSProperties = fullScreen
    ? { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 50 }
    : { position: "absolute", width: currentSize, height: currentSize, left: x, top: y };

  // Use bg-black when full screen, otherwise blue.
  const containerClass = fullScreen
    ? "fixed bg-black"
    : "absolute bg-blue-500";

  // Toggle expanded state on click (unless in full screen so clicks on inner elements work)
  const handleClick = () => {
    if (!fullScreen) {
      setExpanded(!expanded);
    }
  };

  // Handlers for dragging the image inside a full screen note
  const handleImageMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - imagePos.x,
      y: e.clientY - imagePos.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setImagePos({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      className={`${containerClass} rounded-full flex items-center justify-center cursor-pointer transition-all duration-300`}
      style={containerStyle}
      onClick={handleClick}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* When not expanded, simply show the title */}
      {!expanded && (
        <span className="text-white text-sm">{title}</span>
      )}

      {/* Expanded view */}
      {expanded && (
        <div
          className="w-full h-full relative p-2 flex flex-col items-center justify-center"
        >
          {/* Fullscreen toggle button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullScreen(!fullScreen);
            }}
            className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 text-xs rounded"
          >
            {fullScreen ? "Exit FS" : "Full Screen"}
          </button>
          {/* Editable title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-white text-center mb-2 outline-none w-full"
            placeholder="Title"
          />
          {/* Content-editable area */}
          <div
            contentEditable={true}
            className="flex-1 bg-transparent text-white outline-none w-full overflow-auto"
            style={{ minHeight: "50px" }}
          >
            {/* Type your note here */}
          </div>
          {/* Display dropped image */}
          {imageSrc && fullScreen ? (
            // Draggable image inside full screen note
            <img
              src={imageSrc}
              alt="Dropped"
              className="absolute object-contain rounded cursor-move"
              style={{
                width: "100px",
                left: imagePos.x,
                top: imagePos.y,
              }}
              onMouseDown={handleImageMouseDown}
            />
          ) : imageSrc ? (
            // Non-draggable image in non-fullscreen mode
            <img
              src={imageSrc}
              alt="Dropped"
              className="mt-2 max-w-[50%] max-h-[50%] object-contain rounded"
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

const TopicCircle: React.FC = () => {
  const size = 100;
  return (
    <div
      className="absolute rounded-full bg-green-500 flex items-center justify-center text-white font-bold"
      style={{
        width: size,
        height: size,
        left: 300 - size / 2,
        top: 300 - size / 2,
      }}
    >
      Topic
    </div>
  );
};

const NoteTakingApp: React.FC = () => {
  const radius = 150;  // Distance from center to note centers
  const noteSize = 80; // Base size (diameter) for mini note circles
  const angles = [
    0,
    Math.PI / 3,
    (2 * Math.PI) / 3,
    Math.PI,
    (4 * Math.PI) / 3,
    (5 * Math.PI) / 3,
  ];

  // Pre-calculate positions for drawing connecting lines.
  const center = { x: 300, y: 300 };
  const notePositions = angles.map((angle) => ({
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle),
  }));

  return (
    <div className="relative w-[600px] h-[600px] mx-auto my-20 bg-gray-800">
      {/* SVG overlay for connecting lines */}
      <svg className="absolute inset-0" width="600" height="600">
        {notePositions.map((pos, index) => (
          <line
            key={index}
            x1={center.x}
            y1={center.y}
            x2={pos.x}
            y2={pos.y}
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>
      {/* Central topic circle */}
      <TopicCircle />
      {/* Surrounding note circles */}
      {angles.map((angle, index) => (
        <Note
          key={index}
          angle={angle}
          radius={radius}
          noteSize={noteSize}
          initialTitle={`Note ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default NoteTakingApp;
