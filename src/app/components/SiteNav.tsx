import Link from "next/link";

type SiteNavProps = {
  className?: string;
  designHref?: string;
  rentalsHref?: string;
  active?: "design" | "rentals" | "location" | "contact";
};

export default function SiteNav({
  className = "",
  designHref = "/#vision",
  rentalsHref = "/cottages",
  active,
}: SiteNavProps) {
  return (
    <nav className={`site-nav ${className}`} aria-label="Main navigation">
      <Link className={active === "design" ? "is-active" : ""} href={designHref}>Design &amp; Layout</Link>
      <Link className={active === "rentals" ? "is-active" : ""} href={rentalsHref}>Rentals</Link>
      <Link className={active === "location" ? "is-active" : ""} href="/location">Location</Link>
      <Link className={active === "contact" ? "is-active" : ""} href="/contact">Contact</Link>
    </nav>
  );
}
