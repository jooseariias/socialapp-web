import { motion } from 'framer-motion'
import { FaRegImage, FaRegHeart } from 'react-icons/fa'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useUserStore } from '../Store/useUserStore'

import ModalDeletePost from './post/ModalDeletePostComment'
import SelectPostAndLikes from './post/SelectPostAndLikes'
import CardPostProfile from './Card/CardPostProfile'

import getPostUser from '../Services/getPostUser'
import postLike from '../Services/post/postLike'
import postUnLike from '../Services/post/postUnLike'
import postCreateComment from '../Services/post/costCreateComment'
import postDeleteComment from '../Services/post/deleteComment'
import postDelete from '../Services/post/deletePost'
import putPost from '../Services/post/putPost'

export default function PostAndLikes({ activeTab, setActiveTab }) {
  const [postUser, setPostUser] = useState(null)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [comments, setComments] = useState({})
  console.log('comments', comments)

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
  const [deleteCommentModal, setDeleteCommentModal] = useState(false)
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
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(null)
      }

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
    const tempId = Date.now()
    const tempComment = {
      id: tempId,
      text: newComment,
      user: user?.name || 'You',
      userId: currentUserId,
      userImage: user?.image,
      timestamp: new Date().toLocaleTimeString(),
      _id: `temp-${tempId}`,
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

      if (result.status >= 400) throw new Error(result.error)

      if (result.data) {
        setComments(prev => ({
          ...prev,
          [postId]: (prev[postId] || []).map(comment =>

            comment.id === tempId
              ? {
                _id: result.data._id,
                text: result.data.text || commentText,
                user: result.data.user?.name || user?.name,
                userId: result.data.user?._id || currentUserId,
                userImage: result.data.user?.image || user?.image,
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
        [postId]: (prev[postId] || []).filter(c => c.id !== tempId),
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

  const handleDeleteComment = async (postId, commentId) => {
    setDeleteCommentModal(true)

    try {
      await postDeleteComment(commentId, postId)
      setComments(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(comment => comment._id !== commentId),
      }))
    } catch (error) {
      console.error('Error deleting comment:', error)
    } finally {
      setLoading(prev => ({ ...prev, [`delete-${commentId}`]: false }))
    }

    setDeleteCommentModal(false)
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

  const canDeleteComment = useCallback(
    commentUserId => {
      if (!currentUserId || !commentUserId) return false
      return String(commentUserId) === String(currentUserId)
    },
    [currentUserId],
  )

  const isPostOwner = post => {
    return post.user._id === currentUserId
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      {/* Delete comment confirmation modal */}
      <ModalDeletePost
        deleteModal={deleteModal}
        closeDeleteModal={closeDeleteModal}
        handleDeleteComment={handleDeleteComment}
        loading={loading}
      />

      {/* Tabs */}
      <SelectPostAndLikes activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Posts */}
      {activeTab === 'Posts' && postUser && (
        <div className="space-y-6">
          {postUser.map(post => (
            <CardPostProfile
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              formatDate={formatDate}
              formatTime={formatTime}
              postMenu={postMenu}
              togglePostMenu={togglePostMenu}
              isPostOwner={isPostOwner}
              handleEditPost={handleEditPost}
              handleDeletePost={handleDeletePost}
              handleReportPost={handleReportPost}
              loading={loading}
              editPost={editPost}
              editContent={editContent}
              setEditContent={setEditContent}
              cancelEdit={cancelEdit}
              getLikeCount={getLikeCount}
              likedPosts={likedPosts}
              handleLike={handleLike}
              comments={comments}
              toggleComments={toggleComments}
              showComments={showComments}
              canDeleteComment={canDeleteComment}
              commentMenu={commentMenu}
              toggleCommentMenu={toggleCommentMenu}
              openDeleteModal={openDeleteModal}
              user={user}
              commentInputRefs={commentInputRefs}
              newComment={newComment}
              setNewComment={setNewComment}
              handleAddComment={handleAddComment}
              showEmojiPicker={showEmojiPicker}
              toggleEmojiPicker={toggleEmojiPicker}
              emojiPickerRef={emojiPickerRef}
              insertEmojiInComment={insertEmojiInComment}
              truncateText={truncateText}
              needsTruncation={needsTruncation}
              toggleExpand={toggleExpand}
              expandedPosts={expandedPosts}
              handleDeleteComment={handleDeleteComment}
            />
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
