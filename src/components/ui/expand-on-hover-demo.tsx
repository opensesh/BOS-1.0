"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

export default function HoverExpandDefault() {
  // ✅ стабильные open-source изображения (Lorem Picsum)
  const images = [
    { src: "https://picsum.photos/id/1018/1200/800", alt: "Mountain lake", code: "#01" },
    { src: "https://picsum.photos/id/1025/1200/800", alt: "Puppy portrait", code: "#02" },
    { src: "https://picsum.photos/id/1035/1200/800", alt: "Forest path", code: "#03" },
    { src: "https://picsum.photos/id/1040/1200/800", alt: "Desert dunes", code: "#04" },
    { src: "https://picsum.photos/id/1050/1200/800", alt: "City skyline", code: "#05" },
    { src: "https://picsum.photos/id/1069/1200/800", alt: "Beach waves", code: "#06" },
  ];

  const [activeImage, setActiveImage] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={cn("relative w-full max-w-6xl px-5 mx-auto")}
    >
      <div className="flex w-full flex-col items-center justify-center gap-1">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="group relative cursor-pointer overflow-hidden rounded-3xl"
            initial={{ height: "2.75rem", width: "24rem" }}
            animate={{ height: activeImage === index ? "24rem" : "2.75rem" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setActiveImage(index)}
            onHoverStart={() => setActiveImage(index)}
          >
            <AnimatePresence>
              {activeImage === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {activeImage === index && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  className="absolute inset-0 flex items-end justify-end px-4 pb-4"
                >
                  <p className="text-xs text-white/70">{image.code}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover select-none"
              loading="lazy"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                // ✅ фолбэк, если вдруг картинка не загрузилась
                el.src = "https://picsum.photos/seed/fallback-1200x800/1200/800";
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
