

import MediaConverter from "@/components/MediaConverter";
import ParticlesComponent from "@/components/Particles";
import YouTubeDownloader from "@/components/YouTubeDownloader";



export default async function autoscreenshotter() {
  return (
    <>
          {/* Particles component behind everything */}
          <ParticlesComponent id="particles" className="absolute inset-0 -z-100" />,
          

    {/* Content above particles */}
        <div className="bg-white -mt-28  relative z-10">
        <YouTubeDownloader/>
       
        <main className="flex-1 flex flex-col gap-6 px-4">
  <header className="text-xl font-semibold">
    Download My Python Executable
  </header>
  
  <section className="bg-blue-200 p-4 rounded-md">
    <h2 className="text-lg">Click the button to download the Python executable</h2>

    {/* Download link */}
    <a
      href="https://github.com/tddev123/y2mw-download/raw/refs/heads/main/app.exe" 
      download 
      className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
    >
      Download
    </a>
  </section>

  <footer className="mt-auto text-center">
    &copy; 2025 Your Website
  </footer>
</main>
        </div>

  
  
    </>
  );
}