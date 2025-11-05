"use client";
import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 dark:text-white leading-tight">
              Discover the Majesty of <br />
              <span className="text-[color:#16A34A] dark:text-[color:#F5D77C] text-5xl md:text-[6rem] font-extrabold">
                Arenal Volcano
              </span>
            </h1>
          </>
        }
      >
        <img
          src={`/797.webp`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
