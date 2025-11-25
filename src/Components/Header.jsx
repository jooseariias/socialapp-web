import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaBell, FaPlus, FaHome, FaUser, FaCog } from 'react-icons/fa'
import { useUserStore } from '../Store/useUserStore'
import CreatePost from './CreatePost'

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)

  const handlePostCreated = newPost => {
    console.log('Nuevo post creado:', newPost)
  }
  const { user, loading } = useUserStore()

  const notifications = [
    { id: 1, text: 'Nuevo seguidor', time: '5 min', read: false },
    { id: 2, text: 'Tu publicación tiene 15 likes', time: '1 h', read: false },
    { id: 3, text: 'Mencionaron tu comentario', time: '3 h', read: true },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#2b0a3d]/90 px-4 py-3 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-white">NEVRYA</h1>
        </motion.div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors hover:bg-white/10"
          >
            <FaHome size={18} />
            <span className="hidden sm:block">Inicio</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/10"
          >
            <FaSearch size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreatePost(true)}
            className="bg-button flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors hover:bg-purple-600"
          >
            <FaPlus size={16} />
            <span>Crear</span>
          </motion.button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg p-2 text-white transition-colors hover:bg-white/10"
            >
              <FaBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-80 rounded-lg border border-white/10 bg-[#2b0a3d] shadow-xl backdrop-blur-md"
              >
                <div className="border-b border-white/10 p-4">
                  <h3 className="font-semibold text-white">Notificaciones</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`border-b border-white/5 p-4 transition-colors hover:bg-white/5 ${
                        !notification.read ? 'bg-white/5' : ''
                      }`}
                    >
                      <p className="text-sm text-white">{notification.text}</p>
                      <p className="mt-1 text-xs text-white/60">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2">
                  <button className="w-full py-2 text-center text-sm text-purple-300 hover:text-purple-200">
                    Ver todas las notificaciones
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-white/10"
            >
              <img
                src={user?.image}
                alt="Perfil"
                className="h-10 w-10 rounded-full border-2 border-purple-400/50"
              />
            </motion.button>

            {/* Dropdown Perfil */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 rounded-lg border border-white/10 bg-[#2b0a3d] shadow-xl backdrop-blur-md"
              >
                <div className="border-b border-white/10 p-4">
                  <p className="font-semibold text-white">{user?.name}</p>
                  <p className="text-sm text-white/60">{user?.username}</p>
                </div>
                <div className="p-2">
                  <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left text-white transition-colors hover:bg-white/10">
                    <FaUser size={16} />
                    Mi Perfil
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left text-white transition-colors hover:bg-white/10">
                    <FaCog size={16} />
                    Configuración
                  </button>
                  <div className="my-2 border-t border-white/10"></div>
                  <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left text-red-400 transition-colors hover:bg-red-500/20">
                    Cerrar Sesión
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Búsqueda */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20 backdrop-blur-sm"
          onClick={() => setShowSearch(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mx-4 w-full max-w-md rounded-xl border border-white/10 bg-[#2b0a3d] p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 transform text-white/60" />
              <input
                type="text"
                placeholder="Buscar en NEVRYA..."
                autoFocus
                className="w-full rounded-lg border border-white/20 bg-white/10 py-3 pr-4 pl-10 text-white placeholder-white/60 transition-colors focus:border-purple-400 focus:outline-none"
              />
            </div>
            <div className="mt-4 text-center text-sm text-white/60">Presiona ESC para cerrar</div>
          </motion.div>
        </motion.div>
      )}

      {/* Overlay para cerrar dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false)
            setShowUserMenu(false)
          }}
        />
      )}
      <section>
        <CreatePost
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      </section>
    </motion.header>
  )
}

export default Header
