"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SiteNav from "../../../components/SiteNav";
import MobileSiteNav from "../../../components/MobileSiteNav";
import styles from "./interior.module.css";

const PLAYBACK_SPEED = 1.3;

const interiorSlides = [
  {
    eyebrow: "The heart of home",
    lead: "Room to",
    accent: "settle in.",
    detail: "Light moves through the kitchen and into a living space made for slow mornings and easy evenings.",
    desktop: "/media/cottages/two-bedroom-interior.webp",
    mobile: "/media/cottages/two-bedroom-interior-mobile.webp",
    width: 2200,
    height: 1228,
    alt: "Warm, sunlit kitchen and adjoining living space in the two-bedroom cottage",
  },
  {
    eyebrow: "Open living area",
    lead: "Space to",
    accent: "unwind.",
    detail: "High shiplap ceilings, a ceiling fan, and an inviting living room that opens straight onto the private deck.",
    desktop: "/media/cottages/two-bedroom-living.jpg",
    mobile: "/media/cottages/two-bedroom-living.jpg",
    width: 1024,
    height: 576,
    alt: "Sunlit living room in the two-bedroom cottage with vaulted ceiling, sofa, media console, and glass door to the outdoor deck",
  },
];

export default function TwoBedroomInteriorPage() {
  // With Cache Components enabled, Next.js preserves page state via React <Activity>.
  // Incrementing visitKey inside useLayoutEffect cleanup guarantees that every time
  // this page is hidden (navigated away from) and later reopened, <InteriorTour>
  // mounts completely fresh with a new <video> element and clean state.
  const [visitKey, setVisitKey] = useState(0);
  useLayoutEffect(() => {
    return () => {
      setVisitKey((k) => k + 1);
    };
  }, []);
  return <InteriorTour key={visitKey} />;
}

function InteriorTour() {
  const router = useRouter();
  const [mode, setMode] = useState<"forward" | "photo" | "reverse">("forward");
  const [slideIndex, setSlideIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reverseVideoRef = useRef<HTMLVideoElement>(null);
  const reverseStart = useRef(0);
  const showPhoto = mode === "photo";

  const changeSlide = useCallback((direction: -1 | 1) => {
    setSlideIndex((current) => (current + direction + interiorSlides.length) % interiorSlides.length);
  }, []);

  useEffect(() => {
    if (!showPhoto) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      changeSlide(event.key === "ArrowLeft" ? -1 : 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPhoto, changeSlide]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    video.muted = true;
    video.defaultMuted = true;
    video.defaultPlaybackRate = PLAYBACK_SPEED;
    video.playbackRate = PLAYBACK_SPEED;
    video.currentTime = 0;

    const tryPlay = () => {
      if (cancelled) return;
      video.playbackRate = PLAYBACK_SPEED;
      video.play().catch((error: DOMException) => {
        if (cancelled) return;
        if (error.name === "NotAllowedError" || error.name === "NotSupportedError") {
          setSlideIndex(0);
          setMode("photo");
        }
      });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.load();
      video.addEventListener("loadeddata", tryPlay, { once: true });
    }

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", tryPlay);
      video.pause();
    };
  }, [replayKey]);

  const handleForwardTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    // Trigger the crossfade slightly before the last frame so the motion flows seamlessly into the kitchen photo
    if (mode === "forward" && video.duration > 1 && video.currentTime >= video.duration - 0.18) {
      setSlideIndex(0);
      setMode("photo");
    }
  };

  const handleForwardEnded = () => {
    const video = videoRef.current;
    // Guard against spurious/stale ended events before playback actually progressed
    if (video && video.currentTime < 1) {
      video.currentTime = 0;
      video.playbackRate = PLAYBACK_SPEED;
      video.play().catch(() => {
        setSlideIndex(0);
        setMode("photo");
      });
      return;
    }
    setSlideIndex(0);
    setMode("photo");
  };

  const replay = () => {
    setSlideIndex(0);
    setMode("forward");
    setReplayKey((key) => key + 1);
  };

  const goBack = () => {
    if (mode === "reverse") return;
    setSlideIndex(0);
    reverseStart.current = mode === "forward" && videoRef.current?.duration
      ? Math.max(0, videoRef.current.duration - videoRef.current.currentTime)
      : 0;
    videoRef.current?.pause();
    setMode("reverse");
  };

  const currentSlide = interiorSlides[slideIndex];

  return (
    <main className={`interior-page ${showPhoto ? "is-photo" : "is-film"}`}>
      <header className="interior-header">
        <Link className="interior-brand" href="/cottages/two-bedroom"><span>M</span><b>Marietta Muse</b></Link>
        <SiteNav active="rentals" />
        <a className="interior-enquire" href="mailto:hello@mariettamuse.com?subject=Two-bedroom%20cottage%20enquiry">Enquire <ArrowUpRight size={13} /></a>
        <MobileSiteNav />
      </header>

      <section className="interior-scene" aria-label="Two-bedroom cottage interior">
        {interiorSlides.map((slide, index) => (
          <picture
            key={slide.desktop}
            className={`interior-photo ${styles.slide} ${slideIndex === index ? styles.activeSlide : ""}`}
          >
            <source media="(max-width: 760px)" srcSet={slide.mobile} />
            <Image
              src={slide.desktop}
              alt={slide.alt}
              width={slide.width}
              height={slide.height}
              priority
              quality={95}
              sizes="100vw"
            />
          </picture>
        ))}

        <video
          key={replayKey}
          ref={videoRef}
          className={`interior-film ${styles.filmFast} ${mode !== "forward" ? "is-finished" : ""}`}
          muted
          playsInline
          preload="auto"
          poster="/media/cottages/two-bedroom-video-first.jpg"
          onTimeUpdate={handleForwardTimeUpdate}
          onEnded={handleForwardEnded}
        >
          <source src="/media/cottages/two-bedroom-interior-mobile.mp4" media="(max-width: 760px)" type="video/mp4" />
          <source src="/media/cottages/two-bedroom-interior-desktop.mp4" type="video/mp4" />
        </video>

        {mode === "reverse" && (
          <video
            ref={reverseVideoRef}
            className={`interior-film interior-reverse ${styles.filmFast}`}
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/media/cottages/two-bedroom-interior.webp"
            onLoadedMetadata={(event) => {
              const v = event.currentTarget;
              v.defaultPlaybackRate = PLAYBACK_SPEED;
              v.playbackRate = PLAYBACK_SPEED;
              v.currentTime = reverseStart.current;
            }}
            onPlay={(event) => {
              event.currentTarget.playbackRate = PLAYBACK_SPEED;
            }}
            onEnded={() => router.push("/cottages/two-bedroom/plan")}
          >
            <source src="/media/cottages/two-bedroom-interior-mobile-reverse.mp4" media="(max-width: 760px)" type="video/mp4" />
            <source src="/media/cottages/two-bedroom-interior-desktop-reverse.mp4" type="video/mp4" />
          </video>
        )}
        <div className="interior-shade" aria-hidden="true" />

        {showPhoto && (
          <>
            {slideIndex === 0 ? (
              <button
                type="button"
                className={`${styles.sideArrow} ${styles.sideArrowRight}`}
                onClick={() => setSlideIndex(1)}
                aria-label="View living room"
              >
                <span>Living room</span>
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                className={`${styles.sideArrow} ${styles.sideArrowLeft}`}
                onClick={() => setSlideIndex(0)}
                aria-label="Back to kitchen view"
              >
                <ChevronLeft size={18} />
                <span>Kitchen view</span>
              </button>
            )}

            <div className="interior-content" key={currentSlide.eyebrow}>
              <p>{currentSlide.eyebrow}</p>
              <h1>{currentSlide.lead} <em>{currentSlide.accent}</em></h1>
              <span>{currentSlide.detail}</span>
            </div>
          </>
        )}

        <div className={`interior-bottom ${styles.dock}`}>
          <button className={styles.control} type="button" onClick={goBack} disabled={mode === "reverse"}><ArrowLeft size={14} /> {mode === "reverse" ? "Returning to plan" : "Back to the plan"}</button>
          <span className={styles.status} aria-live="polite">
            {mode === "reverse"
              ? "Playing the journey back"
              : showPhoto
                ? `${String(slideIndex + 1).padStart(2, "0")} / ${String(interiorSlides.length).padStart(2, "0")} · ${slideIndex === 0 ? "Kitchen" : "Living room"}`
                : "Interior tour · Playing"}
          </span>
          {showPhoto ? <button className={`${styles.control} ${styles.primary}`} type="button" onClick={replay}><RotateCcw size={13} /> Replay film</button> : mode === "forward" ? <button className={`${styles.control} ${styles.primary}`} type="button" onClick={() => { setSlideIndex(0); setMode("photo"); }}>Skip film <ArrowUpRight size={13} /></button> : null}
        </div>
      </section>
    </main>
  );
}
