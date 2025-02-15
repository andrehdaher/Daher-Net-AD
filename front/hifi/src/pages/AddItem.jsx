import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../compontes/Navbar";
import toast from "react-hot-toast";
import axios from "axios"; // استيراد Axios لإرسال الطلب

const AddItem = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    type: "",
    wholesalePrice: "",
    salePrice: "",
    quantity: "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.type || !product.wholesalePrice || !product.salePrice || !product.quantity) {
      toast.error("❌ جميع الحقول مطلوبة!");
      return;
    }

    if (product.wholesalePrice <= 0 || product.salePrice <= 0 || product.quantity <= 0) {
      toast.error("❌ يجب أن تكون القيم أكبر من 0!");
      return;
    }

    const newProduct = {
      name: product.name,
      type: product.type,
      wholesalePrice: parseFloat(product.wholesalePrice),
      salePrice: parseFloat(product.salePrice),
      quantity: parseInt(product.quantity),
      balance: parseFloat(product.salePrice) * parseInt(product.quantity), // الرصيد = سعر البيع × الكمية
      totalSales: 0, // إجمالي المبيعات يبدأ من 0
    };

    try {
      // إرسال الطلب إلى قاعدة البيانات
      await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, newProduct);

      toast.success("✅ تم إضافة المنتج بنجاح!");
      navigate("/"); // الرجوع إلى الصفحة الرئيسية بعد الإضافة
    } catch (error) {
      console.error("حدث خطأ أثناء إضافة المنتج:", error);
      toast.error("❌ حدث خطأ أثناء الإضافة!");
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col min-h-screen">
      <Navbar />
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">➕ إضافة منتج جديد</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
        {/* 📦 اسم المنتج */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">📦 اسم المنتج:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="مثال: لابتوب Dell"
          />
        </div>

        {/* 📂 النوع */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">📂 النوع:</label>
          <input
            type="text"
            name="type"
            value={product.type}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="مثال: إلكترونيات"
          />
        </div>

        {/* 💰 سعر الجملة */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">💰 سعر الجملة ($):</label>
          <input
            type="number"
            name="wholesalePrice"
            value={product.wholesalePrice}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="مثال: 500"
          />
        </div>

        {/* 💵 سعر المبيع */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">💵 سعر المبيع ($):</label>
          <input
            type="number"
            name="salePrice"
            value={product.salePrice}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="مثال: 600"
          />
        </div>

        {/* 📦 الكمية */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">📦 الكمية:</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="مثال: 10"
          />
        </div>

        {/* ✅ زر الإضافة */}
        <div className="flex justify-center mt-4">
          <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
            ✅ إضافة المنتج
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
