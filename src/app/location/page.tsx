import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";

const reasons = [
  { label: "The everyday route", stat: "I-35 · North Texas · Red River", title: "Go where you need to. Return to quiet.", body: "I-35 keeps North Texas and the Red River corridor on your route — without giving up the slower rhythm of home." },
  { label: "The outdoor day", stat: "Lake Murray State Park", title: "Water, woods and a little more room.", body: "For an unplanned afternoon: a lakeside view, a trail under the trees, or time on the water at Lake Murray." },
  { label: "The evening out", stat: "Thackerville · dining · stays", title: "A good night out, close to home.", body: "Dine, stay or catch live entertainment nearby — then make the easy drive back to Marietta Muse." },
];

export default function LocationPage() {
  return (
    <main className="location-page">
      <header className="location-header">
        <Link className="location-brand" href="/#masterplan"><span>M</span><b>Marietta Muse</b></Link>
        <nav aria-label="Main navigation"><Link href="/#masterplan">Design &amp; Layout</Link><Link href="/cottages">Rentals</Link><Link className="is-active" href="/location">Location</Link><a href="mailto:hello@mariettamuse.com">Contact</a></nav>
        <a className="location-enquire" href="mailto:hello@mariettamuse.com">Enquire <ArrowUpRight size={13} /></a>
      </header>

      <section className="location-hero">
        <div className="location-map-frame">
          <picture>
            <source media="(max-width: 767px)" srcSet="/media/location-regional-map-mobile.webp" />
            <img src="/media/location-regional-map-desktop.webp" alt="Regional map showing Marietta Muse between Marietta, Thackerville, Lake Murray and the Red River" />
          </picture>
          <div className="location-map-shade" />
          <div className="location-site-marker" aria-label="Marietta Muse at 16983 Tabler Road">
            <i><MapPin size={15} /></i>
            <div><b>Marietta Muse</b><span>16983 Tabler Rd</span></div>
          </div>
        </div>
        <div className="location-hero-copy">
          <p><MapPin size={13} /> Marietta, Oklahoma</p>
          <h1>Close to<br /><em>what matters.</em></h1>
          <span>16983 Tabler Rd · Marietta, OK</span>
        </div>
        <a className="location-directions" href="https://www.google.com/maps/search/?api=1&query=16983+Tabler+Rd%2C+Marietta%2C+OK" target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={14} /></a>
      </section>

      <section className="location-intro">
        <div><p>Southern Oklahoma, well placed</p><h2>A place to<br /><em>come back to.</em></h2></div>
        <p>Start close to home. The lake, open country and an easy route to North Texas are all part of the landscape around Marietta Muse.</p>
      </section>

      <section className="location-reasons" aria-label="Why this location works">
        {reasons.map((reason, index) => <article key={reason.title}><span>{String(index + 1).padStart(2, "0")} / {reason.label}</span><strong>{reason.stat}</strong><h3>{reason.title}</h3><p>{reason.body}</p></article>)}
      </section>

      <section className="location-resources">
        <p>Explore the area</p>
        <div><a href="https://www.travelok.com/ch/state-parks/lake-murray-state-park" target="_blank" rel="noreferrer">Lake Murray State Park <ArrowUpRight size={14} /></a><a href="https://www.winstar.com/directions/" target="_blank" rel="noreferrer">WinStar directions <ArrowUpRight size={14} /></a></div>
      </section>

      <footer className="location-footer"><Link href="/#masterplan"><ArrowLeft size={14} /> Back to masterplan</Link><span>Marietta Muse · A simpler tomorrow</span><a href="mailto:hello@mariettamuse.com">Start a conversation <ArrowUpRight size={14} /></a></footer>
    </main>
  );
}
