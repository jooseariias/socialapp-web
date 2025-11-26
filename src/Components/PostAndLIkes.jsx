import { motion } from 'framer-motion'
import { FaRegImage, FaRegHeart, FaHeart, FaRegComment, FaEllipsisH, FaTrash } from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import getPostUser from '../Services/getPostUser'
import { useState, useEffect } from 'react'
import postLike from '../Services/post/postLike'
import postUnLike from '../Services/post/postUnLike'
import postCreateComment from '../Services/post/costCreateComment'
import postDeleteComment from '../Services/post/deleteComment'
import { useUserStore } from '../Store/useUserStore'

export default function PostAndLikes({ activeTab, setActiveTab }) {
  const [postUser, setPostUser] = useState(null)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [comments, setComments] = useState({})
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(null)
  const [expandedPosts, setExpandedPosts] = useState(new Set())
  const [loading, setLoading] = useState({})
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    postId: null,
    commentId: null,
    commentText: '',
  })
  const { user } = useUserStore()

  const currentUserId = user?.id

  useEffect(() => {
    const getPostUserData = async () => {
      const result = await getPostUser()
      console.log('result', result)
      if (result.status >= 400) {
        throw new Error(result.error || 'Error al obtener el post')
      }
      setPostUser(result.data)

      // Inicializar likedPosts con los posts que ya tienen likes
      const initialLikedPosts = new Set()
      result.data.forEach(post => {
        if (post.likes && post.likes.length > 0) {
          initialLikedPosts.add(post._id)
        }
      })
      setLikedPosts(initialLikedPosts)

      // Inicializar comentarios existentes del API
      const initialComments = {}
      result.data.forEach(post => {
        if (post.comments && post.comments.length > 0) {
          // Mapear los comentarios del API al formato que espera el componente
          initialComments[post._id] = post.comments.map(comment => ({
            _id: comment._id,
            text: comment.text,
            user: comment.user.name, // Usar el nombre del usuario
            userId: comment.user._id, // Guardar el ID del usuario que creó el comentario
            createdAt: comment.createdAt,
            timestamp: new Date(comment.createdAt).toLocaleTimeString(),
          }))
        }
      })
      setComments(initialComments)
    }
    getPostUserData()
  }, [])

  const handleLike = async postId => {
    const wasLiked = likedPosts.has(postId)
    setLikedPosts(prev => {
      const newLiked = new Set(prev)
      if (wasLiked) {
        newLiked.delete(postId)
      } else {
        newLiked.add(postId)
      }
      return newLiked
    })

    try {
      setLoading(prev => ({ ...prev, [postId]: true }))
      if (wasLiked) {
        await postUnLike(postId)
      } else {
        await postLike(postId)
      }
    } catch (error) {
      console.error('Error al dar like:', error)
      // Revertir en caso de error
      setLikedPosts(prev => {
        const newLiked = new Set(prev)
        if (wasLiked) {
          newLiked.add(postId)
        } else {
          newLiked.delete(postId)
        }
        return newLiked
      })
    } finally {
      setLoading(prev => ({ ...prev, [postId]: false }))
    }
  }

  const handleAddComment = async postId => {
    if (!newComment.trim()) return

    const tempComment = {
      id: Date.now(),
      text: newComment,
      user: 'Tú',
      userId: currentUserId, // Asignar el ID del usuario actual
      timestamp: new Date().toLocaleTimeString(),
      _id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    // Agregar comentario temporalmente
    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), tempComment],
    }))

    const commentText = newComment
    setNewComment('')

    try {
      setLoading(prev => ({ ...prev, [`comment-${postId}`]: true }))
      const result = await postCreateComment(postId, commentText)

      if (result.status >= 400) {
        throw new Error(result.error || 'Error al comentar')
      }

      // Si la API devuelve el comentario creado, actualizamos con los datos reales
      if (result.data) {
        setComments(prev => ({
          ...prev,
          [postId]: (prev[postId] || []).map(comment =>
            comment.id === tempComment.id
              ? {
                  _id: result.data._id,
                  text: result.data.text,
                  user: result.data.user?.name || 'Tú',
                  userId: result.data.user?._id || currentUserId,
                  createdAt: result.data.createdAt,
                  timestamp: new Date(result.data.createdAt).toLocaleTimeString(),
                }
              : comment,
          ),
        }))
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error)
      // Remover comentario temporal en caso de error
      setComments(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(comment => comment.id !== tempComment.id),
      }))
    } finally {
      setLoading(prev => ({ ...prev, [`comment-${postId}`]: false }))
    }
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
    setDeleteModal({ show: false, postId: null, commentId: null, commentText: '' })
  }

  const handleDeleteComment = async () => {
    const { postId, commentId } = deleteModal

    try {
      setLoading(prev => ({ ...prev, [`delete-${commentId}`]: true }))
      await postDeleteComment(postId, commentId)

      // Remover comentario del estado local
      setComments(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(comment => comment._id !== commentId),
      }))

      closeDeleteModal()
    } catch (error) {
      console.error('Error al eliminar comentario:', error)
    } finally {
      setLoading(prev => ({ ...prev, [`delete-${commentId}`]: false }))
    }
  }

  const toggleComments = postId => {
    setShowComments(showComments === postId ? null : postId)
  }

  const toggleExpand = postId => {
    setExpandedPosts(prev => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(postId)) {
        newExpanded.delete(postId)
      } else {
        newExpanded.add(postId)
      }
      return newExpanded
    })
  }

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Función para truncar texto largo
  const truncateText = (text, postId, maxLength = 150) => {
    if (expandedPosts.has(postId) || text.length <= maxLength) {
      return text
    }
    return text.slice(0, maxLength) + '...'
  }

  // Función para verificar si el texto necesita truncamiento
  const needsTruncation = (text, maxLength = 150) => {
    return text.length > maxLength
  }

  // Contar likes reales (del API + estado local)
  const getLikeCount = post => {
    const baseLikes = post.likes?.length || 0
    const localLike = likedPosts.has(post._id) ? 1 : 0
    // Si el post ya estaba liked, no sumamos duplicado
    const wasAlreadyLiked = post.likes && post.likes.length > 0
    return wasAlreadyLiked ? Math.max(baseLikes, localLike) : baseLikes + localLike
  }

  // Verificar si el usuario puede borrar el comentario (dueño del comentario o del post)
  const canDeleteComment = (comment, post) => {
    // El usuario puede borrar si:
    // 1. Es el dueño del comentario (comment.userId === currentUserId)
    // 2. O es el dueño del post (post.user._id === currentUserId)
    return comment.userId === currentUserId || post.user._id === currentUserId
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
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
            className="mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur-sm"
          >
            <h3 className="mb-4 text-xl font-semibold text-white">Eliminar comentario</h3>
            <p className="mb-6 text-white/80">
              ¿Estás seguro de que quieres eliminar este comentario?
              <br />
              <span className="mt-2 block text-sm text-white/60">"{deleteModal.commentText}"</span>
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
                  isActive ? 'bg-blue-500 text-white shadow-md' : 'text-white/60 hover:text-white'
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

      {/* Posts */}
      {activeTab === 'Posts' && postUser && (
        <div className="space-y-6">
          {postUser.map(post => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur-sm"
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
                      <IoMdCheckmarkCircle className="text-blue-500" />
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-white/60">
                      <span>Follower</span>
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

                {/* Imagen del post (si existe) */}
                {post.image && (
                  <div className="mt-4 overflow-hidden rounded-xl">
                    <img
                      src={post.image}
                      alt="Post content"
                      className="h-auto max-h-96 w-full object-cover"
                    />
                  </div>
                )}

                {/* Contadores de interacciones */}
                <div className="mt-4 flex items-center justify-between text-sm text-white/60">
                  <div className="flex items-center space-x-4">
                    <span>{getLikeCount(post)} likes</span>
                    <span
                      className="cursor-pointer transition-colors hover:text-blue-400"
                      onClick={() => toggleComments(post._id)}
                    >
                      View all {comments[post._id]?.length || 0} comments
                    </span>
                  </div>
                  <span className="text-white/40">{formatDate(post.createdAt)}</span>
                </div>

                {/* Acciones del post */}
                <div className="mt-3 flex space-x-6 border-t border-white/10 pt-3">
                  <button
                    onClick={() => handleLike(post._id)}
                    disabled={loading[post._id]}
                    className={`flex items-center gap-2 transition-colors ${
                      likedPosts.has(post._id) ? 'text-red-500' : 'text-white/60 hover:text-white'
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
                    className="flex items-center gap-2 text-white/60 transition-colors hover:text-white"
                  >
                    <FaRegComment />
                    <span>Comment</span>
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
                            <span className="text-sm font-semibold text-white">{comment.user}</span>
                            <span className="text-xs text-white/40">
                              {comment.timestamp || formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-white/80">{comment.text}</p>
                        </div>
                        {canDeleteComment(comment, post) && (
                          <button
                            onClick={() => openDeleteModal(post._id, comment._id, comment.text)}
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
      )}

      {/* Vista de Likes */}
      {activeTab === 'Likes' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
          <FaRegHeart className="mx-auto mb-4 text-4xl text-white/40" />
          <h3 className="mb-2 text-xl font-semibold text-white">Posts que te gustan</h3>
          <p className="text-white/60">Los posts que des like aparecerán aquí</p>
        </motion.div>
      )}
    </div>
  )
}
