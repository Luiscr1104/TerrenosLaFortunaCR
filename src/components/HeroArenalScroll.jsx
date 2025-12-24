"use client";
import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { motion, useTransform } from "framer-motion";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <div className="flex flex-col items-center justify-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                <span>Natural Wonder</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 dark:text-white leading-tight">
                Discover the Majesty of <br />
                <span className="text-[#16A34A] dark:text-[#F5D77C]">
                  Arenal Volcano
                </span>
              </h2>
            </div>
          </>
        }
        leftContent={(scrollYProgress) => (
          <motion.div
            className="space-y-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl"
            style={{
              x: useTransform(scrollYProgress, [0, 0.5], [-100, 0]),
              opacity: useTransform(scrollYProgress, [0, 0.4], [0, 1])
            }}
          >
            <motion.div
              className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2"
              style={{
                scale: useTransform(scrollYProgress, [0, 0.3], [0, 1]),
                opacity: useTransform(scrollYProgress, [0, 0.3], [0, 1])
              }}
            >
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </motion.div>
            <motion.h3
              className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
              style={{
                opacity: useTransform(scrollYProgress, [0.2, 0.5], [0, 1]),
                y: useTransform(scrollYProgress, [0.2, 0.5], [20, 0])
              }}
            >
              Lush Rainforests
            </motion.h3>
            <motion.p
              className="text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed"
              style={{
                opacity: useTransform(scrollYProgress, [0.4, 0.7], [0, 1]),
                y: useTransform(scrollYProgress, [0.4, 0.7], [20, 0])
              }}
            >
              Explore the dense jungle surrounding the volcano, home to diverse wildlife and exotic flora.
            </motion.p>
          </motion.div>
        )}
        rightContent={(scrollYProgress) => (
          <motion.div
            className="space-y-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl"
            style={{
              x: useTransform(scrollYProgress, [0, 0.5], [100, 0]),
              opacity: useTransform(scrollYProgress, [0, 0.4], [0, 1])
            }}
          >
            <motion.div
              className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2"
              style={{
                scale: useTransform(scrollYProgress, [0, 0.3], [0, 1]),
                opacity: useTransform(scrollYProgress, [0, 0.3], [0, 1])
              }}
            >
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </motion.div>
            <motion.h3
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
              style={{
                opacity: useTransform(scrollYProgress, [0.2, 0.5], [0, 1]),
                y: useTransform(scrollYProgress, [0.2, 0.5], [20, 0])
              }}
            >
              Natural Hot Springs
            </motion.h3>
            <motion.p
              className="text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed"
              style={{
                opacity: useTransform(scrollYProgress, [0.4, 0.7], [0, 1]),
                y: useTransform(scrollYProgress, [0.4, 0.7], [20, 0])
              }}
            >
              Relax in the geothermal waters heated by the volcano, a perfect way to unwind after adventure.
            </motion.p>
          </motion.div>
        )}
      >
        <img
          src="https://imagedelivery.net/Lh5ivcu1Gl9SRBAdYRSP2g/7882183c-a6cf-4aed-54a2-ca8be9241000/public"
          alt="hero"
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
