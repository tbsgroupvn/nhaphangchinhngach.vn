# Hướng Dẫn Quản Lý Bài Viết Với Supabase

## 📋 Tổng Quan

Hệ thống CMS đã được tích hợp Supabase để quản lý bài viết một cách có hệ thống. Tất cả bài viết từ markdown files sẽ được đồng bộ vào database Supabase để:

- ✅ Quản lý tập trung
- ✅ Tìm kiếm nhanh chóng
- ✅ Phân quyền truy cập
- ✅ Theo dõi lượt xem
- ✅ SEO tối ưu

---

## 🚀 Bước 1: Setup Supabase Database

### 1.1. Chạy SQL Setup

1. Vào Supabase Dashboard: https://supabase.com/dashboard/project/ayeendyuwexxfcnvnroo
2. Click **SQL Editor** (sidebar bên trái)
3. Click **New Query**
4. Mở file `supabase-setup.sql` trong project
5. Copy **TOÀN BỘ** nội dung
6. Paste vào SQL Editor
7. Click **Run** (hoặc Ctrl+Enter)
8. Đợi ~10 giây

### 1.2. Verify Tables

Chạy query sau để kiểm tra:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Phải thấy các tables:
- ✅ `users`
- ✅ `posts`
- ✅ `services`
- ✅ `media_files`
- ✅ `roles`
- ✅ `permissions`

---

## 🔄 Bước 2: Đồng Bộ Bài Viết

### 2.1. Sync Tất Cả Bài Viết Từ Markdown

Sau khi deploy lên Netlify/Production, gọi API:

**Request:**
```bash
POST https://nhaphangchinhngach.vn/api/admin/sync-posts
Cookie: cms_token=<your-token>
```

**Hoặc dùng cURL:**
```bash
curl -X POST https://nhaphangchinhngach.vn/api/admin/sync-posts \
  -H "Cookie: cms_token=YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "synced": 5,
  "total": 5,
  "posts": [
    {
      "file": "2024-12-20-thue-suat-nhap-khau-moi-2024.md",
      "slug": "thue-suat-nhap-khau-moi-2024",
      "title": "Thuế suất nhập khẩu mới 2024..."
    }
  ]
}
```

### 2.2. Kiểm Tra Sync Status

**Request:**
```bash
GET https://nhaphangchinhngach.vn/api/admin/sync-posts
Cookie: cms_token=<your-token>
```

**Response:**
```json
{
  "success": true,
  "markdown_files": 5,
  "database_posts": 5,
  "needs_sync": false
}
```

---

## 📖 Bước 3: Sử Dụng API Posts

### 3.1. Lấy Danh Sách Bài Viết

**Endpoint:** `GET /api/posts`

**Query Parameters:**
- `status` - Trạng thái: `published`, `draft`, `archived` (default: `published`)
- `limit` - Số bài viết (default: `10`)
- `offset` - Bắt đầu từ vị trí (default: `0`)
- `category` - Lọc theo category (optional)
- `search` - Tìm kiếm theo title (optional)

**Ví dụ:**
```bash
# Lấy 10 bài viết mới nhất
GET /api/posts?status=published&limit=10

# Lấy bài viết theo category
GET /api/posts?category=chinh-sach-moi&limit=5

# Tìm kiếm bài viết
GET /api/posts?search=thuế&limit=20

# Phân trang
GET /api/posts?limit=10&offset=10  # Trang 2
```

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "id": "uuid-here",
      "title": "Thuế suất nhập khẩu mới 2024",
      "slug": "thue-suat-nhap-khau-moi-2024",
      "excerpt": "Chính phủ chính thức ban hành...",
      "content": "## Tóm tắt chính sách mới...",
      "featured_image": "/images/news/thue-nhap-khau-2024.jpg",
      "category": "chinh-sach-moi",
      "tags": ["thuế nhập khẩu", "chính sách 2024"],
      "status": "published",
      "published_at": "2024-12-20T10:00:00Z",
      "views": 2451,
      "created_at": "2024-12-20T10:00:00Z",
      "updated_at": "2025-01-01T05:00:00Z"
    }
  ],
  "total": 5,
  "limit": 10,
  "offset": 0
}
```

### 3.2. Lấy Chi Tiết Một Bài Viết

**Endpoint:** `GET /api/posts/[slug]`

**Ví dụ:**
```bash
GET /api/posts/thue-suat-nhap-khau-moi-2024
```

**Response:**
```json
{
  "success": true,
  "post": {
    "id": "uuid-here",
    "title": "Thuế suất nhập khẩu mới 2024",
    "slug": "thue-suat-nhap-khau-moi-2024",
    "content": "Full markdown content...",
    "views": 2452,
    "seo_title": "Thuế suất nhập khẩu mới 2024",
    "seo_description": "Chính phủ chính thức ban hành...",
    "seo_keywords": ["thuế nhập khẩu", "chính sách 2024"]
  }
}
```

**Lưu ý:** Mỗi lần gọi API này, `views` sẽ tự động +1!

---

## 🔒 Bước 4: Bảo Mật (Row Level Security)

Supabase đã được cấu hình Row Level Security (RLS) policies:

### Posts Table Policies:

1. **Public Read** - Ai cũng có thể đọc posts có `status = 'published'`
2. **Admin Write** - Chỉ users có role `super_admin` hoặc `admin` mới tạo/sửa/xóa posts
3. **Author Edit** - Tác giả có thể sửa bài viết của mình

### Kiểm tra Policies:

```sql
SELECT * FROM pg_policies WHERE tablename = 'posts';
```

---

## 📊 Bước 5: Quản Lý Bài Viết Trong Admin Panel

### 5.1. Login vào CMS

1. Vào: https://nhaphangchinhngach.vn/cms-login
2. Username: `admin`
3. Password: `Anhcanem2015@`

### 5.2. Sync Bài Viết

Sau khi login, có thể gọi sync API từ browser console:

```javascript
fetch('/api/admin/sync-posts', {
  method: 'POST',
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log('Synced:', data))
```

### 5.3. Xem Bài Viết

```javascript
fetch('/api/posts?limit=100')
  .then(res => res.json())
  .then(data => console.log('Posts:', data.posts))
```

---

## 🛠️ Bước 6: Tích Hợp Vào Website

### 6.1. Sử Dụng Trong React Components

```typescript
// src/app/news/page.tsx
'use client'

import { useEffect, useState } from 'react'

export default function NewsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts?status=published&limit=10')
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Đang tải...</div>

  return (
    <div>
      <h1>Tin tức mới nhất</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <a href={`/news/${post.slug}`}>Đọc thêm</a>
        </article>
      ))}
    </div>
  )
}
```

### 6.2. Trang Chi Tiết Bài Viết

```typescript
// src/app/news/[slug]/page.tsx
export default async function NewsDetailPage({
  params
}: {
  params: { slug: string }
}) {
  const res = await fetch(
    `https://nhaphangchinhngach.vn/api/posts/${params.slug}`,
    { next: { revalidate: 60 } } // Cache 60s
  )

  const { post } = await res.json()

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <p>Lượt xem: {post.views}</p>
    </article>
  )
}
```

---

## 📝 Bước 7: Thêm Bài Viết Mới

### 7.1. Cách 1: Thêm Markdown File

1. Tạo file mới trong `content/news/`
2. Format: `YYYY-MM-DD-ten-bai-viet.md`
3. Thêm frontmatter:

```markdown
---
title: Tiêu đề bài viết
description: Mô tả ngắn gọn
image: /images/news/image.jpg
date: '2025-01-01T10:00:00Z'
author: TBS GROUP
category: tin-tuc
tags:
  - tag1
  - tag2
featured: true
status: published
---

## Nội dung bài viết

Content ở đây...
```

4. Chạy sync: `POST /api/admin/sync-posts`

### 7.2. Cách 2: Thêm Trực Tiếp Vào Supabase

Vào Supabase Dashboard → Table Editor → `posts` → Insert row

Hoặc dùng SQL:

```sql
INSERT INTO posts (
  title, slug, excerpt, content, category,
  tags, status, author_id
) VALUES (
  'Tiêu đề bài viết',
  'tieu-de-bai-viet',
  'Mô tả ngắn',
  'Nội dung đầy đủ',
  'tin-tuc',
  ARRAY['tag1', 'tag2'],
  'published',
  (SELECT id FROM users WHERE username = 'admin')
);
```

---

## 🔍 Troubleshooting

### Lỗi: "Unauthorized" khi gọi sync API

**Nguyên nhân:** Chưa login hoặc token hết hạn

**Giải pháp:**
1. Login lại tại `/cms-login`
2. Kiểm tra cookie `cms_token` trong DevTools

### Lỗi: "Content directory not found"

**Nguyên nhân:** Thư mục `content/news/` không tồn tại

**Giải pháp:**
```bash
mkdir -p content/news
```

### Lỗi: "No admin user found"

**Nguyên nhân:** Chưa chạy `supabase-setup.sql`

**Giải pháp:**
1. Vào Supabase SQL Editor
2. Run `supabase-setup.sql`
3. Verify:
```sql
SELECT * FROM users WHERE role = 'super_admin';
```

---

## 📞 Hỗ Trợ

- **Email**: info@xuatnhapkhautbs.vn
- **Hotline**: 0976 005 335
- **Documentation**: Xem file `SUPABASE_CMS_SETUP.md`

---

**✅ HOÀN THÀNH!**

Bây giờ bạn có thể:
- ✨ Quản lý bài viết tập trung trong Supabase
- 🔄 Sync markdown files tự động
- 📊 Theo dõi lượt xem
- 🔒 Bảo mật với RLS
- 🚀 Tích hợp dễ dàng vào website
