import { motion, AnimatePresence } from 'framer-motion'
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaTrash,
  FaTimes,
  FaPaperPlane,
  FaEdit,
  FaCheck,
  FaExclamationTriangle,
  FaShare,
  FaTrashAlt,
} from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { useState, useEffect } from 'react'

// Servicios
import putPost from '../../Services/post/putPost'


export default function CardPostProfile(props) {
  const {
    post,
    formatDate,
    formatTime,
    togglePostMenu,
    getLikeCount,
    likedPosts,
    handleLike,
    comments,
    canDeleteComment,
    openDeleteModal,
    commentInputRefs,
    newComment,
    setNewComment,
    handleAddComment,
    truncateText,
    isPostOwner,
    handleDeletePost,
    handleDeleteComment,

  } = props

  // ESTADOS LOCALES
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Estados para edición
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content) // Lo que escribes en el textarea
  const [displayContent, setDisplayContent] = useState(post.content) // Lo que se ve en la pantalla
  const [isSaving, setIsSaving] = useState(false)

  // Si por alguna razón el post cambia desde afuera, actualizamos la vista
  useEffect(() => {
    setEditContent(post.content)
    setDisplayContent(post.content)
  }, [post.content])

  const openModal = () => setShowModal(true)
  const postComments = comments[post._id] || []
  const liked = likedPosts.has(post._id)

  // FUNCIÓN PARA GUARDAR EDICIÓN (MANEJO LOCAL 100%)
  const onSaveEdit = async () => {
    if (!editContent.trim() || editContent === displayContent) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await putPost(post._id, { content: editContent })
      setDisplayContent(editContent)
      setIsEditing(false)
    } catch (error) {
      console.error('Error al editar:', error)
      alert('No se pudo guardar la edición')
      setEditContent(displayContent)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/40 via-purple-900/40 to-slate-800/40 p-4 shadow-sm backdrop-blur-sm sm:p-6 lg:p-8"
      >
        {/* HEADER RESPONSIVE */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:gap-0">
          <div className="flex items-start gap-3 sm:items-center sm:gap-4">
            {/* Avatar */}
            <div className="relative">
              <img
                src={post.user.image}
                alt={post.user.name}
                className="h-10 w-10 flex-shrink-0 rounded-full border border-white/10 object-cover sm:h-12 sm:w-12 md:h-14 md:w-14"
              />
              <IoMdCheckmarkCircle
                className="absolute -right-1 -bottom-1 rounded-full bg-slate-900 text-blue-500"
                size={14}
              />
            </div>

            {/* User Info */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                  {post.user.name}
                </h3>
              </div>
              <div className="flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:gap-2 sm:text-sm">
                <p className="truncate text-white/50">{post.user.username || 'usuario'}</p>
                <span className="hidden text-white/30 sm:inline">•</span>
                <p className="text-white/50">{formatDate(post.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-1 sm:gap-2">
            {isPostOwner(post) && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-white/40 transition-colors hover:cursor-pointer hover:text-blue-400 sm:p-2"
                  aria-label="Edit post"
                >
                  <FaEdit size={14} className="sm:w-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1.5 text-white/40 transition-colors hover:cursor-pointer hover:text-red-500 sm:p-2"
                  aria-label="Delete post"
                >
                  <FaTrash size={12} className="sm:w-3.5" />
                </button>
              </>
            )}
            <button
              onClick={e => togglePostMenu(post._id, e)}
              className="p-1.5 text-white/40 hover:text-white sm:p-2"
              aria-label="More options"
            ></button>
          </div>
        </div>

        {/* CONTENT - Responsive */}
        <div className="mt-4 break-words text-white sm:mt-5 md:mt-6">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="focus:border-button w-full resize-none rounded-lg border border-white/20 bg-white/5 p-3 text-sm text-white focus:outline-none sm:p-4 sm:text-base"
                rows={window.innerWidth < 640 ? 2 : 3}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(displayContent)
                  }}
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-xs transition-colors hover:bg-white/20 sm:px-4 sm:py-2 sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={onSaveEdit}
                  disabled={isSaving}
                  className="bg-button flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors hover:bg-blue-500 disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-1.5">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
                    </span>
                  ) : (
                    <>
                      <FaCheck size={12} /> Save
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm leading-relaxed sm:text-base">
                {expanded ? displayContent : truncateText(displayContent, post._id)}
              </p>
              {displayContent.length > 150 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 text-xs font-medium text-blue-400 transition-colors hover:text-blue-300 sm:text-sm"
                >
                  {expanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </>
          )}
        </div>

        {/* IMAGE - Responsive */}
        {post.image && (
          <div
            className="mt-4 cursor-pointer overflow-hidden rounded-xl border border-white/5 sm:mt-5 md:mt-6"
            onClick={openModal}
          >
            <img
              src={post.image}
              alt="post"
              className="h-auto max-h-[300px] w-full object-cover shadow-inner transition-opacity hover:opacity-95 sm:max-h-[400px] md:max-h-[520px]"
              loading="lazy"
            />
          </div>
        )}

        {/* STATS - Responsive */}
        <div className="mt-4 flex justify-between pr-2 pl-2 text-sm font-medium text-white/60">
          <span>{getLikeCount(post)} Likes</span>
          <span
            className="hover:scale-105 hover:cursor-pointer"
            onClick={() => setShowComments(!showComments)}
          >
            {postComments.length} Comments
          </span>
        </div>

        {/* ACTION BUTTONS - Responsive */}
        <div className="mt-3 flex flex-wrap gap-1 border-t border-white/10 pt-3 font-semibold sm:mt-4 sm:gap-0 sm:pt-4">
          <button
            onClick={() => handleLike(post._id)}
            className={`flex min-w-[calc(50%-0.25rem)] flex-1 items-center justify-center gap-2 p-2 transition hover:cursor-pointer sm:min-w-0 sm:p-0 sm:py-2 ${liked ? 'font-bold text-red-500' : 'text-white/60 hover:text-white'}`}
          >
            {liked ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
            <span className="text-xs sm:text-sm">MyLike</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex min-w-[calc(50%-0.25rem)] flex-1 items-center justify-center gap-2 p-2 transition hover:cursor-pointer sm:min-w-0 sm:p-0 sm:py-2 ${showComments ? 'text-white' : 'text-white/60 hover:text-white'}`}
          >
            <FaRegComment size={15} />
            <span className="text-xs sm:text-sm">Comment</span>
          </button>
          <button className="flex min-w-[calc(50%-0.25rem)] flex-1 items-center justify-center gap-2 p-2 text-white/60 transition hover:cursor-pointer hover:text-white sm:min-w-0 sm:p-0 sm:py-2">
            <FaShare size={15} />
            <span className="text-xs sm:text-sm">Share</span>
          </button>
        </div>

        {/* COMMENT INPUT - Responsive */}
        <div className="mt-3 mr-1 mb-2 ml-1 border-t border-white/10 pt-3 sm:mt-4 sm:pt-4">
          <div className="flex items-center gap-2">
            <input
              ref={el => (commentInputRefs.current[post._id] = el)}
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20 focus:outline-none disabled:opacity-50"
              onKeyDown={e => e.key === 'Enter' && handleAddComment(post._id)}
            />
            <button
              onClick={() => handleAddComment(post._id)}
              disabled={!newComment.trim()}
              className={`relative flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 ${newComment.trim()
                  ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-purple-500 text-white shadow-lg shadow-purple-500/25 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/35 active:scale-95'
                  : 'cursor-not-allowed bg-white/5 text-white/30'
                }`}
            >
              <FaPaperPlane size={14} />
              <span>Comment</span>
            </button>
          </div>
        </div>

        {/* COMMENTS SECTION - Responsive */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 max-h-64 space-y-4 overflow-y-auto pr-2">
                {postComments.length === 0 ? (
                  <p className="py-4 text-center text-sm text-white/50">No comments yet</p>
                ) : (
                  postComments.map(commentItem => (
                    <div
                      key={commentItem._id}
                      className="group flex items-start gap-4 rounded-lg px-2 py-3 transition-all duration-200 hover:bg-white/2"
                    >
                      {/* Avatar circular con bordes sutiles */}
                      <div className="relative shrink-0">
                        <img
                          src={commentItem.userImage || commentItem.user?.image || post.user.image}
                          className="h-9 w-9 rounded-full border border-white/10 object-cover"
                          alt={`Foto de perfil de ${commentItem.user || commentItem.user?.username}`}
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        {/* Contenedor principal del comentario */}
                        <div className="rounded-2xl rounded-tl-none bg-white/3 px-4 py-3 backdrop-blur-sm">
                          {/* Nombre de usuario con decoración sutil */}
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              {commentItem.user || commentItem.user?.username}
                            </span>

                            {canDeleteComment(commentItem.userId) && (
                              <span className="rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-2 py-0.5 text-xs text-blue-300">
                                Tú
                              </span>
                            )}
                          </div>

                          {/* Texto del comentario con mejor legibilidad */}
                          <p className="text-sm leading-relaxed font-light break-words text-white/90">
                            {commentItem.text}
                          </p>
                        </div>

                        {/* Metadatos y acciones - alineados visualmente */}
                        <div className="mt-2.5 flex items-center gap-5 pl-1">
                          <span className="text-xs font-medium tracking-wide text-white/50">
                            {formatTime(commentItem.createdAt)}
                          </span>

                          {/* Acciones con íconos más modernos */}
                          <div className="flex items-center gap-3">
                            {/* Acción de eliminar con animación suave */}
                            {canDeleteComment(commentItem.userId) && (
                              <button
                                onClick={() => handleDeleteComment(post._id, commentItem._id)}
                                className="flex items-center gap-1 text-white/40 opacity-20 transition-all duration-300 group-hover:opacity-100 hover:scale-105 hover:cursor-pointer hover:text-red-400"
                                title="delete comment"
                              >
                                <FaTrashAlt size={11} />
                                <span className="text-xs">Eliminar</span>
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

      {/* MODAL DE ELIMINACIÓN - Responsive */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] mx-4 mt-20 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-white/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 p-6 shadow-xl"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 sm:mb-4 sm:h-14 sm:w-14 md:h-16 md:w-16">
                <FaExclamationTriangle size={window.innerWidth < 640 ? 24 : 30} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white sm:text-xl">¿Delete post?</h3>
              <p className="mb-4 text-xs text-white/60 sm:mb-6 sm:text-sm">
                This action cannot be undone.
              </p>
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-xl bg-white/5 py-2.5 text-xs text-white transition-colors hover:bg-white/10 sm:py-3 sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDeletePost(post._id)
                    setShowDeleteConfirm(false)
                  }}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs text-white transition-colors hover:bg-red-500 sm:py-3 sm:text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE ELIMINACIÓN - Responsive */}


      {/* MODAL IMAGEN FULL - Completamente Responsive */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 z-10 bg-black/80 backdrop-blur-md"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="relative flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 lg:flex-row"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-2 z-20 rounded-full bg-black/40 p-1.5 text-white/70 hover:text-white sm:top-3 sm:right-3 sm:p-2 lg:top-4 lg:right-4"
                >
                  <FaTimes size={14} className="sm:w-4 lg:w-5" />
                </button>

                {/* IMAGE SECTION - Responsive */}
                <div className="flex min-h-[40vh] flex-1 items-center justify-center bg-black/20 p-2 sm:p-3 lg:min-h-auto lg:p-4">
                  <img
                    src={post.image}
                    alt="post"
                    className="max-h-full max-w-full rounded-lg object-contain"
                    style={{
                      maxHeight: window.innerWidth < 1024 ? '50vh' : '85vh',
                      maxWidth: '100%',
                    }}
                  />
                </div>

                {/* INFO PANEL - Responsive */}
                <div className="flex w-full flex-col border-t border-white/10 bg-slate-900/50 backdrop-blur-xl lg:w-96 lg:border-l">
                  {/* HEADER */}
                  <div className="flex gap-2 border-b border-white/10 p-3 sm:gap-3 sm:p-4 lg:p-5">
                    <img
                      src={post.user.image}
                      className="h-8 w-8 flex-shrink-0 rounded-full object-cover sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                      alt={post.user.name}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-semibold text-white">
                          {post.user.name}
                        </span>
                        <IoMdCheckmarkCircle className="flex-shrink-0 text-blue-500" size={12} />
                      </div>
                      <p className="truncate text-[10px] text-white/50 sm:text-xs">
                        {post.user.username} • {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="max-h-20 overflow-y-auto border-b border-white/5 px-3 py-2 text-xs break-words text-white sm:max-h-24 sm:px-4 sm:py-3 sm:text-sm lg:px-5 lg:py-4">
                    {displayContent}
                  </div>

                  {/* COMMENTS LIST */}
                  <div className="scrollbar-thin scrollbar-thumb-white/10 flex-1 space-y-2 overflow-y-auto px-3 py-2 sm:space-y-3 sm:px-4 sm:py-3 lg:space-y-4 lg:px-5 lg:py-4">
                    {postComments.length === 0 ? (
                      <p className="py-4 text-center text-xs text-white/30 italic">
                        No hay comentarios aún
                      </p>
                    ) : (
                      postComments.map(c => (
                        <div key={c._id} className="group flex gap-2 sm:gap-3">
                          <img
                            src={c.userImage || post.user.image}
                            className="h-6 w-6 flex-shrink-0 rounded-full object-cover sm:h-7 sm:w-7"
                            alt={c.user}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-white">
                              <span className="mr-1.5 truncate font-bold">{c.user}</span>
                              <span className="break-words text-white/80">{c.text}</span>
                            </p>
                            <div className="mt-0.5 flex items-center justify-between">
                              <span className="text-[10px] text-white/40">
                                {formatTime(c.createdAt)}
                              </span>
                              {canDeleteComment(c, post) && (
                                <button
                                  onClick={() => openDeleteModal(post._id, c._id, c.text)}
                                  className="text-white/20 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                                >
                                  <FaTrash size={10} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-white/10 bg-black/20 p-3 sm:p-4 lg:p-5">
                    <div className="mb-2 flex justify-between text-[10px] font-bold tracking-wider text-white/60 uppercase sm:mb-3 sm:text-xs">
                      <span>{getLikeCount(post)} likes</span>
                      <span>{postComments.length} comentarios</span>
                    </div>

                    <div className="flex gap-1.5 sm:gap-2">
                      <input
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Añade un comentario..."
                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 sm:px-3 sm:py-2 sm:text-sm"
                        onKeyDown={e => e.key === 'Enter' && handleAddComment(post._id)}
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        disabled={!newComment.trim()}
                        className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-bold whitespace-nowrap text-white transition-colors hover:bg-blue-500 disabled:opacity-40 sm:px-3 sm:py-2"
                      >
                        Publicar
                      </button>
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
