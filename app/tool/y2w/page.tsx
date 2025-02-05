

import MediaConverter from "@/components/MediaConverter";
import ParticlesComponent from "@/components/Particles";
import YouTubeDownloader from "@/components/YouTubeDownloader";



export default async function autoscreenshotter() {
  return (
    <>
          {/* Particles component behind everything */}
          <ParticlesComponent id="particles" className="absolute inset-0 -z-100" />,
          

    {/* Content above particles */}
    <div className=" -mt-28 relative z-10">
    <main className="flex flex-col items-center gap-8 px-6 py-10 bg-black bg-opacity-75 rounded-xl shadow-xl">
    <header className="text-3xl font-extrabold text-white text-center mb-4">
      Highest Quality Youtube To Audio Converter On The Internet
    </header>

    {/* Download button section */}
    <section className="flex flex-col items-center">
      <a
        href="https://github.com/tddev123/y2mw-download/raw/refs/heads/main/Youtube2mp3.exe"
        download
        className="inline-block bg-gradient-to-r from-yellow-400 to-orange-600 text-black font-semibold text-lg px-12 py-5 rounded-xl shadow-lg hover:from-orange-600 hover:to-yellow-400 transform hover:scale-105 transition-all duration-300"
      >
        Download Now
      </a>
    </section>
  </main>



</div>

<footer className=" text-center text-sm text-white opacity-70 mt-6">
    &copy; 2025 Your Website | All Rights Reserved
  </footer>
  
  
    </>
  );
}