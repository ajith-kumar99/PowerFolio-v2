import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Github, ExternalLink, Calendar, MapPin, 
  GraduationCap, BookOpen, Code, Share2, RefreshCw, 
  AlertCircle, Heart, FileText, MonitorPlay, Play, Pause, Volume2, VolumeX,
  User, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Helper Component for Rich Text
const RichText = ({ text }) => {
  if (!text) return null;
  return (
    <div className="whitespace-pre-wrap leading-relaxed text-gray-300">
      {text.split('\n').map((line, i) => (
        <p key={i} className="mb-3">
          {line.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="text-white font-bold">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={j} className="text-purple-200">{part.slice(1, -1)}</em>;
            }
            return part;
          })}
        </p>
      ))}
    </div>
  );
};

const ViewProject = () => {
  const { id } = useParams();
  const { API_URL, user } = useAuth();
  const videoRef = useRef(null);
  
  // State
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Video State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const ensureHttp = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const hasViewed = sessionStorage.getItem(`viewed_${id}`);
        const url = `${API_URL}/projects/${id}${!hasViewed ? '?incrementView=true' : ''}`;

        const response = await fetch(url, {
           headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Project not found');

        setProject(data);
        setLikeCount(data.likes?.length || 0);
        
        if (!hasViewed) sessionStorage.setItem(`viewed_${id}`, 'true');
        if (user && data.likes?.includes(user._id)) setLiked(true);

      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id, API_URL, user]);

  const handleLike = async () => {
    if (!user) return toast.warn("Please login to like projects!");
    const originalLiked = liked;
    const originalCount = likeCount;
    
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);

    try {
      const token = localStorage.getItem('authToken');
      await fetch(`${API_URL}/projects/${id}/like`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      setLiked(originalLiked);
      setLikeCount(originalCount);
      toast.error("Like failed.");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop";
    return path.startsWith('http') ? path : `${API_URL.replace('/api', '')}/${path}`;
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen bg-black"><RefreshCw className="animate-spin text-purple-500 w-10 h-10" /></div>;
  if (!project) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Project not found</div>;

  const currentMainImage = getImageUrl(project.media?.screenshots?.[selectedImageIndex]);
  const videoUrl = project.media?.videoDemo ? getImageUrl(project.media.videoDemo) : null;

  return (
    <div className="min-h-screen bg-black pb-20">
      
      {/* --- Top Navigation --- */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/projects" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex gap-3">
            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg border border-white/10 transition-colors">
              <Share2 className="w-4 h-4" /><span className="hidden sm:inline">Share</span>
            </button>
            {project.links?.live && (
              <a href={ensureHttp(project.links.live)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-purple-900/20 transition-all">
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- Main Layout Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN: MEDIA (Images & Video) --- */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Image Gallery Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 overflow-hidden">
              {/* Main Preview */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-[400px] flex items-center justify-center mb-4 border border-white/10">
                <img 
                  src={currentMainImage} 
                  alt="Project Preview" 
                  className="w-full h-full object-contain"
                  onError={(e) => e.target.src = "https://via.placeholder.com/800x600/1a1a1a/ffffff?text=No+Preview"}
                />
              </div>
              
              {/* Thumbnails */}
              {(project.media?.screenshots?.length > 1) && (
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {project.media.screenshots.map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedImageIndex(i)}
                      className={`
                        w-24 h-16 rounded-lg overflow-hidden border cursor-pointer shrink-0 transition-all
                        ${selectedImageIndex === i ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-white/10 hover:opacity-80'}
                      `}
                    >
                      <img src={getImageUrl(img)} className="w-full h-full object-cover" alt={`Thumb ${i}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Player Card (Separate Div) */}
            {videoUrl && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <MonitorPlay className="w-5 h-5 text-purple-400"/> Project Demo
                </h3>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black group aspect-video max-h-[400px]">
                   <video 
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full h-full object-contain"
                      loop
                      onClick={togglePlay}
                   />
                   
                   {/* Center Play/Pause */}
                   <div 
                     className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
                     onClick={togglePlay}
                   >
                     <button className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-purple-600/90 transition-all transform hover:scale-110 shadow-xl border border-white/20">
                         {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                     </button>
                   </div>

                   {/* Mute Control */}
                   <div className="absolute bottom-4 right-4">
                      <button onClick={toggleMute} className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors border border-white/10">
                          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                   </div>
                </div>
              </div>
            )}

          </div>

          {/* --- RIGHT COLUMN: DETAILS --- */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title & Header Stats */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">{project.title}</h1>
                <button 
                  onClick={handleLike}
                  className={`shrink-0 p-3 rounded-full transition-all flex items-center gap-2 border ${liked ? 'bg-pink-500/10 border-pink-500/50 text-pink-500' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                >
                  <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
                  <span className="font-bold">{likeCount}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/20 font-medium">
                  {project.type}
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Calendar className="w-4 h-4" /> {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <RefreshCw className="w-4 h-4" /> {project.views?.length || 0} Views
                </span>
              </div>
            </div>

            {/* Short Description (Highlighted) */}
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/10 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2">Summary</h3>
              <p className="text-lg text-gray-200 font-medium leading-relaxed italic">
                "{project.shortDescription}"
              </p>
            </div>

            {/* Detailed Info Tabs/Cards */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" /> Detailed Overview
                </h3>
                <div className="text-gray-300 text-sm leading-relaxed">
                  <RichText text={project.detailedDescription} />
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-green-400" /> Outcome
                </h3>
                <div className="text-gray-300 text-sm leading-relaxed">
                  <RichText text={project.outcome || "No outcome provided."} />
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Code className="w-4 h-4" /> Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 transition-colors cursor-default">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links Section */}
            <div className="grid grid-cols-2 gap-3">
               {project.links?.github && (
                 <a href={ensureHttp(project.links.github)} target="_blank" rel="noreferrer" className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors">
                   <Github size={20} /> Source Code
                 </a>
               )}
               {project.links?.documentation && (
                 <a href={ensureHttp(project.links.documentation)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-colors">
                   <FileText size={18} /> Docs
                 </a>
               )}
               {project.links?.presentation && (
                 <a href={ensureHttp(project.links.presentation)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-colors">
                   <MonitorPlay size={18} /> Slides
                 </a>
               )}
            </div>

            {/* Author & Team */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-800 border border-white/10 overflow-hidden flex items-center justify-center">
                     {project.author?.profilePicture ? (
                       <img src={getImageUrl(project.author.profilePicture)} className="w-full h-full object-cover" alt={project.author.name} />
                     ) : (
                       <span className="text-xl font-bold text-white">{project.author?.name?.charAt(0)}</span>
                     )}
                  </div>
                  <div>
                     <p className="text-white font-bold">{project.author?.name}</p>
                     <p className="text-xs text-gray-500">{project.author?.email}</p>
                  </div>
               </div>
               
               {project.teamMembers?.length > 0 && (
                 <div className="border-t border-white/10 pt-4">
                   <p className="text-xs text-gray-500 mb-2">Team Members</p>
                   <div className="space-y-2">
                     {project.teamMembers.map((m, i) => (
                       <div key={i} className="flex justify-between text-xs text-gray-300">
                         <span>{m.name}</span>
                         <span className="text-gray-500">{m.role}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProject;