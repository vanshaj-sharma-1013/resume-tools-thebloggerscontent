export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: "tools" | "guides";
  image: string;
  readTime: string;
}

export interface BlogCategory {
  name: string;
  slug: string;
  description: string;
  color: string;
}
