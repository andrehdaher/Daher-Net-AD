import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditSale = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sale } = location.state;

  const [productName, setProductName] = useState(sale.productName);
  const [quantitySold, setQuantitySold] = useState(sale.quantitySold);
  const [salePrice, setSalePrice] = useState(sale.salePrice);
  const [paymentMethod, setPaymentMethod] = useState(sale.paymentMethod);

  const handleUpdate = async () => {
    try {
      await axios.put(`https://daher-net-ad-43.onrender.com/api/sales/${sale._id}`, {
        productName,
        quantitySold,
        salePrice,
        paymentMethod,
      });
      toast.success("✅ تم تحديث بيانات البيع بنجاح!");
      navigate("/sales");
    } catch (error) {
      console.error("❌ خطأ أثناء التحديث:", error);
      toast.error("❌ فشل تحديث بيانات البيع!");
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">✏ تعديل عملية البيع</h1>
      <div className="flex flex-col space-y-4">
        <input
          className="p-2 border rounded-lg"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="اسم المنتج"
        />
        <input
          className="p-2 border rounded-lg"
          type="number"
          value={quantitySold}
          onChange={(e) => setQuantitySold(e.target.value)}
          placeholder="الكمية"
        />
        <input
          className="p-2 border rounded-lg"
          type="number"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          placeholder="سعر الوحدة"
        />
        <select
          className="p-2 border rounded-lg"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="نقدًا">💵 نقدًا</option>
          <option value="دين">📜 دين</option>
        </select>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          onClick={handleUpdate}
        >
          ✅ تحديث البيانات
        </button>
      </div>
    </div>
  );
};

export default EditSale;
