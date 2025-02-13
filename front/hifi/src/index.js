import React from 'react';
import ReactDOM from 'react-dom/client'; // تم تغيير الاستيراد
import App from './App.jsx'
import './index.css'; // تأكد من استيراد ملف CSS هنا

// استخدام createRoot بدلاً من render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);