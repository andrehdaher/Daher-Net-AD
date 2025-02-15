import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import dotenv from 'dotenv';

dotenv.config();


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role); // حفظ الدور
  
        if (res.data.role === "admin") {
          const user = {
            username: "adminUser",
            role: "admin", // تأكد من أن الدور يتم تخزينه
          };
  
          localStorage.setItem("user", JSON.stringify(user)); // تخزين بيانات المستخدم
          console.log("✅ تم حفظ بيانات المستخدم:", user);
          navigate("/");
          toast.success("Login success"); // رسالة نجاح
        } else {
          // 🛑 قم بحذف أي بيانات قديمة للمستخدم العادي
          localStorage.removeItem("user"); 
          navigate("/user-dashboard", { state: { email } });
        } 
      })
      .catch(() => {
        toast.error("تأكد من اسم المستخدم أو كلمة المرور"); // رسالة خطأ
      });
  };
  

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400">
      <div className="bg-white shadow-lg rounded-lg w-96 p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">Daher.Net</h1>
        <div className="mt-8">
          <h6 className="font-light text-center text-xl text-gray-600 mb-4">Sign in below</h6>
          <form method="post" className="w-full space-y-4" onSubmit={handleLogin}>
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-lg w-full h-12 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-lg w-full h-12 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <button className="w-full bg-blue-600 py-3 rounded-lg text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              Login
            </button>

            <div className="text-center mt-4">
              <Link className="text-blue-500 hover:text-blue-700 font-light" to="/singup">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
