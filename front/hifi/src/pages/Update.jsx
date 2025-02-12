import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Update = () => {
    const location = useLocation();
    const userData = location.state; // استقبال البيانات عبر location.state

    const [formData, setFormData] = useState({
        fullName: "",
        speed: "",
        tower: "",
        ip: "",
        user: "",
        password: "",
        date: "",
        required: "",
        paid: "",
    });

    // تأكد من أن البيانات القادمة ليست فارغة
    useEffect(() => {
        if (userData) {
            setFormData({
                fullName: userData.fullName || "",
                speed: userData.speed || "",
                tower: userData.tower || "",
                ip: userData.ip || "",
                user: userData.user || "",
                password: userData.password || "",
                date: userData.date || "",
                required: userData.required || "",
                paid: userData.paid || "",
                manualUpdate: true

            });
        }
    }, [userData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // هنا نستخدم PUT لتحديث البيانات في الخادم
            const response = await axios.put(`http://localhost:3000/update/${userData._id}`, formData);

            if (response.status === 200) { // التأكد من نجاح التحديث
                alert("User updated successfully!");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("There was an error updating the user.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Update User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {["fullName", "speed", "tower", "ip", "user", "password", "date", "required", "paid"].map((field) => (
                        <div key={field}>
                            <input
                                type={field === "password" ? "password" : field === "date" ? "date" : "text"}
                                name={field}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                value={formData[field]} // تعبئة الحقل بالقيمة القديمة
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                    ))}
                    <button type="submit"  className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
                        Update User
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Update;
