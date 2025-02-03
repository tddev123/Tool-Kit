import Hero from "@/components/hero";
import Screenshotter from "@/components/screenshotter";
import Shelf from "@/components/shelf";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import Image from "next/image";
import BasicImage from "@/components/imgdsplaytster";
import ParticlesComponent from "@/components/Particles";

export default async function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Particles component behind everything */}
      <ParticlesComponent id="particles" className="absolute inset-0 -z-10" />

      {/* Content above particles */}
      <div className="relative z-10 -mt-20">
        <Shelf />
     
        <main className="flex-1 flex flex-col gap-6 px-4">
         
        </main>
      </div>
    </div>
  );
}
