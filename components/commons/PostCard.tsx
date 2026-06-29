import { Heart, MessageCircle } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

const categoryColors: Record<string, string> = {
  Travel: 'bg-blue-100 text-blue-700',
  Question: 'bg-purple-100 text-purple-700',
  Social: 'bg-green-100 text-green-700',
  Safety: 'bg-red-100 text-red-700',
  Local: 'bg-amber-100 text-amber-700',
}

interface Props {
  post: any
  hub: string
  isLiked: boolean
  onLike: () => void
  onReply: () => void
}

export default function PostCard({ post, hub, isLiked, onLike, onReply }: Props) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
              {post.category}
            </span>
            <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
          </div>
          <h3 className="font-sora font-semibold text-gray-900 text-sm leading-snug mb-1">
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-2.5">
            {post.body}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-medium">{post.profiles?.name}</span>
            {post.profiles?.university && (
              <span className="text-xs text-gray-300">&middot;</span>
            )}
            <span className="text-xs text-gray-400">{post.profiles?.university}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
        <button
          onClick={onLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={onReply}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.replies?.length || 0}</span>
        </button>
      </div>
    </div>
  )
}
