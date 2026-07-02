export default function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-20 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#f5184c] mb-3">
          About Liffio
        </p>
        <h2
          className="text-3xl sm:text-4xl font-extrabold text-[#0a0a0a] mb-6"
          style={{ fontFamily: "var(--font-outfit,sans-serif)" }}
        >
          Built to turn engagement into revenue
        </h2>
        <p className="text-base sm:text-lg leading-relaxed text-gray-600 mb-4">
          Liffio is an Instagram DM automation tool that automates your entire
          DM strategy. We&apos;re on a mission to help creators and small
          businesses turn Instagram engagement into real revenue - without
          spending hours manually replying in the DM inbox.
        </p>
        <p className="text-base leading-relaxed text-gray-600 mb-8">
          Launched in 2026, Liffio runs on official Instagram APIs and is
          designed to feel human - with configurable delays, keyword triggers,
          and multi-step flows that work while you sleep. Built in India{" "}
          <img
            src="https://flagcdn.com/w40/in.png"
            alt="India"
            className="inline-block h-3.5 w-auto"
          />{" "}
          , made for creators worldwide.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/creators-program"
            className="rounded-xl border border-[#ffe4e6] bg-[#fff7f7] px-6 py-3 text-sm font-semibold text-[#f5184c] transition-colors hover:bg-[#ffe4e6]"
          >
            Creators Program →
          </a>
          <a
            href="/blog"
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Read our blog →
          </a>
        </div>
      </div>
    </section>
  );
}
