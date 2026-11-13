import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPostGrid from "@/components/blog/BlogPostGrid";
import { pageSeo } from "@/config/seo.config";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/config/site.config";

export const metadata = pageSeo.blog;

export default function BlogPage() {
  return (
    <>
      {/*
        /blog had neither a BreadcrumbList nor a Blog/CollectionPage node, the
        only two routes on the site missing breadcrumbs (the other was /).
      */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "Blog", item: `${SITE_URL}/blog` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${SITE_URL}/blog#blog`,
            url: `${SITE_URL}/blog`,
            name: "Instagram DM Automation Blog",
            description:
              "Guides on comment-to-DM setup, story automation, DM scripts and automation mistakes to avoid.",
            publisher: { "@id": `${SITE_URL}/#organization` },
            blogPost: BLOG_POSTS.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              url: `${SITE_URL}/blog/${post.slug}`,
              datePublished: post.publishedAt,
              dateModified: post.updatedAt,
            })),
          }),
        }}
      />
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
