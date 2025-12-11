import { useState } from 'react'
import { IoMdCheckmarkCircle } from 'react-icons/io'

// Genera 20 usuarios falsos
const mockUsers = Array.from({ length: 20 }).map((_, i) => ({
  _id: i + 1,
  name: `Usuario ${i + 1}`,
  username: `@usuario${i + 1}`,
  image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  verified: i % 3 === 0, // cada 3, usuario verificado
  followersCount: Math.floor(Math.random() * 500000), // 0 a 500k seguidores
}))

export default function TopFollowersCardMock() {
  const [limit, setLimit] = useState(5)

  const formatNumber = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
    return num
  }

  const visibleUsers = mockUsers.slice(0, limit)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">Top usuarios por seguidores</h3>

        {limit === 10 ? (
          <button
            onClick={() => setLimit(20)}
            className="text-sm text-blue-400 transition-colors hover:text-blue-300"
          >
            Ver más
          </button>
        ) : (
          <button
            onClick={() => setLimit(10)}
            className="text-sm text-blue-400 transition-colors hover:text-blue-300"
          >
            Ver menos
          </button>
        )}
      </div>

      <div className="space-y-4">
        {visibleUsers.map(user => (
          <div key={user._id} className="flex items-center justify-between">
            
            <div className="flex items-center space-x-3">
              <img
                src={user.image}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
              />

              <div>
                <div className="flex items-center space-x-1">
                  <h4 className="truncate text-sm font-medium text-white">{user.name}</h4>
                  {user.verified && (
                    <IoMdCheckmarkCircle className="text-blue-500" />
                  )}
                </div>
                <p className="text-xs text-white/60">{user.username}</p>
              </div>
            </div>

            <div className="text-xs text-white/60">
              {formatNumber(user.followersCount)} followers
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
