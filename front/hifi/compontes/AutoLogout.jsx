import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.removeItem("token"); // إزالة التوكن
        alert("تم تسجيل الخروج بسبب عدم النشاط");
        navigate("/login"); // توجيه المستخدم لصفحة تسجيل الدخول
      }, 10 * 60 * 1000); // 10 دقائق
    };

    // الاستماع لجميع الأحداث التي تشير إلى النشاط
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer(); // تشغيل المؤقت عند تحميل الصفحة

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [navigate]);

  return null;
};

export default AutoLogout;
