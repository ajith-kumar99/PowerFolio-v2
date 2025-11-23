import { Layers, Users, Code } from 'lucide-react';
import { featuresData } from '../assets/assets';

const Features = () => {
  // Helper to map string icon names to components
  const getIcon = (iconName) => {
    const className = "w-8 h-8";
    switch (iconName) {
      case 'Layers': return <Layers className={`${className} text-purple-500`} />;
      case 'Users': return <Users className={`${className} text-blue-500`} />;
      case 'Code': return <Code className={`${className} text-pink-500`} />;
      default: return null;
    }
  };

  return (
    <section className="py-20 bg-black/40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why PowerFolio?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We provide the tools you need to take your student projects from "local host" to "hired".
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuresData.map((feature, idx) => (
            <div 
              key={idx} 
              className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-6 p-4 bg-black/50 w-fit rounded-xl border border-white/5 group-hover:border-purple-500/30 transition-colors">
                {getIcon(feature.icon)}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;