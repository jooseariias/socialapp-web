import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoLocationOutline } from 'react-icons/io5'
import { FaUserPlus, FaUserTimes, FaFlag } from 'react-icons/fa'
import { FaRegImage, FaUserFriends } from 'react-icons/fa'
import Header from '../../Components/Header'
import StatsCard from '../../Components/StatsCard'
import formatNumber from '../../Utils/formatNumber'

export default function ProfileAddFollow() {
  const [isFollowing, setIsFollowing] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const statIcons = {
    posts: <FaRegImage />,
    followers: <FaUserFriends />,
    following: <FaUserFriends />,
  }
  const userData = {
    name: 'Joosearias',
    username: 'joosearias',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    bio: '¡Bienvenido a tu nueva aventura en nuestra plataforma! Estamos emocionados de tenerte aquí y esperamos que disfrutes de todas las funcionalidades.',
    location: 'Simoca',
    tier: 'Premium',
    location: 'Simoca',
    stats: {
      posts: 1000,
      followers: 124444444,
      following: 1000000000000,
    },
    posts: [
      {
        id: 1,
        content:
          'Acabo de terminar mi proyecto de visualización de datos con Python y D3.js. ¡Quedó increíble! #DataScience #Python',
        likes: 245,
        comments: 32,
        shares: 12,
        date: '2024-01-15',
        isLiked: false,
        author: {
          name: 'María González',
          username: 'data_ninja',
          image:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        },
      },
    ],
  }

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing)
    console.log(isFollowing ? 'Dejando de seguir' : 'Siguiendo')
  }

  const handleReport = () => {
    console.log('Reportando perfil')
    // Aquí iría la llamada a la API para reportar
    alert('Reporte enviado')
    setShowReport(false)
  }

  return (
    <div>
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-[80px]" />
      <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-purple-500/20 blur-[80px]" />
      <Header />

      <div className="min-h-screen w-full bg-[#2b0a3d] pt-4">
        <div className="relative mx-auto max-w-2xl">
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
                  src={userData.image}
                  alt="profile"
                  className="h-32 w-32 rounded-full border-4 border-purple-400/50 object-cover shadow-lg"
                />
              </motion.div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
              <p className="mt-1 text-white/60">@{userData.username}</p>
            </div>

            {/* Botones principales */}
            <div className="mt-4 flex items-center gap-4">
              {/* Botón de Seguir/Dejar de seguir */}
              {isFollowing ? (
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowReport(true)}
                    className="flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/20 px-3 py-2 text-red-200 transition-all hover:bg-red-500/30"
                  >
                    <FaFlag size={12} />
                    <span className="text-xs">Reportar</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFollowToggle}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 px-5 py-2.5 font-medium text-white transition-all hover:from-gray-700 hover:to-gray-800"
                  >
                    <FaUserTimes size={14} />
                    <span>Dejar de seguir</span>
                  </motion.button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowReport(true)}
                    className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/40 transition-all hover:bg-white/10 hover:text-white/60"
                    title="Reportar perfil"
                  >
                    <FaFlag size={12} />
                    <span className="text-xs">Reportar</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFollowToggle}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-600 px-5 py-2.5 font-medium text-white transition-all hover:from-purple-600 hover:to-fuchsia-700"
                  >
                    <FaUserPlus size={14} />
                    <span>Seguir</span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.section>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="px-4 pb-6"
          >
            <div className="mx-auto w-full max-w-md">
              <div className="flex w-full items-start justify-center">
                <div className="min-w-0 flex-1">
                  <p className="text-center leading-relaxed break-words text-white/80">
                    {userData.bio}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 px-4 pb-6"
          >
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <IoLocationOutline className="text-purple-300" />
              <span className="text-white/90">{userData.location}</span>
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
              <span className="text-amber-200">{userData.tier}</span>
            </div>
          </motion.div>

          {/* Modal de reporte sutil */}
          {showReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
              onClick={() => setShowReport(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="w-full max-w-md rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#2b0a3d] to-[#1a0630] p-6 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600">
                    <FaFlag className="text-2xl text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">Reportar perfil</h3>
                  <p className="text-sm text-white/60">
                    ¿Estás seguro de que quieres reportar este perfil?
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-center text-white/80">
                    Reportarás a <span className="font-semibold">@{userData.username}</span>
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setShowReport(false)}
                      className="flex-1 rounded-xl bg-white/10 py-3 font-medium text-white transition-colors hover:bg-white/20"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleReport}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3 font-medium text-white transition-all hover:from-red-600 hover:to-red-700"
                    >
                      <FaFlag size={14} />
                      Reportar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 mx-auto w-full max-w-2xl px-4"
        >
          <StatsCard profileData={userData} statIcons={statIcons} formatNumber={formatNumber} />
        </motion.div>
      </div>
    </div>
  )
}
