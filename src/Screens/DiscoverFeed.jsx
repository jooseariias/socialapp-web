import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaEllipsisH,
  FaTrash,
  FaRegEnvelope,
  FaPlay,
  FaBookmark,
  FaRegBookmark,
} from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import Header from '../Components/Header'
import FollowRecomend from '../Components/Follow/FollowRecomend'
import CardProfile from '../Components/profile/CardProfile' 


const HomePage = () => {
  // Estados principales
  const [showComments, setShowComments] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [expandedPosts, setExpandedPosts] = useState(new Set())
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set())
  const [loading, setLoading] = useState({})
  const [deleteModal, setDeleteModal] = useState({ show: false, commentId: null, commentText: '' })

  // Datos de ejemplo
  const [postUser, setPostUser] = useState([
    {
      _id: '1',
      user: {
        name: 'Aria Montgomery',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDtL42mTN2b0jw_4ae1rC9eOArlZfX8gEljYMagOjanVt7BTvbDfVee03CDfKjPILema5eiEXnLAds2BZ1Voliuan31_6YxAfW-7ajpT9SKYawYIyBNj4vlbb3CKlDFVaCQD7oLQGBt7_tSZD3dbPYvclCiJ9LqEpdbj7YfC0zLRl7HtGUoxG4wbT0iSWfOdzH1fD15IX_ZaGDvfpuyXIO98v785IqAevrsOtvAKXQcLBBfoG0V2icTxyGFbyxNux3V3V8Sf5InfIs',
        verified: true,
      },
      content:
        'Este es un post de ejemplo con contenido interesante sobre viajes y aventuras. Me encanta explorar nuevos lugares y compartir mis experiencias con todos ustedes. ¡El mundo está lleno de maravillas por descubrir!',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBvoucsi_4re7YCZI10DNGF-9JoA5VjRrBtKcJIwHp_39rcQoH_0_bi9ERtp-mEMtWjXbCQVhdx-S2F_afPBPr6wz1G6MqpE_R9JqV6Yl0zmwicr9dFQDBGHrUQRjoHcaDtOhHNOWP-n5Ed58cJFj_7NgW7yfSzmmq6J_b5Ayqq9l2u1Vg6zlf1ni0r1h5rI5r6lyeiDSKbfvOKeJQtm_WruZiJaNeTHUpM3aBtqJHU4M-zSudGTwEQRbyKq04lI9ODQI-Dvnz-Aq0',
      likes: 1242,
      comments: 24,
      createdAt: new Date('2024-01-15T10:30:00Z'),
      userLiked: false,
    },
    {
      _id: '2',
      user: {
        name: 'Leo Valdez',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCrkpscVYCylSF9VKuEkyaPXbqph6bMKlReTwa4u325kCxnwMdxzMEb5YJIMjHMgQOfw7drXnNTBKjlQ3IDij-OSAucop8lwgqmir1HGcabvQt6Ac51RYcEfgr98iwe0H5rx8uhh-P_x7HAj2NregOhNvqixzrfvTwQThXwRxhtuJkp9fb4is5TsXOKxLbOH-VO_aX4E80lKfyXsFRrT6zjxmFKb9xdQ8ut_K-7l-9k8SaRehZJvXKoWXN-LrSZ4Z78eWqoyeCVydU',
        verified: true,
      },
      content:
        'Disfrutando de las vistas nocturnas de la ciudad. Las luces crean un ambiente mágico que transforma completamente el paisaje urbano.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDH9FKMW2qNU0bKXkuL0V0wYs69zMbNvbFUm_ZeBKmFfbsjAZs-yAlYw64wbCScfW14fU7lvH5bnzteN9PdF6g2L5-zfnQgorTTFPIFtASw2Ii7Uivyyf2nB3VjtDn4OwgHN3UmeIXgLll31M81Oq30VGZfoFNBB9j_s7iiDCvNr2fhnMsMJMVrBYMDBKNJMh05oSz0S0soKc94upjuuFfTal6FiGrOhZ-vvcC-msJnpXkcibFcaQA4j3Y7f_WWj6o0be-I90HjJKU',
      likes: 3245,
      comments: 156,
      createdAt: new Date('2024-01-14T18:45:00Z'),
      userLiked: true,
      isVideo: true,
    },
  ])

  const [comments, setComments] = useState({
    1: [
      {
        _id: '1-1',
        user: 'María García',
        text: '¡Qué foto tan increíble!',
        createdAt: new Date('2024-01-15T11:00:00Z'),
      },
      {
        _id: '1-2',
        user: 'Carlos López',
        text: 'Me encantaría visitar ese lugar algún día',
        createdAt: new Date('2024-01-15T12:30:00Z'),
      },
    ],
    2: [
      {
        _id: '2-1',
        user: 'Ana Martínez',
        text: 'Las luces se ven espectaculares',
        createdAt: new Date('2024-01-14T19:20:00Z'),
      },
      {
        _id: '2-2',
        user: 'David Chen',
        text: '¿Qué cámara usaste para esta foto?',
        createdAt: new Date('2024-01-14T20:15:00Z'),
      },
    ],
  })



  // Funciones de utilidad
  const truncateText = (text, postId) => {
    const needsTruncation = text.length > 150
    const isExpanded = expandedPosts.has(postId)

    if (needsTruncation && !isExpanded) {
      return text.slice(0, 150) + '...'
    }
    return text
  }

  const needsTruncation = text => text.length > 150

  const toggleExpand = postId => {
    const newExpanded = new Set(expandedPosts)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedPosts(newExpanded)
  }

  const getLikeCount = post => {
    const baseLikes = post.likes || 0
    const userLiked = likedPosts.has(post._id)
    return userLiked ? baseLikes + 1 : baseLikes
  }

  const formatDate = date => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const toggleComments = postId => {
    setShowComments(showComments === postId ? null : postId)
  }

  const handleLike = async postId => {
    setLoading(prev => ({ ...prev, [postId]: true }))

    // Simular llamada API
    await new Promise(resolve => setTimeout(resolve, 500))

    const newLiked = new Set(likedPosts)
    if (newLiked.has(postId)) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }
    setLikedPosts(newLiked)

    setLoading(prev => ({ ...prev, [postId]: false }))
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

  const handleAddComment = async postId => {
    if (!newComment.trim()) return

    setLoading(prev => ({ ...prev, [`comment-${postId}`]: true }))

    // Simular llamada API
    await new Promise(resolve => setTimeout(resolve, 800))

    const newCommentObj = {
      _id: `${postId}-${Date.now()}`,
      user: 'Tú',
      text: newComment,
      createdAt: new Date(),
    }

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newCommentObj],
    }))

    setNewComment('')
    setLoading(prev => ({ ...prev, [`comment-${postId}`]: false }))
  }

  const openDeleteModal = (postId, commentId, commentText) => {
    setDeleteModal({
      show: true,
      postId,
      commentId,
      commentText,
    })
  }

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, commentId: null, commentText: '' })
  }

  const handleDeleteComment = async () => {
    if (!deleteModal.commentId) return

    setLoading(prev => ({ ...prev, [`delete-${deleteModal.commentId}`]: true }))

    // Simular llamada API
    await new Promise(resolve => setTimeout(resolve, 600))

    setComments(prev => ({
      ...prev,
      [deleteModal.postId]: prev[deleteModal.postId].filter(
        comment => comment._id !== deleteModal.commentId,
      ),
    }))

    closeDeleteModal()
    setLoading(prev => ({ ...prev, [`delete-${deleteModal.commentId}`]: false }))
  }

  const canDeleteComment = (comment, post) => {
    return comment.user === 'Tú' || post.user.name === 'Tú'
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex gap-6">
            {/* Main Content - Feed */}
            <div className="max-w-2xl flex-1">
              {/* Posts */}
              <div className="space-y-6">
                {postUser.map(post => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-6 shadow-sm backdrop-blur-sm"
                  >
                    {/* Header del post */}
                    <div className="flex items-start justify-between">
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

                    {/* Contenido del post */}
                    <div className="mt-4">
                      <div className="break-words">
                        <p className="text-white">{truncateText(post.content, post._id)}</p>

                        {/* Botón "Ver más" para textos largos */}
                        {needsTruncation(post.content) && (
                          <button
                            onClick={() => toggleExpand(post._id)}
                            className="mt-2 text-sm text-blue-400 transition-colors hover:text-blue-300"
                          >
                            {expandedPosts.has(post._id) ? 'Ver menos' : 'Ver más'}
                          </button>
                        )}
                      </div>

                      {/* Media del post */}
                      {post.image && (
                        <div className="mt-4 overflow-hidden rounded-xl">
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
                              className="h-auto max-h-96 w-full object-cover"
                            />
                          )}
                        </div>
                      )}

                      {/* Contadores de interacciones */}
                      <div className="mt-4 flex items-center justify-between text-sm text-white/60">
                        <div className="flex items-center space-x-4">
                          <span>{getLikeCount(post).toLocaleString()} likes</span>
                          <span
                            className="cursor-pointer transition-colors hover:text-blue-400"
                            onClick={() => toggleComments(post._id)}
                          >
                            View all {comments[post._id]?.length || 0} comments
                          </span>
                        </div>
                        <span className="text-white/40">{post.shares || 45} shares</span>
                      </div>

                      {/* Acciones del post */}
                      <div className="mt-3 flex space-x-6 border-t border-white/10 pt-3">
                        <button
                          onClick={() => handleLike(post._id)}
                          disabled={loading[post._id]}
                          className={`flex flex-1 items-center justify-center gap-2 transition-colors ${likedPosts.has(post._id)
                              ? 'text-red-500'
                              : 'text-white/60 hover:text-white'
                            } ${loading[post._id] ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                          {likedPosts.has(post._id) ? (
                            <FaHeart className="text-red-500" />
                          ) : (
                            <FaRegHeart />
                          )}
                          <span>{loading[post._id] ? '...' : 'Like'}</span>
                        </button>

                        <button
                          onClick={() => toggleComments(post._id)}
                          className="flex flex-1 items-center justify-center gap-2 text-white/60 transition-colors hover:text-white"
                        >
                          <FaRegComment />
                          <span>Comment</span>
                        </button>

                        <button className="flex flex-1 items-center justify-center gap-2 text-white/60 transition-colors hover:text-white">
                          <FaRegEnvelope />
                          <span>Share</span>
                        </button>

                        <button
                          onClick={() => handleBookmark(post._id)}
                          className={`flex items-center gap-2 transition-colors ${bookmarkedPosts.has(post._id)
                              ? 'text-blue-500'
                              : 'text-white/60 hover:text-white'
                            }`}
                        >
                          {bookmarkedPosts.has(post._id) ? (
                            <FaBookmark className="text-blue-500" />
                          ) : (
                            <FaRegBookmark />
                          )}
                        </button>
                      </div>

                      {/* Sección de comentarios */}
                      {showComments === post._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 border-t border-white/10 pt-4"
                        >
                          {/* Lista de comentarios */}
                          {comments[post._id]?.map(comment => (
                            <div
                              key={comment._id || comment.id}
                              className="mb-3 flex items-start justify-between space-x-3"
                            >
                              <div className="flex-1">
                                <div className="mb-1 flex items-center space-x-2">
                                  <span className="text-sm font-semibold text-white">
                                    {comment.user}
                                  </span>
                                  <span className="text-xs text-white/40">
                                    {formatDate(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-white/80">{comment.text}</p>
                              </div>
                              {canDeleteComment(comment, post) && (
                                <button
                                  onClick={() =>
                                    openDeleteModal(post._id, comment._id, comment.text)
                                  }
                                  disabled={loading[`delete-${comment._id}`]}
                                  className="ml-2 text-white/40 transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <FaTrash className="text-xs" />
                                </button>
                              )}
                            </div>
                          ))}

                          {/* Input para nuevo comentario */}
                          <div className="mt-3 flex gap-2">
                            <input
                              type="text"
                              value={newComment}
                              onChange={e => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              disabled={loading[`comment-${post._id}`]}
                              className="flex-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                              onKeyPress={e => e.key === 'Enter' && handleAddComment(post._id)}
                            />
                            <button
                              onClick={() => handleAddComment(post._id)}
                              disabled={loading[`comment-${post._id}`] || !newComment.trim()}
                              className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {loading[`comment-${post._id}`] ? '...' : 'Post'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar - Usuarios Sugeridos (sin Top Creators) */}
            <div className="hidden w-80 lg:block">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24 space-y-6"
              >
                {/* Perfil del usuario actual */}
               
                <CardProfile />
                {/* Usuarios Sugeridos */}

                <FollowRecomend />
                {/* Trending Topics */}
                <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
                  <h3 className="mb-4 font-semibold text-white">Trending Worldwide</h3>
                  <div className="space-y-3">
                    {[
                      { topic: '#Travel', posts: '45.2K' },
                      { topic: '#Photography', posts: '38.7K' },
                      { topic: '#Nature', posts: '32.1K' },
                      { topic: '#Art', posts: '28.9K' },
                    ].map((trend, index) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="text-sm font-medium text-white transition-colors group-hover:text-blue-400">
                          {trend.topic}
                        </div>
                        <div className="text-xs text-white/40">{trend.posts} posts</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Modal de confirmación para borrar comentario */}
        {deleteModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-slate-800 p-6 shadow-xl backdrop-blur-sm"
            >
              <h3 className="mb-4 text-xl font-semibold text-white">Eliminar comentario</h3>
              <p className="mb-6 text-white/80">
                ¿Estás seguro de que quieres eliminar este comentario?
                <br />
                <span className="mt-2 block text-sm text-white/60">
                  "{deleteModal.commentText}"
                </span>
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="rounded-lg bg-white/10 px-4 py-2 text-white/80 transition-colors hover:bg-white/20"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteComment}
                  disabled={loading[`delete-${deleteModal.commentId}`]}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading[`delete-${deleteModal.commentId}`] ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  )
}

export default HomePage
