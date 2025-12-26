import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  content: string;
  readingTime: number;
  image?: string;        // Cover image path (relative to /images/)
  imageAlt?: string;     // Alt text for cover image
}

// Content is in apps/blog/content
const postsDirectory = path.join(process.cwd(), 'content');

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => file.replace(/\.(md|mdx)$/, ''));
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      // Try .mdx
      const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
      if (!fs.existsSync(mdxPath)) {
        return null;
      }
      const fileContents = fs.readFileSync(mdxPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        author: data.author || 'ekkOS Team',
        tags: data.tags || [],
        content,
        readingTime: Math.ceil(content.split(/\s+/).length / 200),
        image: data.image || undefined,
        imageAlt: data.imageAlt || data.title || 'Blog post image',
      };
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'ekkOS Team',
      tags: data.tags || [],
      content,
      readingTime: Math.ceil(content.split(/\s+/).length / 200),
      image: data.image || undefined,
      imageAlt: data.imageAlt || data.title || 'Blog post image',
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPosts(): BlogPost[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return posts;
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}
