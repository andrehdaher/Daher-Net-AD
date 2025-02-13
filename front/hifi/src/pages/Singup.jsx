import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState } from "react";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // افتراضيًا يكون User

  const handleSignup = async () => {
    
    try {
      await axios.post("http://localhost:3000/api/signup", { email, password, role }).then(() => {
      navigate("/login");  
      }
      )
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white w-96 p-6 flex flex-col items-center justify-center border-none rounded-lg shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Create Account</h2>

        <form className="w-full flex flex-col items-center">
          <input 
            type="text" 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Username" 
            className="w-full p-3 my-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          />

          <input 
            type="password" 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            className="w-full p-3 my-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          />

          {/* 🔹 اختيار الدور */}
          <select 
            onChange={(e) => setRole(e.target.value)} 
            className="w-full p-3 my-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button 
            onClick={handleSignup} 
            className="w-full p-3 mt-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
          >
            Signup
          </button>
        </form>

        <p className="mt-4 text-gray-600">
          Already have an account? 
          <Link to="/login" className="text-indigo-600 hover:underline ml-1">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
