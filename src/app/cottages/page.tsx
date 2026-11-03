"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUpRight, ChevronDown, House, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const cottageTypes = [
  {
    className: "cottage-pin-big",
    title: "Small footprint",
    detail: "A considered one-bedroom plan that keeps every essential beautifully close.",
    href: "#plan",
  },
  {
    className: "cottage-pin-small",
    title: "Full feeling",
    detail: "Natural light, honest materials and a garden edge make compact living feel generous.",
    href: "#exterior",
  },
];

const cottageFaqs = [
  { question: "What cottage plans are available?", answer: "The collection is centred on a considered one-bedroom plan, with an open living and kitchen space, a private bedroom wing and a flexible garden edge." },
  { question: "What is included with each cottage?", answer: "Each home is designed with a full kitchen, bathroom, storage, durable exterior materials and a thoughtfully landscaped setting." },
  { question: "Can I arrange a visit?", answer: "Yes. Reach out to our team and we will help you arrange a visit, explore availability and answer any questions about life at Marietta Muse." },
  { question: "How do I enquire about availability?", answer: "Use the enquiry link below or email hello@mariettamuse.com. We will share the latest availability and next steps." },
];

export default function CottagesPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const returnToMasterplan = () => {
    window.sessionStorage.setItem("marietta-return-to-masterplan", "true");
    router.back();
  };
  return (
    <main className="cottage-page">
      <section className="cottage-hero">
        <div className="cottage-scene-frame">
          <Image
            className="cottage-scene"
            src="/media/Zooming_into_cottage_scene_details_2K_20261027160207.jpg"
            alt="Aerial view of Marietta Muse cottages surrounded by gardens and tree-lined roads"
            width={2752}
            height={1536}
            priority
            quality={95}
            sizes="100vw"
          />
        </div>
        <div className="cottage-scene-shade" aria-hidden="true" />

        <header className="cottage-header">
          <button className="cottage-brand" type="button" onClick={returnToMasterplan} aria-label="Return to the master plan"><span>M</span><b>Marietta Muse</b></button>
          <nav className="cottage-desktop-nav" aria-label="Main navigation" style={{ display: "flex", alignItems: "center", gap: "clamp(22px, 3vw, 46px)", padding: "14px 24px", border: "1px solid rgba(255,255,255,.28)", borderRadius: "999px", background: "rgba(255,255,255,.11)", backdropFilter: "blur(16px)", fontSize: "8px", letterSpacing: ".18em", textTransform: "uppercase" }}><Link href="/#masterplan">Design &amp; Layout</Link><a href="#plan">Rentals</a><Link href="/location">Location</Link><a href="mailto:hello@mariettamuse.com">Contact</a></nav>
          <a href="mailto:hello@mariettamuse.com">Enquire <ArrowUpRight size={13} /></a>
          <button className="cottage-hamburger" type="button" aria-label="Open cottage navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(true)}><Menu size={17} strokeWidth={1.5} /></button>
        </header>

        <div className={`mobile-menu cottage-mobile-menu ${mobileMenuOpen ? "is-open" : ""}`} aria-hidden={!mobileMenuOpen}>
          <div className="mobile-menu-head"><span>Marietta Muse</span><button type="button" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)}><X size={18} /></button></div>
          <nav aria-label="Cottage navigation">
            <a href="#exterior" onClick={() => setMobileMenuOpen(false)}><span>01</span>Outside in</a>
            <a href="#plan" onClick={() => setMobileMenuOpen(false)}><span>02</span>The plan</a>
            <a href="#craft" onClick={() => setMobileMenuOpen(false)}><span>03</span>Materials</a>
            <a href="mailto:hello@mariettamuse.com"><span>04</span>Enquire</a>
          </nav>
          <p>Marietta, Oklahoma<br />The cottage collection</p>
        </div>

        <div className="cottage-intro" aria-labelledby="cottage-title">
          <div className="cottage-kicker">Your place, your pace</div>
          <h1 id="cottage-title">Two ways to<br /><em>feel at home.</em></h1>
          <p>Each cottage is shaped by light, landscape and a quieter rhythm—compact where it should be, generous where it matters.</p>
        </div>

        <nav className="cottage-pin-layer" aria-label="Explore cottage details">
          {cottageTypes.map(({ className, title, detail, href }) => (
            <a className={`cottage-type-pin ${className}`} href={href} key={title}>
              <span><House size={14} strokeWidth={1.4} /></span>
              <b>{title}</b>
              <small>{detail}</small>
            </a>
          ))}
        </nav>

        <footer className="cottage-footer">
          <button type="button" onClick={returnToMasterplan}><ArrowLeft size={13} /> Back to master plan</button>
          <a href="#exterior">Discover the cottage <ArrowDown size={13} /></a>
        </footer>
      </section>

      <section className="cottage-details" aria-label="Cottage details">
        <div className="cottage-details-intro">
          <div className="cottage-details-meta">
            <p>Small footprint <span>·</span> Full feeling</p>
            <p className="cottage-details-lede">Considered interiors, durable materials and an easy connection to the landscape.</p>
          </div>
          <h2>A home that leaves<br /><em>room for life.</em></h2>
        </div>

        <article className="cottage-detail-row cottage-layout-row" id="exterior">
          <figure className="cottage-detail-image">
            <Image src="/media/cottages/cottage-exterior.jpg" alt="Sage green cottage with a metal roof, garden and outdoor seating" width={2752} height={1536} quality={92} sizes="(max-width: 760px) 100vw, 52vw" />
          </figure>
          <div className="cottage-detail-copy">
            <span>01 / Outside in</span>
            <h3>Nature at<br /><em>the door.</em></h3>
            <p>A private garden edge, warm cedar steps and generous windows create a home that naturally opens into its setting.</p>
          </div>
        </article>

        <article className="cottage-detail-row is-reversed cottage-layout-row" id="plan">
          <figure className="cottage-detail-image cottage-plan-image">
            <Image src="/media/cottages/cottage-floor-plan.jpg" alt="One-bedroom cottage floor plan with an open kitchen and living room" width={2752} height={1536} quality={92} sizes="(max-width: 760px) 100vw, 52vw" />
          </figure>
          <div className="cottage-detail-copy">
            <span>02 / The plan</span>
            <h3>Everything<br /><em>close by.</em></h3>
            <p>An open kitchen and living room sit at the centre, with a full bedroom, bathroom and closet tucked into a calm private wing.</p>
            <div className="cottage-plan-facts"><b>1 bed</b><b>1 bath</b><b>Open living</b></div>
          </div>
        </article>

        <article className="cottage-material-card" id="craft">
          <div className="cottage-detail-copy">
            <span>03 / The details</span>
            <h3>Simple,<br /><em>well made.</em></h3>
            <p>Wood-lap siding, a metal roof, charcoal-framed windows and natural cedar bring a quiet consistency to every cottage.</p>
          </div>
          <figure className="cottage-material-image">
            <Image src="/media/cottages/cottage-materials.png" alt="Cottage material study showing roof, siding, windows, door and foundation" width={2048} height={1143} quality={92} sizes="(max-width: 760px) 100vw, 63vw" />
          </figure>
        </article>

        <div className="cottage-cta">
          <p>Marietta Muse, Oklahoma</p>
          <a href="mailto:hello@mariettamuse.com">Enquire about a cottage <ArrowUpRight size={15} /></a>
        </div>
      </section>

      <section className="cottage-faq" aria-labelledby="cottage-faq-title">
        <div className="cottage-faq-intro">
          <p>Questions, answered</p>
          <h2 id="cottage-faq-title">A little more<br /><em>to know.</em></h2>
        </div>
        <div className="cottage-faq-list">
          {cottageFaqs.map(({ question, answer }, index) => {
            const isOpen = openFaq === index;
            return <article className={`cottage-faq-item${isOpen ? " is-open" : ""}`} key={question}>
              <button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} aria-expanded={isOpen} aria-controls={`cottage-faq-answer-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span><b>{question}</b><ChevronDown size={17} aria-hidden="true" />
              </button>
              <div id={`cottage-faq-answer-${index}`} className="cottage-faq-answer"><p>{answer}</p></div>
            </article>;
          })}
        </div>
      </section>

      <footer className="cottage-site-footer">
        <div className="cottage-footer-top">
          <div>
            <p>Marietta Muse <span>·</span> Oklahoma</p>
            <h2>Find your<br /><em>place here.</em></h2>
          </div>
          <a href="mailto:hello@mariettamuse.com">Start a conversation <ArrowUpRight size={15} /></a>
        </div>
        <nav aria-label="Cottage footer navigation">
          <a href="#exterior">Outside in</a>
          <a href="#plan">The plan</a>
          <a href="#craft">Materials</a>
          <button type="button" onClick={returnToMasterplan}>Back to masterplan</button>
        </nav>
        <div className="cottage-footer-bottom"><span>Marietta Muse</span><span>A simpler tomorrow</span><span>© 2026</span></div>
      </footer>
    </main>
  );
}
