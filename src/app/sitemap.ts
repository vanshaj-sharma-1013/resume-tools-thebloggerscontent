import type { MetadataRoute } from "next";
import { blogPosts, blogCategories } from "@/data/blogs";

type PageEntry = {
  route: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const pages: PageEntry[] = [
  { route: "/", changeFrequency: "weekly", priority: 1 },
  { route: "/about", changeFrequency: "monthly", priority: 0.8 },
  { route: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { route: "/resume-maker", changeFrequency: "weekly", priority: 0.95 },
  { route: "/ats-checker", changeFrequency: "weekly", priority: 0.9 },
  { route: "/theme-selection", changeFrequency: "weekly", priority: 0.9 },
  { route: "/resume-creation", changeFrequency: "weekly", priority: 0.75 },
  { route: "/resume-preview", changeFrequency: "weekly", priority: 0.75 },
  { route: "/legal/privacy", changeFrequency: "monthly", priority: 0.45 },
  { route: "/legal/terms", changeFrequency: "monthly", priority: 0.45 },
  { route: "/blogs", changeFrequency: "weekly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = "https://freeresumetools.thebloggerscontent.com";
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${origin}${page.route}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const categoryPages: MetadataRoute.Sitemap = Object.values(
    blogCategories,
  ).map((category) => ({
    url: `${origin}/blogs/${category.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${origin}/blogs/${post.category}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}
