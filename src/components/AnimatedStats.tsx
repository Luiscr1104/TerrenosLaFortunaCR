import React, { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface CounterProps {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

const Counter = ({ value, prefix = "", suffix = "", decimals = 0 }: CounterProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
        duration: 2, // Slower duration for smoother effect
    });
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [motionValue, isInView, value]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
            }
        });
    }, [springValue, decimals, prefix, suffix]);

    return <span ref={ref} className="tabular-nums" />;
};

export default function AnimatedStats() {
    return (
        <section className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
                <div className="inline-block">
                    <div className="text-3xl md:text-4xl font-display font-bold text-[#25D366]">
                        <Counter value={2.5} prefix="$" suffix="M+" decimals={1} />
                    </div>
                    <span className="block h-1 w-full bg-[#25D366] rounded mt-1"></span>
                </div>
                <p className="mt-2 text-sm md:text-base text-neutral-600">Properties Sold</p>
            </div>
            <div className="text-center">
                <div className="inline-block">
                    <div className="text-3xl md:text-4xl font-display font-bold text-[#25D366]">
                        <Counter value={98} suffix="%" />
                    </div>
                    <span className="block h-1 w-full bg-[#25D366] rounded mt-1"></span>
                </div>
                <p className="mt-2 text-sm md:text-base text-neutral-600">Client Satisfaction</p>
            </div>
            <div className="text-center">
                <div className="inline-block">
                    <div className="text-3xl md:text-4xl font-display font-bold text-[#25D366]">
                        <Counter value={30} suffix=" Days" />
                    </div>
                    <span className="block h-1 w-full bg-[#25D366] rounded mt-1"></span>
                </div>
                <p className="mt-2 text-sm md:text-base text-neutral-600">Avg. Close Time</p>
            </div>
            <div className="text-center">
                <div className="inline-block">
                    <div className="text-3xl md:text-4xl font-display font-bold text-[#25D366]">
                        <Counter value={24} suffix="/7" />
                    </div>
                    <span className="block h-1 w-full bg-[#25D366] rounded mt-1"></span>
                </div>
                <p className="mt-2 text-sm md:text-base text-neutral-600">Support</p>
            </div>
        </section>
    );
}
