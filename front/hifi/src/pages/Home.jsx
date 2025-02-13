import { useEffect, useState } from "react";
import Navbar from "../../compontes/Navbar";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [array, setArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const currentDate = new Date();
      const currentYearMonth = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

      const updatedUsers = await Promise.all(
        response.data.map(async (user) => {
          const installationDate = new Date(user.date);
          const monthsPassed =
            (currentDate.getFullYear() - installationDate.getFullYear()) * 12 +
            (currentDate.getMonth() - installationDate.getMonth());

          const lastUpdatedMonth = user.lastUpdatedMonth
            ? new Date(user.lastUpdatedMonth)
            : null;
          const lastUpdatedYearMonth = lastUpdatedMonth
            ? `${lastUpdatedMonth.getFullYear()}-${lastUpdatedMonth.getMonth()}`
            : null;

          // ✅ التحديث فقط إذا لم يتم تحديث `lastUpdatedMonth` لهذا الشهر
          if (
            monthsPassed >= 1 &&
            lastUpdatedYearMonth !== currentYearMonth
          ) {
            const additionalAmount =
              user.speed === 1 ? 5 * monthsPassed : user.speed * 4 * monthsPassed;
            const newRequired = Number(user.required) + additionalAmount;

            // تحديث البيانات في السيرفر
            await axios.put(`http://localhost:3000/api/update/${user._id}`, {
              required: newRequired,
              lastUpdatedMonth: currentDate,
            });

            return { ...user, required: newRequired, lastUpdatedMonth: currentDate };
          }
          return user;
        })
      );

      setArray(updatedUsers);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/delete/${id}`);
      setArray((prevArray) => prevArray.filter((user) => user._id !== id));
      alert("User deleted successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  // حساب المجاميع
  const totalSpeed = array.reduce((sum, user) => sum + Number(user.speed), 0);
  const totalRequired = array.reduce((sum, user) => sum + Number(user.required), 0);
  const totalPaid = array.reduce((sum, user) => sum + Number(user.paid), 0);
  const totalMonthlyFee = array.reduce(
    (sum, user) => sum + (Number(user.required) - Number(user.paid)),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-10 px-6">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-8">
          User List
        </h2>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Full Name</th>
                <th className="px-6 py-3">Speed</th>
                <th className="px-6 py-3">Tower</th>
                <th className="px-6 py-3">IP</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Password</th>
                <th className="px-6 py-3">Required</th>
                <th className="px-6 py-3">Monthly Fee</th>
                <th className="px-6 py-3">Installation Date</th>
                <th className="px-6 py-3">Paid</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {array.map((user, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3">{i + 1}</td>
                  <td className="px-6 py-3">{user.fullName}</td>
                  <td className="px-6 py-3">{user.speed}</td>
                  <td className="px-6 py-3">{user.tower}</td>
                  <td className="px-6 py-3">{user.ip}</td>
                  <td className="px-6 py-3">{user.user}</td>
                  <td className="px-6 py-3">{user.password}</td>
                  <td className="px-6 py-3">{user.required}</td>
                  <td className="px-6 py-3">{user.required - user.paid}</td>
                  <td className="px-6 py-3">{user.date}</td>
                  <td className="px-6 py-3">{user.paid}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <Link
                      to="/update"
                      state={user}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-200 font-bold">
                <td className="px-6 py-3" colSpan="2">Total</td>
                <td className="px-6 py-3">{totalSpeed}</td>
                <td className="px-6 py-3" colSpan="4"></td>
                <td className="px-6 py-3">{totalRequired}</td>
                <td className="px-6 py-3">{totalMonthlyFee}</td>
                <td className="px-6 py-3" colSpan="1"></td>
                <td className="px-6 py-3">{totalPaid}</td>
                <td className="px-6 py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
