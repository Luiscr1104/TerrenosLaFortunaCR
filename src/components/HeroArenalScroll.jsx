"use client";
import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { motion, useTransform } from "motion/react";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <div className="flex flex-col items-center justify-center mb-10">
              {/* Editorial eyebrow */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-[#C9A24E]/60" />
                <span
                  className="text-[#C9A24E] text-xs tracking-[0.3em] uppercase font-medium"
                  style={{ fontFamily: "var(--font-sans, Inter, system-ui)" }}
                >
                  The Setting
                </span>
                <div className="h-px w-8 bg-[#C9A24E]/60" />
              </div>

              <h2
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#0d2218] leading-tight"
                style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)" }}
              >
                Discover the Majesty of{" "}
                <br />
                <span className="italic text-[#1a4a2e]">
                  Arenal Volcano
                </span>
              </h2>
            </div>
          </>
        }
        leftContent={(scrollYProgress) => (
          <motion.div
            className="space-y-4 p-6 bg-white/8 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl"
            style={{
              x: useTransform(scrollYProgress, [0, 0.5], [-100, 0]),
              opacity: useTransform(scrollYProgress, [0, 0.4], [0, 1]),
            }}
          >
            <motion.div
              className="w-11 h-11 bg-[#1a4a2e]/20 rounded-xl flex items-center justify-center mb-2"
              style={{
                scale: useTransform(scrollYProgress, [0, 0.3], [0, 1]),
                opacity: useTransform(scrollYProgress, [0, 0.3], [0, 1]),
              }}
            >
              <svg className="w-5 h-5 text-[#C9A24E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </motion.div>
            <motion.h3
              className="text-xl font-bold text-white"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                opacity: useTransform(scrollYProgress, [0.2, 0.5], [0, 1]),
                y: useTransform(scrollYProgress, [0.2, 0.5], [20, 0]),
              }}
            >
              Cloud Forest & Wildlife
            </motion.h3>
            <motion.p
              className="text-white/70 text-sm leading-relaxed"
              style={{
                opacity: useTransform(scrollYProgress, [0.4, 0.7], [0, 1]),
                y: useTransform(scrollYProgress, [0.4, 0.7], [20, 0]),
              }}
            >
              Wake up to howler monkeys and toucans in the canopy. Your backyard is one of the world's most biodiverse ecosystems.
            </motion.p>
          </motion.div>
        )}
        rightContent={(scrollYProgress) => (
          <motion.div
            className="space-y-4 p-6 bg-white/8 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl"
            style={{
              x: useTransform(scrollYProgress, [0, 0.5], [100, 0]),
              opacity: useTransform(scrollYProgress, [0, 0.4], [0, 1]),
            }}
          >
            <motion.div
              className="w-11 h-11 bg-[#1a4a2e]/20 rounded-xl flex items-center justify-center mb-2"
              style={{
                scale: useTransform(scrollYProgress, [0, 0.3], [0, 1]),
                opacity: useTransform(scrollYProgress, [0, 0.3], [0, 1]),
              }}
            >
              <svg className="w-5 h-5 text-[#C9A24E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </motion.div>
            <motion.h3
              className="text-xl font-bold text-white"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                opacity: useTransform(scrollYProgress, [0.2, 0.5], [0, 1]),
                y: useTransform(scrollYProgress, [0.2, 0.5], [20, 0]),
              }}
            >
              Year-Round Warmth
            </motion.h3>
            <motion.p
              className="text-white/70 text-sm leading-relaxed"
              style={{
                opacity: useTransform(scrollYProgress, [0.4, 0.7], [0, 1]),
                y: useTransform(scrollYProgress, [0.4, 0.7], [20, 0]),
              }}
            >
              24–28°C every day of the year. No harsh winters, no dry summers — just endless green and the gentle rumble of the volcano.
            </motion.p>
          </motion.div>
        )}
      >
        <img
          src="https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/7882183c-a6cf-4aed-54a2-ca8be9241000/public"
          alt="Arenal Volcano and La Fortuna landscape, Costa Rica"
          height={720}
          width={1400}
          loading="lazy"
          decoding="async"
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
