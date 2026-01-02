-- =====================================================
-- Migration: Seed Initial Data
-- Version: 20260102080000
-- Description: Insert default data for initial setup
-- Author: TBS Group Backend Team
-- =====================================================

-- =====================================================
-- DEFAULT ADMIN USER
-- =====================================================
-- Password: Admin@123456 (bcrypt hash)
-- IMPORTANT: Change this password after first login!

INSERT INTO public.users (
  username,
  email,
  full_name,
  phone,
  password_hash,
  role,
  status,
  email_verified,
  created_at,
  updated_at
) VALUES (
  'admin',
  'admin@tbsgroup.vn',
  'Administrator',
  '0909123456',
  '$2a$10$YourBcryptHashHere', -- You'll need to generate this with bcryptjs
  'super_admin',
  'active',
  TRUE,
  NOW(),
  NOW()
) ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- SITE SETTINGS
-- =====================================================

INSERT INTO public.site_settings (setting_key, setting_value, description, is_public) VALUES
  -- Site Identity
  ('site_name', '"TBS GROUP - Nhập Hàng Chính Ngạch"', 'Tên website', TRUE),
  ('site_tagline', '"Chuyên gia xuất nhập khẩu hàng đầu Việt Nam"', 'Slogan website', TRUE),
  ('site_description', '"TBS Group - Đơn vị cung cấp dịch vụ xuất nhập khẩu uy tín, chuyên nghiệp với hơn 10 năm kinh nghiệm."', 'Mô tả website', TRUE),
  ('site_url', '"https://nhaphangchinhngach.vn"', 'URL chính thức', TRUE),
  ('site_logo', '"/images/logo.png"', 'Logo website', TRUE),
  ('site_favicon', '"/favicon.ico"', 'Favicon', TRUE),

  -- Theme & Branding
  ('primary_color', '"#dc2626"', 'Màu chủ đạo (đỏ)', TRUE),
  ('secondary_color', '"#2563eb"', 'Màu phụ (xanh dương)', TRUE),
  ('accent_color', '"#f59e0b"', 'Màu nhấn (cam)', TRUE),

  -- Contact Information
  ('company_name', '"CÔNG TY TNHH TBS GROUP"', 'Tên công ty', TRUE),
  ('company_address', '"123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh"', 'Địa chỉ công ty', TRUE),
  ('company_phone', '"1900 xxxx"', 'Hotline', TRUE),
  ('company_email', '"info@xuatnhapkhautbs.vn"', 'Email liên hệ', TRUE),
  ('company_tax_code', '"0123456789"', 'Mã số thuế', TRUE),

  -- Business Hours
  ('business_hours', '{
    "monday_friday": "8:00 - 17:30",
    "saturday": "8:00 - 12:00",
    "sunday": "Closed"
  }', 'Giờ làm việc', TRUE),

  -- Social Media
  ('social_facebook', '"https://facebook.com/tbsgroup"', 'Facebook URL', TRUE),
  ('social_linkedin', '"https://linkedin.com/company/tbsgroup"', 'LinkedIn URL', TRUE),
  ('social_youtube', '"https://youtube.com/@tbsgroup"', 'YouTube URL', TRUE),
  ('social_zalo', '"https://zalo.me/tbsgroup"', 'Zalo URL', TRUE),

  -- SEO Settings
  ('seo_default_title', '"TBS Group - Nhập Khẩu Chính Ngạch Uy Tín"', 'Tiêu đề SEO mặc định', TRUE),
  ('seo_default_description', '"Dịch vụ xuất nhập khẩu chính ngạch, uy tín, chuyên nghiệp. Tư vấn miễn phí, báo giá nhanh chóng."', 'Mô tả SEO mặc định', TRUE),
  ('seo_keywords', '["xuất nhập khẩu", "nhập khẩu chính ngạch", "tbs group", "customs clearance", "import export"]', 'Từ khóa SEO', TRUE),

  -- Analytics
  ('google_analytics_id', '""', 'Google Analytics ID', FALSE),
  ('google_tag_manager_id', '""', 'Google Tag Manager ID', FALSE),
  ('facebook_pixel_id', '""', 'Facebook Pixel ID', FALSE),

  -- Email Settings (not public)
  ('smtp_host', '"smtp.gmail.com"', 'SMTP Host', FALSE),
  ('smtp_port', '587', 'SMTP Port', FALSE),
  ('smtp_user', '""', 'SMTP Username', FALSE),
  ('smtp_from_email', '"noreply@tbsgroup.vn"', 'From Email', FALSE),
  ('smtp_from_name', '"TBS Group"', 'From Name', FALSE),

  -- API Keys (not public)
  ('google_drive_enabled', 'false', 'Enable Google Drive integration', FALSE),
  ('newsletter_api_enabled', 'true', 'Enable newsletter API', FALSE),

  -- Features
  ('enable_contact_form', 'true', 'Bật form liên hệ', TRUE),
  ('enable_newsletter', 'true', 'Bật newsletter', TRUE),
  ('enable_jobs', 'true', 'Bật tuyển dụng', TRUE),
  ('enable_blog', 'true', 'Bật blog/tin tức', TRUE),

  -- Maintenance
  ('maintenance_mode', 'false', 'Chế độ bảo trì', FALSE),
  ('maintenance_message', '"Website đang được bảo trì. Vui lòng quay lại sau."', 'Thông báo bảo trì', FALSE)

ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description,
  is_public = EXCLUDED.is_public,
  updated_at = NOW();

-- =====================================================
-- DEFAULT FOLDERS
-- =====================================================

INSERT INTO public.folders (name, parent_id, description) VALUES
  ('Images', NULL, 'Thư mục hình ảnh'),
  ('Documents', NULL, 'Thư mục tài liệu'),
  ('Videos', NULL, 'Thư mục video'),
  ('Uploads', NULL, 'Thư mục tải lên')
ON CONFLICT DO NOTHING;

-- =====================================================
-- SAMPLE SERVICES
-- =====================================================

INSERT INTO public.services (
  title,
  slug,
  description,
  content,
  icon,
  price_text,
  features,
  order_index,
  status,
  seo_title,
  seo_description
) VALUES
  (
    'Nhập Khẩu Chính Ngạch',
    'nhap-khau-chinh-ngach',
    'Dịch vụ nhập khẩu hàng hóa chính ngạch, đầy đủ giấy tờ, hợp pháp theo quy định.',
    '<h2>Nhập Khẩu Chính Ngạch</h2><p>Chúng tôi cung cấp dịch vụ nhập khẩu chính ngạch toàn diện, đảm bảo hàng hóa của bạn được thông quan nhanh chóng và hợp pháp.</p>',
    'truck',
    'Liên hệ báo giá',
    '["Tư vấn miễn phí", "Thông quan nhanh chóng", "Giấy tờ đầy đủ", "Bảo hiểm hàng hóa", "Vận chuyển door-to-door"]',
    1,
    'active',
    'Nhập Khẩu Chính Ngạch - TBS Group',
    'Dịch vụ nhập khẩu chính ngạch uy tín, nhanh chóng, giấy tờ đầy đủ theo quy định pháp luật.'
  ),
  (
    'Xuất Khẩu Ký Gửi',
    'xuat-khau-ky-gui',
    'Hỗ trợ doanh nghiệp xuất khẩu hàng hóa ra thị trường quốc tế.',
    '<h2>Xuất Khẩu Ký Gửi</h2><p>Dịch vụ xuất khẩu ký gửi giúp bạn tiếp cận thị trường quốc tế dễ dàng hơn.</p>',
    'plane',
    'Từ 500.000đ',
    '["Tìm kiếm đối tác", "Xử lý giấy tờ", "Vận chuyển quốc tế", "Thanh toán quốc tế"]',
    2,
    'active',
    'Xuất Khẩu Ký Gửi - TBS Group',
    'Dịch vụ xuất khẩu ký gửi chuyên nghiệp, hỗ trợ doanh nghiệp Việt Nam vươn ra thế giới.'
  ),
  (
    'Tư Vấn Pháp Lý & Thuế',
    'tu-van-phap-ly-thue',
    'Tư vấn về pháp luật xuất nhập khẩu, thủ tục hải quan, và thuế.',
    '<h2>Tư Vấn Pháp Lý & Thuế</h2><p>Đội ngũ chuyên gia giàu kinh nghiệm sẵn sàng tư vấn mọi vấn đề pháp lý liên quan đến xuất nhập khẩu.</p>',
    'document',
    'Liên hệ',
    '["Tư vấn miễn phí", "Giải quyết tranh chấp", "Tối ưu chi phí thuế", "Cập nhật chính sách mới"]',
    3,
    'active',
    'Tư Vấn Pháp Lý Xuất Nhập Khẩu - TBS Group',
    'Tư vấn chuyên sâu về pháp luật, thủ tục hải quan, và tối ưu hóa thuế xuất nhập khẩu.'
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SAMPLE BLOG POST
-- =====================================================

INSERT INTO public.posts (
  title,
  slug,
  excerpt,
  content,
  category,
  tags,
  status,
  published_at,
  seo_title,
  seo_description,
  seo_keywords
) VALUES
  (
    'Hướng Dẫn Nhập Khẩu Hàng Hóa Chính Ngạch Cho Người Mới Bắt Đầu',
    'huong-dan-nhap-khau-hang-hoa-chinh-ngach-cho-nguoi-moi-bat-dau',
    'Bài viết hướng dẫn chi tiết các bước nhập khẩu hàng hóa chính ngạch tại Việt Nam dành cho người mới bắt đầu.',
    '<h2>Giới Thiệu</h2><p>Nhập khẩu chính ngạch là con đường hợp pháp và an toàn nhất để đưa hàng hóa vào Việt Nam...</p>',
    'cam-nang-xnk',
    ARRAY['nhập khẩu', 'chính ngạch', 'hướng dẫn', 'thủ tục hải quan'],
    'published',
    NOW(),
    'Hướng Dẫn Nhập Khẩu Chính Ngạch Từ A-Z',
    'Hướng dẫn chi tiết quy trình nhập khẩu hàng hóa chính ngạch tại Việt Nam, từ chuẩn bị giấy tờ đến thông quan.',
    ARRAY['nhập khẩu chính ngạch', 'thủ tục hải quan', 'hướng dẫn nhập khẩu']
  )
ON CONFLICT (slug) DO NOTHING;

-- Success notification
DO $$
BEGIN
  RAISE NOTICE '✓ Initial data seeded successfully';
  RAISE NOTICE '';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '  - Default admin user (username: admin)';
  RAISE NOTICE '  - Site settings and configuration';
  RAISE NOTICE '  - Default folder structure';
  RAISE NOTICE '  - Sample services';
  RAISE NOTICE '  - Sample blog post';
  RAISE NOTICE '';
  RAISE NOTICE 'IMPORTANT:';
  RAISE NOTICE '  - Change default admin password immediately!';
  RAISE NOTICE '  - Update site settings with your actual information';
  RAISE NOTICE '  - Configure SMTP settings for email functionality';
  RAISE NOTICE '  - Add your Google Analytics ID if needed';
END $$;
