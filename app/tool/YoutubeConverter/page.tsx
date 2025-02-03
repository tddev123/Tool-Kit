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
           
          </main>
        </div>

  
  
    </>
  );
}