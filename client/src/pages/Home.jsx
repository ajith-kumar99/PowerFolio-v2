import Hero from '../components/Hero';
import FeaturedProjects from '../components/FeaturedProjects';
import Features from '../components/Features';
import ShareProject from '../components/ShareProject';

const Home = () => {
  return (
    <div className="space-y-0 pb-10">
      {/* Hero Section */}
      <Hero />

      {/* Featured Projects Section */}
      <FeaturedProjects />

      {/* Features Grid Section */}
      <Features />

      {/* Call to Action Section */}
      <ShareProject />
    </div>
  );
};

export default Home;