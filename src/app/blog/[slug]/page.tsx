import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_URL, siteConfig } from "@/config/site.config";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog/posts";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqPageJsonLd } from "@/lib/seo/json-ld";
import type { FaqCategory } from "@/config/faq.config";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  const pageUrl = `${SITE_URL}/blog/${slug}`;
  const ogImage = `${SITE_URL}${siteConfig.meta.ogImagePath}`;

  return {
    title: `${post.title} | Liffio Blog`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: pageUrl,
      publishedTime: post.publishedAt,
      authors: ["Liffio Team"],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

function postFaqCategories(post: NonNullable<ReturnType<typeof getPostBySlug>>): FaqCategory[] {
  if (!post.faq?.length) return [];
  return [
    {
      id: "article-faq",
      label: "FAQ",
      items: post.faq.map((item, i) => ({
        id: `faq-${i}`,
        question: item.question,
        answer: item.answer,
      })),
    },
  ];
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const faqCategories = postFaqCategories(post);

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        slug={slug}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: SITE_URL },
          { name: "Blog", item: `${SITE_URL}/blog` },
          { name: post.title, item: `${SITE_URL}/blog/${slug}` },
        ]}
      />
      {faqCategories.length > 0 ? <FaqPageJsonLd categories={faqCategories} /> : null}
      <Navbar />
      <main id="main-content" className="flex-1">
        <article className="hero-gradient py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Link href="/blog" className="text-sm font-semibold text-[#4259f0] hover:underline">
              ← Back to Blog
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#4259f0]">{post.category}</p>
            <h1
              className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
            >
              {post.title}
            </h1>
            <p className="mt-4 text-gray-600">{post.excerpt}</p>
            <p className="mt-3 text-sm text-gray-400">
              {post.date} · {post.readTime}
            </p>
          </div>
        </article>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 prose prose-gray">
          {post.sections.map((section) => (
            <section key={section.heading} className="mb-10">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
              >
                {section.heading}
              </h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="text-gray-600 leading-relaxed mb-4">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {post.faq && post.faq.length > 0 ? (
          <section className="py-12 bg-gray-50 border-t border-gray-100">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
              <dl className="space-y-6">
                {post.faq.map((item) => (
                  <div key={item.question}>
                    <dt className="font-semibold text-gray-900">{item.question}</dt>
                    <dd className="mt-2 text-gray-600 text-sm leading-relaxed">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        ) : null}

        <section className="py-16 bg-white text-center border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started Free</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Set up comment-to-DM automation in a few minutes. No credit card required.
          </p>
          <a
            href={siteConfig.urls.appSignup}
            className="inline-flex rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg [background:linear-gradient(135deg,#7c5af3,#4259f0)]"
          >
            Start Free
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
