const Hero = ({ setCurrentPage }) => {
  return (
    <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950 py-20 md:py-28 overflow-hidden transition-colors duration-500">
      {/* Animated gradient background overlay for dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-indigo-600/5 dark:from-purple-600/20 dark:via-transparent dark:to-indigo-600/20"></div>
      
      {/* Animated floating particles (purple accents) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/5 dark:bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Existing pattern overlay with dark mode support */}
      <div className="absolute inset-0 bg-pattern opacity-30 dark:opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {/* Badge - updated for dark mode */}
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-purple-900/40 text-indigo-700 dark:text-purple-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-indigo-200/50 dark:border-purple-700/30 transition-colors duration-300">
              <i className="fas fa-rocket text-purple-500 dark:text-purple-400"></i> 
              <span>Your Future Starts Here</span>
            </div>
            
            {/* Heading with enhanced gradient for dark mode */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight transition-colors duration-300">
              Discover <span className="gradient-text dark:from-purple-400 dark:via-purple-300 dark:to-indigo-400">Your Potential</span> at University
            </h1>
            
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed transition-colors duration-300">
              Join a community of innovators, thinkers, and leaders. Explore our programs, vibrant campus,
              and world-class opportunities — all made possible through student-led referrals.
            </p>
            
            {/* Buttons - enhanced for dark mode */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button 
                onClick={() => setCurrentPage('register')} 
                className="px-8 py-3 bg-indigo-600 dark:bg-purple-700 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-purple-600 transition-all shadow-lg shadow-indigo-200 dark:shadow-purple-900/30 hover:shadow-xl hover:scale-105 flex items-center gap-2 group"
              >
                <i className="fas fa-pen-to-square group-hover:rotate-12 transition-transform"></i> 
                Register Interest
              </button>
              <button 
                onClick={() => setCurrentPage('register')} 
                className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-gray-900/50 hover:shadow-lg hover:scale-105 flex items-center gap-2 group"
              >
                <i className="fas fa-play-circle text-indigo-500 dark:text-purple-400 group-hover:scale-110 transition-transform"></i> 
                Explore Programs
              </button>
            </div>
            
            {/* Referral badge - enhanced for dark mode */}
            <div className="mt-6 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md px-4 py-2 rounded-full inline-flex border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300 shadow-lg dark:shadow-purple-900/10">
              <i className="fas fa-user-check text-indigo-500 dark:text-purple-400"></i>
              <span>Referred by <strong className="text-gray-700 dark:text-white">Malcolm Mwakitwange</strong></span>
              <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
              <span className="text-indigo-600 dark:text-purple-400 font-medium">Get your referral link</span>
            </div>
          </div>
          
          {/* Right side - Images with dark mode enhancements */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop" 
                alt="Campus" 
                className="rounded-2xl shadow-xl dark:shadow-purple-900/20 object-cover h-48 w-full transition-all duration-300 hover:scale-105 hover:shadow-2xl" 
              />
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=400&h=300&fit=crop" 
                alt="Library" 
                className="rounded-2xl shadow-xl dark:shadow-purple-900/20 object-cover h-48 w-full mt-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl" 
              />
              <img 
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop" 
                alt="Students" 
                className="rounded-2xl shadow-xl dark:shadow-purple-900/20 object-cover h-48 w-full -mt-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl" 
              />
              <img 
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop" 
                alt="Campus view" 
                className="rounded-2xl shadow-xl dark:shadow-purple-900/20 object-cover h-48 w-full transition-all duration-300 hover:scale-105 hover:shadow-2xl" 
              />
            </div>
            
            {/* Stats badge - updated for dark mode */}
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-purple-900/30 px-5 py-3 flex items-center gap-3 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm transition-colors duration-300">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-purple-900/50 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-semibold text-indigo-700 dark:text-purple-300 transition-colors duration-300">
                    {String.fromCharCode(64+i)}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="text-indigo-600 dark:text-purple-400 font-bold">12k+</span> students
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;