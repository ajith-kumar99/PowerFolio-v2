import { Layout, Eye, Heart, BarChart3, PieChart, TrendingUp, Sparkles } from 'lucide-react';

const DashboardStats = ({ projects }) => {
  // 1. Calculate Basic Stats
  const totalViews = projects.reduce((sum, p) => sum + (p.views?.length || 0), 0);
  const totalLikes = projects.reduce((sum, p) => sum + (p.likes?.length || 0), 0);

  // 2. Calculate Submission Trends (Last 10 Days)
  const getLast10Days = () => {
    const days = [];
    for (let i = 9; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const last10Days = getLast10Days();
  const trendData = last10Days.map(date => {
    const count = projects.filter(p => 
      new Date(p.createdAt).toISOString().split('T')[0] === date
    ).length;
    
    const displayDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { date: displayDate, count };
  });

  const maxTrend = Math.max(...trendData.map(d => d.count), 4);

  // 3. Calculate Top 5 Project Types
  const typeCounts = projects.reduce((acc, project) => {
    const type = project.type || "Other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const topTypes = Object.entries(typeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([type, count]) => ({ type, count }));

  const maxType = Math.max(...topTypes.map(t => t.count), 1);

  const gradients = [
    'from-violet-600 via-purple-600 to-fuchsia-600',
    'from-cyan-500 via-blue-600 to-indigo-600',
    'from-emerald-500 via-teal-600 to-cyan-600',
    'from-orange-500 via-red-600 to-pink-600',
    'from-amber-500 via-yellow-600 to-orange-600'
  ];

  return (
    <div className="space-y-8 mb-8">
      
      {/* Animated Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Total Projects Card */}
        <div className="group relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent backdrop-blur-xl hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1">
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <div className="relative p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase">Total Projects</p>
                  <TrendingUp className="w-3 h-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {projects.length}
                </h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                <Layout className="w-6 h-6 text-purple-300" />
              </div>
            </div>
            <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"></div>
          </div>
        </div>
        
        {/* Total Views Card */}
        <div className="group relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent backdrop-blur-xl hover:border-blue-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <div className="relative p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase">Total Views</p>
                  <Sparkles className="w-3 h-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                </div>
                <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {totalViews}
                </h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                <Eye className="w-6 h-6 text-blue-300" />
              </div>
            </div>
            <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"></div>
          </div>
        </div>

        {/* Total Likes Card */}
        <div className="group relative overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent backdrop-blur-xl hover:border-pink-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <div className="relative p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase">Total Likes</p>
                  <Heart className="w-3 h-3 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" fill="currentColor" />
                </div>
                <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {totalLikes}
                </h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                <Heart className="w-6 h-6 text-pink-300" />
              </div>
            </div>
            <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"></div>
          </div>
        </div>
      </div>

      {/* Analytics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        
        {/* Submission Trends Graph */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 rounded-3xl p-8 min-h-[400px] flex flex-col backdrop-blur-xl hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-xl">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Submission Trends</h3>
          </div>
          
          <div className="relative flex-1 flex items-end justify-between gap-3 px-2 pb-2">
            {trendData.map((item, index) => {
              let height = '2%';
              if (item.count > 0) {
                 const percentage = (item.count / maxTrend) * 100;
                 height = `${Math.max(15, percentage)}%`;
              }

              return (
                <div 
                  key={index} 
                  className={`flex-col items-center justify-end gap-3 w-full h-full group/bar relative ${index < 5 ? 'hidden sm:flex' : 'flex'}`}
                  style={{animationDelay: `${index * 50}ms`}}
                >
                  {/* Enhanced Tooltip */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 bg-gradient-to-r from-purple-600 to-fuchsia-600 border border-white/20 text-xs text-white px-4 py-2 rounded-xl pointer-events-none whitespace-nowrap z-10 shadow-2xl">
                    <div className="font-bold">{item.count} Projects</div>
                    <div className="text-white/70 text-[10px]">{item.date}</div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-purple-600 rotate-45 border-r border-b border-white/20"></div>
                  </div>
                  
                  <div className="w-full h-full flex items-end justify-center">
                      <div 
                        className="w-full bg-gradient-to-t from-purple-600/60 via-purple-500/80 to-fuchsia-400 rounded-t-xl hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-400 transition-all duration-500 cursor-pointer shadow-lg shadow-purple-500/50 hover:shadow-purple-400/70 group-hover/bar:scale-105"
                        style={{ 
                          height: height, 
                          opacity: item.count > 0 ? 1 : 0.15,
                          animationDelay: `${index * 100}ms`
                        }}
                      />
                  </div>
                  
                  <span className="text-[11px] text-gray-400 font-medium group-hover/bar:text-purple-300 transition-colors whitespace-nowrap overflow-hidden text-ellipsis w-full text-center mt-2">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-white/20 w-full mt-4"></div>
        </div>

        {/* Project Types Graph */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 rounded-3xl p-8 min-h-[400px] backdrop-blur-xl hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
              <PieChart className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Top Project Types</h3>
            <div className="ml-auto px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 font-semibold">
              Top 5
            </div>
          </div>

          <div className="relative space-y-6">
            {topTypes.length > 0 ? (
              topTypes.map((item, index) => (
                <div 
                  key={index} 
                  className="group/item"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 100}ms both`
                  }}
                >
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-200 font-bold group-hover/item:text-white transition-colors flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r" style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`, '--tw-gradient-stops': gradients[index]}}></span>
                      {item.type}
                    </span>
                    <span className="text-gray-400 font-semibold group-hover/item:text-gray-200 transition-colors">
                      {item.count} <span className="text-xs">projects</span>
                    </span>
                  </div>
                  <div className="relative w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
                    <div 
                      className={`h-full bg-gradient-to-r ${gradients[index]} rounded-full group-hover/item:brightness-125 transition-all duration-700 ease-out shadow-lg relative overflow-hidden`}
                      style={{ 
                        width: `${Math.max((item.count / maxType) * 100, 10)}%`,
                        animation: `expandWidth 1s ease-out ${index * 150}ms both`
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
                <div className="p-4 bg-white/5 rounded-2xl mb-4">
                  <PieChart className="w-12 h-12 text-gray-500" />
                </div>
                <p className="font-medium">No project data available yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes expandWidth {
          from {
            width: 0;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default DashboardStats;