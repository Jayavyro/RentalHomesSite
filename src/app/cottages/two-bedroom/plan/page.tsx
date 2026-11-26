import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Play } from "lucide-react";
import SiteNav from "../../../components/SiteNav";
import MobileSiteNav from "../../../components/MobileSiteNav";
import styles from "./plan-fullscreen.module.css";

// Room notes describe only what is shown in the plan drawing.
const rooms = [
  { name: "Bedroom 01", body: "The larger of the two bedrooms, at the quiet end of the cottage. A full wall of closet storage and a window looking out to the front." },
  { name: "Bedroom 02", body: "A second bedroom at the centre of the plan, with its own window. It works as a guest room, a children's room or a study." },
  { name: "Bath", body: "A full bathroom with a bathtub and shower, placed between the two bedrooms so both can reach it easily." },
  { name: "Laundry", body: "A utility nook beside the entry, with space for an optional stacked washer and dryer." },
  { name: "Kitchen", body: "A full kitchen with a range and hood, a sink under the window, and cabinets on three sides. A dining table for four sits right next to it." },
  { name: "Living", body: "An open living room at the far end, with a ceiling fan, space for a sofa and a media wall. It opens straight onto the deck." },
  { name: "Deck", body: "A covered wooden deck with railings and steps down to the garden, for morning coffee or a slow evening outside." },
];

const included = [
  "Two bedrooms and one full bathroom",
  "Full kitchen with dining space",
  "Open living room with ceiling fan",
  "Private outdoor deck",
  "Built-in closet storage",
  "Laundry space for a stacked washer and dryer (optional)",
];

export default function TwoBedroomPlanPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/cottages/two-bedroom"><span>M</span><b>Marietta Muse</b></Link>
        <SiteNav active="rentals" />
        <a className={styles.enquire} href="mailto:hello@mariettamuse.com?subject=Two-bedroom%20cottage%20enquiry">Enquire <ArrowUpRight size={13} /></a>
        <MobileSiteNav />
      </header>

      <div className={styles.stage}>
        <section className={styles.scene} aria-label="Two-bedroom cottage plan">
          <div className={styles.map}>
            <Image src="/media/cottages/two-bedroom-plan.webp" alt="Overhead view of the two-bedroom cottage plan" fill priority unoptimized sizes="100vw" />
            <span className="plan-label bed-one">Bedroom 01</span><span className="plan-label bathroom">Bath</span><span className="plan-label bed-two">Bedroom 02</span><span className="plan-label utility">Laundry</span><span className="plan-label kitchen">Kitchen</span><span className="plan-label living">Living</span><span className="plan-label deck">Deck</span>
          </div>
        </section>
        <Link className={styles.back} href="/cottages/two-bedroom"><ArrowLeft size={14} /> Back to cottage</Link>
        <Link className={styles.next} href="/cottages/two-bedroom/interior">Take interior tour <Play size={13} fill="currentColor" /></Link>
      </div>

      <section className={styles.details} aria-labelledby="plan-details-title">
        <div className={styles.intro}>
          <span className={styles.kicker}>Inside the two-bedroom cottage</span>
          <h2 id="plan-details-title">Everything on one level, <em>room by room.</em></h2>
          <p>
            The plan runs in a simple line: bedrooms and bath at one end, then the kitchen and living room,
            then the deck. Here is what you get in each space.
          </p>
        </div>

        <ol className={styles.rooms}>
          {rooms.map((room, index) => (
            <li key={room.name}>
              <span className={styles.num}>{String(index + 1).padStart(2, "0")}</span>
              <h3>{room.name}</h3>
              <p>{room.body}</p>
            </li>
          ))}
        </ol>

        <div className={styles.summary}>
          <div>
            <span className={styles.kicker}>What&apos;s included</span>
            <ul className={styles.included}>
              {included.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className={styles.cta}>
            <h3>Like what you see?</h3>
            <p>Take the interior tour, or ask us about availability.</p>
            <div className={styles.ctaActions}>
              <Link href="/cottages/two-bedroom/interior">Take interior tour <Play size={12} fill="currentColor" /></Link>
              <a href="mailto:hello@mariettamuse.com?subject=Two-bedroom%20cottage%20enquiry">Ask about availability <ArrowUpRight size={13} /></a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
