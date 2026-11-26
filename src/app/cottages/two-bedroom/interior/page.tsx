"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, MoveHorizontal, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SiteNav from "../../../components/SiteNav";
import MobileSiteNav from "../../../components/MobileSiteNav";
import styles from "./interior.module.css";

const PLAYBACK_SPEED = 1.3;
const INITIAL_SLIDE_INDEX = 1; // 0 = Bedroom (left), 1 = Kitchen (center, video landing), 2 = Living room (right)

const interiorSlides = [
  {
    name: "Bedroom",
    eyebrow: "Quiet retreat",
    lead: "Built for",
    accent: "deep rest.",
    detail: "A peaceful bedroom at the quiet end of the cottage, with a full wall of built-in closet storage and soft morning light.",
    desktop: "/media/cottages/Bedroom.png",
    width: 2000,
    height: 1125,
    alt: "Sunlit primary bedroom in the two-bedroom cottage with built-in wood closet, large window, and warm timber floors",
  },
  {
    name: "Kitchen",
    eyebrow: "The heart of home",
    lead: "Room to",
    accent: "settle in.",
    detail: "Light moves through the kitchen and into a living space made for slow mornings and easy evenings.",
    desktop: "/media/cottages/two-bedroom-interior.webp",
    width: 2200,
    height: 1228,
    alt: "Warm, sunlit kitchen and adjoining living space in the two-bedroom cottage",
  },
  {
    name: "Living room",
    eyebrow: "Open living area",
    lead: "Space to",
    accent: "unwind.",
    detail: "High shiplap ceilings, a ceiling fan, and an inviting living room that opens straight onto the private deck.",
    desktop: "/media/cottages/two-bedroom-living-hq.webp",
    width: 2400,
    height: 1338,
    alt: "Sunlit living room in the two-bedroom cottage with vaulted ceiling, sofa, media console, and glass door to the outdoor deck",
  },
];

export default function TwoBedroomInteriorPage() {
  // With Cache Components enabled, Next.js preserves page state via React <Activity>.
  // Incrementing visitKey inside useLayoutEffect cleanup guarantees that every time
  // this page is hidden (navigated away from) and later reopened, <InteriorTour>
  // mounts completely fresh with a new <video> element and clean state.
  const [visitKey, setVisitKey] = useState(0);
  useEffect(() => {
    return () => {
      setVisitKey((k) => k + 1);
    };
  }, []);
  return <InteriorTour key={visitKey} />;
}

function InteriorTour() {
  const router = useRouter();
  const [mode, setMode] = useState<"forward" | "photo" | "reverse">("forward");
  const [slideIndex, setSlideIndex] = useState(INITIAL_SLIDE_INDEX);
  const [replayKey, setReplayKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reverseVideoRef = useRef<HTMLVideoElement>(null);
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragState = useRef<{ active: boolean; startX: number; scrollLeft: number }>({
    active: false,
    startX: 0,
    scrollLeft: 0,
  });
  const reverseStart = useRef(0);
  const showPhoto = mode === "photo";

  const centerActiveScroll = useCallback((index: number) => {
    const el = scrollRefs.current[index];
    if (!el) return;
    if (el.scrollWidth > el.clientWidth) {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    }
  }, []);

    const goToSlide = useCallback((nextIndex: number) => {
      const clamped = Math.max(0, Math.min(interiorSlides.length - 1, nextIndex));
      setSlideIndex(clamped);
      window.requestAnimationFrame(() => centerActiveScroll(clamped));
    }, [centerActiveScroll]);

    useEffect(() => {
      if (!showPhoto) return;
      centerActiveScroll(slideIndex);
      const t = window.setTimeout(() => centerActiveScroll(slideIndex), 60);
      const onResize = () => centerActiveScroll(slideIndex);
      window.addEventListener("resize", onResize);
      return () => {
        window.clearTimeout(t);
        window.removeEventListener("resize", onResize);
      };
    }, [showPhoto, slideIndex, centerActiveScroll]);

    useEffect(() => {
      if (!showPhoto) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft" && slideIndex > 0) {
          event.preventDefault();
          goToSlide(slideIndex - 1);
        } else if (event.key === "ArrowRight" && slideIndex < interiorSlides.length - 1) {
          event.preventDefault();
          goToSlide(slideIndex + 1);
        }
      };
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPhoto, slideIndex, goToSlide]);

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
          setSlideIndex(INITIAL_SLIDE_INDEX);
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
      setSlideIndex(INITIAL_SLIDE_INDEX);
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
        setSlideIndex(INITIAL_SLIDE_INDEX);
        setMode("photo");
      });
      return;
    }
    setSlideIndex(INITIAL_SLIDE_INDEX);
    setMode("photo");
  };

  const replay = () => {
    setSlideIndex(INITIAL_SLIDE_INDEX);
    setMode("forward");
    setReplayKey((key) => key + 1);
  };

  const goBack = () => {
    if (mode === "reverse") return;
    setSlideIndex(INITIAL_SLIDE_INDEX);
    centerActiveScroll(INITIAL_SLIDE_INDEX);
    reverseStart.current = mode === "forward" && videoRef.current?.duration
      ? Math.max(0, videoRef.current.duration - videoRef.current.currentTime)
      : 0;
    videoRef.current?.pause();
    setMode("reverse");
  };

  const handleMouseDown = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRefs.current[index];
    if (!el || el.scrollWidth <= el.clientWidth) return;
    dragState.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: el.scrollLeft,
    };
  };

  const handleMouseMove = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const el = scrollRefs.current[index];
    if (!el) return;
    const dx = event.clientX - dragState.current.startX;
    el.scrollLeft = dragState.current.scrollLeft - dx;
  };

  const handleMouseUp = () => {
    dragState.current.active = false;
  };

  const currentSlide = interiorSlides[slideIndex];
  const prevSlide = slideIndex > 0 ? interiorSlides[slideIndex - 1] : null;
  const nextSlide = slideIndex < interiorSlides.length - 1 ? interiorSlides[slideIndex + 1] : null;

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
          <div
            key={slide.desktop}
            ref={(el) => { scrollRefs.current[index] = el; }}
            className={`interior-photo ${styles.slide} ${slideIndex === index ? styles.activeSlide : ""}`}
            onMouseDown={(e) => handleMouseDown(index, e)}
            onMouseMove={(e) => handleMouseMove(index, e)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className={styles.panTrack}>
                <img
                src={slide.desktop}
                alt={slide.alt}
                width={slide.width}
                height={slide.height}
                fetchPriority="high"
                decoding="async"
                draggable={false}
                onLoad={() => {
                  if (index === slideIndex) centerActiveScroll(index);
                }}
              />
            </div>
          </div>
        ))}

        <video
          key={replayKey}
          ref={videoRef}
          className={`interior-film ${styles.filmFull} ${styles.filmFast} ${mode !== "forward" ? "is-finished" : ""}`}
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
            className={`interior-film interior-reverse ${styles.filmFull} ${styles.filmFast}`}
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
            <source src="/media/cottages/two-bedroom-interior-desktop-reverse.mp4" media="(max-width: 760px) and (max-width: 0px)" type="video/mp4" />
            <source src="/media/cottages/two-bedroom-interior-desktop-reverse.mp4" type="video/mp4" />
          </video>
        )}
        <div className="interior-shade" aria-hidden="true" />

        {showPhoto && (
          <>
            <div className={styles.panHint} aria-hidden="true">
              <MoveHorizontal size={13} />
              <span>Drag or swipe to look around</span>
            </div>

              { prevSlide && (
                <button
                  type="button"
                  className={`${styles.sideArrow} ${styles.sideArrowLeft}`}
                  onClick={() => goToSlide(slideIndex - 1)}
                  aria-label={`View ${prevSlide.name.toLowerCase()}`}
                >
                  <ChevronLeft size={18} />
                  <span>{prevSlide.name}</span>
                </button>
            )}

            {nextSlide && (
              <button
                type="button"
                className={`${styles.sideArrow} ${styles.sideArrowRight}`}
                onClick={() => goToSlide(slideIndex + 1)}
                aria-label={`View ${nextSlide.name.toLowerCase()}`}
              >
                <span>{nextSlide.name}</span>
                <ChevronRight size={18} />
              </button>
            )}

            <div className={`interior-content ${styles.content}`} key={currentSlide.eyebrow}>
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
                  ? `${String(slideIndex + 1).padStart(2, "0")} / ${String(interiorSlides.length).padStart(2, "0")} · ${currentSlide.name}`
                  : "Interior tour · Playing"}
          </span>
          {showPhoto ? <button className={`${styles.control} ${styles.primary}`} type="button" onClick={replay}><RotateCcw size={13} /> Replay film</button> : mode === "forward" ? <button className={`${styles.control} ${styles.primary}`} type="button" onClick={() => { setSlideIndex(INITIAL_SLIDE_INDEX); setMode("photo"); }}>Skip film <ArrowUpRight size={13} /></button> : null}
        </div>
      </section>
    </main >
  );
}
