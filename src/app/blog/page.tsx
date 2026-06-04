import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { pageSeo } from "@/config/seo.config";
import { BLOG_POSTS } from "@/lib/blog/posts";

export const metadata = pageSeo.blog;

const categories = ["All", "Automation", "Growth", "Strategy", "Tutorial", "Case Study", "Tips"];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
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
            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
                  />
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

        <section className="bg-white border-b border-gray-100 py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat, i) => (
                <button
                  key={cat}
                  type="button"
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

        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {BLOG_POSTS.map((article) => (
                <article
                  key={article.slug}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className={`h-48 bg-gradient-to-br ${article.gradient} flex items-center justify-center`}>
                    <span className="text-white/30 text-6xl font-black" aria-hidden>
                      {article.category[0]}
                    </span>
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
                      <Link
                        href={`/blog/${article.slug}`}
                        className="text-xs font-semibold text-[#4259f0] hover:text-[#3245d8] flex items-center gap-1"
                      >
                        Read more
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
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
