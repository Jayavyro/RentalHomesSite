import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Play } from "lucide-react";
import SiteNav from "../../../components/SiteNav";
import MobileSiteNav from "../../../components/MobileSiteNav";
import styles from "../../two-bedroom/plan/plan-fullscreen.module.css";

// Room notes describe what is shown in the one-bedroom cottage plan drawing.
const rooms = [
  {
    name: "Bedroom 01",
    body: "A quiet primary suite at the private end of the cottage, complete with a deep walk-in closet, bedside space and two front-facing windows.",
  },
  {
    name: "Bath",
    body: "A full bathroom with a bathtub and shower, a vanity with mirror, and a high window for natural daylight.",
  },
  {
    name: "Laundry",
    body: "A dedicated utility nook right beside the entry door, ready for an optional stacked washer and dryer plus mechanicals.",
  },
  {
    name: "Kitchen",
    body: "An L-shaped full kitchen with upper and lower wood cabinetry, a double sink under the window, range with hood, dishwasher space and full-size refrigerator.",
  },
  {
    name: "Dining & Living",
    body: "An airy open-plan living heart with space for a dining table by the window, a full sofa and coffee table, media storage and an overhead ceiling fan.",
  },
  {
    name: "Deck",
    body: "A private wooden porch at the end of the home, stepped off the living room door for morning coffee or quiet evenings outdoors.",
  },
];

const included = [
  "One private bedroom with walk-in closet storage",
  "One full bathroom with tub and shower",
  "Full L-shaped kitchen with range, hood and double sink",
  "Open dining and living room with ceiling fan",
  "Private outdoor wooden deck with steps",
  "Laundry nook for an optional stacked washer and dryer",
];

const pinPositions = [
  { label: "Bedroom 01", left: "21%", top: "43%" },
  { label: "Bath", left: "38%", top: "28%" },
  { label: "Laundry", left: "38%", top: "48%" },
  { label: "Kitchen", left: "56%", top: "36%" },
  { label: "Living", left: "65%", top: "61%" },
  { label: "Deck", left: "83%", top: "71%" },
];

export default function OneBedroomPlanPage() {
  return (
    <main className={`${styles.page} ${styles.oneBedroomPlan}`}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/cottages/one-bedroom"><span>M</span><b>Marietta Muse</b></Link>
        <SiteNav active="rentals" />
        <a className={styles.enquire} href="mailto:hello@mariettamuse.com?subject=One-bedroom%20cottage%20enquiry">Enquire <ArrowUpRight size={13} /></a>
        <MobileSiteNav />
      </header>

      <div className={styles.stage}>
        <section className={styles.scene} aria-label="One-bedroom cottage plan">
          <div className={styles.map}>
            <Image
              src="/media/cottages/one-bedroom-plan-hq.webp"
              alt="Overhead cutaway view of the one-bedroom cottage plan"
              fill
              priority
              unoptimized
              sizes="100vw"
            />
            {pinPositions.map((pin) => (
              <span
                key={pin.label}
                className="plan-label"
                style={{ left: pin.left, top: pin.top }}
              >
                {pin.label}
              </span>
            ))}
          </div>
        </section>
        <Link className={styles.back} href="/cottages/one-bedroom"><ArrowLeft size={14} /> Back to cottage</Link>
        <Link className={styles.next} href="/cottages/one-bedroom/interior">Take interior tour <Play size={13} fill="currentColor" /></Link>
      </div>

      <section className={styles.details} aria-labelledby="one-bedroom-plan-details-title">
        <div className={styles.intro}>
          <span className={styles.kicker}>Inside the one-bedroom cottage</span>
          <h2 id="one-bedroom-plan-details-title">Thoughtfully arranged, <em>room by room.</em></h2>
          <p>
            The one-bedroom plan balances privacy and openness: a quiet bedroom and full bath on one side,
            flowing into an L-shaped kitchen, sunlit living room and outdoor deck on the other.
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
              <Link href="/cottages/one-bedroom/interior">Take interior tour <Play size={12} fill="currentColor" /></Link>
              <a href="mailto:hello@mariettamuse.com?subject=One-bedroom%20cottage%20enquiry">Ask about availability <ArrowUpRight size={13} /></a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

