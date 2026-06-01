import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type LegalPageProps = {
  title: string;
  lastUpdated: string;
  content: string;
};

function isSectionHeading(paragraph: string): boolean {
  const trimmed = paragraph.trim();
  return /^\d+(\.\d+)?\.\s/.test(trimmed) || (/^[A-Z]/.test(trimmed) && trimmed.length < 72 && !trimmed.endsWith("."));
}

export default function LegalPage({ title, lastUpdated, content }: LegalPageProps) {
  const paragraphs = content.split("\n").filter((p) => p.trim() !== "");

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="hero-gradient border-b border-brand-100/60 py-14 sm:py-18">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h1
              className="text-3xl font-extrabold text-[#0a0a0a] sm:text-4xl"
              style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
            >
              {title}
            </h1>
            <p className="mt-3 text-sm font-medium uppercase tracking-wider text-gray-500">
              Last updated: {lastUpdated}
            </p>
          </div>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="card-base p-6 sm:p-10">
              <div className="space-y-4 text-sm leading-relaxed text-gray-600 sm:text-[0.9375rem]">
                {paragraphs.map((p, i) =>
                  isSectionHeading(p) ? (
                    <h2
                      key={i}
                      className="!mt-8 text-base font-bold text-[#0a0a0a] first:!mt-0 sm:text-lg"
                      style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
                    >
                      {p}
                    </h2>
                  ) : (
                    <p key={i}>{p}</p>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
