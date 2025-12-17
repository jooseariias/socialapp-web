import { useUserStore } from '../../Store/useUserStore'
import { useEffect } from 'react'
export default function CardProfile() {

 const { user, loading, fetchUser } = useUserStore()

  useEffect(() => {
    if (!user && !loading) {
      fetchUser();
    }
  }, [user, loading, fetchUser]);

  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0"
    const n = Number(num)
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
    return n.toString()
  }


  if (loading || !user) {
    return <div className="animate-pulse bg-white/5 h-40 rounded-2xl border border-white/10" />
  }
  

  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <img
            src={user.image || '/default-avatar.png'} 
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
            <div className="font-semibold text-white">
              {formatNumber(user.postsCount)}
            </div>
            <div className="text-xs text-white/60">Posts</div>
          </div>

          <div>
            <div className="font-semibold text-white">
              {/* Usamos ?.length y ?? 0 por seguridad extra */}
              {formatNumber(user.followers?.length ?? 0)}
            </div>
            <div className="text-xs text-white/60">Followers</div>
          </div>

          <div>
            <div className="font-semibold text-white">
              {formatNumber(user.following?.length ?? 0)}
            </div>
            <div className="text-xs text-white/60">Following</div>
          </div>
        </div>
      </div>
    </div>
  )
}