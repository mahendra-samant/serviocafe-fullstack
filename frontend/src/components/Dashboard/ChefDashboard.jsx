import React, { useState, useEffect } from 'react';
import {
    Home, ClipboardList, Bell, Settings, LogOut, User, Clock, CheckCircle,
    Coffee, ArrowRight, Menu, UtensilsCrossed, BellRing
} from 'lucide-react';

/* Reusable Sidebar Link Component */
const SidebarLink = ({ name, icon: Icon, activeTab, setActiveTab, isCollapsed, showBadge = false, badgeContent = null }) => (
    <li className="mb-2">
        <button
            onClick={() => setActiveTab(name)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'} px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap group
                ${activeTab === name ? 'bg-[#8B5A2B] text-white shadow-md' : 'hover:bg-[#7A604D] text-gray-200'}`}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            
            {!isCollapsed && (
                <>
                    <span>{name}</span>
                    {showBadge && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 rounded-full">
                            {badgeContent}
                        </span>
                    )}
                </>
            )}
            {isCollapsed && (
                <span className="absolute left-full ml-4 hidden group-hover:block bg-gray-700 text-white text-xs px-2 py-1 rounded-md z-10 whitespace-nowrap">
                    {name}
                </span>
            )}
        </button>
    </li>
);

const ChefDashboard = () => {
    const [activeTab, setActiveTab] = useState('Home');
    const [orderFilter, setOrderFilter] = useState('All Orders');
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Backend integration states
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

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

    // Store logged-in user ID
    const [userId, setUserId] = useState(1);

    // --- FETCH ORDERS ---
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/api/orders");
            if (!res.ok) throw new Error("Failed to fetch orders");
            const data = await res.json();

            if (!Array.isArray(data)) {
                setOrders([]);
                return;
            }

            // Fetch customer details
            const ordersWithDetails = await Promise.all(
                data.map(async (order) => {
                    const validDate = order.orderDate || order.createdAt || new Date().toISOString();
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
                })
            );

            setOrders(ordersWithDetails.sort((a, b) => b.id - a.id));
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchProfile(); 
        
        const interval = setInterval(() => {
            fetchOrders();
        }, 30000); 
        
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        generateNotifications(orders);
    }, [orders]);

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

    const updateProfile = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profileData.name,
                    email: profileData.email
                }),
            });

            if (res.ok) {
                alert("✅ Profile updated successfully!");
                fetchProfile();
            } else {
                const error = await res.text();
                alert(`❌ ${error || 'Failed to update profile'}`);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("❌ Error updating profile");
        }
    };

    const updatePassword = async () => {
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
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password: passwordData.newPassword
                }),
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
        } catch (error) {
            console.error("Error updating password:", error);
            alert("❌ Error updating password");
        }
    };

    const generateNotifications = (ordersList) => {
        const notifs = [];
        
        ordersList.filter(order => order.status === 'Pending').slice(0, 3).forEach(order => {
            notifs.push({
                id: `pending-${order.id}`,
                type: 'orange',
                title: 'New Order Received!',
                message: `Order #${order.id} from ${order.customerName} is pending.`,
                createdAt: order.orderDate
            });
        });
        
        ordersList.filter(order => order.status === 'In Preparation').slice(0, 2).forEach(order => {
            notifs.push({
                id: `prep-${order.id}`,
                type: 'blue',
                title: 'Order in Preparation',
                message: `Order #${order.id} is being prepared.`,
                createdAt: order.orderDate
            });
        });
        
        ordersList.filter(order => order.status === 'Ready' || order.status === 'Ready to Serve').slice(0, 2).forEach(order => {
            notifs.push({
                id: `ready-${order.id}`,
                type: 'green',
                title: 'Order Ready',
                message: `Order #${order.id} is ready for pickup.`,
                createdAt: order.orderDate
            });
        });
        
        setNotifications(notifs);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                // Success message
                // alert(`✅ Order ${orderId} updated to "${newStatus}"`); // Optional: Comment this out if you find it annoying
                fetchOrders(); 
            } else {
                alert("❌ Failed to update order status");
            }
        } catch (error) {
            console.error("Error updating order:", error);
            alert("❌ Error updating order status");
        }
    };

    // Calculate counts for sidebar badge
    const pendingCount = orders.filter(order => order.status === 'Pending').length;
    
    const sidebarItems = [
        { name: 'Home', icon: Home, showBadge: false },
        { name: 'Orders', icon: ClipboardList, showBadge: true, badgeContent: pendingCount },
        { name: 'Notifications', icon: Bell, showBadge: false },
        { name: 'Settings', icon: Settings, showBadge: false },
    ];

    const getFilteredOrders = () => {
        if (orderFilter === 'All Orders') return orders;
        return orders.filter(order => order.status === orderFilter);
    };

    const getStatusColors = (status) => {
        switch (status) {
            case 'Pending': return { bg: 'bg-orange-100', text: 'text-orange-700' };
            case 'In Preparation': return { bg: 'bg-blue-100', text: 'text-blue-700' };
            case 'Ready': 
            case 'Ready to Serve': return { bg: 'bg-green-100', text: 'text-green-700' };
            case 'Completed': return { bg: 'bg-gray-200', text: 'text-gray-700' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-700' };
        }
    };

    // --- SUMMARY STATS CALCULATIONS ---
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;
    const inPreparationOrders = orders.filter(order => order.status === 'In Preparation').length;
    
    // FIX: Include 'Ready to Serve' in completed count so the card updates immediately
    const completedToday = orders.filter(order => 
        order.status === 'Completed' || order.status === 'Ready to Serve' || order.status === 'Ready'
    ).length;

    return (
        <div className="flex h-screen bg-[#F8F5F0] font-sans">
            {/* Sidebar */}
            <aside className={`bg-[#5C4033] text-white flex flex-col fixed inset-y-0 left-0 z-50 shadow-lg transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
                
                <div className="p-4 border-b border-gray-700 flex items-center justify-between h-16">
                    {isCollapsed ? (
                        <Coffee className="w-8 h-8 text-[#D4AF37] mx-auto" />
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Coffee className="w-8 h-8 text-[#D4AF37]" />
                            <h1 className="text-xl font-bold whitespace-nowrap">ServioCafe</h1>
                        </div>
                    )}

                    <button
                        onClick={toggleSidebar}
                        className={`p-2 rounded-full hover:bg-[#7A604D] text-white ${isCollapsed ? 'mx-auto' : ''}`}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-grow p-4 overflow-y-auto">
                    <ul>
                        {sidebarItems.map((item) => (
                            <SidebarLink
                                key={item.name}
                                name={item.name}
                                icon={item.icon}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                isCollapsed={isCollapsed}
                                showBadge={item.showBadge}
                                badgeContent={item.badgeContent}
                            />
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button 
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/login';
                        }}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 justify-start'} px-4 py-2 rounded-lg text-red-300 hover:bg-[#7A604D] transition-colors duration-200 whitespace-nowrap`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 overflow-y-auto p-8 transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                {activeTab === 'Home' && (
                    <>
                        {/* Hero Card */}
                        <div className="relative text-white p-8 rounded-2xl shadow-xl mb-8 h-[250px] flex flex-col justify-end overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1646779550778-b57aa7778d42?q=80&w=1170&auto=format&fit=crop"
                                alt="Coffee machine background"
                                className="absolute inset-0 w-full h-full object-cover rounded-2xl brightness-50"
                            />
                            <div className="relative z-10">
                                <div className="flex items-center text-green-400 font-semibold text-sm mb-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span> Active Service
                                </div>
                                <h2 className="text-4xl font-extrabold mb-2 drop-shadow-lg">Welcome Back, Chef!</h2>
                                <p className="text-gray-100 text-lg mb-4 max-w-lg drop-shadow-md">
                                    Ready to craft exceptional coffee experiences today?
                                </p>
                                <div className="flex items-center text-gray-200 text-sm drop-shadow-md">
                                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                    Peak Performance: <span className="ml-1 font-semibold text-white">
                                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <SummaryCard title="Pending Orders" count={pendingOrders.toString()} icon={<Clock />} color="bg-orange-100" />
                            <SummaryCard title="In Preparation" count={inPreparationOrders.toString()} icon={<Coffee />} color="bg-blue-100" />
                            <SummaryCard title="Completed " count={completedToday.toString()} icon={<CheckCircle />} color="bg-green-100" />
                        </div>

                        {/* Focus Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
                            <h3 className="text-2xl font-bold text-[#5C4033] mb-6">Today's Focus</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xl font-semibold text-[#5C4033] mb-2">Order Management</h4>
                                    <p className="text-gray-600 mb-4">
                                        Review incoming orders, update status, and maintain service.
                                    </p>
                                    <button onClick={() => setActiveTab('Orders')} className="text-[#8B5A2B] font-semibold flex items-center hover:underline">
                                        Manage Orders <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-[#5C4033] mb-2">Quality Standards</h4>
                                    <p className="text-gray-600 mb-2">
                                        Maintain top quality and consistency in every cup.
                                    </p>
                                    <p className="flex items-center text-green-600 font-semibold text-sm">
                                        <CheckCircle className="w-4 h-4 mr-2" /> Excellence in Every Order
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quote */}
                        <div className="relative bg-[#6F4E37] text-white p-8 rounded-2xl shadow-xl text-center overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-serif italic mb-4">"Coffee is a language in itself."</h3>
                                <p className="text-lg text-gray-300">Let's brew something extraordinary today.</p>
                            </div>
                        </div>
                    </>
                )}

                {/* Orders Tab */}
                {activeTab === 'Orders' && (
                    <>
                        <OrdersHeader />

                        <div className="flex space-x-4 mb-8">
                            {['All Orders', 'Pending', 'In Preparation', 'Ready to Serve'].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setOrderFilter(filter)}
                                    className={`px-6 py-2 rounded-full font-semibold transition-colors duration-200
                                    ${orderFilter === filter ? 'bg-[#8B5A2B] text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5A2B]"></div>
                                <p className="text-gray-600 mt-4">Loading orders...</p>
                            </div>
                        ) : (
                            <>
                                {getFilteredOrders().length === 0 ? (
                                    <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
                                        <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 text-lg">No orders found</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {getFilteredOrders().map(order => {
                                            const { bg, text } = getStatusColors(order.status);
                                            return (
                                                <OrderCard 
                                                    key={order.id} 
                                                    order={order} 
                                                    bg={bg} 
                                                    text={text}
                                                    updateOrderStatus={updateOrderStatus}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                {/* Notifications */}
                {activeTab === 'Notifications' && (
                    <div className="bg-white p-8 rounded-2xl shadow-xl">
                        <h2 className="text-4xl font-bold text-[#5C4033] mb-6">Notifications</h2>
                        {notifications.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No notifications available</p>
                        ) : (
                            notifications.map(notification => (
                                <NotificationCard 
                                    key={notification.id}
                                    color={notification.type}
                                    title={notification.title}
                                    text={notification.message}
                                    time={new Date(notification.createdAt).toLocaleString()}
                                />
                            ))
                        )}
                    </div>
                )}

                {/* Settings */}
                {activeTab === 'Settings' && (
                    <>
                        <SettingsHeader />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Input label="Full Name" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
                            <Input label="Email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} />
                        </div>
                        <button onClick={updateProfile} className="bg-[#5C4033] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8B5A2B] transition">Save Changes</button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-8">
                            <Input label="New Password" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} />
                            <Input label="Confirm Password" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                        </div>
                        <button onClick={updatePassword} className="bg-[#5C4033] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8B5A2B] transition">Update Password</button>
                    </>
                )}
            </main>
        </div>
    );
};

/* Small Reusable Components */

const SummaryCard = ({ title, count, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <div className={`${color} p-3 rounded-full`}>{icon}</div>
            <div>
                <p className="text-lg text-gray-500">{title}</p>
                <h3 className="text-3xl font-bold text-[#5C4033]">{count}</h3>
            </div>
        </div>
    </div>
);

const OrdersHeader = () => (
    <div className="mb-8">
        <div className="flex items-center text-gray-600 mb-2">
            <Home className="w-5 h-5 mr-2" /> 
            <span className="text-lg">Dashboard</span>
        </div>
        <h2 className="text-4xl font-bold text-[#5C4033]">Order Management</h2>
        <p className="text-lg text-gray-600">Manage and track orders in real-time</p>
    </div>
);

const OrderCard = ({ order, bg, text, updateOrderStatus }) => {
    const formatDate = (dateString) => {
        try {
            if (!dateString) return "Just now";
            return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return "Time N/A";
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#5C4033]">#{order.id}</h3>
                <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                    Table {order.tableNumber}
                </span>
            </div>

            <p className="text-gray-600 mb-1 flex items-center font-medium">
                <User className="w-4 h-4 mr-2" /> {order.customerName}
            </p>
            <p className="text-gray-500 text-sm mb-4 flex items-center">
                <Clock className="w-4 h-4 mr-2" /> {formatDate(order.orderDate)}
            </p>

            <ul className="list-disc list-inside text-gray-700 mb-4 border-t border-b border-gray-100 py-3">
                {order.items && order.items.length > 0 ? (
                    order.items.map((item, i) => (
                        <li key={i} className="py-1">
                            <span className="font-semibold">{item.menuItemName}</span> 
                            <span className="text-gray-500 text-sm ml-1">× {item.quantity}</span>
                        </li>
                    ))
                ) : (
                    <li className="italic text-gray-400">No items listed</li>
                )}
            </ul>

            <div className="flex justify-between items-center mb-4 mt-auto">
                <span className="text-lg font-bold text-[#5C4033]">
                    ₹{order.totalAmount || 0}
                </span>
                <div className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${bg} ${text}`}>
                    {order.status}
                </div>
            </div>

            <div className="mt-2">
                {order.status === 'Pending' && (
                    <button 
                        onClick={() => updateOrderStatus(order.id, 'In Preparation')}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors shadow-sm">
                        <UtensilsCrossed className="w-4 h-4 mr-2" />
                        Start Prep
                    </button>
                )}
                {order.status === 'In Preparation' && (
                    <button 
                        onClick={() => updateOrderStatus(order.id, 'Ready to Serve')}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center transition-colors shadow-sm">
                        <BellRing className="w-4 h-4 mr-2" />
                        Mark Ready
                    </button>
                )}
                {(order.status === 'Ready' || order.status === 'Ready to Serve') && (
                    <button className="w-full bg-gray-100 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed border border-gray-200">
                        Awaiting Pickup
                    </button>
                )}
                {order.status === 'Completed' && (
                    <button className="w-full bg-gray-100 text-green-600 px-4 py-2 rounded-lg cursor-not-allowed border border-gray-200 font-semibold">
                        ✓ Completed
                    </button>
                )}
            </div>
        </div>
    );
};

const NotificationCard = ({ color, title, text, time }) => {
    const colorMap = {
        orange: 'border-orange-500 bg-orange-50 text-orange-800',
        blue: 'border-blue-500 bg-blue-50 text-blue-800',
        green: 'border-green-500 bg-green-50 text-green-800',
        gray: 'border-gray-400 bg-gray-50 text-gray-800',
    };

    return (
        <div className={`p-4 rounded-lg shadow-sm border-l-4 mb-4 ${colorMap[color]}`}>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-gray-700 text-sm">{text} <span className="text-gray-500">• {time}</span></p>
        </div>
    );
};

const SettingsHeader = () => (
    <div className="mb-8">
        <div className="flex items-center text-gray-600 mb-2">
            <Home className="w-5 h-5 mr-2" />
            <span className="text-lg">Dashboard</span>
        </div>
        <h2 className="text-4xl font-bold text-[#5C4033]">Settings</h2>
        <p className="text-lg text-gray-600">Configure your dashboard preferences</p>
    </div>
);

const Input = ({ label, value, onChange, type = "text" }) => (
    <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-gray-800"
        />
    </div>
);

export default ChefDashboard;