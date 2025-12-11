import { motion } from 'framer-motion'
import { IoLocationOutline } from 'react-icons/io5'
import { AiFillEdit } from 'react-icons/ai'
import { FaSave, FaTimes, FaCloudUploadAlt, FaImage } from 'react-icons/fa'

export default function ProfileUserCard({
  user,
  profileData,
  startEditing,
  editing,
  formData,
  handleSave,
  handleInputChange,
  cancelEditing,
  imagePreview,
  triggerFileInput,
  fileInputRef,
  uploadLoading,
  handleImageChange,
}) {
  console.log('Rendering ProfileUserCard,',user)
  return (
    <div>
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
              src={user?.image || profileData.profileImage}
              alt="profile"
              className="h-32 w-32 rounded-full border-4 border-purple-400/50 object-cover shadow-lg"
            />
          </motion.div>
          <button
            onClick={() => startEditing('image')}
            className="bg-button absolute -right-0 -bottom-2 rounded-full p-2 text-white shadow-lg transition-colors hover:scale-105 hover:cursor-pointer hover:bg-purple-600"
          >
            <FaCloudUploadAlt size={14} />
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">{user?.name || profileData.name}</h2>
          <p className="mt-1 text-white/60">{profileData.username}</p>
        </div>
      </motion.section>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-4 pb-6"
      >
        <div className="mx-auto w-full max-w-md">
          <div className="flex w-full items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {editing === 'bio' ? (
                <div className="w-full">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-purple-400 focus:outline-none"
                    placeholder="Escribe tu descripción..."
                    autoFocus
                    maxLength={150}
                  />
                  <div className="mt-2 text-right text-sm text-white/40">
                    {formData.description.length}/150
                  </div>
                </div>
              ) : (
                <p className="text-center leading-relaxed break-words text-white/80">
                  {user?.description || profileData.bio}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              {editing === 'bio' ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1 rounded-lg text-white/80 transition-colors hover:scale-105 hover:cursor-pointer"
                    title="Guardar"
                  >
                    <FaSave size={16} />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="flex items-center gap-1 rounded-lg text-white/80 transition-colors hover:scale-105 hover:cursor-pointer"
                    title="Cancelar"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing('bio')}
                  className="text-white/60 transition-colors hover:text-purple-300"
                  title="Editar descripción"
                >
                  <AiFillEdit size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-3 px-4 pb-6"
      >
        {editing === 'location' ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
                placeholder="Tu ubicación..."
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-white transition-all hover:from-green-600 hover:to-emerald-700"
              >
                <FaSave size={14} /> Guardar
              </button>
              <button
                onClick={cancelEditing}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-2 text-white transition-all hover:from-gray-700 hover:to-gray-800"
              >
                <FaTimes size={14} /> Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <IoLocationOutline className="text-purple-300" />
            <span className="text-white/90">{user?.city || profileData.location}</span>
          </div>
        )}

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
          <span className="text-amber-200">{profileData.tier}</span>
        </div>
      </motion.div>
      {editing === 'image' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={cancelEditing}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-md rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#2b0a3d] to-[#1a0630] p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600">
                <FaCloudUploadAlt className="text-2xl text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Cambiar foto de perfil</h3>
              <p className="text-sm text-white/60">Selecciona una nueva imagen para tu perfil</p>
            </div>

            <div className="space-y-4">
              {(imagePreview || user?.image) && (
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={imagePreview || user?.image}
                      alt="Preview"
                      className="h-32 w-32 rounded-full border-4 border-purple-400/50 object-cover shadow-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                      <FaImage className="text-2xl text-white" />
                    </div>
                  </div>
                </div>
              )}

              <div
                onClick={triggerFileInput}
                className="cursor-pointer rounded-xl border-2 border-dashed border-purple-400/50 p-6 text-center transition-all hover:border-purple-400/80 hover:bg-white/5"
              >
                <FaCloudUploadAlt className="mx-auto mb-3 text-3xl text-purple-400" />
                <p className="mb-1 font-medium text-white">Selecciona una imagen</p>
                <p className="text-sm text-white/60">Arrastra o haz clic para subir</p>
                <p className="mt-2 text-xs text-white/40">PNG, JPG, JPEG (max. 5MB)</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {formData.image && (
                <div className="rounded-lg bg-white/10 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaImage className="text-purple-400" />
                      <span className="truncate text-sm text-white">{formData.image.name}</span>
                    </div>
                    <span className="text-xs text-white/60">
                      {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={cancelEditing}
                className="flex-1 rounded-xl bg-white/10 py-3 font-medium text-white transition-colors hover:bg-white/20"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.image || uploadLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-600 py-3 font-medium text-white transition-all hover:from-purple-600 hover:to-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploadLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt size={14} />
                    Subir Imagen
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
