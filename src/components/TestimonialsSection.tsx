const featured = {
  name: "Sarah Chen",
  role: "Fashion Influencer · 250K followers",
  quote: "Before Liffio, I spent 3+ hours every single day responding to DMs manually. Now Liffio handles everything the second someone comments. My engagement rate has doubled, my follower count grew 40% in 60 days, and I get to focus entirely on creating content. It's genuinely one of the best business decisions I've made.",
  avatar: "SC",
  gradient: "linear-gradient(135deg,#a855f7,#7c5af3)",
  result: "2× engagement rate",
  timeframe: "in 60 days",
};

const testimonials = [
  {
    name: "Marcus Johnson",
    role: "E-commerce Brand Owner",
    quote: "We integrated Liffio with our comment campaigns and saw 340% more conversions. The keyword triggers are unreal for sales funnels. Set up in 10 minutes, paid for itself in an hour.",
    avatar: "MJ",
    gradient: "linear-gradient(135deg,#4259f0,#7c5af3)",
    metric: "+340% conversions",
  },
  {
    name: "Elena Rodriguez",
    role: "Digital Marketing Agency CEO",
    quote: "Managing 15+ client accounts used to require a full team. With Liffio, two people handle all of it. We save 40 hours every week and our clients are seeing results they've never seen before.",
    avatar: "ER",
    gradient: "linear-gradient(135deg,#ec4899,#a855f7)",
    metric: "40 hrs/week saved",
  },
  {
    name: "David Park",
    role: "Fitness Coach · 180K followers",
    quote: "The keyword trigger feature alone generated over $50K in course sales. I set up one automation, posted a reel, and woke up to 400 DMs and $12K in sales. It's genuinely magic.",
    avatar: "DP",
    gradient: "linear-gradient(135deg,#10b981,#4259f0)",
    metric: "$50K generated",
  },
  {
    name: "Lisa Thompson",
    role: "Beauty Brand Founder",
    quote: "Response rates tripled. We moved from manual DM outreach to fully automated workflows and our team finally has time to focus on what matters — creating content and building the brand.",
    avatar: "LT",
    gradient: "linear-gradient(135deg,#f97316,#ec4899)",
    metric: "3× response rate",
  },
  {
    name: "James Wilson",
    role: "Real Estate · Team of 8",
    quote: "Liffio built us an Instagram lead pipeline we didn't think was possible at our scale. Every new listing comment becomes a qualified lead within seconds. Our agents love it.",
    avatar: "JW",
    gradient: "linear-gradient(135deg,#14b8a6,#4259f0)",
    metric: "Qualified leads daily",
  },
];

const Stars = () => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(i => (
      <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
  </div>
);

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(124,90,243,0.1),transparent)" }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="section-badge mb-4">Testimonials</div>
          <h2 className="text-4xl sm:text-[2.75rem] font-extrabold text-[#0a0a0a] leading-tight"
            style={{ fontFamily: "var(--font-outfit,sans-serif)" }}>
            Creators who switched to Liffio{" "}
            <span style={{ background: "linear-gradient(130deg,#a855f7,#7c5af3,#4259f0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              never looked back.
            </span>
          </h2>
          <p className="mt-3 text-lg text-gray-500">Real results from real creators, brands, and agencies.</p>
        </div>

        {/* Featured testimonial */}
        <div className="relative rounded-3xl p-8 sm:p-10 mb-6 overflow-hidden"
          style={{
            background: "linear-gradient(145deg,#faf8ff,#f3f0ff 60%,#f8f5ff)",
            border: "1px solid rgba(124,90,243,0.16)",
            boxShadow: "0 8px 40px rgba(124,90,243,0.1)",
          }}>
          {/* Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 60%)", transform: "translate(30%,-30%)" }} />

          <div className="relative grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
                style={{ background: featured.gradient }}>
                {featured.avatar}
              </div>
            </div>
            <div>
              <Stars />
              <blockquote className="mt-4 text-lg sm:text-xl text-gray-700 leading-relaxed font-medium">
                &ldquo;{featured.quote}&rdquo;
              </blockquote>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <div>
                  <p className="font-bold text-[#0a0a0a]">{featured.name}</p>
                  <p className="text-sm text-gray-400">{featured.role}</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full px-4 py-1.5"
                  style={{ background: "rgba(124,90,243,0.08)", border: "1px solid rgba(124,90,243,0.18)" }}>
                  <span className="text-sm font-bold text-[#7c5af3]">{featured.result}</span>
                  <span className="text-xs text-gray-400">{featured.timeframe}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map(t => (
            <div key={t.name}
              className="group rounded-2xl bg-white p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ border: "1px solid rgba(124,90,243,0.1)", boxShadow: "0 2px 12px rgba(124,90,243,0.05)" }}>
              <Stars />
              <blockquote className="mt-4 text-sm text-gray-600 leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-5 pt-4 flex items-center justify-between gap-3"
                style={{ borderTop: "1px solid rgba(124,90,243,0.07)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: t.gradient }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0a0a0a]">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
                <span className="text-xs font-bold rounded-full px-3 py-1 flex-shrink-0"
                  style={{ background: "rgba(124,90,243,0.07)", color: "#7c5af3" }}>
                  {t.metric}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom line */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-400">
            ★★★★★{" "}
            <strong className="text-gray-600">Rated 4.9 / 5</strong>
            {" "}by 2,000+ Instagram creators and brands worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
