import { getPostBySlug, getAllPostsAdmin } from '@/lib/blog/getPosts';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, Tag, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

export async function generateStaticParams() {
  // Generate paths for ALL posts including drafts
  const posts = getAllPostsAdmin();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | ekkOS Blog Preview',
    };
  }

  return {
    title: `[PREVIEW] ${post.title} | ekkOS Blog`,
    description: post.description,
  };
}

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(post.content);
  const contentHtml = processedContent.toString();

  const postDate = new Date(post.date);
  const now = new Date();
  const isScheduled = postDate > now;
  const isDraft = post.draft;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Preview Banner */}
      <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <div className="flex-1">
            <span className="text-amber-400 font-medium">Preview Mode</span>
            <span className="text-amber-400/70 ml-2">
              {isDraft && '• Draft (will not publish)'}
              {isScheduled && !isDraft && `• Scheduled for ${format(postDate, 'MMMM d, yyyy')}`}
              {!isScheduled && !isDraft && '• Published'}
            </span>
          </div>
          <Link
            href="/preview"
            className="text-amber-400 hover:text-amber-300 text-sm"
          >
            All Previews →
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Link */}
        <Link
          href="/preview"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Previews</span>
        </Link>

        {/* Article */}
        <article>
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>
                  {format(postDate, 'MMMM d, yyyy')}
                </time>
                {isScheduled && (
                  <span className="ml-2 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">
                    Scheduled
                  </span>
                )}
                {isDraft && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                    Draft
                  </span>
                )}
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
            href="/preview"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Previews</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
