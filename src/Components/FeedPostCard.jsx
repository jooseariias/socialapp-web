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
import postDeleteComment from '../Services/post/deleteComment'
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

  // Estados para el modal de confirmación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

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
            block: 'nearest',
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
            block: 'nearest',
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
  const handleAddComment = async e => {
    e.preventDefault()
    if (!currentUser || !comment.trim()) return

    setCommentLoading(true)
    try {
      const result = await postCreateComment(post._id, comment.trim())

      if (result.status === 200 || result.status === 201) {
        // 1. Obtenemos el array de comentarios que viene del BACKEND (data.comments)
        const commentsFromBackend = result.data.comments

        // 2. Mapeamos esos comentarios para asegurarnos de que el usuario actual
        // tenga sus datos completos (imagen, nombre) si el backend no los envía completos
        const updatedComments = commentsFromBackend.map(c => {
          // Si el ID del usuario del comentario coincide con el logueado,
          // nos aseguramos de inyectar los datos del Store por si acaso
          if (String(c.user?._id || c.user) === String(currentUser._id)) {
            return {
              ...c,
              user: {
                _id: currentUser._id,
                name: currentUser.name,
                username: currentUser.username,
                image: currentUser.image,
              },
            }
          }
          return c
        })

        // 3. Reemplazamos TODO el estado con la lista real del servidor
        // Ordenar por fecha si es necesario (el back suele enviarlos ya ordenados)
        setComments(updatedComments.reverse()) // .reverse() solo si quieres el más nuevo arriba

        setComment('')
        if (!showComments) setShowComments(true)

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
  // Función para abrir el modal de confirmación
  const handleDeleteClick = (commentOwnerId, commentId) => {
    setCommentToDelete({ commentOwnerId, commentId })
    setShowDeleteConfirm(true)
  }

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    if (!commentToDelete) return

    const { commentOwnerId, commentId } = commentToDelete
    setDeleteLoading(true)

    try {
      const result = await postDeleteComment(commentId, commentOwnerId)
      if (result.status === 200) {
        // Eliminar del estado
        setComments(prev => prev.filter(c => c._id !== commentId))
        // Cerrar modal
        setShowDeleteConfirm(false)
        setCommentToDelete(null)
      }
    } catch (error) {
      console.error('Error al eliminar comentario:', error)
      alert('Error al eliminar el comentario')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setCommentToDelete(null)
  }

  // CORREGIDO: Comparar correctamente los IDs
  const isCurrentUserComment = useCallback(
    commentUserId => {
      if (!currentUser || !commentUserId) return false
      return String(commentUserId) === String(currentUser._id || currentUser.id)
    },
    [currentUser],
  )
  const isTempComment = id => String(id).startsWith('temp_')

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
        className="w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/40 via-purple-900/40 to-slate-800/40 p-8 shadow-sm backdrop-blur-sm"
      >
        <Link to={`/AddFollow/${postUser._id}`}>
          <div className="flex justify-between">
            <div className="flex gap-4">
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

        <div className="mt-4 break-words text-white">
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
            className="mt-5 cursor-pointer overflow-hidden rounded-xl"
            onClick={() => setShowModal(true)}
          >
            <img
              src={postImage}
              alt="post"
              className="max-h-[520px] w-full object-cover transition-opacity hover:opacity-95"
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
            } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
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
        <div className="mt-4 border-t border-white/10 pt-4">
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            {currentUser && (
              <img
                src={currentUser.image}
                alt={currentUser.name}
                className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <input
                type="text"
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={currentUser ? 'Write a comment...' : 'Inicia sesión para comentar'}
                disabled={commentLoading || !currentUser}
                className="w-full border-0 bg-transparent px-0 py-2 text-sm text-white placeholder-white/50 focus:ring-0 focus:outline-none disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={!comment.trim() || commentLoading || !currentUser}
              className={`rounded-lg px-4 py-2 text-sm whitespace-nowrap transition ${
                comment.trim() && !commentLoading && currentUser
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                  : 'cursor-not-allowed bg-gradient-to-r from-slate-800/50 to-purple-900/50 text-white/30'
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
              <div className="mt-4 max-h-64 space-y-4 overflow-y-auto pr-2">
                {comments.length === 0 ? (
                  <p className="py-4 text-center text-sm text-white/50">
                    No hay comentarios aún. ¡Sé el primero!
                  </p>
                ) : (
                  comments.map(commentItem => (
                    <div key={commentItem._id} className="group flex gap-3">
                      <img src={commentItem.user?.image} className="h-8 w-8 rounded-full" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-semibold text-white">
                            {commentItem.user?.username}
                          </span>
                          <span className="text-sm break-words text-white/70">
                            {commentItem.text}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-xs text-white/50">
                            {formatDate(commentItem.createdAt)}
                          </p>

                          {/* BOTÓN DE ELIMINAR - CORREGIDO: usar commentItem.user?._id */}
                          {isCurrentUserComment(commentItem.user?._id) && (
                            <button
                              onClick={() => handleDeleteClick(post._id, commentItem._id)}
                              className="ml-2 text-white/30 transition-colors hover:text-red-500"
                              title="Eliminar mi comentario"
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

      {/* MODAL DE IMAGEN - USANDO EL MISMO ESTADO comments */}
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
                onClick={e => e.stopPropagation()}
                className="relative flex h-[95vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90"
              >
                {/* cerrar */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 z-20 rounded-full bg-black/40 p-2 text-white/70 hover:text-white"
                >
                  <FaTimes size={18} />
                </button>

                {/* IZQUIERDA - IMAGEN */}
                <div className="flex flex-1 items-center justify-center bg-black/40 p-4">
                  {postImage && (
                    <img
                      src={postImage}
                      alt="post"
                      className="max-h-full max-w-full rounded-lg object-contain"
                      onError={e => {
                        e.currentTarget.src =
                          'https://via.placeholder.com/600x600/020617/8b5cf6?text=Imagen+no+disponible'
                      }}
                    />
                  )}
                </div>

                {/* DERECHA */}
                <div className="flex w-96 flex-col border-l border-white/10">
                  {/* HEADER */}
                  <div className="flex gap-3 border-b border-white/10 p-5">
                    <img src={postUser.image} className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{postUser.name}</span>
                        <IoMdCheckmarkCircle className="text-blue-500" />
                      </div>
                      <p className="text-xs text-white/50">
                        {postUser.username} • {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* CONTENIDO */}
                  <div className="px-5 py-4 text-sm break-words text-white">{postContent}</div>

                  {/* COMENTARIOS (SCROLL REAL) */}
                  <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
                    {comments.length === 0 ? (
                      <p className="text-center text-sm text-white/40">No hay comentarios aún</p>
                    ) : (
                      comments.map(c => (
                        <div key={c._id} className="group flex gap-3">
                          <img src={c.user?.image} className="h-8 w-8 rounded-full object-cover" />
                          <div className="flex-1">
                            <p className="text-sm text-white">
                              <b>{c.user?.username}</b>{' '}
                              <span className="text-white/70">{c.text}</span>
                            </p>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-xs text-white/40">
                                {formatDate(c.createdAt)}
                              </span>
                              {isCurrentUserComment(c.user?._id) &&
                                !(
                                  <FaTrash
                                    onClick={() => handleDeleteClick(post._id, c._id)}
                                    className="cursor-pointer text-white/40 hover:text-red-500"
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
                    <div className="mb-3 flex justify-between text-sm text-white/60">
                      <span>{postLikes.length + (liked ? 1 : 0)} likes</span>
                      <span>{comments.length} comments</span>
                    </div>

                    <form onSubmit={handleAddComment} className="flex gap-2">
                      <input
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Añade un comentario..."
                        className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
                      />
                      <button
                        disabled={!comment.trim()}
                        className="rounded-lg bg-blue-600 px-4 text-white disabled:opacity-40"
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

      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR COMENTARIO */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelDelete}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
            />

            {/* Modal de confirmación */}
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 p-6 shadow-xl"
              >
                {/* Icono de advertencia */}
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                    <FaTrash className="text-2xl text-red-500" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="mb-2 text-center text-xl font-semibold text-white">
                  ¿Eliminar comentario?
                </h3>

                {/* Descripción */}
                <p className="mb-6 text-center text-white/70">
                  Esta acción no se puede deshacer. El comentario se eliminará permanentemente.
                </p>

                {/* Botones de acción */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelDelete}
                    disabled={deleteLoading}
                    className="flex-1 rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white/70 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={deleteLoading}
                    className="flex-1 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleteLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Eliminando...
                      </span>
                    ) : (
                      'Sí, eliminar'
                    )}
                  </button>
                </div>

                {/* Botón de cierre (opcional) */}
                <button
                  onClick={handleCancelDelete}
                  className="absolute top-4 right-4 text-white/40 hover:text-white"
                >
                  <FaTimes size={18} />
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default FeedPostCard
