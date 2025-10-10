import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Download } from "lucide-react";
import JSZip from "jszip";
import { cn } from "@/lib/utils";

type Category = "Auto" | "Lifestyle" | "Move" | "Escape" | "Work" | "Feel";

interface ArtImage {
  src: string;
  alt: string;
  category: Category;
}

export default function ArtDirectionGallery() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [activeImage, setActiveImage] = useState<number | null>(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // All art direction images organized by category
  const allImages: ArtImage[] = [
    // Auto (8 images)
    { src: `${import.meta.env.BASE_URL}assets/art direction/auto-audi-quattro-urban-portrait.png`, alt: "Auto - Audi Quattro Urban Portrait", category: "Auto" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/auto-bmw-convertible-garage-night.png`, alt: "Auto - BMW Convertible Garage Night", category: "Auto" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/auto-desert-porsche-sunset-drift.png`, alt: "Auto - Desert Porsche Sunset Drift", category: "Auto" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/auto-night-drive-motion-blur.png`, alt: "Auto - Night Drive Motion Blur", category: "Auto" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/auto-rally-porsche-night-racing.png`, alt: "Auto - Rally Porsche Night Racing", category: "Auto" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/auto-truck-wildflowers-mountain-dusk.png`, alt: "Auto - Truck Wildflowers Mountain Dusk", category: "Auto" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/auto-vintage-interior-dashboard-sunset.png`, alt: "Auto - Vintage Interior Dashboard Sunset", category: "Auto" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/auto-white-porsche-desert-headlights.png`, alt: "Auto - White Porsche Desert Headlights", category: "Auto" },

    // Lifestyle (8 images)
    { src: `${import.meta.env.BASE_URL}assets/art direction/lifestyle-casual-chic-sidewalk.png`, alt: "Lifestyle - Casual Chic Sidewalk", category: "Lifestyle" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/lifestyle-confident-street-style.png`, alt: "Lifestyle - Confident Street Style", category: "Lifestyle" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/lifestyle-contemporary-fashion-portrait.png`, alt: "Lifestyle - Contemporary Fashion Portrait", category: "Lifestyle" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/lifestyle-editorial-look-urban.png`, alt: "Lifestyle - Editorial Look Urban", category: "Lifestyle" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/lifestyle-minimalist-white-tones.png`, alt: "Lifestyle - Minimalist White Tones", category: "Lifestyle" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/lifestyle-modern-aesthetic-pose.png`, alt: "Lifestyle - Modern Aesthetic Pose", category: "Lifestyle" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/lifestyle-urban-angel-street-fashion.png`, alt: "Lifestyle - Urban Angel Street Fashion", category: "Lifestyle" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/lifestyle-yellow-puffer-portrait.png`, alt: "Lifestyle - Yellow Puffer Portrait", category: "Lifestyle" },

    // Move (8 images)
    { src: `${import.meta.env.BASE_URL}assets/art direction/move-abstract-dance-flow.png`, alt: "Move - Abstract Dance Flow", category: "Move" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/move-athletic-motion-energy.png`, alt: "Move - Athletic Motion Energy", category: "Move" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/move-dynamic-figure-action.png`, alt: "Move - Dynamic Figure Action", category: "Move" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/move-flowing-movement-grace.png`, alt: "Move - Flowing Movement Grace", category: "Move" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/move-gesture-blur-dance.png`, alt: "Move - Gesture Blur Dance", category: "Move" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/move-kinetic-energy-motion.png`, alt: "Move - Kinetic Energy Motion", category: "Move" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/move-palm-trees-runners-motion.png`, alt: "Move - Palm Trees Runners Motion", category: "Move" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/move-speed-blur-running.png`, alt: "Move - Speed Blur Running", category: "Move" },

    // Escape (8 images)
    { src: `${import.meta.env.BASE_URL}assets/art direction/escape-astronaut-sparkle-floating.png`, alt: "Escape - Astronaut Sparkle Floating", category: "Escape" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/escape-cliffside-workspace-ocean-view.png`, alt: "Escape - Cliffside Workspace Ocean View", category: "Escape" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/escape-coastal-laptop-remote-work.png`, alt: "Escape - Coastal Laptop Remote Work", category: "Escape" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/escape-desert-silhouette-wanderer.png`, alt: "Escape - Desert Silhouette Wanderer", category: "Escape" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/escape-floating-sun-documents.png`, alt: "Escape - Floating Sun Documents", category: "Escape" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/escape-geometric-stairs-silhouette.png`, alt: "Escape - Geometric Stairs Silhouette", category: "Escape" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/escape-meadow-workspace-clouds.png`, alt: "Escape - Meadow Workspace Clouds", category: "Escape" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/escape-mountain-desk-wilderness.png`, alt: "Escape - Mountain Desk Wilderness", category: "Escape" },

    // Work (8 images)
    { src: `${import.meta.env.BASE_URL}assets/art direction/work-business-presentation.png`, alt: "Work - Business Presentation", category: "Work" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/work-conference-networking-event.png`, alt: "Work - Conference Networking Event", category: "Work" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/work-corporate-environment.png`, alt: "Work - Corporate Environment", category: "Work" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/work-iterra-brand-green-hills.png`, alt: "Work - Iterra Brand Green Hills", category: "Work" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/work-office-workspace-modern.png`, alt: "Work - Office Workspace Modern", category: "Work" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/work-professional-collaboration.png`, alt: "Work - Professional Collaboration", category: "Work" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/work-professional-setting.png`, alt: "Work - Professional Setting", category: "Work" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/work-team-meeting-discussion.png`, alt: "Work - Team Meeting Discussion", category: "Work" },

    // Feel (8 images)
    { src: `${import.meta.env.BASE_URL}assets/art direction/feel-abstract-figure-warm-tones.png`, alt: "Feel - Abstract Figure Warm Tones", category: "Feel" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/feel-delicate-abstract-movement.png`, alt: "Feel - Delicate Abstract Movement", category: "Feel" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/feel-dynamic-spin-motion-dress.png`, alt: "Feel - Dynamic Spin Motion Dress", category: "Feel" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/feel-ethereal-portrait-softness.png`, alt: "Feel - Ethereal Portrait Softness", category: "Feel" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/feel-flowing-fabric-grace.png`, alt: "Feel - Flowing Fabric Grace", category: "Feel" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/feel-motion-blur-bouquet-flowers.png`, alt: "Feel - Motion Blur Bouquet Flowers", category: "Feel" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/feel-portrait-shadow-play.png`, alt: "Feel - Portrait Shadow Play", category: "Feel" },
    { src: `${import.meta.env.BASE_URL}assets/art direction/feel-water-droplets-diagonal-reflection.png`, alt: "Feel - Water Droplets Diagonal Reflection", category: "Feel" },
  ];

  const categories: (Category | "All")[] = ["All", "Auto", "Lifestyle", "Move", "Escape", "Work", "Feel"];

  // Filter images based on selected category
  const filteredImages = selectedCategory === "All"
    ? allImages
    : allImages.filter(img => img.category === selectedCategory);

  // Mobile: limit to 10 images with truncation indicator
  const MOBILE_LIMIT = 10;
  const displayedMobileImages = filteredImages.slice(0, MOBILE_LIMIT);
  const remainingCount = filteredImages.length - MOBILE_LIMIT;

  // Reset active image when category changes
  const handleCategoryChange = (category: Category | "All") => {
    setSelectedCategory(category);
    setActiveImage(0); // Always set first image as active when filter changes
  };

  // Download function - creates zip file for category
  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const zip = new JSZip();
      const categoryName = selectedCategory === "All" ? "all-art-direction" : selectedCategory.toLowerCase();

      // Fetch all images as blobs and add to zip
      await Promise.all(
        filteredImages.map(async (image) => {
          const response = await fetch(image.src);
          const blob = await response.blob();
          const filename = image.src.split('/').pop() || `${image.category}-${Date.now()}.png`;
          zip.file(filename, blob);
        })
      );

      // Generate and download zip file
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `art-direction-${categoryName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download images. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title - H2 styling */}
      <h2 className="font-display text-d2-mobile md:text-d2-tablet xl:text-d2-desktop text-brand-vanilla">
        Art Direction
      </h2>

      {/* Description */}
      <p className="font-text text-b1 text-brand-vanilla/70 max-w-3xl">
        Our visual language spans automotive excellence, lifestyle moments, dynamic movement, escapist dreams, professional environments, and emotional resonance.
      </p>

      {/* Filter Buttons + Download Button */}
      <div className="flex flex-wrap gap-2 items-center">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <motion.button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                "px-3 py-2 rounded-full font-text text-button transition-all duration-200",
                isActive
                  ? "bg-brand-aperol text-brand-vanilla shadow-lg shadow-brand-aperol/20"
                  : "bg-brand-vanilla/10 text-brand-vanilla/70 hover:bg-brand-vanilla/20 hover:text-brand-vanilla"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {category}
            </motion.button>
          );
        })}

        {/* Download Button - Icon Only */}
        <motion.button
          onClick={handleDownload}
          disabled={isDownloading}
          className={cn(
            "w-10 h-10 rounded-full font-text transition-all duration-200 flex items-center justify-center ml-auto",
            isDownloading
              ? "bg-brand-vanilla/5 text-brand-vanilla/40 cursor-not-allowed"
              : "bg-brand-charcoal border border-brand-vanilla/20 text-brand-vanilla hover:bg-brand-vanilla/10"
          )}
          whileHover={!isDownloading ? { scale: 1.05 } : {}}
          whileTap={!isDownloading ? { scale: 0.95 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Download className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Gallery - Responsive: Horizontal on desktop, Vertical on mobile */}
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="relative w-full"
      >
        {/* Desktop: Horizontal Gallery (hidden on mobile) */}
        <div className="hidden md:flex w-full items-center justify-center gap-1">
          {filteredImages.map((image, index) => (
            <motion.div
              key={`${selectedCategory}-${index}`}
              className="relative cursor-pointer overflow-hidden rounded-3xl"
              initial={{ width: "5rem", height: "24rem" }}
              animate={{
                width: activeImage === index ? "28rem" : "5rem",
                height: "24rem",
              }}
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
                    className="absolute h-full w-full bg-gradient-to-t from-black/40 to-transparent pointer-events-none"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {activeImage === index && filteredImages.length <= 5 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute flex h-full w-full flex-col items-end justify-end p-4"
                  >
                    <p className="text-left text-xs text-white/70 font-text">
                      {image.category}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <img
                src={image.src}
                className="size-full object-cover"
                alt={image.alt}
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile: Vertical Gallery (visible only on mobile) - Limited to 10 with truncation */}
        <div className="flex md:hidden w-full flex-col items-center justify-center gap-1">
          {displayedMobileImages.map((image, index) => (
            <motion.div
              key={`${selectedCategory}-mobile-${index}`}
              className="group relative cursor-pointer overflow-hidden rounded-3xl w-full max-w-md"
              initial={{ height: "2.75rem" }}
              animate={{ height: activeImage === index ? "20rem" : "2.75rem" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setActiveImage(index)}
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
                    <p className="text-xs text-white/70 font-text">{image.category}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover select-none"
                loading="lazy"
              />
            </motion.div>
          ))}

          {/* Truncation indicator for mobile */}
          {remainingCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-md py-4 text-center"
            >
              <p className="font-text text-b2 text-brand-vanilla/50">
                +{remainingCount} more {remainingCount === 1 ? 'image' : 'images'}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
