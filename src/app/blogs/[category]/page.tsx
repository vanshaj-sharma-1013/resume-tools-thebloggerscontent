import { BlogThemeShell } from "@/components/blog/blog-theme-shell";
import { blogCategories, blogPosts } from "@/data/blogs";
import { Metadata } from "next";
import { SITE_NAME } from "@/lib/site-config";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> | { category: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const category = blogCategories[resolvedParams.category];

  if (!category) {
    return {};
  }

  return {
    title: `${category.name} Blog — ${SITE_NAME}`,
    description: category.description,
  };
}

export default async function CategoryBlogPage({ params }: { params: Promise<{ category: string }> | { category: string } }) {
  const resolvedParams = await params;
  const category = blogCategories[resolvedParams.category];

  if (!category) {
    notFound();
  }

  const posts = blogPosts.filter((post) => post.category === resolvedParams.category);

  return <BlogThemeShell category={category} posts={posts} />;
}
