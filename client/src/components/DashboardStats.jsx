import { Layout, Eye, Heart, BarChart3, PieChart } from 'lucide-react';

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
      days.push(d.toISOString().split('T')[0]); // Format: YYYY-MM-DD
    }
    return days;
  };

  const last10Days = getLast10Days();
  const trendData = last10Days.map(date => {
    const count = projects.filter(p => 
      new Date(p.createdAt).toISOString().split('T')[0] === date
    ).length;
    
    // Format date for display (e.g., "Nov 24")
    const displayDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { date: displayDate, count };
  });

  // Find max value for scaling the graph bars
  const maxTrend = Math.max(...trendData.map(d => d.count), 1); // Avoid division by zero

  // 3. Calculate Top 5 Project Types
  const typeCounts = projects.reduce((acc, project) => {
    const type = project.type || "Other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const topTypes = Object.entries(typeCounts)
    .sort(([, a], [, b]) => b - a) // Sort by count descending
    .slice(0, 5) // Take top 5
    .map(([type, count]) => ({ type, count }));

  // Max value for type bars
  const maxType = Math.max(...topTypes.map(t => t.count), 1);

  return (
    <div className="space-y-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Projects</p>
              <h3 className="text-3xl font-bold text-white mt-1">{projects.length}</h3>
            </div>
            <div className="p-2 bg-white/5 rounded-lg"><Layout className="w-5 h-5 text-purple-400" /></div>
          </div>
        </div>
        
        <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Views</p>
              <h3 className="text-3xl font-bold text-white mt-1">{totalViews}</h3>
            </div>
            <div className="p-2 bg-white/5 rounded-lg"><Eye className="w-5 h-5 text-blue-400" /></div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-pink-500/20 bg-pink-500/5 backdrop-blur-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Likes</p>
              <h3 className="text-3xl font-bold text-white mt-1">{totalLikes}</h3>
            </div>
            <div className="p-2 bg-white/5 rounded-lg"><Heart className="w-5 h-5 text-pink-400" /></div>
          </div>
        </div>
      </div>

      {/* Analytics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Submission Trends Graph */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[320px] flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Submission Trends</h3>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2">
            {trendData.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2 w-full group relative">
                {/* Tooltip */}
                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/20 text-xs text-white px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
                  {item.count} Submissions
                </div>
                
                {/* Bar */}
                <div 
                  className="w-full bg-gradient-to-t from-purple-600/40 to-purple-500 rounded-t-md hover:from-purple-500 hover:to-purple-400 transition-all duration-300 cursor-pointer"
                  style={{ 
                    height: `${(item.count / maxTrend) * 100}%`,
                    minHeight: item.count > 0 ? '4px' : '2px',
                    opacity: item.count > 0 ? 1 : 0.3
                  }}
                />
                
                {/* X-Axis Label */}
                <span className="text-[10px] text-gray-500 rotate-0 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                  {item.date}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 w-full" />
        </div>

        {/* Project Types Graph */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[320px]">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Top Project Types</h3>
          </div>

          <div className="space-y-5">
            {topTypes.length > 0 ? (
              topTypes.map((item, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300 font-medium">{item.type}</span>
                    <span className="text-gray-500">{item.count} projects</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full group-hover:brightness-110 transition-all duration-500 ease-out"
                      style={{ width: `${(item.count / maxType) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 pb-10">
                <p>No project data available yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardStats;