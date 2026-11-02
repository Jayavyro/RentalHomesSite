"use client";

import Image from "next/image";
import { ArrowDown, ArrowLeft, ArrowUpRight, House } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function CottagesPage() {
  const router = useRouter();

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
          <button className="cottage-brand" type="button" onClick={() => router.back()} aria-label="Return to the master plan"><span>M</span><b>Marietta Muse</b></button>
          <p>The cottage collection</p>
          <a href="mailto:hello@mariettamuse.com">Enquire <ArrowUpRight size={13} /></a>
        </header>

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
          <button type="button" onClick={() => router.back()}><ArrowLeft size={13} /> Back to master plan</button>
          <a href="#exterior">Discover the cottage <ArrowDown size={13} /></a>
        </footer>
      </section>

      <section className="cottage-details" aria-label="Cottage details">
        <div className="cottage-details-intro">
          <p>Small footprint <span>·</span> Full feeling</p>
          <h2>A home that leaves<br /><em>room for life.</em></h2>
        </div>

        <article className="cottage-detail-row" id="exterior">
          <figure className="cottage-detail-image">
            <Image src="/media/cottages/cottage-exterior.jpg" alt="Sage green cottage with a metal roof, garden and outdoor seating" width={2752} height={1536} quality={92} sizes="(max-width: 760px) 100vw, 52vw" />
          </figure>
          <div className="cottage-detail-copy">
            <span>01 / Outside in</span>
            <h3>Nature at<br /><em>the door.</em></h3>
            <p>A private garden edge, warm cedar steps and generous windows create a home that naturally opens into its setting.</p>
          </div>
        </article>

        <article className="cottage-detail-row is-reversed" id="plan">
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
    </main>
  );
}
