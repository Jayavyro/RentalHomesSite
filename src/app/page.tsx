"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Droplets, House, MapPin, Menu, Play, X } from "lucide-react";

type Phase = "loading" | "film" | "reveal" | "masterplan";
type MasterplanView = "phase-one" | "complete" | "original";
type LifestyleStage = "idle" | "entering" | "film" | "still";

const masterplanViews: { id: MasterplanView; label: string; image: string }[] = [
  { id: "phase-one", label: "Phase 1", image: "/media/masterplan-phase-1.jpg" },
  { id: "complete", label: "Full plan", image: "/media/masterplan-new.jpg" },
  { id: "original", label: "Original", image: "/media/masterplan-aerial.jpg" },
];

const lifestyleSlides = [
  { desktop: "/media/lifestyle/gathering-final-desktop.webp", mobile: "/media/lifestyle/gathering-final-mobile.webp", alt: "The shared gathering area at Marietta Muse", eyebrow: "Life at Marietta Muse", lead: "Gather,", accent: "naturally.", detail: "Spaces made for slower afternoons, familiar faces and an everyday sense of belonging." },
  { desktop: "/media/lifestyle/gathering-carousel-01-desktop.webp", mobile: "/media/lifestyle/gathering-carousel-01-mobile.webp", alt: "A gathering space at Marietta Muse", eyebrow: "Made for togetherness", lead: "A place to", accent: "linger.", detail: "An easy common ground for a morning coffee, a shared meal or a conversation that runs long." },
  { desktop: "/media/lifestyle/gathering-carousel-02-desktop.webp", mobile: "/media/lifestyle/gathering-carousel-02-mobile.webp", alt: "Life around the gathering area at Marietta Muse", eyebrow: "The everyday ritual", lead: "More life", accent: "outside.", detail: "Open air, warm light and thoughtful places that make everyday life feel a little more connected." },
];

const moments = [
  { from: 0.08, to: 0.37, kicker: "A new way home", lead: "Something beautiful", accent: "is taking root." },
  { from: 0.42, to: 0.70, kicker: "Small footprint · Full feeling", lead: "Live small.", accent: "Feel more." },
  { from: 0.84, to: 1.01, kicker: "Marietta · Oklahoma", lead: "Welcome to", accent: "Marietta Muse" },
];

const features = [
  { className: "feature-private", icon: House, title: "Cottages", detail: "Modern one- and two-bedroom cottages, each with a private outdoor edge." },
  { className: "feature-garden", icon: Droplets, title: "Lifestyle", detail: "A landscaped fountain at the heart of everyday community life." },
];

export default function Home() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const lifestyleVideoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLElement>(null);
  const activeMomentRef = useRef(-1);
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(8);
  const [moment, setMoment] = useState(-1);
  const [muted, setMuted] = useState(true);
  const [playBlocked, setPlayBlocked] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [masterplanView, setMasterplanView] = useState<MasterplanView>("complete");
  const [cottageTransition, setCottageTransition] = useState(false);
  const [lifestyleStage, setLifestyleStage] = useState<LifestyleStage>("idle");
  const [lifestyleSlide, setLifestyleSlide] = useState(0);

  const revealMasterplan = useCallback(() => {
    activeMomentRef.current = -1;
    setMoment(-1);
    setPhase("reveal");
    window.setTimeout(() => setPhase("masterplan"), 1450);
  }, []);

  const startFilm = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 1;
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

  useEffect(() => {
    if (phase !== "masterplan" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setMasterplanView((current) => {
        const currentIndex = masterplanViews.findIndex((view) => view.id === current);
        return masterplanViews[(currentIndex + 1) % masterplanViews.length].id;
      });
    }, 5000);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    router.prefetch("/cottages");
  }, [router]);

  useEffect(() => {
    let timer = 0;
    const restoreMasterplan = () => {
      const returningFromCottages = window.sessionStorage.getItem("marietta-return-to-masterplan") === "true";
      if (returningFromCottages) window.sessionStorage.removeItem("marietta-return-to-masterplan");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setCottageTransition(false);
        if (returningFromCottages) setPhase("masterplan");
      }, 0);
    };
    restoreMasterplan();
    window.addEventListener("popstate", restoreMasterplan);
    window.addEventListener("pageshow", restoreMasterplan);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("popstate", restoreMasterplan);
      window.removeEventListener("pageshow", restoreMasterplan);
    };
  }, []);

  const openCottages = () => {
    if (cottageTransition) return;
    setCottageTransition(true);
    window.setTimeout(() => {
      router.push("/cottages");
    }, 760);
  };

  const openLifestyle = () => {
    if (lifestyleStage !== "idle") return;
    setLifestyleSlide(0);
    setLifestyleStage("entering");
    window.setTimeout(() => {
      setLifestyleStage("film");
      const video = lifestyleVideoRef.current;
      if (video) {
        video.currentTime = 0;
        void video.play().catch(() => setLifestyleStage("still"));
      }
    }, 620);
  };

  const closeLifestyle = () => {
    lifestyleVideoRef.current?.pause();
    setLifestyleSlide(0);
    setLifestyleStage("idle");
  };

  const skipLifestyleFilm = () => {
    lifestyleVideoRef.current?.pause();
    setLifestyleStage("still");
  };

  const changeLifestyleSlide = (direction: -1 | 1) => {
    setLifestyleSlide((current) => (current + direction + lifestyleSlides.length) % lifestyleSlides.length);
  };

  useEffect(() => {
    if (lifestyleStage !== "still") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      changeLifestyleSlide(event.key === "ArrowLeft" ? -1 : 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lifestyleStage]);

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
      video.playbackRate = 1;
      setPhase("film");
      window.requestAnimationFrame(() => { void video.play(); });
    };
    video.addEventListener("seeked", playFromStart, { once: true });
    video.currentTime = 0;
    if (!video.seeking && video.currentTime < 0.02) playFromStart();
  };

  return (
    <main className={`experience phase-${phase}${cottageTransition ? " is-cottage-transition" : ""}${lifestyleStage !== "idle" ? " is-lifestyle-open" : ""}`}>
      <video ref={videoRef} className="entry-film" muted={muted} playsInline preload="auto" poster="/media/landscape-poster.jpg" onEnded={revealMasterplan} onError={revealMasterplan} aria-label="A cinematic introduction to Marietta Muse">
        <source media="(max-width: 767px)" src="/media/entry-video-mobile-hq.mp4" type="video/mp4" />
        <source src="/media/entry-video-desktop-hq.mp4" type="video/mp4" />
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
        <div className="masterplan-gallery" aria-hidden="true">
          {masterplanViews.map((view) => <Image className={masterplanView === view.id ? "is-active" : ""} key={view.id} src={view.image} alt="" fill priority={view.id === "complete"} quality={92} sizes="100vw" />)}
        </div>
        <div className="masterplan-wash" />
        <header className="site-header">
          <a className="brand desktop-brand" href="#masterplan"><span>M</span><b>Marietta Muse</b></a>
          <a className="brand mobile-brand" href="#masterplan"><span>M</span><b>Marietta Muse</b></a>
          <nav aria-label="Main navigation"><a href="#masterplan">Design &amp; Layout</a><a href="#rentals">Rentals</a><Link href="/location">Location</Link><Link href="/contact">Contact</Link></nav>
          <div className="plan-switcher" role="group" aria-label="Choose a master plan view">
            <span>A simpler tomorrow</span>
            <div>{masterplanViews.map((view) => <button className={masterplanView === view.id ? "is-active" : ""} type="button" key={view.id} onClick={() => setMasterplanView(view.id)} aria-pressed={masterplanView === view.id}>{view.label}</button>)}</div>
          </div>
          <button className="hamburger" type="button" aria-label="Open navigation menu" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(true)}><Menu size={17} strokeWidth={1.5} /></button>
        </header>
        <div className={`mobile-menu ${mobileMenuOpen ? "is-open" : ""}`} aria-hidden={!mobileMenuOpen}>
          <div className="mobile-menu-head"><span>Marietta Muse</span><button type="button" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)}><X size={18} /></button></div>
          <nav aria-label="Mobile navigation"><a href="#masterplan" onClick={() => setMobileMenuOpen(false)}><span>01</span>Design &amp; Layout</a><a href="#rentals" onClick={() => setMobileMenuOpen(false)}><span>02</span>Rentals</a><Link href="/location" onClick={() => setMobileMenuOpen(false)}><span>03</span>Location</Link><Link href="/contact" onClick={() => setMobileMenuOpen(false)}><span>04</span>Contact</Link></nav>
          <p>Marietta, Oklahoma<br />A simpler tomorrow</p>
        </div>
        <div className="masterplan-copy"><div className="eyebrow">The masterplan <span>· {masterplanViews.find((view) => view.id === masterplanView)?.label}</span></div><h2>Designed for <em>belonging.</em></h2><p>A collection of modern cottages, connected by nature and crafted for a richer everyday.</p><a className="outline-link" href="#vision">Explore design &amp; layout <ArrowDown size={14} /></a></div>
        <div className={`feature-list is-visible view-${masterplanView}`} data-view={masterplanView} aria-label="Community features">
          {features.map(({ className, icon: Icon, title, detail }) => className === "feature-private" ? (
            <Link className={`feature ${className}`} href="/cottages" key={title} aria-label="Explore the cottage collection" onClick={(event) => { event.preventDefault(); openCottages(); }}><span><Icon size={15} strokeWidth={1.4} /></span><b>{title}</b><small>{detail}</small></Link>
          ) : (
            <button className={`feature ${className}`} type="button" key={title} aria-label={`Explore ${title}`} onClick={openLifestyle}><span><Icon size={15} strokeWidth={1.4} /></span><b>{title}</b><small>{detail}</small></button>
          ))}
        </div>
        <div className="masterplan-foot"><button type="button" onClick={replay}><Play size={12} fill="currentColor" /> Replay film</button><div><strong>65%</strong><span>Dedicated<br />open nature</span></div><p>Design&nbsp; / &nbsp;Layout</p></div>
      </section>

      <section className={`lifestyle-journey lifestyle-${lifestyleStage}`} aria-hidden={lifestyleStage === "idle"} aria-label="Life at Marietta Muse">
        <div className="lifestyle-journey-media">
          <video ref={lifestyleVideoRef} muted playsInline preload="auto" poster="/media/lifestyle/gathering-final-desktop.webp" onEnded={() => setLifestyleStage("still")}>
            <source media="(max-width: 767px)" src="/media/lifestyle/gathering-source.mp4" type="video/mp4" />
            <source src="/media/lifestyle/gathering-source.mp4" type="video/mp4" />
          </video>
          {lifestyleSlides.map((slide, index) => <picture className={`lifestyle-slide${lifestyleSlide === index ? " is-active" : ""}`} key={slide.desktop}>
            <source media="(max-width: 767px)" srcSet={slide.mobile} />
            <img src={slide.desktop} alt={slide.alt} />
          </picture>)}
          <div className="lifestyle-journey-shade" />
        </div>
        <div className="lifestyle-journey-copy"><span>{lifestyleSlides[lifestyleSlide].eyebrow}</span><h2>{lifestyleSlides[lifestyleSlide].lead}<br /><em>{lifestyleSlides[lifestyleSlide].accent}</em></h2><p>{lifestyleSlides[lifestyleSlide].detail}</p></div>
        <div className="lifestyle-carousel-controls" aria-label="Gathering area image gallery">
          <button type="button" onClick={() => changeLifestyleSlide(-1)} aria-label="Previous gathering area image"><ChevronLeft size={16} /><span>Previous</span></button>
          <span>{String(lifestyleSlide + 1).padStart(2, "0")} / {String(lifestyleSlides.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => changeLifestyleSlide(1)} aria-label="Next gathering area image"><span>Next</span><ChevronRight size={16} /></button>
        </div>
        <button className="lifestyle-skip" type="button" onClick={skipLifestyleFilm}>Skip film <ArrowRight size={14} /></button>
        <button className="lifestyle-close" type="button" onClick={closeLifestyle}><X size={16} /> Back to masterplan</button>
      </section>

      <div className="below-fold" aria-hidden={phase !== "masterplan"}>
        <section className="site-plan-section" id="vision" aria-labelledby="site-plan-title">
          <div className="site-plan-copy">
            <div className="section-kicker">Design &amp; layout</div>
            <h2 id="site-plan-title">A masterplan<br />built around <em>nature.</em></h2>
            <p>Open green spaces and quiet walking paths connect the cottages, giving you more room to enjoy every day.</p>
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
          <div className="location-head">
            <div className="location-mark"><MapPin size={22} strokeWidth={1.2} /></div>
            <div className="section-kicker">Marietta, Oklahoma</div>
            <h2>Close to nature.<br /><em>Connected to life.</em></h2>
            <p>A quiet landscape, a close-knit community and an easier rhythm—rooted in southern Oklahoma.</p>
            <a className="location-link" href="https://maps.google.com/?q=Marietta,Oklahoma" target="_blank" rel="noreferrer">View location <ArrowRight size={14} /></a>
          </div>
          <article className="winstar-card">
            <span className="winstar-tag">Nearby · Thackerville, OK</span>
            <h3>WinStar World <em>Casino &amp; Resort</em></h3>
            <p>One of the largest casino resorts in the world sits just across the Red River—dining, hotel stays and live entertainment, a short drive from home.</p>
            <ul>
              <li><strong>~20 min</strong><span>Drive from Marietta Muse</span></li>
              <li><strong>I-35</strong><span>Straight route north</span></li>
              <li><strong>Resort</strong><span>Dining, stays &amp; live shows</span></li>
            </ul>
            <a href="https://www.winstar.com/directions/" target="_blank" rel="noreferrer">WinStar directions <ArrowUpRight size={14} /></a>
          </article>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-intro">
            <div className="section-kicker light">Contact us</div>
            <h2>Let&apos;s find your<br /><em>place here.</em></h2>
            <p>Tell us a little about what you are looking for. We will help you explore cottages, availability and life at Marietta Muse.</p>
            <a href="mailto:hello@mariettamuse.com">hello@mariettamuse.com</a>
          </div>
          <form className="contact-form" action="mailto:hello@mariettamuse.com" method="post" encType="text/plain">
            <label><span>Your name</span><input type="text" name="name" autoComplete="name" placeholder="Full name" required /></label>
            <label><span>Email address</span><input type="email" name="email" autoComplete="email" placeholder="you@example.com" required /></label>
            <label><span>I&apos;m interested in</span><select name="interest" defaultValue=""><option value="" disabled>Select an option</option><option>Rental availability</option><option>Cottage designs</option><option>Location and visits</option><option>Something else</option></select></label>
            <label className="message-field"><span>Your message</span><textarea name="message" placeholder="Tell us what you would like to know" rows={4} required /></label>
            <button type="submit">Send enquiry <ArrowUpRight size={15} /></button>
          </form>
        </section>

        <footer className="closing-section">
          <div className="closing-top"><div><div className="section-kicker light"><span>Marietta Muse</span> Oklahoma</div><h2>Come home<br />to <em>a little more.</em></h2></div><a className="contact-pill" href="mailto:hello@mariettamuse.com">Start a conversation <ArrowUpRight size={16} /></a></div>
          <nav className="footer-sitemap" aria-label="Sitemap"><a href="#masterplan">Design &amp; Layout</a><a href="#rentals">Rentals</a><Link href="/location">Location</Link><Link href="/contact">Contact</Link><a href="/login">Login</a></nav>
          <div className="closing-bottom"><span>Marietta Muse</span><span>A simpler tomorrow</span><span>© 2026</span></div>
        </footer>
      </div>
    </main>
  );
}
