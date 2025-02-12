import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../compontes/Navbar";
import toast from "react-hot-toast";

const Inventory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // ✅ جلب المنتجات من الـ backend عند تحميل الصفحة
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        setProducts(response.data);
      } catch (error) {
        console.error("❌ خطأ في جلب المنتجات:", error);
        toast.error("❌ فشل تحميل البيانات!");
      }
    };

    fetchProducts();
  }, []);

  // ✅ حساب المجموع للرصيد والمبيعات
  const totalBalance = products.reduce((sum, product) => sum + product.salePrice * product.quantity, 0);
  const totalSalesSum = products.reduce((sum, product) => sum + product.totalSales, 0);

  // ✅ دالة بيع المنتج
  const handleSell = async (id) => {
    const product = products.find((p) => p._id === id);
    if (!product || product.quantity === 0) return;

    let quantityToSell = parseInt(prompt(`🔢 أدخل عدد الوحدات التي تريد بيعها (${product.quantity} متوفر)`));
    if (isNaN(quantityToSell) || quantityToSell <= 0 || quantityToSell > product.quantity) {
      toast.error("❌ عدد غير صالح!");
      return;
    }

    let salePrice = parseFloat(prompt(`💰 أدخل سعر البيع للوحدة (${product.salePrice}$ الافتراضي)`)) || product.salePrice;
    if (isNaN(salePrice) || salePrice <= 0) {
      toast.error("❌ سعر غير صالح!");
      return;
    }

    let totalSale = quantityToSell * salePrice;

    // 🔹 طلب خيار الدفع
    let paymentMethod = prompt("💳 اختر طريقة الدفع:\n1️⃣ نقدًا\n2️⃣ دين").trim();
    if (paymentMethod !== "1" && paymentMethod !== "2") {
      toast.error("❌ طريقة دفع غير صحيحة!");
      return;
    }

    paymentMethod = paymentMethod === "1" ? "نقدًا" : "دين";

    try {
      // ✅ تحديث المنتج في الـ backend
      await axios.put(`http://localhost:3000/products/${id}`, {
        quantity: product.quantity - quantityToSell,
        totalSales: product.totalSales + totalSale,
      });

      // ✅ تسجيل البيع في قاعدة بيانات المبيعات
      await axios.post("http://localhost:3000/sales", {
        productId: id,
        productName: product.name,
        quantitySold: quantityToSell,
        salePrice: salePrice,
        totalSale: totalSale,
        paymentMethod: paymentMethod,
        date: new Date().toISOString(),
      });

      // ✅ تحديث المنتجات في الواجهة
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === id
            ? { ...p, quantity: p.quantity - quantityToSell, totalSales: p.totalSales + totalSale }
            : p
        )
      );

      toast.success(`✅ تم بيع ${quantityToSell} من ${product.name} بمبلغ ${totalSale}$ (${paymentMethod})`);
    } catch (error) {
      console.error("❌ خطأ أثناء البيع:", error);
      toast.error("❌ فشل في تحديث المنتج أو تسجيل البيع!");
    }
  };

  // ✅ دالة حذف المنتج
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("❌ هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذه العملية!");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/products/${id}`);

      // ✅ تحديث المنتجات بعد الحذف
      setProducts((prevProducts) => prevProducts.filter((p) => p._id !== id));

      toast.success("✅ تم حذف المنتج بنجاح!");
    } catch (error) {
      console.error("❌ خطأ أثناء الحذف:", error);
      toast.error("❌ فشل في حذف المنتج!");
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col min-h-screen">
      <Navbar />
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">📦 قائمة المنتجات</h1>

      <div className="overflow-auto shadow-lg rounded-lg flex-grow">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">الاسم</th>
              <th className="py-2 px-4 border">النوع</th>
              <th className="py-2 px-4 border">💰 سعر الجملة ($)</th>
              <th className="py-2 px-4 border">💵 سعر المبيع ($)</th>
              <th className="py-2 px-4 border">📦 العدد</th>
              <th className="py-2 px-4 border">💲 الرصيد ($)</th>
              <th className="py-2 px-4 border">💰 إجمالي المبيعات ($)</th>
              <th className="py-2 px-4 border">⚙️ الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id} className="text-center hover:bg-gray-100 transition duration-200">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{product.name}</td>
                <td className="py-2 px-4 border">{product.type}</td>
                <td className="py-2 px-4 border text-green-600 font-semibold">${product.wholesalePrice}</td>
                <td className="py-2 px-4 border text-blue-600 font-semibold">${product.salePrice}</td>
                <td className="py-2 px-4 border text-red-600 font-semibold">{product.quantity}</td>
                <td className="py-2 px-4 border text-purple-600 font-semibold">${(product.salePrice * product.quantity).toFixed(2)}</td>
                <td className="py-2 px-4 border text-orange-600 font-semibold">${product.totalSales.toFixed(2)}</td>
                <td className="py-2 px-4 border">
                  <button onClick={() => handleSell(product._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg ml-2">🛒 بيع</button>
                  <button onClick={() => navigate(`/edit-item/${product._id}`, { state: product })} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg ml-2">✏️ تعديل</button>
                  <button onClick={() => handleDelete(product._id)} className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg ml-2">🗑️ حذف</button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-200 font-bold text-lg">
              <td colSpan="6" className="py-2 px-4 border text-center">الإجمالي</td>
              <td className="py-2 px-4 border text-purple-700">${totalBalance.toFixed(2)}</td>
              <td className="py-2 px-4 border text-orange-700">${totalSalesSum.toFixed(2)}</td>
              <td className="py-2 px-4 border"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
