"use client";

import React, { useState, useEffect, useRef } from 'react';

// Define color options for note circles
const colorOptions = [
  { base: "bg-gray-500", hover: "hover:bg-gray-600" },
  { base: "bg-green-500", hover: "hover:bg-green-600" },
  { base: "bg-red-500", hover: "hover:bg-red-600" },
  { base: "bg-blue-500", hover: "hover:bg-blue-600" },
  { base: "bg-yellow-500", hover: "hover:bg-yellow-600" },
  { base: "bg-orange-500", hover: "hover:bg-orange-600" },
  { base: "bg-purple-500", hover: "hover:bg-purple-600" },
  { base: "bg-black", hover: "hover:bg-gray-800" },
  { base: "bg-pink-500", hover: "hover:bg-pink-600" },
  { base: "bg-yellow-800", hover: "hover:bg-yellow-900" },
];

interface NoteProps {
  angle?: number;
  radius?: number;
  noteSize: number;
  initialTitle: string;
  centerX: number;
  centerY: number;
  isMini?: boolean;
  overridePosition?: { x: number; y: number };
  onDelete?: () => void;
}

const Note: React.FC<NoteProps> = ({
  angle = 0,
  radius = 0,
  noteSize,
  initialTitle,
  centerX,
  centerY,
  isMini = false,
  overridePosition,
  onDelete,
}) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [title, setTitle] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const noteContentRef = useRef<HTMLDivElement>(null);
  const [imageExpanded, setImageExpanded] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [miniNotes, setMiniNotes] = useState([false, false, false]);

  // Draggable image state
  const [imagePos, setImagePos] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [initialMousePos, setInitialMousePos] = useState<{ x: number; y: number } | null>(null);

  const currentSize = noteSize;
  const posX = overridePosition ? overridePosition.x : centerX + radius * Math.cos(angle) - currentSize / 2;
  const posY = overridePosition ? overridePosition.y : centerY + radius * Math.sin(angle) - currentSize / 2;

  const currentColor = colorOptions[colorIndex % colorOptions.length];

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
              x: (containerWidth - 100) / 2,
              y: (containerHeight - 100) / 2,
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
        borderRadius: "0",
      }
    : {
        position: "absolute",
        width: currentSize,
        height: currentSize,
        left: posX,
        top: posY,
        overflow: "hidden",
      };
  const containerClass = fullScreen
    ? "fixed bg-black mt-10"
    : `absolute ${currentColor.base} duration-0 ${currentColor.hover} rounded-full`;

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

  // Mini notes logic (only for main notes, not mini notes)
  let miniNotesElements = null;
  if (!isMini && !fullScreen) {
    const miniNoteSize = noteSize * 0.35; // 50px for mini notes if noteSize is 100px
    const additionalRadius = noteSize / 2 + miniNoteSize / 2 + 20; // e.g., 50 + 25 + 20 = 95px
    const miniNoteRadius = radius + additionalRadius; // Places mini notes outside main note circle
    const ux = Math.cos(angle); // Radial unit vector x-component
    const uy = Math.sin(angle); // Radial unit vector y-component
    const offset = (miniNoteSize + 40) / 2; // distance between mini notes, Tangential offset, e.g., (50 + 10) / 2 = 30px

    // Calculate centers for mini notes, positioned tangentially
    const miniNoteCenters = [
      {
        cx: centerX + miniNoteRadius * ux - offset * uy,
        cy: centerY + miniNoteRadius * uy + offset * ux,
      },
      {
        cx: centerX + miniNoteRadius * ux,
        cy: centerY + miniNoteRadius * uy,
      },
      {
        cx: centerX + miniNoteRadius * ux + offset * uy,
        cy: centerY + miniNoteRadius * uy - offset * ux,
      },
    ];

    // Calculate top-left positions from centers
    const miniNotePositions = miniNoteCenters.map(({ cx, cy }) => ({
      x: cx - miniNoteSize / 2,
      y: cy - miniNoteSize / 2,
    }));

    miniNotesElements = miniNotes.map((isOccupied, i) => (
      isOccupied ? (
        <Note
          key={i}
          overridePosition={miniNotePositions[i]}
          isMini={true}
          noteSize={miniNoteSize}
          initialTitle="+"
          centerX={centerX}
          centerY={centerY}
          angle={0}
          radius={0}
          onDelete={() => {
            setMiniNotes((prev) => {
              const newMiniNotes = [...prev];
              newMiniNotes[i] = false;
              return newMiniNotes;
            });
          }}
        />
      ) : (
        <div
          key={i}
          className="absolute bg-gray-500 rounded-full flex items-center justify-center text-white cursor-pointer"
          style={{
            left: miniNotePositions[i].x,
            top: miniNotePositions[i].y,
            width: miniNoteSize,
            height: miniNoteSize,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setMiniNotes((prev) => {
              const newMiniNotes = [...prev];
              newMiniNotes[i] = true;
              return newMiniNotes;
            });
          }}
        >
          +
        </div>
      )
    ));
  }

  return (
    <>
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
                setColorIndex((prev) => (prev + 1) % colorOptions.length);
              }}
              className={`absolute top-2 left-2 ${currentColor.base} text-white px-2 py-1 text-xs rounded`}
            >
              Change Color
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFullScreen(false);
              }}
              className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 text-xs rounded"
            >
              Done
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
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Are you sure you want to permanently delete this note?")) {
                  onDelete?.();
                }
              }}
              className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded"
            >
              Delete Note
            </button>
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
                  WebkitUserSelect: "none",
                }}
                onMouseDown={handleImageMouseDown}
                onClick={handleImageClick}
                draggable={false}
              />
            )}
          </div>
        )}
      </div>
      {miniNotesElements}
    </>
  );
};

interface TopicCircleProps {
  centerX: number;
  centerY: number;
}

const TopicCircle: React.FC<TopicCircleProps> = ({ centerX, centerY }) => {
  const size = 120;
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
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [notes, setNotes] = useState([
    { id: 0, angle: 0 },
    { id: 1, angle: Math.PI / 3 },
    { id: 2, angle: (2 * Math.PI) / 3 },
    { id: 3, angle: Math.PI },
    { id: 4, angle: (4 * Math.PI) / 3 },
    { id: 5, angle: (5 * Math.PI) / 3 },
  ]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 1.8;
  const noteRadius = Math.min(dimensions.width, dimensions.height) / 4;

  return (
    <div className="">
      <TopicCircle centerX={centerX} centerY={centerY} />
      {notes.map((note) => (
        <Note
          key={note.id}
          angle={note.angle}
          radius={noteRadius}
          noteSize={100}
          initialTitle={`+`}
          centerX={centerX}
          centerY={centerY}
          onDelete={() => {
            setNotes((prev) => prev.filter((n) => n.id !== note.id));
          }}
        />
      ))}
    </div>
  );
};

export default NoteTakingApp;