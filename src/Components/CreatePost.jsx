import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaImage, FaTimes, FaPaperPlane, FaRegSmile } from 'react-icons/fa'
import EmojiPicker from 'emoji-picker-react'
import { useUserStore } from '../Store/useUserStore'
import createPost from '../Services/postCont'

const CreatePost = ({ isOpen, onClose, onPostCreated }) => {
  
  const { user } = useUserStore()

  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showContentWarning, setShowContentWarning] = useState(false)

  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  const insertAtCursor = text => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const newValue = content.substring(0, start) + text + content.substring(end)
    setContent(newValue)

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length
      textarea.focus()
    }, 20)
  }

  const handleEmojiClick = emojiData => {
    insertAtCursor(emojiData.emoji)
    setShowEmojiPicker(false)
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Select a valid image')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('The image must be smaller than 5MB')
      return
    }

    setImage(file)
    setError('')

    const reader = new FileReader()
    reader.onload = e => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const triggerFileInput = () => fileInputRef.current?.click()

  const validatePost = () => {
    if (!content.trim() && image) {
      setShowContentWarning(true)
      return false
    }
    return true
  }

  const handleCancel = () => {
    // Limpiar todo el contenido
    setContent('')
    setImage(null)
    setImagePreview(null)
    setError('')
    setShowContentWarning(false)
    setShowEmojiPicker(false)
    
    // Limpiar el input de archivo
    if (fileInputRef.current) fileInputRef.current.value = ''
    
    // Cerrar el modal
    onClose()
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Validar que no sea solo imagen sin contenido
    if (!content.trim() && !image) {
      setError('Add content or an image to create the post')
      return
    }

    // Validación específica para imagen sin contenido
    if (!validatePost()) {
      return
    }

    try {
      setLoading(true)
      setError('')
      setShowContentWarning(false)

      // Llamada al servicio
      const result = await createPost(content, image)

      if (result.status >= 400) {
        throw new Error(result.error || 'Error al crear el post')
      }

      // Limpiar formulario
      setContent('')
      setImage(null)
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''

      // Notificar al padre del nuevo post
      onPostCreated?.(result.post)

      // Cerrar modal
      onClose()
    } catch (err) {
      setError(err.message || 'Error al crear el post')
    } finally {
      setLoading(false)
    }
  }

  const handleContentChange = (e) => {
    setContent(e.target.value)
    // Ocultar advertencia si el usuario empieza a escribir
    if (e.target.value.trim() && showContentWarning) {
      setShowContentWarning(false)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl rounded-2xl border border-purple-500/30 bg-[#1a0630]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <h2 className="text-xl font-bold text-white">Create Post</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-white/10 p-6">
          <img
            src={
              user?.image ||
              'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            }
            className="h-10 w-10 rounded-full border-2 border-purple-400/50 object-cover"
          />
          <div>
            <p className="font-semibold text-white">{user?.name || 'Usuario'}</p>
            <p className="text-sm text-white/60">{user?.username || 'username'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative p-6">
          {showEmojiPicker && (
            <div className="absolute top-20 left-6 z-50">
              <EmojiPicker theme="dark" emojiStyle="apple" onEmojiClick={handleEmojiClick} />
            </div>
          )}

          {showContentWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4"
            >
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-yellow-300">
                  Please add a description for your image. Share what you think about it.
                </p>
              </div>
            </motion.div>
          )}

          {error && !showContentWarning && (
            <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-4">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            placeholder="What are you thinking?"
            className="custom-scroll mt-4 w-full resize-none overflow-y-auto bg-transparent text-lg text-white placeholder-white/60 outline-none"
            rows="4"
          />

          {imagePreview && (
            <div className="relative mt-4 overflow-hidden rounded-xl border border-white/10">
              <img src={imagePreview} className="max-h-40 w-full object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white"
              >
                <FaTimes size={16} />
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={triggerFileInput}
                className="flex items-center gap-2 rounded-lg p-3 text-purple-400 hover:bg-white/10 hover:text-purple-300"
              >
                <FaImage size={20} />
                <span className="hidden sm:block">Image</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div>
                <button
                  type="button"
                  className="rounded-lg p-2 text-yellow-300 hover:bg-white/10"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <FaRegSmile size={22} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-xl border border-gray-500/50 px-6 py-3 font-semibold text-gray-300 hover:bg-gray-800/50 hover:text-white"
              >
                <FaTimes size={14} />
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                disabled={loading || (!content.trim() && !image)}
                whileHover={{ scale: loading || (!content.trim() && !image) ? 1 : 1.02 }}
                whileTap={{ scale: loading || (!content.trim() && !image) ? 1 : 0.98 }}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 ${
                  !content.trim() && !image
                    ? 'cursor-not-allowed bg-gray-700'
                    : 'bg-gradient-to-r from-purple-500 via-purple-600 to-fuchsia-600 hover:from-purple-600 hover:via-purple-700 hover:to-fuchsia-700 active:scale-[0.98]'
                } ${showContentWarning ? 'animate-pulse border-2 border-yellow-500' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={16} />
                    Post
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default CreatePost