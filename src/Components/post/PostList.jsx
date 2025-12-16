import { motion, AnimatePresence } from 'framer-motion'
import {
  FaEllipsisH,
  FaEdit,
  FaTrash,
  FaFlag,
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaShare,
  FaPaperPlane,
  FaRegSmile,
  FaTimes
} from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { MdMoreHoriz } from 'react-icons/md'
import { useRef, useState } from 'react'
import EmojiPicker from 'emoji-picker-react'

export default function PostCard(props) {
  const {
    post,
    formatDate,
    formatTime,
    postMenu,
    togglePostMenu,
    isPostOwner,
    handleEditPost,
    handleDeletePost,
    handleReportPost,
    loading,
    editPost,
    editContent,
    setEditContent,
    handleSaveEdit,
    cancelEdit,
    getLikeCount,
    likedPosts,
    handleLike,
    comments,
    toggleComments,
    showComments,
    canDeleteComment,
    commentMenu,
    toggleCommentMenu,
    openDeleteModal,
    user,
    commentInputRefs,
    newComment,
    setNewComment,
    handleAddComment,
    showEmojiPicker,
    toggleEmojiPicker,
    emojiPickerRef,
    insertEmojiInComment,
    truncateText,
    needsTruncation,
    toggleExpand,
    expandedPosts
  } = props

  const localEmojiPickerRef = useRef(null)
  const [showModal, setShowModal] = useState(false)

  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  const postComments = comments[post._id] || []
  const liked = likedPosts.has(post._id)

  return (
    <>
      {/* ================= CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
      >
        <div className="flex justify-between">
          <div className="flex gap-3">
            <img src={post.user.image} className="h-10 w-10 rounded-full object-cover" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{post.user.name}</span>
                <IoMdCheckmarkCircle className="text-blue-500" />
              </div>
              <span className="text-sm text-white/60">{formatDate(post.createdAt)}</span>
            </div>
          </div>
          <button
            onClick={e => togglePostMenu(post._id, e)}
            className="p-2 text-white/40 hover:text-white"
          >
            <FaEllipsisH />
          </button>
        </div>

        <div className="mt-4 text-white break-words">
          {truncateText(post.content, post._id)}
        </div>

        {post.image && (
          <div
            onClick={openModal}
            className="mt-4 cursor-pointer rounded-xl overflow-hidden"
          >
            <img src={post.image} className="max-h-96 w-full object-cover" />
          </div>
        )}
      </motion.div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed min-h-full  z-50 bg-black/80  backdrop-blur-md"
            />

            <div className="fixed inset-2 min-h-full z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="relative flex max-h-[85vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 backdrop-blur-md"
              >
                <button
                  onClick={closeModal}
                  className="absolute right-4 top-4 z-10 rounded-full bg-black/40 p-2 text-white/70 hover:text-white"
                >
                  <FaTimes />
                </button>

                {/* IMAGE */}
                <div className="flex-1 flex items-center justify-center bg-black/40 p-4">
                  <img
                    src={post.image}
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>

                {/* RIGHT */}
                <div className="w-96 flex flex-col border-l border-white/10">
                  {/* HEADER */}
                  <div className="p-5 border-b border-white/10 flex gap-3">
                    <img src={post.user.image} className="h-12 w-12 rounded-full" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{post.user.name}</span>
                        <IoMdCheckmarkCircle className="text-blue-500" />
                      </div>
                      <span className="text-xs text-white/50">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="px-5 py-4 text-white text-sm break-words">
                    {post.content}
                  </div>

                  {/* STATS */}
                  <div className="px-5 text-sm text-white/60 flex justify-between">
                    <span>{getLikeCount(post)} likes</span>
                    <span>{postComments.length} comments</span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex border-t border-white/10 mt-3">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 ${
                        liked ? 'text-red-500' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {liked ? <FaHeart /> : <FaRegHeart />}
                      Like
                    </button>

                    <button
                      onClick={() =>
                        commentInputRefs.current[post._id]?.focus()
                      }
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-white/60 hover:text-white"
                    >
                      <FaRegComment />
                      Comment
                    </button>

                    <button className="flex-1 flex items-center justify-center gap-2 py-3 text-white/60 hover:text-white">
                      <FaShare />
                      Share
                    </button>
                  </div>

                  {/* COMMENTS */}
                  <div className="flex-1 overflow-y-auto px-5 space-y-4 py-4">
                    {postComments.map(c => (
                      <div key={c._id} className="flex gap-3">
                        <img
                          src={c.userImage || post.user.image}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-white">
                            <b>{c.user}</b>{' '}
                            <span className="text-white/70">{c.text}</span>
                          </p>
                          <div className="flex justify-between">
                            <span className="text-xs text-white/40">
                              {formatTime(c.createdAt)}
                            </span>
                            {canDeleteComment(c, post) && (
                              <button
                                onClick={() =>
                                  openDeleteModal(post._id, c._id, c.text)
                                }
                                className="text-white/40 hover:text-red-400"
                              >
                                <FaTrash size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* INPUT */}
                  <div className="border-t border-white/10 p-4 flex gap-2">
                    <input
                      ref={el => (commentInputRefs.current[post._id] = el)}
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Añade un comentario..."
                      className="flex-1 rounded-lg bg-black/30 px-3 py-2 text-sm text-white"
                      onKeyDown={e => e.key === 'Enter' && handleAddComment(post._id)}
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className="rounded-lg bg-blue-600 px-3 text-white"
                    >
                      <FaPaperPlane />
                    </button>
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
