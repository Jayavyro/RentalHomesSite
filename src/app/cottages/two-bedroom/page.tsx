"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Expand, Menu, X } from "lucide-react";
import { useState } from "react";
import SiteNav from "../../components/SiteNav";

const imageAlt = "Cutaway view of the two-bedroom cottage with two bedrooms, a bathroom, an open kitchen and living area, and an outdoor deck";

export default function TwoBedroomPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="one-bedroom-page one-bedroom-original two-bedroom-page">
      <header className="one-bedroom-header">
        <Link className="one-bedroom-brand" href="/cottages"><span>M</span><b>Marietta Muse</b></Link>
        <SiteNav className="one-bedroom-nav" active="rentals" />
        <a className="one-bedroom-enquire" href="mailto:hello@mariettamuse.com">Enquire <ArrowUpRight size={13} /></a>
        <button className="one-bedroom-menu" type="button" aria-label="Open navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(true)}><Menu size={17} /></button>
      </header>

      <div className={`mobile-menu cottage-mobile-menu ${mobileMenuOpen ? "is-open" : ""}`} aria-hidden={!mobileMenuOpen}>
        <div className="mobile-menu-head"><span>Marietta Muse</span><button type="button" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)}><X size={18} /></button></div>
        <nav aria-label="Two-bedroom navigation">
          <Link href="/#masterplan" onClick={() => setMobileMenuOpen(false)}><span>01</span>Design &amp; layout</Link>
          <Link href="/cottages" onClick={() => setMobileMenuOpen(false)}><span>02</span>Cottages</Link>
          <Link href="/location" onClick={() => setMobileMenuOpen(false)}><span>03</span>Location</Link>
          <a href="mailto:hello@mariettamuse.com"><span>04</span>Enquire</a>
        </nav>
        <p>Marietta, Oklahoma<br />The two-bedroom cottage</p>
      </div>

      <section className="one-bedroom-hero" aria-labelledby="two-bedroom-title">
        <div className="one-bedroom-word" aria-hidden="true">TWO BEDROOMS</div>
        <div className="one-bedroom-copy">
          <p>02 <i /> Two-bedroom cottage</p>
          <h1 id="two-bedroom-title">A little more room,<br /><em>all yours.</em></h1>
          <span>Two restful bedrooms sit beside an open kitchen and living space, with a deck that brings the outdoors into everyday life.</span>
          <div className="two-bedroom-actions">
            <Link className="two-bedroom-see-plan" href="/cottages/two-bedroom/plan">See plan <Expand size={13} /></Link>
            <a href="mailto:hello@mariettamuse.com?subject=Two-bedroom%20cottage%20enquiry">Ask about availability <ArrowUpRight size={13} /></a>
          </div>
        </div>

        <picture className="one-bedroom-visual">
          <source media="(max-width: 760px)" srcSet="/media/cottages/two-bedroom-cutout-mobile.webp" />
          <Image src="/media/cottages/two-bedroom-cutout-desktop.webp" alt={imageAlt} width={1774} height={887} priority quality={95} sizes="(max-width: 760px) 102vw, 55vw" />
        </picture>

        <aside className="one-bedroom-facts" aria-label="Two-bedroom cottage facts">
          <strong>2</strong><span>bedrooms</span>
          <strong>1</strong><span>bathroom</span>
          <strong>Open</strong><span>living plan</span>
        </aside>

        <div className="one-bedroom-feature-strip" aria-label="Plan features">
          <span><b>01</b> Two bedrooms</span><span><b>02</b> Full kitchen</span><span><b>03</b> Living room</span><span><b>04</b> Outdoor deck</span>
        </div>
        <Link className="one-bedroom-back" href="/cottages"><ArrowLeft size={13} /> Back to cottages</Link>
      </section>

    </main>
  );
}
