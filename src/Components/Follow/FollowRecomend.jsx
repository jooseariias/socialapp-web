import { IoMdCheckmarkCircle } from 'react-icons/io'
import { useState, useEffect } from 'react'
import { getFollowRecomend } from '../../Services/follow/FollowRecomend'
import { followUser } from '../../Services/follow/follow'
import { unFollow } from '../../Services/follow/unFollow'

import {Link} from 'react-router-dom'

export default function FollowRecomendComponent() {

  const [suggestedUsers, setSuggestedUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getFollowRecomend()
      console.log(result)
      if (result.status === 200) {
        setSuggestedUsers(result.data)
      }
    }
    fetchUsers()
  }, [])

  const handleToggleFollow = async (userId, isFollowing) => {
    let result

    if (isFollowing) {
      result = await unFollow(userId)
    } else {
      result = await followUser(userId)
    }

    if (result.status === 200) {
      setSuggestedUsers(prev =>
        prev.map(u =>
          u._id === userId
            ? { ...u, isFollowing: !isFollowing }
            : u
        )
      )
    }
  }

  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-white">Suggestions for you</h3>
          <button className="text-sm text-blue-400 transition-colors hover:text-blue-300">
            View all
          </button>
        </div>

        <div className="space-y-4">
          {suggestedUsers.map(user => (
            <Link to={`/AddFollow/${user._id}`} key={user._id} className='hover:cursor-pointer'>
            <div key={user._id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <h4 className="truncate text-sm font-medium text-white">{user.name}</h4>
                    {user.verified && (
                      <IoMdCheckmarkCircle className="flex-shrink-0 text-blue-500" />
                    )}
                  </div>
                  <p className="truncate text-xs text-white/60">{user.username}</p>
                  <p className="text-xs text-white/40">{user.city}</p>
                </div>
              </div>

              <button
                onClick={() => handleToggleFollow(user._id, user.isFollowing)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium text-white transition-colors
                  ${user.isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}
                `}
              >
                {user.isFollowing ? 'Unfollow' : 'Follow'}
              </button>

            </div></Link>
          ))}
        </div>
      </div>
    </div>
  )
}
