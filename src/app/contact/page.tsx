import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock, Mail, MapPin } from "lucide-react";
import SiteNav from "../components/SiteNav";
import MobileSiteNav from "../components/MobileSiteNav";

export const metadata: Metadata = {
  title: "Contact · Marietta Muse",
  description: "Get in touch about cottages, rentals and visiting Marietta Muse in Marietta, Oklahoma.",
};

const details = [
  { icon: Mail, label: "Email", value: "hello@mariettamuse.com", href: "mailto:hello@mariettamuse.com" },
  { icon: MapPin, label: "Visit", value: "16983 Tabder Rd, Marietta, OK", href: "https://www.google.com/maps/search/?api=1&query=16983+Tabder+Rd%2C+Marietta%2C+OK" },
  { icon: Clock, label: "Response time", value: "Within one business day" },
];

export default function ContactPage() {
  return (
    <main className="contact-page">
      <header className="location-header">
        <Link className="location-brand" href="/#masterplan" aria-label="Back to masterplan">
          <span>M</span><b>Marietta Muse</b>
        </Link>
        <SiteNav active="contact" />
        <a className="location-enquire" href="mailto:hello@mariettamuse.com" aria-label="Email us">
          Email us <ArrowUpRight size={13} aria-hidden="true" />
        </a>
        <MobileSiteNav />
      </header>

      <section className="cp-hero">
        <div className="cp-intro">
          <span className="cp-kicker">Contact us</span>
          <h1>Let’s find your<br /><em>place here.</em></h1>
          <p>
            Tell us a little about what you are looking for. We will help you explore cottages, availability and life at Marietta Muse.
          </p>
          <ul className="cp-details">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label}>
                <i><Icon size={18} strokeWidth={1.4} aria-hidden="true" /></i>
                <div>
                  <span>{label}</span>
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" aria-label={label}>
                      {value}
                    </a>
                  ) : (
                    <strong>{value}</strong>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <form className="cp-form" action="mailto:hello@mariettamuse.com" method="post" encType="text/plain" aria-label="Contact form">
          <h2>Send an enquiry</h2>
          <div className="cp-row">
            <label htmlFor="name">
              <span>Your name</span>
              <input id="name" type="text" name="name" autoComplete="name" placeholder="Full name" required />
            </label>
            <label htmlFor="email">
              <span>Email address</span>
              <input id="email" type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
            </label>
          </div>
          <label htmlFor="phone">
            <span>Phone (optional)</span>
            <input id="phone" type="tel" name="phone" autoComplete="tel" placeholder="(555) 000-0000" />
          </label>
          <label htmlFor="interest">
            <span>I’m interested in</span>
            <select id="interest" name="interest" defaultValue="" required>
              <option value="" disabled>Select an option</option>
              <option>Rental availability</option>
              <option>Cottage designs</option>
              <option>Location and visits</option>
              <option>Something else</option>
            </select>
          </label>
          <label htmlFor="message">
            <span>Your message</span>
            <textarea id="message" name="message" rows={5} placeholder="Tell us what you would like to know" required />
          </label>
          <button type="submit">
            Send enquiry <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        </form>
      </section>

      <footer className="location-footer">
        <Link href="/#masterplan"><ArrowLeft size={14} aria-hidden="true" /> Back to masterplan</Link>
        <span>Marietta Muse · A simpler tomorrow</span>
        <a href="mailto:hello@mariettamuse.com" aria-label="Start a conversation">
          Start a conversation <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </footer>
    </main>
  );
}
