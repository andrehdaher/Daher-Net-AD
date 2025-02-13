import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../compontes/Navbar";
import toast from "react-hot-toast";

const EditItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productData = location.state || {};

  const [product, setProduct] = useState(productData);

  // حساب إجمالي المبيعات تلقائيًا بناءً على الكمية وسعر البيع
  const handleChange = (e) => {
    const updatedProduct = { ...product, [e.target.name]: e.target.value };
    
    // حساب إجمالي المبيعات إذا تم تعديل الكمية أو سعر البيع
    if (e.target.name === "quantity" || e.target.name === "salePrice") {
      updatedProduct.totalSales = updatedProduct.quantity * updatedProduct.salePrice;
    }

    setProduct(updatedProduct);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من وجود _id للمنتج
    if (!product._id) {
      toast.error("❌ المنتج غير موجود!");
      return;
    }

    // التحقق من صحة البيانات
    if (!product.name || !product.type || !product.wholesalePrice || !product.salePrice || !product.quantity) {
      toast.error("❌ جميع الحقول مطلوبة!");
      return;
    }

    if (product.wholesalePrice <= 0 || product.salePrice <= 0 || product.quantity < 0) {
      toast.error("❌ يجب أن تكون القيم أكبر من 0!");
      return;
    }

    try {
      // إرسال الطلب إلى الـ Backend
      await axios.put(`http://localhost:3000/api/productss/${product._id}`, {
        name: product.name,
        type: product.type,
        wholesalePrice: Number(product.wholesalePrice),
        salePrice: Number(product.salePrice),
        quantity: Number(product.quantity),
        totalSales: Number(product.totalSales),
      });

      toast.success("✅ تم تعديل المنتج بنجاح!");
      navigate("/");
    } catch (error) {
      toast.error("❌ فشل تحديث المنتج!");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col min-h-screen">
      <Navbar />
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">✏️ تعديل المنتج</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
        {/* اسم المنتج */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">📦 اسم المنتج:</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full border rounded-lg p-2" />
        </div>

        {/* النوع */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">📂 النوع:</label>
          <input type="text" name="type" value={product.type} onChange={handleChange} className="w-full border rounded-lg p-2" />
        </div>

        {/* سعر الجملة */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">💰 سعر الجملة ($):</label>
          <input type="number" name="wholesalePrice" value={product.wholesalePrice} onChange={handleChange} className="w-full border rounded-lg p-2" />
        </div>

        {/* سعر البيع */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">💵 سعر البيع ($):</label>
          <input type="number" name="salePrice" value={product.salePrice} onChange={handleChange} className="w-full border rounded-lg p-2" />
        </div>

        {/* الكمية */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">📦 الكمية:</label>
          <input type="number" name="quantity" value={product.quantity} onChange={handleChange} className="w-full border rounded-lg p-2" />
        </div>

        {/* إجمالي المبيعات */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">💰 إجمالي المبيعات ($):</label>
          <input type="number" name="totalSales" value={product.totalSales} onChange={handleChange} className="w-full border rounded-lg p-2" />
        </div>

        {/* زر حفظ التعديلات */}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          ✅ حفظ التعديلات
        </button>
      </form>
    </div>
  );
};

export default EditItem;
