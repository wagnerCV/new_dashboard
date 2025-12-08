import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Countdown from "@/components/Countdown";
import InvitationSection from "@/components/InvitationSection";
import LoveManifestoSection from "@/components/LoveManifestoSection";
import StoryTimeline from "@/components/StoryTimeline";
import DetailsSection from "@/components/DetailsSection";
import MapSection from "@/components/MapSection";
import DressCodeSection from "@/components/DressCodeSection";
import RSVPSection from "@/components/RSVPSection";

import FinalBlessingSection from "@/components/FinalBlessingSection";
import AudioPlayer from "@/components/AudioPlayer";
import { useEffect } from "react";

export default function Home() {
  // Smooth scroll behavior for anchor links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <main className="min-h-screen bg-off-white selection:bg-terracotta selection:text-white">
      <Navbar />
      <HeroSection />
      <Countdown />
      <InvitationSection />
      <LoveManifestoSection />
      <StoryTimeline />
      <DetailsSection />
      <MapSection />
      <DressCodeSection />
      <RSVPSection />
      <FinalBlessingSection />
      <AudioPlayer />
    </main>
  );
}
