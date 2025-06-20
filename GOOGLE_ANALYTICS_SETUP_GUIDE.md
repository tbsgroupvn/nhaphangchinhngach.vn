# 📊 Google Analytics 4 Setup Guide - Real Traffic Data

## Tổng quan
Hướng dẫn tích hợp Google Analytics 4 API để hiển thị dữ liệu traffic thực tế trên dashboard admin TBS GROUP.

## 🎯 Kết quả sau khi setup

**Trước:**
```
📊 Lượt xem hôm nay: 287 (Dữ liệu mô phỏng)
👥 Online ngay bây giờ: 12 (Mô phỏng)
```

**Sau:**
```
📊 Lượt xem hôm nay: 1,243 (Google Analytics)
👥 Online ngay bây giờ: 18 (Real-time GA)
✅ Đang sử dụng dữ liệu thực từ Google Analytics
```

## 🛠️ Bước 1: Setup Google Cloud Project

### 1.1. Tạo Google Cloud Project
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới: **"TBS GROUP Analytics"**
3. Ghi nhớ **Project ID**

### 1.2. Enable Google Analytics Data API
1. Vào **APIs & Services** > **Library**
2. Tìm kiếm **"Google Analytics Data API"**
3. Click **Enable**

### 1.3. Tạo Service Account
1. Vào **IAM & Admin** > **Service Accounts**
2. Click **+ CREATE SERVICE ACCOUNT**
3. Điền thông tin:
   ```
   Service account name: tbs-group-analytics
   Service account ID: tbs-group-analytics
   Description: Service account for TBS GROUP website analytics
   ```
4. Click **CREATE AND CONTINUE**
5. Skip **Grant access** và **Grant users access**
6. Click **DONE**

### 1.4. Tạo Service Account Key
1. Click vào service account vừa tạo
2. Vào tab **Keys**
3. Click **ADD KEY** > **Create new key**
4. Chọn **JSON** format
5. Click **CREATE** → File JSON sẽ được download

## 🔗 Bước 2: Cấu hình Google Analytics

### 2.1. Lấy GA4 Property ID
1. Truy cập [Google Analytics](https://analytics.google.com/)
2. Chọn property website TBS GROUP
3. Vào **Admin** (⚙️) ở góc dưới trái
4. Trong cột **Property**, click **Property details**
5. Copy **PROPERTY ID** (dạng: `123456789`)

### 2.2. Cấp quyền cho Service Account
1. Trong GA4, vào **Admin** > **Property access management**
2. Click **+** (Add users)
3. Nhập **email của service account** (trong file JSON: `client_email`)
4. Chọn role: **Viewer**
5. Click **Add**

## 📁 Bước 3: Cấu hình Server

### 3.1. Environment Variables

**Production (Vercel/Netlify):**
```env
GA4_PROPERTY_ID=123456789
GOOGLE_APPLICATION_CREDENTIALS=/var/task/credentials/ga-service-account.json
```

**Development (.env.local):**
```env
GA4_PROPERTY_ID=123456789
GOOGLE_APPLICATION_CREDENTIALS=./credentials/ga-service-account.json
```

## 🧪 Testing & Verification

### Test API Endpoints
```bash
# Test traffic data API
curl http://localhost:3000/api/analytics/traffic?days=7

# Test real-time data API
curl http://localhost:3000/api/analytics/realtime
```

### Expected Dashboard
```
✅ Đang sử dụng dữ liệu thực từ Google Analytics [LIVE DATA]

📊 Lượt xem hôm nay: 1,847 (Google Analytics)
👥 Online ngay bây giờ: 23 (Real-time GA)
```

**Kết quả cuối cùng: Dashboard hiển thị traffic data THỰC TẾ từ Google Analytics! 🚀** 