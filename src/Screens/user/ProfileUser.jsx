import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  FaRegHeart,
  FaRegImage,
  FaUserFriends,
  FaSave,
  FaTimes,
  FaCloudUploadAlt,
  FaImage,
} from 'react-icons/fa'

import { useUserStore } from '../../Store/useUserStore'
import Header from '../../Components/Header'

import ProfileUserCard from '../../Components/ProfileUserCard'
import StatsCard from '../../Components/StatsCard'
import PostAndLIkes from '../../Components/PostAndLIkes'

const ProfileUser = () => {
  const { user, loading, updateUser, updateUserLocal } = useUserStore()
  const [activeTab, setActiveTab] = useState('Posts')
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    image: null,
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const fileInputRef = useRef(null)

  const formatNumber = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

  if (loading)
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#2b0a3d]">
        <div className="text-xl text-white">Cargando perfil...</div>
      </div>
    )

  const profileData = {
    name: user?.name || 'Sin nombre',
    username: user?.username || '@username',
    bio: user?.description || 'No tienes descripción',
    location: user?.location || 'Sin ubicación',
    tier: user?.role || 'User',
    profileImage:
      user?.image ||
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    stats: {
      posts: user?.postsCount || 0,
      followers: user?.followers?.length || 0,
      following: user?.following?.length || 0,
    },
    posts: user?.posts || [],
  }

  const statIcons = {
    posts: <FaRegImage />,
    followers: <FaUserFriends />,
    following: <FaUserFriends />,
  }

  const startEditing = field => {
    setEditing(field)
    setFormData({
      description: user?.description || '',
      location: user?.location || '',
      image: null,
    })
    setImagePreview(null)
  }

  const cancelEditing = () => {
    setEditing(null)
    setFormData({
      description: '',
      location: '',
      image: null,
    })
    setImagePreview(null)
    setUploadLoading(false)
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    if (name === 'description' && value.length > 150) return
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB')
        return
      }

      setFormData(prev => ({
        ...prev,
        image: file,
      }))

      const reader = new FileReader()
      reader.onload = e => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      setUploadLoading(true)

      const submitData = new FormData()
      let updatedFields = {}

      if (editing === 'bio') {
        submitData.append('description', formData.description)
        updatedFields = { description: formData.description }
      } else if (editing === 'location') {
        submitData.append('location', formData.location)
        updatedFields = { location: formData.location }
      } else if (editing === 'image' && formData.image) {
        submitData.append('image', formData.image)
        if (imagePreview) {
          updatedFields = { image: imagePreview }
        }
      }

      // ACTUALIZACIÓN INMEDIATA EN EL ESTADO LOCAL
      if (Object.keys(updatedFields).length > 0) {
        updateUserLocal(updatedFields)
      }

      // LLAMADA A LA API
      await updateUser(submitData)

      setEditing(null)
      setUploadLoading(false)
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error al actualizar el perfil. Intenta nuevamente.')
      setUploadLoading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex min-h-screen w-full bg-[#2b0a3d]"
      >
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-[80px]" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-purple-500/20 blur-[80px]" />

        <div className="relative z-10 mx-auto w-full max-w-2xl px-4">
          <div className="px-4 pb-8">
            <ProfileUserCard
              user={user}
              profileData={profileData}
              startEditing={startEditing}
              editing={editing}
              formData={formData}
              handleSave={handleSave}
              handleInputChange={handleInputChange}
              cancelEditing={cancelEditing}
              imagePreview={imagePreview}
              triggerFileInput={triggerFileInput}
              fileInputRef={fileInputRef}
              uploadLoading={uploadLoading}
              handleImageChange={handleImageChange}
              FaSave={FaSave}
              FaTimes={FaTimes}
              FaCloudUploadAlt={FaCloudUploadAlt}
              FaImage={FaImage}
            />

            <StatsCard
              profileData={profileData}
              statIcons={statIcons}
              formatNumber={formatNumber}
            />

            <PostAndLIkes activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default ProfileUser
