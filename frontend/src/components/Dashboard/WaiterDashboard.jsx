import React, { useState, useEffect } from 'react';
import { Home, ClipboardList, LogOut, User, Coffee, CheckCircle, Clock, Users, UtensilsCrossed, SquareCheckBig, BookOpen, ExternalLink, Menu, LayoutDashboard, CalendarDays, Lock, Star } from 'lucide-react';

function SidebarLink(props) {
    return (
        <li className="mb-2">
            <button
                onClick={() => props.setActiveTab(props.name)}
                className={`w-full flex items-center ${props.isCollapsed ? 'justify-center' : 'justify-start space-x-3'} px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap group ${props.activeTab === props.name ? 'bg-[#8B5A2B] text-white shadow-md' : 'hover:bg-[#7A604D] text-gray-200'}`}
            >
                <props.icon className="w-5 h-5 flex-shrink-0" />
                {!props.isCollapsed && (
                    <>
                        <span>{props.name}</span>
                        {props.showBadge && props.badgeContent > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 rounded-full">
                                {props.badgeContent}
                            </span>
                        )}
                    </>
                )}
                {props.isCollapsed && (
                    <span className="absolute left-full ml-4 hidden group-hover:block bg-gray-700 text-white text-xs px-2 py-1 rounded-md z-10 whitespace-nowrap">
                        {props.name}
                    </span>
                )}
            </button>
        </li>
    );
}

export default function WaiterDashboard() {
    const [activeTab, setActiveTab] = useState('Home');
    const [orderFilter, setOrderFilter] = useState('All Orders');
    const [tableFilter, setTableFilter] = useState('All Tables');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [orders, setOrders] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Profile state
    const [profileData, setProfileData] = useState({
        id: null,
        name: '',
        email: ''
    });
    
    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [userId, setUserId] = useState(2); // Replace with actual waiter user ID

    // --- 1. FETCH ORDERS (With Name & Date Fix) ---
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/api/orders");
            if (!res.ok) throw new Error("Failed to fetch orders");
            const data = await res.json();

            // Filter relevant orders for Waiter (Ready or Served)
            const relevantOrders = data.filter(order => 
                order.status === 'Ready to Serve' || order.status === 'Ready' || order.status === 'Served'
            );

            // Fetch customer details for each order to fix "Guest" name
            const enrichedOrders = await Promise.all(relevantOrders.map(async (order) => {
                // Fix Date
                const validDate = order.orderDate || order.createdAt || new Date().toISOString();

                // Fix Name
                let customerName = "Guest";
                if (order.user && order.user.name) {
                    customerName = order.user.name;
                } else {
                    const targetId = order.userId || (order.user && order.user.id);
                    if (targetId) {
                        try {
                            const userRes = await fetch(`http://localhost:8080/api/users/${targetId}`);
                            if (userRes.ok) {
                                const userData = await userRes.json();
                                customerName = userData.name || userData.email || "Unknown";
                            }
                        } catch (err) {
                            console.error(`Error fetching user ${targetId}`, err);
                        }
                    }
                }

                return { 
                    ...order, 
                    customerName: customerName, 
                    orderDate: validDate 
                };
            }));

            // Sort: Newest first
            setOrders(enrichedOrders.sort((a, b) => b.id - a.id));

        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- 2. FETCH TABLES (Standardized Endpoint) ---
    const fetchTables = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/tables/all");
            const data = await res.json();
            setTables(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching tables:", error);
            setTables([]); 
        }
    };

    // Fetch profile data
    const fetchProfile = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/users/${userId}`);
            if (!res.ok) throw new Error("Failed to fetch profile");
            const data = await res.json();
            setProfileData({
                id: data.id,
                name: data.name || '',
                email: data.email || ''
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchTables();
        fetchProfile();
        
        const interval = setInterval(() => {
            fetchOrders();
            fetchTables();
        }, 10000);
        
        return () => clearInterval(interval);
    }, []);

    // Update order status to Served
    const handleMarkAsServed = async (orderId) => {
        try {
            const res = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Served' })
            });
            
            if (res.ok) {
                fetchOrders(); // Refresh orders immediately
            } else {
                alert("❌ Failed to update order status");
            }
        } catch (err) {
            console.error("Error marking order as served:", err);
            alert("❌ Error updating order status");
        }
    };

    // --- 3. TABLE ACTION (Using Admin Logic) ---
    const handleTableAction = async (tableId, currentAvailability) => {
        // Toggle the boolean (Available <-> Occupied)
        const newAvailability = !currentAvailability;

        try {
            const res = await fetch(`http://localhost:8080/api/tables/${tableId}/status?available=${newAvailability}`, {
                method: 'PUT'
            });
            
            if (res.ok) {
                // alert(`✅ Table status updated`); // Optional feedback
                fetchTables(); // Refresh tables
            } else {
                alert("❌ Failed to update table status");
            }
        } catch (err) {
            console.error("Error updating table:", err);
            alert("Error connecting to server");
        }
    };

    // Update profile
    const handleProfileUpdate = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profileData.name,
                    email: profileData.email
                })
            });
            
            if (res.ok) {
                alert("✅ Profile updated successfully!");
                fetchProfile();
            } else {
                const error = await res.text();
                alert(`❌ ${error || 'Failed to update profile'}`);
            }
        } catch (err) {
            console.error("Profile update error:", err);
            alert("❌ Error updating profile");
        }
    };

    // Update password
    const handlePasswordUpdate = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("❌ New password and confirm password do not match");
            return;
        }
        
        if (!passwordData.newPassword || passwordData.newPassword.trim() === '') {
            alert("❌ New password cannot be empty");
            return;
        }
        
        try {
            const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: passwordData.newPassword
                })
            });
            
            if (res.ok) {
                alert("✅ Password updated successfully!");
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                const error = await res.text();
                alert(`❌ ${error || 'Failed to update password'}`);
            }
        } catch (err) {
            console.error("Error updating password:", err);
            alert("❌ Error updating password");
        }
    };

    const getFilteredOrders = () => {
        if (orderFilter === 'All Orders') return orders;
        if (orderFilter === 'Ready to Serve') {
            return orders.filter(order => order.status === 'Ready to Serve' || order.status === 'Ready');
        }
        return orders.filter(order => order.status === orderFilter);
    };

    const getFilteredTables = () => {
        if (tableFilter === 'All Tables') return tables;
        if (tableFilter === 'Available') return tables.filter(t => t.available === true);
        if (tableFilter === 'Occupied') return tables.filter(t => t.available === false);
        return tables;
    };

    // Helper to safely format date
    const formatTime = (dateString) => {
        try {
            if (!dateString) return "";
            return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) { return ""; }
    };

    const readyToServeCount = orders.filter(o => o.status === 'Ready to Serve' || o.status === 'Ready').length;
    const servedTodayCount = orders.filter(o => o.status === 'Served').length;
    
    // Calculate active tables based on 'available' boolean (false = occupied)
    const activeTables = tables.filter(t => t.available === false).length;
    const totalCustomersServed = servedTodayCount; 

    const navItems = [
        { name: 'Home', icon: Home, showBadge: false },
        { name: 'Orders', icon: ClipboardList, showBadge: true, badgeContent: readyToServeCount },
        { name: 'Tables', icon: LayoutDashboard, showBadge: false },
        { name: 'Profile', icon: User, showBadge: false }
    ];

    if (!isLoggedIn) {
        return (
            <div className="flex items-center justify-center h-screen w-full bg-[#F8F5F0]">
                <div className="bg-white p-10 rounded-xl shadow-2xl text-center">
                    <h2 className="text-3xl font-bold text-[#5C4033] mb-4">You have been logged out.</h2>
                    <p className="text-gray-600 mb-6">Thank you for your service!</p>
                    <button onClick={() => { setIsLoggedIn(true); setActiveTab('Home'); }} className="bg-[#5C4033] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8B5A2B] transition-colors">
                        Log Back In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8F5F0] font-sans text-[#3E2723]">
            <aside className={`fixed top-0 left-0 z-20 h-full bg-[#5C4033] text-white flex flex-col p-3 shadow-2xl transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
                <div className="p-4 border-b border-gray-700 flex items-center justify-between h-16">
                    {isCollapsed ? <Coffee className="w-8 h-8 text-[#D4AF37] mx-auto" /> : (
                        <div className="flex items-center space-x-3">
                            <Coffee className="w-8 h-8 text-[#D4AF37]" />
                            <h1 className="text-xl font-bold whitespace-nowrap">ServioCafe</h1>
                        </div>
                    )}
                    <button onClick={() => setIsCollapsed(prev => !prev)} className={`p-2 rounded-full hover:bg-[#7A604D] text-white ${isCollapsed ? 'mx-auto' : ''}`}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-grow p-4">
                    <ul>
                        {navItems.map(item => <SidebarLink key={item.name} name={item.name} icon={item.icon} activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={isCollapsed} showBadge={item.showBadge} badgeContent={item.badgeContent} />)}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button 
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/login';
                        }}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'} px-4 py-2 rounded-lg text-red-300 hover:bg-[#7A604D] transition-colors duration-200`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
                    </button>
                </div>
            </aside>

            <main className={`flex-1 overflow-y-auto p-8 transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                {activeTab === 'Home' && (
                    <>
                        <div className="relative bg-[#5C4033] text-white p-8 rounded-2xl shadow-xl overflow-hidden mb-8 h-[280px] flex flex-col justify-end">
                            <img src="https://images.unsplash.com/photo-1573018943660-502eca08e4b4?q=80&w=1332&auto=format&fit=crop" alt="Waiter" className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 rounded-2xl" />
                            <div className="relative z-10 text-white">
                                <div className="flex items-center text-green-400 font-semibold text-sm mb-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span> On Duty ✨
                                </div>
                                <h2 className="text-5xl font-extrabold mb-2 leading-tight">Welcome Back!</h2>
                                <p className="text-gray-200 text-lg mb-4 max-w-lg">Your smile and service make every customer experience special.</p>
                                <div className="flex items-center text-gray-300 text-sm space-x-4">
                                    <p className="flex items-center"><UtensilsCrossed className="w-4 h-4 mr-2" /> Excellence in Service</p>
                                    <p className="flex items-center"><CalendarDays className="w-4 h-4 mr-2" /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-purple-400 to-pink-500 text-white p-6 rounded-xl shadow-md flex flex-col justify-between h-40">
                                <div className="flex justify-between items-start">
                                    <Coffee className="w-8 h-8 opacity-75" />
                                    <span className="text-3xl font-bold">{readyToServeCount}</span>
                                </div>
                                <p className="text-xl font-semibold">Ready to Serve</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between h-40">
                                <div className="flex justify-between items-start">
                                    <LayoutDashboard className="w-8 h-8 text-blue-500" />
                                    <span className="text-3xl font-bold">{activeTables}</span>
                                </div>
                                <p className="text-xl font-semibold">Occupied Tables</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between h-40">
                                <div className="flex justify-between items-start">
                                    <Users className="w-8 h-8 text-indigo-500" />
                                    <span className="text-3xl font-bold">{totalCustomersServed}</span>
                                </div>
                                <p className="text-xl font-semibold">Customers Served</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between h-40">
                                <div className="flex justify-between items-start">
                                    <SquareCheckBig className="w-8 h-8 text-green-500" />
                                    <span className="text-3xl font-bold">{servedTodayCount}</span>
                                </div>
                                <p className="text-xl font-semibold">Served Today</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="relative bg-gradient-to-br from-purple-600 to-indigo-800 text-white p-8 rounded-2xl shadow-xl overflow-hidden h-[300px] flex flex-col justify-between">
                                <img src="https://images.unsplash.com/photo-1541167760492-cf0544211155?q=80&w=1974&auto=format&fit=crop" alt="Cafe" className="absolute inset-0 w-full h-full object-cover opacity-20 z-0" />
                                <div className="relative z-10 flex justify-between items-start">
                                    <Coffee className="w-10 h-10 text-purple-200" />
                                    <span className="text-yellow-300 text-3xl">✨</span>
                                </div>
                                <div className="relative z-10 mt-auto">
                                    <h3 className="text-3xl font-bold mb-2">Serve Orders</h3>
                                    <p className="text-gray-200 mb-4">Check ready orders from the kitchen and deliver them with excellent service.</p>
                                    <button onClick={() => setActiveTab('Orders')} className="text-purple-200 font-semibold flex items-center hover:underline">
                                        View Orders <ExternalLink className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col justify-between h-[300px]">
                                <div className="flex justify-between items-center mb-4">
                                    <User className="w-10 h-10 text-blue-500" />
                                    <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Customer First</span>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold mb-2 text-[#3E2723]">Service Excellence</h3>
                                    <p className="text-gray-600 mb-4">Every interaction matters. Your dedication creates unforgettable experiences.</p>
                                </div>
                                <p className="flex items-center text-indigo-600 font-semibold text-sm">
                                    <Star className="w-4 h-4 mr-2" /> 5-Star Service Standard
                                </p>
                            </div>
                        </div>

                        <div className="relative bg-[#5C4033] text-white p-8 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center min-h-[200px] overflow-hidden">
                            <span className="absolute top-4 right-4 text-yellow-300 text-4xl opacity-70">✨</span>
                            <h3 className="text-3xl font-serif italic mb-4">"Service is not just a job, its an art."</h3>
                            <p className="text-lg text-gray-300">Lets make today exceptional</p>
                        </div>
                    </>
                )}

                {activeTab === 'Orders' && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-4xl font-bold text-[#3E2723] mb-2">Order Management</h2>
                            <p className="text-lg text-gray-600">Serve orders and ensure customer satisfaction</p>
                        </div>
                        <div className="flex space-x-4 mb-8">
                            {['All Orders', 'Ready to Serve', 'Served'].map(filter => (
                                <button key={filter} onClick={() => setOrderFilter(filter)} className={`px-6 py-2 rounded-full font-semibold transition-colors duration-200 ${orderFilter === filter ? 'bg-[#5C4033] text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5A2B]"></div>
                                <p className="text-gray-600 mt-4">Loading orders...</p>
                            </div>
                        ) : getFilteredOrders().length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
                                <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 text-lg">No orders to display</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {getFilteredOrders().map(order => (
                                    <div key={order.id} className="bg-white p-6 rounded-2xl shadow-md flex flex-col">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-bold text-[#3E2723]">Order #{order.id}</h3>
                                            <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">Table {order.tableNumber}</span>
                                        </div>
                                        <p className="text-gray-600 mb-1 flex items-center font-bold">
                                            <User className="w-4 h-4 mr-2 text-[#5C4033]" /> {order.customerName}
                                        </p>
                                        <div className="flex text-gray-500 text-xs mb-4 space-x-3">
                                            <p className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {formatTime(order.orderDate)}</p>
                                        </div>
                                        <ul className="text-gray-700 mb-4 space-y-2 border-t border-b border-gray-100 py-3">
                                            {order.items && order.items.length > 0 ? (
                                                order.items.map((item, i) => (
                                                    <li key={i} className="flex items-center justify-between">
                                                        <span className="flex items-center">
                                                            <Coffee className="w-4 h-4 mr-2 text-purple-500" />
                                                            {item.menuItemName}
                                                        </span>
                                                        <span className="text-purple-600 font-semibold">x{item.quantity}</span>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="italic text-gray-400">No items listed</li>
                                            )}
                                        </ul>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-lg font-bold text-[#5C4033]">₹{order.totalAmount || 0}</span>
                                        </div>
                                        <div className={`text-sm font-semibold px-4 py-2 rounded-lg text-center mb-4 
                                            ${order.status === 'Served' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                                            {order.status}
                                        </div>
                                        
                                        {(order.status === 'Ready to Serve' || order.status === 'Ready') && (
                                            <button onClick={() => handleMarkAsServed(order.id)} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:from-pink-600 hover:to-purple-700 transition-colors duration-200 flex items-center justify-center">
                                                <SquareCheckBig className="w-5 h-5 mr-2" /> Mark as Served
                                            </button>
                                        )}
                                        {order.status === 'Served' && (
                                            <button disabled className="w-full bg-gray-200 text-gray-500 px-6 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 mr-2" /> Completed
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'Tables' && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-4xl font-bold text-[#3E2723] mb-2">Table Management</h2>
                            <p className="text-lg text-gray-600">Monitor and manage all tables in real-time</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-green-100 p-6 rounded-xl shadow-md flex items-center justify-between">
                                <div>
                                    <p className="text-lg text-gray-500">Available</p>
                                    <h3 className="text-4xl font-bold text-green-700">{tables.filter(t => t.available).length}</h3>
                                </div>
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <div className="bg-orange-100 p-6 rounded-xl shadow-md flex items-center justify-between">
                                <div>
                                    <p className="text-lg text-gray-500">Occupied</p>
                                    <h3 className="text-4xl font-bold text-orange-700">{tables.filter(t => !t.available).length}</h3>
                                </div>
                                <Users className="w-10 h-10 text-orange-500" />
                            </div>
                            <div className="bg-blue-100 p-6 rounded-xl shadow-md flex items-center justify-between">
                                <div>
                                    <p className="text-lg text-gray-500">Total</p>
                                    <h3 className="text-4xl font-bold text-blue-700">{tables.length}</h3>
                                </div>
                                <BookOpen className="w-10 h-10 text-blue-500" />
                            </div>
                        </div>
                        <div className="flex space-x-4 mb-8">
                            {['All Tables', 'Available', 'Occupied'].map(filter => (
                                <button key={filter} onClick={() => setTableFilter(filter)} className={`px-6 py-2 rounded-full font-semibold transition-colors duration-200 ${tableFilter === filter ? 'bg-[#5C4033] text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                    {filter}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {getFilteredTables().map(table => {
                                const isAvailable = table.available === true; // Backend boolean
                                return (
                                    <div key={table.id} className={`p-6 rounded-xl shadow-md flex flex-col transition-all border-2 ${isAvailable ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-2xl font-bold text-[#3E2723]">Table {table.tableNumber}</h3>
                                            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${isAvailable ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'}`}>
                                                {isAvailable ? 'Available' : 'Occupied'}
                                            </span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className={`flex items-center font-semibold mb-3 ${isAvailable ? 'text-green-600' : 'text-orange-600'}`}>
                                                {isAvailable ? <CheckCircle className="w-5 h-5 mr-2" /> : <Clock className="w-5 h-5 mr-2" />}
                                                {isAvailable ? 'Ready for Guests' : 'Currently Serving'}
                                            </p>
                                            <p className="text-gray-600 text-sm mb-4">Capacity: {table.seats} Seats</p>
                                        </div>
                                        <button 
                                            onClick={() => handleTableAction(table.id, table.available)} 
                                            className={`mt-4 w-full px-4 py-3 rounded-lg text-white font-semibold shadow-sm transition-colors duration-200 flex items-center justify-center
                                            ${isAvailable ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}
                                        >
                                            {isAvailable ? 'Seat Customers' : 'Clear Table'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {activeTab === 'Profile' && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-4xl font-bold text-[#3E2723] mb-2">My Profile</h2>
                            <p className="text-lg text-gray-600">Manage your personal and account information</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
                            <div className="flex items-center mb-6">
                                <User className="w-6 h-6 mr-3 text-[#5C4033]" />
                                <h3 className="text-2xl font-bold text-[#3E2723]">Personal Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
                                    <input type="text" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-gray-800" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                                    <input type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-gray-800" />
                                </div>
                            </div>
                            <button onClick={handleProfileUpdate} className="bg-[#5C4033] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8B5A2B] transition-colors duration-300 shadow-md">
                                Save Changes
                            </button>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl">
                            <div className="flex items-center mb-6">
                                <Lock className="w-6 h-6 mr-3 text-[#5C4033]" />
                                <h3 className="text-2xl font-bold text-[#3E2723]">Password Settings</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">New Password</label>
                                    <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-gray-800" placeholder="Enter new password" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm New Password</label>
                                    <input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-gray-800" placeholder="Confirm new password" />
                                </div>
                            </div>
                            <button onClick={handlePasswordUpdate} className="bg-[#5C4033] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8B5A2B] transition-colors duration-300 shadow-md">
                                Update Password
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}