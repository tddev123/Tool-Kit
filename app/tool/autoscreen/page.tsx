import ParticlesComponent from "@/components/Particles";
import Screenshotter from "@/components/screenshotter";

export default async function autoscreenshotter() {
  return (
    <>
          {/* Particles component behind everything */}
          <ParticlesComponent id="particles" className="absolute inset-0 -z-100" />,
          

    {/* Content above particles */}
        <div className="relative z-10">
        <Screenshotter/>
       
          <main className="flex-1 flex flex-col gap-6 px-4">
           
          </main>
        </div>

  
  
    </>
  );
}