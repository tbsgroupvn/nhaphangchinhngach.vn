# Content Directory - TBS GROUP Website

## Giới thiệu

Thư mục `content/` chứa tất cả nội dung được quản lý bởi Netlify CMS. Các file được lưu trữ dưới dạng Markdown với frontmatter YAML.

## Cấu trúc thư mục

```
content/
├── services/           # Dịch vụ
├── news/              # Tin tức/bài viết
├── jobs/              # Tuyển dụng
├── customer-stories/  # Câu chuyện khách hàng
├── policies/          # Chính sách
├── pages/             # Trang tĩnh
└── settings/          # Cài đặt website
```

## Định dạng file

### Frontmatter (YAML)
Mỗi file bắt đầu với metadata trong khối `---`:

```yaml
---
title: "Tiêu đề"
description: "Mô tả ngắn"
date: 2024-12-01T10:00:00Z
status: "published"
---
```

### Content (Markdown)
Nội dung chính sử dụng Markdown syntax:

```markdown
# Heading 1
## Heading 2

- Danh sách
- Item 2

**Bold text** và *italic text*
```

## Qui tắc đặt tên file

- Dùng slug thân thiện SEO
- Không dấu tiếng Việt
- Dùng dấu gạch ngang (-) thay vì space
- Ví dụ: `nhap-khau-chinh-ngach.md`

## Quản lý bằng CMS

- Truy cập: `/admin/cms`
- Tạo/sửa/xóa content qua giao diện
- Tự động tạo file với format đúng
- Upload images vào `/public/images/`

## Lưu ý

- Không chỉnh sửa trực tiếp file trong thư mục này
- Sử dụng CMS để đảm bảo format đúng
- Backup thường xuyên qua Git 