"use client";
import Link from "next/link";
import { Vortex } from "@/components/ui/vortex";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

const words = [
  {
    text: "Job",
    className: "text-white",
  },
  {
    text: "applications",
    className: "text-white",
  },
  {
    text: "shouldn't",
    className: "text-white",
  },
  {
    text: "be",
    className: "text-white",
  },
  {
    text: "a",
    className: "text-white",
  },
  {
    text: "chore.",
    className: "text-white",
  },
];

export default function Index() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background py-12 md:py-24 lg:py-32">
      <Vortex
        rangeY={800}
        particleCount={500}
        baseHue={700}
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <section className="w-full max-w-5xl px-4 md:px-6">
          <div className="flex text-center text-white flex-col justify-center space-y-2">
            <TypewriterEffectSmooth words={words} />

            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Link
                href="/dashboard"
                prefetch={false}
                className="relative inline-flex h-fit overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-3xl font-medium text-white backdrop-blur-3xl">
                  Let's get a job!
                </span>
              </Link>
            </div>
          </div>
        </section>
      </Vortex>
    </main>
  );
}
