"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function HeroScrollDemo() {
  const ref = useRef(null);

  // Track the section scrolling through the viewport (start entering → fully exited)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax: image moves from -12% (section above viewport) to +12% (below)
  const imageY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  // Text block fades + rises as section enters view
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.15, 0.35], [36, 0]);

  // Feature cards slide in from sides
  const card1Opacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);
  const card1X = useTransform(scrollYProgress, [0.25, 0.45], [-40, 0]);
  const card2Opacity = useTransform(scrollYProgress, [0.32, 0.52], [0, 1]);
  const card2X = useTransform(scrollYProgress, [0.32, 0.52], [40, 0]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ height: "80vh", minHeight: "560px" }}
    >
      {/* Parallax image layer — scaled up so parallax movement never shows edges */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY, scale: 1.28, transformOrigin: "center center" }}
      >
        <img
          src="https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/7882183c-a6cf-4aed-54a2-ca8be9241000/public"
          alt="Arenal Volcano and La Fortuna landscape, Costa Rica"
          width={1400}
          height={720}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
          draggable={false}
        />
      </motion.div>

      {/* Gradient overlay — dark at edges, breathes in the middle */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d2218]/65 via-[#0d2218]/25 to-[#0d2218]/75 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(13,34,24,0.45)_100%)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        {/* Headline block */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="mb-10 sm:mb-14"
        >
          {/* Editorial eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-[#C9A24E]/60" />
            <span
              className="text-[#C9A24E] text-xs tracking-[0.3em] uppercase font-medium"
              style={{ fontFamily: "var(--font-sans, Inter, system-ui)" }}
            >
              The Setting
            </span>
            <div className="h-px w-10 bg-[#C9A24E]/60" />
          </div>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight"
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              textShadow: "0 2px 20px rgba(0,0,0,0.7)",
            }}
          >
            The Majesty of{" "}
            <span
              className="italic text-[#C9A24E] block sm:inline"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
            >
              Arenal Volcano
            </span>
          </h2>

          <p
            className="mt-4 text-white/75 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
            style={{
              fontFamily: "var(--font-sans, Inter, system-ui)",
              textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            }}
          >
            Your backyard. Every single morning.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          <motion.div
            style={{ opacity: card1Opacity, x: card1X }}
            className="bg-[#0d2218]/80 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-left"
          >
            <div className="w-9 h-9 bg-[#C9A24E]/15 border border-[#C9A24E]/20 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-[#C9A24E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3
              className="text-white font-semibold text-base mb-1.5"
              style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)", fontSize: "1.05rem" }}
            >
              Cloud Forest & Wildlife
            </h3>
            <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: "var(--font-sans, Inter, system-ui)" }}>
              Howler monkeys, toucans, and one of the world's most biodiverse ecosystems — right outside your door.
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: card2Opacity, x: card2X }}
            className="bg-[#0d2218]/80 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-left"
          >
            <div className="w-9 h-9 bg-[#C9A24E]/15 border border-[#C9A24E]/20 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-[#C9A24E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3
              className="text-white font-semibold text-base mb-1.5"
              style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)", fontSize: "1.05rem" }}
            >
              Year-Round Warmth
            </h3>
            <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: "var(--font-sans, Inter, system-ui)" }}>
              24–28°C every day of the year. No harsh winters, no dry summers — just endless green and the gentle rumble of the volcano.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
