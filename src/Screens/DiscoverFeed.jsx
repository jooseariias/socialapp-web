import { useEffect, useState } from 'react'
import Header from '../Components/Header'
import FollowRecomend from '../Components/Follow/FollowRecomend'
import CardProfile from '../Components/profile/CardProfile'
import TopFollowersCardMock from '../Components/Follow/TopFollow'
import getFeed from '../Services/post/getFeed'
import FeedPostCard from '../Components/FeedPostCard'

const HomePage = () => {
  const [postUser, setPostUser] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true)
        const res = await getFeed()
        if (res?.status === 200) {
          setPostUser(res.data)
        }
      } catch (error) {
        console.error('Error cargando feed', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeed()
  }, [])

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* FEED - Principal en móvil, izquierda en desktop */}
            <div className="w-full lg:w-2/3 lg:flex-1">
              {/* Estado de carga */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
                  <p className="mt-4 text-white/60">Loading posts...</p>
                </div>
              ) : postUser.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-white/10 p-6 mb-4">
                    <svg className="h-12 w-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                  <p className="text-white/60 text-center max-w-md">
                    Follow more people to see their posts here!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {postUser.map(post => (
                    <FeedPostCard key={post._id} post={post} />
                  ))}
                </div>
              )}
            </div>

            {/* SIDEBAR - Oculto en móvil, visible en desktop */}
            <div className="hidden lg:block lg:w-1/3">
              <div className="sticky top-24 space-y-6">
                <CardProfile />
                <TopFollowersCardMock />
                <FollowRecomend />
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage