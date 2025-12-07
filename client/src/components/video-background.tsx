import { useState, useRef, useEffect, useCallback } from "react";

const VIDEOS = [
  "/attached_assets/12336632_1280_720_30fps_1765140038950.mp4",
  "/attached_assets/5043943-hd_1280_720_30fps_1765140038951.mp4",
  "/attached_assets/5834551-uhd_3840_2160_24fps_1765140038951.mp4"
];

const PRELOAD_TIME = 4;
const FADE_DURATION = 1000;

export function VideoBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextVideoReady, setNextVideoReady] = useState(false);
  
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);

  const getNextIndex = useCallback((current: number) => {
    return (current + 1) % VIDEOS.length;
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = currentVideoRef.current;
    if (!video || isTransitioning || !video.duration) return;

    const timeRemaining = video.duration - video.currentTime;
    
    if (timeRemaining <= PRELOAD_TIME && !nextVideoReady) {
      const nextVideo = nextVideoRef.current;
      if (nextVideo) {
        nextVideo.load();
        nextVideo.currentTime = 0;
        setNextVideoReady(true);
      }
    }

    if (timeRemaining <= 1 && nextVideoReady) {
      startTransition();
    }
  }, [isTransitioning, nextVideoReady]);

  const startTransition = useCallback(() => {
    setIsTransitioning(true);
    
    const nextVideo = nextVideoRef.current;
    if (nextVideo) {
      nextVideo.play().catch(() => {});
    }

    setTimeout(() => {
      const newCurrentIndex = nextIndex;
      const newNextIndex = getNextIndex(nextIndex);
      
      setCurrentIndex(newCurrentIndex);
      setNextIndex(newNextIndex);
      setIsTransitioning(false);
      setNextVideoReady(false);
    }, FADE_DURATION);
  }, [nextIndex, getNextIndex]);

  useEffect(() => {
    const video = currentVideoRef.current;
    if (video) {
      const handleCanPlay = () => {
        video.play().catch(() => {});
      };
      
      video.addEventListener("canplaythrough", handleCanPlay);
      video.addEventListener("timeupdate", handleTimeUpdate);
      
      return () => {
        video.removeEventListener("canplaythrough", handleCanPlay);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [handleTimeUpdate, currentIndex]);

  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"
        style={{ zIndex: 2 }}
      />
      
      <video
        ref={currentVideoRef}
        key={`current-${currentIndex}`}
        src={VIDEOS[currentIndex]}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
        style={{ zIndex: 1 }}
        muted
        playsInline
        autoPlay
        preload="auto"
      />
      
      <video
        ref={nextVideoRef}
        key={`next-${nextIndex}`}
        src={VIDEOS[nextIndex]}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isTransitioning ? "opacity-100" : "opacity-0"
        }`}
        style={{ zIndex: 1 }}
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
