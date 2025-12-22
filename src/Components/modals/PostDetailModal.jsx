import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaTrash, FaRegHeart, FaHeart } from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'


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
}) => {


  return (
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
                            <span className="text-xs text-white/40">{formatDate(c.createdAt)}</span>
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
  )
}

export default PostDetailModal
