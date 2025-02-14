import React, { useState } from "react";
import Navbar from "../compontes/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [fullName, setFullName] = useState("");
  const [speed, setSpeed] = useState("");
  const [tower, setTower] = useState("");
  const [ip, setIp] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState("");
  const [required, setRequired] = useState("");
  const [paid, setPaid] = useState("");
  const navigate = useNavigate();

  const addUserHandler = async (e) => {
    e.preventDefault();

    // تحقق من أن جميع الحقول تم تعبئتها
    if (!fullName || !speed || !tower || !ip || !user || !password || !date || !required || !paid) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    // تحويل القيم الرقمية إلى Number
    const userData = {
      fullName,
      tower,
      ip: Number(ip),
      user,
      speed: Number(speed),
      password,
      date,
      required,
      paid: Number(paid),
      
    };

    console.log("بيانات المستخدم المرسلة:", userData);

    try {
      await axios.post("http://localhost:3000/api/add-user", userData);
      alert("تمت إضافة المستخدم بنجاح");
      navigate("/");
    } catch (err) {
      console.error("خطأ أثناء إضافة المستخدم:", err);
      alert("حدث خطأ أثناء إضافة المستخدم");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-10 px-6">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-8">Add New User</h2>

        <form onSubmit={addUserHandler} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                className="mt-1 p-3 w-full border-2 rounded-md border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Speed</label>
              <input
                type="number"
                onChange={(e) => setSpeed(e.target.value)}
                value={speed}
                className="mt-1 p-3 w-full border-2 rounded-md border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">The Tower</label>
              <input
                type="text"
                onChange={(e) => setTower(e.target.value)}
                value={tower}
                className="mt-1 p-3 w-full border-2 rounded-md border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">IP</label>
              <input
                type="number"
                onChange={(e) => setIp(e.target.value)}
                value={ip}
                className="mt-1 p-3 w-full border-2 rounded-md border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">User</label>
              <input
                type="text"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                className="mt-1 p-3 w-full border-2 rounded-md border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="mt-1 p-3 w-full border-2 rounded-md border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Installation Date</label>
              <input
                type="date"
                onChange={(e) => setDate(e.target.value)}
                value={date}
                className="mt-1 p-3 w-full border-2 rounded-md border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Required</label>
              <input
                type="text"
                onChange={(e) => setRequired(e.target.value)}
                value={required}
                className="mt-1 p-3 w-full border-2 rounded-md border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Paid</label>
              <input
                type="number"
                onChange={(e) => setPaid(e.target.value)}
                value={paid}
                className="mt-1 p-3 w-full border-2 rounded-md border-indigo-600"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="w-48 bg-cyan-500 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-cyan-600 transition duration-300"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
