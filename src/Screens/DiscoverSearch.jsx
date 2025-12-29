import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  FaSearch,
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
  FaEllipsisH,
  FaUser,
  FaImage,
  FaFire,
  FaUsers,
  FaStar,
} from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../Components/Header'

const DiscoverPage = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [inputValue, setInputValue] = useState('') // Valor temporal del input
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set())
  const [showComments, setShowComments] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [discoverData, setDiscoverData] = useState({
    users: [],
    posts: [],
    totals: { users: 0, posts: 0 },
    hasMore: { users: false, posts: false },
    page: 1
  })
  const [searchResults, setSearchResults] = useState({
    users: [],
    posts: [],
    totals: { users: 0, posts: 0 },
    hasMore: { users: false, posts: false }
  })
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isDiscoverMode, setIsDiscoverMode] = useState(true) // true = discover, false = search
  
  const location = useLocation()
  const navigate = useNavigate()
  const limit = 10

  // Parsear query params de la URL al cargar
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q') || ''
    const type = params.get('type') || 'all'
    const pageParam = params.get('page') || '1'
    
    setSearchQuery(q)
    setInputValue(q)
    setActiveFilter(type)
    setPage(parseInt(pageParam))
    setIsDiscoverMode(!q) // Si no hay query, estamos en modo discover
  }, [location.search])

  // Función para cargar datos de discover
  const loadDiscoverData = useCallback(async (pageNum = 1, reset = false) => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/discover?page=${pageNum}&limit=${limit}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      const data = result.data || result
      
      // Asegurarse de que los datos tienen la estructura correcta
      const formattedData = {
        users: data.users || [],
        posts: data.posts || [],
        totals: data.totals || { users: data.users?.length || 0, posts: data.posts?.length || 0 },
        hasMore: data.hasMore || { users: false, posts: false },
        page: data.page || pageNum
      }
      
      if (reset) {
        setDiscoverData(formattedData)
      } else {
        setDiscoverData(prev => ({
          ...formattedData,
          users: [...prev.users, ...(formattedData.users || [])],
          posts: [...prev.posts, ...(formattedData.posts || [])]
        }))
      }
      
      setHasMore(formattedData.hasMore.users || formattedData.hasMore.posts)
    } catch (error) {
      console.error('Error loading discover data:', error)
    } finally {
      setLoading(false)
    }
  }, [limit])

  // Función para realizar la búsqueda
  const performSearch = useCallback(async (query, type, pageNum, reset = false) => {
    if (!query.trim()) {
      setSearchResults({
        users: [],
        posts: [],
        totals: { users: 0, posts: 0 },
        hasMore: { users: false, posts: false }
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:8000/api//search?q=${encodeURIComponent(query)}&type=${type}&page=${pageNum}&limit=${limit}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      const data = result.data || result
      
      const formattedData = {
        users: data.users || [],
        posts: data.posts || [],
        totals: data.totals || { users: data.users?.length || 0, posts: data.posts?.length || 0 },
        hasMore: data.hasMore || { users: false, posts: false }
      }
      
      if (reset) {
        setSearchResults(formattedData)
      } else {
        setSearchResults(prev => ({
          ...formattedData,
          users: [...prev.users, ...(formattedData.users || [])],
          posts: [...prev.posts, ...(formattedData.posts || [])]
        }))
      }
      
      setHasMore(formattedData.hasMore.users || formattedData.hasMore.posts)
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setLoading(false)
    }
  }, [limit])

  // Cargar datos iniciales (discover) o búsqueda
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q') || ''
    const type = params.get('type') || 'all'
    const pageParam = params.get('page') || '1'
    
    if (q) {
      // Modo búsqueda
      performSearch(q, type, parseInt(pageParam), true)
      setIsDiscoverMode(false)
    } else {
      // Modo discover
      loadDiscoverData(parseInt(pageParam), true)
      setIsDiscoverMode(true)
    }
  }, [location.search, performSearch, loadDiscoverData])

  // Manejar cambio en el input
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  // Manejar búsqueda con botón o Enter
  const handleSearch = (e) => {
    if (e) e.preventDefault()
    
    const query = inputValue.trim()
    if (query === searchQuery && query !== '') {
      // Si es la misma búsqueda, recargar primera página
      const params = new URLSearchParams()
      params.set('q', query)
      params.set('type', activeFilter)
      params.set('page', '1')
      navigate(`/discover?${params.toString()}`, { replace: true })
      return
    }
    
    // Actualizar URL con nueva búsqueda
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    params.set('type', activeFilter)
    params.set('page', '1')
    
    navigate(`/discover?${params.toString()}`, { replace: true })
  }

  // Manejar tecla Enter en el input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Manejar cambio de filtro
  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    params.set('type', filter)
    params.set('page', '1')
    
    navigate(`/discover?${params.toString()}`, { replace: true })
  }

  // Cargar más resultados
  const loadMore = () => {
    if (loading || !hasMore) return
    
    const nextPage = page + 1
    setPage(nextPage)
    
    const params = new URLSearchParams()
    if (searchQuery) {
      params.set('q', searchQuery)
      params.set('type', activeFilter)
    }
    params.set('page', nextPage.toString())
    
    navigate(`/discover?${params.toString()}`, { replace: true })
  }

  // Limpiar búsqueda y volver a discover
  const clearSearch = () => {
    setInputValue('')
    navigate('/discover', { replace: true })
  }

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'users', label: 'People' },
    { key: 'posts', label: 'Posts' }
  ]

  const handleLike = postId => {
    const newLiked = new Set(likedPosts)
    if (newLiked.has(postId)) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }
    setLikedPosts(newLiked)
  }

  const handleBookmark = postId => {
    const newBookmarked = new Set(bookmarkedPosts)
    if (newBookmarked.has(postId)) {
      newBookmarked.delete(postId)
    } else {
      newBookmarked.add(postId)
    }
    setBookmarkedPosts(newBookmarked)
  }

  const toggleComments = postId => {
    setShowComments(showComments === postId ? null : postId)
  }

  const formatDate = dateString => {
    if (!dateString) return 'Just now'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return 'Just now'
    }
  }

  const getLikeCount = post => {
    const baseLikes = post.likes?.length || 0
    const userLiked = likedPosts.has(post._id)
    return userLiked ? baseLikes + 1 : baseLikes
  }

  // Determinar qué datos usar según el modo
  const getCurrentData = () => {
    return isDiscoverMode ? discoverData : searchResults
  }

  // Renderizar usuarios
  const renderUsers = () => {
    const data = getCurrentData()
    const users = data.users || []
    if (users.length === 0) return null

    return (
      <>
        <h2 className="pt-5 pb-3 text-xl leading-tight font-bold tracking-[-0.015em] text-white">
          {isDiscoverMode ? (
            <div className="flex items-center gap-2">
              <FaUsers className="text-button" />
              <span>Discover People</span>
            </div>
          ) : (
            'People'
          )}
        </h2>
        <div className="grid grid-cols-2 gap-4 py-3 md:grid-cols-3 lg:grid-cols-6">
          {users.map(person => (
            <motion.div
              key={person._id}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
            >
              <div className="relative">
                <img
                  src={person.image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                  alt={person.name}
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900"
                />
              </div>
              <div className="text-center">
                <p className="truncate text-sm font-medium text-white">{person.name}</p>
                <p className="truncate text-xs text-white/60">{person.username || `@${person.name.toLowerCase().replace(/\s+/g, '')}`}</p>
                {person.city && (
                  <p className="truncate text-xs text-white/40 mt-1">{person.city}</p>
                )}
                {person.description && (
                  <p className="mt-2 text-xs text-white/50 line-clamp-2">{person.description}</p>
                )}
              </div>
              <button className="w-full rounded-lg bg-button px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-600">
                Follow
              </button>
            </motion.div>
          ))}
        </div>
      </>
    )
  }

  // Renderizar posts
  const renderPosts = () => {
    const data = getCurrentData()
    const posts = data.posts || []
    if (posts.length === 0) return null

    return (
      <>
        <h2 className="pt-5 pb-3 text-xl leading-tight font-bold tracking-[-0.015em] text-white">
          {isDiscoverMode ? (
            <div className="flex items-center gap-2">
              <FaFire className="text-orange-400" />
              <span>Trending Posts</span>
            </div>
          ) : (
            'Posts'
          )}
        </h2>
        <div className="grid grid-cols-1 gap-6 py-3 lg:grid-cols-2">
          {posts.map(post => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm"
            >
              {/* Header del post */}
              <div className="flex items-start justify-between p-6 pb-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={post.user?.image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                    alt={post.user?.name || 'User'}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white">{post.user?.name || 'Unknown User'}</h3>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-white/60">
                      <span>{post.user?.username || `@${(post.user?.name || 'user').toLowerCase().replace(/\s+/g, '')}`}</span>
                      <span>•</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <button className="rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white/60">
                  <FaEllipsisH />
                </button>
              </div>

              {/* Contenido del post - solo se muestra si existe */}
              {post.content && (
                <div className="px-6 pb-4">
                  <p className="break-words text-white">{post.content}</p>
                </div>
              )}

              {/* Media del post */}
              {post.image && (
                <div className="overflow-hidden">
                  <img
                    src={post.image}
                    alt="Post content"
                    className="h-auto w-full object-cover max-h-[500px]"
                  />
                </div>
              )}

              {/* Contadores de interacciones */}
              <div className="flex items-center justify-between p-6 pt-4 text-sm text-white/60">
                <div className="flex items-center space-x-4">
                  <span>{getLikeCount(post).toLocaleString()} likes</span>
                  <span
                    className="cursor-pointer transition-colors hover:text-blue-400"
                    onClick={() => toggleComments(post._id)}
                  >
                    View all {post.comments?.length || 0} comments
                  </span>
                </div>
              </div>

              
            
            </motion.div>
          ))}
        </div>
      </>
    )
  }

  // Renderizar estado vacío de búsqueda
  const renderEmptySearchState = () => {
    if (!isDiscoverMode && searchQuery && !loading && 
        (searchResults.users || []).length === 0 && 
        (searchResults.posts || []).length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="rounded-full bg-white/10 p-6 mb-4">
            <FaSearch className="text-4xl text-white/40" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
          <p className="text-white/60 text-center max-w-md mb-6">
            Try searching for something else or check your spelling
          </p>
          <button
            onClick={clearSearch}
            className="rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
          >
            Back to Discover
          </button>
        </div>
      )
    }
    return null
  }

  // Renderizar estado inicial (modo discover)
  const renderDiscoverState = () => {
    if (isDiscoverMode && !loading && 
        (discoverData.users || []).length === 0 && 
        (discoverData.posts || []).length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="rounded-full bg-white/10 p-6 mb-4">
            <FaStar className="text-4xl text-yellow-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Discover Amazing Content</h3>
          <p className="text-white/60 text-center max-w-md">
            Start exploring people and posts from around the world
          </p>
        </div>
      )
    }
    return null
  }

  // Renderizar contadores
  const renderCounters = () => {
    if (isDiscoverMode) {
      const users = discoverData.users || []
      const posts = discoverData.posts || []
      
      if (users.length === 0 && posts.length === 0) return null
      
      const totals = discoverData.totals || { users: users.length, posts: posts.length }
      
      return (
        <div className="flex items-center gap-6 pt-4 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <FaUsers className="text-white/40" />
            <span>{totals.users} people to discover</span>
          </div>
          
          <div className="flex items-center gap-2">
            <FaFire className="text-white/40" />
            <span>{totals.posts} trending posts</span>
          </div>
        </div>
      )
    } else {
      if (!searchQuery) return null
      
      const users = searchResults.users || []
      const posts = searchResults.posts || []
      const totals = searchResults.totals || { users: users.length, posts: posts.length }
      
      if (users.length === 0 && posts.length === 0) return null
      
      return (
        <div className="flex items-center gap-6 pt-4 text-sm text-white/60">
          {(activeFilter === 'all' || activeFilter === 'users') && users.length > 0 ? (
            <div className="flex items-center gap-2">
              <FaUser className="text-white/40" />
              <span>{totals.users} {totals.users === 1 ? 'person' : 'people'}</span>
            </div>
          ) : null}
          
          {(activeFilter === 'all' || activeFilter === 'posts') && posts.length > 0 ? (
            <div className="flex items-center gap-2">
              <FaImage className="text-white/40" />
              <span>{totals.posts} {totals.posts === 1 ? 'post' : 'posts'}</span>
            </div>
          ) : null}
        </div>
      )
    }
  }

  // Renderizar botón de limpiar búsqueda
  const renderClearSearchButton = () => {
    if (isDiscoverMode || !searchQuery) return null
    
    return (
      <div className="flex justify-center pt-4">
        <button
          onClick={clearSearch}
          className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          Clear Search
        </button>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Top App Bar */}
        <div className="sticky top-0 z-10 pt-4">
          <div className="mx-auto max-w-6xl px-6">
            {/* Search Bar */}
            <div className="py-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex h-12 flex-1 items-stretch rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
                  <div className="flex items-center justify-center pl-4 text-white/60">
                    <FaSearch />
                  </div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Search for people or posts"
                    className="flex-1 border-none bg-transparent px-4 text-base text-white placeholder-white/60 focus:outline-none"
                  />
                  {inputValue && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="px-4 text-white/40 hover:text-white/60"
                    >
                      ×
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || !inputValue.trim()}
                  className="flex h-12 items-center justify-center rounded-xl bg-blue-500 px-6 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  ) : (
                    'Search'
                  )}
                </button>
              </form>
            </div>

            {/* Segmented Buttons - solo en modo búsqueda */}
            {!isDiscoverMode && (
              <div className="py-3">
                <div className="flex h-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur-sm">
                  {filters.map(filter => (
                    <button
                      key={filter.key}
                      onClick={() => handleFilterChange(filter.key)}
                      className={`flex h-full flex-1 items-center justify-center rounded-lg px-2 text-sm font-medium transition-all duration-200 ${
                        activeFilter === filter.key
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{filter.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 pb-8">
          <div className="mx-auto max-w-6xl px-6">
            {/* Mostrar contadores */}
            {renderCounters()}

            {/* Modo Discover */}
            {isDiscoverMode && (
              <>
                {renderUsers()}
                {renderPosts()}
                {renderDiscoverState()}
              </>
            )}

            {/* Modo Búsqueda */}
            {!isDiscoverMode && (
              <>
                {(activeFilter === 'all' || activeFilter === 'users') && renderUsers()}
                {(activeFilter === 'all' || activeFilter === 'posts') && renderPosts()}
                {renderEmptySearchState()}
              </>
            )}

            {/* Loading indicator para búsqueda principal */}
            {loading && (discoverData.users || []).length === 0 && (discoverData.posts || []).length === 0 && (
              <div className="flex justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
              </div>
            )}

            {/* Botón de limpiar búsqueda */}
            {renderClearSearchButton()}

            {/* Load More button */}
            {hasMore && !loading && (
              <div className="flex justify-center py-8">
                <button
                  onClick={loadMore}
                  className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      Loading...
                    </div>
                  ) : (
                    `Load More ${isDiscoverMode ? 'Content' : 'Results'}`
                  )}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default DiscoverPage