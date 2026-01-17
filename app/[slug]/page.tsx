import { getAllPosts, getPostBySlug } from '@/lib/blog/getPosts';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

// Revalidate every hour to check for scheduled posts
export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | ekkOS Blog',
    };
  }

  return {
    title: `${post.title} | ekkOS Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.image ? [{ url: post.image, alt: post.imageAlt }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Convert markdown to HTML (with GFM for tables)
  const processedContent = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(post.content);
  const contentHtml = processedContent.toString();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog</span>
        </Link>

        {/* Article Header */}
        <article>
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>
                  {format(new Date(post.date), 'MMMM d, yyyy')}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <span>By {post.author}</span>
              </div>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full"
                  >
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Cover Image */}
            {post.image && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
                <Image
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}
          </header>

          {/* Article Content */}
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white
              prose-p:text-white/80
              prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-code:text-purple-400 prose-code:bg-white/10 prose-code:px-1 prose-code:rounded
              prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/10
              prose-blockquote:border-purple-500/50 prose-blockquote:text-white/70
              prose-ul:text-white/80 prose-ol:text-white/80
              prose-li:text-white/80
              prose-img:rounded-xl prose-img:mx-auto
              prose-table:border-collapse prose-table:w-full prose-table:my-6
              prose-th:border prose-th:border-white/20 prose-th:bg-white/10 prose-th:p-3 prose-th:text-left prose-th:text-white prose-th:font-semibold
              prose-td:border prose-td:border-white/20 prose-td:p-3 prose-td:text-white/80
            "
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </article>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
