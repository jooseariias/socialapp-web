import { motion, AnimatePresence } from 'framer-motion'
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
  FaTrashAlt,
  FaShare,
  FaPaperPlane,
} from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const CardPost = ({
  expanded,
  setExpanded,
  liked,
  bookmarked,
  setBookmarked,
  setShowModal,
  showComments,
  setShowComments,
  comment,
  setComment,
  loading,
  commentLoading,
  comments,
  commentsEndRef,
  truncate,
  formatDate,
  handleLike,
  handleAddComment,
  currentUser,
  isCurrentUserComment,
  postImage,
  postContent,
  postUser,
  postLikes,
  handleDeleteClick,
  post,
}) => {

  const [userCheck] = useState(false)


  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/40 via-purple-900/40 to-slate-800/40 p-8 shadow-sm backdrop-blur-sm"
    >
      <Link to={`/AddFollow/${postUser._id}`}>
        <div className="flex justify-between">
          <div className="flex gap-4">
            <img
              src={postUser.image}
              alt={postUser.name}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white/80">{postUser.name}</h3>
                {userCheck && (
                <IoMdCheckmarkCircle className="text-blue-500" />
                )}
              </div>
              <p className="text-sm text-white/50">
                {postUser.username} • {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-4 break-words text-white">
        <p className='text-md font-medium'>{truncate(postContent)}</p>

        {postContent.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300"
          >
            {expanded ? 'View less' : 'View more'}
          </button>
        )}
      </div>
      {postImage && (
        <div
          className="mt-5 cursor-pointer overflow-hidden rounded-xl"
          onClick={() => setShowModal(true)}
        >
          <img
            src={postImage}
            alt="post"
            className="max-h-[520px] w-full object-cover transition-opacity hover:opacity-95"
          />
        </div>
      )}

      <div className="mt-4 flex justify-between text-sm font-medium text-white/60">
        <span>{postLikes.length + (liked ? 1 : 0)} Likes</span>
        <span className='hover:cursor-pointer hover:scale-105'  onClick={() => setShowComments(!showComments)}>{comments.length} comments</span>
      </div>

      <div className="mt-4 flex border-t border-white/10 font-semibold pt-4">
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex flex-1 items-center  justify-center gap-2 transition ${
            liked ? 'text-red-500' : 'text-white/60 hover:text-white'
          } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
          {loading ? '...' : 'MyLike'}
        </button>

        {/* Botón Comment para mostrar/ocultar comentarios */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex flex-1 items-center justify-center gap-2 text-white/60 hover:text-white"
        >
          <FaRegComment />
          Comment
        </button>

        {/* Botón Share reemplazando a FaRegEnvelope */}
        <button className="flex flex-1 items-center justify-center gap-2 text-white/60 hover:text-white">
          <FaShare />
          Share
        </button>
      </div>

      {/* INPUT DE COMENTARIO SEPARADO - SIEMPRE VISIBLE */}
      <div className="mt-4 border-t border-white/10 pt-4">
        <form onSubmit={handleAddComment} className="flex items-center gap-2">
          {currentUser && (
            <img
              src={currentUser.image}
              alt={currentUser.name}
              className="h-10 w-10 flex-shrink-0 rounded-full object-cover border border-white/10"
            />
          )}
          <div className="flex-1">
            <input
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={currentUser ? 'Write a comment...' : 'Sign in to comment'}
              disabled={commentLoading || !currentUser}
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-purple-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
            />
          </div>
          
          {/* BOTÓN "PUBLICAR" MEJORADO */}
          <button
            type="submit"
            disabled={!comment.trim() || commentLoading || !currentUser}
            className={`relative flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 ${
              comment.trim() && !commentLoading && currentUser
                ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-purple-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 hover:scale-[1.02] active:scale-95'
                : 'cursor-not-allowed bg-white/5 text-white/30'
            }`}
          >
            {commentLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                <span>Commenting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FaPaperPlane className="text-sm" />
                <span>Comment</span>
              </div>
            )}
          </button>
        </form>
      </div>

      {/* SECCIÓN DE COMENTARIOS EN LA CARD - ACTUALIZADA */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {/* Lista de comentarios */}
            <div className="mt-4 max-h-64 space-y-4 overflow-y-auto pr-2">
              {comments.length === 0 ? (
                <p className="py-4 text-center text-sm text-white/50">no comments yet</p>
              ) : (
                comments.map(commentItem => (
                  <div
                    key={commentItem._id}
                    className="group flex items-start gap-4 rounded-lg px-2 py-3 transition-all duration-200 hover:bg-white/2"
                  >
                    {/* Avatar circular con bordes sutiles */}
                    <div className="relative shrink-0">
                      <img
                        src={commentItem.user?.image}
                        className="h-9 w-9 rounded-full border border-white/10 object-cover"
                        alt={`Foto de perfil de ${commentItem.user?.username}`}
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      {/* Contenedor principal del comentario */}
                      <div className="rounded-2xl rounded-tl-none bg-white/3 px-4 py-3 backdrop-blur-sm">
                        {/* Nombre de usuario con decoración sutil */}
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {commentItem.user?.username}
                          </span>
                          {isCurrentUserComment(commentItem.user?._id) && (
                            <span className="rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-2 py-0.5 text-xs text-blue-300">
                              Tú
                            </span>
                          )}
                        </div>

                        {/* Texto del comentario con mejor legibilidad */}
                        <p className="text-sm leading-relaxed font-light break-words text-white/90">
                          {commentItem.text}
                        </p>
                      </div>

                      {/* Metadatos y acciones - alineados visualmente */}
                      <div className="mt-2.5 flex items-center gap-5 pl-1">
                        <span className="text-xs font-medium tracking-wide text-white/50">
                          {formatDate(commentItem.createdAt)}
                        </span>

                        {/* Acciones con íconos más modernos */}
                        <div className="flex items-center gap-3">
                          {/* Acción de eliminar con animación suave */}
                          {isCurrentUserComment(commentItem.user?._id) && (
                            <button
                              onClick={() => handleDeleteClick(post._id, commentItem._id)}
                              className="flex items-center hover:cursor-pointer gap-1 text-white/40 opacity-20 transition-all duration-300 group-hover:opacity-100 hover:scale-105 hover:text-red-400"
                              title="delete comment"
                            >
                              <FaTrashAlt size={11} />
                              <span className="text-xs ">Eliminar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={commentsEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default CardPost