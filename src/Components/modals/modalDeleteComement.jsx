import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaTrash } from 'react-icons/fa'

const ModalDeleteComement = ({
  showDeleteConfirm,
  handleCancelDelete,
  handleConfirmDelete,
  deleteLoading,
}) => {
  console.log('showDeleteConfirm', showDeleteConfirm)
  return (
    <AnimatePresence>
      {showDeleteConfirm && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelDelete}
            className="fixed inset-0 z-[60] mt-4 mx-4 bg-white/10 backdrop-blur-md min-gh-screen"
          />

          {/* Modal de confirmación */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4  min-gh-screen">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 p-6 shadow-xl"
            >
              {/* Icono de advertencia */}
              <div className="mb-4 flex justify-center ">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                  <FaTrash className="text-2xl text-red-500" />
                </div>
              </div>

              {/* Título */}
              <h3 className="mb-2 text-center text-xl font-semibold text-white">
                ¿Eliminar comentario?
              </h3>

              {/* Descripción */}
              <p className="mb-6 text-center text-white/70">
                Esta acción no se puede deshacer. El comentario se eliminará permanentemente.
              </p>

              {/* Botones de acción */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  disabled={deleteLoading}
                  className="flex-1 rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white/70 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="flex-1 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Eliminando...
                    </span>
                  ) : (
                    'Sí, eliminar'
                  )}
                </button>
              </div>

              {/* Botón de cierre (opcional) */}
              <button
                onClick={handleCancelDelete}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <FaTimes size={18} />
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ModalDeleteComement
