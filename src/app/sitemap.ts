import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-config";

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
];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin =  "https://freeresumetools.thebloggerscontent.com"
  const lastModified = new Date();

  return pages.map((page) => ({
    url: `${origin}${page.route}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
