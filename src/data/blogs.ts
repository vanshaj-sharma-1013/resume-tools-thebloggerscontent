import { BlogPost, BlogCategory } from "@/types/blog";

export const blogCategories: Record<string, BlogCategory> = {
  tools: {
    name: "Resume Tools",
    slug: "tools",
    description: "Discover the best tools to help you build a professional resume and landing your dream job.",
    color: "from-cyan-500 to-blue-600",
  },
  guides: {
    name: "Career Guides",
    slug: "guides",
    description: "Expert advice and step-by-step guides on career growth, interview preparation, and job searching.",
    color: "from-purple-500 to-pink-600",
  },
};

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "best-free-resume-builders-2026",
    title: "The 10 Best Free Resume Builders in 2026",
    excerpt: "Building a resume doesn't have to be expensive. We've rounded up the top free tools that offer premium features without the price tag.",
    content: "Full content of the blog post goes here...",
    author: "Career Expert",
    date: "April 27, 2026",
    category: "tools",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop",
    readTime: "5 min read",
  },
  {
    id: "2",
    slug: "how-to-write-a-cover-letter",
    title: "Mastering the Art of the Cover Letter",
    excerpt: "A great cover letter can be the difference between getting an interview and being ignored. Learn how to write one that stands out.",
    content: "Full content of the blog post goes here...",
    author: "Hiring Manager",
    date: "April 25, 2026",
    category: "guides",
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=2080&auto=format&fit=crop",
    readTime: "8 min read",
  },
];
