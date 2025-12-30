import { useEffect, useState } from 'react';
import Header from '../Components/Header';
import FollowRecomend from '../Components/Follow/FollowRecomend';
import CardProfile from '../Components/profile/CardProfile';
import TopFollowersCardMock from '../Components/Follow/TopFollow';
import getFeed from '../Services/post/getFeed';
import FeedPostCard from '../Components/FeedPostCard';
import { HiChevronLeft, HiChevronRight, HiViewGrid, HiViewList } from 'react-icons/hi';

const HomePage = () => {
  const [postUser, setPostUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('feed');
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const res = await getFeed();
        if (res?.status === 200) {
          setPostUser(res.data);
        }
      } catch (error) {
        console.error('Error cargando feed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const sidebarSlides = [
    { 
      id: 'profile', 
      title: '👤 Your Profile', 
      component: <CardProfile /> 
    },
    { 
      id: 'followers', 
      title: '🔥 Top Followers', 
      component: <TopFollowersCardMock /> 
    },
    { 
      id: 'recommend', 
      title: '✨ For You', 
      component: <FollowRecomend /> 
    },
  ];

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % sidebarSlides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + sidebarSlides.length) % sidebarSlides.length);

  // Render individual slide con botones integrados
  const SlideCard = ({ slide, index }) => (
    <div className="relative rounded-2xl bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-lg">
      {/* Título */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">
          {slide.title}
        </h3>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/60">
          {index + 1}/{sidebarSlides.length}
        </span>
      </div>
      
      {/* Contenido */}
      <div className="min-h-[300px]">
        {slide.component}
      </div>
      
      {/* Botones de navegación DENTRO de la card */}
      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={prevSlide}
          className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white transition-all hover:bg-white/20"
        >
          <HiChevronLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Prev</span>
        </button>
        
        <div className="flex gap-1">
          {sidebarSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeSlide 
                  ? 'w-6 bg-purple-500' 
                  : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white transition-all hover:bg-white/20"
        >
          <span className="text-sm font-medium">Next</span>
          <HiChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* View Toggle */}
          <div className="mb-6 flex items-center justify-center lg:hidden">
            <div className="inline-flex rounded-full bg-white/10 p-1">
              <button
                onClick={() => setViewMode('feed')}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-medium ${
                  viewMode === 'feed'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-white/60'
                }`}
              >
                <HiViewList className="h-5 w-5" />
                Feed
              </button>
              <button
                onClick={() => setViewMode('explore')}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-medium ${
                  viewMode === 'explore'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-white/60'
                }`}
              >
                <HiViewGrid className="h-5 w-5" />
                Explore
              </button>
            </div>
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden lg:flex lg:gap-6">
            <div className="flex-1">
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
            
            <div className="w-1/3">
              <div className="sticky top-24 space-y-6">
                <CardProfile />
                <TopFollowersCardMock />
                <FollowRecomend />
              </div>
            </div>
          </div>

          {/* MOBILE VIEW */}
          <div className="lg:hidden">
            {viewMode === 'feed' ? (
              // FEED VIEW
              <>
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
              </>
            ) : (
              // EXPLORE VIEW - Solo muestra el slide activo
              <SlideCard 
                slide={sidebarSlides[activeSlide]} 
                index={activeSlide} 
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;