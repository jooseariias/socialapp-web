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
        className="w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/40 via-purple-900/40 to-slate-800/40 p-8 shadow-sm backdrop-blur-sm"
      >
        {/* HEADER */}
        <div className="flex justify-between">
          <div className="flex gap-4">
            <img src={post.user.image} alt={post.user.name} className="h-14 w-14 rounded-full object-cover border border-white/10" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">{post.user.name}</h3>
                <IoMdCheckmarkCircle className="text-blue-500" />
              </div>
              <p className="text-sm text-white/50">{post.user.username || 'usuario'} • {formatDate(post.createdAt)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {isPostOwner(post) && !isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} className="text-white/40 hover:text-blue-400 p-2 transition-colors">
                  <FaEdit size={16} />
                </button>
                <button onClick={() => setShowDeleteConfirm(true)} className="text-white/40 hover:text-red-500 p-2 transition-colors">
                  <FaTrash size={14} />
                </button>
              </>
            )}
            <button onClick={(e) => togglePostMenu(post._id, e)} className="text-white/40 hover:text-white p-2">
              <FaEllipsisH />
            </button>
          </div>
        </div>

        {/* CONTENIDO TEXTO / MODO EDICIÓN */}
        <div className="mt-4 break-words text-white">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 resize-none"
                rows="3"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => { setIsEditing(false); setEditContent(displayContent); }}
                  className="text-xs bg-white/10 px-3 py-1 rounded-md hover:bg-white/20"
                >
                  Cancelar
                </button>
                <button 
                  onClick={onSaveEdit}
                  disabled={isSaving}
                  className="text-xs bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-500 flex items-center gap-1"
                >
                  {isSaving ? '...' : <><FaCheck /> Guardar</>}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* FIX: Usamos displayContent en lugar de post.content */}
              <p>{expanded ? displayContent : truncateText(displayContent, post._id)}</p>
              {displayContent.length > 150 && (
                <button onClick={() => setExpanded(!expanded)} className="mt-2 text-sm text-blue-400 hover:text-blue-300 font-medium">
                  {expanded ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </>
          )}
        </div>

        {/* IMAGEN */}
        {post.image && (
          <div className="mt-5 cursor-pointer overflow-hidden rounded-xl border border-white/5" onClick={openModal}>
            <img src={post.image} alt="post" className="max-h-[520px] w-full object-cover transition-opacity hover:opacity-95 shadow-inner" />
          </div>
        )}

        <div className="mt-4 flex justify-between text-sm text-white/60 font-medium">
          <span>{getLikeCount(post)} likes</span>
          <span>{postComments.length} comentarios</span>
        </div>

        <div className="mt-4 flex border-t border-white/10 pt-4">
          <button onClick={() => handleLike(post._id)} className={`flex flex-1 items-center justify-center gap-2 transition ${liked ? 'text-red-500 font-bold' : 'text-white/60 hover:text-white'}`}>
            {liked ? <FaHeart /> : <FaRegHeart />} Like
          </button>
          <button onClick={() => setShowComments(!showComments)} className={`flex flex-1 items-center justify-center gap-2 transition ${showComments ? 'text-white' : 'text-white/60 hover:text-white'}`}>
            <FaRegComment /> Comment
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 text-white/60 hover:text-white">
            <FaRegEnvelope /> Share
          </button>
          <button onClick={() => setBookmarked(!bookmarked)} className={`flex items-center gap-2 px-2 transition ${bookmarked ? 'text-blue-500' : 'text-white/60 hover:text-white'}`}>
            {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-1 border border-transparent focus-within:border-white/20">
            <input
              ref={el => (commentInputRefs.current[post._id] = el)}
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 bg-transparent py-2 text-sm text-white placeholder-white/30 focus:outline-none"
              onKeyDown={e => e.key === 'Enter' && handleAddComment(post._id)}
            />
            <button onClick={() => handleAddComment(post._id)} disabled={!newComment.trim()} className="text-blue-500 hover:text-blue-400 disabled:opacity-30 p-2 transition-transform active:scale-90">
              <FaPaperPlane />
            </button>
          </div>
        </div>

        {/* COMENTARIOS */}
        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <div className="mt-4 max-h-60 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {postComments.length === 0 ? (
                  <p className="text-center text-white/30 text-xs py-4 italic">No hay comentarios aún</p>
                ) : (
                  postComments.map(c => (
                    <div key={c._id} className="flex gap-3 group">
                      <img src={c.userImage || post.user.image} className="h-8 w-8 rounded-full object-cover shadow-sm" />
                      <div className="flex-1">
                        <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 border border-white/5">
                          <span className="text-xs font-bold text-blue-400 block mb-1">{c.user}</span>
                          <span className="text-sm text-white/80 break-words">{c.text}</span>
                        </div>
                        <div className="flex justify-between mt-1 px-1">
                          <span className="text-[10px] text-white/40">{formatTime(c.createdAt)}</span>
                          {canDeleteComment(c, post) && (
                            <button onClick={() => openDeleteModal(post._id, c._id, c.text)} className="text-white/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                              <FaTrash size={10} />
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

      {/* MODAL DE ELIMINACIÓN */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl text-center">
                <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <FaExclamationTriangle size={30} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">¿Eliminar publicación?</h3>
                <p className="mb-6 text-sm text-white/60">Esta acción no se puede deshacer.</p>
                <div className="flex w-full gap-3">
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 rounded-xl bg-white/5 py-3 text-sm text-white hover:bg-white/10">Cancelar</button>
                  <button onClick={() => { handleDeletePost(post._id); setShowDeleteConfirm(false); }} className="flex-1 rounded-xl bg-red-600 py-3 text-sm text-white hover:bg-red-500">Eliminar</button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL IMAGEN FULL */}
     <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 z-10  backdrop-blur-md"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="relative flex h-[95vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90"
              >
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 z-20 rounded-full bg-black/40 p-2 text-white/70 hover:text-white">
                  <FaTimes size={18} />
                </button>

                {/* IZQUIERDA - IMAGEN */}
                <div className="flex flex-1 items-center justify-center bg-black/20 p-2">
                  <img src={post.image} alt="post" className="max-h-full max-w-full rounded-lg object-contain" />
                </div>

                {/* DERECHA - PANEL DE INFO */}
                <div className="flex w-96 flex-col border-l border-white/10 bg-slate-900/50 backdrop-blur-xl">
                  {/* HEADER DEL MODAL */}
                  <div className="flex gap-3 border-b border-white/10 p-5">
                    <img src={post.user.image} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{post.user.name}</span>
                        <IoMdCheckmarkCircle className="text-blue-500" size={14} />
                      </div>
                      <p className="text-[10px] text-white/50">{post.user.username} • {formatDate(post.createdAt)}</p>
                    </div>
                  </div>

                  {/* DESCRIPCIÓN */}
                  <div className="px-5 py-4 text-sm break-words text-white border-b border-white/5">
                    {displayContent}
                  </div>

                  {/* COMENTARIOS LISTA */}
                  <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 scrollbar-thin scrollbar-thumb-white/10">
                    {postComments.length === 0 ? (
                      <p className="text-center text-xs text-white/30 italic">No hay comentarios aún</p>
                    ) : (
                      postComments.map(c => (
                        <div key={c._id} className="group flex gap-3">
                          <img src={c.userImage || post.user.image} className="h-7 w-7 rounded-full object-cover" />
                          <div className="flex-1">
                            <p className="text-xs text-white">
                              <span className="font-bold mr-2">{c.user}</span>
                              <span className="text-white/80">{c.text}</span>
                            </p>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-[10px] text-white/40">{formatTime(c.createdAt)}</span>
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

                  {/* PIE DE MODAL (ACCIONES Y FORMULARIO) */}
                  <div className="border-t border-white/10 p-5 bg-black/20">
                    <div className="mb-3 flex justify-between text-[11px] text-white/60 uppercase tracking-widest font-bold">
                      <span>{getLikeCount(post)} likes</span>
                      <span>{postComments.length} comentarios</span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Añade un comentario..."
                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50"
                        onKeyDown={e => e.key === 'Enter' && handleAddComment(post._id)}
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        disabled={!newComment.trim()}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-40 transition-colors hover:bg-blue-500"
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