import { getAllPostsAdmin } from '@/lib/blog/getPosts';
import { format } from 'date-fns';
import { AlertTriangle, Calendar, Clock, Eye, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Preview All Posts | ekkOS Blog',
  description: 'Preview scheduled and draft blog posts before publication.',
};

export default function PreviewIndexPage() {
  const posts = getAllPostsAdmin();
  const now = new Date();

  // Categorize posts
  const drafts = posts.filter((p) => p.draft);
  const scheduled = posts.filter((p) => !p.draft && new Date(p.date) > now);
  const published = posts.filter((p) => !p.draft && new Date(p.date) <= now);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Preview Banner */}
      <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span className="text-amber-400 font-medium">Preview Mode</span>
          <span className="text-amber-400/70">
            Viewing all posts including drafts and scheduled
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Blog Preview Dashboard
          </h1>
          <p className="text-white/60">
            Preview all posts before they go live. Drafts and scheduled posts are only visible here.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <div className="text-3xl font-bold text-red-400">{drafts.length}</div>
            <div className="text-red-400/70">Drafts</div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
            <div className="text-3xl font-bold text-amber-400">{scheduled.length}</div>
            <div className="text-amber-400/70">Scheduled</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400">{published.length}</div>
            <div className="text-green-400/70">Published</div>
          </div>
        </div>

        {/* Drafts Section */}
        {drafts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-400" />
              Drafts
            </h2>
            <div className="space-y-4">
              {drafts.map((post) => (
                <PostCard key={post.slug} post={post} status="draft" />
              ))}
            </div>
          </section>
        )}

        {/* Scheduled Section */}
        {scheduled.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-amber-400" />
              Scheduled
            </h2>
            <div className="space-y-4">
              {scheduled.map((post) => (
                <PostCard key={post.slug} post={post} status="scheduled" />
              ))}
            </div>
          </section>
        )}

        {/* Published Section */}
        {published.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6 text-green-400" />
              Published
            </h2>
            <div className="space-y-4">
              {published.map((post) => (
                <PostCard key={post.slug} post={post} status="published" />
              ))}
            </div>
          </section>
        )}

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">No blog posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({
  post,
  status,
}: {
  post: {
    slug: string;
    title: string;
    description: string;
    date: string;
    readingTime: number;
    tags: string[];
  };
  status: 'draft' | 'scheduled' | 'published';
}) {
  const statusColors = {
    draft: 'bg-red-500/20 text-red-400 border-red-500/30',
    scheduled: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    published: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  const postDate = new Date(post.date);

  return (
    <Link
      href={`/preview/${post.slug}`}
      className="block bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/30 hover:bg-white/10 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${statusColors[status]}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>
                {format(postDate, 'MMM d, yyyy')}
              </time>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime} min</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
          <p className="text-white/60 line-clamp-2">{post.description}</p>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-purple-400">
          <Eye className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
}
