import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { getArticleBySlug, getPublishedArticles, getRelatedArticles } from "@/lib/articles";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const publishedArticles = getPublishedArticles();
  return publishedArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | SwimNigeria",
      description: "The requested educational article could not be found.",
    };
  }

  return {
    title: `${article.title} | SwimNigeria`,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  // Return a genuine 404 for missing or unpublished draft articles
  if (!article || !article.published) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article.slug, article.category, 2);

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <Container size="prose">
        {/* Navigation Breadcrumb / Back Link */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/articles"
            className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-red-600 hover:text-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded"
          >
            <span aria-hidden="true" className="mr-1.5">
              ←
            </span>
            Back to All Guides
          </Link>
        </nav>

        {/* Semantic Article */}
        <article className="space-y-8">
          {/* Article Header */}
          <header className="space-y-4 border-b border-neutral-200 pb-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={article.category === "Water Safety" ? "brand" : "aquatic"} size="md">
                {article.category}
              </Badge>
              <span className="text-xs text-neutral-600 font-medium">
                {article.readTimeMinutes} min read
              </span>
              <span className="text-neutral-300" aria-hidden="true">
                •
              </span>
              <time dateTime={article.publishedAt} className="text-xs text-neutral-600 font-medium">
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl leading-tight">
              {article.title}
            </h1>

            <p className="text-lg text-neutral-700 leading-relaxed font-normal">
              {article.summary}
            </p>
          </header>

          {/* Article Body Content */}
          <div className="space-y-8 text-neutral-800 leading-relaxed text-base sm:text-lg">
            {article.sections.map((section, index) => (
              <section key={index} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-6 pt-4 border-t border-neutral-100 first:border-t-0 first:pt-0">
                  {section.heading}
                </h2>

                {section.paragraphs.map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed text-neutral-700">
                    {paragraph}
                  </p>
                ))}

                {section.callout && (
                  <div
                    role="note"
                    className={`rounded-xl p-5 my-6 border ${
                      section.callout.type === "safety"
                        ? "bg-brand-red-50 border-brand-red-600/30 text-neutral-900"
                        : section.callout.type === "technique"
                          ? "bg-water-blue-50 border-water-blue-600/30 text-neutral-900"
                          : "bg-neutral-50 border-neutral-200 text-neutral-900"
                    }`}
                  >
                    <p className="font-bold text-sm mb-1 text-neutral-900">
                      {section.callout.title}
                    </p>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      {section.callout.message}
                    </p>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Responsible Safety Notice */}
          <div className="mt-12 rounded-xl border border-brand-red-600/20 bg-brand-red-50 p-5 text-xs text-neutral-800 leading-relaxed">
            <p className="font-bold text-brand-red-700">
              Educational Scope &amp; Safety Disclaimer:
            </p>
            <p className="mt-1">
              This guide provides theoretical aquatic knowledge and safety principles. Reading
              educational material does not confer physical swimming competence, water survival
              capability, or lifeguarding qualification without supervised in-person practice with
              certified instructors in safe aquatic conditions.
            </p>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-16 pt-8 border-t border-neutral-200">
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 mb-6">
                Related Safety &amp; Technique Guides
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {relatedArticles.map((related) => (
                  <Card key={related.slug} className="flex flex-col justify-between">
                    <CardHeader>
                      <Badge
                        variant={related.category === "Water Safety" ? "brand" : "aquatic"}
                        size="sm"
                        className="w-fit mb-1"
                      >
                        {related.category}
                      </Badge>
                      <CardTitle as="h3" className="text-base">
                        <Link
                          href={`/articles/${related.slug}`}
                          className="hover:text-brand-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded"
                        >
                          {related.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-xs mt-1">
                        {related.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="border-t border-neutral-100 pt-3">
                      <Link
                        href={`/articles/${related.slug}`}
                        className="inline-flex min-h-[44px] items-center text-xs font-bold text-brand-red-600 hover:text-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded"
                      >
                        Read Guide{" "}
                        <span aria-hidden="true" className="ml-1">
                          →
                        </span>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Return Button */}
          <div className="mt-12 flex justify-center pt-6 border-t border-neutral-100">
            <Link
              href="/articles"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-neutral-300 bg-neutral-white px-6 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 hover:border-neutral-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700"
            >
              Browse All Educational Guides
            </Link>
          </div>
        </article>
      </Container>
    </div>
  );
}
