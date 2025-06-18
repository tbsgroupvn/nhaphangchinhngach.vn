export default function JobsSection() {
  const jobsData = [
    {
      id: 1,
      title: "Chuyên viên Xuất Nhập Khẩu",
      department: "Phòng Kinh doanh",
      location: "Hà Nội",
      type: "Toàn thời gian",
      salary: "15-25 triệu",
      experience: "2-3 năm",
      icon: "📋",
      requirements: [
        "Tốt nghiệp ĐH chuyên ngành Ngoại thương, Kinh tế",
        "Có kinh nghiệm 2-3 năm trong lĩnh vực XNK",
        "Tiếng Trung giao tiếp tốt là ưu tiên",
        "Thành thạo MS Office, đặc biệt Excel"
      ],
      benefits: [
        "Lương thỏa thuận + thưởng KPI",
        "Bảo hiểm đầy đủ theo quy định",
        "Đào tạo chuyên sâu về quy trình XNK",
        "Môi trường làm việc chuyên nghiệp"
      ]
    },
    {
      id: 2,
      title: "Nhân viên Khai báo Hải quan",
      department: "Phòng Hải quan",
      location: "TP.HCM",
      type: "Toàn thời gian",
      salary: "12-18 triệu",
      experience: "1-2 năm",
      icon: "🛃",
      requirements: [
        "Tốt nghiệp CĐ/ĐH các ngành liên quan",
        "Có chứng chỉ nghiệp vụ hải quan",
        "Kinh nghiệm khai báo hàng hóa XNK",
        "Cẩn thận, chính xác, trách nhiệm cao"
      ],
      benefits: [
        "Lương cứng + phụ cấp khai báo",
        "Được đào tạo các thủ tục mới",
        "Hỗ trợ chi phí đi lại",
        "Thưởng theo hiệu quả công việc"
      ]
    },
    {
      id: 3,
      title: "Trưởng phòng Kinh doanh",
      department: "Ban Giám đốc",
      location: "Hà Nội",
      type: "Toàn thời gian",
      salary: "30-50 triệu",
      experience: "5+ năm",
      icon: "👔",
      requirements: [
        "Tốt nghiệp ĐH chuyên ngành liên quan",
        "Tối thiểu 5 năm kinh nghiệm quản lý",
        "Thành thạo tiếng Trung, tiếng Anh",
        "Có mạng lưới khách hàng và đối tác"
      ],
      benefits: [
        "Lương cao + hoa hồng doanh số",
        "Quyền quyết định trong kinh doanh",
        "Công tác phí đi Trung Quốc định kỳ",
        "Cơ hội thăng tiến lên cấp Giám đốc"
      ]
    },
    {
      id: 4,
      title: "Nhân viên Tư vấn khách hàng",
      department: "Phòng CSKH",
      location: "Hà Nội / TP.HCM",
      type: "Toàn thời gian",
      salary: "10-15 triệu",
      experience: "0-1 năm",
      icon: "📞",
      requirements: [
        "Tốt nghiệp CĐ/ĐH các ngành liên quan",
        "Giao tiếp tốt, giọng nói rõ ràng",
        "Khả năng thuyết phục và bán hàng",
        "Học hỏi nhanh, chịu được áp lực"
      ],
      benefits: [
        "Lương cơ bản + hoa hồng hấp dẫn",
        "Đào tạo bài bản về sản phẩm dịch vụ",
        "Thưởng tháng 13, các ngày lễ",
        "Cơ hội phát triển nghề nghiệp"
      ]
    },
    {
      id: 5,
      title: "Tài xế vận chuyển hàng hóa",
      department: "Phòng Vận chuyển",
      location: "Lạng Sơn / Quảng Ninh",
      type: "Toàn thời gian",
      salary: "15-20 triệu",
      experience: "3+ năm",
      icon: "🚛",
      requirements: [
        "Có bằng lái xe hạng C, E",
        "Kinh nghiệm lái xe tải đường dài",
        "Sức khỏe tốt, không có tiền án tiền sự",
        "Có thể đi công tác xa nhiều ngày"
      ],
      benefits: [
        "Lương cao + phụ cấp đi đường",
        "Bảo hiểm tai nạn bổ sung",
        "Hỗ trợ ăn ở khi đi công tác",
        "Thưởng an toàn lao động"
      ]
    },
    {
      id: 6,
      title: "Nhân viên Kế toán",
      department: "Phòng Kế toán",
      location: "Hà Nội",
      type: "Toàn thời gian",
      salary: "12-18 triệu",
      experience: "2-3 năm",
      icon: "💰",
      requirements: [
        "Tốt nghiệp ĐH chuyên ngành Kế toán",
        "Có chứng chỉ hành nghề kế toán",
        "Kinh nghiệm kế toán doanh nghiệp XNK",
        "Thành thạo phần mềm kế toán MISA/FAST"
      ],
      benefits: [
        "Lương ổn định + thưởng cuối năm",
        "Môi trường làm việc ổn định",
        "Được học hỏi nghiệp vụ kế toán XNK",
        "Hỗ trợ học tập nâng cao trình độ"
      ]
    }
  ]

  return (
    <section id="jobs" className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Tuyển dụng nhân tài
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cơ hội nghề nghiệp tại TBS GROUP - Môi trường chuyên nghiệp, thu nhập hấp dẫn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {jobsData.map((job) => (
            <div key={job.id} className="card hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">
                    {job.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-green-600 font-medium">{job.department}</p>
                  </div>
                </div>
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                  {job.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  {job.salary}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  KN: {job.experience}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Yêu cầu:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {job.requirements.slice(0, 2).map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {req}
                    </li>
                  ))}
                  {job.requirements.length > 2 && (
                    <li className="text-gray-500 italic">+{job.requirements.length - 2} yêu cầu khác...</li>
                  )}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Quyền lợi:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {job.benefits.slice(0, 2).map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {benefit}
                    </li>
                  ))}
                  {job.benefits.length > 2 && (
                    <li className="text-gray-500 italic">+{job.benefits.length - 2} quyền lợi khác...</li>
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <button className="btn-primary flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Ứng tuyển ngay
                </button>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Lưu công việc">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="Chia sẻ">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Company culture */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Tại sao chọn TBS GROUP?
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Chúng tôi xây dựng môi trường làm việc năng động, chuyên nghiệp với nhiều cơ hội phát triển
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Mục tiêu rõ ràng</h4>
                <p className="text-sm text-gray-600">Định hướng phát triển nghề nghiệp minh bạch</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Đào tạo chuyên sâu</h4>
                <p className="text-sm text-gray-600">Chương trình đào tạo bài bản, cập nhật kiến thức</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Thu nhập hấp dẫn</h4>
                <p className="text-sm text-gray-600">Lương thưởng cạnh tranh, đánh giá công bằng</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Đồng nghiệp thân thiện</h4>
                <p className="text-sm text-gray-600">Văn hóa làm việc tích cực, hỗ trợ lẫn nhau</p>
              </div>
            </div>
          </div>
        </div>

        {/* Apply section */}
        <div className="mt-12 text-center">
          <div className="bg-gray-900 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              Không tìm thấy vị trí phù hợp?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Hãy gửi CV của bạn cho chúng tôi. TBS GROUP luôn chào đón những nhân tài có năng lực và đam mê trong lĩnh vực xuất nhập khẩu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:hr@tbsgroup.vn" className="btn-primary bg-white text-gray-900 hover:bg-gray-100">
                Gửi CV qua Email
              </a>
              <a href="#contact" className="btn-secondary border-white text-white hover:bg-white hover:text-gray-900">
                Liên hệ trực tiếp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 