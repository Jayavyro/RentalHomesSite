"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SiteNav from "../../../components/SiteNav";
import MobileSiteNav from "../../../components/MobileSiteNav";
import styles from "./interior.module.css";

export default function TwoBedroomInteriorPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"forward" | "photo" | "reverse">("forward");
  const [replayKey, setReplayKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reverseStart = useRef(0);
  const showPhoto = mode === "photo";

  const replay = () => {
    setMode("forward");
    setReplayKey((key) => key + 1);
  };
  const goBack = () => {
    if (mode === "reverse") return;
    reverseStart.current = mode === "forward" && videoRef.current?.duration
      ? Math.max(0, videoRef.current.duration - videoRef.current.currentTime)
      : 0;
    videoRef.current?.pause();
    setMode("reverse");
  };

  return (
    <main className={`interior-page ${showPhoto ? "is-photo" : "is-film"}`}>
      <header className="interior-header">
        <Link className="interior-brand" href="/cottages/two-bedroom"><span>M</span><b>Marietta Muse</b></Link>
        <SiteNav active="rentals" />
        <a className="interior-enquire" href="mailto:hello@mariettamuse.com?subject=Two-bedroom%20cottage%20enquiry">Enquire <ArrowUpRight size={13} /></a>
        <MobileSiteNav />
      </header>

      <section className="interior-scene" aria-label="Two-bedroom cottage interior">
        <picture className="interior-photo">
          <source media="(max-width: 760px)" srcSet="/media/cottages/two-bedroom-interior-mobile.webp" />
          <Image src="/media/cottages/two-bedroom-interior.webp" alt="Warm, sunlit kitchen and adjoining living space in the two-bedroom cottage" width={2200} height={1228} priority quality={95} sizes="(max-width: 760px) 100vw, 100vw" />
        </picture>
        <video key={replayKey} ref={videoRef} className={`interior-film ${mode !== "forward" ? "is-finished" : ""}`} autoPlay muted playsInline preload="auto" poster="/media/cottages/two-bedroom-video-first.jpg" onEnded={() => setMode("photo")} onError={() => setMode("photo")}>
          <source src="/media/cottages/two-bedroom-interior-mobile.mp4" media="(max-width: 760px)" type="video/mp4" />
          <source src="/media/cottages/two-bedroom-interior-desktop.mp4" type="video/mp4" />
        </video>
        {mode === "reverse" && <video className="interior-film interior-reverse" autoPlay muted playsInline preload="auto" poster="/media/cottages/two-bedroom-interior.webp" onLoadedMetadata={(event) => { event.currentTarget.currentTime = reverseStart.current; }} onEnded={() => router.push("/cottages/two-bedroom/plan")}>
          <source src="/media/cottages/two-bedroom-interior-mobile-reverse.mp4" media="(max-width: 760px)" type="video/mp4" />
          <source src="/media/cottages/two-bedroom-interior-desktop-reverse.mp4" type="video/mp4" />
        </video>}
        <div className="interior-shade" aria-hidden="true" />
        {showPhoto && <div className="interior-content">
          <p>The heart of home</p>
          <h1>Room to <em>settle in.</em></h1>
          <span>Light moves through the kitchen and into a living space made for slow mornings and easy evenings.</span>
        </div>}
        <div className={`interior-bottom ${styles.dock}`}>
          <button className={styles.control} type="button" onClick={goBack} disabled={mode === "reverse"}><ArrowLeft size={14} /> {mode === "reverse" ? "Returning to plan" : "Back to the plan"}</button>
          <span className={styles.status} aria-live="polite">{mode === "reverse" ? "Playing the journey back" : showPhoto ? "Interior tour · Complete" : "Interior tour · Playing"}</span>
          {showPhoto ? <button className={`${styles.control} ${styles.primary}`} type="button" onClick={replay}><RotateCcw size={13} /> Replay film</button> : mode === "forward" ? <button className={`${styles.control} ${styles.primary}`} type="button" onClick={() => setMode("photo")}>Skip film <ArrowUpRight size={13} /></button> : null}
        </div>
      </section>
    </main>
  );
}
