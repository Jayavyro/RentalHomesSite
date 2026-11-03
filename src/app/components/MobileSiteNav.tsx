"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function MobileSiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="standard-mobile-nav" type="button" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)}><Menu size={17} /></button>
      <div className={`mobile-menu standard-mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu-head"><span>Marietta Muse</span><button type="button" aria-label="Close navigation" onClick={() => setOpen(false)}><X size={18} /></button></div>
        <nav aria-label="Mobile navigation">
          <Link href="/#vision" onClick={() => setOpen(false)}><span>01</span>Design &amp; Layout</Link>
          <Link href="/cottages" onClick={() => setOpen(false)}><span>02</span>Rentals</Link>
          <Link href="/location" onClick={() => setOpen(false)}><span>03</span>Location</Link>
          <Link href="/contact" onClick={() => setOpen(false)}><span>04</span>Contact</Link>
        </nav>
        <p>Marietta, Oklahoma<br />A simpler tomorrow</p>
      </div>
    </>
  );
}
