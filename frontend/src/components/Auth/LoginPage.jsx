import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Coffee, ArrowRight, CheckCircle, User, Award, X, ArrowDown } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const rightPanelBg = 'https://images.unsplash.com/photo-1630040995437-80b01c5dd52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
const pageBg = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2561&auto=format&fit=crop';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  // --- TOAST STATE ---
  const [toastInfo, setToastInfo] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  // Helper to show toast and auto-hide it
  const showToast = (message, type) => {
    setToastInfo({ message, type });
    // Hide after 3 seconds
    setTimeout(() => {
      setToastInfo({ message: '', type: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // ✅ Backend-connected login logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userId", data.id); // Add this line

        // 1. TRIGGER SUCCESS TOAST
        showToast(`Login successful! Welcome ${data.name}`, 'success');

        // Delay redirect slightly so user sees the toast
        setTimeout(() => {
            const userRole = data.role;
            switch (userRole) {
              case "CUSTOMER": navigate("/customer-dashboard"); break;
              case "WAITER": navigate("/waiter-dashboard"); break;
              case "CHEF": navigate("/chef-dashboard"); break;
              case "ADMIN": navigate("/admin-dashboard"); break;
              default: navigate("/");
            }
        }, 1500);

      } else {
        const text = await response.text();
        // 2. TRIGGER ERROR TOAST
        showToast(text || "Invalid credentials", 'error');
      }
    } catch (err) {
      console.error("Login error:", err);
      showToast("Network error. Please try again later.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: CheckCircle, text: 'Quick & Easy Ordering' },
    { icon: User, text: 'Personalized Recommendations' },
    { icon: Award, text: 'Exclusive Member Perks' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-10 font-sans relative overflow-hidden">
      
      {/* 3. RENDER TOAST COMPONENT */}
      <ToastNotification toast={toastInfo} />

      {/* Blurred Background Layer */}
      <div 
        className="absolute inset-0 blur-sm scale-105"
        style={{
          backgroundImage: `url(${pageBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Content Card */}
      <div className="w-full max-w-6xl mx-auto flex rounded-2xl shadow-2xl overflow-hidden bg-[#F8F5F0] relative z-10">
        
        {/* --- Left Column: Login Form --- */}
        <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col items-center justify-center bg-white rounded-l-2xl">
          <div className="bg-[#5C4033] p-4 rounded-full mb-6">
            <Coffee className="w-8 h-8 text-[#D4AF37]" />
          </div>

          <h1 className="text-3xl font-bold text-[#5C4033] mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm mb-10">Login to continue your coffee journey</p>

          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-[#F8F5F0] border border-gray-300 rounded-xl focus:ring-[#8B5A2B] focus:border-[#8B5A2B] focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-[#F8F5F0] border border-gray-300 rounded-xl focus:ring-[#8B5A2B] focus:border-[#8B5A2B] focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#5C4033] p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-[#8B5A2B] text-white py-3 rounded-xl font-bold text-lg hover:bg-[#5C4033] transition-colors shadow-lg space-x-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65z" />
                  </svg>
                  Logging in...
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-sm text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-[#8B5A2B] font-bold hover:text-[#5C4033] cursor-pointer"
            >
              Register here
            </span>
          </div>
        </div>

        {/* --- Right Column: Feature Panel --- */}
        <div className="hidden md:block md:w-1/2 relative rounded-r-2xl overflow-hidden">
          <img
            src={rightPanelBg}
            alt="Coffee cup background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 p-12 flex flex-col justify-end">
            <div className="relative z-10 text-white">
              <div className="text-[#D4AF37] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <h2 className="text-4xl font-extrabold mb-4 leading-tight">Your Perfect Cup Awaits</h2>
              <p className="text-gray-200 mb-8">
                Access your personalized dashboard, track your favorite orders, and enjoy exclusive member benefits.
              </p>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <feature.icon className="w-5 h-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                    <span className="text-lg text-white">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. YOUR CUSTOM TOAST COMPONENT ---
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

export default LoginPage;