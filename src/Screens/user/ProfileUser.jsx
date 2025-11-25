import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaRegHeart, FaRegImage, FaUserEdit, FaUserFriends } from 'react-icons/fa'
import { IoLocationOutline, IoChatbubbleEllipses } from 'react-icons/io5'
import { useUserStore } from '../../Store/useUserStore'
import Header from '../../Components/Header'

const ProfileUser = () => {
  const { user, loading } = useUserStore()
  const [activeTab, setActiveTab] = useState('Posts')

  const formatNumber = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

  if (loading) return <div className="p-4 text-white">Cargando perfil...</div>

  const profile = {
    name: user?.name || 'Sin nombre',
    username: user?.username || '@username',
    bio: user?.description || 'No tienes descripción',
    location: user?.location || 'Sin ubicación',
    tier: user?.role || 'User',
    profileImage:
      user?.image ||
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    stats: {
      posts: user?.posts?.length || 0,
      followers: user?.followers?.length || 0,
      following: user?.following?.length || 0,
    },
    posts: user?.posts || [],
  }

  const statIcons = {
    posts: <FaRegImage />,
    followers: <FaUserFriends />,
    following: <FaUserEdit />,
  }

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex min-h-screen w-full bg-[#2b0a3d]"
      >
        {/* Fondos decorativos */}
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-[80px]" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-purple-500/20 blur-[80px]" />

        <div className="relative z-10 mx-auto w-full max-w-2xl px-4">
          <div className="px-4 pb-8">
            {/* Profile Header */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-center gap-4 py-8"
            >
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <img
                    src={profile.profileImage}
                    alt="profile"
                    className="h-32 w-32 rounded-full border-4 border-purple-400/50 object-cover shadow-lg"
                  />
                </motion.div>
                <span className="absolute right-2 bottom-2 h-5 w-5 rounded-full border-2 border-[#2b0a3d] bg-green-500" />
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                  <FaUserEdit className="cursor-pointer text-white/60 hover:text-purple-300" />
                </div>
                <p className="mt-1 text-white/60">{profile.username}</p>
              </div>
            </motion.section>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="px-4 pb-6 text-center text-lg text-white/80"
            >
              {profile.bio}
            </motion.p>

            {/* Location & Tier */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3 px-4 pb-6"
            >
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <IoLocationOutline className="text-purple-300" />
                <span className="text-white/90">{profile.location}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/20 px-4 py-2 backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-amber-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-amber-200">{profile.tier}</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-3 px-4 pb-6"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-button flex-1 rounded-lg py-3 font-bold text-white shadow-lg transition-colors hover:bg-purple-600"
              >
                Follow
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/30 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <IoChatbubbleEllipses size={18} /> Message
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 px-4 pb-6"
            >
              {['posts', 'followers', 'following'].map(key => (
                <motion.div
                  key={key}
                  className="flex flex-1 flex-col items-center rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="flex items-center gap-1 text-2xl font-bold text-white">
                    {statIcons[key]} {formatNumber(profile.stats[key])}
                  </span>
                  <span className="mt-1 text-white/60 capitalize">{key}</span>
                </motion.div>
              ))}
            </motion.section>

            {/* Tabs */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-6"
            >
              <div className="relative flex justify-center gap-1 rounded-xl border border-white/10 bg-white/10 p-1 backdrop-blur-sm">
                {[
                  { name: 'Posts', icon: <FaRegImage /> },
                  { name: 'Likes', icon: <FaRegHeart /> },
                ].map(tab => {
                  const isActive = activeTab === tab.name
                  return (
                    <motion.button
                      key={tab.name}
                      onClick={() => setActiveTab(tab.name)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all ${
                        isActive
                          ? 'bg-button text-white shadow-md'
                          : 'text-white/60 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {tab.icon}
                      {tab.name}
                    </motion.button>
                  )
                })}
              </div>
            </motion.section>

            {/* Grid */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-2"
            >
              {profile.posts.map((post, idx) => (
                <motion.div
                  key={idx}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-white/10"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <img src={post} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <motion.div
                    className="absolute bottom-3 left-3 flex items-center gap-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    <FaRegHeart className="text-sm" /> {(idx + 1) * 24}
                  </motion.div>
                </motion.div>
              ))}
            </motion.section>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default ProfileUser
