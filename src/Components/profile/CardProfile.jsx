import { useUserStore } from '../../Store/useUserStore'

export default function CardProfile() {
    
  const { user } = useUserStore()

  const formatNumber = (num) => {
    if (!num) return 0
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
    return num
  }

  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <img
            src={user.image}
            alt={user.name}
            className="h-14 w-14 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-white">{user.name}</h3>
            <p className="text-sm text-white/60">{user.username}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-semibold text-white">{formatNumber(user.postsCount)}</div>
            <div className="text-xs text-white/60">Posts</div>
          </div>

          <div>
            <div className="font-semibold text-white">{formatNumber(user.followers.length)}</div>
            <div className="text-xs text-white/60">Followers</div>
          </div>

          <div>
            <div className="font-semibold text-white">{formatNumber(user.following.length)}</div>
            <div className="text-xs text-white/60">Following</div>
          </div>
        </div>
      </div>
    </div>
  )
}
