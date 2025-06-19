# 🚢 TBS GROUP - Website Nhập Khẩu Chính Ngạch

Website chính thức của **TBS GROUP** - Đơn vị hàng đầu trong lĩnh vực dịch vụ nhập khẩu và logistics tại Việt Nam.

## 🌟 Giới thiệu

TBS GROUP chuyên cung cấp dịch vụ nhập khẩu hàng hóa từ Trung Quốc chính ngạch với hơn 8 năm kinh nghiệm. Chúng tôi cam kết mang đến cho khách hàng:

- ✅ **Dịch vụ chính ngạch 100%** - An toàn pháp lý
- ✅ **Phí ủy thác 1.5% - 3%** - Minh bạch, cạnh tranh
- ✅ **8000+ khách hàng** tin tưởng
- ✅ **200K+ đơn hàng** thành công
- ✅ **Hỗ trợ 24/7** - Tư vấn miễn phí

## 🎯 Dịch vụ chính

### 📦 Nhập khẩu & Logistics
- **Nhập khẩu chính ngạch** từ Trung Quốc
- **Gom hàng lẻ, ghép container** 
- **Vận chuyển quốc tế** đa phương thức
- **Đóng gói & bảo hiểm** chuyên nghiệp
- **Kho bãi Trung-Việt** hiện đại

### 💼 Tư vấn & Hỗ trợ  
- **Ủy thác xuất nhập khẩu**
- **Tư vấn pháp lý & thuế XNK**
- **Cảnh báo rủi ro XNK**
- **Kiểm tra nhà cung cấp**
- **Thanh toán hộ Trung Quốc**
- **Thông quan & chứng từ**

## 🛠 Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Node.js API Routes
- **Database:** Larksuite Base (via API)
- **Email:** Nodemailer
- **Deployment:** Vercel
- **Version Control:** Git + GitHub

## 📱 Features

### ✨ Core Features
- 🎨 **Responsive Design** - Mobile-first approach
- ⚡ **Performance Optimized** - Static generation + SSR
- 🔍 **SEO Friendly** - Meta tags và structured data
- 📧 **Newsletter System** - Tích hợp Larksuite Base
- 💬 **Contact Forms** - Email automation
- 🤖 **AI Chatbot** - Tư vấn thông minh

### 📄 Pages Structure
```
/ - Trang chủ
├── /gioi-thieu - Về TBS GROUP  
├── /dich-vu - Danh sách 11 dịch vụ
│   └── /dich-vu/[slug] - Chi tiết dịch vụ
├── /tin-tuc - Tin tức xuất nhập khẩu
├── /cau-chuyen-khach-hang - Success stories
│   └── /cau-chuyen-khach-hang/[slug] - Case studies
├── /tuyen-dung - Tuyển dụng
├── /lien-he - Liên hệ
└── /chinh-sach - Các chính sách
    ├── /chinh-sach/cookie
    ├── /chinh-sach/van-chuyen  
    ├── /chinh-sach/doi-tra
    └── /chinh-sach/dieu-khoan
```

## 🚀 Development

### Prerequisites
- Node.js 18+ 
- npm hoặc yarn

### Installation
```bash
# Clone repository
git clone https://github.com/[username]/tbs-group-website.git
cd tbs-group-website

# Install dependencies  
npm install

# Setup environment variables
cp .env.example .env.local
# Điền các biến môi trường cần thiết

# Run development server
npm run dev
```

### Build & Deploy
```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel --prod
```

## 📧 Environment Variables

Tạo file `.env.local`:

```env
# Larksuite Base API
NEXT_PUBLIC_LARK_APP_ID=your_app_id
NEXT_PUBLIC_LARK_APP_SECRET=your_app_secret
NEXT_PUBLIC_LARK_BASE_TOKEN=your_base_token  
NEXT_PUBLIC_LARK_TABLE_ID=your_table_id

# Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Other APIs
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
GEMINI_API_KEY=your_gemini_ai_key
```

## 📞 Liên hệ

- **🌐 Website:** [xuatnhapkhautbs.vn](https://xuatnhapkhautbs.vn)
- **📞 Hotline:** [0976 005 335](tel:+84976005335)
- **📧 Email:** [info@xuatnhapkhautbs.vn](mailto:info@xuatnhapkhautbs.vn)
- **💬 Zalo:** [Chat ngay](https://zalo.me/0976005335)

## 📄 License

© 2024 TBS GROUP. All rights reserved.

---

**Made with ❤️ by TBS GROUP Development Team** 