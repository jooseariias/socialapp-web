import { useState, useEffect, useRef, useCallback } from 'react'

import { useUserStore } from '../Store/useUserStore'

import postLike from '../Services/post/postLike'
import postUnLike from '../Services/post/postUnLike'
import postDeleteComment from '../Services/post/deleteComment'
import postCreateComment from '../Services/post/costCreateComment'

export const usePostActions = (post, onCommentUpdate) => {
  const { user: currentUser } = useUserStore()

  const [expanded, setExpanded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)

  // Estados para el modal de confirmación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Estado único para todos los comentarios
  const [comments, setComments] = useState(() => {
    return Array.isArray(post?.comments) ? post.comments : []
  })

  // Referencias para scroll
  const commentsEndRef = useRef(null)
  const modalCommentsEndRef = useRef(null)
  const prevCommentsLengthRef = useRef(comments.length)

  // Verificar si el usuario actual ya dio like al post
  useEffect(() => {
    if (currentUser && post?.likes) {
      const userLiked = post.likes.some(like => like.user?._id === currentUser._id)
      setLiked(userLiked)
    }
  }, [currentUser, post])

  // Scroll al final cuando se agregan NUEVOS comentarios (en card)
  useEffect(() => {
    if (showComments && comments.length > prevCommentsLengthRef.current) {
      setTimeout(() => {
        if (commentsEndRef.current) {
          commentsEndRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          })
        }
      }, 100)
    }

    prevCommentsLengthRef.current = comments.length
  }, [comments.length, showComments])

  // Scroll en modal cuando se agregan comentarios
  useEffect(() => {
    if (showModal && comments.length > prevCommentsLengthRef.current) {
      setTimeout(() => {
        if (modalCommentsEndRef.current) {
          modalCommentsEndRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          })
        }
      }, 100)
    }
  }, [comments.length, showModal])

  // Verificar que post existe
  if (!post) return null

  const truncate = text => {
    if (!text) return ''
    return text.length > 150 && !expanded ? text.slice(0, 150) + '...' : text
  }

  const formatDate = date => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleLike = async () => {
    if (!currentUser) {
      alert('Debes iniciar sesión para dar like')
      return
    }

    setLoading(true)
    try {
      if (liked) {
        const result = await postUnLike(post._id)
        if (result.status === 200) {
          setLiked(false)
        }
      } else {
        const result = await postLike(post._id)
        if (result.status === 200) {
          setLiked(true)
        }
      }
    } catch (error) {
      console.error('Error al dar/quitar like:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleAddComment = async e => {
    e.preventDefault()
    if (!currentUser || !comment.trim()) return

    setCommentLoading(true)
    try {
      const result = await postCreateComment(post._id, comment.trim())

      if (result.status === 200 || result.status === 201) {
        // 1. Obtenemos el array de comentarios que viene del BACKEND (data.comments)
        const commentsFromBackend = result.data.comments

        // 2. Mapeamos esos comentarios para asegurarnos de que el usuario actual
        // tenga sus datos completos (imagen, nombre) si el backend no los envía completos
        const updatedComments = commentsFromBackend.map(c => {
          // Si el ID del usuario del comentario coincide con el logueado,
          // nos aseguramos de inyectar los datos del Store por si acaso
          if (String(c.user?._id || c.user) === String(currentUser._id)) {
            return {
              ...c,
              user: {
                _id: currentUser._id,
                name: currentUser.name,
                username: currentUser.username,
                image: currentUser.image,
              },
            }
          }
          return c
        })

        // 3. Reemplazamos TODO el estado con la lista real del servidor
        // Ordenar por fecha si es necesario (el back suele enviarlos ya ordenados)
        setComments(updatedComments.reverse()) // .reverse() solo si quieres el más nuevo arriba

        setComment('')
        if (!showComments) setShowComments(true)

        if (onCommentUpdate) {
          onCommentUpdate(post._id, updatedComments.length)
        }
      }
    } catch (error) {
      console.error('Error al comentar:', error)
    } finally {
      setCommentLoading(false)
    }
  }
  // Función para abrir el modal de confirmación
  const handleDeleteClick = (commentOwnerId, commentId) => {
    setCommentToDelete({ commentOwnerId, commentId })
    setShowDeleteConfirm(true)
  }

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    if (!commentToDelete) return

    const { commentOwnerId, commentId } = commentToDelete
    setDeleteLoading(true)

    try {
      const result = await postDeleteComment(commentId, commentOwnerId)
      if (result.status === 200) {
        // Eliminar del estado
        setComments(prev => prev.filter(c => c._id !== commentId))
        // Cerrar modal
        setShowDeleteConfirm(false)
        setCommentToDelete(null)
      }
    } catch (error) {
      console.error('Error al eliminar comentario:', error)
      alert('Error al eliminar el comentario')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setCommentToDelete(null)
  }

  // CORREGIDO: Comparar correctamente los IDs
  const isCurrentUserComment = useCallback(
    commentUserId => {
      if (!currentUser || !commentUserId) return false
      return String(commentUserId) === String(currentUser._id || currentUser.id)
    },
    [currentUser],
  )
  const isTempComment = id => String(id).startsWith('temp_')

  // Manejar valores por defecto
  const postImage = post?.image || ''
  const postContent = post?.content || ''
  const postUser = post?.user || {}
  const postLikes = Array.isArray(post?.likes) ? post.likes : []

  return {
    expanded,setExpanded,
    liked,setLiked,
    bookmarked,setBookmarked,
    showModal,setShowModal,
    showComments,setShowComments,
    comment,setComment,
    loading,setLoading,
    commentLoading,setCommentLoading,
    showDeleteConfirm,setShowDeleteConfirm,
    commentToDelete,setCommentToDelete,
    deleteLoading,setDeleteLoading,
    comments,setComments,
    commentsEndRef,modalCommentsEndRef,prevCommentsLengthRef,
    truncate,formatDate,
    handleLike,handleAddComment,currentUser,
    isCurrentUserComment,isTempComment,postImage,postContent,postUser,postLikes,
    handleDeleteClick,handleConfirmDelete,handleCancelDelete
  }
}
