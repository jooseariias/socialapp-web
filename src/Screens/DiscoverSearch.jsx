import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaSearch,
  FaBell,
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
  FaEllipsisH,
  FaPlay,
} from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'

const DiscoverPage = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set())
  const [showComments, setShowComments] = useState(null)
  const [newComment, setNewComment] = useState('')

  // Datos de ejemplo para personas trending
  const trendingPeople = [
    {
      id: 1,
      name: 'alicia_k',
      username: '@alicia_k',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC-u4tVh6ii9Q25R0IvUeh-XzE0TDHb0UUq06MrlmSIfOHHMRa8QSZ5dNJ6CiVR0z9SNC6QaeRfWX-dLnphcC3J-1KJsAABErxJ1iPFmUIgF5DSVemXwwrxKb4Jalw2Mi4e8KzHUHsLHnyqPC9G2EhWxc1TvQ_Rg9nO8csPhJ5enXDdhTozQnFRqwFWAu7-9EqTYAVYNWxpvs-UZZslgiUmEvZLK-tithl6nV7V3zNx5KC7f3_WkhgHGSZ1PTNhbJCMPi0UdZ1O4-Y',
      verified: true,
      followers: '1.2M',
    },
    {
      id: 2,
      name: 'john_legendary',
      username: '@john_legendary',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDl-JRFYy75C8YrrmwqzlmtBi-vBu4PXszgr4I-PKwuQjltuJK7KaOSj4nv8pT_OMixr3DvdWhM3WtFK-bRkgLDiZ98gftQDPHB7nCqpglduRyh7IwoqEPCvc_gG51Uk96bK7dauX7gufmkA1Wsb4FcRsHsTPBhVrjWCSU__BxwFzUF6ykmwlnDT18_ucXplKNnrI13J5OTs4pIY8G-x36MlPQE7TAeA2f9w-_oLemYrc8lcNOlgaItYd5DdZXL0VRK4bX-1iHxO90',
      verified: true,
      followers: '890K',
    },
    {
      id: 3,
      name: 'travel_bug',
      username: '@travel_bug',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuANdwIyqWs1xFg147o6ZoKMJOYRNPkdxxG2F86saqPV5ODFLjuSjL8-UgLoI86_QskCsoBArjLprXPqv_5AmvIm_S5W9aXu8uRMW4yOh45bX2Q8Dl0nTmY4xRp-eXt-2RkE2dg_NwishihHVBqbEKX0FiXvU94zGlj0dQSrJoiLJi8Xwt48JxQLgaUua7WjAwNNDdOy1iXGetPglXiNJVlUdpWshRKE-MS_npLvMjr4Rz5c3pBLihGvuiJj161OXnwfKoeu9OdBF6Y',
      verified: false,
      followers: '456K',
    },
    {
      id: 4,
      name: 'cat_lover',
      username: '@cat_lover',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA8P5IUVVddwEJtOjhudUU3ng10hvF3FFb-0z2bNcXiIQJJHd8BI5tDuQm0eJa5S0V-GEjMvzhbUOLBRzzsFrtXSC3lGSwghsI7sLkfwL40yRIt6CafNuE7cNOhadKNFkL5OmNaf8nOZ6l2-ZmkkJFgk16ndDs0lwMohthnKgakGwGeLDd5LbcY7-dPZ-gyRLp593FOAI5eMTUxFwMws8zRk5H3NJG5suc7Q3d83fXo313kfTNurYx7cLfIxEuv7AXFqYyKAFNHaRs',
      verified: false,
      followers: '234K',
    },
    {
      id: 5,
      name: 'mountain_man',
      username: '@mountain_man',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuABw7GUyYdHCbX5J0gUBcrRdX-zqGdtEBBWidqksBXXTxK9Ap9kOIAvQk4Lww5e1lbD6q5zaiclBnjrax3LO1MH9vluBFG_5-YY2aXjDyMgNvdQVkJKOTWde0GR1xSKWzlLJbZPCUAMF2NzDtQGGoaPMP56rPOpz0l73357CJcZjbzNVI9t3Lqksz3lhz0kHNCq4wY9p7SicdMqQnrPA68BmlXu3Yzap0vCTqzV0kLA2nHpHTSt0Eq3SyXKsZuGjvkK8HRC48H7zlg',
      verified: true,
      followers: '567K',
    },
    {
      id: 6,
      name: 'sunset_chaser',
      username: '@sunset_chaser',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBBszYNxaizh0qmIKtkowMb4F8SuQD-pKX8H_kkaHExqGPNHSnXE4awNVkanmXYDPYNqjAbWXFFsXExrsBBhfv_xmn0HNw4ocVjJaH24n_cbwocysYxNK_AFfRAr2LA3B7mOh-A8OhV_-cfDELpNOqQQ9FpcunJ3NE7AO1UzOmHXntP6HETCYOk4MGXXWIxmKSTxkT8KLPTxZZi_JpfMIspCcU4dg4mp4olpsH_zK4UFKb8vVP238GL-Ovu6Z4Zj9caX9w5PdKWFsI',
      verified: true,
      followers: '345K',
    },
  ]

  // Datos de ejemplo para posts - algunos con texto, otros sin
  const popularPosts = [
    {
      id: 1,
      user: {
        name: 'Aria Montgomery',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDtL42mTN2b0jw_4ae1rC9eOArlZfX8gEljYMagOjanVt7BTvbDfVee03CDfKjPILema5eiEXnLAds2BZ1Voliuan31_6YxAfW-7ajpT9SKYawYIyBNj4vlbb3CKlDFVaCQD7oLQGBt7_tSZD3dbPYvclCiJ9LqEpdbj7YfC0zLRl7HtGUoxG4wbT0iSWfOdzH1fD15IX_ZaGDvfpuyXIO98v785IqAevrsOtvAKXQcLBBfoG0V2icTxyGFbyxNux3V3V8Sf5InfIs',
        verified: true,
      },
      content:
        'Explorando nuevos horizontes y capturando momentos únicos con mi cámara. La fotografía es mi pasión y mi forma de conectar con el mundo.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCXfk4ZLT2fdv2WFg_XoG7QO1fxGO2CFU-nc9KdYQDuW077B7mB-YgpKk_IRMXWo8lTJv-MnHRSr78ZSitestHCNyerjw2Y3VXk6O52yVJ1tAyK9k4Y2GHGBr-XX4a-pPRb97pz5acUIvGyuoMG_zhpP-e16DC6__r7D5LvKqn3IqfT2nhM0Cz6lT38Xnrp4xE5_fIHge209knEpMQGUyCvDa7HM_I_gE6nSXgz9jrMhfSR6O3Buo_XeNPDsVjTMOwv9tnHaFqkPhI',
      likes: 2100,
      comments: 45,
      shares: 12,
      createdAt: new Date('2024-01-10T14:30:00Z'),
    },
    {
      id: 2,
      user: {
        name: 'Leo Valdez',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCrkpscVYCylSF9VKuEkyaPXbqph6bMKlReTwa4u325kCxnwMdxzMEb5YJIMjHMgQOfw7drXnNTBKjlQ3IDij-OSAucop8lwgqmir1HGcabvQt6Ac51RYcEfgr98iwe0H5rx8uhh-P_x7HAj2NregOhNvqixzrfvTwQThXwRxhtuJkp9fb4is5TsXOKxLbOH-VO_aX4E80lKfyXsFRrT6zjxmFKb9xdQ8ut_K-7l-9k8SaRehZJvXKoWXN-LrSZ4Z78eWqoyeCVydU',
        verified: true,
      },
      content: '',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC3ISsDbklj7a6vkzV6_fBi6jpBUYxi72_6cB9elS6Avrz4bAkHNcoIkveL8cVjklTHGStUtjDkxWQDJgJYKZkfj_KNR54OdgzxVu6KBnXopTDIwjrEe13qRL23pyGsfKDnmaR26YqPZmTos2XXObTX2GF3_Cp5XoYT-XUxpIhQF3WMcUSjphUYJVuKB0-Qpw1F8t3fJ8uO5bAo0uZTNSur7ZKUAERbWZc55Kf8H3iy90zZyZMNo70CZRUpy9m05FHKEVce-9DY6qg',
      likes: 1800,
      comments: 23,
      shares: 8,
      createdAt: new Date('2024-01-09T09:15:00Z'),
    },
    {
      id: 3,
      user: {
        name: 'Emma Watson',
        image:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true,
      },
      content: 'Noche de estreno en el cine más icónico de la ciudad.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCQgJ1s6dpOonNZLc9b06N_riuZk4qbNniSDCqLxSCWcjsdSlzAuLztV3G-wqABQDCM4gOSA-nmKaJoY6Jfbh6xzAfR3DFotzNipOhrhO93svsz5U72j4-pzFVZYqHtxcEYEMIsxPUWCV3XVrmWWw9W8bEPQerBiO5fvr_wgoIIWtld3Qw-xWXgrBp-lEacQYiWbukgVPK-wswkgkNnh67zi6EgyDYfyjCUOtXP25v_ZtSnUMYMvnTeQiJ9vtVtzIBKoiNSWSp1Uyw',
      likes: 5300,
      comments: 189,
      shares: 45,
      createdAt: new Date('2024-01-08T20:45:00Z'),
    },
    {
      id: 4,
      user: {
        name: 'Chris Evans',
        image:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        verified: true,
      },
      content: '',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDe3GQpHTgQIqN53Qecv1T4U9jswVmEk5z16-mgwKycCF92xiwHBGNOUaB747psfOd70jWzzJyVOu0xmXJ-7BVvdPzunjHBNgAutnl3R5FSf2EaWLiX7WApD8f_933S0NG_o-zjZ9WpJuBDizk5Rd0YY6Lr8ZtX0XMXwr904aGU-fYdx-ul4Tqsbjwi9ygdj6UI05_ZbPXldgicSW3_JuLa8tziJe3uAi70WAXlrTKPLIae4IAeBthXH6MR4ZMlzwwPTGhihNNksPE',
      likes: 3200,
      comments: 67,
      shares: 15,
      createdAt: new Date('2024-01-07T16:20:00Z'),
      isVideo: true,
    },
  ]

  const filters = ['All', 'People', 'Posts']

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

  const formatDate = date => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getLikeCount = post => {
    const baseLikes = post.likes || 0
    const userLiked = likedPosts.has(post.id)
    return userLiked ? baseLikes + 1 : baseLikes
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-4">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center pb-2">
            <div className="w-12 flex-shrink-0"></div>
            <h2 className="flex-1 text-center text-lg leading-tight font-bold tracking-[-0.015em] text-white">
              Discover
            </h2>
            <div className="flex w-12 items-center justify-end">
              <button className="flex h-12 w-12 items-center justify-center rounded-lg bg-transparent text-white transition-colors hover:bg-white/10">
                <FaBell className="text-xl" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="py-3">
            <div className="flex h-12 w-full items-stretch rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-center pl-4 text-white/60">
                <FaSearch />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for people or posts"
                className="flex-1 border-none bg-transparent px-4 text-base text-white placeholder-white/60 focus:outline-none"
              />
            </div>
          </div>

          {/* Segmented Buttons */}
          <div className="py-3">
            <div className="flex h-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur-sm">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex h-full flex-1 items-center justify-center rounded-lg px-2 text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span className="truncate">{filter}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-8">
        <div className="mx-auto max-w-6xl px-6">
          {/* Trending People Section */}
          {activeFilter !== 'Posts' && (
            <>
              <h2 className="pt-5 pb-3 text-xl leading-tight font-bold tracking-[-0.015em] text-white">
                Trending People
              </h2>

              {/* Users Grid */}
              <div className="grid grid-cols-2 gap-4 py-3 md:grid-cols-3 lg:grid-cols-6">
                {trendingPeople.map(person => (
                  <motion.div
                    key={person.id}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
                  >
                    <div className="relative">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="h-20 w-20 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900"
                      />
                      {person.verified && (
                        <div className="absolute -right-1 -bottom-1">
                          <IoMdCheckmarkCircle className="rounded-full bg-white text-lg text-blue-500" />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="truncate text-sm font-medium text-white">{person.name}</p>
                      <p className="truncate text-xs text-white/60">{person.followers} followers</p>
                    </div>
                    <button className="w-full rounded-lg bg-blue-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-600">
                      Follow
                    </button>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Popular Posts Section */}
          {activeFilter !== 'People' && (
            <>
              <h2 className="pt-5 pb-3 text-xl leading-tight font-bold tracking-[-0.015em] text-white">
                Popular Posts
              </h2>

              {/* Posts Grid */}
              <div className="grid grid-cols-1 gap-6 py-3 lg:grid-cols-2">
                {popularPosts.map(post => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm"
                  >
                    {/* Header del post */}
                    <div className="flex items-start justify-between p-6 pb-4">
                      <div className="flex items-start space-x-3">
                        <img
                          src={post.user.image}
                          alt={post.user.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-white">{post.user.name}</h3>
                            {post.user.verified && (
                              <IoMdCheckmarkCircle className="text-blue-500" />
                            )}
                          </div>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-white/60">
                            <span>Follower</span>
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
                        {post.isVideo ? (
                          <div
                            className="relative aspect-[9/16] w-full bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${post.image})` }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white">
                                <FaPlay className="text-xl" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={post.image}
                            alt="Post content"
                            className="h-auto w-full object-cover"
                          />
                        )}
                      </div>
                    )}

                    {/* Contadores de interacciones */}
                    <div className="flex items-center justify-between p-6 pt-4 text-sm text-white/60">
                      <div className="flex items-center space-x-4">
                        <span>{getLikeCount(post).toLocaleString()} likes</span>
                        <span
                          className="cursor-pointer transition-colors hover:text-blue-400"
                          onClick={() => toggleComments(post.id)}
                        >
                          View all {post.comments} comments
                        </span>
                      </div>
                      <span className="text-white/40">{post.shares} shares</span>
                    </div>

                    {/* Acciones del post */}
                    <div className="flex space-x-6 border-t border-white/10 p-6 pt-3">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex flex-1 items-center justify-center gap-2 transition-colors ${
                          likedPosts.has(post.id)
                            ? 'text-red-500'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {likedPosts.has(post.id) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                        <span>Like</span>
                      </button>

                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex flex-1 items-center justify-center gap-2 text-white/60 transition-colors hover:text-white"
                      >
                        <FaRegComment />
                        <span>Comment</span>
                      </button>

                      <button className="flex flex-1 items-center justify-center gap-2 text-white/60 transition-colors hover:text-white">
                        <span>Share</span>
                      </button>

                      <button
                        onClick={() => handleBookmark(post.id)}
                        className={`flex items-center gap-2 transition-colors ${
                          bookmarkedPosts.has(post.id)
                            ? 'text-blue-500'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {bookmarkedPosts.has(post.id) ? (
                          <FaBookmark className="text-blue-500" />
                        ) : (
                          <FaRegBookmark />
                        )}
                      </button>
                    </div>

                    {/* Sección de comentarios */}
                    {showComments === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="border-t border-white/10 p-6 pt-4"
                      >
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          />
                          <button
                            onClick={() => setNewComment('')}
                            disabled={!newComment.trim()}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Post
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default DiscoverPage
