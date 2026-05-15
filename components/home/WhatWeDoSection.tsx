"use client";

import styles from "./WhatWeDoSection.module.scss";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { WhatWeDoSectionContent } from "./WhatWeDoSectionContent";
import { useI18n } from "@/lib/i18n";
import { ServicesOverviewSection } from "./ServicesOverviewSection";
import { useEffect, useRef } from "react";

export function WhatWeDoSection() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const setHalfSpeed = () => {
      videoRef.current!.defaultPlaybackRate = 0.5;
      videoRef.current!.playbackRate = 0.5;
    };

    setHalfSpeed();
    videoRef.current!.addEventListener("loadedmetadata", setHalfSpeed);
    videoRef.current!.addEventListener("play", setHalfSpeed);

    return () => {
      if (videoRef.current) {
        videoRef.current!.removeEventListener("loadedmetadata", setHalfSpeed);
        videoRef.current!.removeEventListener("play", setHalfSpeed);
      }
    };
  }, []);

  return (
    <div className="home-shared-bg">
      <video
        className="home-shared-bg-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        ref={videoRef}
      >
        <source src="/videos/hero-video.mp4" type="video/mp4"></source>
      </video>
      <Section id="what-we-do" className={`section wwd-section ${styles.root}`}>
        <Container>
          <WhatWeDoSectionContent />
        </Container>
      </Section>
      <ServicesOverviewSection />
    </div>
  );
}
