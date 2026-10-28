import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getArticlesByCategory, getCategories } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Educational Articles & Water Safety Guides | SwimNigeria",
  description:
    "Explore structured swimming education guides, essential drowning prevention principles, and beginner technique advice for Nigerian learners.",
};

interface ArticlesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { category: queryCategory } = await searchParams;
  const activeCategory = queryCategory || "all";
  const articles = getArticlesByCategory(activeCategory);
  const allCategories = getCategories();

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <Container>
        {/* Page Header */}
        <div className="max-w-3xl">
          <Badge variant="brand" className="mb-4">
            Educational Hub
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl leading-tight">
            Educational Articles &amp; Water Safety Guides
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-700 leading-relaxed">
            Accessible, evidence-based written resources covering swimming fundamentals, panic
            management, family pool safety, and drowning prevention across Nigeria.
          </p>
        </div>

        {/* Category Filter Navigation */}
        <nav
          aria-label="Article Categories"
          className="mt-8 flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-4"
        >
          <Link
            href="/articles"
            className={`min-h-[44px] inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 ${
              activeCategory === "all"
                ? "bg-brand-red-600 text-neutral-white shadow-xs"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900"
            }`}
            aria-current={activeCategory === "all" ? "page" : undefined}
          >
            All Guides
          </Link>

          {allCategories.map((category) => {
            const slugified = category.toLowerCase().replace(/\s+/g, "-");
            const isActive =
              activeCategory.toLowerCase().replace(/[^a-z0-9]/g, "") ===
              category.toLowerCase().replace(/[^a-z0-9]/g, "");

            return (
              <Link
                key={category}
                href={`/articles?category=${slugified}`}
                className={`min-h-[44px] inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 ${
                  isActive
                    ? "bg-brand-red-600 text-neutral-white shadow-xs"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {category}
              </Link>
            );
          })}
        </nav>

        {/* Article Cards Grid or Empty State */}
        {articles.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.slug} className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge
                      variant={article.category === "Water Safety" ? "brand" : "aquatic"}
                      size="sm"
                    >
                      {article.category}
                    </Badge>
                    <span className="text-xs text-neutral-600">
                      {article.readTimeMinutes} min read
                    </span>
                  </div>
                  <CardTitle as="h2" className="text-xl">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="transition-colors hover:text-brand-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded"
                    >
                      {article.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3 mt-2">{article.summary}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-neutral-600 pt-0">
                  <span>
                    Published on{" "}
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </CardContent>
                <CardFooter className="border-t border-neutral-100 pt-4">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="inline-flex min-h-[44px] items-center text-sm font-bold text-brand-red-600 hover:text-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 rounded"
                  >
                    Read Full Guide{" "}
                    <span aria-hidden="true" className="ml-1">
                      →
                    </span>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center sm:p-12">
            <h2 className="text-lg font-bold text-neutral-900">No Guides in This Category</h2>
            <p className="mt-2 text-sm text-neutral-600 max-w-md mx-auto">
              There are currently no published articles under this specific category. Browse all
              published guides below.
            </p>
            <div className="mt-6">
              <Link
                href="/articles"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand-red-600 px-5 py-2.5 text-sm font-semibold text-neutral-white shadow-xs hover:bg-brand-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600"
              >
                View All Published Guides
              </Link>
            </div>
          </div>
        )}

        {/* Responsible Educational Notice */}
        <div className="mt-16 rounded-xl border border-neutral-200 bg-neutral-white p-5 text-xs text-neutral-600 leading-relaxed shadow-xs">
          <span className="font-semibold text-neutral-900">Educational Scope: </span>
          The educational guides provided on SwimNigeria deliver theoretical comprehension, safety
          protocols, and technique fundamentals. They are designed to supplement, but never replace,
          practical in-water instruction conducted under the supervision of qualified aquatic
          instructors.
        </div>
      </Container>
    </div>
  );
}
