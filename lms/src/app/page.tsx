import { AcademicCapIcon, BookOpenIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function LMSHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TBS Learning</h1>
                <p className="text-sm text-gray-600">Hệ thống đào tạo nội bộ</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Hệ thống đào tạo
              <span className="text-blue-600"> TBS GROUP</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Nền tảng học trực tuyến chuyên nghiệp dành cho nhân viên TBS GROUP. 
              Nâng cao kỹ năng và kiến thức về logistics và thương mại quốc tế.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
                Bắt đầu học ngay
              </button>
              <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-lg">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Được thiết kế đặc biệt cho các nhu cầu đào tạo chuyên nghiệp trong ngành logistics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={BookOpenIcon}
              title="Khóa học chuyên sâu"
              description="Nội dung được biên soạn bởi chuyên gia hàng đầu trong ngành"
            />
            <FeatureCard
              icon={UserGroupIcon}
              title="Học theo nhóm"
              description="Phân chia theo bộ phận để tối ưu hóa quá trình học tập"
            />
            <FeatureCard
              icon={ChartBarIcon}
              title="Theo dõi tiến độ"
              description="Dashboard chi tiết về quá trình học và kết quả đạt được"
            />
            <FeatureCard
              icon={AcademicCapIcon}
              title="Chứng chỉ"
              description="Cấp chứng chỉ hoàn thành được công nhận trong công ty"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <StatCard number="8+" label="Năm kinh nghiệm" />
            <StatCard number="1000+" label="Nhân viên đã đào tạo" />
            <StatCard number="50+" label="Khóa học chuyên nghiệp" />
            <StatCard number="95%" label="Tỷ lệ hài lòng" />
          </div>
        </div>
      </section>

      {/* Coming Soon Notice */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Sắp ra mắt!
            </h3>
            <p className="text-gray-600 mb-6">
              Hệ thống LMS của TBS GROUP đang trong giai đoạn phát triển cuối. 
              Chúng tôi sẽ sớm mang đến cho bạn trải nghiệm học tập tuyệt vời nhất.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium">
                📧 Liên hệ: <a href="mailto:hr@tbsgroup.com.vn" className="underline">hr@tbsgroup.com.vn</a>
              </p>
              <p className="text-blue-700 text-sm mt-2">
                Domain: daotao.nhapkhauchinhngach.vn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">TBS Learning</span>
            </div>
            <p className="text-gray-400 mb-4">
              Hệ thống đào tạo nội bộ TBS GROUP
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 TBS GROUP. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="text-center group">
      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
        <Icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
      </div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{number}</div>
      <div className="text-blue-100">{label}</div>
    </div>
  )
} 