import { notFound } from "next/navigation";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { blogPosts, blogCategories } from "@/data/blogs";
import Link from "next/link";
import Image from "next/image";

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

const User = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const Calendar = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
);

interface BlogPostPageProps {
  params: {
    category: string;
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = blogPosts.find(
    (p) => p.category === resolvedParams.category && p.slug === resolvedParams.slug
  );

  if (!post) {
    notFound();
  }

  const category = blogCategories[post.category];

  return (
    <MarketingPageShell>
      <SiteHeader />

      <main className="relative z-10 flex flex-1 flex-col pb-20">
        <div className="container mx-auto px-4 pt-12 md:pt-20">
          <Link
            href={`/blogs/${post.category}`}
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {category.name}
          </Link>

          <article className="mx-auto max-w-4xl">
            <div className={`mb-6 inline-block rounded-full bg-linear-to-r ${category.color} p-px`}>
              <div className="rounded-full bg-slate-950 px-4 py-1 text-xs font-bold text-white">
                {category.name}
              </div>
            </div>

            <h1 className="mb-8 text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            <div className="mb-12 flex flex-wrap items-center gap-6 text-slate-400 border-b border-white/10 pb-8">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{post.author}</div>
                  <div className="text-xs">Author</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-500" />
                <div>
                  <div className="text-sm font-bold text-white">{post.date}</div>
                  <div className="text-xs">Published</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-500" />
                <div>
                  <div className="text-sm font-bold text-white">{post.readTime}</div>
                  <div className="text-xs">Reading Time</div>
                </div>
              </div>
            </div>

            <div className="relative mb-12 aspect-video overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <Image
                src={post.image}
                alt={post.title}
                height={2000}
                width={4000}
                className="h-full w-full object-cover"
              />
            </div>

            <div
              className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-a:text-blue-400 mt-8 space-y-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>
      </main>

      <SiteFooter />
    </MarketingPageShell>
  );
}
