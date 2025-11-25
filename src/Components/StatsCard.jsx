import { motion } from 'framer-motion'

export default function StatsCard({ profileData, statIcons, formatNumber }) {
  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4 px-4 pb-6"
      >
        {['posts', 'followers', 'following'].map(key => (
          <motion.div
            key={key}
            className="flex flex-1 flex-col items-center rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            <span className="flex items-center gap-1 text-2xl font-bold text-white">
              {statIcons[key]} {formatNumber(profileData.stats[key])}
            </span>
            <span className="mt-1 text-white/60 capitalize">{key}</span>
          </motion.div>
        ))}
      </motion.section>
    </div>
  )
}
