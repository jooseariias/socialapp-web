import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineHome, HiOutlineSearch, HiOutlineBell, HiOutlinePlusSm, HiOutlineUser, HiOutlineCog, HiOutlineLogout, HiMenu, HiX } from 'react-icons/hi' 
import { useUserStore } from '../Store/useUserStore'
import CreatePost from './CreatePost'
import { FaUsers } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  const { user, logout } = useUserStore()
  const location = useLocation()
  const navigate = useNavigate()

  const springTransition = { type: "spring", stiffness: 300, damping: 25 }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#2b0a3d]/70 px-4 py-3 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          {/* Logo - Siempre visible */}
          <Link to="/Feed">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-white">
                NEV<span className="text-purple-400">RYA</span>
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            
            <nav className="flex items-center mr-2 space-x-1">
              <HeaderLink to="/Feed" icon={<HiOutlineHome size={20} />} label="Home" active={location.pathname === '/Feed'} />
              <HeaderLink to="/Discover" icon={<HiOutlineSearch size={20} />} label="Explore" active={location.pathname === '/Discover'} />
            </nav>

            <div className="h-6 w-px bg-white/10 mx-2" />

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#9333ea" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreatePost(true)}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition-all mr-2"
            >
              <HiOutlinePlusSm size={18} />
              <span>Create Post</span>
            </motion.button>

            {/* --- CÁPSULA DE ESTADOS --- */}
            <div className="flex items-center bg-white/5 rounded-2xl px-1">
              
              {/* NUEVO ICONO: Radar / Conexión de Seguidores */}
              <Link to="/Community">
                <motion.button
                  whileHover={{ scale: 1.1, color: "#60a5fa" }}
                  whileTap={{ scale: 0.9 }}
                  className="relative rounded-xl p-2.5 text-white/70 transition-all"
                  title="Comunidad"
                >
                  <FaUsers size={20} />
                  {user?.followers?.length > 0 && (
                    <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                  )}
                </motion.button>
              </Link>

              {/* Notificaciones */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                  className={`relative rounded-xl p-2.5 transition-all ${showNotifications ? 'text-white' : 'text-white/70 hover:text-white'}`}
                >
                  <HiOutlineBell size={20} />
                  <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={springTransition}
                      className="absolute right-0 mt-4 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#1a0826]/95 p-1 shadow-2xl backdrop-blur-2xl"
                    >
                      <div className="p-4 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/5">Notificaciones</div>
                      <div className="max-h-80 overflow-y-auto px-2 py-8 text-center text-sm text-white/30 italic">Sin novedades</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Profile Menu */}
            <div className="relative ml-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                className="flex items-center rounded-full border-2 border-transparent hover:border-purple-500/50 transition-all"
              >
                <img
                  src={user?.image || 'https://via.placeholder.com/150'}
                  alt="Perfil"
                  className="h-8 w-8 rounded-full object-cover bg-purple-900/50"
                />
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 15, scale: 0.95 }}
                    transition={springTransition}
                    className="absolute right-0 mt-4 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#1a0826]/95 p-2 shadow-2xl backdrop-blur-2xl"
                  >
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="truncate text-sm font-bold text-white">{user?.name || 'Usuario'}</p>
                      <p className="truncate text-xs text-white/40">{user?.username || 'user'}</p>
                    </div>
                    <div className="p-1 space-y-1">
                      <MenuLink to="/ProfileUser" icon={<HiOutlineUser size={18}/>} label="Mi Perfil" />
                      <MenuLink to="/Comfig" icon={<HiOutlineCog size={18}/>} label="Ajustes" />
                      <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                        <HiOutlineLogout size={18} /> <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Create Post Button Mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreatePost(true)}
              className="flex items-center gap-1 rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-purple-900/20"
            >
              <HiOutlinePlusSm size={16} />
              <span>Post</span>
            </motion.button>

            {/* Notifications Mobile */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
              className="relative rounded-xl p-2 text-white/70 hover:text-white transition-all"
            >
              <HiOutlineBell size={20} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-purple-500" />
            </motion.button>

            {/* Community Mobile */}
            <Link to="/Community">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative rounded-xl p-2 text-white/70 hover:text-white transition-all"
              >
                <FaUsers size={18} />
              </motion.button>
            </Link>

            {/* Profile Mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
              className="flex items-center rounded-full border-2 border-transparent hover:border-purple-500/50 transition-all"
            >
              <img
                src={user?.image || 'https://via.placeholder.com/150'}
                alt="Perfil"
                className="h-8 w-8 rounded-full object-cover bg-purple-900/50"
              />
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {showMobileMenu ? <HiX size={20} /> : <HiMenu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-white/10 mt-3"
            >
              <div className="py-4">
                <div className="space-y-2">
                  <MobileNavLink 
                    to="/Feed" 
                    icon={<HiOutlineHome size={20} />} 
                    label="Home" 
                    active={location.pathname === '/Feed'}
                  />
                  <MobileNavLink 
                    to="/Discover" 
                    icon={<HiOutlineSearch size={20} />} 
                    label="Explore" 
                    active={location.pathname === '/Discover'}
                  />
                  <MobileNavLink 
                    to="/ProfileUser" 
                    icon={<HiOutlineUser size={20} />} 
                    label="My Profile" 
                    active={location.pathname === '/ProfileUser'}
                  />
                  <MobileNavLink 
                    to="/Comfig" 
                    icon={<HiOutlineCog size={20} />} 
                    label="Settings" 
                    active={location.pathname === '/Comfig'}
                  />
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <HiOutlineLogout size={18} /> 
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop for dropdowns */}
        {(showNotifications || showUserMenu || showMobileMenu) && (
          <div 
            className="fixed inset-0 z-[-1] bg-black/20 md:hidden" 
            onClick={() => {
              setShowNotifications(false)
              setShowUserMenu(false)
              setShowMobileMenu(false)
            }}
          />
        )}

        <CreatePost isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} />
      </motion.header>
    </>
  )
}

// Subcomponentes auxiliares
const HeaderLink = ({ to, icon, label, active }) => (
  <Link to={to}>
    <motion.div
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
        active ? 'text-purple-400 bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
    </motion.div>
  </Link>
)

const MobileNavLink = ({ to, icon, label, active }) => (
  <Link to={to}>
    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
      active ? 'text-purple-400 bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
    }`}>
      {icon}
      <span>{label}</span>
    </div>
  </Link>
)

const MenuLink = ({ to, icon, label }) => (
  <Link to={to}>
    <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all">
      <span className="text-purple-400">{icon}</span>
      {label}
    </div>
  </Link>
)

export default Header