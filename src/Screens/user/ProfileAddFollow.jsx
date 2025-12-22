import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'

import { 
  FaUserPlus, 
  FaUserTimes, 
  FaFlag,
  FaRegImage, 
  FaUserFriends,
  FaEllipsisH,
  FaEdit,
  FaTrash,
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaShare,
  FaPaperPlane,
  FaRegSmile
} from 'react-icons/fa'
import { MdMoreHoriz } from 'react-icons/md'
import { IoLocationOutline} from 'react-icons/io5'

import EmojiPicker from 'emoji-picker-react'
import Header from '../../Components/Header'
import formatNumber from '../../Utils/formatNumber'
import getUserById from '../../Services/User/getUserById'

import postCreateComment from '../../Services/post/costCreateComment'
import postDeleteComment from '../../Services/post/deleteComment'
import postLike from '../../Services/post/postLike'
import postUnLike from '../../Services/post/postUnLike'

import { followUser } from '../../Services/follow/follow'
import { unFollow } from '../../Services/follow/unFollow'

export default function ProfileAddFollow() {
  const [isFollowing, setIsFollowing] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [activeTab, setActiveTab] = useState('Posts')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingFollow, setLoadingFollow] = useState(false)
  const { id } = useParams()
  const [activePost, setActivePost] = useState(null)

  
  // Estados para posts
  const [postMenu, setPostMenu] = useState(null)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [comments, setComments] = useState({})
  const [showComments, setShowComments] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(null)
  const [expandedPosts, setExpandedPosts] = useState(new Set())
  const [commentMenu, setCommentMenu] = useState(null)
  const [loadingComments, setLoadingComments] = useState({})
  const [loadingLikes, setLoadingLikes] = useState({})
  
  const statIcons = {
    posts: <FaRegImage />,
    followers: <FaUserFriends />,
    following: <FaUserFriends />,
  }

  // Refs
  const emojiPickerRef = useRef(null)

  // Obtener datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const res = await getUserById(id)
        const user = res?.data || res
        setUserData(user)
        
        // Inicializar los posts que ya le gustaron desde postsCreated
        if (user.postsCreated && user.postsCreated.length > 0) {
          const likedSet = new Set()
          user.postsCreated.forEach(post => {
            if (post.likes && post.likes.includes(user._id)) {
              likedSet.add(post._id)
            }
          })
          setLikedPosts(likedSet)
        }
        
        // Aquí deberías verificar si el usuario actual sigue a este usuario
        // Como no tienes esa info en el backend, manejaremos el estado localmente
        // Podrías agregar un endpoint que verifique esto
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  // Funciones para seguir/dejar de seguir
  const handleFollowToggle = async () => {
    if (!userData) return
    
    try {
      setLoadingFollow(true)
      
      if (isFollowing) {
        // Dejar de seguir
        const response = await unFollow(userData._id)
        
        if (response.status === 200) {
          setIsFollowing(false)
          // Actualizar contador de seguidores
          setUserData(prev => ({
            ...prev,
            followers: Math.max(0, (prev.followers || 0) - 1)
          }))
   
        } else {
          alert('Error al dejar de seguir')
        }
      } else {
        // Seguir
        const response = await followUser(userData._id)
        
        if (response.status === 200 || response.status === 201) {
          setIsFollowing(true)
          // Actualizar contador de seguidores
          setUserData(prev => ({
            ...prev,
            followers: (prev.followers || 0) + 1
          }))
      
        } else {
          alert('Error al seguir')
        }
      }
    } catch (error) {
      console.error('Error al seguir/dejar de seguir:', error)
      alert('Ocurrió un error al realizar la acción')
    } finally {
      setLoadingFollow(false)
    }
  }

  const handleReport = () => {
    
    alert('Reporte enviado')
    setShowReport(false)
  }

  // Funciones para posts
  const togglePostMenu = (postId, e) => {
    e?.stopPropagation()
    setPostMenu(postMenu === postId ? null : postId)
  }

  const handleReportPost = (postId) => {
 
    alert('Post reportado')
    setPostMenu(null)
  }

  // Función para dar like a un post
  const handleLike = async (postId) => {
    try {
      setLoadingLikes(prev => ({ ...prev, [postId]: true }))
      
      if (likedPosts.has(postId)) {
        // Quitar like
        const response = await postUnLike(postId)
        if (response.status === 200) {
          setLikedPosts(prev => {
            const newSet = new Set(prev)
            newSet.delete(postId)
            return newSet
          })
          // Actualizar el post en userData
          updatePostLikes(postId, false)
        }
      } else {
        // Dar like
        const response = await postLike(postId)
        if (response.status === 200) {
          setLikedPosts(prev => {
            const newSet = new Set(prev)
            newSet.add(postId)
            return newSet
          })
          // Actualizar el post en userData
          updatePostLikes(postId, true)
        }
      }
    } catch (error) {
      console.error('Error al dar/quitar like:', error)
    } finally {
      setLoadingLikes(prev => ({ ...prev, [postId]: false }))
    }
  }

  // Actualizar likes en el post de userData
  const updatePostLikes = (postId, isLiking) => {
    if (!userData || !userData.postsCreated) return
    
    setUserData(prev => {
      const updatedPosts = prev.postsCreated.map(post => {
        if (post._id === postId) {
          const currentLikes = post.likes || []
          if (isLiking) {
            // Agregar el like
            return {
              ...post,
              likes: [...currentLikes, userData._id]
            }
          } else {
            // Quitar el like
            return {
              ...post,
              likes: currentLikes.filter(id => id !== userData._id)
            }
          }
        }
        return post
      })
      
      return {
        ...prev,
        postsCreated: updatedPosts
      }
    })
  }

  // Función para obtener cantidad de likes de un post
  const getLikeCount = (post) => {
    return post.likes?.length || 0
  }

  // Función para obtener cantidad de comentarios de un post
  const getCommentCount = (post) => {
    return post.comments?.length || 0
  }

  const toggleComments = async (postId) => {
    setShowComments(showComments === postId ? null : postId)
    
    // Cargar comentarios del post si no están cargados
    if (!comments[postId]) {
      const post = getUserCreatedPosts().find(p => p._id === postId) || 
                   getUserLikedPosts().find(p => p._id === postId)
      
      if (post && post.comments) {
        setComments(prev => ({
          ...prev,
          [postId]: post.comments.map(comment => ({
            _id: comment._id || Date.now().toString(),
            user: comment.user?.name || comment.user?.user?.name || 'Usuario',
            userImage: comment.user?.image || comment.user?.user?.image || 'https://via.placeholder.com/40',
            text: comment.text || comment.content || 'Comentario',
            createdAt: comment.createdAt || new Date().toISOString(),
            userId: comment.user?._id || comment.user?.user?._id
          }))
        }))
      }
    }
  }

  const canDeleteComment = (comment) => {
    // Solo el usuario que comentó puede eliminar su comentario
    return comment.userId === userData?._id
  }

  const toggleCommentMenu = (commentId, e) => {
    e?.stopPropagation()
    setCommentMenu(commentMenu === commentId ? null : commentId)
  }

  const handleDeleteComment = async (postId, commentId) => {
    try {
      setLoadingComments(prev => ({ ...prev, [commentId]: true }))
      
      const response = await postDeleteComment(postId, commentId)
      
      if (response.status === 200) {
        // Eliminar el comentario del estado
        setComments(prev => ({
          ...prev,
          [postId]: prev[postId].filter(comment => comment._id !== commentId)
        }))
        
        // Actualizar el post en userData
        updatePostComments(postId, commentId)
      } else {
        alert('Error al eliminar el comentario')
      }
    } catch (error) {
      console.error('Error al eliminar comentario:', error)
      alert('Error al eliminar el comentario')
    } finally {
      setLoadingComments(prev => ({ ...prev, [commentId]: false }))
      setCommentMenu(null)
    }
  }

  // Actualizar comentarios en el post de userData
  const updatePostComments = (postId, commentId) => {
    if (!userData || !userData.postsCreated) return
    
    setUserData(prev => {
      const updatedPosts = prev.postsCreated.map(post => {
        if (post._id === postId) {
          const currentComments = post.comments || []
          return {
            ...post,
            comments: currentComments.filter(comment => 
              comment._id !== commentId && 
              comment.user?._id !== commentId
            )
          }
        }
        return post
      })
      
      return {
        ...prev,
        postsCreated: updatedPosts
      }
    })
  }

  const toggleEmojiPicker = (postId, e) => {
    e?.stopPropagation()
    setShowEmojiPicker(showEmojiPicker === postId ? null : postId)
  }

  const insertEmojiInComment = (postId, emojiData) => {
    setNewComment(prev => prev + emojiData.emoji)
    setShowEmojiPicker(null)
  }

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return
    
    try {
      setLoadingComments(prev => ({ ...prev, [postId]: true }))
      
      const response = await postCreateComment(postId, newComment)
      
      if (response.status === 200 || response.status === 201) {
        const newCommentObj = {
          _id: Date.now().toString(), // El backend debería devolver el ID real
          user: userData?.name || 'Tú',
          userImage: userData?.image,
          text: newComment,
          createdAt: new Date().toISOString(),
          userId: userData?._id
        }
        
        setComments(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newCommentObj]
        }))
        
        // Actualizar el post en userData
        updatePostWithNewComment(postId, newCommentObj)
        
        setNewComment('')
      } else {
        alert('Error al agregar comentario')
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error)
      alert('Error al agregar el comentario')
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }))
    }
  }

  // Actualizar post con nuevo comentario en userData
  const updatePostWithNewComment = (postId, newCommentObj) => {
    if (!userData || !userData.postsCreated) return
    
    setUserData(prev => {
      const updatedPosts = prev.postsCreated.map(post => {
        if (post._id === postId) {
          const currentComments = post.comments || []
          return {
            ...post,
            comments: [...currentComments, {
              _id: newCommentObj._id,
              user: {
                _id: userData._id,
                name: userData.name,
                image: userData.image,
                username: userData.username
              },
              text: newCommentObj.text,
              createdAt: newCommentObj.createdAt
            }]
          }
        }
        return post
      })
      
      return {
        ...prev,
        postsCreated: updatedPosts
      }
    })
  }

  const truncateText = (text, postId) => {
    const maxLength = 150
    if (!text) return ''
    
    if (expandedPosts.has(postId) || text.length <= maxLength) {
      return text
    }
    
    return text.slice(0, maxLength) + '...'
  }

  const needsTruncation = (text) => {
    return text && text.length > 150
  }

  const toggleExpand = (postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  // Funciones de formato
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Estadísticas del usuario
  const getUserStats = () => {
    if (!userData) return { posts: 0, followers: 0, following: 0 }
    
    return {
      posts: userData.postsCreated?.length || 0,
      followers: userData.followers || 0,
      following: userData.following || 0
    }
  }

  // Posts creados por el usuario
  const getUserCreatedPosts = () => {
    if (!userData) return []
    
    return userData.postsCreated?.map(post => ({
      _id: post._id,
      content: post.content || 'Sin contenido',
      image: post.image,
      likes: post.likes || [],
      user: {
        _id: post.user?._id || userData._id,
        name: post.user?.name || userData.name,
        image: post.user?.image || userData.image,
        username: post.user?.username || userData.username
      },
      createdAt: post.createdAt || new Date().toISOString(),
      comments: post.comments || []
    })) || []
  }

  // Posts que le gustaron al usuario (postsLiked)
  const getUserLikedPosts = () => {
    if (!userData || !userData.postsLiked) return []
    
    if (userData.postsLiked.length === 0) return []
    
    // Si postsLiked es un array de objetos de posts, los mapeamos directamente
    return userData.postsLiked.map(post => ({
      _id: post._id || `liked-${Date.now()}`,
      content: post.content || 'Post que le gustó al usuario',
      image: post.image,
      likes: post.likes || [],
      user: {
        _id: post.user?._id || 'unknown',
        name: post.user?.name || 'Usuario',
        image: post.user?.image || 'https://via.placeholder.com/40',
        username: post.user?.username || '@usuario'
      },
      createdAt: post.createdAt || new Date().toISOString(),
      comments: post.comments || []
    }))
  }

  // Renderizar una tarjeta de post
  const renderPostCard = (post) => {
    const isLiked = likedPosts.has(post._id)
    const likeCount = getLikeCount(post)
    const commentCount = getCommentCount(post)
    
    return (
      <motion.div
        key={post._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur-sm"
      >
        {/* Header del post */}
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
                <span className="text-sm text-white/60">{post.user.username}</span>
              </div>
              <div className="mt-1 text-sm text-white/60">
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Menú de tres puntos - SOLO REPORTAR */}
          <div className="relative">
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
                {/* SOLO MOSTRAR BOTÓN DE REPORTAR - NO EDITAR NI ELIMINAR */}
                <button
                  onClick={() => handleReportPost(post._id)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-orange-400"
                >
                  <FaFlag className="text-orange-400" />
                  <span>Reportar publicación</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Contenido del post */}
        <div className="mt-4">
          <div className="break-words">
            <p className="text-white">{truncateText(post.content, post._id)}</p>
            {needsTruncation(post.content) && (
              <button
                onClick={() => toggleExpand(post._id)}
                className="mt-2 text-sm text-blue-400 transition-colors hover:text-blue-300"
              >
                {expandedPosts.has(post._id) ? 'Mostrar menos' : 'Mostrar más'}
              </button>
            )}
          </div>

          {post.image && (
            <div onClick={() => setActivePost(post)}
 className="mt-4 overflow-hidden rounded-xl">
              <img
                src={post.image}
                alt="Contenido de la publicación"
                className="h-auto max-h-96 w-full object-cover"
              />
            </div>
          )}

          {/* Contadores de interacción */}
          <div className="mt-4 flex items-center justify-between text-sm text-white/60">
            <div className="flex items-center space-x-4">
              <span>{formatNumber(likeCount)} me gusta</span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => toggleComments(post._id)}
              >
                {formatNumber(commentCount)} comentarios
              </span>
            </div>
          </div>

          {/* Acciones del post */}
          <div className="mt-3 flex border-t border-white/10 pt-3">
            <button
              onClick={() => handleLike(post._id)}
              disabled={loadingLikes[post._id]}
              className={`flex flex-1 items-center justify-center gap-2 py-2 transition-colors ${
                isLiked
                  ? 'cursor-pointer text-red-500'
                  : 'cursor-pointer text-white/60 hover:text-red-500'
              } ${loadingLikes[post._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLiked ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart />
              )}
              <span className="text-sm font-medium">
                {loadingLikes[post._id] ? '...' : 'Me gusta'}
              </span>
            </button>

            <button
              onClick={() => toggleComments(post._id)}
              className="flex flex-1 items-center justify-center gap-2 py-2 text-white/60 transition-colors hover:text-white"
            >
              <FaRegComment />
              <span className="cursor-pointer text-sm font-medium">Comentar</span>
            </button>

            <button className="flex flex-1 items-center justify-center gap-2 py-2 text-white/60 transition-colors hover:text-white">
              <FaShare />
              <span className="text-sm font-medium">Compartir</span>
            </button>
          </div>

          {/* Sección de comentarios */}
          {showComments === post._id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 border-t border-white/10 pt-4"
            >
              {/* Lista de comentarios */}
              <div className="space-y-3">
                {comments[post._id]?.map(comment => (
                  <div key={comment._id} className="group flex space-x-3">
                    <img
                      src={comment.userImage}
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
                          {canDeleteComment(comment) && (
                            <div className="relative opacity-0 transition-opacity group-hover:opacity-100">
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
                                    onClick={() => handleDeleteComment(post._id, comment._id)}
                                    disabled={loadingComments[comment._id]}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-red-400 disabled:opacity-50"
                                  >
                                    <FaTrash className="text-xs text-red-400" />
                                    <span>
                                      {loadingComments[comment._id] ? 'Eliminando...' : 'Eliminar'}
                                    </span>
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

              {/* Input de nuevo comentario */}
              <div className="relative mt-4 flex items-start space-x-3">
                <img
                  src={userData?.image}
                  alt="Tu perfil"
                  className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                />
                <div className="flex flex-1 items-center rounded-2xl border border-transparent bg-white/5 px-3 py-2 transition-colors focus-within:border-blue-500">
                  <input
                    type="text"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    disabled={loadingComments[post._id]}
                    className="flex-1 border-none bg-transparent text-sm text-white placeholder-white/40 outline-none disabled:opacity-50"
                    onKeyPress={e => e.key === 'Enter' && !loadingComments[post._id] && handleAddComment(post._id)}
                  />
                  <button
                    onClick={e => toggleEmojiPicker(post._id, e)}
                    className="p-1 text-white/40 transition-colors hover:text-white/60"
                  >
                    <FaRegSmile />
                  </button>
                </div>

                {/* Selector de emojis */}
                {showEmojiPicker === post._id && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute right-0 bottom-full z-50 mb-2"
                  >
                    <EmojiPicker
                      theme="dark"
                      emojiStyle="apple"
                      onEmojiClick={emojiData => insertEmojiInComment(post._id, emojiData)}
                      searchDisabled
                      skinTonesDisabled
                      height={300}
                      width={300}
                    />
                  </div>
                )}

                <button
                  onClick={() => handleAddComment(post._id)}
                  disabled={!newComment.trim() || loadingComments[post._id]}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingComments[post._id] ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <FaPaperPlane className="text-xs" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  // Mostrar loading mientras se obtienen los datos
  if (loading) {
    return (
      <div className="min-h-screen bg-[#2b0a3d]">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Cargando perfil...</div>
        </div>
      </div>
    )
  }

  // Si no hay datos del usuario
  if (!userData) {
    return (
      <div className="min-h-screen bg-[#2b0a3d]">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">No se pudo cargar el perfil</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-[80px]" />
      <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-purple-500/20 blur-[80px]" />
      <Header />

      <div className="min-h-screen w-full bg-[#2b0a3d] pt-4">
        <div className="relative mx-auto max-w-2xl">
          {/* Sección del perfil */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-4 py-8"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img
                  src={userData?.image || '/default-avatar.png'}
                  alt={`Perfil de ${userData.name}`}
                  className="h-32 w-32 rounded-full border-4 border-purple-400/50 object-cover shadow-lg"
                />
              </motion.div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">{userData.name || 'Usuario'}</h2>
              <p className="mt-1 text-white/60">{userData.username || '@usuario'}</p>
            </div>

            {/* Botones principales */}
            <div className="mt-4 flex items-center gap-4">
              {isFollowing ? (
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowReport(true)}
                    className="flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/20 px-3 py-2 text-red-200 transition-all hover:bg-red-500/30"
                  >
                    <FaFlag size={12} />
                    <span className="text-xs">Reportar</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFollowToggle}
                    disabled={loadingFollow}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 px-5 py-2.5 font-medium text-white transition-all hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingFollow ? (
                      <span className="text-sm">...</span>
                    ) : (
                      <>
                        <FaUserTimes size={14} />
                        <span>Dejar de seguir</span>
                      </>
                    )}
                  </motion.button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowReport(true)}
                    className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/40 transition-all hover:bg-white/10 hover:text-white/60"
                    title="Reportar perfil"
                  >
                    <FaFlag size={12} />
                    <span className="text-xs">Reportar</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFollowToggle}
                    disabled={loadingFollow}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-600 px-5 py-2.5 font-medium text-white transition-all hover:from-purple-600 hover:to-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingFollow ? (
                      <span className="text-sm">...</span>
                    ) : (
                      <>
                        <FaUserPlus size={14} />
                        <span>Seguir</span>
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.section>

          {/* Estadísticas */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 px-4 pb-6"
          >
            {['posts', 'followers', 'following'].map(key => (
              <motion.div
                key={key}
                className="flex flex-1 flex-col items-center rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <span className="flex items-center gap-1 text-2xl font-bold text-white">
                  {statIcons[key]} {formatNumber(getUserStats()[key])}
                </span>
                <span className="mt-1 text-white/60 capitalize">
                  {key === 'posts' ? 'Publicaciones' : 
                   key === 'followers' ? 'Seguidores' : 'Siguiendo'}
                </span>
              </motion.div>
            ))}
          </motion.section>

          {/* Biografía */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="px-4 pb-6"
          >
            <div className="mx-auto w-full max-w-md">
              <div className="flex w-full items-start justify-center">
                <div className="min-w-0 flex-1">
                  <p className="text-center leading-relaxed break-words text-white/80">
                    {userData.description || 'Sin biografía'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ubicación y nivel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 px-4 pb-6"
          >
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <IoLocationOutline className="text-purple-300" />
              <span className="text-white/90">{userData.city || 'Ubicación no especificada'}</span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/20 px-4 py-2 backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-amber-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-amber-200">{userData.role || 'Usuario'}</span>
            </div>
          </motion.div>

          {/* Selector de pestañas */}
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

          {/* Contenido según pestaña activa */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="px-4 pb-8"
          >
            {activeTab === 'Posts' ? (
              <div className="space-y-4">
                {getUserCreatedPosts().length > 0 ? (
                  getUserCreatedPosts().map(post => renderPostCard(post))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                    <FaRegImage className="mx-auto text-4xl text-white/40" />
                    <p className="mt-4 text-white/60">No hay publicaciones aún</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {getUserLikedPosts().length > 0 ? (
                  getUserLikedPosts().map(post => renderPostCard(post))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                    <FaHeart className="mx-auto text-4xl text-white/40" />
                    <p className="mt-4 text-white/60">No hay posts que le gusten aún</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Modal de reporte */}
          {showReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
              onClick={() => setShowReport(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="w-full max-w-md rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#2b0a3d] to-[#1a0630] p-6 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600">
                    <FaFlag className="text-2xl text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">Reportar perfil</h3>
                  <p className="text-sm text-white/60">
                    ¿Estás seguro de que quieres reportar este perfil?
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-center text-white/80">
                    Reportarás a <span className="font-semibold">{userData.username || '@usuario'}</span>
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setShowReport(false)}
                      className="flex-1 rounded-xl bg-white/10 py-3 font-medium text-white transition-colors hover:bg-white/20"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleReport}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3 font-medium text-white transition-all hover:from-red-600 hover:to-red-700"
                    >
                      <FaFlag size={14} />
                      Reportar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
      {activePost && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    onClick={() => setActivePost(null)}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      onClick={e => e.stopPropagation()}
      className="relative flex max-h-[95vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#2b0a3d]"
    >
      {/* Imagen */}
      <div className="flex flex-1 items-center justify-center bg-black/40">
        <img
          src={activePost.image}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Panel derecho */}
      <div className="flex w-96 flex-col border-l border-white/10">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          <img
            src={activePost.user.image}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-white">{activePost.user.name}</p>
            <span className="text-xs text-white/50">
              {formatDate(activePost.createdAt)}
            </span>
          </div>
        </div>

        {/* Texto */}
        <div className="p-4 text-sm text-white break-words">
          {activePost.content}
        </div>

        {/* Stats */}
        <div className="flex justify-between px-4 text-sm text-white/60">
          <span>{formatNumber(getLikeCount(activePost))} me gusta</span>
          <span>
            {(comments[activePost._id] || activePost.comments || []).length} comentarios
          </span>
        </div>

        {/* Acciones */}
        <div className="mt-3 flex border-t border-white/10">
          <button
            onClick={() => handleLike(activePost._id)}
            className={`flex flex-1 items-center justify-center gap-2 py-3 ${
              likedPosts.has(activePost._id)
                ? 'text-red-500'
                : 'text-white/60 hover:text-red-400'
            }`}
          >
            {likedPosts.has(activePost._id) ? <FaHeart /> : <FaRegHeart />}
            Me gusta
          </button>

          <button
            onClick={() => toggleComments(activePost._id)}
            className="flex flex-1 items-center justify-center gap-2 py-3 text-white/60 hover:text-white"
          >
            <FaRegComment />
            Comentar
          </button>

          <button className="flex flex-1 items-center justify-center gap-2 py-3 text-white/60 hover:text-white">
            <FaShare />
            Compartir
          </button>
        </div>

        {/* Comentarios */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {(comments[activePost._id] || []).map(comment => (
            <div key={comment._id} className="flex gap-3">
              <img
                src={comment.userImage}
                className="h-8 w-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-white">
                  <b>{comment.user}</b>{' '}
                  <span className="text-white/70">{comment.text}</span>
                </p>
                <span className="text-xs text-white/40">
                  {formatTime(comment.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-white/10 p-4 flex gap-2">
          <input
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline-none"
            onKeyDown={e =>
              e.key === 'Enter' && handleAddComment(activePost._id)
            }
          />
          <button
            onClick={() => handleAddComment(activePost._id)}
            className="rounded-lg bg-blue-600 px-3 text-white"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
)}

    </div>
  )
}