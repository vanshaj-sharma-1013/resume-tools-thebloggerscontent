import React from "react";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { BlogCategory, BlogPost } from "@/types/blog";

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const User = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const Calendar = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

interface BlogThemeShellProps {
  category: BlogCategory;
  posts: BlogPost[];
}

export function BlogThemeShell({ category, posts }: BlogThemeShellProps) {
  return (
    <MarketingPageShell>
      <SiteHeader />
      
      <main className="relative z-10 flex flex-1 flex-col pb-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-slate-950/50 py-20 lg:py-32">
          <div className="container relative mx-auto px-4 text-center">
            <div className={`mx-auto mb-6 inline-block rounded-full bg-gradient-to-r ${category.color} p-px`}>
              <div className="rounded-full bg-slate-950 px-4 py-1">
                <span className={`bg-gradient-to-r ${category.color} bg-clip-text text-sm font-bold text-transparent`}>
                  {category.name}
                </span>
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Knowledge Base for <br />
              <span className={`bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                {category.name}
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-400 md:text-xl">
              {category.description}
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="container mx-auto mt-[-40px] px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blogs/${post.category}/${post.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 transition-all hover:border-white/20 hover:bg-slate-900/80"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-blue-400">
                    {post.title}
                  </h3>
                  <p className="mb-6 line-clamp-3 flex-1 text-sm text-slate-400">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                        <User className="h-3 w-3 text-slate-400" />
                      </div>
                      <span className="text-xs font-medium text-slate-300">{post.author}</span>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-bold text-blue-400 opacity-0 transition-all group-hover:opacity-100">
                      Read More <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {posts.length === 0 && (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 text-center">
              <p className="text-xl text-slate-500">More blogs coming soon!</p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </MarketingPageShell>
  );
}
