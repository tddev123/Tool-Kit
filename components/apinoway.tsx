'use client';


import { useState } from 'react';
import axios from 'axios';

const Nowayy = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [format, setFormat] = useState('mp3');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleConvert = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://audio-api-4det.onrender.com/convert', {
        youtube_url: youtubeUrl,
        format: format,
      });
      const { task_id } = response.data;
      setTaskId(task_id);
      setStatus('Processing...');
      checkStatus(task_id);
    } catch (error) {
      setStatus('Error occurred while converting.');
    }
  };

  const checkStatus = async (taskId: string) => {
    const interval = setInterval(async () => {
      const { data } = await axios.get(`https://audio-api-4det.onrender.com/status/${taskId}`);
      const { status, path } = data;

      setStatus(status);
      if (status === 'completed') {
        clearInterval(interval);
        setDownloadLink(path);
      }
    }, 2000); // Check every 2 seconds
  };

  const handleDownload = async () => {
    if (!taskId) return;

    try {
      const response = await axios.get(`/api/download/${taskId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted_${taskId}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      alert('Error downloading the file');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>YouTube to Audio Converter</h1>

      <div>
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
      </div>

      <div>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          style={{ padding: '8px', marginBottom: '10px' }}
        >
          <option value="mp3">MP3</option>
          <option value="wav">WAV</option>
        </select>
      </div>

      <div>
        <button
          onClick={handleConvert}
          style={{ padding: '10px', backgroundColor: 'green', color: 'white', marginRight: '10px' }}
          disabled={loading}
        >
          Convert
        </button>
        {loading && <span>Loading...</span>}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Status: {status}</h3>
        {downloadLink && (
          <button onClick={handleDownload} style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}>
            Download File
          </button>
        )}
      </div>
    </div>
  );
};

export default Nowayy;
