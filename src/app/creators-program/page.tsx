import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CreatorsProgramContent from "@/components/CreatorsProgramContent";

export const metadata: Metadata = {
  title: "Creators Program — Liffio",
  description:
    "Apply to the Liffio Creators Program and get our full Business plan ($79/month) for free. For Instagram creators with 5K+ followers who drive comment engagement.",
};

export default function CreatorsProgramPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <CreatorsProgramContent />
      </main>
      <Footer />
    </>
  );
}
