import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../compontes/Navbar";
import toast from "react-hot-toast";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  // ✅ 📌 جلب سجل المبيعات
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get("http://localhost:3000/sales");
        setSales(response.data);
      } catch (error) {
        console.error("❌ خطأ في جلب المبيعات:", error);
        toast.error("❌ فشل تحميل بيانات المبيعات!");
      }
    };

    fetchSales();
  }, []);

  // 🔹 تصفية المبيعات حسب طريقة الدفع
  const filteredSales =
    filter === "all" ? sales : sales.filter((sale) => sale.paymentMethod === filter);

  // ✅ حساب إجمالي المبيعات
  const totalSalesSum = filteredSales.reduce((sum, sale) => sum + sale.totalSale, 0);

  // 🗑 حذف عملية بيع
  const handleDelete = async (saleId) => {
    if (!window.confirm("⚠️ هل أنت متأكد من حذف هذه العملية؟")) return;

    try {
      await axios.delete(`http://localhost:3000/sales/${saleId}`);
      setSales(sales.filter((sale) => sale._id !== saleId));
      toast.success("✅ تم حذف العملية بنجاح!");
    } catch (error) {
      console.error("❌ خطأ أثناء الحذف:", error);
      toast.error("❌ فشل حذف العملية!");
    }
  };

  // ✏ تعديل عملية بيع
  const handleEdit = (sale) => {
    navigate(`/edit-sale/${sale._id}`, { state: { sale } }); // الانتقال إلى صفحة التعديل مع تمرير البيانات
  };

  return (
    <div className="container mx-auto p-6 flex flex-col min-h-screen">
      <Navbar />
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">📜 سجل المبيعات</h1>

      {/* 🔹 فلترة حسب طريقة الدفع */}
      <div className="flex justify-center mb-4">
        <select
          className="p-2 border rounded-lg shadow-md text-gray-700"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">📋 الكل</option>
          <option value="نقدًا">💵 نقدًا</option>
          <option value="دين">📜 دين</option>
        </select>
      </div>

      {/* ✅ جدول عرض المبيعات */}
      <div className="overflow-auto shadow-lg rounded-lg flex-grow">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">📦 المنتج</th>
              <th className="py-2 px-4 border">🔢 الكمية</th>
              <th className="py-2 px-4 border">💰 سعر الوحدة ($)</th>
              <th className="py-2 px-4 border">💲 إجمالي البيع ($)</th>
              <th className="py-2 px-4 border">💳 طريقة الدفع</th>
              <th className="py-2 px-4 border">📅 التاريخ</th>
              <th className="py-2 px-4 border">✏ تعديل</th>
              <th className="py-2 px-4 border">🗑 حذف</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale, index) => (
              <tr key={sale._id} className="text-center hover:bg-gray-100 transition duration-200">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{sale.productName}</td>
                <td className="py-2 px-4 border text-red-600 font-semibold">{sale.quantitySold}</td>
                <td className="py-2 px-4 border text-blue-600 font-semibold">${sale.salePrice}</td>
                <td className="py-2 px-4 border text-green-600 font-semibold">${sale.totalSale.toFixed(2)}</td>
                <td className="py-2 px-4 border text-purple-600 font-semibold">{sale.paymentMethod}</td>
                <td className="py-2 px-4 border text-gray-600">{new Date(sale.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                    onClick={() => handleEdit(sale)}
                  >
                    ✏ تعديل
                  </button>
                </td>
                <td className="py-2 px-4 border">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleDelete(sale._id)}
                  >
                    🗑 حذف
                  </button>
                </td>
              </tr>
            ))}

            {/* ✅ صف إجمالي المبيعات */}
            <tr className="bg-gray-200 font-bold text-lg">
              <td colSpan="4" className="py-2 px-4 border text-center">💰 إجمالي المبيعات</td>
              <td className="py-2 px-4 border text-green-700">${totalSalesSum.toFixed(2)}</td>
              <td colSpan="4" className="py-2 px-4 border"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
