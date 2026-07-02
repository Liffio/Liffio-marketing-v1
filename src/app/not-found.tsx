import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md">
          <p className="text-5xl font-extrabold text-[#f5184c] mb-4" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
            404
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>
            Page not found
          </h1>
          <p className="text-gray-600 mb-8">
            This page does not exist or has been moved. Try one of the links below.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-white [background:linear-gradient(135deg,#f5184c,#b20d8f)]"
            >
              Back to home
            </Link>
            <Link
              href="/features"
              className="inline-flex rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-[#f5184c] hover:text-[#f5184c] transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="inline-flex rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-[#f5184c] hover:text-[#f5184c] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/help"
              className="inline-flex rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-[#f5184c] hover:text-[#f5184c] transition-colors"
            >
              Help
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
