import { CiSaveDown2 } from 'react-icons/ci'
import { motion } from 'framer-motion'
import {
  FaRegImage,
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaEllipsisH,
  FaTrash,
  FaEdit,
  FaFlag,
  FaPaperPlane,
  FaRegSmile,
  FaShare,
} from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { MdMoreHoriz } from 'react-icons/md'
import getPostUser from '../Services/getPostUser'
import { useState, useEffect, useRef } from 'react'
import postLike from '../Services/post/postLike'
import postUnLike from '../Services/post/postUnLike'
import postCreateComment from '../Services/post/costCreateComment'
import postDeleteComment from '../Services/post/deleteComment'
import postDelete from '../Services/post/deletePost'
import putPost from '../Services/post/putPost'
import { useUserStore } from '../Store/useUserStore'
import EmojiPicker from 'emoji-picker-react'

export default function PostAndLikes({ activeTab, setActiveTab }) {
  const [postUser, setPostUser] = useState(null)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [comments, setComments] = useState({})
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(null)
  const [expandedPosts, setExpandedPosts] = useState(new Set())
  const [loading, setLoading] = useState({})
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    postId: null,
    commentId: null,
    commentText: '',
  })
  const [postMenu, setPostMenu] = useState(null)
  const [editPost, setEditPost] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [commentMenu, setCommentMenu] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(null)

  const emojiPickerRef = useRef(null)
  const commentInputRefs = useRef({})

  const { user } = useUserStore()
  const currentUserId = user?.id

  useEffect(() => {
    const getPostUserData = async () => {
      const result = await getPostUser()
      console.log('result', result)
      if (result.status >= 400) {
        throw new Error(result.error || 'Error getting posts')
      }
      setPostUser(result.data)

      const initialLikedPosts = new Set()
      result.data.forEach(post => {
        if (post.likes && post.likes.length > 0) {
          initialLikedPosts.add(post._id)
        }
      })
      setLikedPosts(initialLikedPosts)

      const initialComments = {}
      result.data.forEach(post => {
        if (post.comments && post.comments.length > 0) {
          initialComments[post._id] = post.comments.map(comment => ({
            _id: comment._id,
            text: comment.text,
            user: comment.user.name,
            userId: comment.user._id,
            userImage: comment.user.image,
            createdAt: comment.createdAt,
            timestamp: new Date(comment.createdAt).toLocaleTimeString(),
          }))
        }
      })
      setComments(initialComments)
    }
    getPostUserData()
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      // Close emoji picker if clicking outside
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(null)
      }

      // Close post and comment menus
      if (!event.target.closest('.post-menu') && !event.target.closest('.comment-menu')) {
        setPostMenu(null)
        setCommentMenu(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const togglePostMenu = (postId, e) => {
    if (e) e.stopPropagation()
    setPostMenu(postMenu === postId ? null : postId)
  }

  const toggleCommentMenu = (commentId, e) => {
    if (e) e.stopPropagation()
    setCommentMenu(commentMenu === commentId ? null : commentId)
  }

  const toggleEmojiPicker = (postId, e) => {
    if (e) e.stopPropagation()
    setShowEmojiPicker(showEmojiPicker === postId ? null : postId)
  }

  const insertEmojiInComment = (postId, emojiData) => {
    const input = commentInputRefs.current[postId]
    if (!input) return

    const start = input.selectionStart
    const end = input.selectionEnd
    const currentValue = newComment

    const newValue =
      currentValue.substring(0, start) + emojiData.emoji + currentValue.substring(end)
    setNewComment(newValue)

    // Maintain focus and cursor position
    setTimeout(() => {
      input.selectionStart = input.selectionEnd = start + emojiData.emoji.length
      input.focus()
    }, 0)

    setShowEmojiPicker(null)
  }

  const handleDeletePost = async postId => {
    try {
      setLoading(prev => ({ ...prev, [`delete-post-${postId}`]: true }))
      await postDelete(postId)
      setPostUser(prev => prev.filter(post => post._id !== postId))
      setPostMenu(null)
    } catch (error) {
      console.error('Error deleting post:', error)
    } finally {
      setLoading(prev => ({ ...prev, [`delete-post-${postId}`]: false }))
    }
  }

  const handleEditPost = post => {
    setEditPost(post._id)
    setEditContent(post.content)
    setPostMenu(null)
  }

  const cancelEdit = () => {
    setEditPost(null)
    setEditContent('')
  }

  const handleSaveEdit = async postId => {
    if (!editContent.trim()) return
    try {
      setLoading(prev => ({ ...prev, [`edit-${postId}`]: true }))
      await putPost(postId, { content: editContent })
      setPostUser(prev =>
        prev.map(post => (post._id === postId ? { ...post, content: editContent } : post)),
      )
      setEditPost(null)
      setEditContent('')
    } catch (error) {
      console.error('Error editing post:', error)
    } finally {
      setLoading(prev => ({ ...prev, [`edit-${postId}`]: false }))
    }
  }

  const handleReportPost = postId => {
    console.log(`Reporting post ${postId}`)
    setPostMenu(null)
    alert(`Post ${postId} reported`)
  }

  const handleLike = async postId => {
    const wasLiked = likedPosts.has(postId)
    setLikedPosts(prev => {
      const newLiked = new Set(prev)
      if (wasLiked) {
        newLiked.delete(postId)
      } else {
        newLiked.add(postId)
      }
      return newLiked
    })

    try {
      setLoading(prev => ({ ...prev, [postId]: true }))
      if (wasLiked) {
        await postUnLike(postId)
      } else {
        await postLike(postId)
      }
    } catch (error) {
      console.error('Error liking post:', error)
      setLikedPosts(prev => {
        const newLiked = new Set(prev)
        if (wasLiked) {
          newLiked.add(postId)
        } else {
          newLiked.delete(postId)
        }
        return newLiked
      })
    } finally {
      setLoading(prev => ({ ...prev, [postId]: false }))
    }
  }

  const handleAddComment = async postId => {
    if (!newComment.trim()) return

    const tempComment = {
      id: Date.now(),
      text: newComment,
      user: user?.name || 'You',
      userId: currentUserId,
      userImage: user?.image,
      timestamp: new Date().toLocaleTimeString(),
      _id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), tempComment],
    }))

    const commentText = newComment
    setNewComment('')

    try {
      setLoading(prev => ({ ...prev, [`comment-${postId}`]: true }))
      const result = await postCreateComment(postId, commentText)

      if (result.status >= 400) {
        throw new Error(result.error || 'Error adding comment')
      }

      if (result.data) {
        setComments(prev => ({
          ...prev,
          [postId]: (prev[postId] || []).map(comment =>
            comment.id === tempComment.id
              ? {
                  _id: result.data._id,
                  text: result.data.text,
                  user: result.data.user?.name || 'You',
                  userId: result.data.user?._id || currentUserId,
                  userImage: result.data.user?.image,
                  createdAt: result.data.createdAt,
                  timestamp: new Date(result.data.createdAt).toLocaleTimeString(),
                }
              : comment,
          ),
        }))
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      setComments(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(comment => comment.id !== tempComment.id),
      }))
    } finally {
      setLoading(prev => ({ ...prev, [`comment-${postId}`]: false }))
    }
  }

  const openDeleteModal = (postId, commentId, commentText) => {
    setDeleteModal({
      show: true,
      postId,
      commentId,
      commentText,
    })
    setCommentMenu(null)
  }

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, postId: null, commentId: null, commentText: '' })
  }

  const handleDeleteComment = async () => {
    const { postId, commentId } = deleteModal
    try {
      setLoading(prev => ({ ...prev, [`delete-${commentId}`]: true }))
      await postDeleteComment(postId, commentId)
      setComments(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(comment => comment._id !== commentId),
      }))
      closeDeleteModal()
    } catch (error) {
      console.error('Error deleting comment:', error)
    } finally {
      setLoading(prev => ({ ...prev, [`delete-${commentId}`]: false }))
    }
  }

  const toggleComments = postId => {
    setShowComments(showComments === postId ? null : postId)
  }

  const toggleExpand = postId => {
    setExpandedPosts(prev => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(postId)) {
        newExpanded.delete(postId)
      } else {
        newExpanded.add(postId)
      }
      return newExpanded
    })
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return (
        'Today at ' +
        date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    } else if (diffDays === 1) {
      return (
        'Yesterday at ' +
        date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
      })
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  }

  const formatTime = dateString => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const truncateText = (text, postId, maxLength = 150) => {
    if (expandedPosts.has(postId) || text.length <= maxLength) {
      return text
    }
    return text.slice(0, maxLength) + '...'
  }

  const needsTruncation = (text, maxLength = 150) => {
    return text.length > maxLength
  }

  const getLikeCount = post => {
    const baseLikes = post.likes?.length || 0
    const localLike = likedPosts.has(post._id) ? 1 : 0
    const wasAlreadyLiked = post.likes && post.likes.length > 0
    return wasAlreadyLiked ? Math.max(baseLikes, localLike) : baseLikes + localLike
  }

  const canDeleteComment = (comment, post) => {
    return comment.userId === currentUserId || post.user._id === currentUserId
  }

  const isPostOwner = post => {
    return post.user._id === currentUserId
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      {/* Delete comment confirmation modal */}
      {deleteModal.show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl"
          >
            <h3 className="mb-4 text-xl font-semibold text-white">Delete Comment</h3>
            <p className="mb-6 text-white/80">
              Are you sure you want to delete this comment?
              <br />
              <span className="mt-2 block text-sm text-white/60">"{deleteModal.commentText}"</span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="rounded-lg bg-white/10 px-4 py-2 text-white/80 transition-colors hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteComment}
                disabled={loading[`delete-${deleteModal.commentId}`]}
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading[`delete-${deleteModal.commentId}`] ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-6"
      >
        <div className="relative flex justify-center gap-1 rounded-xl border border-white/10 bg-white/10 p-1 backdrop-blur-sm">
          {[
            { name: 'Posts', icon: <FaRegImage /> },
            { name: 'Likes', icon: <FaRegHeart /> },
          ].map(tab => {
            const isActive = activeTab === tab.name
            return (
              <motion.button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all ${
                  isActive ? 'bg-blue-500 text-white shadow-md' : 'text-white/60 hover:text-white'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {tab.icon}
                {tab.name}
              </motion.button>
            )
          })}
        </div>
      </motion.section>

      {/* Posts */}
      {activeTab === 'Posts' && postUser && (
        <div className="space-y-6">
          {postUser.map(post => (
            <motion.div
              key={post._id}
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

                    {/* Post actions - Facebook style */}
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

                    {/* Comments section - Facebook style */}
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

                        {/* New comment input - Facebook style with Emoji Picker */}
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
                              ref={emojiPickerRef}
                              className="absolute right-0 bottom-full z-50 mb-2"
                            >
                              <EmojiPicker
                                theme="dark"
                                emojiStyle="apple"
                                onEmojiClick={emojiData =>
                                  insertEmojiInComment(post._id, emojiData)
                                }
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
          ))}
        </div>
      )}

      {/* Likes view */}
      {activeTab === 'Likes' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
          <FaRegHeart className="mx-auto mb-4 text-4xl text-white/40" />
          <h3 className="mb-2 text-xl font-semibold text-white">Posts you like</h3>
          <p className="text-white/60">Posts you like will appear here</p>
        </motion.div>
      )}
    </div>
  )
}
