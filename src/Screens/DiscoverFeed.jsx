import { useEffect, useState } from 'react'
import Header from '../Components/Header'
import FollowRecomend from '../Components/Follow/FollowRecomend'
import CardProfile from '../Components/profile/CardProfile'
import TopFollowersCardMock from '../Components/Follow/TopFollow'
import getFeed from '../Services/post/getFeed'
import FeedPostCard from '../Components/FeedPostCard'

const HomePage = () => {
  const [postUser, setPostUser] = useState([])

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await getFeed()
        if (res?.status === 200) {
          setPostUser(res.data)
        }
      } catch (error) {
        console.error('Error cargando feed', error)
      }
    }
    fetchFeed()
  }, [])

  return (
    <>
      <Header />

      <div className="flex min-h-screen justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-8xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* FEED */}
            <div className="min-w-2xl flex-1 space-y-6">
              {postUser.map(post => (
                <FeedPostCard key={post._id} post={post} />
              ))}
            </div>

            {/* SIDEBAR */}
            <div className="hidden w-80 lg:block">
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
