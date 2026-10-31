"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight, Leaf, MapPin, Play, TreePine } from "lucide-react";

type Phase = "loading" | "film" | "reveal" | "masterplan";

const moments = [
  { from: 0.08, to: 0.37, kicker: "A new way home", lead: "Something beautiful", accent: "is taking root." },
  { from: 0.42, to: 0.70, kicker: "Small footprint · Full feeling", lead: "Live small.", accent: "Feel more." },
  { from: 0.84, to: 1.01, kicker: "Marietta · Oklahoma", lead: "Welcome to", accent: "Marietta Muse" },
];

const features = [
  { className: "feature-private", icon: MapPin, title: "Private plots", detail: "A little space to truly call your own." },
  { className: "feature-trails", icon: TreePine, title: "Shaded trails", detail: "Winding paths through mature green buffers." },
  { className: "feature-garden", icon: Leaf, title: "Shared garden", detail: "A landscape designed for everyday connection." },
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLElement>(null);
  const activeMomentRef = useRef(-1);
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(8);
  const [moment, setMoment] = useState(-1);
  const [muted, setMuted] = useState(true);
  const [playBlocked, setPlayBlocked] = useState(false);

  const revealMasterplan = useCallback(() => {
    activeMomentRef.current = -1;
    setMoment(-1);
    setPhase("reveal");
    window.setTimeout(() => setPhase("masterplan"), 1450);
  }, []);

  const startFilm = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 0.65;
    setPhase("film");
    setPlayBlocked(false);
    try { await video.play(); } catch { setPlayBlocked(true); }
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    const started = performance.now();
    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(value + Math.max(1, (88 - value) * 0.08), 88));
    }, 90);
    const onReady = () => {
      const wait = Math.max(0, 1450 - (performance.now() - started));
      window.setTimeout(() => {
        window.clearInterval(timer);
        setProgress(100);
        window.setTimeout(startFilm, 260);
      }, wait);
    };
    const video = videoRef.current;
    if (video?.readyState && video.readyState >= 3) onReady();
    else video?.addEventListener("canplay", onReady, { once: true });
    const fallback = window.setTimeout(onReady, 7000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(fallback);
      video?.removeEventListener("canplay", onReady);
    };
  }, [phase, startFilm]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let frameId = 0;
    const paintFrame = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        const ratio = video.currentTime / video.duration;
        if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${ratio})`;
        const nextMoment = moments.findIndex(({ from, to }) => ratio >= from && ratio < to);
        if (nextMoment !== activeMomentRef.current) {
          activeMomentRef.current = nextMoment;
          setMoment(nextMoment);
        }
      }
      if (!video.paused && !video.ended) frameId = video.requestVideoFrameCallback(paintFrame);
    };
    const begin = () => { frameId = video.requestVideoFrameCallback(paintFrame); };
    video.addEventListener("play", begin);
    return () => {
      video.removeEventListener("play", begin);
      if (frameId) video.cancelVideoFrameCallback(frameId);
    };
  }, []);

  const replay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setMoment(-1);
    activeMomentRef.current = -1;
    if (progressBarRef.current) progressBarRef.current.style.transform = "scaleX(0)";
    let started = false;
    const playFromStart = () => {
      if (started) return;
      started = true;
      video.removeEventListener("seeked", playFromStart);
      video.playbackRate = 0.65;
      setPhase("film");
      window.requestAnimationFrame(() => { void video.play(); });
    };
    video.addEventListener("seeked", playFromStart, { once: true });
    video.currentTime = 0;
    if (!video.seeking && video.currentTime < 0.02) playFromStart();
  };

  return (
    <main className={`experience phase-${phase}`}>
      <video ref={videoRef} className="entry-film" muted={muted} playsInline preload="auto" poster="/media/landscape-poster.jpg" onEnded={revealMasterplan} onError={revealMasterplan} aria-label="A cinematic introduction to Marietta Muse">
        <source media="(max-width: 767px)" src="/media/entry-video-mobile.mp4" type="video/mp4" />
        <source src="/media/entry-video-desktop.mp4" type="video/mp4" />
      </video>
      <div className="film-grade" aria-hidden="true" />

      <section className="loader" aria-live="polite" aria-label={`Loading ${Math.round(progress)} percent`}>
        <div className="loader-mark"><svg viewBox="0 0 120 120" aria-hidden="true"><circle className="loader-track" cx="60" cy="60" r="55" /><circle className="loader-progress" cx="60" cy="60" r="55" pathLength="100" style={{ strokeDashoffset: 100 - progress }} /></svg><span>M</span></div>
        <p>Marietta Muse</p>
        <div className="loader-meta"><span>Preparing your arrival</span><strong>{Math.round(progress).toString().padStart(2, "0")}</strong></div>
      </section>

      <section className="film-layer" aria-hidden={phase !== "film"}>
        <header className="film-header"><a className="brand" href="#masterplan"><span>M</span><b>Marietta Muse</b></a><button className="sound-button" type="button" onClick={() => setMuted((value) => !value)}>{muted ? "Sound off" : "Sound on"}<i aria-hidden="true"><em /><em /><em /></i></button></header>
        <div className="cinematic-copy" aria-live="polite">
          {moments.map((item, index) => <div className={`moment ${moment === index ? "is-active" : ""}`} key={item.accent}><span className="moment-kicker">{item.kicker}</span><h1><span className="moment-lead">{item.lead}</span><em>{item.accent}</em></h1></div>)}
        </div>
        <button className="skip-button" type="button" onClick={revealMasterplan}>Skip intro <ArrowUpRight size={13} /></button>
        {playBlocked && <button className="play-button" type="button" onClick={startFilm}><Play size={17} fill="currentColor" /> Play film</button>}
        <div className="film-timeline" aria-hidden="true"><i ref={progressBarRef} /></div>
      </section>

      <section className="masterplan" id="masterplan" aria-hidden={phase !== "masterplan"}>
        <div className="masterplan-bg" /><div className="masterplan-wash" />
        <header className="site-header"><a className="brand" href="#masterplan"><span>M</span><b>Marietta Muse</b></a><nav aria-label="Main navigation"><a href="#masterplan">Design &amp; Layout</a><a href="#rentals">Rentals</a><a href="#location">Location</a><a href="mailto:hello@mariettamuse.com">Contact</a></nav><p>A simpler tomorrow</p></header>
        <div className="masterplan-copy"><div className="eyebrow">The masterplan</div><h2>Designed for<br /><em>belonging.</em></h2><p>A collection of modern cottages, connected by nature and crafted for a richer everyday.</p><a className="outline-link" href="#vision">Explore design &amp; layout <ArrowDown size={14} /></a></div>
        <div className="feature-list" aria-label="Community features">
          {features.map(({ className, icon: Icon, title, detail }) => <button className={`feature ${className}`} type="button" key={title}><span><Icon size={15} strokeWidth={1.4} /></span><b>{title}</b><small>{detail}</small></button>)}
        </div>
        <div className="masterplan-foot"><button type="button" onClick={replay}><Play size={12} fill="currentColor" /> Replay film</button><div><strong>65%</strong><span>Dedicated<br />open nature</span></div><p>Design&nbsp; / &nbsp;Layout</p></div>
      </section>

      <div className="below-fold" aria-hidden={phase !== "masterplan"}>
        <section className="site-plan-section" id="vision" aria-labelledby="site-plan-title">
          <div className="site-plan-copy">
            <div className="section-kicker">Design &amp; layout</div>
            <h2 id="site-plan-title">A masterplan<br />built around <em>nature.</em></h2>
            <p>Room to breathe is part of the plan. Open green space, quiet trails and a close-knit collection of homes keep the landscape at the heart of everyday life.</p>
            <div className="site-plan-stat"><strong>Rooted</strong><span>in the natural<br />landscape</span></div>
          </div>
          <div className="site-plan-frame">
            <Image src="/media/site-plan.png" alt="Detailed site plan of the Marietta Muse community" width={4096} height={3151} sizes="100vw" />
            <div className="plan-key"><span><i /> Cottages</span><span><i /> Community spaces</span><span><i /> Open nature</span></div>
          </div>
        </section>

        <section className="residence-grid" id="rentals">
          <article className="residence-card">
            <Image src="/media/cottage-exterior.jpg" alt="A Marietta Muse cottage surrounded by gardens" fill sizes="(max-width: 760px) 100vw, 50vw" />
            <div className="residence-shade" />
            <div className="residence-copy"><div className="section-kicker light">Your own retreat</div><h2>A little space<br />to call yours.</h2><p>Thoughtful proportions, a private outdoor edge and everything you need—nothing you do not.</p><a href="mailto:hello@mariettamuse.com">Discover the cottages <ArrowUpRight size={14} /></a></div>
          </article>
          <article className="residence-card">
            <Image src="/media/cottage-interior.jpg" alt="Warm, light-filled cottage interior" fill sizes="(max-width: 760px) 100vw, 50vw" />
            <div className="residence-shade" />
            <div className="residence-copy"><div className="section-kicker light">Made for living</div><h2>Small footprint.<br />Full feeling.</h2><p>Natural textures and light-filled rooms make space for the moments that matter.</p><a href="mailto:hello@mariettamuse.com">Explore rentals <ArrowUpRight size={14} /></a></div>
          </article>
        </section>

        <section className="location-section" id="location">
          <div className="location-mark"><MapPin size={22} strokeWidth={1.2} /></div>
          <div><div className="section-kicker">Marietta, Oklahoma</div><h2>Close to nature.<br /><em>Connected to life.</em></h2></div>
          <div className="location-note"><p>A quiet landscape, a close-knit community and an easier rhythm—rooted in southern Oklahoma.</p><a href="https://maps.google.com/?q=Marietta,Oklahoma" target="_blank" rel="noreferrer">View location <ArrowRight size={14} /></a></div>
        </section>

        <footer className="closing-section" id="contact">
          <div className="closing-top"><div><div className="section-kicker light"><span>Marietta Muse</span> Oklahoma</div><h2>Come home<br />to <em>a little more.</em></h2></div><a className="contact-pill" href="mailto:hello@mariettamuse.com">Start a conversation <ArrowUpRight size={16} /></a></div>
          <div className="closing-bottom"><span>Marietta Muse</span><span>A simpler tomorrow</span><span>© 2026</span></div>
        </footer>
      </div>
    </main>
  );
}
