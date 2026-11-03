import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Car, MapPin, Trees, Sparkles } from "lucide-react";

const quickFacts = [
  { label: "Address", value: "16983 Tabler Rd", note: "Marietta, Oklahoma" },
  { label: "Nearest highway", value: "I-35", note: "North to Texas & the Red River" },
  { label: "Setting", value: "Southern Oklahoma", note: "Lake country, open land" },
];

const nearby = [
  {
    icon: Car,
    time: "~15 min",
    name: "I-35 & the Texas border",
    body: "Quick highway access to North Texas and the Red River corridor — without giving up a slower rhythm at home.",
    tag: "Everyday route",
  },
  {
    icon: Trees,
    time: "~15 min",
    name: "Lake Murray State Park",
    body: "A lakeside view, a trail under the trees or time on the water — an easy unplanned afternoon.",
    tag: "Outdoors",
    href: "https://www.travelok.com/ch/state-parks/lake-murray-state-park",
  },
  {
    icon: Sparkles,
    time: "~20 min",
    name: "WinStar World Casino & Resort",
    body: "Dining, hotel stays, golf and live entertainment in Thackerville — then an easy drive back.",
    tag: "Evenings out",
    href: "https://www.winstar.com/directions/",
  },
];

export default function LocationPage() {
  return (
    <main className="location-page">
      <header className="location-header">
        <Link className="location-brand" href="/#masterplan" aria-label="Back to masterplan">
          <span>M</span><b>Marietta Muse</b>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/#masterplan">Design &amp; Layout</Link>
          <Link href="/cottages">Rentals</Link>
          <Link className="is-active" href="/location">Location</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <a className="location-enquire" href="mailto:hello@mariettamuse.com" aria-label="Enquire">
          Enquire <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </header>

      <section className="location-hero">
        <div className="location-map-frame">
          <picture>
            <source media="(max-width: 767px)" srcSet="/media/location-regional-map-mobile.webp" />
            <img
              src="/media/location-regional-map-desktop.webp"
              alt="Regional map showing Marietta Muse between Marietta, Thackerville, Lake Murray and the Red River"
            />
          </picture>
          <div className="location-map-shade" />
          <div className="location-site-marker" aria-label="Marietta Muse at 16983 Tabler Road">
            <i><MapPin size={15} aria-hidden="true" /></i>
            <div><b>Marietta Muse</b><span>16983 Tabler Rd</span></div>
          </div>
        </div>
        <div className="location-hero-copy">
          <p><MapPin size={13} aria-hidden="true" /> Marietta, Oklahoma</p>
          <h1>Close to<br /><em>what matters.</em></h1>
          <span>16983 Tabler Rd · Marietta, OK</span>
        </div>
        <a
          className="location-directions"
          href="https://www.google.com/maps/search/?api=1&query=16983+Tabler+Rd%2C+Marietta%2C+OK"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get directions <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </section>

      <section className="lx-intro" aria-labelledby="lx-title">
        <div className="lx-intro-copy">
          <span className="lx-kicker">Southern Oklahoma, well placed</span>
          <h2 id="lx-title">A place to <em>come back to.</em></h2>
          <p>
            Start close to home. The lake, open country and an easy route to North Texas are all part of the
            landscape around Marietta Muse.
          </p>
        </div>
        <dl className="lx-facts">
          {quickFacts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
              <small>{fact.note}</small>
            </div>
          ))}
        </dl>
      </section>

      <section className="lx-nearby" aria-labelledby="lx-nearby-title">
        <div className="lx-nearby-head">
          <span className="lx-kicker">Around Marietta Muse</span>
          <h2 id="lx-nearby-title">
            Everything you need,<br /><em>a short drive away.</em>
          </h2>
          <p>Approximate drive times from the community.</p>
        </div>
        <ol className="lx-list">
          {nearby.map(({ icon: Icon, time, name, body, tag, href }, index) => (
            <li key={name}>
              <span className="lx-num">{String(index + 1).padStart(2, "0")}</span>
              <div className="lx-main">
                <span className="lx-tag">
                  <Icon size={14} strokeWidth={1.6} aria-hidden="true" /> {tag}
                </span>
                <h3>{name}</h3>
                <p>{body}</p>
                {href && (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    Learn more <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                )}
              </div>
              <strong className="lx-time">{time}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="lx-cta">
        <div>
          <span className="lx-kicker light">Plan a visit</span>
          <h2>See it for <em>yourself.</em></h2>
        </div>
        <div className="lx-cta-actions">
          <a
            href="https://www.google.com/maps/search/?api=1&query=16983+Tabler+Rd%2C+Marietta%2C+OK"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <Link href="/contact">
            Book a visit <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <footer className="location-footer">
        <Link href="/#masterplan">
          <ArrowLeft size={14} aria-hidden="true" /> Back to masterplan
        </Link>
        <span>Marietta Muse · A simpler tomorrow</span>
        <a href="mailto:hello@mariettamuse.com" aria-label="Start a conversation">
          Start a conversation <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </footer>
    </main>
  );
}
