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
          {/* Fondo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-50 bg-white/10 backdrop-blur-md min-h-screen"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center   justify-center p-3">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="relative flex h-[95vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 flex-col md:flex-row"
            >
              {/* Cerrar */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 z-20 rounded-full hover:cursor-pointer bg-black/40 p-3 text-white/70 hover:text-white transition"
              >
                <FaTimes size={18} />
              </button>

              {/* Imagen */}
              <div className="flex flex-1 items-center justify-center bg-black/40 p-4 md:p-6">
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

              {/* ===== MOBILE ONLY ===== */}
              <div className="md:hidden px-5 py-4 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={postUser.image}
                    className="h-10 w-10 rounded-full object-cover border border-white/10"
                    alt={postUser.name}
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {postUser.name}
                    </p>
                    <p className="text-xs text-white/50">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-white/90 break-words">
                  {postContent}
                </p>
              </div>

              {/* ===== DESKTOP ONLY ===== */}
              <div className="hidden md:flex w-[450px] flex-col border-l border-white/10">
                {/* Header */}
                <div className="flex gap-4 p-6">
                  <img
                    src={postUser.image}
                    className="h-14 w-14 rounded-full object-cover border border-white/10"
                    alt={postUser.name}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white/80 text-lg">
                        {postUser.name}
                      </span>
                      {userActiveP && (
                        <IoMdCheckmarkCircle
                          className="text-blue-500"
                          size={18}
                        />
                      )}
                    </div>
                    <p className="text-sm text-white/50">
                      {postUser.username} • {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Contenido */}
                <div className="px-6 py-5 text-sm break-words font-medium border-t border-white/10 text-white">
                  {postContent}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    {liked ? (
                      <FaHeart className="text-red-500" size={18} />
                    ) : (
                      <FaRegHeart className="text-white/60" size={18} />
                    )}
                    <span className="text-sm font-medium text-white/80 ml-1">
                      {postLikes.length + (liked ? 1 : 0)} Likes
                    </span>
                  </div>
                  <span className="text-sm  font-medium  text-white/80">
                    {comments.length} Comments
                  </span>
                </div>

                {/* Comentarios */}
                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
                  {comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-10">
                      <FaRegHeart className="text-white/30 mb-3" size={48} />
                      <p className="text-white/50 font-medium">
                        No comments yet
                      </p>
                    </div>
                  ) : (
                    comments.map(c => (
                      <div
                        key={c._id}
                        className="group flex gap-4 p-3 rounded-xl hover:bg-white/5 transition"
                      >
                        <img
                          src={c.user?.image}
                          className="h-10 w-10 rounded-full object-cover border border-white/10"
                          alt={c.user?.username}
                        />

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-sm">
                              {c.user?.username}
                            </span>
                            {isCurrentUserComment(c.user?._id) && (
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 rounded-full">
                                You
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-white/90 mb-2">
                            {c.text}
                          </p>

                          <div className="flex justify-between items-center">
                            <span className="text-xs text-white/40">
                              {formatDate(c.createdAt)}
                            </span>

                            {isCurrentUserComment(c.user?._id) && (
                              <button
                                onClick={() =>
                                  handleDeleteClick(post._id, c._id)
                                }
                                className="flex items-center hover:cursor-pointer gap-1 text-xs text-white/40 hover:text-red-400 transition-all duration-300"
                              >
                                <FaTrashAlt size={11} />
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-white/10 p-6">
                  <form
                    onSubmit={handleAddComment}
                    className="flex gap-3"
                  >
                    <input
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder-white/40 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!comment.trim()}
                      className={`rounded-full px-5 py-3 text-sm font-medium ${
                        comment.trim()
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }`}
                    >
                      <FaPaperPlane />
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