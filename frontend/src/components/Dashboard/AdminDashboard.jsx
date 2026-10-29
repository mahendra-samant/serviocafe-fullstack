import React, { useState, useEffect } from "react";
import { Home, Users, LogOut, Coffee, Menu, UtensilsCrossed, ClipboardList, LayoutDashboard, FileText, MessageSquare, UserPlus } from "lucide-react";

// Sidebar Link Component
const SidebarLink = ({ name, icon: Icon, activeTab, setActiveTab, isCollapsed }) => (
  <li className="mb-2">
    <button
      onClick={() => setActiveTab(name)}
      className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'} px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap group
        ${activeTab === name ? 'bg-[#8B5A2B] text-white shadow-md' : 'hover:bg-[#7A604D] text-gray-200'}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!isCollapsed && <span>{name}</span>}
      {isCollapsed && (
        <span className="absolute left-full ml-4 hidden group-hover:block bg-gray-700 text-white text-xs px-2 py-1 rounded-md z-10 whitespace-nowrap">
          {name}
        </span>
      )}
    </button>
  </li>
);

export default function AdminDashboard() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  
  console.log('AdminDashboard component is rendering...');
  
  // Data States (Keep staff for the dashboard counts)
  const [staff, setStaff] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [reports, setReports] = useState([]);

  // Form States
  const [newTable, setNewTable] = useState({ tableNumber: "", seats: "" });
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "CHEF" });
  const [newItem, setNewItem] = useState({ name: "", category: "", price: "", description: "", imageFile: null });
  const [editingItem, setEditingItem] = useState(null);

  // --- NEW USER MANAGEMENT STATE ---
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("ALL");

  // Fetch users specifically when "View Users" tab is active
  useEffect(() => {
    if (activeTab === "View Users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetches EVERYONE (Customers, Chefs, Waiters)
      const res = await fetch("http://localhost:8080/api/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

// Filter logic for the table
  const filteredUsers = users.filter((user) => {
    if (user.role === "ADMIN") return false;
    if (selectedRole === "ALL") return true;
    return user.role === selectedRole;
  });
// Count helper for the badges
  const getUserCount = (role) => {
    const validUsers = users.filter(u => u.role !== "ADMIN");

    if (role === "ALL") return validUsers.length;
    return validUsers.filter((u) => u.role === role).length;
  };
  // --- FETCH FUNCTIONS ---
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/admin/staff");
      const data = await res.json();
      setStaff(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/menu/all");
      const data = await res.json();
      setMenuItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/feedback/all");
      if (!res.ok) throw new Error("Failed to fetch feedbacks");
      const data = await res.json();
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/reports/all");
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReports([]);
    }
  };

const fetchOrders = async () => {
  try {
    setLoading(true);

    // Fetch orders and users together
    const [ordersRes, usersRes] = await Promise.all([
      fetch("http://localhost:8080/api/orders"),
      fetch("http://localhost:8080/api/users"),
    ]);

    if (!ordersRes.ok) {
      throw new Error("Failed to fetch orders");
    }

    if (!usersRes.ok) {
      throw new Error("Failed to fetch users");
    }

    const ordersData = await ordersRes.json();
    const usersData = await usersRes.json();

    if (!Array.isArray(ordersData)) {
      setOrders([]);
      return;
    }

    const users = Array.isArray(usersData) ? usersData : [];

    // Match each order's userId with the user's actual name
    const ordersWithUsers = ordersData.map((order) => {
      const user = users.find(
        (u) => String(u.id) === String(order.userId)
      );

      return {
        ...order,
        customerName: user
          ? (user.name || user.email || `User ID: ${order.userId}`)
          : order.userId
            ? `User ID: ${order.userId}`
            : "Unknown/Guest",
      };
    });

    setOrders(ordersWithUsers);
  } catch (error) {
    console.error("Error fetching orders:", error);
    setOrders([]);
  } finally {
    setLoading(false);
  }
};

  const fetchAllTables = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/tables/all");
      const data = await res.json();
      setTables(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tables:", error);
      setTables([]);
    }
  };

  // --- HANDLERS ---
  const handleAddTable = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/tables/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber: Number(newTable.tableNumber), seats: Number(newTable.seats) }),
      });
      if (!res.ok) { alert("❌ Error adding table"); return; }
      alert("✅ Table added successfully");
      setNewTable({ tableNumber: "", seats: "" });
      fetchAllTables();
    } catch (err) { console.error(err); }
  };

  const handleDeleteTable = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/tables/${id}`, { method: "DELETE" });
      if (res.ok) { alert("✅ Table deleted"); fetchAllTables(); } else { alert("❌ Failed"); }
    } catch (err) { console.error(err); }
  };

  const handleToggleTableStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:8080/api/tables/${id}/status?available=${!currentStatus}`, {
        method: "PUT",
      });
      if (res.ok) {
        alert(`✅ Table status updated to ${!currentStatus ? 'Available' : 'Occupied'}`);
        fetchAllTables();
      } else {
        alert("❌ Failed to update status");
      }
    } catch (err) {
      console.error("Error updating table status:", err);
      alert("Error connecting to server");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/admin/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(`❌ Failed: ${data}`);
      } else {
        alert(`✅ Staff added: ${data.name}`);
        setFormData({ name: "", email: "", password: "", role: "CHEF" });
        fetchStaff();
        setActiveTab('View Users');
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Error adding staff");
    }
  };

  const handleChangeMenu = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleNewImageFile = (e) => {
    const file = e.target.files && e.target.files[0];
    setNewItem(prev => ({ ...prev, imageFile: file }));
  };

  // const handleAddMenu = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const formDataToSend = new FormData();
  //     const menuItemPayload = {
  //       name: newItem.name,
  //       category: newItem.category,
  //       price: parseFloat(newItem.price) || 0,
  //       description: newItem.description
  //     };
  //     formDataToSend.append("menuItem", new Blob([JSON.stringify(menuItemPayload)], { type: "application/json" }));
  //     if (newItem.imageFile) {
  //       formDataToSend.append('imageFile', newItem.imageFile);
  //     }

  //     const res = await fetch("http://localhost:8080/api/menu/add", {
  //       method: "POST",
  //       body: formDataToSend
  //     });

  //     if (res.ok) {
  //       alert("✅ Menu Item Added");
  //       setNewItem({ name: "", category: "", price: "", description: "", imageFile: null });
  //       fetchMenuItems();
  //     } else {
  //       const errorText = await res.text();
  //       alert(`❌ Failed to add item: ${errorText}`);
  //     }
  //   } catch (error) {
  //     console.error("Error adding menu item:", error);
  //     alert("Error connecting to server.");
  //   }
  // };
  const handleAddMenu = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Send fields individually
      formDataToSend.append("name", newItem.name);
      formDataToSend.append("category", newItem.category);
      formDataToSend.append("price", parseFloat(newItem.price) || 0);
      formDataToSend.append("description", newItem.description || "");

      // Send image using the field Django expects
      if (newItem.imageFile) {
        formDataToSend.append("image", newItem.imageFile);
      }

      const res = await fetch(
        "http://localhost:8080/api/menu/add",
        {
          method: "POST",
          body: formDataToSend
        }
      );

      if (res.ok) {
        alert("✅ Menu Item Added");

        setNewItem({
          name: "",
          category: "",
          price: "",
          description: "",
          imageFile: null
        });

        fetchMenuItems();

      } else {
        const errorText = await res.text();

        console.error("Add menu item error:", errorText);

        alert(
          `❌ Failed to add item: ${errorText}`
        );
      }

    } catch (error) {
      console.error(
        "Error adding menu item:",
        error
      );

      alert(
        "Error connecting to server."
      );
    }
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item, imageFile: null });
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setEditingItem(prev => ({ ...prev, imageFile: file }));
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      const id = editingItem.id;
      const formDataToSend = new FormData();
      const menuItemPayload = {
        name: editingItem.name,
        category: editingItem.category,
        price: parseFloat(editingItem.price) || 0,
        description: editingItem.description
      };
      formDataToSend.append("menuItem", new Blob([JSON.stringify(menuItemPayload)], { type: "application/json" }));
      if (editingItem.imageFile) {
        formDataToSend.append('imageFile', editingItem.imageFile);
      }

      const res = await fetch(`http://localhost:8080/api/menu/update/${id}`, {
        method: "PUT",
        body: formDataToSend
      });

      if (res.ok) {
        alert("✅ Item updated successfully");
        setEditingItem(null);
        fetchMenuItems();
      } else {
        const text = await res.text();
        alert("❌ Failed to update item: " + text);
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error connecting to server.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/menu/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("✅ Item deleted successfully.");
        fetchMenuItems();
      } else {
        alert("❌ Failed to delete item.");
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert("Error connecting to server.");
    }
  };

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderStars = (rating) => {
    const r = Math.max(0, Math.min(5, Math.floor(Number(rating) || 0)));
    return "★".repeat(r) + "☆".repeat(5 - r);
  };

  useEffect(() => {
    fetchStaff();
    fetchMenuItems();
    fetchOrders();
    fetchAllTables();
    fetchFeedbacks();
    fetchReports();
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Add Staff', icon: UserPlus },
    { name: 'View Users', icon: Users },
    { name: 'Menu Management', icon: UtensilsCrossed },
    { name: 'Orders', icon: ClipboardList },
    { name: 'Tables', icon: LayoutDashboard },
    { name: 'Reports', icon: FileText },
    { name: 'Feedback', icon: MessageSquare }
  ];

  return (
    <div className="flex h-screen bg-[#F8F5F0] font-sans text-[#3E2723]">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-20 h-full bg-[#5C4033] text-white flex flex-col p-3 shadow-2xl transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between h-16">
          {isCollapsed ? (
            <Coffee className="w-8 h-8 text-[#D4AF37] mx-auto" />
          ) : (
            <div className="flex items-center space-x-3">
              <Coffee className="w-8 h-8 text-[#D4AF37]" />
              <h1 className="text-xl font-bold whitespace-nowrap">Admin Panel</h1>
            </div>
          )}
          <button onClick={toggleSidebar} className={`p-2 rounded-full hover:bg-[#7A604D] text-white ${isCollapsed ? 'mx-auto' : ''}`}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-grow p-4">
          <ul>
            {navItems.map(item => (
              <SidebarLink key={item.name} name={item.name} icon={item.icon} activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={isCollapsed} />
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'} px-4 py-2 rounded-lg text-red-300 hover:bg-[#7A604D] transition-colors duration-200`}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto p-8 transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* Dashboard */}
        {activeTab === 'Dashboard' && (
          <>
            <div className="relative bg-[#5C4033] text-white p-8 rounded-2xl shadow-xl overflow-hidden mb-8 h-[280px] flex flex-col justify-end">
              <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop" alt="Admin" className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 rounded-2xl" />
              <div className="relative z-10 text-white">
                <div className="flex items-center text-green-400 font-semibold text-sm mb-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span> System Active
                </div>
                <h2 className="text-5xl font-extrabold mb-2 leading-tight">Welcome, Admin!</h2>
                <p className="text-gray-200 text-lg mb-4 max-w-lg">Manage your restaurant operations efficiently</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Staff" count={staff?.length || 0} icon={<Users className="w-8 h-8" />} color="bg-blue-100" />
              <StatCard title="Menu Items" count={menuItems?.length || 0} icon={<UtensilsCrossed className="w-8 h-8" />} color="bg-green-100" />
              <StatCard title="Total Orders" count={orders?.length || 0} icon={<ClipboardList className="w-8 h-8" />} color="bg-purple-100" />
              <StatCard title="Active Tables" count={Array.isArray(tables) ? tables.filter(t => !t.available).length : 0} icon={<LayoutDashboard className="w-8 h-8" />} color="bg-orange-100" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QuickActionCard title="Staff Management" description="Add or view restaurant staff members" onClick={() => setActiveTab('View Users')} />
              <QuickActionCard title="Menu Management" description="Manage menu items and pricing" onClick={() => setActiveTab('Menu Management')} />
              <QuickActionCard title="View Orders" description="Monitor all customer orders" onClick={() => setActiveTab('Orders')} />
              <QuickActionCard title="Table Management" description="Manage table availability" onClick={() => setActiveTab('Tables')} />
            </div>
          </>
        )}

        {/* Add Staff Tab */}
        {activeTab === 'Add Staff' && (
          <div className="min-h-screen flex items-center justify-center relative p-8">
            <div className="fixed inset-0 z-0 blur-md scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2561&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="fixed inset-0 z-0 bg-black/30 pointer-events-none" />
            <div className="bg-white p-8 rounded-2xl shadow-xl relative z-10 max-w-2xl w-full mx-auto">
              <h2 className="text-4xl font-bold text-[#5C4033] mb-8">Add New Staff</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <InputField label="Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter staff name" />
                <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Enter email address" />
                <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Enter password" />
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-gray-800">
                    <option value="CHEF">Chef</option>
                    <option value="WAITER">Waiter</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-[#5C4033] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8B5A2B] transition-colors shadow-md">Add Staff Member</button>
              </form>
            </div>
          </div>
        )}

        {/* View Users Tab */}
        {activeTab === "View Users" && (
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold text-[#5C4033]">User Management</h2>
              <button onClick={fetchUsers} className="text-sm text-[#5C4033] hover:underline font-semibold">Refresh List</button>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {["ALL", "CUSTOMER", "CHEF", "WAITER"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedRole(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all 
                  ${selectedRole === tab ? "bg-[#5C4033] text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}{" "}
                  <span className={`ml-1 text-xs font-bold ${selectedRole === tab ? "text-white/80" : "text-[#5C4033]"}`}>
                    ({getUserCount(tab)})
                  </span>
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5A2B]"></div>
                <p className="mt-2 text-sm text-gray-500">Loading users...</p>
              </div>
            ) : (
              <div className="overflow-hidden border border-gray-200 rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#fdfbf7]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#5C4033] uppercase tracking-wider">Name & Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#5C4033] uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-[#5C4033] uppercase tracking-wider">User ID</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredUsers.map((s) => (
                      <tr key={s.id} className="hover:bg-amber-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">{s.name}</span>
                            <span className="text-xs text-gray-500 mt-0.5">{s.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${s.role === "CHEF" ? "bg-blue-50 text-blue-700 border border-blue-100" 
                            : s.role === "WAITER" ? "bg-orange-50 text-orange-700 border border-orange-100" 
                            : s.role === "CUSTOMER" ? "bg-green-50 text-green-700 border border-green-100" 
                            : "bg-purple-50 text-purple-700 border border-purple-100"}`}>
                            {s.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-400 font-mono">#{s.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-sm">No users found in this category.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Menu Management Tab */}
        {activeTab === 'Menu Management' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-4xl font-bold text-[#5C4033] mb-8">Menu Management</h2>
            <form onSubmit={handleAddMenu} className="grid grid-cols-2 gap-4 mb-8">
              <input name="name" value={newItem.name} onChange={handleChangeMenu} placeholder="Item Name" className="border border-gray-300 p-3 rounded-lg bg-white text-gray-900" required />
              <input name="category" value={newItem.category} onChange={handleChangeMenu} placeholder="Category" className="border border-gray-300 p-3 rounded-lg bg-white text-gray-900" required />
              <input name="price" type="number" value={newItem.price} onChange={handleChangeMenu} placeholder="Price" className="border border-gray-300 p-3 rounded-lg bg-white text-gray-900" required />
              <input name="imageFile" type="file" accept="image/*" onChange={handleNewImageFile} className="border border-gray-300 p-3 rounded-lg bg-white text-gray-900" />
              <textarea name="description" value={newItem.description} onChange={handleChangeMenu} placeholder="Description" className="col-span-2 border border-gray-300 p-3 rounded-lg bg-white text-gray-900"></textarea>
              <button type="submit" className="col-span-2 bg-[#5C4033] text-white p-3 rounded-lg hover:bg-[#8B5A2B] font-semibold">Add Menu Item</button>
            </form>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-3">ID</th>
                    <th className="border p-3">Image</th>
                    <th className="border p-3">Name</th>
                    <th className="border p-3">Category</th>
                    <th className="border p-3">Price</th>
                    <th className="border p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(menuItems) && menuItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border p-3">{item.id}</td>
                      <td className="border p-3">
                        {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-20 h-14 object-cover rounded" onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block';}} /> : null}
                        <span className="text-gray-500 italic" style={{display: item.imageUrl ? 'none' : 'block'}}>No image</span>
                      </td>
                      <td className="border p-3">{item.name}</td>
                      <td className="border p-3">{item.category}</td>
                      <td className="border p-3">₹{item.price}</td>
                      <td className="border p-3 space-x-2">
                        <button onClick={() => handleEdit(item)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Modal */}
            {editingItem && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                  <h3 className="text-xl font-semibold mb-4">Edit Menu Item</h3>
                  <form onSubmit={handleUpdateItem} className="space-y-3">
                    <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900" />
                    <input type="text" value={editingItem.category} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900" />
                    <textarea rows="3" value={editingItem.description} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900" />
                    <input type="number" value={editingItem.price} onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900" />
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Current Image</label>
                      {editingItem.imageUrl ? <img src={editingItem.imageUrl} alt="current" className="w-28 h-20 object-cover rounded mb-2" /> : <div className="text-gray-500 italic mb-2">No image</div>}
                      <label className="block text-sm text-gray-600 mb-2">Replace Image (optional)</label>
                      <input type="file" accept="image/*" onChange={handleEditFileChange} className="w-full border border-gray-300 p-2 rounded-lg" />
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button type="button" onClick={() => setEditingItem(null)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Cancel</button>
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Update</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'Orders' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-4xl font-bold text-[#5C4033] mb-8">Orders Management</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5A2B]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-3">Order ID</th>
                      <th className="border p-3">Customer</th>
                      <th className="border p-3">Table</th>
                      <th className="border p-3">Amount</th>
                      <th className="border p-3">Status</th>
                      <th className="border p-3">Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(orders) && orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="border p-3">{order.id}</td>
                        <td className="border p-3">{order.customerName || "N/A"}</td>
                        <td className="border p-3">{order.tableNumber}</td>
                        <td className="border p-3">₹{order.totalAmount}</td>
                        <td className="border p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                            order.status === 'In Preparation' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Ready to Serve' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="border p-3">
                          {order.items && order.items.length > 0 ? (
                            <ul className="text-sm">
                              {order.items.map((item, i) => (
                                <li key={i}>{item.menuItemName} x {item.quantity}</li>
                              ))}
                            </ul>
                          ) : <span className="text-gray-500 italic">No items</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tables Tab */}
        {activeTab === 'Tables' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-4xl font-bold text-[#5C4033] mb-8">Table Management</h2>
            <form onSubmit={handleAddTable} className="grid grid-cols-2 gap-4 mb-8">
              <input type="number" placeholder="Table Number" value={newTable.tableNumber} onChange={e => setNewTable({ ...newTable, tableNumber: e.target.value })} className="border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5C4033]" required />
              <input type="number" placeholder="Capacity" value={newTable.seats} onChange={e => setNewTable({ ...newTable, seats: e.target.value })} className="border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5C4033]" required />
              <button type="submit" className="col-span-2 bg-[#5C4033] text-white p-3 rounded-lg hover:bg-[#8B5A2B] font-semibold">Add Table</button>
            </form>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-3">ID</th>
                    <th className="border p-3">Table Number</th>
                    <th className="border p-3">Capacity</th>
                    <th className="border p-3">Status</th>
                    <th className="border p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!Array.isArray(tables) || tables.length === 0 ? (
                    <tr><td colSpan="5" className="text-center p-4 text-gray-500">No tables found</td></tr>
                  ) : (
                    tables.map(t => (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="border p-3">{t.id}</td>
                        <td className="border p-3">{t.tableNumber}</td>
                        <td className="border p-3">{t.seats}</td>
                        <td className="border p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            t.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {t.available ? 'Available' : 'Occupied'}
                          </span>
                        </td>
                        <td className="border p-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleToggleTableStatus(t.id, t.available)} 
                              className={`px-3 py-1 rounded font-semibold text-white transition-colors ${
                                t.available 
                                  ? 'bg-orange-500 hover:bg-orange-600' 
                                  : 'bg-green-500 hover:bg-green-600'
                              }`}
                            >
                              {t.available ? 'Mark Occupied' : 'Mark Available'}
                            </button>
                            <button 
                              onClick={() => handleDeleteTable(t.id)} 
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Reports Tab */}
        {activeTab === 'Reports' && (
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-4xl font-bold text-[#5C4033] mb-8">Reports & Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-blue-700">
                  ₹{Array.isArray(orders) ? orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) : 0}
                </p>
              </div>
        
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Completed Orders</h3>
                <p className="text-3xl font-bold text-green-700">
                  {Array.isArray(orders) ? orders.filter(o => o.status === 'Served').length : 0}
                </p>
              </div>
        
              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Active Staff</h3>
                <p className="text-3xl font-bold text-purple-700">{Array.isArray(staff) ? staff.length : 0}</p>
              </div>
            </div>
        
            <div className="bg-gray-50 p-6 rounded-xl mb-12">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {Array.isArray(orders) && orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#5C4033]">₹{order.totalAmount}</p>
                      <p className="text-xs text-gray-500">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        
            <h3 className="text-2xl font-bold mb-4">User Submitted Reports</h3>
            {!Array.isArray(reports) || reports.length === 0 ? (
              <p className="text-gray-600">No reports available.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-[#D4AF37] text-white">
                  <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">User</th>
                    <th className="border p-2">Type</th>
                    <th className="border p-2">Message</th>
                    <th className="border p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(rp => (
                    <tr key={rp.id} className="text-gray-800">
                      <td className="border p-2">{rp.id}</td>
                      <td className="border p-2">
                        {rp.user ? rp.user.name : "Unknown User"}
                      </td>
                      <td className="border p-2">{rp.type}</td>
                      <td className="border p-2">{rp.message}</td>
                      <td className="border p-2">
                        {rp.createdAt ? new Date(rp.createdAt).toLocaleString() : "No Date"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        
        {/* Feedback Tab */}
        {activeTab === "Feedback" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Customer Feedbacks</h2>
            {loading ? (
              <p>Loading feedbacks...</p>
            ) : !Array.isArray(feedbacks) || feedbacks.length === 0 ? (
              <p>No feedbacks available.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-[#D4AF37] text-white">
                  <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Customer Name</th>
                    <th className="border p-2">Message</th>
                    <th className="border p-2">Rating</th>
                    <th className="border p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map(fb => (
                    <tr key={fb.id} className="text-gray-800">
                      <td className="border p-2">{fb.id}</td>
                      <td className="border p-2">{fb.customerName}</td>
                      <td className="border p-2">{fb.comment}</td>
                      <td className="border p-2 text-yellow-500 text-lg">
                      {renderStars(fb.rating)}
                      </td>
                      <td className="border p-2">{new Date(fb.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Helper Components
const StatCard = ({ title, count, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
    <div>
      <p className="text-lg text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold text-[#5C4033]">{count}</h3>
    </div>
    <div className={`${color} p-3 rounded-full`}>{icon}</div>
  </div>
);

const QuickActionCard = ({ title, description, onClick }) => (
  <div onClick={onClick} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-[#8B5A2B]">
    <h3 className="text-xl font-bold text-[#5C4033] mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const InputField = ({ label, name, type = "text", value, onChange, required, placeholder }) => (
  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-gray-800" />
  </div>
);