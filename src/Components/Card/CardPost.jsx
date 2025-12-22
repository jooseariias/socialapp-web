import { motion, AnimatePresence } from 'framer-motion'
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaEllipsisH,
  FaRegEnvelope,
  FaBookmark,
  FaRegBookmark,
  FaTrash,
} from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { Link } from 'react-router-dom'

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
  post
}) => {
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
                <h3 className="font-semibold text-white">{postUser.name}</h3>
                <IoMdCheckmarkCircle className="text-blue-500" />
              </div>
              <p className="text-sm text-white/50">
                {postUser.username} • {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          <button className="text-white/40 hover:text-white">
            <FaEllipsisH />
          </button>
        </div>
      </Link>

      <div className="mt-4 break-words text-white">
        <p>{truncate(postContent)}</p>

        {postContent.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300"
          >
            {expanded ? 'Ver menos' : 'Ver más'}
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

      <div className="mt-4 flex justify-between text-sm text-white/60">
        <span>{postLikes.length + (liked ? 1 : 0)} likes</span>
        <span>{comments.length} comments</span>
      </div>

      <div className="mt-4 flex border-t border-white/10 pt-4">
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex flex-1 items-center justify-center gap-2 transition ${
            liked ? 'text-red-500' : 'text-white/60 hover:text-white'
          } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
          {loading ? '...' : 'Like'}
        </button>

        {/* Botón Comment para mostrar/ocultar comentarios */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex flex-1 items-center justify-center gap-2 text-white/60 hover:text-white"
        >
          <FaRegComment />
          Comment
        </button>

        <button className="flex flex-1 items-center justify-center gap-2 text-white/60 hover:text-white">
          <FaRegEnvelope />
          Share
        </button>

        <button
          onClick={() => setBookmarked(!bookmarked)}
          className={`flex items-center gap-2 px-2 ${
            bookmarked ? 'text-blue-500' : 'text-white/60 hover:text-white'
          }`}
        >
          {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>

      {/* INPUT DE COMENTARIO SEPARADO - SIEMPRE VISIBLE */}
      <div className="mt-4 border-t border-white/10 pt-4">
        <form onSubmit={handleAddComment} className="flex items-center gap-2">
          {currentUser && (
            <img
              src={currentUser.image}
              alt={currentUser.name}
              className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <input
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={currentUser ? 'Write a comment...' : 'Inicia sesión para comentar'}
              disabled={commentLoading || !currentUser}
              className="w-full border-0 bg-transparent px-0 py-2 text-sm text-white placeholder-white/50 focus:ring-0 focus:outline-none disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={!comment.trim() || commentLoading || !currentUser}
            className={`rounded-lg px-4 py-2 text-sm whitespace-nowrap transition ${
              comment.trim() && !commentLoading && currentUser
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                : 'cursor-not-allowed bg-gradient-to-r from-slate-800/50 to-purple-900/50 text-white/30'
            }`}
          >
            {commentLoading ? '...' : 'Publicar'}
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
                <p className="py-4 text-center text-sm text-white/50">
                  No hay comentarios aún. ¡Sé el primero!
                </p>
              ) : (
                comments.map(commentItem => (
                  <div key={commentItem._id} className="group flex gap-3">
                    <img src={commentItem.user?.image} className="h-8 w-8 rounded-full" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-white">
                          {commentItem.user?.username}
                        </span>
                        <span className="text-sm break-words text-white/70">
                          {commentItem.text}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-xs text-white/50">{formatDate(commentItem.createdAt)}</p>

                        {/* BOTÓN DE ELIMINAR - CORREGIDO: usar commentItem.user?._id */}
                        {isCurrentUserComment(commentItem.user?._id) && (
                          <button
                            onClick={() => handleDeleteClick(post._id, commentItem._id)}
                            className="ml-2 text-white/30 transition-colors hover:text-red-500"
                            title="Eliminar mi comentario"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
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
