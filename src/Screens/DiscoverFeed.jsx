import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaEllipsisH,
  FaTrash,
  FaRegEnvelope,
  FaPlay,
  FaBookmark,
  FaRegBookmark,
} from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'

import Header from '../Components/Header'
import FollowRecomend from '../Components/Follow/FollowRecomend'
import CardProfile from '../Components/profile/CardProfile'
import TopFollowersCardMock from '../Components/Follow/TopFollow'
import getFeed from '../Services/post/getFeed'
import FeedPostCard from '../Components/FeedPostCard'

const HomePage = () => {
  const [postUser, setPostUser] = useState([])
  const [showComments, setShowComments] = useState(null)
  const [expandedPosts, setExpandedPosts] = useState(new Set())
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set())
  const [loading, setLoading] = useState({})

  /* ================= FEED ================= */
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await getFeed()
        if (res?.status === 200) {
          setPostUser(res.data)
        }
      } catch (error) {
        console.error('Error cargando feed', error)
      }
    }
    fetchFeed()
  }, [])

  /* ================= HELPERS ================= */
  const truncateText = (text, postId) => {
    if (!text) return ''
    if (text.length > 150 && !expandedPosts.has(postId)) {
      return text.slice(0, 150) + '...'
    }
    return text
  }

  const toggleExpand = postId => {
    const set = new Set(expandedPosts)
    set.has(postId) ? set.delete(postId) : set.add(postId)
    setExpandedPosts(set)
  }

  const getLikeCount = post => {
    const baseLikes = Array.isArray(post.likes) ? post.likes.length : 0
    return likedPosts.has(post._id) ? baseLikes + 1 : baseLikes
  }

  const formatDate = date =>
    new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })

  const toggleComments = postId =>
    setShowComments(showComments === postId ? null : postId)

  const handleLike = async postId => {
    setLoading(p => ({ ...p, [postId]: true }))
    await new Promise(r => setTimeout(r, 400))
    const set = new Set(likedPosts)
    set.has(postId) ? set.delete(postId) : set.add(postId)
    setLikedPosts(set)
    setLoading(p => ({ ...p, [postId]: false }))
  }

  const handleBookmark = postId => {
    const set = new Set(bookmarkedPosts)
    set.has(postId) ? set.delete(postId) : set.add(postId)
    setBookmarkedPosts(set)
  }

  return (
    <>
      <Header />

      <div className="flex min-h-screen justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="mx-auto max-w-8xl px-4 py-6">
          <div className="flex gap-6 ">
            {/* FEED */}
            <div className="min-w-2xl  flex-1 space-y-6">
             {postUser.map(post => (
                <FeedPostCard key={post._id} post={post} />  
                ))}
            </div>

            {/* SIDEBAR */}
            <div className="hidden w-80 lg:block">
              <div className="sticky top-24 space-y-6">
                <CardProfile />
                <TopFollowersCardMock />
                <FollowRecomend />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage
