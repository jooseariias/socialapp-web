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
import { useState, useEffect } from 'react'
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
  
  // Asegurar que comments siempre sea un array
  const initialComments = Array.isArray(post?.comments) ? post.comments : []
  const [comments, setComments] = useState(initialComments)

  // Verificar si el usuario actual ya dio like al post
  useEffect(() => {
    if (currentUser && post?.likes) {
      const userLiked = post.likes.some(like => like.user?._id === currentUser._id)
      setLiked(userLiked)
    }
  }, [currentUser, post])

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

    setCommentLoading(true)
    try {
      const result = await postCreateComment(post._id, comment.trim())
      if (result.status === 200) {
        // Crear el nuevo comentario localmente
        const newComment = {
          _id: Date.now().toString(),
          user: {
            _id: currentUser._id,
            name: currentUser.name,
            username: currentUser.username,
            image: currentUser.image
          },
          text: comment.trim(),
          createdAt: new Date().toISOString(),
        }
        const updatedComments = [newComment, ...comments]
        setComments(updatedComments)
        setComment('')
        
        // Mostrar los comentarios automáticamente
        setShowComments(true)
        
        // Notificar al padre si existe el callback
        if (onCommentUpdate) {
          onCommentUpdate(post._id, updatedComments.length)
        }
      }
    } catch (error) {
      console.error('Error al comentar:', error)
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
        const updatedComments = comments.filter(comment => comment._id !== commentId)
        setComments(updatedComments)
        
        // Notificar al padre si existe el callback
        if (onCommentUpdate) {
          onCommentUpdate(post._id, updatedComments.length)
        }
      }
    } catch (error) {
      console.error('Error al eliminar comentario:', error)
    }
  }

  // Verificar si el comentario pertenece al usuario actual
  const isCurrentUserComment = (comment) => {
    return currentUser && comment.user?._id === currentUser._id
  }

  // Manejar valores por defecto
  const postImage = post?.image || ''
  const postContent = post?.content || ''
  const postUser = post?.user || {}
  const postLikes = Array.isArray(post?.likes) ? post.likes : []
  const postComments = Array.isArray(post?.comments) ? post.comments : []

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
          <span>{postComments.length + comments.length} comments</span>
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

        {/* SECCIÓN DE COMENTARIOS EN LA CARD */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {/* Input para agregar comentario */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <form onSubmit={handleAddComment} className="flex items-center gap-2">
                  {currentUser && (
                    <img
                      src={currentUser.image}
                      alt={currentUser.name}
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={currentUser ? "Añade un comentario..." : "Inicia sesión para comentar"}
                    disabled={commentLoading || !currentUser}
                    className="flex-1 bg-gradient-to-r from-slate-800/30 to-purple-900/30 border border-white/10 rounded-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50 text-sm disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!comment.trim() || commentLoading || !currentUser}
                    className={`p-2 rounded-full transition ${
                      comment.trim() && !commentLoading && currentUser
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                        : 'bg-gradient-to-r from-slate-800/50 to-purple-900/50 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {commentLoading ? '...' : <FaPaperPlane size={14} />}
                  </button>
                </form>
              </div>

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
                        className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="inline-block bg-gradient-to-r from-slate-800/30 to-purple-900/30 rounded-2xl px-4 py-2">
                          <div className="flex items-center gap-2">
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
                            {isCurrentUserComment(commentItem) && (
                              <button
                                onClick={() => handleDeleteComment(commentItem._id)}
                                className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-500 transition-opacity text-xs"
                              >
                                <FaTrash size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* MODAL - Solo se abre con click en imagen */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed min-h-screen inset-0 z-50 bg-black/80 backdrop-blur-md"
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative flex max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 backdrop-blur-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-br from-slate-800/70 to-purple-900/70 border border-white/10 p-2 text-white/60 hover:text-white hover:border-white/20 transition-all"
                >
                  <FaTimes size={20} />
                </button>

                <div className="flex w-full h-full">
                  {/* COLUMNA IZQUIERDA - Imagen grande */}
                  <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900/50 via-purple-900/50 to-slate-900/50">
                    {postImage && (
                      <img
                        src={postImage}
                        alt="post"
                        className="max-h-[85vh] w-full object-contain p-4"
                      />
                    )}
                  </div>

                  {/* COLUMNA DERECHA - Comentarios y funcionalidades */}
                  <div className="w-96 border-l border-white/10 flex flex-col bg-gradient-to-br from-slate-800/40 via-purple-900/40 to-slate-800/40">
                    {/* Header del post */}
                    <div className="p-6 border-b border-white/10">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                          <img
                            src={postUser.image}
                            alt={postUser.name}
                            className="h-14 w-14 rounded-full object-cover border-2 border-white/10"
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
                      
                      {/* Contenido del post */}
                      <div className="mt-4 text-white break-words">
                        <p>{postContent}</p>
                      </div>
                    </div>

                    {/* Sección de comentarios */}
                    <div className="flex-1 overflow-y-auto p-6">
                      {/* Comentarios */}
                      <div className="space-y-6">
                        {comments.map((commentItem) => (
                          <div key={commentItem._id || commentItem.id} className="flex gap-4 group">
                            <img
                              src={commentItem.user?.image || 'https://via.placeholder.com/32'}
                              alt={commentItem.user?.name || 'Usuario'}
                              className="h-10 w-10 rounded-full object-cover border border-white/10 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2">
                                <span className="font-semibold text-white text-sm flex-shrink-0">
                                  {commentItem.user?.username || 'usuario'}
                                </span>
                                <span className="text-white/70 text-sm break-words">
                                  {commentItem.text}
                                </span>
                              </div>
                              <p className="text-xs text-white/50 mt-1">
                                {formatDate(commentItem.createdAt)}
                              </p>
                            </div>
                            {isCurrentUserComment(commentItem) && (
                              <button
                                onClick={() => handleDeleteComment(commentItem._id)}
                                className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-500 transition-opacity ml-2 flex-shrink-0"
                              >
                                <FaTrash size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Acciones y formulario de comentario */}
                    <div className="border-t border-white/10 p-6">
                      {/* Stats */}
                      <div className="mb-4 flex justify-between text-sm text-white/60">
                        <span>{postLikes.length + (liked ? 1 : 0)} likes</span>
                        <span>{postComments.length + comments.length} comments</span>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex border-t border-white/10 pt-4">
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

                      {/* Formulario para agregar comentario */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <form onSubmit={handleAddComment} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Añade un comentario..."
                            disabled={commentLoading}
                            className="flex-1 bg-gradient-to-r from-slate-800/30 to-purple-900/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50 text-sm disabled:opacity-50"
                          />
                          <button
                            type="submit"
                            disabled={!comment.trim() || commentLoading}
                            className={`px-4 py-2 rounded-lg text-sm transition whitespace-nowrap ${
                              comment.trim() && !commentLoading
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                                : 'bg-gradient-to-r from-slate-800/50 to-purple-900/50 text-white/30 cursor-not-allowed'
                            }`}
                          >
                            {commentLoading ? '...' : 'Publicar'}
                          </button>
                        </form>
                      </div>
                    </div>
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