"use client";
/* eslint-disable @next/next/no-img-element */
import dynamicImport from "next/dynamic";
import { useState } from "react";
import IntroOverlay from "../components/IntroOverlay";
import CircularImageCarousel from "../components/CircularImageCarousel";
import products from "./data/products.json";
const PinkPixelsCanvas = dynamicImport(
  () => import("../components/PinkPixelsCanvas"),
  { ssr: false }
);

export const dynamic = "force-dynamic";

const Landing = () => {
  const [introDone, setIntroDone] = useState(false);
  
  // Combine landing page images with product images
  const allImages = [
    { src: "/assets/chai-1.jpg", alt: "Indian chai 1" },
    { src: "/assets/chai-2.jpg", alt: "Indian chai 2" },
    ...products.map((product) => ({
      src: product.image,
      alt: product.name,
    })),
  ];
  return (
    <>
      <IntroOverlay text="Amor + Chai" onDone={() => setIntroDone(true)} />
      <section className="relative pt-28">
        <div className="absolute inset-0">
          <PinkPixelsCanvas />
        </div>
        <div
          className={`relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 pb-0 transition-opacity duration-300 md:grid-cols-2 ${
            introDone ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Left: copy (doesn't block canvas except CTAs) */}
          <div className="pointer-events-none flex flex-col items-center gap-3 text-center md:items-start md:text-left">
            <h1
              id="landing-title"
              className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl"
            >
              AMOR + CHAI
            </h1>
            <p className="max-w-prose text-lg text-gray-800">
              Minimal. Hyperreal. Crafted for the senses.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-700 md:justify-start">
              <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 backdrop-blur">
                Small‑batch
              </span>
              <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 backdrop-blur">
                Real spices
              </span>
              <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 backdrop-blur">
                No shortcuts
              </span>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3 pointer-events-auto md:justify-start">
              <a
                href="/products"
                className="rounded-lg bg-black/80 px-6 py-3 font-semibold text-white shadow hover:bg-black"
              >
                Shop Now
              </a>
              <a
                href="/home"
                className="rounded-lg border-2 border-black/60 px-6 py-3 font-semibold text-black hover:bg-black/10"
              >
                Explore Media
              </a>
            </div>
          </div>
          {/* Right: circular image carousel */}
          <div className="pointer-events-auto mt-0">
            <CircularImageCarousel images={allImages} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
