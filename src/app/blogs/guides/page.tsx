import { BlogThemeShell } from "@/components/blog/blog-theme-shell";
import { blogCategories, blogPosts } from "@/data/blogs";
import { Metadata } from "next";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Career Guides Blog — ${SITE_NAME}`,
  description: "Comprehensive guides on resume writing, interview preparation, and career advancement.",
};

export default function GuidesBlogPage() {
  const category = blogCategories.guides;
  const posts = blogPosts.filter((post) => post.category === "guides");

  return <BlogThemeShell category={category} posts={posts} />;
}
