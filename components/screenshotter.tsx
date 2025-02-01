"use client";

import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Screenshotter: React.FC = () => {
  const [numScreenshots, setNumScreenshots] = useState<number>(1);
  const [intervalTime, setIntervalTime] = useState<number>(0.5);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [counter, setCounter] = useState<number>(0); // Counter for screenshots taken
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScreenshot = () => {
    setIsRunning(true);
    setScreenshots([]); // Clear previous screenshots
    setCounter(0); // Reset counter
    let count = 0;

    const takeScreenshot = () => {
      if (count >= numScreenshots) {
        stopScreenshot();
        return;
      }

      html2canvas(document.body).then((canvas) => {
        const screenshot = canvas.toDataURL("image/png");
        setScreenshots((prev) => [...prev, screenshot]);
        setCounter((prev) => prev + 1); // Increment counter
        count++;
      });

      intervalRef.current = setTimeout(takeScreenshot, intervalTime * 1000);
    };

    takeScreenshot();
  };

  const stopScreenshot = () => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
    setIsRunning(false);
  };

  const downloadScreenshots = () => {
    const zip = new JSZip();
    screenshots.forEach((screenshot, index) => {
      const base64Data = screenshot.split(",")[1];
      zip.file(`screenshot-${index + 1}.png`, base64Data, { base64: true });
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "screenshots.zip");
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Automatic Screenshotter
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Number of Screenshots */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Screenshots (1-100):
          </label>
          <select
            value={numScreenshots}
            onChange={(e) => setNumScreenshots(Number(e.target.value))}
            disabled={isRunning}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 100 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Interval Between Screenshots */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interval Between Screenshots (0.5-5 seconds):
          </label>
          <select
            value={intervalTime}
            onChange={(e) => setIntervalTime(Number(e.target.value))}
            disabled={isRunning}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((value) => (
              <option key={value} value={value}>
                {value} seconds
              </option>
            ))}
          </select>
        </div>

        {/* Counter */}
        <div className="mb-6 text-center">
          <p className="text-lg font-medium text-gray-700">
            Screenshots Taken:{" "}
            <span className="font-bold text-blue-600">{counter}</span>/
            <span className="font-bold text-gray-800">{numScreenshots}</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={startScreenshot}
            disabled={isRunning}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Start
          </button>
          <button
            onClick={stopScreenshot}
            disabled={!isRunning}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Stop
          </button>
        </div>

        {/* Download Button */}
        {screenshots.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={downloadScreenshots}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Download Screenshots
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Screenshotter;