'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  FaSave, FaEye, FaRobot, FaImage, FaTags, FaCog, 
  FaCalendar, FaGlobe, FaSearch, FaStar
} from 'react-icons/fa';

// Dynamic import for rich text editor (prevents SSR issues)
const RichTextEditor = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
});

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: 'draft' | 'review' | 'published';
  publishAt?: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage?: File;
}

export default function CreatePostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState<PostForm>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    featured: false,
    status: 'draft',
    metaTitle: '',
    metaDescription: ''
  });

  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');

  const categories = [
    { value: 'tin-tuc-nganh', label: 'Tin tức ngành', icon: '📈' },
    { value: 'tin-noi-bo', label: 'Tin nội bộ', icon: '🏢' },
    { value: 'cam-nang-xnk', label: 'Cẩm nang XNK', icon: '📚' },
    { value: 'cau-chuyen-khach-hang', label: 'Câu chuyện KH', icon: '💬' },
    { value: 'hoat-dong-cong-ty', label: 'Hoạt động công ty', icon: '🎯' },
    { value: 'tuyen-dung', label: 'Tuyển dụng', icon: '👥' }
  ];

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      metaTitle: title.length > 0 ? title : prev.metaTitle
    }));
  };

  const handleAddTag = () => {
    if (newTag && !form.tags.includes(newTag)) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAIAssist = async (type: 'title' | 'excerpt' | 'content' | 'tags') => {
    setAiLoading(true);
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      switch (type) {
        case 'title':
          const suggestions = [
            'Hướng dẫn xuất nhập khẩu hiệu quả 2024',
            'Bí quyết tiết kiệm chi phí vận chuyển từ Trung Quốc',
            'Những thay đổi quan trọng trong quy định hải quan'
          ];
          const selectedTitle = suggestions[Math.floor(Math.random() * suggestions.length)];
          handleTitleChange(selectedTitle);
          break;
          
        case 'excerpt':
          setForm(prev => ({
            ...prev,
            excerpt: 'Khám phá những xu hướng mới nhất trong ngành logistics và xuất nhập khẩu. Chia sẻ kinh nghiệm thực tế từ chuyên gia TBS GROUP...'
          }));
          break;
          
        case 'content':
          setForm(prev => ({
            ...prev,
            content: `<h2>Giới thiệu</h2><p>Trong bối cảnh thương mại quốc tế ngày càng phát triển, việc nắm vững quy trình xuất nhập khẩu trở nên quan trọng hơn bao giờ hết.</p><h2>Các bước thực hiện</h2><p>1. Chuẩn bị hồ sơ pháp lý<br>2. Tìm kiếm đối tác uy tín<br>3. Thực hiện thủ tục hải quan</p><h2>Kết luận</h2><p>TBS GROUP cam kết đồng hành cùng doanh nghiệp trong hành trình phát triển kinh doanh quốc tế.</p>`
          }));
          break;
          
        case 'tags':
          setForm(prev => ({
            ...prev,
            tags: ['xuất nhập khẩu', 'logistics', 'hải quan', 'thương mại quốc tế']
          }));
          break;
      }
    } catch (error) {
      console.error('AI assist error:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async (status: 'draft' | 'review' | 'published') => {
    setLoading(true);
    try {
      // Validate required fields
      if (!form.title || !form.content || !form.category) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const postData = {
        ...form,
        status,
        publishAt: status === 'published' ? new Date().toISOString() : form.publishAt
      };

      console.log('Saving post:', postData);
      
      // Redirect back to posts list
      router.push('/admin/posts');
    } catch (error) {
      console.error('Save error:', error);
      alert('Có lỗi xảy ra khi lưu bài viết');
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo bài viết mới</h1>
          <p className="text-gray-600 mt-1">Soạn thảo và xuất bản nội dung chất lượng cao</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Lưu nháp
          </button>
          
          <button
            onClick={() => handleSave('review')}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Gửi review
          </button>
          
          <button
            onClick={() => handleSave('published')}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            <FaSave />
            {loading ? 'Đang xuất bản...' : 'Xuất bản'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'content', label: 'Nội dung', icon: FaEye },
                { id: 'seo', label: 'SEO', icon: FaSearch },
                { id: 'settings', label: 'Cài đặt', icon: FaCog }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tiêu đề bài viết *
                  </label>
                  <button
                    onClick={() => handleAIAssist('title')}
                    disabled={aiLoading}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
                  >
                    <FaRobot />
                    AI gợi ý
                  </button>
                </div>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Nhập tiêu đề hấp dẫn..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
                />
                {form.slug && (
                  <p className="text-sm text-gray-500 mt-1">
                    URL: <span className="text-blue-600">/{form.slug}</span>
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả ngắn
                  </label>
                  <button
                    onClick={() => handleAIAssist('excerpt')}
                    disabled={aiLoading}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
                  >
                    <FaRobot />
                    AI gợi ý
                  </button>
                </div>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Tóm tắt nội dung bài viết (150-200 ký tự)..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {form.excerpt.length}/200 ký tự
                </p>
              </div>

              {/* Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nội dung bài viết *
                  </label>
                  <button
                    onClick={() => handleAIAssist('content')}
                    disabled={aiLoading}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
                  >
                    <FaRobot />
                    AI tạo nội dung
                  </button>
                </div>
                
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <RichTextEditor
                    value={form.content}
                    onChange={(content) => setForm(prev => ({ ...prev, content }))}
                    modules={quillModules}
                    placeholder="Bắt đầu viết nội dung của bạn..."
                    style={{ minHeight: '400px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Tối ưu SEO</h3>
                <p className="text-sm text-blue-700">
                  Điền đầy đủ thông tin SEO để tăng thứ hạng trên Google và thu hút nhiều traffic hơn.
                </p>
              </div>

              {/* Meta Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề SEO (Meta Title)
                </label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => setForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="Tiêu đề hiển thị trên Google (50-60 ký tự)..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {form.metaTitle.length}/60 ký tự
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả SEO (Meta Description)
                </label>
                <textarea
                  value={form.metaDescription}
                  onChange={(e) => setForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Mô tả hiển thị trên Google (150-160 ký tự)..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {form.metaDescription.length}/160 ký tự
                </p>
              </div>

              {/* URL Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    nhaphangchinhngach.vn/tin-tuc/
                  </span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              {/* SEO Preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Xem trước trên Google</h3>
                <div className="bg-white border rounded p-3">
                  <h4 className="text-lg text-blue-600 cursor-pointer hover:underline">
                    {form.metaTitle || form.title || 'Tiêu đề bài viết'}
                  </h4>
                  <p className="text-green-700 text-sm">
                    nhaphangchinhngach.vn/tin-tuc/{form.slug || 'url-bai-viet'}
                  </p>
                  <p className="text-gray-700 text-sm mt-1">
                    {form.metaDescription || form.excerpt || 'Mô tả bài viết sẽ hiển thị ở đây...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh đại diện
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Chọn ảnh từ máy tính
                      </span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setForm(prev => ({ ...prev, featuredImage: e.target.files![0] }));
                          }
                        }}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, WebP tối đa 2MB. Khuyên dùng 1200x630px
                    </p>
                  </div>
                </div>
              </div>

              {/* Publish Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lên lịch xuất bản
                </label>
                <input
                  type="datetime-local"
                  value={form.publishAt}
                  onChange={(e) => setForm(prev => ({ ...prev, publishAt: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Featured Post */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Bài viết nổi bật
                  </span>
                  <FaStar className="ml-1 text-yellow-500" />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Hiển thị trong slider trang chủ và được ưu tiên
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Danh mục</h3>
            <select
              value={form.category}
              onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Chọn danh mục *</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Tags</h3>
              <button
                onClick={() => handleAIAssist('tags')}
                disabled={aiLoading}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              >
                <FaRobot />
                AI
              </button>
            </div>
            
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Thêm tag..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Thêm
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  <FaTags className="text-xs" />
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Thống kê nhanh</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Số từ:</span>
                <span className="font-medium">
                  {form.content.replace(/<[^>]*>/g, '').split(' ').filter(word => word.length > 0).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian đọc:</span>
                <span className="font-medium">
                  {Math.max(1, Math.ceil(form.content.replace(/<[^>]*>/g, '').split(' ').length / 200))} phút
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái SEO:</span>
                <span className={`font-medium ${
                  form.metaTitle && form.metaDescription ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {form.metaTitle && form.metaDescription ? 'Tốt' : 'Cần cải thiện'}
                </span>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">💡 Mẹo viết bài</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Tiêu đề nên có 50-60 ký tự</li>
              <li>• Sử dụng từ khóa chính trong tiêu đề</li>
              <li>• Mô tả ngắn 150-200 ký tự</li>
              <li>• Thêm ảnh để tăng engagement</li>
              <li>• Sử dụng heading (H2, H3) hợp lý</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 