import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom"; // لاستقبال الـ ID من الرابط
import Navbar from "../../compontes/Navbar"; // استيراد الـ Navbar
import toast from "react-hot-toast";

const EditPassport = () => {
  const { id } = useParams(); // لاستقبال الـ ID من الرابط
  const history = useHistory(); // لتوجيه المستخدم بعد التعديل

  const [fullName, setFullName] = useState("");
  const [idImages, setIdImages] = useState([]);
  const [passportType, setPassportType] = useState("عادي");
  const [amountPaid, setAmountPaid] = useState("");
  const [isReserved, setIsReserved] = useState(false);
  const [loading, setLoading] = useState(true);

  // جلب بيانات الجواز للتعديل عند تحميل الصفحة
  useEffect(() => {
    const fetchPassport = async () => {
      try {
        const response = await axios.get(`https://daher-net-ad-43.onrender.com/passports/${id}`);
        const passportData = response.data;
        setFullName(passportData.fullName);
        setPassportType(passportData.passportType);
        setAmountPaid(passportData.amountPaid);
        setIsReserved(passportData.isReserved);
        setIdImages(passportData.idImages); // تحميل الصور المتوفرة مع الجواز
      } catch (error) {
        console.error("❌ فشل في جلب بيانات الجواز:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPassport();
  }, [id]);

  const handleFileChange = (e) => {
    setIdImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || idImages.length === 0 || !amountPaid) {
      toast.error("❌ يرجى ملء جميع الحقول المطلوبة!");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    idImages.forEach((file) => {
      formData.append("idImages", file); // رفع الصور مع تسميات مناسبة
    });
    formData.append("passportType", passportType);
    formData.append("amountPaid", amountPaid);
    formData.append("isReserved", isReserved);

    try {
      const response = await axios.put(`https://daher-net-ad-43.onrender.com/passports/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("✅ تم تعديل الجواز بنجاح!");
      history.push("/view-passports"); // توجيه المستخدم إلى صفحة عرض الجوازات بعد التعديل
    } catch (error) {
      console.error("❌ حدث خطأ أثناء التعديل:", error);
      toast.error("❌ فشل في تعديل الجواز!");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-blue-600">جارٍ تحميل البيانات...</h2>
      </div>
    );
  }

  return (
    <>
      <Navbar /> {/* إضافة الـ Navbar */}
      <div className="container mx-auto p-6 flex flex-col min-h-screen">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">🛂 تعديل جواز السفر</h1>
        <form
          className="bg-white shadow-md rounded-lg p-6 mx-auto max-w-lg"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* الاسم الثلاثي */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">👤 الاسم الثلاثي:</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* صور الهوية */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">🖼️ صور الهوية:</label>
            <input
              type="file"
              className="w-full p-2 border rounded-lg"
              onChange={handleFileChange}
              accept="image/*"
              multiple // السماح برفع أكثر من ملف
            />
          </div>

          {/* نوع الجواز */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">📜 نوع الجواز:</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={passportType}
              onChange={(e) => setPassportType(e.target.value)}
            >
              <option value="عادي">عادي</option>
              <option value="مستعجل">مستعجل</option>
              <option value="فوري">فوري</option>
            </select>
          </div>

          {/* المبلغ المسدد */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">💵 المبلغ المسدد ($):</label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              required
            />
          </div>

          {/* تم الحجز أو لم يتم */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">✅ تم الحجز:</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  name="reservation"
                  value="yes"
                  checked={isReserved === true}
                  onChange={() => setIsReserved(true)}
                />
                نعم
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  name="reservation"
                  value="no"
                  checked={isReserved === false}
                  onChange={() => setIsReserved(false)}
                />
                لا
              </label>
            </div>
          </div>

          {/* زر الإرسال */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              ✏️ تعديل الجواز
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditPassport;
