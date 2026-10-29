import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  Mail, Lock, Eye, EyeOff, User, Coffee, ArrowRight, Star, CheckCircle, AlertCircle, X, ArrowDown 
} from 'lucide-react';

const leftPanelBg = 'https://plus.unsplash.com/premium_photo-1661335368356-d886c8e926c2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169';
const pageBg = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2561&auto=format&fit=crop';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER',
  });
  const [loading, setLoading] = useState(false);
  
  // --- 1. TOAST STATE ---
  const [toastInfo, setToastInfo] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  // Helper to show toast
  const showToast = (message, type) => {
    setToastInfo({ message, type });
    setTimeout(() => {
      setToastInfo({ message: '', type: '' });
    }, 3000);
  };

  // --- handle input change ---
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // --- handle submit (backend connection) ---
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate Passwords
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (response.ok) {
        // --- 2. SUCCESS TOAST & REDIRECT ---
        showToast("Registration successful! Redirecting to login...", "success");
        
        setTimeout(() => {
            navigate("/login");
        }, 2000);
        
      } else {
        const text = await response.text();
        showToast(text || "Registration failed!", "error");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      showToast("Network error. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-10 font-sans relative overflow-hidden">

      {/* 3. RENDER TOAST COMPONENT */}
      <ToastNotification toast={toastInfo} />

      {/* Background Image */}
      <div 
        className="absolute inset-0 blur-sm scale-105"
        style={{
          backgroundImage: `url(${pageBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Content Card */}
      <div className="w-full max-w-6xl mx-auto flex rounded-2xl shadow-2xl overflow-hidden bg-[#F8F5F0] h-[85vh] md:h-[90vh] relative z-10">
        
        {/* Left Column */}
        <div className="hidden md:block md:w-1/2 relative rounded-l-2xl overflow-hidden">
          <img
            src={leftPanelBg}
            alt="Coffee beans background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 p-12 flex flex-col justify-end">
            <div className="relative z-10 text-white">
              <div className="flex items-center space-x-3 mb-6">
                <Coffee className="w-8 h-8 text-[#D4AF37]" />
                <h2 className="text-3xl font-bold">ServioCafe</h2>
              </div>
              <p className="text-gray-200 mb-8">Coffee & Community</p>

              <h2 className="text-4xl font-extrabold mb-4 leading-tight">
                Join Our Coffee Community
              </h2>
              <p className="text-gray-200 mb-8">
                Create your account and start your journey with exceptional coffee experiences,
                exclusive perks, and a community that shares your passion.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-white/10 border border-white/20 px-5 py-3 rounded-full text-lg font-semibold">
                  <Star className="w-5 h-5 text-[#D4AF37]" />
                  <span>Loyalty Rewards</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 border border-white/20 px-5 py-3 rounded-full text-lg font-semibold">
                  <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                  <span>Priority Booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 p-6 md:py-10 md:px-12 lg:p-16 flex flex-col items-center justify-center bg-white rounded-r-2xl">
          <div className="bg-[#5C4033] p-4 rounded-full mb-4">
            <Coffee className="w-8 h-8 text-[#D4AF37]" />
          </div>

          <h1 className="text-3xl font-bold text-[#5C4033] mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm mb-6">Begin your coffee journey with us</p>

          <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-[#F8F5F0] border border-gray-300 rounded-xl focus:ring-[#8B5A2B] focus:border-[#8B5A2B]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-[#F8F5F0] border border-gray-300 rounded-xl focus:ring-[#8B5A2B] focus:border-[#8B5A2B]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-[#F8F5F0] border border-gray-300 rounded-xl focus:ring-[#8B5A2B] focus:border-[#8B5A2B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#5C4033]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-[#F8F5F0] border border-gray-300 rounded-xl focus:ring-[#8B5A2B] focus:border-[#8B5A2B]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#5C4033]"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Inline Password Match Check */}
              {formData.confirmPassword && (
                <div className="mt-1.5 flex items-center gap-2 text-xs">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-red-600">Passwords don’t match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-[#8B5A2B] text-white py-3 rounded-xl font-bold text-lg hover:bg-[#5C4033] transition-colors shadow-lg space-x-3 disabled:opacity-50"
            >
              {loading ? "Registering..." : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#8B5A2B] font-bold hover:text-[#5C4033] cursor-pointer"
            >
              Login here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. REUSABLE TOAST COMPONENT ---
function ToastNotification({ toast }) {
    if (!toast.message) return null;

    const baseClasses = "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl text-white font-semibold flex items-center gap-3 z-[9999] transition-all duration-300";
    let colorClasses = "";
    let Icon = X;

    switch (toast.type) {
        case 'success':
            colorClasses = "bg-green-600";
            Icon = CheckCircle;
            break;
        case 'error':
            colorClasses = "bg-red-600";
            Icon = X;
            break;
        case 'info':
            colorClasses = "bg-blue-600";
            Icon = ArrowDown;
            break;
        default:
            colorClasses = "bg-gray-700";
            Icon = ArrowDown;
    }

    return (
        <div className={`${baseClasses} ${colorClasses} transform transition-all duration-300 scale-100 ease-out animate-fade-in-up`}>
            <Icon className="w-5 h-5" />
            <span>{toast.message}</span>
        </div>
    );
}

export default RegisterPage;