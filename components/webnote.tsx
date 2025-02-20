import React, { useState } from 'react';

interface NoteProps {
  angle: number;     // Angle in radians for placement
  radius: number;    // Distance from center of container
  noteSize: number;  // Base diameter of the note circle
  initialTitle: string;
}

const Note: React.FC<NoteProps> = ({ angle, radius, noteSize, initialTitle }) => {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  // Our container is 600x600 so center is (300,300)
  const centerX = 300;
  const centerY = 300;
  // When expanded, the note grows by 50%
  const currentSize = expanded ? noteSize * 1.5 : noteSize;
  // Calculate top-left so that the circle’s center lies at the computed position
  const x = centerX + radius * Math.cos(angle) - currentSize / 2;
  const y = centerY + radius * Math.sin(angle) - currentSize / 2;

  return (
    <div
      className="absolute rounded-full bg-blue-500 flex items-center justify-center cursor-pointer transition-all duration-300"
      style={{
        width: currentSize,
        height: currentSize,
        left: x,
        top: y,
      }}
      onClick={handleClick}
    >
      {expanded ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-2">
          {/* Editable title inside the circle */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-white text-center mb-2 outline-none"
          />
          {/* Content area (allows text and images) */}
          <div
            contentEditable={true}
            className="flex-1 bg-transparent text-white outline-none overflow-auto"
          >
            {/* Your note content goes here */}
          </div>
          {/* Image upload input */}
          <input type="file" accept="image/*" className="mt-2" />
        </div>
      ) : (
        <span className="text-white text-sm">{title}</span>
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

  // Pre-calculate the note center positions for drawing connecting lines.
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

      {/* Mini note circles */}
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
