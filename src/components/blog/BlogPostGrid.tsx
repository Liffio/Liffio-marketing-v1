"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog/posts";

const ALL_CATEGORIES = "All";

export default function BlogPostGrid({ posts }: { posts: BlogPost[] }) {
  const categories = [ALL_CATEGORIES, ...Array.from(new Set(posts.map((p) => p.category)))];
  const [active, setActive] = useState(ALL_CATEGORIES);

  const visible = active === ALL_CATEGORIES ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist" aria-label="Filter blog posts by category">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active === cat}
                onClick={() => setActive(cat)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active === cat
                    ? "text-white [background:linear-gradient(135deg,#f5184c,#b20d8f)]"
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
          {visible.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No posts in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visible.map((article) => (
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
                      <span className="text-xs font-semibold text-[#b20d8f] bg-[#fff1f2] px-2.5 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-400">{article.readTime}</span>
                    </div>
                    <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug flex-1">{article.title}</h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-gray-400">{article.date}</span>
                        <span className="text-xs text-gray-400">{article.author}</span>
                      </div>
                      <Link
                        href={`/blog/${article.slug}`}
                        className="text-xs font-semibold text-[#b20d8f] hover:text-[#dc0f42] flex items-center gap-1"
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
          )}
        </div>
      </section>
    </>
  );
}
