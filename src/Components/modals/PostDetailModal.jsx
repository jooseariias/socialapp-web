import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaTrashAlt, FaRegHeart, FaHeart, FaPaperPlane } from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { useState } from 'react'

const PostDetailModal = ({
  post,
  comments,
  liked,
  showModal,
  setShowModal,
  postImage,
  postUser,
  postLikes,
  formatDate,
  comment,
  setComment,
  handleAddComment,
  isCurrentUserComment,
  postContent,
  handleDeleteClick
}) => {
  const [userActiveP] = useState(false)

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {/* Fondo difuminado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
          />

          {/* Modal principal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="relative flex h-[95vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90"
            >
              {/* Botón cerrar */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 z-20 rounded-full bg-black/40 p-3 text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <FaTimes size={20} />
              </button>

              {/* Lado izquierdo - Imagen */}
              <div className="flex flex-1 items-center justify-center bg-black/40 p-6">
                {postImage && (
                  <img
                    src={postImage}
                    alt="post"
                    className="max-h-full max-w-full rounded-xl object-contain"
                    onError={e => {
                      e.currentTarget.src =
                        'https://via.placeholder.com/600x600/020617/8b5cf6?text=Image+not+available'
                    }}
                  />
                )}
              </div>

              {/* Lado derecho - Contenido */}
              <div className="flex w-[450px] flex-col border-l border-white/10">
                {/* Header del usuario */}
                <div className="flex gap-4 p-6">
                  <img 
                    src={postUser.image} 
                    className="h-14 w-14 rounded-full object-cover border border-white/10"
                    alt={postUser.name}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-lg">{postUser.name}</span>
                      {userActiveP && (
                        <IoMdCheckmarkCircle className="text-blue-500" size={18} />
                      )}
                    </div>
                    <p className="text-sm text-white/50">
                      {postUser.username} • {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Contenido del post */}
                <div className="px-6 py-5 text-sm break-words border-t border-white/10 text-white">
                  {postContent}
                </div>

                {/* Estadísticas */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    {liked ? (
                      <FaHeart className="text-red-500" size={18} />
                    ) : (
                      <FaRegHeart className="text-white/60" size={18} />
                    )}
                    <span className="text-sm font-medium text-white ml-1">
                      {postLikes.length + (liked ? 1 : 0)} likes
                    </span>
                  </div>
                  <span className="text-sm text-white/60">{comments.length} comments</span>
                </div>

                {/* Sección de comentarios */}
                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
                  {comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-10">
                      <div className="text-white/30 mb-3">
                        <FaRegHeart size={48} />
                      </div>
                      <p className="text-center text-white/50 font-medium">No comments yet</p>
                      <p className="text-center text-sm text-white/40 mt-1">Be the first to comment</p>
                    </div>
                  ) : (
                    comments.map(c => (
                      <div 
                        key={c._id} 
                        className="group flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-200"
                      >
                        <div className="relative shrink-0">
                          <img 
                            src={c.user?.image} 
                            className="h-10 w-10 rounded-full object-cover border border-white/10"
                            alt={c.user?.username}
                          />
                          
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-sm">{c.user?.username}</span>
                            {isCurrentUserComment(c.user?._id) && (
                              <span className="text-xs bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-white/90 text-sm leading-relaxed mb-2">{c.text}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/40">{formatDate(c.createdAt)}</span>
                            
                            {/* Botón eliminar */}
                            {isCurrentUserComment(c.user?._id) && (
                              <button
                                onClick={() => handleDeleteClick(post._id, c._id)}
                                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-red-400 transition-colors"
                              >
                                <FaTrashAlt size={11} />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input de comentario */}
                <div className="border-t border-white/10 p-6">
                  <form onSubmit={handleAddComment} className="flex gap-3">
                    <input
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder-white/40 focus:border-purple-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                    <button
                      type="submit"
                      disabled={!comment.trim()}
                      className={`relative flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 ${
                        comment.trim()
                          ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-purple-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 hover:scale-[1.02] active:scale-95'
                          : 'cursor-not-allowed bg-white/5 text-white/30'
                      }`}
                    >
                      <FaPaperPlane className="text-sm" />
                      <span>Post</span>
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PostDetailModal