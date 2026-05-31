import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog — Liffio",
  description: "Tips, guides, and insights on Instagram DM automation, growth strategies, and engagement.",
};

const articles = [
  {
    category: "Automation",
    title: "How to Turn Instagram Comments Into DMs Automatically",
    excerpt:
      "Learn how to set up comment-to-DM automations that convert every comment into a potential sale — in under 5 minutes.",
    readTime: "5 min read",
    date: "May 15, 2026",
    slug: "#",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    category: "Growth",
    title: "The Ultimate Guide to Instagram Story Automation",
    excerpt:
      "Story mentions and replies are gold. Here's how to auto-reply instantly to every story interaction and never miss a lead.",
    readTime: "7 min read",
    date: "May 10, 2026",
    slug: "#",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    category: "Strategy",
    title: "10 Instagram DM Scripts That Convert Followers Into Customers",
    excerpt:
      "Copy-paste these battle-tested DM templates that have generated millions of dollars for Instagram businesses.",
    readTime: "8 min read",
    date: "May 5, 2026",
    slug: "#",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    category: "Tutorial",
    title: "Setting Up Your First Comment Keyword Trigger",
    excerpt:
      "Step-by-step walkthrough of creating a keyword trigger that sends an automated DM to every new commenter.",
    readTime: "4 min read",
    date: "April 28, 2026",
    slug: "#",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    category: "Case Study",
    title: "How This Fashion Brand Generated $120K Using Instagram DM Automation",
    excerpt:
      "A deep dive into the exact automation strategy that took an e-commerce brand from $0 to six figures in three months.",
    readTime: "10 min read",
    date: "April 20, 2026",
    slug: "#",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    category: "Tips",
    title: "5 Common Instagram Automation Mistakes (And How to Fix Them)",
    excerpt:
      "Avoid these pitfalls that could get your account flagged or reduce your engagement rate significantly.",
    readTime: "6 min read",
    date: "April 14, 2026",
    slug: "#",
    gradient: "from-teal-500 to-cyan-600",
  },
];

const categories = ["All", "Automation", "Growth", "Strategy", "Tutorial", "Case Study", "Tips"];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* Header */}
        <section className="hero-gradient py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <h1
              className="text-4xl sm:text-5xl font-extrabold text-gray-900"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              Blog
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Tips, guides, and insights on Instagram DM automation
            </p>
            {/* Search */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
                </svg>
                <input
                  type="search"
                  id="blog-search"
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4259f0] focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-white border-b border-gray-100 py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat, i) => (
                <button
                  key={cat}
                  id={`blog-cat-${cat.toLowerCase().replace(" ", "-")}`}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    i === 0
                      ? "text-white [background:linear-gradient(135deg,#7c5af3,#4259f0)]"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles grid */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article
                  key={article.title}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Gradient thumbnail */}
                  <div className={`h-48 bg-gradient-to-br ${article.gradient} flex items-center justify-center`}>
                    <span className="text-white/30 text-6xl font-black">{article.category[0]}</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-[#4259f0] bg-[#f3f0ff] px-2.5 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-400">{article.readTime}</span>
                    </div>
                    <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug flex-1">{article.title}</h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400">{article.date}</span>
                      <a
                        href={article.slug}
                        className="text-xs font-semibold text-[#4259f0] hover:text-[#3245d8] flex items-center gap-1"
                      >
                        Read more
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
