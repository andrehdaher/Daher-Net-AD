const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./models/userShcema");
const addUser = require("./models/add-userSchema");
const Product = require("./models/productSchema ");
const Passport = require("./models/passportSchema");
const Sale = require("./models/Saleschema");
var methodOverride = require("method-override");

const app = express();
app.use(cors());
app.use(express.json());
app.use(methodOverride("_method"));
app.use("/uploads", express.static("uploads")); // جعل الملفات قابلة للوصول

mongoose
  .connect(
    "mongodb+srv://andrehdaher2003:UdVBUjufCUd79dqc@travelstory.svfos.mongodb.net/loginUser?retryWrites=true&w=majority&appName=travelstory"
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

const verifyRole = (role) => {
  return (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided, please login" });
    }

    try {
      const decoded = jwt.verify(token, "secretKey"); // استخدم "secretKey" مباشرة بدلاً من استخراجها من التوكن
      if (decoded.role !== role) {
        return res.status(403).json({ message: "Access denied, incorrect role" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token, please login again" });
    }
  };
};

// ✅ تسجيل مستخدم جديد (Signup)
app.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: "Enter all fields" });
  }

  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // لا حاجة لتشفير كلمة المرور، فقط خزنها كما هي
  await User.create({ email, password, role });

  res.status(200).json({ message: "Signup successful" });
});

// ✅ تسجيل الدخول (Login)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // مقارنة كلمة المرور المدخلة بكلمة المرور المخزنة كما هي
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, "secretKey", {
      expiresIn: "10m",
    });

    res.status(200).json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error logging in" });
  }
});

// ✅ إضافة مستخدم جديد
app.post("/add-user", async (req, res) => {
  try {
    const { fullName, ip, tower, date, speed, user, password, required, paid, email } = req.body;

    const newUser = new addUser({ fullName, ip, tower, date, speed, user, password, required, paid, email });
    await newUser.save();

    res.status(200).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
});

// ✅ جلب جميع المستخدمين (للمشرف فقط)
app.get("/", verifyRole("admin"), async (req, res) => {
  try {
    const users = await addUser.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ✅ جلب بيانات مستخدم بواسطة البريد الإلكتروني
app.get("/user/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await addUser.findOne({ user: email });

    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Error fetching user data:", err);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// ✅ تحديث بيانات المستخدم
app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  if (updateFields.manualUpdate) {
    updateFields.lastUpdatedMonth = new Date(); // إضافة تاريخ التحديث إذا كان تحديثًا يدويًا
  }

  try {
    const updatedUser = await addUser.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error });
  }
});

// إعدادات Multer لتحميل الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // مجلد حفظ الملفات
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // اسم الملف الفريد
  },
});

const upload = multer({ storage });

// دالة إضافة جواز سفر مع دعم رفع أكثر من صورة
app.post("/passports", upload.array("idImages", 10), async (req, res) => {
  try {
    const { fullName, passportType, amountPaid, isReserved } = req.body;

    if (!fullName || !passportType || !amountPaid) {
      return res.status(400).json({ message: "❌ يرجى ملء جميع الحقول المطلوبة!" });
    }

    const idImages = req.files.map((file) => file.path);

    const newPassport = new Passport({
      fullName,
      idImages,
      passportType,
      amountPaid,
      isReserved: isReserved === "true",
    });

    const savedPassport = await newPassport.save();

    res.status(201).json({
      message: "✅ تم إضافة الجواز بنجاح!",
      passport: savedPassport,
    });
  } catch (error) {
    console.error("❌ حدث خطأ أثناء إضافة الجواز:", error);
    res.status(500).json({ message: `❌ حدث خطأ أثناء حفظ البيانات: ${error.message}` });
  }
});

// دالة عرض الجوازات
app.get("/passports", async (req, res) => {
  try {
    const passports = await Passport.find(); // جلب جميع الجوازات من قاعدة البيانات
    res.json(passports); // إرسال الجوازات كاستجابة في هيئة JSON
  } catch (error) {
    console.error("❌ خطأ في جلب الجوازات:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الجوازات" });
  }
});

// دالة الحذف بناءً على الـ ID
app.delete("/passports/:id", async (req, res) => {
  try {
    // استخدام ID من الرابط للبحث عن الجواز
    const passport = await Passport.findByIdAndDelete(req.params.id);
    
    // إذا لم يتم العثور على الجواز
    if (!passport) {
      return res.status(404).json({ message: "الجواز غير موجود!" });
    }

    // حذف الصور المرتبطة بالجواز من المجلد
    passport.idImages.forEach((imagePath) => {
      const filePath = path.join(__dirname, imagePath);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("❌ خطأ في حذف الصورة:", err);
        } else {
          console.log(`✅ تم حذف الصورة: ${imagePath}`);
        }
      });
    });

    // إذا تم العثور على الجواز وحذفه
    res.json({ message: "تم حذف الجواز بنجاح!" });
  } catch (error) {
    console.error("❌ حدث خطأ أثناء حذف الجواز:", error);
    res.status(500).json({ message: "حدث خطأ في الحذف، يرجى المحاولة لاحقًا." });
  }
});

// إعداد المنفذ
const port = process.env.PORT || 3000; // استخدام متغير البيئة
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
