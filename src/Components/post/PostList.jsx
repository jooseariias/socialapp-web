import { motion } from 'framer-motion'
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
  FaRegSmile
} from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { MdMoreHoriz } from 'react-icons/md'
import { useRef } from 'react'
import EmojiPicker from 'emoji-picker-react'

export default function PostCard({
  post,
  currentUserId,
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
}) {
  const localEmojiPickerRef = useRef(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur-sm"
    >
      {/* Post header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <img
            src={post.user.image}
            alt={post.user.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white">{post.user.name}</h3>
              <IoMdCheckmarkCircle className="text-sm text-blue-500" />
            </div>
            <div className="mt-1 text-sm text-white/60">
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Three dots menu */}
        <div className="post-menu relative">
          <button
            onClick={e => togglePostMenu(post._id, e)}
            className="cursor-pointer rounded-full p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white/60"
          >
            <FaEllipsisH />
          </button>

          {postMenu === post._id && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-full right-0 z-10 mt-1 w-48 rounded-xl border border-white/10 bg-white/5 py-2 shadow-xl backdrop-blur-sm"
            >
              {isPostOwner(post) ? (
                <>
                  <button
                    onClick={() => handleEditPost(post)}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <FaEdit className="size-4 text-white/80" />
                    <span>Edit post</span>
                  </button>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    disabled={loading[`delete-post-${post._id}`]}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-red-400 disabled:opacity-50"
                  >
                    <FaTrash className="text-red-300" />
                    <span>
                      {loading[`delete-post-${post._id}`] ? 'Deleting...' : 'Delete post'}
                    </span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleReportPost(post._id)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-orange-400"
                >
                  <FaFlag className="text-orange-400" />
                  <span>Report post</span>
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Post content */}
      <div className="mt-4">
        {editPost === post._id ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full resize-none rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              rows="3"
              placeholder="Write your post..."
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleSaveEdit(post._id)}
                disabled={loading[`edit-${post._id}`] || !editContent.trim()}
                className="bg-button hover:bg-button/80 flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading[`edit-${post._id}`] ? (
                  'Saving...'
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>SAVE</span>
                  </div>
                )}
              </button>
              <button
                onClick={cancelEdit}
                className="cursor-pointer rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="break-words">
              <p className="text-white">{truncateText(post.content, post._id)}</p>
              {needsTruncation(post.content) && (
                <button
                  onClick={() => toggleExpand(post._id)}
                  className="mt-2 text-sm text-blue-400 transition-colors hover:text-blue-300"
                >
                  {expandedPosts.has(post._id) ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>

            {post.image && (
              <div className="mt-4 overflow-hidden rounded-xl">
                <img
                  src={post.image}
                  alt="Post content"
                  className="h-auto max-h-96 w-full object-cover"
                />
              </div>
            )}

            {/* Interaction counters */}
            <div className="mt-4 flex items-center justify-between text-sm text-white/60">
              <div className="flex items-center space-x-4">
                <span>{getLikeCount(post).toLocaleString()} likes</span>
                <span
                  className="cursor-pointer hover:underline"
                  onClick={() => toggleComments(post._id)}
                >
                  {comments[post._id]?.length || 0} comments
                </span>
              </div>
            </div>

            {/* Post actions */}
            <div className="mt-3 flex border-t border-white/10 pt-3">
              <button
                onClick={() => handleLike(post._id)}
                disabled={loading[post._id]}
                className={`flex flex-1 items-center justify-center gap-2 py-2 transition-colors ${
                  likedPosts.has(post._id)
                    ? 'cursor-pointer text-red-500 '
                    : 'cursor-pointer text-white/60 hover:text-red-500'
                } ${loading[post._id] ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {likedPosts.has(post._id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart />
                )}
                <span className="text-sm font-medium">
                  {loading[post._id] ? '...' : 'Like'}
                </span>
              </button>

              <button
                onClick={() => toggleComments(post._id)}
                className="flex flex-1 items-center justify-center gap-2 py-2 text-white/60 transition-colors hover:text-white"
              >
                <FaRegComment />
                <span className="cursor-pointer text-sm font-medium">Comment</span>
              </button>

              <button className="flex flex-1 items-center justify-center gap-2 py-2 text-white/60 transition-colors hover:text-white">
                <FaShare />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>

            {/* Comments section */}
            {showComments === post._id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 border-t border-white/10 pt-4"
              >
                {/* Comments list */}
                <div className="space-y-3">
                  {comments[post._id]?.map(comment => (
                    <div key={comment._id || comment.id} className="group flex space-x-3">
                      <img
                        src={comment.userImage || post.user.image}
                        alt={comment.user}
                        className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="rounded-2xl rounded-tl-none bg-white/5 px-4 py-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="mr-2 text-sm font-semibold text-white">
                                {comment.user}
                              </span>
                              <p className="mt-1 text-sm text-white/80">{comment.text}</p>
                            </div>
                            {canDeleteComment(comment, post) && (
                              <div className="comment-menu relative opacity-0 transition-opacity group-hover:opacity-100">
                                <button
                                  onClick={e => toggleCommentMenu(comment._id, e)}
                                  className="p-1 text-white/40 hover:text-white/60"
                                >
                                  <MdMoreHoriz className="text-sm" />
                                </button>
                                {commentMenu === comment._id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute top-full right-0 z-10 mt-1 w-32 rounded-lg border border-white/10 bg-slate-800/95 py-1 shadow-xl backdrop-blur-sm"
                                  >
                                    <button
                                      onClick={() =>
                                        openDeleteModal(post._id, comment._id, comment.text)
                                      }
                                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-red-400"
                                    >
                                      <FaTrash className="text-xs text-red-400" />
                                      <span>Delete</span>
                                    </button>
                                  </motion.div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="mt-1 flex items-center space-x-3">
                            <span className="text-xs text-white/40">
                              {formatTime(comment.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* New comment input */}
                <div className="relative mt-4 flex items-start space-x-3">
                  <img
                    src={user?.image || post.user.image}
                    alt="Your profile"
                    className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                  />
                  <div className="flex flex-1 items-center rounded-2xl border border-transparent bg-white/5 px-3 py-2 transition-colors focus-within:border-blue-500">
                    <input
                      ref={el => (commentInputRefs.current[post._id] = el)}
                      type="text"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      disabled={loading[`comment-${post._id}`]}
                      className="flex-1 border-none bg-transparent text-sm text-white placeholder-white/40 outline-none"
                      onKeyPress={e => e.key === 'Enter' && handleAddComment(post._id)}
                    />
                    <button
                      onClick={e => toggleEmojiPicker(post._id, e)}
                      className="p-1 text-white/40 transition-colors hover:text-white/60"
                    >
                      <FaRegSmile />
                    </button>
                  </div>

                  {/* Emoji Picker */}
                  {showEmojiPicker === post._id && (
                    <div
                      ref={emojiPickerRef || localEmojiPickerRef}
                      className="absolute right-0 bottom-full z-50 mb-2"
                    >
                      <EmojiPicker
                        theme="dark"
                        emojiStyle="apple"
                        onEmojiClick={emojiData => insertEmojiInComment(post._id, emojiData)}
                        searchDisabled
                        skinTonesDisabled
                        height={400}
                        width={350}
                      />
                    </div>
                  )}

                  <button
                    onClick={() => handleAddComment(post._id)}
                    disabled={loading[`comment-${post._id}`] || !newComment.trim()}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaPaperPlane className="text-xs" />
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}