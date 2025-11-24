import { Upload, Award, Users, Trophy, Sparkles, Target } from 'lucide-react';

const Features = () => {
  const featuresData = [
    {
      icon: 'Upload',
      title: 'Easy Submission',
      description: 'Submit your projects with our intuitive form',
      gradient: 'from-purple-500 to-pink-500',
      bgGlow: 'group-hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]'
    },
    {
      icon: 'Award',
      title: 'Quality Showcase',
      description: 'Professional presentation of your work',
      gradient: 'from-blue-500 to-cyan-500',
      bgGlow: 'group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]'
    },
    {
      icon: 'Users',
      title: 'Community',
      description: 'Connect with fellow innovators',
      gradient: 'from-pink-500 to-rose-500',
      bgGlow: 'group-hover:shadow-[0_0_40px_rgba(236,72,153,0.3)]'
    },
    {
      icon: 'Trophy',
      title: 'Recognition',
      description: 'Get recognized for your achievements',
      gradient: 'from-amber-500 to-orange-500',
      bgGlow: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]'
    }
  ];

  const getIcon = (iconName, gradient) => {
    const className = `w-8 h-8 bg-gradient-to-br ${gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500`;
    const iconProps = { 
      className: `w-8 h-8 group-hover:scale-110 transition-transform duration-500`,
      strokeWidth: 2.5
    };
    
    switch (iconName) {
      case 'Upload': return <Upload {...iconProps} className={`${iconProps.className} text-purple-400 group-hover:text-purple-300`} />;
      case 'Award': return <Award {...iconProps} className={`${iconProps.className} text-blue-400 group-hover:text-blue-300`} />;
      case 'Users': return <Users {...iconProps} className={`${iconProps.className} text-pink-400 group-hover:text-pink-300`} />;
      case 'Trophy': return <Trophy {...iconProps} className={`${iconProps.className} text-amber-400 group-hover:text-amber-300`} />;
      default: return null;
    }
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Why{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              PowerFolio
            </span>
            ?
          </h2>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            We provide the tools you need to take your student projects from{' '}
            <span className="text-purple-400 font-semibold">"localhost"</span> to{' '}
            <span className="text-green-400 font-semibold">"hired"</span>.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresData.map((feature, idx) => (
            <div 
              key={idx} 
              className={`group relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 ${feature.bgGlow} animate-in fade-in slide-in-from-bottom-4`}
              style={{ animationDelay: `${300 + idx * 100}ms` }}
            >
              {/* Glow Effect on Hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
              
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className={`inline-flex p-4 bg-gradient-to-br ${feature.gradient} bg-opacity-10 rounded-xl border border-white/10 group-hover:border-white/20 transition-all duration-500 group-hover:rotate-6`}>
                  <div className="relative">
                    {getIcon(feature.icon, feature.gradient)}
                    {/* Icon Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                  </div>
                </div>
                
                {/* Decorative Element */}
                <div className={`absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br ${feature.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150`} />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300"
                  style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}>
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>

              {/* Bottom Accent Line */}
              <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${feature.gradient} group-hover:w-full transition-all duration-500 rounded-b-2xl`} />
              
              {/* Corner Decoration */}
              <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-white/5 group-hover:border-white/10 rounded-tr-2xl transition-colors duration-500" />
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] group cursor-pointer">
            <Target className="w-5 h-5 text-purple-400 group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-sm font-semibold text-white">Start showcasing your projects today</span>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default Features;