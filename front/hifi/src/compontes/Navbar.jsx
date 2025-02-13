import { Link } from "react-router-dom";
import AutoLogout from "./AutoLogout";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log("🚀 بيانات المستخدم:", user); // ✅ تسجيل البيانات للتأكد من وجود role
        setIsAdmin(user?.role === "admin");
      } catch (error) {
        console.error("❌ خطأ في تحليل بيانات المستخدم:", error);
      }
    } else {
      console.warn("⚠️ لا يوجد بيانات مستخدم في localStorage!");
    }
  }, []);

  if (!isAdmin) {
    console.warn("🛑 المستخدم ليس Admin، سيتم إخفاء Navbar!");
    return null; // إخفاء الـ Navbar إذا لم يكن المستخدم Admin
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white py-3 shadow-lg z-50">
      <AutoLogout />
      <div className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-xl font-bold">🌐 My Dashboard</h1>
        <div className="hidden md:flex gap-4">
          <Link className="px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300" to="/">🏠 Home</Link>
          <Link className="px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300" to="/search">🔍 Search</Link>
          <Link className="px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300" to="/add-user">➕ Add User</Link>
          <Link className="px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300" to="/inventory">📦 Inventory</Link>
          <Link className="px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300" to="/sales">💰 Sales</Link>
          <Link className="px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300" to="/add-item">🛠 Add Item</Link>
          <Link className="px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300" to="/add-passport">🛂 Add Passport</Link>
          <Link className="px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300" to="/passports">📑 View Passports</Link>
          <Link className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition duration-300" to="/login">🚪 Logout</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
