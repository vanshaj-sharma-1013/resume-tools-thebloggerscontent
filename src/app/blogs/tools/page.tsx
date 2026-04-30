import { BlogThemeShell } from "@/components/blog/blog-theme-shell";
import { blogCategories, blogPosts } from "@/data/blogs";
import { Metadata } from "next";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Resume Tools Blog — ${SITE_NAME}`,
  description: "Expert reviews and guides on the best resume building tools and career resources.",
};

export default function ToolsBlogPage() {
  const category = blogCategories.tools;
  const posts = blogPosts.filter((post) => post.category === "tools");

  return <BlogThemeShell category={category} posts={posts} />;
}
