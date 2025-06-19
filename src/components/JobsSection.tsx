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

  const applyUrl = "https://tbsgroup.sg.larksuite.com/share/base/form/shrlgmnZyfBzBpBASsSeOdDoD2c"

  return (
    <section id="jobs" className="section-padding bg-white">
      <div className="container-max">
        {/* Company culture - NICE & PRO - Đưa lên đầu */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Văn hóa TBS GROUP
              </h2>
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-full text-2xl font-bold tracking-wider">
                  NICE & PRO
                </div>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                <strong>NICE</strong> - Thân thiện, hòa đồng, tôn trọng lẫn nhau<br/>
                <strong>PRO</strong> - Chuyên nghiệp, hiệu quả, cam kết chất lượng
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Mục tiêu rõ ràng</h4>
                <p className="text-sm text-gray-600">Định hướng phát triển nghề nghiệp minh bạch, thăng tiến công bằng</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Đào tạo chuyên sâu</h4>
                <p className="text-sm text-gray-600">Chương trình đào tạo bài bản, cập nhật kiến thức thường xuyên</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Thu nhập hấp dẫn</h4>
                <p className="text-sm text-gray-600">Lương thưởng cạnh tranh, đánh giá hiệu quả công bằng</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Môi trường NICE & PRO</h4>
                <p className="text-sm text-gray-600">Văn hóa thân thiện, chuyên nghiệp, hỗ trợ phát triển cùng nhau</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quyền lợi với ứng viên */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🎁 Quyền lợi dành cho ứng viên
            </h2>
            <p className="text-xl text-gray-600">
              TBS GROUP cam kết mang đến những quyền lợi tốt nhất cho toàn thể nhân viên
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Thu nhập & Thưởng</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start"><span className="text-green-500 mr-2">•</span>Lương cạnh tranh theo năng lực</li>
                <li className="flex items-start"><span className="text-green-500 mr-2">•</span>Thưởng KPI hàng tháng</li>
                <li className="flex items-start"><span className="text-green-500 mr-2">•</span>Thưởng tháng 13, các ngày lễ</li>
                <li className="flex items-start"><span className="text-green-500 mr-2">•</span>Xét tăng lương định kỳ</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🏥</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Bảo hiểm & Sức khỏe</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start"><span className="text-blue-500 mr-2">•</span>BHXH, BHYT, BHTN đầy đủ</li>
                <li className="flex items-start"><span className="text-blue-500 mr-2">•</span>Bảo hiểm sức khỏe bổ sung</li>
                <li className="flex items-start"><span className="text-blue-500 mr-2">•</span>Khám sức khỏe định kỳ</li>
                <li className="flex items-start"><span className="text-blue-500 mr-2">•</span>Hỗ trợ y tế khẩn cấp</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Phát triển nghề nghiệp</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start"><span className="text-purple-500 mr-2">•</span>Đào tạo nội bộ chuyên sâu</li>
                <li className="flex items-start"><span className="text-purple-500 mr-2">•</span>Cơ hội thăng tiến rõ ràng</li>
                <li className="flex items-start"><span className="text-purple-500 mr-2">•</span>Hỗ trợ học tập nâng cao</li>
                <li className="flex items-start"><span className="text-purple-500 mr-2">•</span>Rotaion việc học việc</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🏖️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Nghỉ phép & Du lịch</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start"><span className="text-yellow-500 mr-2">•</span>12 ngày phép năm + phép lễ</li>
                <li className="flex items-start"><span className="text-yellow-500 mr-2">•</span>Du lịch công ty hàng năm</li>
                <li className="flex items-start"><span className="text-yellow-500 mr-2">•</span>Team building định kỳ</li>
                <li className="flex items-start"><span className="text-yellow-500 mr-2">•</span>Flexible working time</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Hỗ trợ công việc</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start"><span className="text-red-500 mr-2">•</span>Laptop, điện thoại công ty</li>
                <li className="flex items-start"><span className="text-red-500 mr-2">•</span>Hỗ trợ chi phí đi lại</li>
                <li className="flex items-start"><span className="text-red-500 mr-2">•</span>Công tác phí Trung Quốc</li>
                <li className="flex items-start"><span className="text-red-500 mr-2">•</span>Phụ cấp ăn trưa</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Ghi nhận & Vinh danh</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start"><span className="text-indigo-500 mr-2">•</span>Nhân viên xuất sắc tháng</li>
                <li className="flex items-start"><span className="text-indigo-500 mr-2">•</span>Thưởng đóng góp ý tưởng</li>
                <li className="flex items-start"><span className="text-indigo-500 mr-2">•</span>Cơ hội trở thành cổ đông</li>
                <li className="flex items-start"><span className="text-indigo-500 mr-2">•</span>Chứng nhận thành tích</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cam kết của công ty */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                🤝 Cam kết của TBS GROUP với đội ngũ
              </h2>
              <p className="text-xl text-blue-100">
                Chúng tôi xây dựng không chỉ là nơi làm việc mà còn là ngôi nhà thứ hai
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="text-xl font-semibold">Phát triển bền vững</h3>
                </div>
                <p className="text-blue-100 leading-relaxed">
                  Cam kết đầu tư vào con người, tạo điều kiện để mỗi nhân viên phát triển toàn diện 
                  cả về chuyên môn lẫn kỹ năng mềm. Mở ra cơ hội thăng tiến rõ ràng và công bằng.
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">⚖️</span>
                  </div>
                  <h3 className="text-xl font-semibold">Công bằng & Minh bạch</h3>
                </div>
                <p className="text-blue-100 leading-relaxed">
                  Đảm bảo quyền lợi công bằng cho tất cả nhân viên. Chính sách lương thưởng minh bạch, 
                  đánh giá hiệu quả dựa trên kết quả thực tế và đóng góp của từng cá nhân.
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <h3 className="text-xl font-semibold">Môi trường học hỏi</h3>
                </div>
                <p className="text-blue-100 leading-relaxed">
                  Khuyến khích văn hóa học hỏi và chia sẻ. Hỗ trợ nhân viên tham gia các khóa đào tạo, 
                  hội thảo chuyên ngành để nâng cao kiến thức và kỹ năng.
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🤗</span>
                  </div>
                  <h3 className="text-xl font-semibold">Quan tâm & Hỗ trợ</h3>
                </div>
                <p className="text-blue-100 leading-relaxed">
                  Luôn lắng nghe và quan tâm đến đời sống cá nhân của nhân viên. Hỗ trợ kịp thời 
                  khi gặp khó khăn, tạo môi trường làm việc tích cực và đầy động lực.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tuyển dụng nhân tài */}
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
                <a 
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Ứng tuyển ngay
                </a>
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

        {/* Apply section với thông tin HR mới */}
        <div className="mt-12 text-center">
          <div className="bg-gray-900 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              Không tìm thấy vị trí phù hợp?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Hãy gửi CV của bạn cho chúng tôi. TBS GROUP luôn chào đón những nhân tài có năng lực và đam mê trong lĩnh vực xuất nhập khẩu.
            </p>
            
            {/* HR Contact Info */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6 inline-block">
              <h4 className="text-lg font-semibold mb-4 text-green-400">📞 Liên hệ phòng Nhân sự</h4>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="https://zalo.me/0925671994"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span className="mr-2">💬</span>
                  <span>Zalo: 0925 671 994</span>
                </a>
                <div className="hidden sm:block text-gray-600">|</div>
                <a 
                  href="mailto:hr@xuatnhapkhautbs.vn"
                  className="flex items-center text-green-400 hover:text-green-300 transition-colors"
                >
                  <span className="mr-2">✉️</span>
                  <span>hr@xuatnhapkhautbs.vn</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary bg-green-600 hover:bg-green-700 text-white border-none"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Điền Form Ứng tuyển
              </a>
              <a 
                href="mailto:hr@xuatnhapkhautbs.vn" 
                className="btn-secondary border-white text-white hover:bg-white hover:text-gray-900"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Gửi CV qua Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 