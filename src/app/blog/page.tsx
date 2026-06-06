import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPostGrid from "@/components/blog/BlogPostGrid";
import { pageSeo } from "@/config/seo.config";
import { BLOG_POSTS } from "@/lib/blog/posts";

export const metadata = pageSeo.blog;

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
          </div>
        </section>

        <BlogPostGrid posts={BLOG_POSTS} />
      </main>
      <Footer />
    </>
  );
}
