"use client";

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const YouTubeConverter = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const isValidYouTubeUrl = (url: string) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return pattern.test(url);
  };

  const handleConvert = async () => {
    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setStatus('Starting conversion...');

      // Log the API URL being used
      console.log('Attempting to connect to:', process.env.NEXT_PUBLIC_API_URL);

      // Get the cookies from the browser (this will automatically send the cookies with the request)
      const cookies = document.cookie;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
        credentials: 'include', // Ensures cookies are sent with the request
      });

      setStatus('Received response from server...');

      // Log the response status
      console.log('Server response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error details:', errorText);
        throw new Error(`Server error: ${errorText || response.statusText}`);
      }

      setStatus('Processing response...');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      setStatus('Preparing download...');

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'converted-audio.wav';
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      setUrl('');
      setStatus('Conversion complete!');
      
    } catch (err) {
      console.error('Full error details:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          YouTube to WAV Converter
        </h1>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
              setStatus('');
            }}
            placeholder="Paste YouTube URL here"
            className="w-full"
            disabled={isLoading}
          />
          
          <Button
            onClick={handleConvert}
            disabled={!url || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Converting... Please wait</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Convert to WAV</span>
              </div>
            )}
          </Button>
        </div>

        {status && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-700">{status}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          Supported URLs: youtube.com/watch, youtu.be/
        </div>
      </div>
    </div>
  );
};

export default YouTubeConverter;
