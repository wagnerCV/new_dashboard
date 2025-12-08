import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Auto-play policy might block this
        console.log("Playback prevented");
      });
    }
    setIsPlaying(!isPlaying);
    setHasInteracted(true);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Optional: Auto-play hint animation or logic could go here
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-piano-111563.mp3" 
        loop
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        className="relative group"
      >
        {!hasInteracted && (
          <motion.div
            className="absolute -top-12 right-0 bg-white text-soft-black text-xs px-3 py-1 rounded-full shadow-lg whitespace-nowrap pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Música de fundo? 🎵
            <div className="absolute bottom-[-4px] right-4 w-2 h-2 bg-white rotate-45" />
          </motion.div>
        )}

        <button
          onClick={togglePlay}
          className={`flex items-center gap-3 pl-4 pr-2 py-2 rounded-full shadow-lg backdrop-blur-md border transition-all duration-300 ${
            isPlaying 
              ? "bg-terracotta/90 border-terracotta text-white w-auto" 
              : "bg-white/90 border-sand text-soft-black hover:bg-white"
          }`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span className={`text-xs font-sans uppercase tracking-wider transition-all duration-300 ${isPlaying ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
              A tocar
            </span>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
          </div>

          <div 
            onClick={toggleMute}
            className={`p-2 rounded-full transition-colors ${isPlaying ? "hover:bg-white/20" : "hover:bg-black/5"}`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </div>
        </button>
      </motion.div>
    </div>
  );
}
