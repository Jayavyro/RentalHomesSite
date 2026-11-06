import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import styles from "./plan-fullscreen.module.css";

export default function TwoBedroomPlanPage() {
  return (
    <main className={styles.page}>
      <section className={styles.scene} aria-label="Two-bedroom cottage plan">
          <div className={styles.map}>
            <Image src="/media/cottages/two-bedroom-plan.webp" alt="Overhead view of the two-bedroom cottage plan" fill priority quality={95} sizes="100vw" />
            <span className="plan-label bed-one">Bedroom 01</span><span className="plan-label bathroom">Bath</span><span className="plan-label bed-two">Bedroom 02</span><span className="plan-label utility">Laundry</span><span className="plan-label kitchen">Kitchen</span><span className="plan-label living">Living</span><span className="plan-label deck">Deck</span>
          </div>
          <Link className={styles.back} href="/cottages/two-bedroom"><ArrowLeft size={14} /> Back to cottage</Link>
          <Link className={styles.next} href="/cottages/two-bedroom/interior">Take interior tour <Play size={13} fill="currentColor" /></Link>
      </section>
    </main>
  );
}
