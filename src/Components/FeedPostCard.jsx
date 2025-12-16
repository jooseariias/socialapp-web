import { motion, AnimatePresence } from 'framer-motion'
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaEllipsisH,
  FaRegEnvelope,
  FaBookmark,
  FaRegBookmark,
  FaTimes,
  FaTrash,
  FaPaperPlane,
} from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useUserStore } from '../Store/useUserStore'

import postLike from '../Services/post/postLike'
import postUnLike from '../Services/post/postUnLike'
import deleteComment from '../Services/post/deleteComment'
import postCreateComment from '../Services/post/costCreateComment'

const FeedPostCard = ({ post, onCommentUpdate }) => {
  const { user: currentUser } = useUserStore()
  const [expanded, setExpanded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)
  
  // Estado único para todos los comentarios
  const [comments, setComments] = useState(() => {
    return Array.isArray(post?.comments) ? post.comments : []
  })

  // Referencias para scroll
  const commentsEndRef = useRef(null)
  const modalCommentsEndRef = useRef(null)
  const prevCommentsLengthRef = useRef(comments.length)

  // Verificar si el usuario actual ya dio like al post
  useEffect(() => {
    if (currentUser && post?.likes) {
      const userLiked = post.likes.some(like => like.user?._id === currentUser._id)
      setLiked(userLiked)
    }
  }, [currentUser, post])

  // Scroll al final cuando se agregan NUEVOS comentarios (en card)
  useEffect(() => {
    if (showComments && comments.length > prevCommentsLengthRef.current) {
      setTimeout(() => {
        if (commentsEndRef.current) {
          commentsEndRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'nearest'
          })
        }
      }, 100)
    }
    
    prevCommentsLengthRef.current = comments.length
  }, [comments.length, showComments])

  // Scroll en modal cuando se agregan comentarios
  useEffect(() => {
    if (showModal && comments.length > prevCommentsLengthRef.current) {
      setTimeout(() => {
        if (modalCommentsEndRef.current) {
          modalCommentsEndRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'nearest'
          })
        }
      }, 100)
    }
  }, [comments.length, showModal])

  // Verificar que post existe
  if (!post) return null

  const truncate = text => {
    if (!text) return ''
    return text.length > 150 && !expanded ? text.slice(0, 150) + '...' : text
  }

  const formatDate = date => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleLike = async () => {
    if (!currentUser) {
      alert('Debes iniciar sesión para dar like')
      return
    }

    setLoading(true)
    try {
      if (liked) {
        const result = await postUnLike(post._id)
        if (result.status === 200) {
          setLiked(false)
        }
      } else {
        const result = await postLike(post._id)
        if (result.status === 200) {
          setLiked(true)
        }
      }
    } catch (error) {
      console.error('Error al dar/quitar like:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      alert('Debes iniciar sesión para comentar')
      return
    }

    if (!comment.trim()) return

    const commentText = comment.trim()
    setCommentLoading(true)
    
    try {
      // 1. Crear comentario temporal inmediatamente
      const tempComment = {
        _id: `temp_${Date.now()}`,
        user: {
          _id: currentUser._id,
          name: currentUser.name,
          username: currentUser.username,
          image: currentUser.image
        },
        text: commentText,
        createdAt: new Date().toISOString(),
      }
      
      // Agregar al estado inmediatamente (al inicio del array)
      setComments(prev => [tempComment, ...prev])
      setComment('')
      
      // Mostrar la sección de comentarios si no está visible
      if (!showComments) {
        setShowComments(true)
      }
      
      // 2. Enviar a la API
      const result = await postCreateComment(post._id, commentText)
      
      if (result.status === 200 || result.status === 201) {
        // Crear comentario final con posible ID del servidor
        const finalComment = {
          _id: result.data?._id || tempComment._id.replace('temp_', 'server_'),
          user: {
            _id: currentUser._id,
            name: currentUser.name,
            username: currentUser.username,
            image: currentUser.image
          },
          text: commentText,
          createdAt: new Date().toISOString(),
        }
        
        // Reemplazar el temporal con el final
        setComments(prev => prev.map(comment => 
          comment._id === tempComment._id ? finalComment : comment
        ))
        
        // Notificar al padre con el nuevo conteo
        if (onCommentUpdate) {
          onCommentUpdate(post._id, comments.length + 1)
        }
      }
    } catch (error) {
      console.error('Error al comentar:', error)
      // Mantener el comentario temporal aunque falle la API
    } finally {
      setCommentLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('¿Estás seguro de eliminar este comentario?')) return

    try {
      const result = await deleteComment(post._id, commentId)
      if (result.status === 200) {
        // Eliminar el comentario localmente
        setComments(prev => prev.filter(comment => comment._id !== commentId))
        
        // Notificar al padre con el nuevo conteo
        if (onCommentUpdate) {
          onCommentUpdate(post._id, comments.length)
        }
      }
    } catch (error) {
      console.error('Error al eliminar comentario:', error)
    }
  }

  // Verificar si el comentario pertenece al usuario actual
  const isCurrentUserComment = useCallback((commentItem) => {
    if (!currentUser || !commentItem?.user) return false
    return commentItem.user._id === currentUser._id
  }, [currentUser])

  // Manejar valores por defecto
  const postImage = post?.image || ''
  const postContent = post?.content || ''
  const postUser = post?.user || {}
  const postLikes = Array.isArray(post?.likes) ? post.likes : []

  return (
    <>
      {/* CARD ORIGINAL */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl w-full border border-white/10 bg-gradient-to-br from-slate-800/40 via-purple-900/40 to-slate-800/40 p-8 shadow-sm backdrop-blur-sm"
      >
        <Link to={`/AddFollow/${postUser._id}`}>
          <div className="flex justify-between ">
            <div className="flex gap-4 ">
              <img
                src={postUser.image}
                alt={postUser.name}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{postUser.name}</h3>
                  <IoMdCheckmarkCircle className="text-blue-500" />
                </div>
                <p className="text-sm text-white/50">
                  {postUser.username} • {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            <button className="text-white/40 hover:text-white">
              <FaEllipsisH />
            </button>
          </div>
        </Link>

        <div className="mt-4 text-white break-words">
          <p>{truncate(postContent)}</p>

          {postContent.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              {expanded ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>

        {/* SOLO la imagen abre el modal */}
        {postImage && (
          <div 
            className="mt-5 overflow-hidden rounded-xl cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <img
              src={postImage}
              alt="post"
              className="max-h-[520px] w-full object-cover hover:opacity-95 transition-opacity"
            />
          </div>
        )}

        <div className="mt-4 flex justify-between text-sm text-white/60">
          <span>{postLikes.length + (liked ? 1 : 0)} likes</span>
          <span>{comments.length} comments</span>
        </div>

        <div className="mt-4 flex border-t border-white/10 pt-4">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex flex-1 items-center justify-center gap-2 transition ${
              liked ? 'text-red-500' : 'text-white/60 hover:text-white'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
            {loading ? '...' : 'Like'}
          </button>

          {/* Botón Comment para mostrar/ocultar comentarios */}
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex flex-1 items-center justify-center gap-2 text-white/60 hover:text-white"
          >
            <FaRegComment />
            Comment
          </button>

          <button className="flex flex-1 items-center justify-center gap-2 text-white/60 hover:text-white">
            <FaRegEnvelope />
            Share
          </button>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`flex items-center gap-2 px-2 ${
              bookmarked ? 'text-blue-500' : 'text-white/60 hover:text-white'
            }`}
          >
            {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>

        {/* INPUT DE COMENTARIO SEPARADO - SIEMPRE VISIBLE */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            {currentUser && (
              <img
                src={currentUser.image}
                alt={currentUser.name}
                className="h-10 w-10 rounded-full object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={currentUser ? "Write a comment..." : "Inicia sesión para comentar"}
                disabled={commentLoading || !currentUser}
                className="w-full bg-transparent border-0 px-0 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-0 text-sm disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={!comment.trim() || commentLoading || !currentUser}
              className={`px-4 py-2 rounded-lg text-sm transition whitespace-nowrap ${
                comment.trim() && !commentLoading && currentUser
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                  : 'bg-gradient-to-r from-slate-800/50 to-purple-900/50 text-white/30 cursor-not-allowed'
              }`}
            >
              {commentLoading ? '...' : 'Publicar'}
            </button>
          </form>
        </div>

        {/* SECCIÓN DE COMENTARIOS EN LA CARD - ACTUALIZADA */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {/* Lista de comentarios */}
              <div className="mt-4 max-h-64 overflow-y-auto space-y-4 pr-2">
                {comments.length === 0 ? (
                  <p className="text-center text-white/50 text-sm py-4">
                    No hay comentarios aún. ¡Sé el primero!
                  </p>
                ) : (
                  comments.map((commentItem) => (
                    <div key={commentItem._id || commentItem.id} className="flex gap-3 group">
                      <img
                        src={commentItem.user?.image || 'https://via.placeholder.com/32'}
                        alt={commentItem.user?.name || 'Usuario'}
                        className="h-8 w-8 rounded-full object-cover border border-white/10 flex-shrink-0 mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-white text-sm">
                            {commentItem.user?.username || 'usuario'}
                          </span>
                          <span className="text-white/70 text-sm break-words">
                            {commentItem.text}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-white/50">
                            {formatDate(commentItem.createdAt)}
                          </p>
                          {/* Icono de borrar - SOLO para comentarios del usuario actual */}
                          {isCurrentUserComment(commentItem) && (
                            <button
                              onClick={() => handleDeleteComment(commentItem._id)}
                              className="text-white/40 hover:text-red-500 transition-colors p-1"
                              title="Eliminar comentario"
                            >
                              <FaTrash size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={commentsEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* MODAL - USANDO EL MISMO ESTADO comments */}
      <AnimatePresence>
  {showModal && (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowModal(false)}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex h-[95vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90"
        >
          {/* cerrar */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute right-4 top-4 z-20 rounded-full bg-black/40 p-2 text-white/70 hover:text-white"
          >
            <FaTimes size={18} />
          </button>

          {/* IZQUIERDA - IMAGEN */}
          <div className="flex-1 flex items-center justify-center bg-black/40 p-4">
            {postImage && (
              <img
                src={postImage}
                alt="post"
                className="max-h-full max-w-full object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://via.placeholder.com/600x600/020617/8b5cf6?text=Imagen+no+disponible'
                }}
              />
            )}
          </div>

          {/* DERECHA */}
          <div className="w-96 flex flex-col border-l border-white/10">

            {/* HEADER */}
            <div className="p-5 border-b border-white/10 flex gap-3">
              <img
                src={postUser.image}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {postUser.name}
                  </span>
                  <IoMdCheckmarkCircle className="text-blue-500" />
                </div>
                <p className="text-xs text-white/50">
                  {postUser.username} • {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            {/* CONTENIDO */}
            <div className="px-5 py-4 text-white text-sm break-words">
              {postContent}
            </div>

            {/* COMENTARIOS (SCROLL REAL) */}
            <div className="flex-1 overflow-y-auto px-5 space-y-4 pb-4">
              {comments.length === 0 ? (
                <p className="text-center text-white/40 text-sm">
                  No hay comentarios aún
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="flex gap-3 group">
                    <img
                      src={c.user?.image}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        <b>{c.user?.username}</b>{' '}
                        <span className="text-white/70">{c.text}</span>
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-white/40">
                          {formatDate(c.createdAt)}
                        </span>
                        {isCurrentUserComment(c) && (
                          <FaTrash
                            onClick={() => handleDeleteComment(c._id)}
                            className="text-white/40 hover:text-red-500 cursor-pointer"
                            size={12}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ACCIONES + INPUT */}
            <div className="border-t border-white/10 p-5">
              <div className="flex justify-between text-sm text-white/60 mb-3">
                <span>{postLikes.length + (liked ? 1 : 0)} likes</span>
                <span>{comments.length} comments</span>
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Añade un comentario..."
                  className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
                />
                <button
                  disabled={!comment.trim()}
                  className="px-4 rounded-lg bg-blue-600 text-white disabled:opacity-40"
                >
                  Publicar
                </button>
              </form>
            </div>

          </div>
        </motion.div>
      </div>
    </>
  )}
</AnimatePresence>

    </>
  )
}

export default FeedPostCard