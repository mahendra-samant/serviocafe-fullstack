import React from 'react';
import { ShoppingCart, Menu, X, Coffee, Star, MapPin, Zap,User,BookOpen, ArrowRight } from 'lucide-react'; // Using Lucide Icons for simplicity

import HeroSection from './HeroSection';


 const blogImage1 = 'https://images.unsplash.com/photo-1522659516672-189a712c29af?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'; // Coffee roasting
const blogImage2 = 'https://images.unsplash.com/photo-1738224894761-0e5158e55ece?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=751'; // Latte art
const blogImage3 = 'https://plus.unsplash.com/premium_photo-1670758291967-25ed2e90f21e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'; // Beans and tools


const LandingPage = () => {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    
    const [isChatOpen, setIsChatOpen] = React.useState(false);
const [messages, setMessages] = React.useState([
  {
    role: 'assistant',
    content: 'Hello! Welcome to ServioCafe! ☕ How can I help you today? I can answer questions about our menu, hours, location, or reservations!'
  }
]);
const [input, setInput] = React.useState('');
const [isLoading, setIsLoading] = React.useState(false);
const messagesEndRef = React.useRef(null);
  
    const products = [
        {
            name: "Espresso",
            desc: "A bold and intense shot, perfect for a quick boost.",
            price: "100",
            img: "http://images.unsplash.com/photo-1610889556528-9a770e32642f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1315"
        },
        {
            name: "Caramel Macchiato",
            desc: "Sweet caramel drizzle over rich espresso and steamed milk.",
            price: "120",
            img: "https://images.unsplash.com/photo-1662047102608-a6f2e492411f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
        },
        {
            name: "Turkish Coffee",
            desc: "Traditionally prepared, strong, and unfiltered coffee.",
            price: "150",
            img: "https://images.unsplash.com/photo-1661685249316-a06e692e1cb2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
        },
    ];

    
    const steps = [
        { title: "Sourcing the Quality Beans", desc: "Hand-selecting the highest quality coffee beans from sustainable farms around the world." },
        { title: "Expert Roasting", desc: "Our master roasters bring out the finest aroma and flavors with precision, creating an exceptional roast." },
        { title: "Precision Grinding", desc: "We grind precisely to extract optimum flavor, unleashing the full potential of our beans." },
        { title: "The Final Sip", desc: "The moment of truth, when you savor the perfect balance of flavor, aroma, and warmth." },
    ];

     const blogPosts = [
        { title: "The Art of the Perfect Grind", date: "Oct 25", author: "Bean Expert", img: blogImage1 },
        { title: "Latte Art 101: Basic Shapes", date: "Oct 18", author: "Barista Bot", img: blogImage2 },
        { title: "Sourcing Sustainable Coffee", date: "Oct 10", author: "C. Bean", img: blogImage3 },
    ];
   const handleKeyPress = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

const sendMessage = async () => {
  if (!input.trim() || isLoading) return;

  const userMessage = input.trim();
  setInput("");
  setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
  setIsLoading(true);

  try {
    const systemContext = `
You are a helpful assistant for "ServioCafe" restaurant.

Menu:
- Espresso (₹100)
- Caramel Macchiato (₹120)
- Turkish Coffee (₹150)

Hours: 8 AM to 10 PM
Location: 123 Coffee Lane
Reservations available.

Answer like a friendly coffee shop assistant.
`;

    const response = await fetch("http://localhost:8080/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: systemContext + "\n\nUser: " + userMessage,
      }),
    });

    // ✅ Backend returns JSON like { "response": "text" }
    const data = await response.json();
    const botResponse = data.response;

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: botResponse },
    ]);
  } catch (err) {
    console.error(err);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Error occurred. Please try again!" },
    ]);
  }

  setIsLoading(false);
};
    return (
        <div className="min-h-screen font-sans overflow-x-hidden">
            
            {/* --- 1. Header Section --- */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#F8F5F0] py-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center px-4 max-w-7xl">
                    {/* Logo */}
                    <a href="#" className="text-3xl font-serif font-bold text-[#5C4033] tracking-wider">ServioCafe</a>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-10 text-[#5C4033] font-medium">
                        {['Home', 'Menu', 'About Us', 'Blog','Contact'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-[#8B5A2B] transition-colors duration-200">
                                {item}
                            </a>
                        ))}
                    </nav>

                    {/* CTA Button & Cart Icon */}
                    <div className="flex items-center space-x-4">
                        <button 
                        onClick={() => { window.location.href = '/login'; }}
                        className="hidden md:flex items-center bg-[#8B5A2B] text-white px-6 py-2 rounded-full hover:bg-[#A06D3E] transition-all duration-300 shadow-md">
                            <User className="w-4 h-4 mr-2" /> Login / Sign Up
                        </button>
                        {/* Mobile Menu Button */}
                        <button className="md:hidden text-[#5C4033]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#F8F5F0] shadow-lg absolute w-full z-20">
                    {['Home', 'Menu', 'About Us', 'Blog','Contact'].map((item) => (
                        <a key={item} href={`#₹{item.toLowerCase().replace(' ', '-')}`} className="block px-4 py-3 text-[#5C4033] hover:bg-[#E0DCCA]" onClick={() => setIsMenuOpen(false)}>
                            {item}
                        </a>
                    ))}
                    <button className="w-full bg-[#8B5A2B] text-white px-4 py-3 rounded-b-lg hover:bg-[#A06D3E] flex justify-center items-center">
                        <ShoppingCart className="w-4 h-4 mr-2" /> Shop Now
                    </button>
                </div>
            )}
            <HeroSection/>
           
            
            {/* --- 3. Passion Brewed to Perfection Section  --- */}
            <section className="py-20 bg-white" id="about-us">
                <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 px-4 max-w-7xl">
                    
                    {/* Image Block */}
                    <div className="md:w-1/2 flex justify-center order-2 md:order-1">
                        <img
                            src="https://images.unsplash.com/photo-1610632380989-680fe40816c6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
                            alt="Splashing coffee or pour over"
                            className="w-full max-w-lg rounded-xl shadow-2xl border-4 border-[#F8F5F0]"
                        />
                    </div>
                    
                    {/* Text Content */}
                    <div className="md:w-1/2 text-center md:text-left order-1 md:order-2">
                        <p className="text-md text-[#8B5A2B] font-semibold uppercase mb-2">Our Story</p>
                        <h2 className="text-5xl font-bold text-[#5C4033] mb-6">
                            Passion Brewed to Perfection
                        </h2>
                        <p className="text-lg text-[#7A604D] leading-relaxed mb-6">
                          At ServioCafe, we believe coffee is more than just a drink—it's an experience. From carefully selected
                         beans sourced globally to the art of brewing, we are dedicated to delivering exceptional taste and a warm,
                        inviting atmosphere. Our new online platform brings this experience directly to you, allowing for seamless
                        table bookings, convenient ordering, and delightful moments. Come, savor the flavor, and make memories
                        with us.
                        </p>
                        <p className="text-xl text-[#685140] leading-relaxed mb-8 font-semibold">
                            "We believe coffee more than a drink;it's a<br/> connection to people,places,and memories."
                        </p>
                        
                    </div>
                </div>
            </section>
            
            {/* --- 4. Sipped with Delight Section  --- */}
            <section className="py-20 bg-[#F8F5F0]" id="menu">
                <div className="container mx-auto px-4 max-w-7xl">
                    <h2 className="text-5xl font-bold text-[#5C4033] text-center mb-16">
                        Sipped with Delight
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {products.map((product, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-xl overflow-hidden text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                                <img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-72 object-cover"
                                />
                                <div className="p-8">
                                    <h3 className="text-3xl font-semibold text-[#5C4033] mb-2">{product.name}</h3>
                                    <p className="text-md text-[#7A604D] mb-6 line-clamp-2">
                                        {product.desc}
                                    </p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-3xl font-extrabold text-[#8B5A2B]">₹{product.price}</span>
                                        <button className="bg-[#5C4033] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#7A604D] transition-colors duration-300">
                                            Order Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* --- 5. The Journey of Perfection Section --- */}
            <section className="relative py-24 bg-[#70300e] text-white overflow-hidden">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <h2 className="text-5xl font-bold mb-4">The Journey of Perfection</h2>
                    <p className="text-lg text-gray-300 mb-20 max-w-3xl mx-auto">
                        Experience the artistry behind every cup of our coffee, from sourcing the finest beans to the precise art of roasting and brewing.
                    </p>

                    <div className="relative">
                        
                  

                        {/* Steps Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
                            {steps.map((step, index) => (
                                <div key={index} className="p-6 bg-black bg-opacity-20 rounded-xl text-left shadow-2xl transition-all duration-300 hover:bg-opacity-30 border border-gray-700">
                                    <span className="text-4xl font-extrabold text-[#D4AF37] block mb-4">{index + 1}.</span>
                                    <h3 className="text-xl font-bold text-[#D4AF37] mb-2">{step.title}</h3>
                                    <p className="text-gray-300">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                  
                </div>
            </section>

             {/* --- 6. Coffee Blog  --- */}
            <section id="blog" className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <h2 className="text-5xl font-bold text-[#5C4033] text-center mb-16">
                        Latest from The Brew
                        <BookOpen className="w-8 h-8 text-[#D4AF37] inline-block ml-3 mb-1" />
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {blogPosts.map((post, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer">
                                <img
                                    src={post.img}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6 space-y-3">
                                    <span className="text-xs font-semibold text-[#8B5A2B] uppercase tracking-wider">
                                        {post.date} • {post.author}
                                    </span>
                                    <h3 className="text-2xl font-bold text-[#5C4033] hover:text-[#8B5A2B] transition-colors">
                                        {post.title}
                                    </h3>
                                    <a href="#" className="flex items-center text-[#8B5A2B] font-semibold text-sm">
                                        Read Article <ArrowRight className="w-4 h-4 ml-2" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <button className="border border-[#8B5A2B] text-[#8B5A2B] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#F8F5F0] transition-colors duration-300">
                            View All Articles
                        </button>
                    </div>
                </div>
            </section>
            
            {/* --- 7. Customer Reviews Section */}
            <section className="py-20 bg-[#F8F5F0]">
                <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-center gap-16">
                    
                    {/* Review Text */}
                    <div className="md:w-1/2 text-center md:text-left order-2 md:order-1">
                        <p className="text-md text-[#8B5A2B] font-semibold uppercase mb-2">Customer Stories</p>
                        <h2 className="text-5xl font-bold text-[#5C4033] mb-6">Brewing Smiles</h2>
                        
                        <div className="flex mb-4 justify-center md:justify-start">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-[#D4AF37] text-[#D4AF37]" />)}
                        </div>
                        
                        <blockquote className="text-xl italic text-gray-700 leading-relaxed border-l-4 border-[#8B5A2B] pl-6 py-2 mb-6">
                            "This coffee has completely transformed my mornings. The rich aroma and bold flavors are just unbeatable. I can't imagine starting my day without it. Highly recommend to any coffee enthusiast! The balance of aroma and taste is simply perfection."
                        </blockquote>
                        <p className="font-extrabold text-[#5C4033] text-xl">- Olivia & Mark G. -</p>
                        <p className="text-gray-500">Long-time Customers</p>
                    </div>
                    
                    {/* Image Block */}
                    <div className="md:w-1/2 flex justify-center order-1 md:order-2">
                        <img
                            src="https://plus.unsplash.com/premium_photo-1661506528246-ce8235b26f6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
                            alt="Happy couple enjoying coffee"
                            className="w-full max-w-sm rounded-full aspect-square object-cover shadow-2xl border-8 border-[#F8F5F0]"
                        />
                    </div>
                </div>
            </section>
            
            {/* --- 7. Join Our Coffee Community Section  --- */}
            <section id="contact" className="py-20 bg-[#7e4426] text-white text-center">
                <div className="container mx-auto px-4 max-w-7xl">
                    <Zap className="w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-5xl font-bold mb-4">Join Our Coffee Community</h2>
                    <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto">
                        Become a part of our growing family of coffee lovers. Get exclusive offers, news, and updates delivered directly to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <input 
                            type="email" 
                            placeholder="Enter your email address"
                            className="px-6 py-3 rounded-full text-lg text-[#5C4033] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] w-full sm:w-auto min-w-[300px] bg-white"
                        />
                        <button className="bg-[#D4AF37] text-[#5C4033] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#EBDD79] transition-colors duration-300 shadow-lg">
                            Subscribe Now
                        </button>
                    </div>
                </div>
            </section>
            
            {/* --- 8. Footer --- */}
            <footer className="bg-[#5C4033] text-white py-12">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="text-xl font-bold mb-4 text-[#D4AF37]">ServioCafe</h4>
                            <p className="text-sm text-gray-300">Crafting perfection, one cup at a time.</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Shop</a></li>
                                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Our Story</a></li>
                                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Wholesale</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">FAQs</a></li>
                                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Shipping & Returns</a></li>
                                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Contact</h4>
                            <p className="text-sm flex items-center mb-2"><MapPin className="w-4 h-4 mr-2" /> 123 Coffee Lane, Brew City</p>
                            <p className="text-sm">support@ServioCafe.com</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 pt-6 text-center text-sm">
                        <p>&copy; {new Date().getFullYear()} ServioCafe. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* --- 9. Chatbot Section --- */}
            {/* Chatbot Button */}
            <button
  onClick={() => setIsChatOpen(!isChatOpen)}
  className="fixed bottom-6 right-6 bg-[#8B5A2B] text-white p-4 rounded-full shadow-2xl hover:bg-[#A06D3E] transition-all hover:scale-110 z-50"
  aria-label="Toggle chatbot"
>
  {isChatOpen ? <X className="w-6 h-6" /> : <Coffee className="w-6 h-6" />}
</button>

{/* Chatbot Window */}
{isChatOpen && (
  <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-[#8B5A2B]">
    {/* Chat Header */}
    <div className="bg-[#8B5A2B] text-white p-4 rounded-t-2xl flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Coffee className="w-5 h-5" />
        <div>
          <h3 className="font-bold">ServioCafe Assistant</h3>
          <p className="text-xs text-amber-100">Online •</p>
        </div>
      </div>
      <button onClick={() => setIsChatOpen(false)} className="hover:bg-[#A06D3E] p-1 rounded">
        <X className="w-5 h-5" />
      </button>
    </div>

    {/* Messages Area */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] p-3 rounded-2xl ${
              message.role === 'user'
                ? 'bg-[#8B5A2B] text-white rounded-br-none'
                : 'bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-200'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
            <div className="w-5 h-5 border-2 border-[#8B5A2B] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>

    {/* Input Area */}
    <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask me anything..."
          className="flex-1 bg-white p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] text-gray-800"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-[#8B5A2B] text-white p-3 rounded-lg hover:bg-[#A06D3E] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
     
    </div>
  </div>
)}
        </div>
        
    );
};


export default LandingPage;