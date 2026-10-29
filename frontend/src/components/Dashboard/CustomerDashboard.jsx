import React, { useState, useEffect } from 'react';
import {
    Coffee, Home, Menu, ShoppingCart, ScrollText, CalendarDays, User, LogOut,
    Search, ChevronDown, CheckCircle, Package, Heart, Award, MapPin, Edit,
    FileText, Loader, Plus, Minus, Trash2, X, Clock, Layers, Shield,
    MenuIcon, ArrowDown, CreditCard, ChevronRight, Mail,
    Phone,Users
} from 'lucide-react';


const welcomeBackBg = 'https://plus.unsplash.com/premium_photo-1682092528374-87a10d6c92ac?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170';
const reserveTableBg = "https://images.unsplash.com/photo-1612192527395-06b72da6b35a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170";
const discoverMenuBg = 'https://plus.unsplash.com/premium_photo-1670445287612-d6fed960c910?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687';


const API_BASE_URL = 'http://localhost:8080/api/menu';


function SectionTitle({ title, subtitle }) {
    return (
        <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-[#5C4033]">{title}</h2>
            <p className="text-gray-500">{subtitle}</p>
        </div>
    );
}

// --- MAIN APPLICATION COMPONENT ---
const CustomerDashboard = () => {

    const [activeSection, setActiveSection] = useState('Home');
    const [cart, setCart] = useState([]);
    const [toast, setToast] = useState({ message: '', type: '' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Redefine Mail and Phone just for scope/clarity, though not strictly necessary
    const Mail = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 7L12 13 2 7" /><rect x="2" y="4" width="20" height="16" rx="2" ry="2" /></svg>;
    const Phone = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal; // Assuming taxes are 0 for simplicity, as in original code
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: '' }), 3000);
    };

    const navItems = [
        { name: 'Food Menu', icon: Menu, page: 'Menu' },
        { name: 'Cart', icon: ShoppingCart, page: 'Cart' }, // 'Cart' now maps to the new CartScreen
        { name: 'My Orders', icon: ScrollText, page: 'My Orders' },
        { name: 'Book Table', icon: CalendarDays, page: 'Book Table' },
        { name: 'Profile', icon: User, page: 'Profile' },
        { name: 'Report/Feedback', icon: FileText, page: 'Report' },
    ];


    const renderMainContent = () => {
        switch (activeSection) {
            case 'Home':
                return (
                    <HomeView setActiveSection={setActiveSection} />
                );
            case 'Menu':
                return (
                    <MenuScreen cart={cart} setCart={setCart} showToast={showToast} setActiveSection={setActiveSection} />
                );
            // --- RESTRUCTURED NAVIGATION: 'Cart' is for review, 'Checkout' is for payment ---
            case 'Cart': // New: Dedicated Cart Review Screen
                return (
                    <CartScreen
                        navigate={setActiveSection}
                        cart={cart}
                        setCart={setCart}
                        subtotal={subtotal}
                        total={total}
                        showToast={showToast}
                    />
                );
            case 'Checkout': // New: Dedicated Payment Screen
                return (
                    <PaymentScreen
                        navigate={setActiveSection}
                        cart={cart}
                        setCart={setCart}
                        subtotal={subtotal}
                        taxes={0}
                        total={total}
                        showToast={showToast}
                    />
                );
            // --- END RESTRUCTURED NAVIGATION ---
            case 'My Orders':
                return (
                    <OrdersScreen />
                );
            case 'Book Table':
                return (
                    <BookingScreen showToast={showToast} />
                );
            case 'Profile':
                return (
                    <ProfileScreen showToast={showToast} />
                );
            case 'Report':
                return (
                    <ReportFeedbackScreen showToast={showToast} setActiveSection={setActiveSection} />
                );
            default:
                return <HomeView setActiveSection={setActiveSection} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8F5F0]">
            {/* Sidebar */}
            <aside className={`bg-[#5C4033] text-white flex flex-col fixed inset-y-0 left-0 z-50 shadow-lg transition-all duration-300 ease-in-out
                            ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <div className="flex items-center space-x-3">
                            <Coffee className="w-8 h-8 text-[#D4AF37]" />
                            <h1 className="text-xl font-bold">ServioCafe</h1>
                        </div>
                    ) : (
                        <Coffee className="w-8 h-8 text-[#D4AF37] mx-auto" />
                    )}
                    <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-[#7A604D] hidden md:block">
                        <MenuIcon className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-grow p-4">
                    <ul>
                        {/* Home button */}
                        <li className="mb-2">
                            <button
                                onClick={() => setActiveSection('Home')}
                                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200
                                        ${activeSection === 'Home' ? 'bg-[#8B5A2B] text-white shadow-md' : 'hover:bg-[#7A604D] text-gray-200'}`}
                            >
                                <Home className="w-5 h-5 flex-shrink-0" />
                                {isSidebarOpen && <span>Dashboard</span>}
                            </button>
                        </li>

                        {navItems.map((item) => (
                            <li key={item.name} className="mb-2">
                                <button
                                    onClick={() => setActiveSection(item.page)}
                                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200
                                            ${activeSection === item.page ? 'bg-[#8B5A2B] text-white shadow-md' : 'hover:bg-[#7A604D] text-gray-200'}`}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {isSidebarOpen && <span>{item.name}</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button 
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/login';
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-300 hover:bg-[#7A604D] transition-colors duration-200"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-grow bg-[#F8F5F0] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {renderMainContent()}
            </main>


            <ToastNotification toast={toast} />
        </div>
    );
};



function HomeView({ setActiveSection }) {
    const [bookings, setBookings] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        
        // Fetch bookings
        if (userId) {
            fetch(`http://localhost:8080/api/bookings/user/${userId}`)
                .then(res => res.json())
                .then(data => setBookings(Array.isArray(data) ? data : []))
                .catch(err => console.error('Error fetching bookings:', err));
            
            // Fetch orders
            fetch(`http://localhost:8080/api/orders/user/${userId}`)
                .then(res => res.json())
                .then(data => setOrders(Array.isArray(data) ? data : []))
                .catch(err => console.error('Error fetching orders:', err));
        }
    }, []);

    return (
        <div className="p-8 pb-16 min-h-screen space-y-12">


            <div className="relative bg-[#5C4033] rounded-xl shadow-lg overflow-hidden h-96 flex items-center p-10 md:p-16">

                <img
                    src={welcomeBackBg}
                    alt="Welcome staff background"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="relative z-10 text-white text-left max-w-xl">
                    <h1 className="text-5xl font-bold mb-4">Welcome Back!</h1>
                    <p className="text-lg opacity-90">
                        Your favorite coffee experience is just a click away. Explore our menu, book a table, or track your orders.
                    </p>
                    <div className="flex space-x-4 mt-8">
                        <button
                            onClick={() => setActiveSection('Menu')}
                            className="bg-[#D4AF37] text-[#5C4033] px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-[#EBDD79] transition-colors duration-200 shadow-md"
                        >
                            <span>Explore Menu</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </button>
                        <button
                            onClick={() => setActiveSection('Book Table')}
                            className="bg-white text-[#5C4033] px-6 py-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        >
                            Book a Table
                        </button>
                    </div>
                </div>
            </div>


{/* STAT CARDS */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    
    {/* Total Bookings */}
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <CalendarDays className="w-10 h-10 text-[#8B5A2B]" />
        <div>
            <p className="text-sm text-gray-500">Total Bookings</p>
            <h2 className="text-2xl font-bold text-[#5C4033]">
                {bookings.length}
            </h2>
        </div>
    </div>

    {/* Total Orders */}
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <Coffee className="w-10 h-10 text-[#8B5A2B]" />
        <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <h2 className="text-2xl font-bold text-[#5C4033]">
                {orders.length}
            </h2>
        </div>
    </div>

    {/* Total Payments */}
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <CreditCard className="w-10 h-10 text-[#8B5A2B]" />
        <div>
            <p className="text-sm text-gray-500">Completed Payments</p>
            <h2 className="text-2xl font-bold text-[#5C4033]">
                {orders.filter(o => o.paymentId).length}
            </h2>
        </div>
    </div>

    {/* Revenue */}
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <FileText className="w-10 h-10 text-[#8B5A2B]" />
        <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h2 className="text-2xl font-bold text-[#5C4033]">
                ₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(2)}
            </h2>
        </div>
    </div>

</div>

{/* STAT CARDS */}



            {/* --- 2.  Reserve Your Spot--- */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center p-8 md:p-12">

                <div className="md:w-1/2 flex justify-center order-1 md:pr-8 mb-8 md:mb-0">
                    <img
                        src={reserveTableBg}
                        alt="Reserved table setting"
                        className="rounded-lg shadow-xl w-full max-w-md transition-transform duration-500 hover:scale-[1.05]"
                    />
                </div>


                <div className="md:w-1/2 text-center md:text-left order-2 md:pl-8">
                    <div className="inline-flex items-center space-x-2 text-[#8B5A2B] bg-amber-50 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <CalendarDays className="w-4 h-4" />
                        <span>Table Reservation</span>
                    </div>
                    <h2 className="text-4xl font-bold text-[#5C4033] mb-4">Reserve Your Perfect Spot</h2>
                    <p className="text-gray-600 mb-6">
                        Whether you're planning a cozy coffee date, a business meeting, or gathering with friends, we've got the perfect table waiting for you. Book in advance and skip the wait.
                    </p>
                    <ul className="text-gray-700 space-y-2 mb-8 list-none md:list-disc md:list-inside ml-4">
                        <li>Choose your preferred time slot</li>
                        <li>Select number of guests</li>
                        <li>Add special requests or preferences</li>
                    </ul>
                    <button
                        onClick={() => setActiveSection('Book Table')}
                        className="bg-[#8B5A2B] text-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-[#A06D3E] transition-colors duration-200 mx-auto md:mx-0 shadow-md"
                    >
                        <span>Book a Table Now</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </button>
                </div>
            </div>


            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center p-8 md:p-12 mt-16">


                <div className="md:w-1/2 text-center md:text-left order-2 md:order-1 md:pr-8 mb-8 md:mb-0">
                    <div className="inline-flex items-center space-x-2 text-[#8B5A2B] bg-amber-50 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <Menu className="w-4 h-4" />
                        <span>Our Menu</span>
                    </div>
                    <h2 className="text-4xl font-bold text-[#5C4033] mb-4">Discover Our Coffee Collection</h2>
                    <p className="text-gray-600 mb-6">
                        From bold espressos to refreshing iced coffees, explore our carefully curated menu of handcrafted beverages and delicious pastries. Every item is made with premium ingredients and lots of love.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-[#F8F5F0] p-4 rounded-lg">
                            <h4 className="font-semibold text-[#5C4033]">Hot Coffee</h4>
                            <p className="text-sm text-gray-500">Classic favorites</p>
                        </div>
                        <div className="bg-[#F8F5F0] p-4 rounded-lg">
                            <h4 className="font-semibold text-[#5C4033]">Iced Drinks</h4>
                            <p className="text-sm text-gray-500">Cool refreshments</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setActiveSection('Menu')}
                        className="bg-[#8B5A2B] text-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-[#A06D3E] transition-colors duration-200 mx-auto md:mx-0 shadow-md"
                    >
                        <span>Explore Full Menu</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </button>
                </div>


                <div className="md:w-1/2 flex justify-center order-1 md:order-2 md:pl-8">
                    <img
                        src={discoverMenuBg}
                        alt="Coffee Menu Board"
                        className="rounded-lg shadow-xl w-full max-w-md transition-transform duration-500 hover:scale-[1.05]"
                    />
                </div>
            </div>
        </div>
    );
}

// --- 1. MENU SCREEN
function MenuScreen({ cart, setCart, showToast, setActiveSection }) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [menuItems, setMenuItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching menu items from:', `http://localhost:8080/api/menu/all`);
            const response = await fetch(`http://localhost:8080/api/menu/all`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to fetch menu items`);
            }

            const data = await response.json();
            console.log('Menu data received:', data);
            console.log('First item keys:', Object.keys(data[0] || {}));
            console.log('First item imageUrl:', data[0]?.imageUrl);
            console.log('First item image_url:', data[0]?.image_url);

            if (!Array.isArray(data) || data.length === 0) {
                setError('No menu items found');
                showToast('No menu items available', 'info');
                return;
            }

            // Group by category
            const groupedItems = data.reduce((acc, item) => {
                const category = item.category || 'Other';
                if (!acc[category]) acc[category] = [];

                acc[category].push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    // image: `/images/${item.image_url || item.imageUrl}`,
                    image: item.imageUrl,
                    category: item.category
                });
                return acc;
            }, {});

            // Add "All" category
            groupedItems["All"] = data.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                description: item.description,
                // image: `/images/${item.image_url || item.imageUrl}`,
                image: item.imageUrl,
                category: item.category
            }));

            setMenuItems(groupedItems);
            setSelectedCategory("All");
            console.log('Menu items grouped:', groupedItems);

        } catch (err) {
            console.error('Error fetching menu items:', err);
            setError(err.message);
            showToast('Failed to load menu items: ' + err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const categories = ["All", ...Object.keys(menuItems).filter(cat => cat !== "All")];

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        showToast(`✅ ${item.name} added to cart!`, 'success');
    };

    // 🔹 Fixed filter logic
    const filteredItems = (menuItems[selectedCategory] || []).filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-[#5C4033] mb-2">Explore Our Menu</h2>
                <p className="text-gray-600 mb-8">Discover our handcrafted coffee and delicious treats</p>

                {/* Search + Categories */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                    {/* Search Bar */}
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for coffee, tea, or pastries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-gray-800"
                        />
                    </div>

                    {/* Category Buttons */}
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap
                                    ${selectedCategory === cat
                                        ? 'bg-[#8B5A2B] text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                                    transition-colors duration-200`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <Loader className="w-12 h-12 animate-spin text-[#8B5A2B] mx-auto mb-4" />
                            <p className="text-gray-600">Loading menu items...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-800 font-semibold mb-2">Unable to load menu items</p>
                        <p className="text-red-600 text-sm mb-4">{error}</p>
                        <button
                            onClick={fetchMenuItems}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Menu Items Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No items found matching "{searchQuery}" in {selectedCategory}.
                            </div>
                        ) : (
                            filteredItems.map(item => (
                                <div
                                    key={item.id}
                                    className="bg-[#F8F5F0] rounded-xl shadow-sm overflow-hidden flex flex-col transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
                                >
                                    <div className="relative">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-40 object-cover"
                                            onError={(e) => {
                                                console.log('Image failed to load:', item.image);
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = '<div class="w-full h-40 flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200"><svg class="w-12 h-12 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg></div>';
                                            }}
                                            onLoad={() => console.log('Image loaded successfully:', item.image)}
                                        />
                                    </div>

                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-xl font-semibold text-[#5C4033] mb-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-3 flex-grow line-clamp-2">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-lg font-bold text-[#5C4033]">
                                                ₹{item.price.toFixed(2)}
                                            </span>

                                            <button
                                                onClick={() => addToCart(item)}
                                                className="bg-[#8B5A2B] text-white px-4 py-2 rounded-full text-sm flex items-center space-x-1 hover:bg-[#A06D3E] transition-colors duration-200"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Add to Cart</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}



// --- NEW: CART SCREEN (Review & Update Quantities) ---
function CartScreen({ navigate, cart, setCart, subtotal, total, showToast }) {

    const updateItemQuantity = (itemId, change) => {
        setCart(prevCart => {
            const newCart = prevCart.map(item => {
                if (item.id === itemId) {
                    const newQuantity = item.quantity + change;
                    if (newQuantity <= 0) {
                        return null; // Mark for removal
                    }
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(Boolean);

            if (newCart.length === prevCart.length) {
                showToast(change > 0 ? 'Quantity increased' : 'Quantity decreased', 'info');
            } else if (newCart.length < prevCart.length) {
                showToast('Item removed from cart.', 'error');
            }

            return newCart;
        });
    };

    const removeItemFromCart = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
        showToast('Item removed from cart.', 'error');
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-xl mx-auto p-8 min-h-[calc(100vh-80px)] flex flex-col justify-center items-center">
                <ShoppingCart className="w-16 h-16 text-gray-400 mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-8 text-center">Add some delicious items from our menu to start your order!</p>
                <button
                    onClick={() => navigate('Menu')}
                    className="px-6 py-3 bg-[#8B5A2B] text-white rounded-full font-bold hover:bg-[#A06D3E] transition-colors shadow-md"
                >
                    Go to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-8 min-h-[calc(100vh-80px)]">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Your Shopping Cart</h1>
            <p className="text-gray-500 mb-8">Review your items and proceed to checkout.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Cart Items List */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="flex space-x-4 border-b pb-4 items-center last:border-b-0 last:pb-0">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200"><svg class="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg></div>';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
                                        <Coffee className="w-8 h-8 text-amber-800" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} / item</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2 border rounded-full p-1 bg-gray-50">
                                <button
                                    onClick={() => updateItemQuantity(item.id, -1)}
                                    className="p-1 rounded-full text-[#8B5A2B] hover:bg-gray-200 transition"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-semibold text-gray-800 w-5 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateItemQuantity(item.id, 1)}
                                    className="p-1 rounded-full text-[#8B5A2B] hover:bg-gray-200 transition"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Subtotal and Remove */}
                            <div className="flex flex-col items-end">
                                <span className="font-bold text-gray-800 mb-1 w-20 text-right">₹{(item.price * item.quantity).toFixed(2)}</span>
                                <button
                                    onClick={() => removeItemFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                                    title="Remove item"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary & Checkout Button */}
                <div className="bg-gray-50 rounded-xl shadow-lg p-6 space-y-4 h-fit">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Order Summary</h2>

                    {/* Totals */}
                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 border-b pb-3">
                            <span>Taxes & Fees</span>
                            <span>₹{(total - subtotal).toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-xl font-bold text-[#5C4033] pt-3">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                        onClick={() => navigate('Checkout')}
                        className="w-full flex items-center justify-center px-8 py-3 text-white rounded-lg font-bold text-lg transition-colors shadow-md bg-[#8B5A2B] hover:bg-[#5C4033]"
                    >
                        Proceed to Checkout <ChevronRight className="w-5 h-5 ml-2" />
                    </button>
                    <button
                        onClick={() => navigate('Menu')}
                        className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- 2. ORDERS SCREEN
function OrdersScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const userId = localStorage.getItem("userId");
            let response;
            if (userId) {
                response = await fetch(`http://localhost:8080/api/orders/user/${userId}`);
            } else {
                response = await fetch('http://localhost:8080/api/orders');
            }
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const currentOrders = orders.filter(order => order.status !== 'Served' && order.status !== 'Cancelled');
    const pastOrders = orders.filter(order => order.status === 'Served' || order.status === 'Cancelled');

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-yellow-600 bg-yellow-50';
            case 'InPreparation': return 'text-orange-600 bg-orange-50';
            case 'ReadyToServe': return 'text-green-600 bg-green-50';
            case 'Served': return 'text-gray-600 bg-gray-50';
            default: return 'text-blue-600 bg-blue-50';
        }
    };
    const getProgressPercentage = (status) => {
        switch (status) {
            case 'Pending': return 25;
            case 'InPreparation': return 60;
            case 'ReadyToServe': return 90;
            case 'Served': return 100;
            default: return 0;
        }
    };
    const formatStatus = (status) => {
        switch (status) {
            case 'InPreparation': return 'IN PREPARATION';
            case 'ReadyToServe': return 'READY TO SERVE';
            default: return status?.toUpperCase();
        }
    };

    // ---------------- Current Order Card ----------------
    const CurrentOrderCard = ({ order }) => (
        <div key={order.id} className="bg-white rounded-xl shadow-lg border border-[#F8F5F0] p-6 flex space-x-6 items-center transition-transform duration-200 hover:scale-[1.01]">
            <div className="w-24 h-24 bg-gradient-to-br from-[#F8F5F0] to-white rounded-lg flex-shrink-0 flex items-center justify-center">
                <Package className="w-12 h-12 text-[#8B5A2B]" />
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="font-semibold text-gray-800">Order #{order.id}</span>
                        <span className={`ml-3 text-xs font-bold px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                            {formatStatus(order.status)}
                        </span>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-600">
                    Items: {order.items?.map(item => `${item.quantity}x ${item.menuItemName}`).join(', ')}
                </p>
                <p className="text-sm font-semibold text-[#8B5A2B]">Total: ₹{order.totalAmount?.toFixed(2)}</p>
                <div className="pt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(order.status)}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );

    // ---------------- Past Order Card ----------------
    const PastOrderCard = ({ order }) => (
        <div key={order.id} className="flex justify-between items-center bg-[#F8F5F0] rounded-xl p-4 border border-gray-200 transition-transform duration-200 hover:scale-[1.01]">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-amber-200 rounded-full flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-[#5C4033]" />
                </div>
                <div>
                    <p className="font-bold text-gray-800">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)} • {order.items?.length || 0} Items • ₹{order.totalAmount?.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-[#8B5A2B] text-white rounded-lg text-sm font-semibold hover:bg-[#A06D3E] transition-colors">Order Again</button>

                {order.status === 'Served' && !order.feedbackGiven && (
                    <button
                        onClick={() => { setCurrentOrder(order); setShowFeedbackModal(true); }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Give Feedback
                    </button>
                )}
            </div>
        </div>
    );

    // ---------------- Feedback Modal ----------------
    const submitFeedback = async () => {
        if (!currentOrder) return;
        try {
            const userId = localStorage.getItem("userId");
            await fetch("http://localhost:8080/api/feedback/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: currentOrder.id, userId, rating, comment })
            });
            alert("Feedback submitted!");
            setShowFeedbackModal(false);
            setCurrentOrder(null);
            setRating(0);
            setComment("");
            fetchOrders(); // refresh orders
        } catch (err) {
            console.error(err);
            alert("Failed to submit feedback.");
        }
    };

    return (
        <div className="p-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <SectionTitle title="Order History" subtitle="Track your past and current coffee orders" />

                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <Loader className="w-12 h-12 animate-spin text-[#8B5A2B] mx-auto mb-4" />
                            <p className="text-gray-600">Loading your orders...</p>
                        </div>
                    </div>
                )}

                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-800 font-semibold mb-2">Unable to load orders</p>
                        <p className="text-red-600 text-sm mb-4">{error}</p>
                        <button onClick={fetchOrders} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Try Again</button>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Current Orders ({currentOrders.length})</h3>
                        {currentOrders.length === 0 ? (
                            <div className="bg-[#F8F5F0] rounded-xl p-8 text-center mb-10">
                                <Package className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">No current orders in preparation.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-10">
                                {currentOrders.map(order => <CurrentOrderCard key={order.id} order={order} />)}
                            </div>
                        )}

                        <h3 className="text-xl font-bold text-gray-700 mb-4">Past Orders ({pastOrders.length})</h3>
                        {pastOrders.length === 0 ? (
                            <div className="bg-[#F8F5F0] rounded-xl p-8 text-center">
                                <Layers className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">No past completed or cancelled orders.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pastOrders.map(order => <PastOrderCard key={order.id} order={order} />)}
                            </div>
                        )}
                    </>
                )}

            </div>

            {showFeedbackModal && currentOrder && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl p-6 w-96 space-y-4">
                        <h3 className="text-lg font-bold text-gray-700">Rate Your Order</h3>

                        <div className="flex space-x-2 text-3xl justify-center">
                            {[1,2,3,4,5].map(star => (
                                <span
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={star <= rating ? "text-yellow-400 cursor-pointer" : "text-gray-300 cursor-pointer"}
                                >★</span>
                            ))}
                        </div>

                        <textarea
                            placeholder="Optional comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-md p-3 resize-none h-24"
                        />

                        <div className="flex justify-end space-x-2">
                            <button onClick={() => { setShowFeedbackModal(false); setCurrentOrder(null); }} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
                            <button onClick={submitFeedback} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Submit</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}


// --- 3. BOOKING SCREEN

// 1. Add the background image constant
const pageBg = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2561&auto=format&fit=crop';

function BookingScreen({ showToast }) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [guests, setGuests] = useState(2);
    const [selectedTable, setSelectedTable] = useState(null);
    const [availableTables, setAvailableTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (date && time) {
            fetchAvailableTables();
        }
    }, [date, time]);

    const fetchAvailableTables = async () => {
        try {
            setLoading(true);
            console.log('Fetching tables for:', { date, time, guests });
            
            // Try different API endpoints
            let response;
            try {
                response = await fetch('http://localhost:8080/api/bookings/tables/available');
            } catch (err) {
                console.log('First API failed, trying alternative...');
                response = await fetch('http://localhost:8080/api/tables');
            }
            
            console.log('API Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to fetch tables`);
            }
            
            const data = await response.json();
            console.log('Tables data received:', data);
            
            if (!Array.isArray(data)) {
                console.log('Data is not array, converting...');
                setAvailableTables([]);
                showToast('No tables data available', 'info');
                return;
            }
            
            // If no tables, create some dummy tables for testing
            if (data.length === 0) {
                console.log('No tables found, creating dummy tables');
                const dummyTables = [
                    { id: 1, table_number: 1, seats: 1, available: true, tableNumber: 1 },
                    { id: 2, table_number: 2, seats: 2, available: true, tableNumber: 2 },
                    { id: 3, table_number: 3, seats: 3, available: true, tableNumber: 3 },
                    { id: 4, table_number: 4, seats: 4, available: true, tableNumber: 4 },
                    { id: 5, table_number: 5, seats: 5, available: true, tableNumber: 5 },
                    { id: 6, table_number: 6, seats: 6, available: true, tableNumber: 6 },
                    { id: 7, table_number: 7, seats: 7, available: true, tableNumber: 7 },
                    { id: 8, table_number: 8, seats: 8, available: true, tableNumber: 8 }
                ];
                setAvailableTables(dummyTables);
                showToast('Using demo tables (no tables in database)', 'info');
                return;
            }
            
            // Map database columns to expected format
            const mappedTables = data.map(table => ({
                ...table,
                tableNumber: table.table_number || table.tableNumber,
                seats: table.seats || 4 // default to 4 seats if not specified
            }));
            
            setAvailableTables(mappedTables);
            console.log('Available tables set:', mappedTables);
            
        } catch (error) {
            console.error('Error fetching tables:', error);
            showToast('Failed to load tables: ' + error.message, 'error');
            
            // Fallback to dummy tables
            const dummyTables = [
                { id: 1, table_number: 1, seats: 1, available: true, tableNumber: 1 },
                { id: 2, table_number: 2, seats: 2, available: true, tableNumber: 2 },
                { id: 3, table_number: 3, seats: 3, available: true, tableNumber: 3 },
                { id: 4, table_number: 4, seats: 4, available: true, tableNumber: 4 },
                { id: 5, table_number: 5, seats: 5, available: true, tableNumber: 5 },
                { id: 6, table_number: 6, seats: 6, available: true, tableNumber: 6 },
                { id: 7, table_number: 7, seats: 7, available: true, tableNumber: 7 },
                { id: 8, table_number: 8, seats: 8, available: true, tableNumber: 8 }
            ];
            setAvailableTables(dummyTables);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
    if (!date || !time || !guests || !selectedTable) {
        showToast('Please fill all fields and select a table.', 'error');
        return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
        showToast('⚠️ Please log in to book a table.', 'error');
        return;
    }

    const bookingTime = `${date}T${time}:00`;

    // Log what we're sending
    const bookingData = {
        userId: parseInt(userId),
        tableNumber: selectedTable.tableNumber,
        bookingTime: bookingTime,
        numberOfPeople: guests
    };
    console.log('Sending booking data:', bookingData);

    try {
        setSubmitting(true);
        const response = await fetch(
            'http://localhost:8080/api/bookings/book',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            }
        );

        // Log the response status
        console.log('Response status:', response.status);

        if (response.ok) {
            localStorage.setItem("tableNumber", selectedTable.tableNumber);
            localStorage.setItem("bookingTime", bookingTime);
            showToast(`✅ Table ${selectedTable.tableNumber} booked successfully!`, 'success');
            
            setDate('');
            setTime('');
            setGuests(2);
            setSelectedTable(null);
            setAvailableTables([]);
        } else {
            // Try to get detailed error
            const contentType = response.headers.get("content-type");
            let errorText;
            if (contentType && contentType.includes("application/json")) {
                const errorJson = await response.json();
                errorText = errorJson.message || JSON.stringify(errorJson);
            } else {
                errorText = await response.text();
            }
            console.error('Error response:', errorText);
            showToast(`❌ Booking failed: ${errorText}`, 'error');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        showToast('⚠️ Error connecting to server.', 'error');
    } finally {
        setSubmitting(false);
    }
};

    const suitableTables = availableTables.filter(table => table.seats >= guests);

    return (
        <div className="min-h-screen relative overflow-hidden p-8 pb-16 flex items-center justify-center">
            <div 
                className="absolute inset-0 blur-md scale-105"
                style={{
                    backgroundImage: `url(${pageBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />

            <div className="bg-white rounded-xl shadow-2xl p-8 relative z-10 w-full max-w-5xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-4xl font-extrabold text-[#5C4033] mb-2">Book a Table</h2>
                    <p className="text-gray-600">Reserve your perfect spot with real-time availability</p>
                </div>

                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2">
                                <CalendarDays className="w-5 h-5 text-[#8B5A2B]" />
                                <span>Date</span>
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#8B5A2B] focus:border-[#8B5A2B] transition-all"
                                required
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-[#8B5A2B]" />
                                <span>Time</span>
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                min="08:00"
                                max="22:00"
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#8B5A2B] focus:border-[#8B5A2B] transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2">
                                <Users className="w-5 h-5 text-[#8B5A2B]" />
                                <span>Guests</span>
                            </label>
                            <select
                                value={guests}
                                onChange={(e) => setGuests(Number(e.target.value))}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#8B5A2B] focus:border-[#8B5A2B] transition-all"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {date && time && (
                        <div className="bg-[#F8F5F0] rounded-xl p-6 border-2 border-[#D4AF37]/30">
                            <h3 className="text-xl font-bold text-[#5C4033] mb-4 flex items-center space-x-2">
                                <MapPin className="w-5 h-5 text-[#8B5A2B]" />
                                <span>Available Tables</span>
                            </h3>

                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader className="w-8 h-8 animate-spin text-[#8B5A2B]" />
                                    <span className="ml-3 text-gray-600">Loading tables...</span>
                                </div>
                            ) : suitableTables.length === 0 ? (
                                <div className="text-center py-12">
                                    <X className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 font-semibold">No tables available for {guests} guests</p>
                                    <p className="text-gray-500 text-sm mt-2">Try selecting a different date/time or fewer guests</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {suitableTables.map(table => (
                                        <button
                                            key={table.id}
                                            onClick={() => setSelectedTable(table)}
                                            className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                                                selectedTable?.id === table.id
                                                    ? 'border-[#8B5A2B] bg-[#8B5A2B] text-white shadow-lg'
                                                    : 'border-gray-300 bg-white text-gray-800 hover:border-[#D4AF37]'
                                            }`}
                                        >
                                            {selectedTable?.id === table.id && (
                                                <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-white" />
                                            )}
                                            <div className="text-center">
                                                <p className="text-2xl font-bold mb-1">#{table.tableNumber}</p>
                                                <p className="text-xs opacity-90">
                                                    <Users className="w-3 h-3 inline mr-1" />
                                                    {table.seats} seats
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {selectedTable && (
                                <div className="mt-6 p-4 bg-white rounded-lg border-2 border-[#8B5A2B]">
                                    <p className="text-sm font-semibold text-[#5C4033]">
                                        ✓ Selected: Table #{selectedTable.tableNumber} ({selectedTable.seats} seats)
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedTable || submitting}
                            className={`w-full py-4 px-4 text-lg font-bold text-white rounded-lg transition-all duration-200 shadow-lg ${
                                !selectedTable || submitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#8B5A2B] hover:bg-[#A06D3E] hover:shadow-xl'
                            }`}
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center">
                                    <Loader className="w-5 h-5 animate-spin mr-2" />
                                    Confirming Booking...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Confirm Reservation
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
//payment screen


function PaymentScreen({ navigate, cart, setCart, subtotal, taxes, total, showToast }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

//   const handleProceed = async () => {
//     const userId = localStorage.getItem("userId");
//     const tableNumber = localStorage.getItem("tableNumber");  // ✅ added

//     if (!userId) {
//       showToast("⚠️ Please log in first", "error");
//       return;
//     }

//     if (!tableNumber) {
//       showToast("⚠️ Please select a table before ordering", "error");
//       return;
//     }

//     setIsProcessing(true);

//     const res = await loadRazorpayScript();
//     if (!res) {
//       showToast("Failed to load Razorpay SDK!", "error");
//       setIsProcessing(false);
//       return;
//     }

//     const options = {
//       key: "rzp_test_1DP5mmOlF5G5ag",
//       amount: total * 100,
//       currency: "INR",
//       name: "The Coffee Bean",
//       description: "Order Payment",
//       image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Coffee_cup_icon.png",

//       handler: async function (response) {
//         console.log("Payment Success:", response);

//         try {
//           const orderData = {
//             userId: parseInt(userId),
//             tableNumber: parseInt(tableNumber),   // ✅ added table number
//             items: cart.map((item) => ({
//               menuItemId: item.id,
//               quantity: item.quantity,
//             })),
//             paymentId: response.razorpay_payment_id,
//           };

//           const backendResponse = await fetch("http://localhost:8080/api/orders", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(orderData),
//           });

//           if (!backendResponse.ok) {
//             const msg = await backendResponse.text();
//             throw new Error(msg || "Failed to create order");
//           }

//           const createdOrder = await backendResponse.json();
//           showToast(`✅ Order #${createdOrder.id} placed successfully!`, "success");

//           setCart([]);
//           setTimeout(() => navigate("My Orders"), 1500);

//         } catch (error) {
//           console.error("Error placing order:", error);
//           showToast(`❌ Failed: ${error.message}`, "error");
//         } finally {
//           setIsProcessing(false);
//         }
//       },

//       prefill: {
//         name: "Customer",
//         email: "demo@example.com",
//         contact: "9999999999",
//       },

//       theme: { color: "#8B5A2B" },
//     };

//     new window.Razorpay(options).open();
//   };
    const handleProceed = async () => {
        const userId = localStorage.getItem("userId");
        const tableNumber = localStorage.getItem("tableNumber");

        if (!userId) {
            showToast("⚠️ Please log in first", "error");
            return;
        }

        if (!tableNumber) {
            showToast("⚠️ Please select a table before ordering", "error");
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Load Razorpay SDK
            const res = await loadRazorpayScript();

            if (!res) {
            showToast("Failed to load Razorpay SDK!", "error");
            setIsProcessing(false);
            return;
            }

            // 2. Ask Django to create a Razorpay order
            const paymentResponse = await fetch(
            "http://localhost:8080/api/payment/create-order",
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                amount: total,
                }),
            }
            );

            if (!paymentResponse.ok) {
            const errorText = await paymentResponse.text();
            throw new Error(
                errorText || "Failed to create Razorpay order"
            );
            }

            const razorpayOrder = await paymentResponse.json();

            console.log("Razorpay Order Created:", razorpayOrder);

            // 3. Open Razorpay using the order created by Django
            const options = {
            key: razorpayOrder.key,

            amount: razorpayOrder.amount,

            currency: razorpayOrder.currency,

            order_id: razorpayOrder.id,

            name: "ServioCafe",

            description: "Order Payment",

            image:
                "https://upload.wikimedia.org/wikipedia/commons/7/7e/Coffee_cup_icon.png",

            handler: async function (response) {
                console.log("Payment Success:", response);

                try {
                // 4. Create the actual application order
                const orderData = {
                    userId: parseInt(userId),

                    tableNumber: parseInt(tableNumber),

                    items: cart.map((item) => ({
                    menuItemId: item.id,
                    quantity: item.quantity,
                    })),

                    paymentId: response.razorpay_payment_id,
                };

                const backendResponse = await fetch(
                    "http://localhost:8080/api/orders/",
                    {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(orderData),
                    }
                );

                if (!backendResponse.ok) {
                    const msg = await backendResponse.text();

                    throw new Error(
                    msg || "Failed to create order"
                    );
                }

                const createdOrder =
                    await backendResponse.json();

                showToast(
                    `✅ Order #${createdOrder.id} placed successfully!`,
                    "success"
                );

                setCart([]);

                setTimeout(() => {
                    navigate("My Orders");
                }, 1500);

                } catch (error) {
                console.error(
                    "Error placing order:",
                    error
                );

                showToast(
                    `❌ Failed: ${error.message}`,
                    "error"
                );
                } finally {
                setIsProcessing(false);
                }
            },

            prefill: {
                name: "Customer",
                email: "demo@example.com",
                contact: "9999999999",
            },

            theme: {
                color: "#8B5A2B",
            },
            };

            // 5. Open Razorpay Checkout
            const razorpay = new window.Razorpay(options);

            razorpay.open();

        } catch (error) {
            console.error(
            "Payment initialization failed:",
            error
            );

            showToast(
            `❌ Payment initialization failed: ${error.message}`,
            "error"
            );

            setIsProcessing(false);
        }
        };
        
  return (
    <div className="max-w-6xl mx-auto p-8 min-h-[calc(100vh-80px)]">

      {/* Navigation */}
      <div className="mb-8 flex items-center space-x-2 text-sm">
        <span className="text-amber-700 hover:text-amber-900 cursor-pointer" onClick={() => navigate("Cart")}>
          Cart
        </span>
        <ChevronRight className="w-4 h-4 text-amber-700" />
        <span className="font-bold text-amber-900">Checkout</span>
        <ChevronRight className="w-4 h-4 text-gray-500" />
        <span className="text-gray-500">Confirmation</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Pay Section */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Complete Your Order</h1>
          <p className="text-gray-500 mb-8">Confirm your order and proceed to payment.</p>

          <div className="bg-white rounded-xl shadow-lg border p-6 mb-8">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h3 className="text-xl font-bold text-gray-800">Payment Method</h3>
              <CreditCard className="w-6 h-6 text-[#8B5A2B]" />
            </div>

            <p className="text-gray-600 mb-4">Redirecting to Razorpay secure payment gateway.</p>

            <div className="flex items-center text-sm text-gray-700">
              <Shield className="w-4 h-4 mr-2 text-green-600" />
              <span>100% Secure & Encrypted</span>
            </div>
          </div>

          <button
            onClick={handleProceed}
            disabled={isProcessing || cart.length === 0}
            className={`w-full flex items-center justify-center px-8 py-4 text-white rounded-lg font-bold text-xl shadow-lg ${
              isProcessing || cart.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-amber-800 hover:bg-amber-900"
            }`}
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5 mr-3 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                Pay ₹{total.toFixed(2)} <CheckCircle className="w-5 h-5 ml-3" />
              </>
            )}
          </button>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Order Summary</h2>

          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{item.quantity}x {item.name}</span>
              <span className="font-semibold text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-3">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}



// --- NEW: 5. PROFILE SCREEN ---
function ProfileScreen({ showToast }) {

    const userId = localStorage.getItem("userId");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });

    const [memberSince] = useState("November 2024");
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordEditing, setIsPasswordEditing] = useState(false);

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // --------------------------
    // FETCH PROFILE FROM BACKEND
    // --------------------------
    const fetchProfile = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/users/${userId}`);
            if (!res.ok) throw new Error("Failed to fetch profile");

            const data = await res.json();

            setFormData({
                name: data.name || "",
                email: data.email || "",
                phone: data.phone || ""
            });

        } catch (error) {
            console.error("Error fetching profile:", error);
            showToast("Failed to load profile", "error");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // --------------------------
    // SAVE PROFILE
    // --------------------------
    const handleSave = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            showToast('Please fill out all fields before saving.', 'error');
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                }),
            });

            if (res.ok) {
                showToast("Profile updated successfully!", "success");
                setIsEditing(false);
                fetchProfile();
            } else {
                const error = await res.text();
                showToast(error || "Failed to update profile", "error");
            }

        } catch (error) {
            console.error("Error updating profile:", error);
            showToast("Error updating profile", "error");
        }
    };

    // --------------------------
    // UPDATE PASSWORD
    // --------------------------
    const handlePasswordSave = async (e) => {
        e.preventDefault();

        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            showToast("Please fill all password fields.", "error");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast("New passwords do not match!", "error");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/users/${userId}/password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(passwordData),
            });

            if (res.ok) {
                showToast("Password updated successfully!", "success");
                setIsPasswordEditing(false);
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                const error = await res.text();
                showToast(error || "Failed to update password", "error");
            }

        } catch (error) {
            console.error("Password update error:", error);
            showToast("Error updating password", "error");
        }
    };

    // --------------------------
    // HANDLE INPUT CHANGES
    // --------------------------
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handlePasswordChange = (e) => {
        const { id, value } = e.target;
        setPasswordData(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div className="p-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <SectionTitle title="Account Settings" subtitle="Manage your account and preferences" />

                <h3 className="text-2xl font-bold text-[#5C4033] mb-6 flex items-center space-x-3 border-b pb-3">
                    <User className="w-6 h-6 text-[#8B5A2B]" />
                    <span>My Profile</span>
                </h3>

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Profile Card */}
                    <div className="bg-[#F8F5F0] p-6 rounded-xl shadow-sm">
                        <div className="flex justify-end mb-4">
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(!isEditing)} 
                                className="text-[#8B5A2B] hover:text-[#5C4033] font-semibold text-sm"
                            >
                                {isEditing ? "Cancel Edit" : "Edit Details"}
                            </button>
                        </div>

                        <div className="flex items-center space-x-6 mb-6">
                            <div className="w-16 h-16 bg-[#8B5A2B] text-white flex items-center justify-center text-xl font-bold rounded-full">
                                {formData.name
                                    ? formData.name.split(' ').map(n => n[0]).join('')
                                    : "U"}
                            </div>

                            <div>
                                <div className="flex items-center space-x-2">
                                    <h4 className="text-2xl font-semibold text-[#5C4033]">{formData.name || "User"}</h4>
                                    <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
                                        Gold Member
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm">Member since {memberSince}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full p-3 border rounded-lg focus:ring-[#D4AF37] ${
                                        isEditing ? 'bg-white border-gray-400' 
                                                  : 'bg-gray-100 border-gray-200 cursor-default'
                                    }`}
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full p-3 border rounded-lg focus:ring-[#D4AF37] ${
                                        isEditing ? 'bg-white border-gray-400' 
                                                  : 'bg-gray-100 border-gray-200 cursor-default'
                                    }`}
                                />
                            </div>

                            {/* Full Name */}
                            <div className="space-y-2 col-span-full">
                                <label className="block text-sm font-bold text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full p-3 border rounded-lg focus:ring-[#D4AF37] ${
                                        isEditing ? 'bg-white border-gray-400' 
                                                  : 'bg-gray-100 border-gray-200 cursor-default'
                                    }`}
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="pt-6 text-center">
                                <button 
                                    type="submit" 
                                    className="px-8 py-3 bg-[#8B5A2B] text-white rounded-full font-bold hover:bg-[#5C4033] transition-colors shadow-md"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ------------------- PASSWORD UPDATE SECTION ------------------- */}
                    <div className="bg-[#F8F5F0] p-6 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xl font-bold text-[#5C4033]">Password Settings</h4>

                            <button
                                type="button"
                                onClick={() => setIsPasswordEditing(!isPasswordEditing)}
                                className="text-[#8B5A2B] hover:text-[#5C4033] font-semibold text-sm"
                            >
                                {isPasswordEditing ? "Cancel" : "Change Password"}
                            </button>
                        </div>

                        {isPasswordEditing && (
                            <form onSubmit={handlePasswordSave} className="space-y-4">

                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Old Password</label>
                                    <input
                                        type="password"
                                        id="oldPassword"
                                        value={passwordData.oldPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full p-3 border rounded-lg bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700">New Password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full p-3 border rounded-lg bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full p-3 border rounded-lg bg-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-4 py-3 bg-[#8B5A2B] text-white rounded-full font-bold hover:bg-[#5C4033]"
                                >
                                    Update Password
                                </button>

                            </form>
                        )}
                    </div>

                    {/* ------------------- STATS (UNCHANGED) ------------------- */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 pt-8 border-t border-gray-200">
                        <div className="bg-[#F8F5F0] p-6 rounded-xl shadow-sm text-center">
                            <Package className="w-8 h-8 text-[#8B5A2B] mx-auto mb-3" />
                            <p className="text-3xl font-bold text-[#5C4033]">42</p>
                            <p className="text-sm text-gray-500">Total Orders</p>
                        </div>

                        <div className="bg-[#F8F5F0] p-6 rounded-xl shadow-sm text-center">
                            <Heart className="w-8 h-8 text-[#8B5A2B] mx-auto mb-3" />
                            <p className="text-3xl font-bold text-[#5C4033]">8</p>
                            <p className="text-sm text-gray-500">Favorite Items</p>
                        </div>

                        <div className="bg-[#F8F5F0] p-6 rounded-xl shadow-sm text-center">
                            <Award className="w-8 h-8 text-[#8B5A2B] mx-auto mb-3" />
                            <p className="text-3xl font-bold text-[#5C4033]">1,250</p>
                            <p className="text-sm text-gray-500">Rewards Points</p>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}


//6 report
function ReportFeedbackScreen({ showToast, setActiveSection }) {
    const [message, setMessage] = useState('');
    const [type, setType] = useState('Feedback');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) {
            showToast('Please enter your message.', 'error');
            return;
        }

        try {
            setLoading(true);
            const userId = localStorage.getItem("userId");

            const response = await fetch("http://localhost:8080/api/reports/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: Number(userId),
                    type,
                    message
                })
            });

            if (!response.ok) {
                throw new Error("Failed to submit");
            }

            showToast('Your report has been submitted.', 'success');

            setMessage('');
            setType('Feedback');

            setTimeout(() => setActiveSection('Home'), 1500);

        } catch (err) {
            console.error(err);
            showToast('Failed to submit. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <SectionTitle
                    title="Report & Feedback"
                    subtitle="Help us improve or report an issue."
                />

                <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">

                    {/* Type Select */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                        >
                            <option>Feedback</option>
                            <option>Bug Report</option>
                            <option>Suggestion</option>
                        </select>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Details</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="6"
                            placeholder="Describe your feedback or issue..."
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                        ></textarea>
                    </div>

                    {/* Submit */}
                    <div className="text-center pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-3 bg-[#8B5A2B] text-white rounded-full font-bold text-lg hover:bg-[#5C4033] transition-colors ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? "Submitting..." : `Submit ${type}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// --- TOAST NOTIFICATION COMPONENT ---
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
        <div className={`${baseClasses} ${colorClasses} transform transition-all duration-300 scale-100 ease-out`}>
            <Icon className="w-5 h-5" />
            <span>{toast.message}</span>
        </div>
    );
}


export default CustomerDashboard;