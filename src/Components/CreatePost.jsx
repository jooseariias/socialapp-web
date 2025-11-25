import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaImage, FaTimes, FaPaperPlane, FaRegSmile } from 'react-icons/fa'
import EmojiPicker from 'emoji-picker-react'
import { useUserStore } from '../Store/useUserStore'

const CreatePost = ({ isOpen, onClose, onPostCreated }) => {
  const { user } = useUserStore()

  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

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
      setError('Selecciona una imagen válida')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe ser menor a 5MB')
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

  const handleSubmit = async e => {
    e.preventDefault()

    if (!content.trim() && !image) {
      setError('Agrega contenido o una imagen para crear el post')
      return
    }

    try {
      setLoading(true)
      setError('')

      const formData = new FormData()
      if (content.trim()) formData.append('content', content)
      if (image) formData.append('image', image)

      const response = await fetch('http://localhost:8000/api/create-post', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText)
      }

      const result = await response.json()

      setContent('')
      setImage(null)
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''

      onPostCreated?.(result.post)
      onClose()
    } catch (err) {
      setError(err.message || 'Error al crear el post')
    } finally {
      setLoading(false)
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

          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="¿Qué estás pensando?"
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

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={triggerFileInput}
                className="flex items-center gap-2 rounded-lg p-3 text-purple-400 hover:bg-white/10 hover:text-purple-300"
              >
                <FaImage size={20} />
                <span className="hidden sm:block">Foto</span>
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

            <motion.button
              type="submit"
              disabled={loading || (!content.trim() && !image)}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white ${
                !content.trim() && !image
                  ? 'cursor-not-allowed bg-gray-500'
                  : 'bg-gradient-to-r from-purple-500 to-fuchsia-600'
              } `}
            >
              {loading ? (
                'Publicando...'
              ) : (
                <>
                  <FaPaperPlane size={16} />
                  Publicar
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default CreatePost
