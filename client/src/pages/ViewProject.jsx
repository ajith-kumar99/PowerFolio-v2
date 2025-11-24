import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Github, ExternalLink, Calendar, 
  GraduationCap, BookOpen, Code, Share2, RefreshCw, 
  AlertCircle, Heart, FileText, MonitorPlay, Play, Pause, 
  Volume2, VolumeX, User, Layers, Eye, Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Enhanced Markdown/Rich Text Parser Component
const RichText = ({ text }) => {
  if (!text) return <p className="text-gray-400 italic">No content provided.</p>;

  const parseInlineStyles = (rawText) => {
    if (!rawText) return null;
    let text = typeof rawText === 'string' ? rawText : String(rawText);

    // Split by styled segments but DO NOT capture inner groups
    const parts = text.split(
      /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/
    );

    return parts
      .filter(Boolean) // remove empty strings / undefined
      .map((part, i) => {
        if (typeof part !== 'string') return part;

        // Bold + Italic (***text***)
        if (part.startsWith('***') && part.endsWith('***')) {
          return (
            <strong key={i} className="text-white font-bold italic">
              {part.slice(3, -3)}
            </strong>
          );
        }

        // Bold (**text**)
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="text-white font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }

        // Italic (*text*)
        if (
          part.startsWith('*') &&
          part.endsWith('*') &&
          !part.startsWith('**')
        ) {
          return (
            <em key={i} className="text-purple-200">
              {part.slice(1, -1)}
            </em>
          );
        }

        // Inline code (`code`)
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={i}
              className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-sm font-mono border border-purple-500/30"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        // Links [text](url)
        const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          return (
            <a
              key={i}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              {linkMatch[1]}
            </a>
          );
        }

        return <span key={i}>{part}</span>;
      });
  };

  const parseText = (content) => {
    const lines = String(content).split('\n');
    const elements = [];
    let listItems = [];
    let inList = false;
    let codeBlock = '';
    let inCodeBlock = false;

    lines.forEach((line, index) => {
      // Code blocks (``` )
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${index}`}
              className="bg-black/50 border border-purple-500/20 rounded-xl p-4 overflow-x-auto my-4"
            >
              <code className="text-sm text-purple-300 font-mono">
                {codeBlock}
              </code>
            </pre>
          );
          codeBlock = '';
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlock += line + '\n';
        return;
      }

      // Headings
      if (line.startsWith('### ')) {
        if (inList && listItems.length > 0) {
          elements.push(
            <ul
              key={`list-${index}`}
              className="list-disc list-inside space-y-2 my-4 ml-4"
            >
              {listItems}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        elements.push(
          <h3
            key={index}
            className="text-xl font-bold text-white mt-6 mb-3 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }

      if (line.startsWith('## ')) {
        if (inList && listItems.length > 0) {
          elements.push(
            <ul
              key={`list-${index}`}
              className="list-disc list-inside space-y-2 my-4 ml-4"
            >
              {listItems}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        elements.push(
          <h2
            key={index}
            className="text-2xl font-bold text-white mt-8 mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            {line.replace('## ', '')}
          </h2>
        );
        return;
      }

      if (line.startsWith('# ')) {
        if (inList && listItems.length > 0) {
          elements.push(
            <ul
              key={`list-${index}`}
              className="list-disc list-inside space-y-2 my-4 ml-4"
            >
              {listItems}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        elements.push(
          <h1
            key={index}
            className="text-3xl font-bold text-white mt-8 mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
          >
            {line.replace('# ', '')}
          </h1>
        );
        return;
      }

      // List items (- or *)
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        inList = true;
        const liContent = line.trim().replace(/^[*-]\s/, '');
        listItems.push(
          <li key={`li-${index}`} className="text-gray-300 leading-relaxed">
            {parseInlineStyles(liContent)}
          </li>
        );
        return;
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        inList = true;
        const liContent = line.trim().replace(/^\d+\.\s/, '');
        listItems.push(
          <li key={`li-${index}`} className="text-gray-300 leading-relaxed">
            {parseInlineStyles(liContent)}
          </li>
        );
        return;
      }

      // Close list if we hit a non-list line
      if (inList && listItems.length > 0 && line.trim() !== '') {
        elements.push(
          <ul
            key={`list-${index}`}
            className="list-disc list-inside space-y-2 my-4 ml-4"
          >
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }

      // Blockquotes (> )
      if (line.trim().startsWith('> ')) {
        elements.push(
          <blockquote
            key={index}
            className="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-purple-500/5 rounded-r-lg italic text-gray-300"
          >
            {parseInlineStyles(line.replace('> ', ''))}
          </blockquote>
        );
        return;
      }

      // Horizontal rule
      if (line.trim() === '---' || line.trim() === '***') {
        elements.push(<hr key={index} className="border-white/10 my-6" />);
        return;
      }

      // Regular paragraphs
      if (line.trim()) {
        elements.push(
          <p key={index} className="text-gray-300 leading-relaxed mb-4">
            {parseInlineStyles(line)}
          </p>
        );
      } else {
        elements.push(<div key={index} className="h-2" />);
      }
    });

    // Close any remaining list
    if (inList && listItems.length > 0) {
      elements.push(
        <ul
          key="final-list"
          className="list-disc list-inside space-y-2 my-4 ml-4"
        >
          {listItems}
        </ul>
      );
    }

    return elements;
  };

  return <div className="prose prose-invert max-w-none">{parseText(text)}</div>;
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
        const url = `${API_URL}/projects/${id}${
          !hasViewed ? '?incrementView=true' : ''
        }`;

        const response = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Project not found');

        setProject(data);
        setLikeCount(data.likes?.length || 0);

        if (!hasViewed) sessionStorage.setItem(`viewed_${id}`, 'true');
        if (user && data.likes?.includes(user._id)) setLiked(true);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id, API_URL, user]);

  const handleLike = async () => {
    if (!user) return toast.warn('Please login to like projects!');
    const originalLiked = liked;
    const originalCount = likeCount;

    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const token = localStorage.getItem('authToken');
      await fetch(`${API_URL}/projects/${id}/like`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      setLiked(originalLiked);
      setLikeCount(originalCount);
      toast.error('Like failed.');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
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
    if (!path)
      return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop';
    return path.startsWith('http')
      ? path
      : `${API_URL.replace('/api', '')}/${path}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900/20">
        <RefreshCw className="animate-spin text-purple-500 w-12 h-12 mb-4" />
        <p className="text-gray-400 animate-pulse">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900/20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Project not found
          </h2>
          <Link
            to="/projects"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const currentMainImage = getImageUrl(
    project.media?.screenshots?.[selectedImageIndex]
  );
  const videoUrl = project.media?.videoDemo
    ? getImageUrl(project.media.videoDemo)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900/10 pb-20">
      {/* --- Top Navigation with Glassmorphism --- */}
      <div className="border-b border-white/10 bg-black/80 backdrop-blur-2xl sticky top-0 z-50 shadow-lg shadow-purple-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/projects"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group"
          >
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-sm font-medium hidden sm:inline">
              Back to Projects
            </span>
          </Link>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl border border-white/10 transition-all hover:scale-105 active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            {project.links?.live && (
              <a
                href={ensureHttp(project.links.live)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-purple-900/30 transition-all hover:scale-105 active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* --- Main Layout Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* --- LEFT COLUMN: MEDIA (Images & Video) --- */}
          <div className="lg:col-span-7 space-y-6">
            {/* Image Gallery Card with Enhanced Design */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-4 sm:p-6 overflow-hidden backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
              {/* Main Preview */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-black to-gray-900 aspect-video max-h-[500px] flex items-center justify-center mb-4 border border-white/20 shadow-2xl shadow-purple-900/20 group">
                <img
                  src={currentMainImage}
                  alt="Project Preview"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  onError={(e) =>
                    (e.target.src =
                      'https://via.placeholder.com/800x600/1a1a1a/ffffff?text=No+Preview')
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Thumbnails with Enhanced Styling */}
              {project.media?.screenshots?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {project.media.screenshots.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border cursor-pointer shrink-0 transition-all duration-300 ${
                        selectedImageIndex === i
                          ? 'border-purple-500 ring-2 ring-purple-500/50 scale-110 shadow-lg shadow-purple-500/30'
                          : 'border-white/10 hover:border-white/30 hover:scale-105'
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        className="w-full h-full object-cover"
                        alt={`Thumb ${i}`}
                      />
                      {selectedImageIndex === i && (
                        <div className="absolute inset-0 bg-purple-500/20 border-2 border-purple-500 rounded-xl"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Player Card with Premium Design */}
            {videoUrl && (
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-4 sm:p-6 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <MonitorPlay className="w-5 h-5 text-purple-400" />
                  </div>
                  Project Demo Video
                </h3>
                <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black group aspect-video max-h-[500px] shadow-2xl shadow-purple-900/20">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-contain"
                    loop
                    onClick={togglePlay}
                  />

                  {/* Center Play/Pause with Premium Design */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
                      isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                    }`}
                    onClick={togglePlay}
                  >
                    <button className="p-5 bg-white/10 backdrop-blur-xl rounded-full text-white hover:bg-purple-600/90 transition-all transform hover:scale-110 shadow-2xl border-2 border-white/30 hover:border-purple-400">
                      {isPlaying ? (
                        <Pause size={40} fill="currentColor" />
                      ) : (
                        <Play
                          size={40}
                          fill="currentColor"
                          className="ml-1"
                        />
                      )}
                    </button>
                  </div>

                  {/* Mute Control with Enhanced Design */}
                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={toggleMute}
                      className="p-3 bg-black/70 hover:bg-black/90 backdrop-blur-md rounded-full text-white transition-all border border-white/20 hover:scale-110 active:scale-95"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: DETAILS --- */}
          <div className="lg:col-span-5 space-y-6">
            {/* Title & Header Stats with Gradient */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                  {project.title}
                </h1>
                <button
                  onClick={handleLike}
                  className={`shrink-0 p-3 rounded-full transition-all flex items-center gap-2 border ${
                    liked
                      ? 'bg-gradient-to-r from-pink-500/20 to-red-500/20 border-pink-500/50 text-pink-400 shadow-lg shadow-pink-500/20'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:scale-110'
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      liked ? 'fill-current animate-pulse' : ''
                    }`}
                  />
                  <span className="font-bold">{likeCount}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full border border-purple-500/30 font-semibold backdrop-blur-sm">
                  {project.type}
                </span>
                <span className="flex items-center gap-1.5 text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <Calendar className="w-4 h-4" />{' '}
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5 text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <Eye className="w-4 h-4" /> {project.views?.length || 0} Views
                </span>
              </div>
            </div>

            {/* Short Description */}
            <div className="bg-gradient-to-br from-purple-900/30 via-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-3xl p-6 shadow-lg shadow-purple-900/20 backdrop-blur-sm">
              <h3 className="text-xs sm:text-sm font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Project Summary
              </h3>
              <p className="text-base sm:text-lg text-gray-100 font-medium leading-relaxed italic">
                "{project.shortDescription}"
              </p>
            </div>

            {/* Detailed Info */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 space-y-6 backdrop-blur-sm">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 pb-3 border-b border-white/10">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  Detailed Overview
                </h3>
                <div className="text-sm sm:text-base">
                  <RichText text={project.detailedDescription} />
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2 pb-3 border-b border-white/10">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-green-400" />
                  </div>
                  Outcome & Impact
                </h3>
                <div className="text-sm sm:text-base">
                  <RichText text={project.outcome || 'No outcome provided.'} />
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-purple-500/20 rounded-lg">
                  <Code className="w-4 h-4 text-purple-400" />
                </div>
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-2 bg-gradient-to-br from-white/10 to-white/5 hover:from-purple-500/20 hover:to-pink-500/20 border border-white/10 hover:border-purple-500/30 rounded-xl text-xs sm:text-sm text-gray-300 hover:text-white transition-all cursor-default hover:scale-105 shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.links?.github && (
                <a
                  href={ensureHttp(project.links.github)}
                  target="_blank"
                  rel="noreferrer"
                  className="sm:col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  <Github size={20} /> View Source Code
                </a>
              )}
              {project.links?.documentation && (
                <a
                  href={ensureHttp(project.links.documentation)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-blue-500/30 text-white rounded-xl font-medium hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                >
                  <FileText size={18} /> Documentation
                </a>
              )}
              {project.links?.presentation && (
                <a
                  href={ensureHttp(project.links.presentation)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-purple-500/30 text-white rounded-xl font-medium hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                >
                  <MonitorPlay size={18} /> Presentation
                </a>
              )}
            </div>

            {/* Author & Team */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 border-2 border-white/20 overflow-hidden flex items-center justify-center shadow-lg">
                  {project.author?.profilePicture ? (
                    <img
                      src={getImageUrl(project.author.profilePicture)}
                      className="w-full h-full object-cover"
                      alt={project.author.name}
                    />
                  ) : (
                    <span className="text-xl font-bold text-white">
                      {project.author?.name?.charAt(0)}
                    </span>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                </div>
                <div>
                  <p className="text-white font-bold text-base sm:text-lg">
                    {project.author?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {project.author?.email}
                  </p>
                </div>
              </div>

              {project.teamMembers?.length > 0 && (
                <div className="border-t border-white/10 pt-4 mt-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Team Members
                  </p>
                  <div className="space-y-2">
                    {project.teamMembers.map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10">
                            <span className="text-xs font-bold text-white">
                              {m.name?.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-300 font-medium">
                            {m.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                          {m.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.6);
        }
      `}</style>
    </div>
  );
};

export default ViewProject;
