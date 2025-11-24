import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, User, Code, Link as LinkIcon, FileText, 
  Sparkles, Plus, X, ChevronRight, CheckCircle2,
  AlertCircle, Video, Image as ImageIcon, Github,
  MonitorPlay, Loader2, Info
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const SubmitProject = () => {
  const { API_URL, user, isAuthenticated } = useAuth(); // Destructure isAuthenticated
  const navigate = useNavigate();
  
  // --- State Management ---
  const [step, setStep] = useState(1);
  
  // Granular Loading States for AI
  const [aiLoadingState, setAiLoadingState] = useState({
    shortDescription: false,
    detailedDescription: false,
    outcome: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomType, setIsCustomType] = useState(false);

  // Main Form Data State
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    email: '',
    collegeName: '',
    collegeLocation: '',
    yearOfStudy: '',
    branch: '',
    
    // Project Details
    projectTitle: '',
    projectType: '',
    duration: '',
    startDate: '',
    shortDescription: '',
    detailedDescription: '',
    outcome: '',
    
    // Arrays & Files
    technologies: [],
    customTech: '',
    teamMembers: [],
    screenshots: [], // Stores File objects
    videoDemo: null, // Stores single Video File object
    
    // Links
    githubLink: '',
    liveLink: '',
    docLink: '',
    presentationLink: ''
  });

  // Helper for previews
  const [imagePreviews, setImagePreviews] = useState([]);

  // Helper state for adding a single team member
  const [teamMemberInput, setTeamMemberInput] = useState({ name: '', role: '' });

  // --- 1. AUTHENTICATION CHECK ---
  useEffect(() => {
    // If context is loaded (user is defined/undefined) and not authenticated
    if (isAuthenticated === false) {
      toast.info("Please login to submit a project.");
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // --- Autofill Effect ---
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        collegeName: user.college || '',
      }));
    }
  }, [user]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  // --- Input Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectTypeChange = (e) => {
    const value = e.target.value;
    if (value === 'other') {
      setIsCustomType(true);
      setFormData(prev => ({ ...prev, projectType: '' }));
    } else {
      setIsCustomType(false);
      setFormData(prev => ({ ...prev, projectType: value }));
    }
  };

  // --- File Upload Handlers ---

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + formData.screenshots.length > 4) {
      return toast.error("Maximum 4 screenshots allowed per project.");
    }

    const validFiles = [];
    const newPreviews = [];

    files.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 2MB.`);
      } else {
        validFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      }
    });

    setFormData(prev => ({
      ...prev,
      screenshots: [...prev.screenshots, ...validFiles]
    }));

    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        return toast.error("Video file size must be less than 20MB.");
      }
      setFormData(prev => ({ ...prev, videoDemo: file }));
      toast.success("Video selected successfully!");
    }
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
    
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setFormData(prev => ({ ...prev, videoDemo: null }));
  };

  // --- AI Features ---

  const handleAiEnhance = async (field) => {
    const textToEnhance = formData[field];
    
    if (!textToEnhance) {
      const fieldName = field === 'shortDescription' ? 'Short Description' 
        : field === 'detailedDescription' ? 'Detailed Description' : 'Outcome';
      return toast.warn(`Please write some text in ${fieldName} first to enhance.`);
    }

    setAiLoadingState(prev => ({ ...prev, [field]: true }));

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/ai/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: textToEnhance, field })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "AI Service Error");

      setFormData(prev => ({ ...prev, [field]: data.enhancedText }));
      
      toast.success("Text generated with Markdown formatting!");
    } catch (error) {
      console.error("AI Error:", error);
      toast.error("AI Enhancement failed. Please try again manually.");
    } finally {
      setAiLoadingState(prev => ({ ...prev, [field]: false }));
    }
  };

  // --- Tech Stack & Team Logic ---

  const toggleTech = (tech) => {
    setFormData(prev => {
      const exists = prev.technologies.includes(tech);
      return {
        ...prev,
        technologies: exists 
          ? prev.technologies.filter(t => t !== tech)
          : [...prev.technologies, tech]
      };
    });
  };

  const addCustomTech = () => {
    if (formData.customTech) {
        const normalizedTech = formData.customTech.trim();
        
        if (!formData.technologies.includes(normalizedTech)) {
          setFormData(prev => ({
            ...prev,
            technologies: [...prev.technologies, normalizedTech],
            customTech: ''
          }));
          toast.success(`Added ${normalizedTech}`);
        } else {
          toast.info(`${normalizedTech} is already selected.`);
        }
    } else {
      toast.info("Please type a technology name first.");
    }
  };

  const addTeamMember = () => {
    if (teamMemberInput.name && teamMemberInput.role) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, teamMemberInput]
      }));
      setTeamMemberInput({ name: '', role: '' });
    } else {
      toast.warn("Please enter both Name and Role for the team member.");
    }
  };

  const removeTeamMember = (index) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  // --- Validation Logic ---

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return "Full Name is required.";
    if (!formData.email.trim()) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address.";

    if (!formData.collegeName.trim()) return "College Name is required.";
    if (!formData.collegeLocation.trim()) return "College Location is required.";
    if (!formData.yearOfStudy.trim()) return "Year of Study is required.";
    if (!formData.branch.trim()) return "Branch/Department is required.";
    return null;
  };

  const handleNextStep = () => {
    const error = validateStep1();
    if (error) {
      toast.error(error);
    } else {
      setStep(2);
    }
  };

  // --- Final Submission Logic ---

  const handleSubmitProject = async () => {
    // --- STEP 2 STRICT VALIDATION ---
    if (!formData.projectTitle.trim()) return toast.error("Project Title is required.");
    if (!formData.projectType.trim()) return toast.error("Project Type is required.");
    if (!formData.duration.trim()) return toast.error("Project Duration is required.");
    if (!formData.startDate) return toast.error("Project Start Date is required.");
    if (!formData.shortDescription.trim()) return toast.error("Short Description is required.");
    if (!formData.detailedDescription.trim()) return toast.error("Detailed Description is required.");
    if (!formData.outcome.trim()) return toast.error("Outcome & Impact is required.");
    
    if (formData.technologies.length === 0) return toast.error("Please select at least one technology.");
    if (formData.screenshots.length === 0) return toast.error("Please upload at least one screenshot of your project.");
    
    if (!formData.githubLink.trim()) return toast.error("GitHub Repository link is mandatory.");
    
    try {
      new URL(formData.githubLink);
    } catch (_) {
      return toast.error("Please enter a valid GitHub URL (include http:// or https://)");
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const data = new FormData();

      data.append('title', formData.projectTitle);
      data.append('type', formData.projectType);
      data.append('duration', formData.duration);
      data.append('startDate', formData.startDate);
      data.append('shortDescription', formData.shortDescription);
      data.append('detailedDescription', formData.detailedDescription);
      data.append('outcome', formData.outcome);

      data.append('technologies', JSON.stringify(formData.technologies));
      data.append('teamMembers', JSON.stringify(formData.teamMembers));
      data.append('links', JSON.stringify({
        github: formData.githubLink,
        live: formData.liveLink,
        documentation: formData.docLink,
        presentation: formData.presentationLink
      }));

      formData.screenshots.forEach(file => {
        data.append('screenshots', file);
      });

      if (formData.videoDemo) {
        data.append('videoDemo', formData.videoDemo);
      }

      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      toast.success("Project submitted successfully!");
      navigate('/dashboard');

    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error.message || "Failed to submit project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonTechStack = [
    "React Native", "Spring Boot", "Django", "FastAPI", 
    "Express.js", "GraphQL", "REST API", "WebRTC",
    "Socket.io", "Apache Kafka", "Elasticsearch", "Firebase", "Supabase",
    "Next.js", "MongoDB", "PostgreSQL", "Docker", "Kubernetes"
  ];

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/20 to-black border-b border-white/10 pt-10 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Innovation</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Tell us about yourself first, then showcase your amazing projects to the world.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-xl">
            <button 
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${step === 1 ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <User size={18} />
              <span className="font-medium">Personal Details</span>
            </button>
            <div className="w-8 h-px bg-gray-700"></div>
            <button 
              onClick={handleNextStep}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${step === 2 ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
            >
              <Code size={18} />
              <span className="font-medium">Project Details</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
          
          {step === 1 ? (
            /* STEP 1: PERSONAL DETAILS */
            <div className="space-y-8 animate-in slide-in-from-left-8 duration-500">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <User className="text-green-400" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Personal Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Your Name *</label>
                  <input 
                    type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                    placeholder="Enter your full name" required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Your Email *</label>
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                    placeholder="your.email@university.edu" required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">College Name *</label>
                  <input 
                    type="text" name="collegeName" value={formData.collegeName} onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                    placeholder="Enter your college name" required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">College Location *</label>
                  <input 
                    type="text" name="collegeLocation" value={formData.collegeLocation} onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                    placeholder="City, State" required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Year of Study *</label>
                  <input 
                    type="text" name="yearOfStudy" value={formData.yearOfStudy} onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                    placeholder="e.g., BTech 2, BCom 1" required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Branch/Department *</label>
                  <input 
                    type="text" name="branch" value={formData.branch} onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                    placeholder="e.g., Computer Science" required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button 
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Next Step <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: PROJECT DETAILS */
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              
              <div>
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FileText className="text-blue-400" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Project Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Project Title *</label>
                    <input 
                      type="text" name="projectTitle" value={formData.projectTitle} onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                      placeholder="Enter your project title" required
                    />
                  </div>
                  
                  {/* Project Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Project Type *</label>
                    {!isCustomType ? (
                      <select 
                        onChange={handleProjectTypeChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none appearance-none"
                        value={formData.projectType}
                      >
                        <option value="">Select project type</option>
                        <option value="Web Application">Web Application</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Hardware/IoT">Hardware/IoT</option>
                        <option value="other">Other (Type Custom)</option>
                      </select>
                    ) : (
                      <div className="flex gap-2">
                        <input 
                          type="text" name="projectType" value={formData.projectType} onChange={handleInputChange}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                          placeholder="Enter custom type..." autoFocus
                        />
                        <button 
                          onClick={() => setIsCustomType(false)}
                          className="px-3 bg-white/10 rounded-xl hover:bg-white/20 text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Duration (weeks) *</label>
                    <input 
                      type="number" name="duration" value={formData.duration} onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                      placeholder="e.g., 12" required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Project Date *</label>
                    {/* ADDED style={{ colorScheme: 'dark' }} for visibility */}
                    <input 
                      type="date" name="startDate" value={formData.startDate} onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                      style={{ colorScheme: 'dark' }} 
                      required
                    />
                  </div>
                </div>

                {/* AI Fields - CLEANED OUTPUT */}
                
                {/* Short Description */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-300">Short Description *</label>
                    <button 
                      type="button" onClick={() => handleAiEnhance('shortDescription')}
                      className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20 disabled:opacity-50"
                      disabled={aiLoadingState.shortDescription}
                    >
                      {aiLoadingState.shortDescription ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      AI Enhance
                    </button>
                  </div>
                  {/* ADDED: data-lenis-prevent to textarea */}
                  <textarea 
                    name="shortDescription" rows="3" value={formData.shortDescription} onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none resize-none"
                    placeholder="Brief summary (e.g., A chatbot for travel planning using React and Gemini API...)" required
                    data-lenis-prevent
                  ></textarea>
                </div>

                {/* Detailed Description */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-300">Detailed Description *</label>
                    <button 
                      type="button" onClick={() => handleAiEnhance('detailedDescription')}
                      className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20 disabled:opacity-50"
                      disabled={aiLoadingState.detailedDescription}
                    >
                      {aiLoadingState.detailedDescription ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      AI Enhance
                    </button>
                  </div>
                  {/* ADDED: data-lenis-prevent to textarea */}
                  <textarea 
                    name="detailedDescription" rows="12" value={formData.detailedDescription} onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none resize-none font-mono text-sm"
                    placeholder="Provide a comprehensive overview of the architecture, challenges solved, features, and technical implementation..." required
                    data-lenis-prevent
                  ></textarea>
                  
                  {/* INFO NOTE */}
                  <div className="flex items-start gap-2 text-xs text-gray-500 bg-white/5 p-2 rounded-lg border border-white/5">
                    <Info size={14} className="mt-0.5 text-purple-400" />
                    <p>
                      <span className="text-purple-400 font-bold">Note:</span> AI text contains Markdown (e.g., **, ##). 
                      Ignore these symbols; they will format beautifully on your Project View page.
                    </p>
                  </div>
                </div>

                {/* Outcome */}
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-300">Outcome & Impact *</label>
                    <button 
                      type="button" onClick={() => handleAiEnhance('outcome')}
                      className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20 disabled:opacity-50"
                      disabled={aiLoadingState.outcome}
                    >
                      {aiLoadingState.outcome ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      AI Generate
                    </button>
                  </div>
                  {/* ADDED: data-lenis-prevent to textarea */}
                  <textarea 
                    name="outcome" rows="3" value={formData.outcome} onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none resize-none"
                    placeholder="Describe the results, efficiency improvements, or user feedback..." required
                    data-lenis-prevent
                  ></textarea>

                  {/* INFO NOTE */}
                  <div className="flex items-start gap-2 text-xs text-gray-500 bg-white/5 p-2 rounded-lg border border-white/5">
                    <Info size={14} className="mt-0.5 text-purple-400" />
                    <p>
                      <span className="text-purple-400 font-bold">Note:</span> Markdown symbols (**, ###) are preserved here for proper formatting on the detail page.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                 <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-white">Technologies Used *</h3>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.technologies.length > 0 ? (
                    formData.technologies.map(tech => (
                      <span key={tech} onClick={() => toggleTech(tech)} className="px-3 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30 cursor-pointer hover:bg-red-900/20 hover:text-red-400 flex items-center gap-1 transition-colors">
                        {tech} <X size={12} />
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-xs italic">No technologies selected yet</span>
                  )}
                </div>

                <div className="bg-black/40 rounded-xl p-4 border border-white/10 max-h-40 overflow-y-auto custom-scrollbar mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {commonTechStack.filter(t => !formData.technologies.includes(t)).map(tech => (
                      <label key={tech} className="flex items-center gap-2 cursor-pointer group p-1 hover:bg-white/5 rounded">
                        <div className={`w-4 h-4 rounded border border-gray-600 group-hover:border-purple-500`}></div>
                        <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{tech}</span>
                        <input type="checkbox" className="hidden" onChange={() => toggleTech(tech)} />
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="text" placeholder="Add a custom technology (e.g. Rust)"
                    value={formData.customTech}
                    onChange={(e) => setFormData(prev => ({...prev, customTech: e.target.value}))}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomTech()}
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-purple-500 outline-none"
                  />
                  <button 
                    onClick={addCustomTech}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Team Members */}
              <div>
                 <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>
                 <div className="space-y-3">
                   {formData.teamMembers.map((member, idx) => (
                     <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                       <div>
                         <p className="text-white font-medium">{member.name}</p>
                         <p className="text-xs text-gray-400">{member.role}</p>
                       </div>
                       <button onClick={() => removeTeamMember(idx)} className="text-gray-500 hover:text-red-400 transition-colors">
                         <X size={16} />
                       </button>
                     </div>
                   ))}
                   
                   <div className="flex flex-col md:flex-row gap-3 bg-black/40 p-4 rounded-xl border border-white/10 border-dashed">
                     <input 
                       type="text" placeholder="Team member name"
                       value={teamMemberInput.name}
                       onChange={(e) => setTeamMemberInput(prev => ({ ...prev, name: e.target.value }))}
                       className="flex-1 bg-transparent border-b border-gray-700 text-white px-2 py-1 text-sm focus:border-purple-500 outline-none"
                     />
                     <input 
                       type="text" placeholder="Role (e.g., Frontend Dev)"
                       value={teamMemberInput.role}
                       onChange={(e) => setTeamMemberInput(prev => ({ ...prev, role: e.target.value }))}
                       className="flex-1 bg-transparent border-b border-gray-700 text-white px-2 py-1 text-sm focus:border-purple-500 outline-none"
                     />
                     <button 
                       onClick={addTeamMember}
                       className="text-purple-400 hover:text-white text-sm font-bold whitespace-nowrap flex items-center gap-1"
                     >
                       <Plus size={16} /> Add Member
                     </button>
                   </div>
                 </div>
              </div>

              {/* Upload Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Project Files *</h3>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <AlertCircle size={20} className="text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm text-yellow-400 block mb-1">Upload Guidelines</span>
                    <p className="text-xs text-gray-400">Max 4 screenshots (2MB each). Max 1 video demo (20MB).</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer relative mb-4">
                      <input 
                        type="file" multiple accept="image/*" onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-400">
                         <ImageIcon />
                      </div>
                      <p className="text-gray-300 font-medium">Drag & drop screenshots (Required)</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formData.screenshots.length} / 4 files selected
                      </p>
                    </div>

                    {imagePreviews.length > 0 && (
                      <div className="flex flex-wrap gap-4">
                        {imagePreviews.map((url, idx) => (
                          <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/20 group">
                            <img src={url} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button onClick={() => removeFile(idx)} className="p-1.5 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors">
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Video Upload (Optional) */}
                  <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/10 relative">
                    <Video className="text-gray-400" size={24} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 font-medium">
                        {formData.videoDemo ? formData.videoDemo.name : "Upload Demo Video (Optional)"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formData.videoDemo ? `${(formData.videoDemo.size / 1024 / 1024).toFixed(2)} MB` : "Max 20MB"}
                      </p>
                    </div>
                    
                    {formData.videoDemo ? (
                       <button onClick={removeVideo} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-colors border border-red-500/20 z-20">
                         Remove
                       </button>
                    ) : (
                      <div className="relative">
                         <input type="file" accept="video/*" onChange={handleVideoChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                         <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors pointer-events-none">
                           Choose File
                         </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Links & Resources */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Links & Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 flex items-center gap-1"><Github size={12}/> GitHub Repository *</label>
                    <input 
                      type="url" name="githubLink" value={formData.githubLink} onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                      placeholder="https://github.com/username/repo" required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 flex items-center gap-1"><LinkIcon size={12}/> Live Project Link (Optional)</label>
                    <input 
                      type="url" name="liveLink" value={formData.liveLink} onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                      placeholder="https://your-project.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 flex items-center gap-1"><FileText size={12}/> Documentation (Optional)</label>
                    <input 
                      type="url" name="docLink" value={formData.docLink} onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                      placeholder="https://docs.example.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 flex items-center gap-1"><MonitorPlay size={12}/> Presentation (Optional)</label>
                    <input 
                      type="url" name="presentationLink" value={formData.presentationLink} onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                      placeholder="https://slides.example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-8 border-t border-white/10">
                <button 
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-gray-400 font-bold hover:text-white transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleSubmitProject}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-900/20 transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> 
                      <span>Submitting...</span>
                    </>
                  ) : "Submit Project"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SubmitProject;