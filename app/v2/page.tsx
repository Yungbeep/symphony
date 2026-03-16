import { V2Navbar } from "@/components/v2/landing/V2Navbar";
import { V2Hero } from "@/components/v2/landing/V2Hero";
import { V2Value } from "@/components/v2/landing/V2Value";
import { V2Footer } from "@/components/v2/landing/V2Footer";

export default function V2LandingPage() {
  return (
    <main className="min-h-screen">
      <V2Navbar />
      <div className="pt-14">
        <V2Hero />
        <V2Value />
        <V2Footer />
      </div>
    </main>
  );
}