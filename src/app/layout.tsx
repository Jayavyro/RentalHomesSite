import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marietta Muse — A Quieter Kind of Home",
  description: "Thoughtfully designed tiny homes in a nature-connected community in Marietta, Oklahoma.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
