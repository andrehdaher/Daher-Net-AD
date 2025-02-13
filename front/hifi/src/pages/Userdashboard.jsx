import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function UserInvoice() {
  const location = useLocation();
  const email = location.state?.email; // استقبال البريد الإلكتروني

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!email) {
      setError("No email provided");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        console.log("Fetching data for:", email);
        const response = await axios.get(`http://localhost:3000/api/user/${encodeURIComponent(email)}`);
        setUserData(response.data);
      } catch (err) {
        setError("User not found or error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const monthlyFee = userData.required - userData.paid;

  return (
    <div className="min-h-screen bg-blue-700 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="max-w-lg mx-auto p-6 border border-gray-300 shadow-lg rounded-lg bg-white text-blue-700"
      >
        <motion.h1 
          className="text-3xl font-bold text-center mb-4" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
        >
          Daher.Net
        </motion.h1>
        <motion.h2 
          className="text-2xl font-semibold text-center mb-4" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4 }}
        >
          Invoice
        </motion.h2>
        <div className="border-b border-gray-300 pb-4 mb-4">
          <p className="text-gray-700"><strong>Name:</strong> {userData.fullName}</p>
        </div>
        <div className="border-b border-gray-300 pb-4 mb-4">
          <p className="text-gray-700"><strong>Speed:</strong> {userData.speed} Mbps</p>
        </div>
        <div className="border-b border-gray-300 pb-4 mb-4">
          <p className="text-gray-700"><strong>Required Payment:</strong> {userData.required} USD</p>
          <p className="text-gray-700"><strong>Paid Amount:</strong> {userData.paid} USD</p>
          <p className="text-gray-700 font-semibold"><strong>Monthly Fee:</strong> {monthlyFee} USD</p>
          <p className={`font-semibold ${userData.paid === userData.required ? "text-green-600" : "text-red-600"}`}>
            <strong>Payment Status:</strong> {userData.paid === userData.required ? "Paid" : "Not Paid"}
          </p>
        </div>
        <div className="text-center mt-4">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            className="px-6 py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition"
          >
            Download Invoice
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}