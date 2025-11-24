import { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, CheckCircle, TrendingUp, PieChart, Sparkles } from 'lucide-react';

const AdminStats = ({ projects, users }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    totalSubmissions: 0,
    totalUsers: 0,
    pendingReview: 0,
    approvalRate: 0
  });

  // 1. Calculate Admin Key Metrics
  const totalSubmissions = projects.length;
  const totalUsers = users.length;
  const pendingReview = projects.filter(p => p.status === 'Pending').length;
  const approvedProjects = projects.filter(p => p.status === 'Approved').length;
  const approvalRate = totalSubmissions > 0 
    ? ((approvedProjects / totalSubmissions) * 100).toFixed(0) 
    : 0;

  // Trigger animations on mount
  useEffect(() => {
    setIsVisible(true);
    
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedValues({
        totalSubmissions: Math.floor(totalSubmissions * progress),
        totalUsers: Math.floor(totalUsers * progress),
        pendingReview: Math.floor(pendingReview * progress),
        approvalRate: Math.floor(approvalRate * progress)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          totalSubmissions,
          totalUsers,
          pendingReview,
          approvalRate
        });
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [projects, users]);

  // 2. Calculate Submission Trends
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

  const gradients = [
    'from-violet-600 via-purple-600 to-fuchsia-600',
    'from-cyan-500 via-blue-600 to-indigo-600',
    'from-emerald-500 via-teal-600 to-cyan-600',
    'from-orange-500 via-red-600 to-pink-600',
    'from-amber-500 via-yellow-600 to-orange-600'
  ];

  const statCards = [
    {
      label: "Total Submissions",
      value: animatedValues.totalSubmissions,
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      color: "from-blue-500/10 to-blue-600/5",
      borderColor: "border-blue-500/30",
      glowColor: "group-hover:shadow-blue-500/20"
    },
    {
      label: "Active Users",
      value: animatedValues.totalUsers,
      icon: <Users className="w-5 h-5 text-purple-400" />,
      color: "from-purple-500/10 to-purple-600/5",
      borderColor: "border-purple-500/30",
      glowColor: "group-hover:shadow-purple-500/20"
    },
    {
      label: "Pending Review",
      value: animatedValues.pendingReview,
      icon: <BarChart3 className="w-5 h-5 text-yellow-400" />,
      color: "from-yellow-500/10 to-yellow-600/5",
      borderColor: "border-yellow-500/30",
      glowColor: "group-hover:shadow-yellow-500/20"
    },
    {
      label: "Approval Rate",
      value: `${animatedValues.approvalRate}%`,
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      color: "from-green-500/10 to-green-600/5",
      borderColor: "border-green-500/30",
      glowColor: "group-hover:shadow-green-500/20"
    }
  ];

  return (
    // ADDED: h-full, overflow-y-auto, and data-lenis-prevent
    <div 
      className="space-y-8 h-full overflow-y-auto custom-scrollbar p-1" 
      data-lenis-prevent
    >
      {/* Admin Header */}
      <div className={`flex items-center gap-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-lg opacity-50 animate-pulse"></div>
          <div className="relative p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
          Platform Analytics
        </h2>
      </div>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`group relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
            <div className={`relative p-6 rounded-2xl border ${stat.borderColor} bg-gradient-to-br ${stat.color} backdrop-blur-sm hover:scale-105 transition-all duration-500 ${stat.glowColor} shadow-lg`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-white transition-all duration-300 group-hover:scale-110 inline-block">
                    {stat.value}
                  </h3>
                </div>
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                <TrendingUp className="w-3 h-3 mr-1 group-hover:animate-pulse" />
                Live Data
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        
        {/* Submission Trends Graph */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 rounded-3xl p-8 min-h-[400px] flex flex-col backdrop-blur-xl hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
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
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 bg-gradient-to-r from-purple-600 to-fuchsia-600 border border-white/20 text-xs text-white px-4 py-2 rounded-xl pointer-events-none whitespace-nowrap z-10 shadow-2xl">
                    <div className="font-bold">{item.count} Submissions</div>
                    <div className="text-white/70 text-[10px]">{item.date}</div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-purple-600 rotate-45 border-r border-b border-white/20"></div>
                  </div>
                  
                  <div className="w-full h-full flex items-end justify-center">
                      <div 
                        className="w-full bg-gradient-to-t from-purple-600/60 via-purple-500/80 to-fuchsia-400 rounded-t-xl hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-400 transition-all duration-500 cursor-pointer shadow-lg shadow-purple-500/50 hover:shadow-purple-400/70 group-hover/bar:scale-105"
                        style={{ 
                          height: height, 
                          opacity: item.count > 0 ? 1 : 0.15,
                          animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
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
                <p>No data available.</p>
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

export default AdminStats;