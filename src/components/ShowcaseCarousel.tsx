import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

interface Stat {
    label: string;
    value: string;
}

export interface Offer {
    title: string;
    subtitle: string;
    promoTitle?: string;
    promoHighlight?: string;
    ctaLabel?: string;
    ctaHref?: string;
    image: string;
    videoUrl?: string;
    locationChip?: string;
    stats: Stat[];
    accent?: string;
}

interface ShowcaseCarouselProps {
    offers: Offer[];
}

export default function ShowcaseCarousel({ offers }: ShowcaseCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % offers.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
    };

    const currentOffer = offers[currentIndex];
    const accentColor = currentOffer.accent || "#16a34a";

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    return (
        <div className="relative w-full overflow-hidden" style={{ "--accent": accentColor } as React.CSSProperties}>
            <div className="mx-auto max-w-[120rem] px-4 sm:px-6 lg:px-8 py-16">
                <div className="relative">
                    {/* Navigation Buttons - Absolute positioned for compactness */}
                    {offers.length > 1 && (
                        <div className="absolute top-1/2 -translate-y-1/2 -left-4 -right-4 flex justify-between z-20 pointer-events-none px-2 md:px-0">
                            <button
                                onClick={prevSlide}
                                className="pointer-events-auto p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all border border-neutral-200 text-neutral-800"
                                aria-label="Previous offer"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="pointer-events-auto p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all border border-neutral-200 text-neutral-800"
                                aria-label="Next offer"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    )}

                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                            }}
                            className="w-full"
                        >
                            {/* Header Section - Larger Title */}
                            <div className="text-center mb-10">
                                {currentOffer.promoTitle && (
                                    <div className="inline-flex items-center gap-2 bg-[color:var(--accent)]/10 text-neutral-900 font-semibold text-sm px-4 py-1.5 rounded-full border border-[color:var(--accent)]/30 mb-4 shadow-sm">
                                        <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--accent)] shadow-[0_0_0_2px_rgba(var(--accent),0.2)]"></span>
                                        {currentOffer.promoTitle}
                                    </div>
                                )}

                                <h2 className="text-3xl md:text-5xl font-display font-bold text-neutral-900 mb-2 tracking-tight leading-tight">
                                    {currentOffer.promoHighlight ? (
                                        <span className="relative inline-block px-2 rounded-md bg-[color:var(--accent)]/10">
                                            {currentOffer.promoHighlight}
                                        </span>
                                    ) : (
                                        currentOffer.title
                                    )}
                                </h2>
                            </div>

                            <div className="grid gap-8 lg:grid-cols-[480px_minmax(0,1fr)] items-stretch max-w-7xl mx-auto">
                                {/* Content Card */}
                                <div className="rounded-2xl bg-white border border-neutral-200 shadow-xl overflow-hidden flex flex-col h-full">
                                    <div className="p-8 flex-grow">
                                        <h3 className="text-2xl font-bold text-neutral-900 mb-3 leading-snug">
                                            {currentOffer.title}
                                        </h3>
                                        <p className="text-neutral-600 text-base mb-6 line-clamp-4 leading-relaxed">
                                            {currentOffer.subtitle}
                                        </p>

                                        <a
                                            href={currentOffer.ctaHref || "#"}
                                            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white bg-[color:var(--accent)] shadow-md hover:brightness-110 active:scale-95 transition-all w-full justify-center sm:w-auto"
                                        >
                                            {currentOffer.ctaLabel || "View Details"}
                                            <ArrowUpRight className="w-4 h-4" />
                                        </a>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 border-t border-neutral-100 divide-x divide-neutral-100 bg-neutral-50/50">
                                        {currentOffer.stats.map((stat, idx) => (
                                            <div key={idx} className="p-4 text-center hover:bg-white transition-colors">
                                                <div className="text-xl font-bold text-[color:var(--accent)] tracking-tight">
                                                    {stat.value}
                                                </div>
                                                <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Media Card */}
                                <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-xl min-h-[350px] lg:min-h-[450px] group">
                                    {currentOffer.videoUrl ? (
                                        <iframe
                                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                            src={`${currentOffer.videoUrl}${currentOffer.videoUrl.includes("?") ? "&" : "?"}autoplay=1&mute=1&controls=0&loop=1&playlist=${currentOffer.videoUrl.split("/").pop()}`}
                                            title={currentOffer.title}
                                            allow="autoplay; fullscreen; picture-in-picture"
                                        />
                                    ) : (
                                        <img
                                            src={currentOffer.image}
                                            alt={currentOffer.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        {currentOffer.locationChip && (
                                            <div className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 text-xs font-medium text-white shadow-sm mb-2">
                                                <svg className="w-3.5 h-3.5 text-[color:var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {currentOffer.locationChip}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Pagination Dots */}
                    {offers.length > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {offers.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setDirection(idx > currentIndex ? 1 : -1);
                                        setCurrentIndex(idx);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                        ? "bg-[color:var(--accent)] w-6"
                                        : "bg-neutral-300 hover:bg-neutral-400"
                                        }`}
                                    aria-label={`Go to offer ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
