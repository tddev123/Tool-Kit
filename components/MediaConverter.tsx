'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

// Dynamically import ReactPlayer with SSR disabled
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false
});

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
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const progressHandlerRef = useRef<(({ message }: { message: string }) => void) | null>(null);

  // Initialize FFmpeg on the client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadFFmpeg = async () => {
        try {
          const FFmpeg = (await import('@ffmpeg/ffmpeg')).FFmpeg;
          const instance = new FFmpeg();
          await instance.load();
          setFFmpeg(instance);
        } catch (error) {
          console.error('Error loading FFmpeg:', error);
        }
      };
      loadFFmpeg();
    }
  }, []);

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
    if (file && typeof window !== 'undefined') {
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
    if (!ffmpeg) {
      console.error('FFmpeg not initialized');
      return;
    }

    const imageFile = imageInputRef.current?.files?.[0];
    const audioFile = audioInputRef.current?.files?.[0];

    if (!imageFile || !audioFile || !audioDuration) return;

    setProcessing(true);
    setProgress(0);

    try {
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

  // Rest of your JSX and styles remain the same
  return (
    <div className="container">
      {/* Your existing JSX */}
    </div>
  );
};

export default MediaConverter;