import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../compontes/Navbar"; // استيراد الـ Navbar
import { Link } from "react-router-dom"; // للوصول إلى صفحة إضافة جواز جديد

const ViewPassports = () => {
  const [passports, setPassports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب الجوازات من السيرفر
    const fetchPassports = async () => {
      try {
        const response = await axios.get("https://daher-net-ad-43.onrender.com/api/passports");
        setPassports(response.data); // تخزين البيانات المسترجعة
      } catch (error) {
        console.error("❌ فشل في جلب البيانات:", error);
      } finally {
        setLoading(false); // إيقاف التحميل بعد جلب البيانات
      }
    };

    fetchPassports();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://daher-net-ad-43.onrender.com/api/passports/${id}`);
      setPassports(passports.filter((passport) => passport._id !== id)); // حذف الجواز من الواجهة بعد النجاح
      alert("✅ تم حذف الجواز بنجاح!");
    } catch (error) {
      console.error("❌ فشل في حذف الجواز:", error);
      alert("❌ فشل في حذف الجواز!");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-blue-600">جارٍ تحميل الجوازات...</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar /> {/* إضافة الـ Navbar */}
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">🛂 عرض الجوازات</h1>

        {/* زر لإضافة جواز جديد */}
        <div className="mb-4 text-center">
          <Link
            to="/add-passport"  // تغيير الرابط إلى الصفحة المناسبة
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            ➕ إضافة جواز جديد
          </Link>
        </div>

        {/* عرض الجوازات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {passports.length === 0 ? (
            <p className="text-gray-500 text-center col-span-3">❌ لا توجد جوازات حالياً لعرضها.</p>
          ) : (
            passports.map((passport) => (
              <div
                key={passport._id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
              >
                <img
                  src={passport.idImages[0]} // افتراض أن الصورة الأولى هي صورة الهوية
                  alt="ID Image"
                  className="w-24 h-24 object-cover rounded-full mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-800">{passport.fullName}</h2>
                <p className="text-gray-600">نوع الجواز: {passport.passportType}</p>
                <p className="text-gray-600">المبلغ المدفوع: ${passport.amountPaid}</p>
                <p className="text-gray-600">تم الحجز: {passport.isReserved ? "نعم" : "لا"}</p>

                {/* أزرار التعديل والحذف */}
                <div className="mt-4 flex gap-4">
                  {/* زر التعديل */}
                  <Link
                    to={`/edit-passport/${passport._id}`} // إعادة التوجيه إلى صفحة التعديل مع ID الجواز
                    className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600"
                  >
                    ✏️ تعديل
                  </Link>

                  {/* زر الحذف */}
                  <button
                    onClick={() => handleDelete(passport._id)}
                    className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700"
                  >
                    🗑️ حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ViewPassports;
