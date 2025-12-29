import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiOutlineHome, 
  HiOutlineSearch, 
  HiOutlineBell, 
  HiOutlinePlusSm, 
  HiOutlineUser, 
  HiOutlineCog, 
  HiOutlineLogout,
  HiMenu,
  HiX
} from 'react-icons/hi' 
import { FaUsers } from 'react-icons/fa'
import { useUserStore } from '../Store/useUserStore'
import CreatePost from './CreatePost'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const { user, logout } = useUserStore()
  const location = useLocation()
  const navigate = useNavigate()

  const springTransition = { type: "spring", stiffness: 300, damping: 25 }

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setShowMobileMenu(false)
    setShowNotifications(false)
    setShowUserMenu(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 border-b ${
          isScrolled 
            ? 'border-white/10 bg-[#2b0a3d]/90' 
            : 'border-white/[0.06] bg-[#2b0a3d]/70'
        } px-4 sm:px-6 py-3 backdrop-blur-xl transition-all duration-300`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          {/* Logo */}
          <Link to="/Feed">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <span className="text-white font-black text-sm sm:text-base">N</span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 border-2 border-[#2b0a3d]"></div>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-white hidden sm:block">
                NEV<span className="text-purple-400">RYA</span>
              </h1>
              <h1 className="text-xl font-black tracking-tighter text-white sm:hidden">
                N<span className="text-purple-400">R</span>
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-1 lg:space-x-2">
              <HeaderLink 
                to="/Feed" 
                icon={<HiOutlineHome size={20} />} 
                label="Home" 
                active={location.pathname === '/Feed'} 
              />
              <HeaderLink 
                to="/Discover" 
                icon={<HiOutlineSearch size={20} />} 
                label="Explore" 
                active={location.pathname === '/Discover'} 
              />
              <HeaderLink 
                to="/Community" 
                icon={<FaUsers size={18} />} 
                label="Community" 
                active={location.pathname === '/Community'} 
              />
            </nav>

            {/* Divider */}
            <div className="h-6 w-px bg-white/10 mx-2" />

            {/* Create Post Button */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#9333ea" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreatePost(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-4 lg:px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30 transition-all"
            >
              <HiOutlinePlusSm size={18} />
              <span className="hidden lg:inline">Create Post</span>
              <span className="lg:hidden">Create</span>
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { 
                  setShowNotifications(!showNotifications)
                  setShowUserMenu(false)
                }}
                className={`relative rounded-xl p-2 transition-all ${
                  showNotifications 
                    ? 'text-white bg-white/10' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <HiOutlineBell size={22} />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_8px_#a855f7]" />
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={springTransition}
                    className="absolute right-0 mt-3 w-72 sm:w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#1a0826]/95 p-1 shadow-2xl backdrop-blur-2xl"
                  >
                    <div className="p-3 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/5 flex items-center justify-between">
                      <span>Notifications</span>
                      <span className="text-xs text-purple-400">3 new</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-4 text-center text-sm text-white/40">
                        <HiOutlineBell className="mx-auto mb-2 h-8 w-8" />
                        <p>No notifications yet</p>
                        <p className="text-xs mt-1">We'll notify you here</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { 
                  setShowUserMenu(!showUserMenu)
                  setShowNotifications(false)
                }}
                className="flex items-center gap-2 rounded-full border-2 border-transparent hover:border-purple-500/30 transition-all p-0.5"
              >
                <div className="relative">
                  <img
                    src={user?.image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                    alt="Perfil"
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-purple-500/20"
                    onError={(e) => {
                      e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                    }}
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-[#2b0a3d]"></div>
                </div>
                <span className="text-sm font-medium text-white/80 hidden lg:inline">
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={springTransition}
                    className="absolute right-0 mt-3 w-56 sm:w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#1a0826]/95 p-2 shadow-2xl backdrop-blur-2xl"
                  >
                    <div className="px-3 py-3 border-b border-white/5">
                      <p className="truncate text-sm font-bold text-white">{user?.name || 'Usuario'}</p>
                      <p className="truncate text-xs text-white/40">@{user?.username || 'user'}</p>
                    </div>
                    <div className="p-1 space-y-1">
                      <MenuLink to="/ProfileUser" icon={<HiOutlineUser size={18}/>} label="My Profile" />
                      <MenuLink to="/Config" icon={<HiOutlineCog size={18}/>} label="Settings" />
                      <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <HiOutlineLogout size={18} /> 
                        <span>Sign Out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowCreatePost(true)}
              className="flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 p-2.5 text-white shadow-lg shadow-purple-900/20"
            >
              <HiOutlinePlusSm size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="rounded-xl p-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              {showMobileMenu ? <HiX size={24} /> : <HiMenu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-white/10 mt-3"
            >
              <div className="pt-4 pb-6 space-y-4">
                {/* Mobile Navigation Links */}
                <div className="grid grid-cols-2 gap-3">
                  <MobileNavLink 
                    to="/Feed" 
                    icon={<HiOutlineHome size={22} />} 
                    label="Home" 
                    active={location.pathname === '/Feed'}
                  />
                  <MobileNavLink 
                    to="/Discover" 
                    icon={<HiOutlineSearch size={22} />} 
                    label="Explore" 
                    active={location.pathname === '/Discover'}
                  />
                  <MobileNavLink 
                    to="/Community" 
                    icon={<FaUsers size={20} />} 
                    label="Community" 
                    active={location.pathname === '/Community'}
                  />
                  <MobileNavLink 
                    to="/ProfileUser" 
                    icon={<HiOutlineUser size={22} />} 
                    label="Profile" 
                    active={location.pathname === '/ProfileUser'}
                  />
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <img
                    src={user?.image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                    alt="Perfil"
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-500/30"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{user?.name || 'Usuario'}</p>
                    <p className="text-xs text-white/40">@{user?.username || 'user'}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="rounded-lg p-2 text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <HiOutlineCog size={18} />
                  </motion.button>
                </div>

                {/* Mobile User Menu Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden rounded-xl bg-white/5"
                    >
                      <div className="p-2 space-y-1">
                        <MobileMenuLink to="/Config" icon={<HiOutlineCog size={18}/>} label="Settings" />
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10"
                        >
                          <HiOutlineLogout size={18} /> 
                          <span>Sign Out</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop for dropdowns */}
        {(showNotifications || showUserMenu || showMobileMenu) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[-1] bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => {
              setShowNotifications(false)
              setShowUserMenu(false)
              setShowMobileMenu(false)
            }}
          />
        )}
      </motion.header>

      {/* Create Post Modal */}
      <CreatePost isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} />
    </>
  )
}

// Subcomponentes auxiliares
const HeaderLink = ({ to, icon, label, active }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
        active 
          ? 'text-purple-400 bg-gradient-to-r from-purple-500/10 to-pink-500/10' 
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
    </motion.div>
  </Link>
)

const MobileNavLink = ({ to, icon, label, active }) => (
  <Link to={to}>
    <motion.div
      whileTap={{ scale: 0.95 }}
      className={`flex flex-col items-center justify-center rounded-xl p-3 transition-all ${
        active 
          ? 'text-purple-400 bg-gradient-to-b from-purple-500/10 to-transparent' 
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </motion.div>
  </Link>
)

const MenuLink = ({ to, icon, label }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all"
    >
      <span className="text-purple-400">{icon}</span>
      {label}
    </motion.div>
  </Link>
)

const MobileMenuLink = ({ to, icon, label }) => (
  <Link to={to}>
    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all">
      <span className="text-purple-400">{icon}</span>
      {label}
    </div>
  </Link>
)

export default Header