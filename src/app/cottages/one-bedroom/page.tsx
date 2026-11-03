"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import SiteNav from "../../components/SiteNav";

export default function OneBedroomPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="one-bedroom-page one-bedroom-original">
      <header className="one-bedroom-header">
        <Link className="one-bedroom-brand" href="/cottages"><span>M</span><b>Marietta Muse</b></Link>
        <SiteNav className="one-bedroom-nav" active="rentals" />
        <a className="one-bedroom-enquire" href="mailto:hello@mariettamuse.com">Enquire <ArrowUpRight size={13} /></a>
        <button className="one-bedroom-menu" type="button" aria-label="Open navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(true)}><Menu size={17} /></button>
      </header>

      <div className={`mobile-menu cottage-mobile-menu ${mobileMenuOpen ? "is-open" : ""}`} aria-hidden={!mobileMenuOpen}>
        <div className="mobile-menu-head"><span>Marietta Muse</span><button type="button" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)}><X size={18} /></button></div>
        <nav aria-label="One-bedroom navigation">
          <Link href="/#masterplan" onClick={() => setMobileMenuOpen(false)}><span>01</span>Design &amp; layout</Link>
          <Link href="/cottages" onClick={() => setMobileMenuOpen(false)}><span>02</span>Cottages</Link>
          <Link href="/location" onClick={() => setMobileMenuOpen(false)}><span>03</span>Location</Link>
          <a href="mailto:hello@mariettamuse.com"><span>04</span>Enquire</a>
        </nav>
        <p>Marietta, Oklahoma<br />The one-bedroom cottage</p>
      </div>

      <section className="one-bedroom-hero" aria-labelledby="one-bedroom-title">
        <div className="one-bedroom-word" aria-hidden="true">ONE BEDROOM</div>

        <div className="one-bedroom-copy">
          <p>01 <i /> One-bedroom cottage</p>
          <h1 id="one-bedroom-title">Thoughtful proportions,<br /><em>inside and out.</em></h1>
          <span>An open living heart, a private bedroom and the practical spaces everyday life needs—considered as one calm, complete home.</span>
          <a href="mailto:hello@mariettamuse.com">Ask about availability <ArrowUpRight size={14} /></a>
        </div>

        <picture className="one-bedroom-visual">
          <source media="(max-width: 760px)" srcSet="/media/cottages/one-bedroom-cutout-mobile.webp" />
          <Image src="/media/cottages/one-bedroom-cutout-desktop.webp" alt="Cutaway view of the Marietta Muse one-bedroom cottage showing its bedroom, bathroom, kitchen, living space and deck" width={1774} height={887} priority quality={95} sizes="(max-width: 760px) 102vw, 55vw" />
        </picture>

        <aside className="one-bedroom-facts" aria-label="One-bedroom cottage facts">
          <strong>1</strong><span>bedroom</span>
          <strong>1</strong><span>bathroom</span>
          <strong>Open</strong><span>living plan</span>
        </aside>

        <div className="one-bedroom-feature-strip" aria-label="Plan features">
          <span><b>01</b> Living lounge</span><span><b>02</b> Full kitchen</span><span><b>03</b> Private suite</span><span><b>04</b> Outdoor deck</span>
        </div>

        <Link className="one-bedroom-back" href="/cottages"><ArrowLeft size={13} /> Back to cottages</Link>
      </section>
    </main>
  );
}
