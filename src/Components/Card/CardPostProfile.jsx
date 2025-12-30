import { motion, AnimatePresence } from 'framer-motion'
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaEllipsisH,
  FaRegEnvelope,
  FaBookmark,
  FaRegBookmark,
  FaTrash,
  FaTimes,
  FaPaperPlane,
  FaEdit,
  FaCheck,
  FaExclamationTriangle
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
  } = props

  // ESTADOS LOCALES
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
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
  const closeModal = () => setShowModal(false)

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
      // 1. Enviamos al backend
      await putPost(post._id, { content: editContent })
      
      // 2. ACTUALIZACIÓN LOCAL INMEDIATA:
      // Forzamos que la UI de esta Card muestre el nuevo contenido 
      // sin esperar a que el padre reaccione.
      setDisplayContent(editContent)
      
      setIsEditing(false)
    } catch (error) {
      console.error("Error al editar:", error)
      alert("No se pudo guardar la edición")
      setEditContent(displayContent) // Revertimos al último contenido que se veía
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/40 via-purple-900/40 to-slate-800/40 p-4 sm:p-6 lg:p-8 shadow-sm backdrop-blur-sm"
  >
    {/* HEADER RESPONSIVE */}
    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
      <div className="flex gap-3 sm:gap-4 items-start sm:items-center">
        {/* Avatar */}
        <div className="relative">
          <img 
            src={post.user.image} 
            alt={post.user.name} 
            className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full object-cover border border-white/10 flex-shrink-0" 
          />
          <IoMdCheckmarkCircle className="absolute -bottom-1 -right-1 text-blue-500 bg-slate-900 rounded-full" size={14} />
        </div>
        
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-white text-sm sm:text-base truncate">
              {post.user.name}
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <p className="text-white/50 truncate">
              {post.user.username || 'usuario'}
            </p>
            <span className="hidden sm:inline text-white/30">•</span>
            <p className="text-white/50">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-1 sm:gap-2">
        {isPostOwner(post) && !isEditing && (
          <>
            <button 
              onClick={() => setIsEditing(true)} 
              className="text-white/40 hover:text-blue-400 p-1.5 sm:p-2 transition-colors"
              aria-label="Edit post"
            >
              <FaEdit size={14} className="sm:w-4" />
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)} 
              className="text-white/40 hover:text-red-500 p-1.5 sm:p-2 transition-colors"
              aria-label="Delete post"
            >
              <FaTrash size={12} className="sm:w-3.5" />
            </button>
          </>
        )}
        <button 
          onClick={(e) => togglePostMenu(post._id, e)} 
          className="text-white/40 hover:text-white p-1.5 sm:p-2"
          aria-label="More options"
        >
          <FaEllipsisH size={14} className="sm:w-4" />
        </button>
      </div>
    </div>

    {/* CONTENT - Responsive */}
    <div className="mt-4 sm:mt-5 md:mt-6 break-words text-white">
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg p-3 sm:p-4 text-white focus:outline-none focus:border-blue-500 resize-none text-sm sm:text-base"
            rows={window.innerWidth < 640 ? 2 : 3}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <button 
              onClick={() => { setIsEditing(false); setEditContent(displayContent); }}
              className="text-xs sm:text-sm bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={onSaveEdit}
              disabled={isSaving}
              className="text-xs sm:text-sm bg-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-500 flex items-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              {isSaving ? (
                <span className="flex items-center gap-1.5">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Guardando...
                </span>
              ) : (
                <>
                  <FaCheck size={12} /> Guardar
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm sm:text-base leading-relaxed">
            {expanded ? displayContent : truncateText(displayContent, post._id)}
          </p>
          {displayContent.length > 150 && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="mt-2 text-xs sm:text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {expanded ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </>
      )}
    </div>

    {/* IMAGE - Responsive */}
    {post.image && (
      <div 
        className="mt-4 sm:mt-5 md:mt-6 cursor-pointer overflow-hidden rounded-xl border border-white/5" 
        onClick={openModal}
      >
        <img 
          src={post.image} 
          alt="post" 
          className="w-full h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[520px] object-cover transition-opacity hover:opacity-95 shadow-inner" 
          loading="lazy"
        />
      </div>
    )}

    {/* STATS - Responsive */}
    <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-white/60 font-medium gap-2 sm:gap-0">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <FaHeart className="text-red-400" size={12} />
          {getLikeCount(post)} likes
        </span>
        <span className="flex items-center gap-1.5">
          <FaRegComment size={12} />
          {postComments.length} comentarios
        </span>
      </div>
      {post.image && (
        <button 
          onClick={openModal}
          className="text-xs text-blue-400 hover:text-blue-300 sm:self-end"
        >
          Ver imagen completa
        </button>
      )}
    </div>

    {/* ACTION BUTTONS - Responsive */}
    <div className="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-0 border-t border-white/10 pt-3 sm:pt-4">
      <button 
        onClick={() => handleLike(post._id)} 
        className={`flex flex-1 min-w-[calc(50%-0.25rem)] sm:min-w-0 items-center justify-center gap-2 p-2 sm:p-0 sm:py-2 transition ${liked ? 'text-red-500 font-bold' : 'text-white/60 hover:text-white'}`}
      >
        {liked ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
        <span className="text-xs sm:text-sm">Like</span>
      </button>
      <button 
        onClick={() => setShowComments(!showComments)} 
        className={`flex flex-1 min-w-[calc(50%-0.25rem)] sm:min-w-0 items-center justify-center gap-2 p-2 sm:p-0 sm:py-2 transition ${showComments ? 'text-white' : 'text-white/60 hover:text-white'}`}
      >
        <FaRegComment size={15} />
        <span className="text-xs sm:text-sm">Comment</span>
      </button>
      <button 
        className="flex flex-1 min-w-[calc(50%-0.25rem)] sm:min-w-0 items-center justify-center gap-2 p-2 sm:p-0 sm:py-2 text-white/60 hover:text-white transition"
      >
        <FaRegEnvelope size={15} />
        <span className="text-xs sm:text-sm">Share</span>
      </button>
      <button 
        onClick={() => setBookmarked(!bookmarked)} 
        className={`flex items-center justify-center gap-2 p-2 sm:p-0 sm:px-3 sm:py-2 transition ${bookmarked ? 'text-blue-500' : 'text-white/60 hover:text-white'}`}
      >
        {bookmarked ? <FaBookmark size={16} /> : <FaRegBookmark size={16} />}
      </button>
    </div>

    {/* COMMENT INPUT - Responsive */}
    <div className="mt-3 sm:mt-4 border-t border-white/10 pt-3 sm:pt-4">
      <div className="flex items-center gap-2 bg-white/5 rounded-xl sm:rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent focus-within:border-white/20">
        <input
          ref={el => (commentInputRefs.current[post._id] = el)}
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..."
          className="flex-1 bg-transparent py-1 sm:py-1.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none"
          onKeyDown={e => e.key === 'Enter' && handleAddComment(post._id)}
        />
        <button 
          onClick={() => handleAddComment(post._id)} 
          disabled={!newComment.trim()} 
          className="text-blue-500 hover:text-blue-400 disabled:opacity-30 p-1.5 sm:p-2 transition-transform active:scale-90"
        >
          <FaPaperPlane size={14} />
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
          <div className="mt-3 sm:mt-4 max-h-48 sm:max-h-60 overflow-y-auto space-y-3 sm:space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/10">
            {postComments.length === 0 ? (
              <p className="text-center text-white/30 text-xs sm:text-sm py-3 sm:py-4 italic">
                No hay comentarios aún
              </p>
            ) : (
              postComments.map(c => (
                <div key={c._id} className="flex gap-2 sm:gap-3 group">
                  <img 
                    src={c.userImage || post.user.image} 
                    className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover shadow-sm flex-shrink-0" 
                    alt={c.user}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="bg-white/5 rounded-xl sm:rounded-2xl rounded-tl-none p-2 sm:p-3 border border-white/5">
                      <span className="text-xs font-bold text-blue-400 block mb-0.5 sm:mb-1 truncate">
                        {c.user}
                      </span>
                      <span className="text-xs sm:text-sm text-white/80 break-words">
                        {c.text}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1 px-1">
                      <span className="text-[10px] sm:text-xs text-white/40">
                        {formatTime(c.createdAt)}
                      </span>
                      {canDeleteComment(c, post) && (
                        <button 
                          onClick={() => openDeleteModal(post._id, c._id, c.text)} 
                          className="text-white/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <FaTrash size={10} className="sm:w-3" />
                        </button>
                      )}
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={() => setShowDeleteConfirm(false)} 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.9, opacity: 0 }} 
          className="relative w-full max-w-xs sm:max-w-sm md:max-w-md rounded-2xl border border-white/10 bg-slate-900 p-4 sm:p-6 shadow-2xl text-center"
        >
          <div className="mb-3 sm:mb-4 mx-auto flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <FaExclamationTriangle size={window.innerWidth < 640 ? 24 : 30} />
          </div>
          <h3 className="mb-2 text-lg sm:text-xl font-bold text-white">
            ¿Eliminar publicación?
          </h3>
          <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-white/60">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-3">
            <button 
              onClick={() => setShowDeleteConfirm(false)} 
              className="flex-1 rounded-xl bg-white/5 py-2.5 sm:py-3 text-xs sm:text-sm text-white hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => { handleDeletePost(post._id); setShowDeleteConfirm(false); }} 
              className="flex-1 rounded-xl bg-red-600 py-2.5 sm:py-3 text-xs sm:text-sm text-white hover:bg-red-500 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>

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
            className="relative flex flex-col lg:flex-row h-[95vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90"
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 z-20 rounded-full bg-black/40 p-1.5 sm:p-2 text-white/70 hover:text-white"
            >
              <FaTimes size={14} className="sm:w-4 lg:w-5" />
            </button>

            {/* IMAGE SECTION - Responsive */}
            <div className="flex-1 flex items-center justify-center bg-black/20 p-2 sm:p-3 lg:p-4 min-h-[40vh] lg:min-h-auto">
              <img 
                src={post.image} 
                alt="post" 
                className="max-h-full max-w-full rounded-lg object-contain"
                style={{ 
                  maxHeight: window.innerWidth < 1024 ? '50vh' : '85vh',
                  maxWidth: '100%'
                }}
              />
            </div>

            {/* INFO PANEL - Responsive */}
            <div className="flex flex-col w-full lg:w-96 border-t lg:border-l border-white/10 bg-slate-900/50 backdrop-blur-xl">
              {/* HEADER */}
              <div className="flex gap-2 sm:gap-3 border-b border-white/10 p-3 sm:p-4 lg:p-5">
                <img 
                  src={post.user.image} 
                  className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full object-cover flex-shrink-0" 
                  alt={post.user.name}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white text-sm truncate">
                      {post.user.name}
                    </span>
                    <IoMdCheckmarkCircle className="text-blue-500 flex-shrink-0" size={12} />
                  </div>
                  <p className="text-[10px] sm:text-xs text-white/50 truncate">
                    {post.user.username} • {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm break-words text-white border-b border-white/5 max-h-20 sm:max-h-24 overflow-y-auto">
                {displayContent}
              </div>

              {/* COMMENTS LIST */}
              <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 space-y-2 sm:space-y-3 lg:space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                {postComments.length === 0 ? (
                  <p className="text-center text-xs text-white/30 italic py-4">
                    No hay comentarios aún
                  </p>
                ) : (
                  postComments.map(c => (
                    <div key={c._id} className="group flex gap-2 sm:gap-3">
                      <img 
                        src={c.userImage || post.user.image} 
                        className="h-6 w-6 sm:h-7 sm:w-7 rounded-full object-cover flex-shrink-0" 
                        alt={c.user}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white">
                          <span className="font-bold mr-1.5 truncate">{c.user}</span>
                          <span className="text-white/80 break-words">{c.text}</span>
                        </p>
                        <div className="mt-0.5 flex items-center justify-between">
                          <span className="text-[10px] text-white/40">
                            {formatTime(c.createdAt)}
                          </span>
                          {canDeleteComment(c, post) && (
                            <button
                              onClick={() => openDeleteModal(post._id, c._id, c.text)}
                              className="text-white/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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

              <div className="border-t border-white/10 p-3 sm:p-4 lg:p-5 bg-black/20">
                <div className="mb-2 sm:mb-3 flex justify-between text-[10px] sm:text-xs uppercase tracking-wider font-bold text-white/60">
                  <span>{getLikeCount(post)} likes</span>
                  <span>{postComments.length} comentarios</span>
                </div>

                <div className="flex gap-1.5 sm:gap-2">
                  <input
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Añade un comentario..."
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white outline-none focus:border-blue-500/50"
                    onKeyDown={e => e.key === 'Enter' && handleAddComment(post._id)}
                  />
                  <button
                    onClick={() => handleAddComment(post._id)}
                    disabled={!newComment.trim()}
                    className="rounded-lg bg-blue-600 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-white disabled:opacity-40 transition-colors hover:bg-blue-500 whitespace-nowrap"
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