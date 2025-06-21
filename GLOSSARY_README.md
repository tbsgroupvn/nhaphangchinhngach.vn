# Từ điển Thuật ngữ Hải quan & XNK - Hướng dẫn sử dụng

## 📖 Giới thiệu

Tính năng **Từ điển Thuật ngữ Hải quan & XNK** cho phép khách hàng tra cứu nhanh các thuật ngữ chuyên ngành về hải quan, xuất nhập khẩu, logistics và thương mại quốc tế.

## 🔗 Truy cập

- **URL:** `/tu-dien-thuat-ngu`
- **Navigation:** Tin tức > Từ điển thuật ngữ
- **Mobile-friendly:** Có hỗ trợ responsive design

## ✨ Tính năng

### 1. Tìm kiếm thời gian thực
- Tìm kiếm theo thuật ngữ tiếng Việt
- Tìm kiếm theo thuật ngữ tiếng Anh
- Tìm kiếm trong mô tả/định nghĩa
- Không phân biệt hoa thường
- Hiển thị số lượng kết quả tìm thấy

### 2. Giao diện thân thiện
- Design responsive cho mọi thiết bị
- Breadcrumb navigation rõ ràng
- Card layout dễ đọc với hover effects
- Typography tối ưu cho khả năng đọc

### 3. SEO tối ưu
- Meta title và description
- Open Graph tags
- Keywords chuyên ngành
- Structured data markup

## 📊 Dữ liệu

Dữ liệu thuật ngữ được lưu trữ trong file `src/data/glossary.json` với cấu trúc:

```json
[
  {
    "term": "Thuật ngữ tiếng Việt",
    "english": "English Term",
    "description": "Định nghĩa chi tiết và giải thích..."
  }
]
```

### Hiện tại có sẵn:
- **50+ thuật ngữ** cơ bản và nâng cao
- Các lĩnh vực: Hải quan, Logistics, Incoterms, Thương mại quốc tế
- Thuật ngữ phổ biến: HS Code, C/O, Bill of Lading, FOB, CIF, VAT, etc.

## 🛠️ Cách thêm thuật ngữ mới

### Bước 1: Mở file dữ liệu
```bash
src/data/glossary.json
```

### Bước 2: Thêm object mới vào mảng
```json
{
  "term": "Tên thuật ngữ tiếng Việt",
  "english": "English Term/Abbreviation", 
  "description": "Định nghĩa chi tiết. Nên bao gồm: ý nghĩa, cách sử dụng, ví dụ thực tế."
}
```

### Bước 3: Lưu file và rebuild
```bash
npm run build
# hoặc 
npm run dev
```

### ✅ Lưu ý khi thêm thuật ngữ:

1. **Thuật ngữ tiếng Việt:**
   - Viết hoa chữ cái đầu
   - Sử dụng tên phổ biến nhất
   - Có thể gồm ký hiệu/viết tắt

2. **Thuật ngữ tiếng Anh:**
   - Có thể là tên đầy đủ hoặc viết tắt
   - Ví dụ: "Free On Board" hoặc "FOB"

3. **Mô tả/Định nghĩa:**
   - Rõ ràng, dễ hiểu cho người không chuyên
   - Bao gồm ngữ cảnh sử dụng
   - Thêm ví dụ thực tế nếu cần
   - Độ dài 1-3 câu
   - Tránh sử dụng thuật ngữ khó hiểu khác

## 📁 Cấu trúc file

```
src/
├── app/
│   └── tu-dien-thuat-ngu/
│       └── page.tsx              # Component chính
├── data/
│   └── glossary.json            # Dữ liệu thuật ngữ
└── components/
    └── Navbar.tsx               # Navigation menu (đã thêm link)
```

## 🎯 Ví dụ thêm thuật ngữ mới

```json
{
  "term": "WMS",
  "english": "Warehouse Management System",
  "description": "Hệ thống quản lý kho bãi tự động, giúp theo dõi vị trí, số lượng và trạng thái hàng hóa trong kho. Cho phép tối ưu hóa quy trình nhập/xuất và giảm thiểu sai sót."
},
{
  "term": "Container Seal",
  "english": "Container Seal",
  "description": "Niêm phong container bằng ổ khóa số hoặc dây niêm phong để đảm bảo an toàn hàng hóa. Chỉ được phá niêm tại điểm đích hoặc khi kiểm tra hải quan."
}
```

## 🔧 Tùy chỉnh nâng cao

### Thay đổi số lượng hiển thị
Trong `page.tsx`, tìm section "Statistics":
```typescript
<span className="font-semibold text-blue-600">{glossaryData.length}</span> thuật ngữ
```

### Thêm category/phân loại
Nếu muốn thêm phân loại thuật ngữ, có thể mở rộng data structure:
```json
{
  "term": "HS Code",
  "english": "Harmonized System Code", 
  "description": "...",
  "category": "Hải quan",
  "difficulty": "Cơ bản"
}
```

### Cải thiện tìm kiếm
Có thể thêm fuzzy search hoặc highlight keywords trong file `page.tsx`.

## 📱 Responsive Design

- **Desktop:** Layout 2 cột với sidebar
- **Tablet:** Layout 1 cột với navigation rõ ràng  
- **Mobile:** Optimized cho touch, search box lớn

## 🚀 Performance

- **Client-side rendering** cho search tức thì
- **useMemo** để tối ưu filtering
- **Lazy loading** sẵn sàng cho 500+ thuật ngữ

## 📈 Analytics & Tracking

Có thể thêm tracking cho:
- Keywords tìm kiếm phổ biến
- Thuật ngữ được xem nhiều nhất
- User behavior trên trang

## 🔗 Liên kết nội bộ

Trang từ điển đã được tích hợp vào:
- ✅ Navigation menu chính
- ✅ Dropdown "Tin tức"
- ✅ Mobile navigation
- ✅ Breadcrumb navigation

## 📞 Hỗ trợ

Nếu cần hỗ trợ kỹ thuật hoặc có câu hỏi về việc thêm thuật ngữ mới, vui lòng liên hệ team development.

---

**Cập nhật cuối:** Tháng 1/2025  
**Phiên bản:** 1.0.0  
**Thuật ngữ hiện có:** 50+ terms 