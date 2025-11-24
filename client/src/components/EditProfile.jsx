import { useState, useEffect } from 'react';
import { X, Camera, Save, Loader, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useSmoothScroll } from '../context/SmoothScrollContext'; 

const EditProfile = ({ isOpen, onClose }) => {
  const { user, API_URL, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const lenis = useSmoothScroll(); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    about: '',
    password: '',
    profilePicture: null
  });

  // --- SCROLL LOCK & LENIS CONTROL ---
  useEffect(() => {
    if (isOpen) {
      if (lenis) lenis.stop(); // Stop background smooth scroll
      document.body.style.overflow = 'hidden'; // Stop native background scroll
    } else {
      if (lenis) lenis.start(); // Resume background smooth scroll
      document.body.style.overflow = 'unset'; // Resume native background scroll
    }

    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, lenis]);

  // --- POPULATE DATA ---
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        college: user.college || '', 
        about: user.about || '', 
        password: '',
        profilePicture: null
      });
      setPreviewImage(user.profilePicture || null);
    }
  }, [isOpen, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("Image size should be less than 2MB");
      }
      setFormData({ ...formData, profilePicture: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const data = new FormData();
      
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('college', formData.college);
      data.append('about', formData.about);
      
      if (formData.password) {
        data.append('password', formData.password);
      }
      
      if (formData.profilePicture) {
        data.append('profilePicture', formData.profilePicture);
      }

      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }

      updateUser(result);
      toast.success("Profile updated successfully!");
      onClose();

    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-none">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content 
           1. flex-1: Ensures it takes available space so overflow works.
           2. data-lenis-prevent: Vital! Tells Lenis to ignore this div.
        */}
        <div 
          className="overflow-y-auto p-6 custom-scrollbar flex-1"
          data-lenis-prevent 
        >
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500/50 bg-white/5 flex items-center justify-center">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                  <Camera className="w-6 h-6 text-white" />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              <p className="text-xs text-gray-500">Tap to change profile picture</p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 outline-none transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">College / University</label>
                <input 
                  type="text" 
                  name="college"
                  value={formData.college}
                  onChange={(e) => setFormData({...formData, college: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500 outline-none transition-colors"
                  placeholder="e.g. IIT Bombay"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">New Password (Optional)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-purple-500 outline-none transition-colors"
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">About Me</label>
              <textarea 
                rows="3"
                name="about"
                value={formData.about}
                onChange={(e) => setFormData({...formData, about: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none resize-none transition-colors"
                placeholder="Tell us a bit about yourself..."
              ></textarea>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end gap-3 flex-none">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="profile-form"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProfile;