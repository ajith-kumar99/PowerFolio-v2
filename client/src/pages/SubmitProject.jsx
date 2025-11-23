import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, User, Code, Link as LinkIcon, FileText, 
  Sparkles, Plus, X, ChevronRight, CheckCircle2,
  AlertCircle, Video, Image as ImageIcon, Github,
  MonitorPlay, Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const SubmitProject = () => {
  const { API_URL, user } = useAuth();
  const navigate = useNavigate();
  
  // --- State Management ---
  const [step, setStep] = useState(1);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomType, setIsCustomType] = useState(false);

  // Single object for all form data
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
    detailedDescription: '', // Field for detailed description
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

  // Helper state for adding a single team member
  const [teamMemberInput, setTeamMemberInput] = useState({ name: '', role: '' });

  // --- 1. Auth Protection & Autofill ---
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.warn("Please log in to submit a project.");
      navigate('/login');
      return;
    }

    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        collegeName: user.college || '',
      }));
    }
  }, [user, navigate]);

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

    const oversizedFiles = files.filter(file => file.size > 2 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      return toast.error("Some images are too large. Max 2MB per image.");
    }

    setFormData(prev => ({
      ...prev,
      screenshots: [...prev.screenshots, ...files]
    }));
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
  };

  // --- AI Features ---

  const handleAiEnhance = async (field) => {
    const textToEnhance = formData[field];
    
    if (!textToEnhance) {
      return toast.warn(`Please write some text in ${field} first.`);
    }

    setIsAiGenerating(true);
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
      toast.success("Text enhanced by AI successfully!");
    } catch (error) {
      console.error("AI Error:", error);
      toast.error("AI Enhancement failed. Please try again manually.");
    } finally {
      setIsAiGenerating(false);
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
    if (formData.customTech && !formData.technologies.includes(formData.customTech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, prev.customTech],
        customTech: '' 
      }));
    } else if (!formData.customTech) {
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

  // --- Final Submission Logic ---

  const handleSubmitProject = async () => {
    if (!formData.projectTitle) return toast.error("Project Title is required.");
    if (!formData.projectType) return toast.error("Project Type is required.");
    if (!formData.shortDescription) return toast.error("Short Description is required.");
    if (formData.technologies.length === 0) return toast.error("Please select at least one technology.");
    if (!formData.githubLink) return toast.error("GitHub Repository link is mandatory.");

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const data = new FormData();

      // Append Text Fields
      data.append('title', formData.projectTitle);
      data.append('type', formData.projectType);
      data.append('duration', formData.duration);
      data.append('startDate', formData.startDate);
      data.append('shortDescription', formData.shortDescription);
      // Append Detailed Description
      data.append('detailedDescription', formData.detailedDescription || formData.shortDescription);
      data.append('outcome', formData.outcome);

      // Append Complex Data
      data.append('technologies', JSON.stringify(formData.technologies));
      data.append('teamMembers', JSON.stringify(formData.teamMembers));
      data.append('links', JSON.stringify({
        github: formData.githubLink,
        live: formData.liveLink,
        documentation: formData.docLink,
        presentation: formData.presentationLink
      }));

      // Append Files
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
              onClick={() => {
                if (formData.fullName && formData.email) {
                  setStep(2);
                } else {
                  toast.warn("Please complete basic personal details first.");
                }
              }}
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
                  onClick={() => {
                     if (formData.fullName && formData.email && formData.collegeName) { 
                      setStep(2);
                    } else {
                      toast.error("Please fill in all required fields to proceed.");
                    }
                  }}
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
                  
                  {/* Project Type with Custom Option */}
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
                    <label className="text-sm font-medium text-gray-300">Project Date</label>
                    <input 
                      type="date" name="startDate" value={formData.startDate} onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>

                {/* AI Fields */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-300">Short Description *</label>
                    <button 
                      type="button" onClick={() => handleAiEnhance('shortDescription')}
                      className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20 disabled:opacity-50"
                      disabled={isAiGenerating}
                    >
                      {isAiGenerating ? <Sparkles className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      AI Enhance
                    </button>
                  </div>
                  <textarea 
                    name="shortDescription" rows="3" value={formData.shortDescription} onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none resize-none"
                    placeholder="Brief summary of your project..." required
                  ></textarea>
                </div>

                {/* NEW: Detailed Description Field with AI Enhance */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-300">Detailed Description (Optional)</label>
                    <button 
                      type="button" onClick={() => handleAiEnhance('detailedDescription')}
                      className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20 disabled:opacity-50"
                      disabled={isAiGenerating}
                    >
                      {isAiGenerating ? <Sparkles className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      AI Enhance
                    </button>
                  </div>
                  <textarea 
                    name="detailedDescription" rows="5" value={formData.detailedDescription} onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none resize-none"
                    placeholder="Provide a comprehensive overview of your project..."
                  ></textarea>
                </div>

                <div className="space-y-2 mb-6">
                   <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-300">Outcome & Impact</label>
                    <button 
                      type="button" onClick={() => handleAiEnhance('outcome')}
                      className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20 disabled:opacity-50"
                      disabled={isAiGenerating}
                    >
                      <Sparkles className="w-3 h-3" /> AI Generate
                    </button>
                  </div>
                  <textarea 
                    name="outcome" rows="3" value={formData.outcome} onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none resize-none"
                    placeholder="Describe the results and impact..."
                  ></textarea>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                 <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-white">Technologies Used</h3>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-white/10 max-h-60 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {commonTechStack.map((tech) => (
                      <label key={tech} className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.technologies.includes(tech) ? 'bg-purple-600 border-purple-600' : 'border-gray-600 group-hover:border-purple-500'}`}>
                          {formData.technologies.includes(tech) && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                        <input 
                          type="checkbox" className="hidden"
                          checked={formData.technologies.includes(tech)}
                          onChange={() => toggleTech(tech)}
                        />
                        <span className={`text-sm ${formData.technologies.includes(tech) ? 'text-white' : 'text-gray-400'}`}>{tech}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <input 
                    type="text" placeholder="Add a custom technology"
                    value={formData.customTech}
                    onChange={(e) => setFormData(prev => ({...prev, customTech: e.target.value}))}
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-purple-500 outline-none"
                  />
                  <button 
                    onClick={addCustomTech}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700"
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
                       <button onClick={() => removeTeamMember(idx)} className="text-gray-500 hover:text-red-400">
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
                <h3 className="text-lg font-semibold text-white mb-4">Project Files</h3>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-yellow-400 mb-2">
                    <AlertCircle size={16} />
                    <span className="font-bold text-sm">Upload Guidelines</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-400">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Screenshots: 2MB each (auto-compressed)</li>
                      <li>Max 4 Screenshots allowed</li>
                    </ul>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Use fewer screenshots (3-4 is ideal)</li>
                      <li>Video Demo: Max 20MB (Optional)</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer relative">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-400">
                       <ImageIcon />
                    </div>
                    <p className="text-gray-300 font-medium">Drag and drop screenshots here</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.screenshots.length} files selected
                    </p>
                  </div>

                  {formData.screenshots.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.screenshots.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg text-xs text-white">
                          <span className="truncate max-w-[150px]">{file.name}</span>
                          <button onClick={() => removeFile(idx)} className="text-red-400 hover:text-red-300"><X size={14}/></button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Video Input */}
                  <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/10 relative">
                    <Video className="text-gray-400" size={20} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 font-medium">
                        {formData.videoDemo ? formData.videoDemo.name : "Upload Demo Video (Optional)"}
                      </p>
                      <p className="text-xs text-gray-500">Max 20MB</p>
                    </div>
                    <input 
                      type="file" 
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors pointer-events-none">
                      Choose File
                    </button>
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
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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