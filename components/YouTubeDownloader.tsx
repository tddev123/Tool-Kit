'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface DownloadProgress {
  status: 'idle' | 'downloading' | 'converting' | 'complete' | 'error';
  message: string;
}

const YouTubeDownloader: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [format, setFormat] = useState<string>('mp3');
  const [downloading, setDownloading] = useState<boolean>(false);
  const [progress, setProgress] = useState<DownloadProgress>({
    status: 'idle',
    message: ''
  });

  const handleDownload = async () => {
    if (!url) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    setDownloading(true);
    setProgress({ status: 'downloading', message: 'Starting download...' });

    try {
      // Get cookies from YouTube
      const cookies = document.cookie;
      
      // Prepare the request body
      const requestBody = {
        url: url,
        format: format,
        cookies: cookies
      };

      // Make the API request
      const response = await fetch('https://autoscreenshot.onrender.com/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending cookies
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Download failed');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const filename = `youtube_${Date.now()}.${format}`;
      
      // Create and trigger download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      setProgress({ status: 'complete', message: 'Download complete!' });
      toast.success('Download complete!');
    } catch (error) {
      console.error('Download error:', error);
      setProgress({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Download failed' 
      });
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">YouTube to MP3 Converter</h1>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            YouTube URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={downloading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="format" className="block text-sm font-medium text-gray-700">
            Output Format
          </label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={downloading}
          >
            <option value="mp3">MP3</option>
            <option value="m4a">M4A</option>
            <option value="wav">WAV</option>
          </select>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading || !url}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            downloading || !url
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {downloading ? 'Processing...' : 'Download'}
        </button>

        {progress.status !== 'idle' && (
          <div className={`mt-4 p-3 rounded-md ${
            progress.status === 'error' 
              ? 'bg-red-100 text-red-700'
              : progress.status === 'complete'
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
          }`}>
            {progress.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeDownloader;