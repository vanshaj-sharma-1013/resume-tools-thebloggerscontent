import { BlogThemeShell } from "@/components/blog/blog-theme-shell";
import { blogPosts } from "@/data/blogs";
import { Metadata } from "next";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Our Blog — ${SITE_NAME}`,
  description: "Read the latest articles, tips, and tools for your career and resume building.",
};

export default function BlogsPage() {
  const posts = blogPosts.filter((post) => post.category !== "guides");

  const category = {
    name: "Our Blog",
    slug: "blogs",
    description: "Read the latest articles, tips, and tools for your career and resume building.",
    color: "from-blue-500 to-cyan-600",
  };

  return <BlogThemeShell category={category} posts={posts} />;
}
