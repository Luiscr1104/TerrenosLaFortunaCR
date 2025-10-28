"use client";
import { motion } from "motion/react";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";

export default function HeroTitle() {
  return (
    <div className="text-center mb-12 md:mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-4 md:mb-6 leading-tight"
      >
        
        Your{" "}
        <span className="inline-flex items-baseline align-middle mb-2">
          <LayoutTextFlip
            text="" // no texto fijo antes
            words={["Dream", "Luxury", "Nature", "Modern", "Cozy", "Serene"]}
            duration={2500}
          />
        </span>{" "}
        Property
<span className="block text-primary-700 font-semibold tracking-tight">
  Awaits in Paradise
</span>

      </motion.h2>
    </div>
  );
}
