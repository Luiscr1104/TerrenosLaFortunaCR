"use client";

import { ParallaxScrollSecond } from "./ui/parallax-scroll-2";

export function ParallaxScrollSecondDemo() {
  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Encabezado de la sección */}
      <div className="text-center mb-12 md:mb-16 lg:mb-20 px-4">
        <div
          className="inline-flex items-center gap-2 bg-[#F5D77C]/15 text-neutral-900
                     px-4 py-2 rounded-full text-sm font-semibold border border-[#F5D77C]/40 mb-4"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-[#F5D77C]"></span>
          <span>Featured Gallery</span>
        </div>

        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-4 md:mb-6 tracking-tight"
        >
          Discover{" "}
          <span className="text-[#16A34A] font-extrabold">
            La Fortuna’s Beauty
          </span>
        </h2>

        <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
          A curated gallery of Costa Rica’s most breathtaking properties,
          landscapes, and investment opportunities — where nature meets
          luxury.
        </p>
      </div>

      {/* Parallax gallery */}
      <div className="max-w-[120rem] mx-auto">
        <ParallaxScrollSecond images={images} />
      </div>
    </section>
  );
}

const images = [
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/5cd588c4-a4ad-4d7b-2265-c32b4e859900/public", // Luxury Home Pool
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/0b20ab98-9a27-42da-4d12-9adcb7066200/public", // Eco Villas
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/984f3b88-418c-42e0-8a13-ca8f69ce6900/public", // Nature Sanctuary
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/f41525fe-ec6d-4132-0f8f-df340eb94200/public", // Luxury Home Aerial
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/1bc0b595-3e78-49fa-a6b5-6aab2cb66600/public", // Eco Villas Cabin
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/7a71c4ee-fbbc-4dc2-59a1-b54a39631400/public", // Nature Sanctuary Stream
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/6decbeec-ab94-4a93-f1d2-570ed6d25200/public", // Luxury Home Interior
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/d01d1f85-1f2c-4db1-25d2-9e922c430c00/public", // Eco Villas Lake
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/0ed12853-ed27-41a5-8e4b-5b636883b100/public", // Private Land View
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/a9fefc66-ebd7-4901-32ea-9605a0b6b600/public", // Scenic Land
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/fa2b6a83-c768-42d7-effe-215ccd812000/public", // Luxury Home Terrace
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/aad39732-edde-4482-9e97-c9e8dc623400/public", // Eco Villas Interior
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/deb6f230-4a80-430a-7897-3ec224148100/public", // Private Land Forest
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/364c5e6f-f11c-4a71-1be9-2e91761d9000/public", // Luxury Home Bedroom
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/6bcfb2a5-adba-4a8a-a1ab-1b6960c03200/public", // Eco Villas Garden
];
