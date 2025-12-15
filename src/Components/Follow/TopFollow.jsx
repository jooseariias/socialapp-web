import { useEffect, useState } from 'react'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import getTopUser from '../../Services/User/getTopUser'
import formatNumber from '../../Utils/formatNumber'
import { Link } from 'react-router-dom'

export default function TopFollowersCard() {
  const [limit, setLimit] = useState(5)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const MAX_VISIBLE_USERS = 20

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setLoading(true)
        const response = await getTopUser()

        if (response && response.status === 200 && response.data) {
          const allUsers = response.data.slice(0, MAX_VISIBLE_USERS)
          setUsers(allUsers)
        } else {
          setUsers([])
        }
      } catch (error) {
        console.error('Error fetching top users:', error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchTopUsers()
  }, [])

  const visibleUsers = users.slice(0, limit)
  const totalUsersAvailable = users.length
  const showViewMore = limit < totalUsersAvailable && limit < MAX_VISIBLE_USERS
  const showViewLess = limit > 5

  const handleViewMore = () => {
    const newLimit = Math.min(limit + 5, totalUsersAvailable, MAX_VISIBLE_USERS)
    setLimit(newLimit)
  }

  const handleViewLess = () => {
    setLimit(5)
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center text-white/80 backdrop-blur-sm">
        Loading users...
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center text-white/80 backdrop-blur-sm">
        No users found.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">Top Users by Followers</h3>

        {showViewMore ? (
          <button
            onClick={handleViewMore}
            className="text-sm text-blue-400 transition-colors hover:text-blue-300"
          >
            View More
          </button>
        ) : showViewLess ? (
          <button
            onClick={handleViewLess}
            className="text-sm text-blue-400 transition-colors hover:text-blue-300"
          >
            View Less
          </button>
        ) : null}
      </div>

      <div className="space-y-4">
        {visibleUsers.map(user => (
          <Link to={`/AddFollow/${user._id}`}>
            <div key={user._id} className="flex mt-3 items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />

                <div>
                  <div className="flex items-center space-x-1">
                    <h4 className="truncate text-sm font-medium text-white">{user.name}</h4>
                    {user.verified && <IoMdCheckmarkCircle className="text-blue-500" />}
                  </div>
                  <p className="text-xs text-white/60">{user.username}</p>
                </div>
              </div>

              <div className="text-xs text-white/60">
                {formatNumber(user.followersCount)} Followers
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
