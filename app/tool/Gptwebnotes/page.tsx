"use client";

import React, { useState, useEffect, useRef } from 'react';

interface NoteProps {
  angle: number;     // Angle (in radians) for placement
  radius: number;    // Distance from center of container
  noteSize: number;  // Base diameter for the note circle
  initialTitle: string;
  centerX: number;
  centerY: number;
}

const Note: React.FC<NoteProps> = ({ angle, radius, noteSize, initialTitle, centerX, centerY }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [title, setTitle] = useState(""); // Initialize title as empty
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const noteContentRef = useRef<HTMLDivElement>(null);
  const [imageExpanded, setImageExpanded] = useState(false);

  // Draggable image state
  const [imagePos, setImagePos] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [initialMousePos, setInitialMousePos] = useState<{ x: number; y: number } | null>(null);

  // Keep note at its base size when not in fullscreen.
  const currentSize = noteSize;
  const x = centerX + radius * Math.cos(angle) - currentSize / 2;
  const y = centerY + radius * Math.sin(angle) - currentSize / 2;

  // Handle file drop (only active in fullscreen)
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (fullScreen && e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setImageSrc(ev.target?.result as string);
          if (noteRef.current) {
            const container = noteRef.current;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            setImagePos({
              x: (containerWidth - 100) / 2, // Center horizontally
              y: (containerHeight - 100) / 2  // Center vertically
            });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const containerStyle: React.CSSProperties = fullScreen
    ? { 
        position: "fixed", 
        top: "10%", 
        left: "10%", 
        width: "80%", 
        height: "80%", 
        zIndex: 50,
        borderRadius: "0"
      }
    : { 
        position: "absolute", 
        width: currentSize, 
        height: currentSize, 
        left: x, 
        top: y,
        overflow: "hidden"
      };
  // Note circles color notecolor
  const containerClass = fullScreen
    ? "fixed bg-black mt-10"
    : "absolute bg-red-900 duration-0 hover:bg-red-700  rounded-full";

  const handleClick = () => {
    if (!fullScreen) {
      setFullScreen(true);
    }
  };

  const handleNotepadClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target && (e.target as HTMLElement).tagName.toLowerCase() === 'img') return;
    if (fullScreen && !isDragging && !imageExpanded && noteContentRef.current) {
      const selection = window.getSelection();
      if (selection) {
        try {
          let range = document.caretRangeFromPoint(e.clientX, e.clientY);
          if (!range) {
            const textNode = document.createTextNode('');
            noteContentRef.current.appendChild(textNode);
            range = document.createRange();
            range.setStart(textNode, 0);
            range.collapse(true);
          }
          selection.removeAllRanges();
          selection.addRange(range);
          e.currentTarget.focus();
        } catch (err) {
          e.currentTarget.focus();
        }
      }
    }
  };

  // Image drag functionality
  const handleImageMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (fullScreen && !imageExpanded) {
      setMouseIsDown(true);
      setIsDragging(true);
      setDragOffset({ x: e.clientX - imagePos.x, y: e.clientY - imagePos.y });
      setHasDragged(false);
      setInitialMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (hasDragged) {
      setHasDragged(false);
      return;
    }
    if (!isDragging && fullScreen) {
      setImageExpanded(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && mouseIsDown) {
      if (initialMousePos) {
        const dx = e.clientX - initialMousePos.x;
        const dy = e.clientY - initialMousePos.y;
        if (!hasDragged && Math.sqrt(dx * dx + dy * dy) > 5) {
          setHasDragged(true);
        }
      }
      const containerRect = noteRef.current?.getBoundingClientRect();
      if (containerRect) {
        const maxX = containerRect.width - 100;
        const maxY = containerRect.height - 100;
        const newX = Math.min(Math.max(0, e.clientX - dragOffset.x), maxX);
        const newY = Math.min(Math.max(0, e.clientY - dragOffset.y), maxY);
        setImagePos({ x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setMouseIsDown(false);
    setIsDragging(false);
    setInitialMousePos(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, mouseIsDown, dragOffset]);

  return (
    <div
      ref={noteRef}
      className={`${containerClass} flex items-center justify-center cursor-pointer transition-all duration-300`}
      style={containerStyle}
      onClick={handleClick}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {!fullScreen && (
        <span className="text-white text-sm">{title || initialTitle}</span>
      )}

      {fullScreen && (
        <div className="w-full h-full relative p-2 flex flex-col items-center justify-start">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullScreen(false);
            }}
            className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 text-xs rounded"
          >
            Exit FS
          </button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-bold text-center bg-transparent text-white focus:outline-none mb-2"
            placeholder="Enter title..."
          />
          <div
            ref={noteContentRef}
            contentEditable={true}
            className="flex-1 bg-transparent text-white w-full overflow-auto cursor-text"
            style={{ minHeight: "50px" }}
            onClick={handleNotepadClick}
          >
            {/* Type your note here */}
          </div>
          {imageSrc && imageExpanded && (
            <div 
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50"
              onClick={(e) => {
                e.stopPropagation();
                setImageExpanded(false);
              }}
            >
              <div className="relative max-w-3xl max-h-3xl">
                <img
                  src={imageSrc}
                  alt="Expanded"
                  className="max-w-full max-h-screen object-contain"
                />
                <button
                  className="absolute top-4 right-4 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageExpanded(false);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Dropped"
              className={`absolute object-contain rounded ${mouseIsDown ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{
                width: "100px",
                left: imagePos.x,
                top: imagePos.y,
                userSelect: "none",
                WebkitUserSelect: "none"
              }}
              onMouseDown={handleImageMouseDown}
              onClick={handleImageClick}
              draggable={false}
            />
          )}
        </div>
      )}
    </div>
  );
};

interface TopicCircleProps {
  centerX: number;
  centerY: number;
}

const TopicCircle: React.FC<TopicCircleProps> = ({ centerX, centerY }) => {
  const size = 120; // Central circle size
  const [title, setTitle] = useState("Topic");
  return (
    <div
      className="absolute rounded-full bg-black flex items-center justify-center text-white font-bold"
      style={{
        width: size,
        height: size,
        left: centerX - size / 2,
        top: centerY - size / 2,
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-transparent text-white text-center outline-none"
      />
    </div>
  );
};

const NoteTakingApp: React.FC = () => {
  // Set up state for container dimensions and update on window resize.
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate center and note radius dynamically.
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 1.8;
  const noteRadius = Math.min(dimensions.width, dimensions.height) / 4;

  return (
    <div className="">
      <TopicCircle centerX={centerX} centerY={centerY} />
      {[
        0,
        Math.PI / 3,
        (2 * Math.PI) / 3,
        Math.PI,
        (4 * Math.PI) / 3,
        (5 * Math.PI) / 3,
      ].map((angle, index) => (
        <Note
          key={index}
          angle={angle} 
          radius={noteRadius}
          noteSize={100}
          initialTitle={`+`}
          centerX={centerX}
          centerY={centerY}
          
        />
      ))}
    </div>
  );
};

export default NoteTakingApp;