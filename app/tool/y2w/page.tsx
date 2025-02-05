

import InstructionImage from "@/components/InstructionImage";
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
    import InstructionImage from './components/InstructionImage'; // Adjust the path as necessary

<main className="flex flex-col mt items-center gap-8 px-6 py-10 bg-black bg-opacity-75 rounded-xl shadow-xl">
  <header className="text-3xl font-extrabold text-white text-center mb-10">
    Highest Quality Youtube To Audio Converter On The Internet
  </header>

  {/* Download button section */}
  <section className="flex flex-col items-center">
    <a
      href="https://github.com/tddev123/y2mw-download/raw/refs/heads/main/app.exe"
      download
      className="inline-block bg-gradient-to-r from-yellow-400 to-orange-600 text-black font-semibold text-lg px-12 py-5 rounded-xl shadow-lg hover:from-orange-600 hover:to-yellow-400 transform hover:scale-105 transition-all duration-300"
    >
      Download Now
    </a>
  </section>

  <h1 className="text-3xl mt-20 -mb-12  text-white">Instructions</h1>

  {/* Instructions Section with Images */}
  <section className="mt-36 grid grid-cols-3 gap-10">

    
    <InstructionImage
      src="\static\images\111app step 1 pic.png" 
      alt="" 
      fullSizeSrc="\static\images\111app step 1 pic.png" 
      step="" 
    />
    <InstructionImage 
      src="\static\images\111app step 2 pic.png" 
      alt="Step 2" 
      fullSizeSrc="\static\images\111app step 2 pic.png" 
      step="Step 2" 
    />
    <InstructionImage 
      src="/static/images/1111app step 3 pic.png" 
      alt="Step 3" 
      fullSizeSrc="/static/images/1111app step 3 pic.png" 
      step="Step 3" 
    />
  </section>
</main>


<h1 className="text-2xl mt-10 text-white">This program can convert to WAV with a bitrate of 96000
  which is higher than any other converter on the internet. This converter was made by a proffesional audio engineer. </h1>

  <h2 className="text-2xl mt-10 text-white">Enjoy UNLIMITED Youtube to mp3/wav downloads without any annoying adds. Im giving this out for FREE because I hate greed. This program DOES NOT have a virus.  </h2>

  <h3 className="text-2xl mt-10 text-white">The entire code for this program is right here https://github.com/tddev123/YoutubeMP3WAV/blob/main/app.py</h3>
</div>

<footer className=" text-center text-sm text-white opacity-70 mt-6">
    &copy; 2025 Your Website | All Rights Reserved
  </footer>
  
  
    </>
  );
}