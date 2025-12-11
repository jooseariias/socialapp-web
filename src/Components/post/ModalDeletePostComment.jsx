import { motion } from "framer-motion";



export default function modalDeletePost( {deleteModal, closeDeleteModal, handleDeleteComment, loading} ) {
  return (
    <div>
        {deleteModal.show && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl"
                  >
                    <h3 className="mb-4 text-xl font-semibold text-white">Delete Comment</h3>
                    <p className="mb-6 text-white/80">
                      Are you sure you want to delete this comment?
                      <br />
                      <span className="mt-2 block text-sm text-white/60">"{deleteModal.commentText}"</span>
                    </p>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={closeDeleteModal}
                        className="rounded-lg bg-white/10 px-4 py-2 text-white/80 transition-colors hover:bg-white/20"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteComment}
                        disabled={loading[`delete-${deleteModal.commentId}`]}
                        className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading[`delete-${deleteModal.commentId}`] ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
    </div>
  )
}
