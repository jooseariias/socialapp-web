import { motion } from 'framer-motion'
import { FaRegImage, FaRegHeart } from 'react-icons/fa'


export default function SelectPostAndLikes( {activeTab, setActiveTab} ) {
  return (
    <div>
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
                          isActive ? 'bg-button text-white shadow-md hover:cursor-pointer' : 'text-white/60 hover:text-white hover:cursor-pointer' 
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
    </div>
  )
}
