"use client"

import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const MediaConverter: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoQuality, setVideoQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [audioQuality, setAudioQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [processing, setProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const ffmpegRef = useRef(new FFmpeg());
  const progressHandlerRef = useRef<(({ message }: { message: string }) => void) | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const url = URL.createObjectURL(new Blob([arrayBuffer], { type: file.type }));
        setAudio(url);
        
        try {
          const audioContext = new AudioContext();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          setAudioDuration(audioBuffer.duration);
        } catch (error) {
          console.error('Error decoding audio:', error);
          setAudioDuration(0);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleConvertToVideo = async () => {
    const imageFile = imageInputRef.current?.files?.[0];
    const audioFile = audioInputRef.current?.files?.[0];

    if (!imageFile || !audioFile || !audioDuration) return;

    setProcessing(true);
    setProgress(0);
    const ffmpeg = ffmpegRef.current;

    try {
      if (!ffmpeg.loaded) await ffmpeg.load();

      await ffmpeg.writeFile(imageFile.name, await fetchFile(imageFile));
      await ffmpeg.writeFile(audioFile.name, await fetchFile(audioFile));

      progressHandlerRef.current = ({ message }: { message: string }) => {
        const timeMatch = message.match(/time=(\d+:\d+:\d+\.\d+)/);
        if (timeMatch) {
          const timeParts = timeMatch[1].split(':').map(parseFloat);
          const totalSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
          const calculatedProgress = (totalSeconds / audioDuration) * 100;
          setProgress(Math.min(calculatedProgress, 100));
        }
      };

      ffmpeg.on('log', progressHandlerRef.current);

      const outputWidth = aspectRatio === '16:9' ? 1280 : 720;
      const outputHeight = aspectRatio === '16:9' ? 720 : 1280;
      const videoBitrates = { low: '500k', medium: '1000k', high: '5000k' };
      const audioBitrates = { low: '64k', medium: '128k', high: '320k' };

      await ffmpeg.exec([
        '-loop', '1',
        '-i', imageFile.name,
        '-i', audioFile.name,
        '-vf', `scale=${outputWidth}:${outputHeight}:force_original_aspect_ratio=decrease,` +
               `pad=${outputWidth}:${outputHeight}:-1:-1,setsar=1`,
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-tune', 'stillimage',
        '-b:v', videoBitrates[videoQuality],
        '-c:a', 'aac',
        '-b:a', audioBitrates[audioQuality],
        '-shortest',
        '-movflags', '+faststart',
        '-pix_fmt', 'yuv420p',
        '-y',
        'output.mp4'
      ]);

      const outputData = await ffmpeg.readFile('output.mp4');
      const blob = new Blob([outputData], { type: 'video/mp4' });
      setVideoUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      if (progressHandlerRef.current) {
        ffmpeg.off('log', progressHandlerRef.current);
      }
      setProcessing(false);
    }
  };

  return (
    <div className="container">
      <h1>Media Converter</h1>
      
      <div className="controls">
        <div className="input-group">
          <label>
            Upload Image:
            <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} />
          </label>
          {image && <img src={image} alt="Preview" className="preview" />}
        </div>

        <div className="input-group">
          <label>
            Upload Audio:
            <input type="file" accept="audio/*" ref={audioInputRef} onChange={handleAudioChange} />
          </label>
          {audio && <audio src={audio} controls className="preview" />}
        </div>

        <div className="settings">
          <div className="setting-group">
            <label>Aspect Ratio:</label>
            <div>
              <label>
                <input
                  type="radio"
                  value="16:9"
                  checked={aspectRatio === '16:9'}
                  onChange={() => setAspectRatio('16:9')}
                />
                16:9 (Landscape)
              </label>
              <label>
                <input
                  type="radio"
                  value="9:16"
                  checked={aspectRatio === '9:16'}
                  onChange={() => setAspectRatio('9:16')}
                />
                9:16 (Portrait)
              </label>
            </div>
          </div>

          <div className="setting-group">
            <label>Video Quality:</label>
            <select
              value={videoQuality}
              onChange={(e) => setVideoQuality(e.target.value as typeof videoQuality)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Audio Quality:</label>
            <select
              value={audioQuality}
              onChange={(e) => setAudioQuality(e.target.value as typeof audioQuality)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleConvertToVideo}
          disabled={processing || !image || !audio}
          className="convert-button"
        >
          {processing ? 'Processing...' : 'Convert to Video'}
        </button>

        {processing && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {Math.round(progress)}% Complete
              <br />
              Estimated time remaining: {Math.round((audioDuration * (100 - progress)) / 100)}s
            </div>
          </div>
        )}

        {videoUrl && (
          <div className="video-output">
            <h2>Output Video:</h2>
            <ReactPlayer 
              url={videoUrl} 
              controls 
              width={aspectRatio === '16:9' ? '640px' : '360px'}
              height={aspectRatio === '16:9' ? '360px' : '640px'}
            />
            <a href={videoUrl} download="output.mp4" className="download-button">
              Download Video
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .controls {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .preview {
          display: block;
          max-width: 200px;
          margin-top: 10px;
        }

        .settings {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .setting-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .convert-button {
          padding: 12px 24px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }

        .convert-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .progress-container {
          margin: 20px 0;
          width: 100%;
        }

        .progress-bar {
          height: 20px;
          background-color: #eee;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background-color: #4caf50;
          transition: width 0.3s ease;
        }

        .progress-text {
          margin-top: 5px;
          text-align: center;
          font-size: 0.9em;
        }

        .video-output {
          margin-top: 30px;
          text-align: center;
        }

        .download-button {
          display: inline-block;
          margin-top: 15px;
          padding: 10px 20px;
          background: #28a745;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default MediaConverter;