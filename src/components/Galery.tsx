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
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/c86779d7-53ff-44a0-0241-3804e2bba900/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/effbb4f2-933e-46ef-4d80-07f34f3c0000/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/70877784-f7c9-4b0a-fb28-ecdf3cbae900/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/0a7447bb-1b5a-40c1-ebd3-f834f030d500/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/f63082b1-eee4-4d02-7af3-455cdc8faf00/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/896b7f54-7551-4270-6973-90742d2edd00/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/b7fb96c9-e60e-48bc-9e0e-4f7c96b6c000/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/e1dfba7d-7dda-48ef-eb81-e6e0d5d9fc00/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/ae1c2c8a-44db-4503-32e7-3d3bea799f00/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/34ab21d4-0ce3-473f-324c-91c12ec0b100/public",  
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/c86779d7-53ff-44a0-0241-3804e2bba900/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/effbb4f2-933e-46ef-4d80-07f34f3c0000/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/70877784-f7c9-4b0a-fb28-ecdf3cbae900/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/0a7447bb-1b5a-40c1-ebd3-f834f030d500/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/f63082b1-eee4-4d02-7af3-455cdc8faf00/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/896b7f54-7551-4270-6973-90742d2edd00/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/b7fb96c9-e60e-48bc-9e0e-4f7c96b6c000/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/e1dfba7d-7dda-48ef-eb81-e6e0d5d9fc00/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/ae1c2c8a-44db-4503-32e7-3d3bea799f00/public",
  "https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/34ab21d4-0ce3-473f-324c-91c12ec0b100/public",
];
