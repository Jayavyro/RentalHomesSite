"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MoveHorizontal, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SiteNav from "../../../components/SiteNav";
import MobileSiteNav from "../../../components/MobileSiteNav";
import styles from "../../two-bedroom/interior/interior.module.css";

const PLAYBACK_SPEED = 1.3;

export default function OneBedroomInteriorPage() {
  // With Cache Components enabled, Next.js preserves page state via React <Activity>.
  // Incrementing visitKey inside useLayoutEffect cleanup guarantees that every time
  // this page is hidden (navigated away from) and later reopened, <OneBedroomInteriorTour>
  // mounts completely fresh with a new <video> element and clean state.
  const [visitKey, setVisitKey] = useState(0);
  useLayoutEffect(() => {
    return () => {
      setVisitKey((k) => k + 1);
    };
  }, []);
  return <OneBedroomInteriorTour key={visitKey} />;
}

function OneBedroomInteriorTour() {
  const router = useRouter();
  const [mode, setMode] = useState<"forward" | "photo" | "reverse">("forward");
  const [replayKey, setReplayKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reverseCanvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ active: boolean; startX: number; scrollLeft: number }>({
    active: false,
    startX: 0,
    scrollLeft: 0,
  });
  const reverseFromTime = useRef(0);
  const showPhoto = mode === "photo";

  const centerScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollWidth > el.clientWidth) {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    }
  }, []);

  useEffect(() => {
    if (!showPhoto) return;
    centerScroll();
    const t = window.setTimeout(centerScroll, 60);
    window.addEventListener("resize", centerScroll);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", centerScroll);
    };
  }, [showPhoto, centerScroll]);

  useEffect(() => {
    if (mode !== "forward") return;
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
  }, [replayKey, mode]);

  // Smooth reverse journey back to the plan at the exact same speed (PLAYBACK_SPEED) on both desktop and mobile
  useEffect(() => {
    if (mode !== "reverse") return;
    const video = videoRef.current;
    const canvas = reverseCanvasRef.current;
    if (!video || !canvas) {
      router.push("/cottages/one-bedroom/plan");
      return;
    }

    let cancelled = false;
    let rafId = 0;
    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 6.04;
    const startVideoTime = reverseFromTime.current > 0.2 ? reverseFromTime.current : duration;
    let currentTarget = startVideoTime;
    let lastTimestamp = performance.now();

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");

    const drawCurrentFrame = () => {
      if (ctx && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
    };

    video.pause();
    drawCurrentFrame();

    const stepReverse = () => {
      if (cancelled) return;
      const now = performance.now();
      const dt = Math.min(0.1, (now - lastTimestamp) / 1000);
      lastTimestamp = now;
      currentTarget -= dt * PLAYBACK_SPEED;

      if (currentTarget <= 0.05) {
        router.push("/cottages/one-bedroom/plan");
        return;
      }

      const onSeeked = () => {
        if (cancelled) return;
        drawCurrentFrame();
        rafId = window.requestAnimationFrame(stepReverse);
      };

      video.addEventListener("seeked", onSeeked, { once: true });
      try {
        video.currentTime = Math.max(0, currentTarget);
      } catch {
        router.push("/cottages/one-bedroom/plan");
      }
    };

    rafId = window.requestAnimationFrame(stepReverse);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
    };
  }, [mode, router]);

  const handleForwardTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (mode === "forward" && video.duration > 1 && video.currentTime >= video.duration - 0.18) {
      setMode("photo");
    }
  };

  const handleForwardEnded = () => {
    const video = videoRef.current;
    if (video && video.currentTime < 1) {
      video.currentTime = 0;
      video.playbackRate = PLAYBACK_SPEED;
      video.play().catch(() => setMode("photo"));
      return;
    }
    setMode("photo");
  };

  const replay = () => {
    setMode("forward");
    setReplayKey((key) => key + 1);
  };

  const goBack = () => {
    if (mode === "reverse") return;
    const video = videoRef.current;
    centerScroll();
    reverseFromTime.current =
      mode === "forward" && video?.currentTime && video.currentTime > 0.2
        ? video.currentTime
        : video?.duration || 6.04;
    video?.pause();
    setMode("reverse");
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    dragState.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: el.scrollLeft,
    };
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = event.clientX - dragState.current.startX;
    el.scrollLeft = dragState.current.scrollLeft - dx;
  };

  const handleMouseUp = () => {
    dragState.current.active = false;
  };

  return (
    <main className={`interior-page ${showPhoto ? "is-photo" : "is-film"}`}>
      <header className="interior-header">
        <Link className="interior-brand" href="/cottages/one-bedroom"><span>M</span><b>Marietta Muse</b></Link>
        <SiteNav active="rentals" />
        <a className="interior-enquire" href="mailto:hello@mariettamuse.com?subject=One-bedroom%20cottage%20enquiry">Enquire <ArrowUpRight size={13} /></a>
        <MobileSiteNav />
      </header>

      <section className="interior-scene" aria-label="One-bedroom cottage interior">
        <div
          ref={scrollRef}
          className={`interior-photo ${styles.slide} ${styles.activeSlide}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className={styles.panTrack}>
            <img
              src="/media/cottages/one-bedroom-interior.jpg"
              alt="Warm timber ceiling, L-shaped wood kitchen, sunlit living room and glimpse into the bedroom and bathroom of the one-bedroom cottage"
              width={1024}
              height={576}
              fetchPriority="high"
              decoding="async"
              draggable={false}
              onLoad={centerScroll}
            />
          </div>
        </div>

        <video
          key={replayKey}
          ref={videoRef}
          className={`interior-film ${styles.filmFull} ${styles.filmFast} ${mode !== "forward" ? "is-finished" : ""}`}
          src="/media/cottages/one-bedroom-interior.mp4"
          muted
          playsInline
          preload="auto"
          poster="/media/cottages/One breddroom.png"
          onTimeUpdate={handleForwardTimeUpdate}
          onEnded={handleForwardEnded}
        />

        {mode === "reverse" && (
          <canvas
            ref={reverseCanvasRef}
            className={`interior-film interior-reverse ${styles.filmFull} ${styles.filmFast}`}
          />
        )}

        <div className="interior-shade" aria-hidden="true" />

        {showPhoto && (
          <>
            <div className={styles.panHint} aria-hidden="true">
              <MoveHorizontal size={13} />
              <span>Drag or swipe to look around</span>
            </div>

            <div className={`interior-content ${styles.content}`}>
              <p>The heart of home</p>
              <h1>Warm wood, <em>open light.</em></h1>
              <span>Vaulted timber ceilings, a full L-shaped kitchen and an airy living space designed to feel calm and complete.</span>
            </div>
          </>
        )}

        <div className={`interior-bottom ${styles.dock}`}>
          <button className={styles.control} type="button" onClick={goBack} disabled={mode === "reverse"}>
            <ArrowLeft size={14} /> {mode === "reverse" ? "Returning to plan" : "Back to the plan"}
          </button>
          <span className={styles.status} aria-live="polite">
            {mode === "reverse"
              ? "Playing the journey back"
              : showPhoto
                ? "Interior tour · Complete"
                : "Interior tour · Playing"}
          </span>
          {showPhoto ? (
            <button className={`${styles.control} ${styles.primary}`} type="button" onClick={replay}>
              <RotateCcw size={13} /> Replay film
            </button>
          ) : mode === "forward" ? (
            <button className={`${styles.control} ${styles.primary}`} type="button" onClick={() => setMode("photo")}>
              Skip film <ArrowUpRight size={13} />
            </button>
          ) : null}
        </div>
      </section>
    </main>
  );
}

