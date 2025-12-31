import { getAllPosts } from '@/lib/blog/getPosts';
import { format } from 'date-fns';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Blog | ekkOS',
  description: 'Learn about AI memory, the golden loop, and how ekkOS makes AI agents smarter over time.',
};

// Revalidate every hour to check for scheduled posts
export const revalidate = 3600;

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            The ekkOS Blog
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Learn about AI memory, the golden loop, and how ekkOS makes AI agents smarter over time
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">No blog posts yet. Check back soon!</p>
            <p className="text-white/40 text-sm mt-2">
              Posts will appear here once published.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/${post.slug}`}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 hover:bg-white/10 transition-all"
              >
                {/* Cover Image */}
                {post.image && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.imageAlt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent opacity-60" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-white/40 mb-3">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.date}>
                      {format(new Date(post.date), 'MMMM d, yyyy')}
                    </time>
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4" />
                    <span>{post.readingTime} min read</span>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-white/60 mb-4 line-clamp-3">
                    {post.description}
                  </p>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center text-purple-400 group-hover:gap-2 transition-all">
                    <span className="text-sm font-medium">Read more</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
