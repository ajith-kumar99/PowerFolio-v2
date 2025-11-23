import { BarChart3, Users, FileText, CheckCircle, TrendingUp, PieChart } from 'lucide-react';

const AdminStats = ({ projects, users }) => {
  // 1. Calculate Key Metrics
  const totalSubmissions = projects.length;
  const totalUsers = users.length;
  const pendingReview = projects.filter(p => p.status === 'Pending').length;
  const approvedProjects = projects.filter(p => p.status === 'Approved').length;

  const approvalRate = totalSubmissions > 0 
    ? ((approvedProjects / totalSubmissions) * 100).toFixed(0) 
    : 0;

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
    
    // Format date (e.g., "Nov 24")
    const displayDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { date: displayDate, count };
  });

  const maxTrend = Math.max(...trendData.map(d => d.count), 1);

  // 3. Calculate Project Types
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

  // Stat Cards Data
  const statCards = [
    {
      label: "Total Submissions",
      value: totalSubmissions,
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      color: "bg-blue-500/10 border-blue-500/20"
    },
    {
      label: "Active Users",
      value: totalUsers,
      icon: <Users className="w-5 h-5 text-purple-400" />,
      color: "bg-purple-500/10 border-purple-500/20"
    },
    {
      label: "Pending Review",
      value: pendingReview,
      icon: <BarChart3 className="w-5 h-5 text-yellow-400" />,
      color: "bg-yellow-500/10 border-yellow-500/20"
    },
    {
      label: "Approved Rate",
      value: `${approvalRate}%`,
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      color: "bg-green-500/10 border-green-500/20"
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-white">Platform Analytics</h2>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className={`p-6 rounded-2xl border ${stat.color} backdrop-blur-sm`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className="p-2 bg-white/5 rounded-lg">
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live Data
            </div>
          </div>
        ))}
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        
        {/* Submission Trends Graph */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[320px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Submission Trends (Last 10 Days)
          </h3>
          
          <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2">
            {trendData.map((item, index) => (
              <div 
                key={index} 
                // Mobile: Hide first 5 days (index 0-4), Show last 5 (index 5-9). 
                // Desktop (sm+): Show all.
                className={`flex-col items-center gap-2 w-full group relative ${index < 5 ? 'hidden sm:flex' : 'flex'}`}
              >
                 {/* Tooltip */}
                 <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/20 text-xs text-white px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
                    {item.count} Projects
                 </div>
                 
                 {/* Bar */}
                 <div 
                    className="w-full bg-gradient-to-t from-purple-600/40 to-purple-500 rounded-t-md hover:from-purple-500 hover:to-purple-400 transition-all duration-300 cursor-pointer" 
                    style={{ 
                      height: `${(item.count / maxTrend) * 100}%`,
                      minHeight: item.count > 0 ? '4px' : '2px',
                      opacity: item.count > 0 ? 1 : 0.3
                    }}
                 ></div>
                 
                 {/* Date Label */}
                 <span className="text-[10px] text-gray-500 whitespace-nowrap">{item.date}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 w-full mt-2"></div>
        </div>

        {/* Project Types Breakdown */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[320px]">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-400" />
            Top Project Types
          </h3>
          
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
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <p>No data available.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminStats;