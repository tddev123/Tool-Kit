"use client"

import { useState, FormEvent } from 'react';
import { Download, Loader } from 'lucide-react';

interface AlertProps {
  message: string;
  type: 'error' | 'success';
}

interface DownloadData {
  blob: Blob;
  filename: string;
  title: string;
}

const Alert = ({ message, type }: AlertProps) => {
  const bgColor = type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700';
  return (
    <div className={`border px-4 py-3 rounded relative ${bgColor}`} role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

const YouTubeDownloader = () => {
  const [url, setUrl] = useState<string>('');
  const [format, setFormat] = useState<string>('mp3');
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [downloadData, setDownloadData] = useState<DownloadData | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    setDownloadData(null);
    
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, format })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Conversion failed');
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `download.${format}`;
      
      // Extract title from filename (remove extension)
      const title = filename.replace(`.${format}`, '');

      setDownloadData({ blob, filename, title });
      setAlert({
        message: 'Conversion completed successfully!',
        type: 'success'
      });
      setUrl('');
    } catch (err) {
      setAlert({
        message: err instanceof Error ? err.message : 'An error occurred',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!downloadData) return;
    
    const downloadUrl = window.URL.createObjectURL(downloadData.blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadData.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">YouTube Audio Downloader</h1>
        <p className="text-gray-600">Download audio from YouTube videos</p>
      </div>

      {alert && <Alert message={alert.message} type={alert.type} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">YouTube URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full p-2 border-2 border-gray-700 rounded-md "
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full p-2 rounded-md border-2 border-gray-700 "
          >
            <option value="mp3">MP3</option>
            <option value="m4a">M4A</option>
            <option value="wav">WAV</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Converting...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Convert</span>
            </>
          )}
        </button>
      </form>

      {downloadData && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-medium text-lg mb-2">Ready for Download</h3>
          <p className="text-gray-600 mb-4">{downloadData.title}</p>
          <button
            onClick={handleDownload}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default YouTubeDownloader;