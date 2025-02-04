import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { Readable } from 'stream';

async function downloadFromUrl(url: string, format: string) {
  // Set up yt-dlp command to output to stdout
  const args = [
    '-x',
    '--audio-format', format,
    '--audio-quality', '320',
    '-o', '-', // Output to stdout
    url
  ];

  try {
    const ytDlp = spawn('yt-dlp', args);
    const ffmpeg = spawn('ffmpeg', [
      '-i', 'pipe:0',  // Read from stdin
      '-f', format,    // Set output format
      '-acodec', format === 'mp3' ? 'libmp3lame' : format,
      '-ab', '320k',   // Audio bitrate
      'pipe:1'         // Output to stdout
    ]);

    // Pipe yt-dlp output to ffmpeg
    ytDlp.stdout.pipe(ffmpeg.stdin);

    // Get video info for the filename
    const infoProcess = spawn('yt-dlp', ['--get-title', url]);
    const title = await new Promise<string>((resolve, reject) => {
      let titleData = '';
      infoProcess.stdout.on('data', (data) => titleData += data);
      infoProcess.on('close', () => resolve(titleData.trim()));
      infoProcess.on('error', reject);
    });

    // Create readable stream from ffmpeg output
    const stream = new Readable();
    stream._read = () => {};

    ffmpeg.stdout.on('data', (chunk) => {
      stream.push(chunk);
    });

    ffmpeg.stdout.on('end', () => {
      stream.push(null);
    });

    // Handle errors
    ytDlp.stderr.on('data', (data) => console.error(`yt-dlp error: ${data}`));
    ffmpeg.stderr.on('data', (data) => console.error(`ffmpeg error: ${data}`));

    return {
      stream,
      title: `${title}.${format}`.replace(/[/\\?%*:|"<>]/g, '-') // Sanitize filename
    };

  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { url, format } = await req.json();

    if (!url || !format) {
      return NextResponse.json({ error: 'No URL or format provided' }, { status: 400 });
    }

    const { stream, title } = await downloadFromUrl(url, format);

    // Create response with proper headers for download
    const response = new NextResponse(stream as any, {
      headers: {
        'Content-Type': format === 'mp3' ? 'audio/mpeg' : `audio/${format}`,
        'Content-Disposition': `attachment; filename="${title}"`,
      },
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}