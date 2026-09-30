import {
  industries,
  industryCategories,
} from './industry-atlas'
import type {
  Industry,
  IndustryCategory,
} from '../lib/studio/content-model'

export { industries, industryCategories }
export type { Industry, IndustryCategory }

export const site = {
  name: 'TBS GROUP',
  url: 'https://nhaphangchinhngach.vn',
  phone: '+84976005335',
  phoneDisplay: '0976 005 335',
  zalo: 'https://zalo.me/0976005335',
  email: 'info@xuatnhapkhautbs.vn',
}

export type FAQ = { q: string; a: string }
export type Service = {
  imageAlts?: Record<string, string>
  slug: string
  title: string
  shortTitle: string
  summary: string
  image: string
  audience: string
  scope: string[]
  inputs: string[]
  boundaries: string[]
  faqs: FAQ[]
}

export const services: Service[] = [
  {
    slug: 'nhap-khau-chinh-ngach',
    title: 'Nhập khẩu chính ngạch từ Trung Quốc',
    shortTitle: 'Nhập khẩu chính ngạch',
    summary: 'Xác định phương án nhập hàng từ thông tin sản phẩm, nhà cung cấp đến giao nhận và bộ hồ sơ theo từng lô.',
    image: '/images/marketing/containers.webp',
    audience: 'Dành cho doanh nghiệp đã có nhà cung cấp hoặc đang chuẩn bị đơn hàng và cần xác định các phần việc nhập khẩu cần phối hợp.',
    scope: [
      'Tiếp nhận thông tin hàng hóa, mục đích sử dụng và nhu cầu nhập để xác định các điểm cần kiểm tra.',
      'Trao đổi chủ thể giao dịch, trách nhiệm của nhà cung cấp, doanh nghiệp và đơn vị thực hiện từng phần việc.',
      'Lập phạm vi phối hợp: nhận hàng, kiểm đếm, vận chuyển, hồ sơ và giao hàng theo phương án đã thống nhất.',
      'Đối chiếu thông tin báo giá với dữ liệu thực tế của lô hàng; ghi nhận các giả định và điều kiện áp dụng.',
      'Thống nhất mốc cập nhật và danh mục hồ sơ bàn giao trước khi tổ chức công việc.',
    ],
    inputs: ['Ảnh hoặc đường dẫn sản phẩm; vật liệu, công dụng và thông số nhận diện.', 'Số lượng, đơn giá dự kiến, số kiện và quy cách đóng gói nếu đã có.', 'Thông tin nhà cung cấp và địa điểm nhận hàng tại Trung Quốc.', 'Nơi giao tại Việt Nam, thời điểm cần hàng và chủ thể dự kiến nhập khẩu.', 'Các yêu cầu về hồ sơ, kiểm tra, đóng gói và những phần việc đã tự thực hiện.'],
    boundaries: ['Khả năng nhận lô hàng được xác nhận sau khi kiểm tra sản phẩm và phạm vi công việc.', 'Thời gian, chi phí và bộ hồ sơ phụ thuộc phương án cụ thể; không áp dụng chung cho mọi mặt hàng.', 'Việc TBS trực tiếp thực hiện hay phối hợp với đối tác cần được ghi rõ trong báo giá hoặc thỏa thuận.'],
    faqs: [
      { q: 'Đã có nhà cung cấp thì cần gửi gì?', a: 'Gửi thông tin sản phẩm, báo giá của nhà cung cấp nếu có, địa điểm nhận, số lượng và nơi giao. Nêu rõ nhà cung cấp đã nhận làm những phần việc nào. TBS sử dụng dữ liệu này để trao đổi phạm vi cần hỗ trợ và các nội dung còn thiếu.' },
      { q: 'TBS có thể phối hợp ở những khâu nào?', a: 'Anh/chị có thể trao đổi nhu cầu nhận hàng, kiểm đếm, vận chuyển và xử lý hồ sơ. Phần việc nào được nhận, ai thực hiện và kết quả bàn giao sẽ được xác nhận theo lô; danh sách dịch vụ trên website không thay thế thỏa thuận đó.' },
      { q: 'Báo giá có hiệu lực đến khi nào?', a: 'Thời hạn áp dụng cần có trên báo giá cụ thể. Khi thay đổi số lượng, đóng gói, địa điểm hoặc thời điểm thực hiện, hãy đề nghị người phụ trách xác nhận lại phạm vi và chi phí trước khi chuyển hàng hoặc thanh toán.' },
      { q: 'Bộ hồ sơ nào được bàn giao?', a: 'Danh mục hồ sơ phụ thuộc chủ thể nhập khẩu, phương án giao dịch và hàng hóa. Hai bên cần xác nhận tên giấy tờ, bên đứng tên, bản bàn giao và thời điểm nhận trước khi thực hiện, thay vì mặc định mọi lô đều có cùng bộ chứng từ.' },
    ],
  },
  {
    slug: 'uy-thac-nhap-khau',
    title: 'Dịch vụ ủy thác nhập khẩu Trung Quốc',
    shortTitle: 'Ủy thác nhập khẩu',
    summary: 'Làm rõ vai trò các bên, phần việc ủy thác và nguyên tắc đối chiếu hồ sơ trước khi triển khai lô hàng.',
    image: '/images/marketing/containers.webp',
    audience: 'Dành cho doanh nghiệp muốn xem xét phương án nhập khẩu theo hợp đồng ủy thác và cần làm rõ trách nhiệm giao dịch, chi phí, hồ sơ.',
    scope: ['Tiếp nhận nhu cầu ủy thác, thông tin doanh nghiệp và đặc điểm lô hàng.', 'Trao đổi vai trò của bên giao ủy thác, bên nhận ủy thác và nhà cung cấp.', 'Xác định công việc được ủy thác, phần khách hàng tự thực hiện và đơn vị phối hợp.', 'Thống nhất đầu mối duyệt thông tin, chứng từ, chi phí và thay đổi.', 'Đối chiếu kết quả công việc, khoản thanh toán và hồ sơ bàn giao theo thỏa thuận.'],
    inputs: ['Thông tin doanh nghiệp và đầu mối quyết định giao dịch.', 'Danh mục hàng, catalogue hoặc thông số, số lượng và giá trị dự kiến.', 'Thông tin nhà cung cấp và điều kiện giao dịch đang được trao đổi.', 'Nhu cầu hồ sơ, kế hoạch thanh toán và thời điểm cần hàng.'],
    boundaries: ['Phạm vi ủy thác phải được xác định trong hợp đồng phù hợp với giao dịch.', 'Không mặc định cách xuất hóa đơn, thanh toán hay bộ hồ sơ giống nhau giữa các khách hàng.', 'Chủ thể đứng tên và trách nhiệm pháp lý cần được kiểm tra theo phương án thực tế trước khi ký.'],
    faqs: [
      { q: 'Khi nào nên trao đổi phương án ủy thác?', a: 'Khi doanh nghiệp cần xem xét việc giao một số phần việc nhập khẩu cho đơn vị khác theo hợp đồng. Tính phù hợp phụ thuộc hàng hóa, chủ thể giao dịch và nhu cầu hồ sơ; cần trao đổi trường hợp cụ thể trước khi chọn phương án.' },
      { q: 'Các bên cần thống nhất những gì?', a: 'Cần thống nhất hàng hóa, phần việc được giao, đầu mối phê duyệt, cách xác nhận chi phí, thanh toán và bộ hồ sơ. Nên ghi rõ việc xử lý khi nhà cung cấp đổi sản phẩm, thiếu hàng hoặc điều chỉnh lịch giao.' },
      { q: 'Hồ sơ được xác nhận ở bước nào?', a: 'Nhu cầu hồ sơ nên được nêu từ bước tiếp nhận. Danh mục bàn giao và bên đứng tên cần được kiểm tra, thống nhất cùng phương án trước khi triển khai. Nếu dữ liệu sản phẩm thay đổi, phạm vi hồ sơ cũng cần được đối chiếu lại.' },
      { q: 'Ai quyết định khi thay đổi số lượng hoặc mặt hàng?', a: 'Đầu mối có quyền phê duyệt phải được chỉ định trong thỏa thuận. Người tiếp nhận ghi lại nội dung thay đổi, tác động đến hồ sơ, chi phí và tiến độ để các bên xác nhận trước khi thực hiện phần việc bị ảnh hưởng.' },
    ],
  },
  {
    slug: 'van-chuyen-trung-viet',
    title: 'Vận chuyển hàng Trung Quốc - Việt Nam',
    shortTitle: 'Vận chuyển Trung - Việt',
    summary: 'Trao đổi phương án giao nhận dựa trên loại hàng, đóng gói, điểm nhận và thời điểm cần giao.',
    image: '/images/marketing/transport.webp',
    audience: 'Dành cho doanh nghiệp cần vận chuyển một lô hàng hoặc phối hợp nhiều điểm nhận, với phạm vi giao nhận và cơ sở tính cước rõ ràng.',
    scope: ['Kiểm tra điểm nhận, điểm giao và điều kiện tiếp cận hàng hóa.', 'Đối chiếu số kiện, khối lượng và kích thước để trao đổi cơ sở tính cước.', 'Xác định yêu cầu đóng gói, chống vỡ, xếp dỡ và phương tiện phù hợp.', 'Thống nhất điểm bắt đầu, điểm kết thúc của từng phần vận chuyển và bên phụ trách.', 'Ghi nhận các mốc giao nhận, chứng cứ bàn giao và cách thông báo thay đổi.'],
    inputs: ['Tên hàng, đặc điểm dễ vỡ hoặc yêu cầu bảo quản nếu có.', 'Số kiện, kích thước từng loại kiện và khối lượng đóng gói.', 'Địa điểm nhận tại Trung Quốc, địa điểm giao tại Việt Nam.', 'Ngày sẵn hàng, hạn cần giao và điều kiện nâng hạ ở hai đầu.'],
    boundaries: ['Mốc thời gian là dự kiến theo điều kiện đã xác nhận; phải chỉ rõ thời điểm bắt đầu tính.', 'Giao nội địa, nâng hạ, lưu kho và đóng gói chỉ thuộc báo giá khi được liệt kê.', 'Phạm vi bảo hiểm, trách nhiệm tổn thất và thủ tục phản hồi theo thỏa thuận áp dụng, không mặc định bồi thường toàn bộ.'],
    faqs: [
      { q: 'Cước vận chuyển được tính trên cơ sở nào?', a: 'Cần đối chiếu đặc điểm hàng, khối lượng, thể tích, điểm nhận và giao. Báo giá phải thể hiện đơn vị tính, dữ liệu cân đo được sử dụng và các khoản đi kèm. Khi chỉ có thông số dự kiến, đề nghị ghi rõ điều kiện điều chỉnh sau cân đo.' },
      { q: 'Thời gian vận chuyển tính từ mốc nào?', a: 'Mốc bắt đầu cần được xác nhận, chẳng hạn sau khi hàng và hồ sơ đáp ứng điều kiện tiếp nhận đã thống nhất. Ngày nhà cung cấp hứa giao chưa nhất thiết là ngày bắt đầu vận chuyển. Các mốc dự kiến nên được cập nhật khi dữ liệu thay đổi.' },
      { q: 'Báo giá đã gồm giao nội địa chưa?', a: 'Kiểm tra điểm kết thúc ghi trong báo giá. Giao đến kho, giao đến địa chỉ nhận và đưa hàng vào vị trí sử dụng là các phạm vi khác nhau. Chi phí nâng hạ hoặc điều kiện xe tiếp cận cần được làm rõ riêng nếu phát sinh.' },
      { q: 'Hàng dễ vỡ hoặc cồng kềnh cần gửi thêm gì?', a: 'Gửi ảnh kiện, vật liệu đóng gói, kích thước, trọng lượng và các vị trí cần bảo vệ. Với thiết bị, bổ sung yêu cầu về trọng tâm, điểm nâng và hướng đặt. Phương án tiếp nhận chỉ được chốt sau khi xem xét các thông tin này.' },
    ],
  },
  {
    slug: 'gom-hang-kiem-dem',
    title: 'Gom hàng và kiểm đếm tại Trung Quốc',
    shortTitle: 'Gom hàng & kiểm đếm',
    summary: 'Theo dõi hàng từ nhiều nhà cung cấp, đối chiếu số lượng và ghi nhận hiện trạng theo phạm vi đã thống nhất.',
    image: '/images/marketing/containers.webp',
    audience: 'Dành cho đơn hàng nhiều mã hoặc nhiều nhà cung cấp cần quy ước nhận diện, kiểm đếm và gom chuyến trước khi chuyển tiếp.',
    scope: ['Thống nhất mã đơn, mã nhà cung cấp và dấu nhận diện trên kiện.', 'Đối chiếu hàng đến với danh sách dự kiến; ghi nhận số kiện và hiện trạng nhận.', 'Kiểm đếm theo đơn vị và mức độ đã thỏa thuận: kiện, mã hàng hoặc sản phẩm.', 'Ghi nhận chênh lệch, hình ảnh trong phạm vi cho phép và gửi đầu mối xử lý.', 'Xác nhận đóng gói bổ sung, điều kiện lưu giữ và thời điểm xuất gom.'],
    inputs: ['Danh sách nhà cung cấp, mã đơn và mã sản phẩm.', 'Số lượng dự kiến theo từng mã, mẫu đối chiếu và quy cách đóng kiện.', 'Yêu cầu mở kiện, kiểm đếm, ảnh hiện trạng hoặc đóng gói bổ sung.', 'Điều kiện xuất gom: đủ hàng, theo lịch hoặc sau xác nhận riêng.'],
    boundaries: ['Kiểm đếm không đồng nghĩa với kiểm định chất lượng, thử nghiệm chức năng hoặc bảo đảm chất lượng sản xuất.', 'Mở từng sản phẩm, lấy mẫu và kiểm tra đặc thù cần phạm vi riêng.', 'Lưu giữ, vật tư đóng gói và xử lý hàng lệch phải được xác nhận về công việc và chi phí.'],
    faqs: [
      { q: 'Có mở từng sản phẩm để kiểm tra không?', a: 'Mức độ mở kiện được thống nhất trước khi nhận hàng. Kiểm đếm theo kiện khác với đối chiếu từng mã hoặc từng sản phẩm. Nếu cần kiểm tra chức năng, chất lượng hoặc lấy mẫu, phải xác định tiêu chí và phạm vi riêng.' },
      { q: 'Phát hiện thiếu hoặc sai hàng thì xử lý thế nào?', a: 'Cần ghi nhận mã đơn, số lượng và hình ảnh phù hợp, sau đó đối chiếu với danh sách đã nhận. Đầu mối được chỉ định trao đổi với nhà cung cấp và xác nhận phương án bổ sung, giữ lại hoặc chuyển tiếp. Không tự coi mọi chênh lệch là lỗi vận chuyển.' },
      { q: 'Chi phí lưu giữ và đóng gói có tính riêng không?', a: 'Các khoản này cần có trong phạm vi báo giá nếu áp dụng. Hãy xác nhận thời điểm bắt đầu tính, đơn vị tính, vật tư sử dụng và người duyệt. Không nên hiểu phí kiểm đếm đã bao gồm mọi loại đóng gói hoặc thời gian lưu giữ.' },
      { q: 'Doanh nghiệp nhận được những hình ảnh nào?', a: 'Thống nhất trước các góc ảnh và đối tượng cần ghi nhận, chẳng hạn nhãn kiện, số lượng hoặc hiện trạng bao bì. Hình ảnh phục vụ đối chiếu trong phạm vi đã thực hiện, không thay thế một báo cáo kiểm định sản phẩm.' },
    ],
  },
  {
    slug: 'tim-nguon-kiem-tra-nha-cung-cap',
    title: 'Tìm nguồn hàng và kiểm tra nhà cung cấp Trung Quốc',
    shortTitle: 'Tìm nguồn & kiểm tra NCC',
    summary: 'Làm rõ tiêu chí sản phẩm, sàng lọc thông tin nhà cung cấp và xác định những điểm cần kiểm tra trước đặt hàng.',
    image: '/images/marketing/containers.webp',
    audience: 'Dành cho doanh nghiệp chưa chọn được nhà cung cấp hoặc muốn đối chiếu thêm thông tin của một đơn vị đang giao dịch.',
    scope: ['Tiếp nhận mô tả sản phẩm, mẫu, quy mô đặt hàng và tiêu chí lựa chọn.', 'Thống nhất phạm vi tìm kiếm và thông tin cần đối chiếu ở nhà cung cấp.', 'Tổng hợp phương án theo tiêu chí đã giao, ghi rõ nguồn và giới hạn thông tin.', 'Trao đổi việc lấy mẫu hoặc kiểm tra bổ sung nếu được yêu cầu và có thể thực hiện.', 'Ghi nhận kết quả, các điểm chưa xác minh và việc cần làm trước quyết định mua.'],
    inputs: ['Ảnh mẫu, bản vẽ hoặc thông số; yêu cầu vật liệu, kích thước và công dụng.', 'Số lượng dự kiến, ngân sách mục tiêu và lịch cần hàng.', 'Tiêu chí chấp nhận mẫu, đóng gói, nhãn và hồ sơ.', 'Thông tin nhà cung cấp cần kiểm tra nếu đã có đầu mối.'],
    boundaries: ['Thông tin do nhà cung cấp cung cấp cần phân biệt với nội dung đã được kiểm tra trực tiếp.', 'Kết quả sàng lọc không phải bảo đảm tuyệt đối về năng lực sản xuất hay chất lượng mọi đơn hàng.', 'Chi phí mẫu, vận chuyển mẫu và kiểm tra riêng cần được chấp thuận trước.'],
    faqs: [
      { q: 'Cần có mẫu hay chỉ cần ảnh sản phẩm?', a: 'Ảnh giúp bắt đầu trao đổi, nhưng tiêu chí vật liệu, kích thước, công dụng và mức chấp nhận sai khác mới giúp so sánh các phương án. Với sản phẩm cần độ chính xác hoặc hoàn thiện riêng, nên cung cấp bản vẽ, thông số hoặc mẫu đối chiếu.' },
      { q: 'Kết quả kiểm tra gồm những gì?', a: 'Nội dung phụ thuộc phạm vi đã giao: nguồn thông tin doanh nghiệp, dữ liệu sản phẩm, điều kiện giao dịch hoặc kết quả đối chiếu cụ thể. Báo cáo cần phân biệt thông tin đã xác minh, thông tin do đối tác cung cấp và nội dung chưa đủ cơ sở kết luận.' },
      { q: 'Lấy mẫu có chi phí như thế nào?', a: 'Chi phí phụ thuộc mẫu, nhà cung cấp và cách giao nhận. Cần xác nhận tiền mẫu, vận chuyển và phần việc hỗ trợ trước khi đặt. Website không công bố một mức áp dụng cho tất cả sản phẩm hoặc mặc định mẫu luôn miễn phí.' },
      { q: 'Trước đơn hàng lớn cần kiểm tra thêm gì?', a: 'Đối chiếu mẫu đã chấp nhận với thông số đặt hàng, tiêu chí nghiệm thu, đóng gói, lịch giao và cách xử lý sai khác. Phạm vi kiểm tra bổ sung nên được xác định theo rủi ro sản phẩm và giá trị giao dịch.' },
    ],
  },
  {
    slug: 'thu-tuc-hai-quan',
    title: 'Hỗ trợ hồ sơ và thủ tục hải quan nhập khẩu',
    shortTitle: 'Hồ sơ & thủ tục hải quan',
    summary: 'Tập hợp thông tin kỹ thuật và giao dịch để kiểm tra yêu cầu hồ sơ phù hợp với từng sản phẩm, từng phương án.',
    image: '/images/marketing/containers.webp',
    audience: 'Dành cho doanh nghiệp cần rà soát dữ liệu sản phẩm và các nội dung phải xác minh trước khi tổ chức nhập hàng.',
    scope: ['Tiếp nhận thông tin nhận diện sản phẩm, chủ thể nhập khẩu và giao dịch.', 'Đối chiếu mô tả hàng với catalogue, model, thành phần và công dụng được cung cấp.', 'Lập danh sách dữ liệu còn thiếu và nội dung cần bộ phận chuyên môn kiểm tra.', 'Thống nhất đơn vị thực hiện, phạm vi phối hợp và đầu mối xác nhận hồ sơ.', 'Phản hồi kết quả kiểm tra theo căn cứ, thời điểm và phạm vi của lô hàng cụ thể.'],
    inputs: ['Catalogue, ảnh nhãn, model, vật liệu hoặc thành phần và công dụng.', 'Tình trạng hàng, số lượng, giá trị và quy cách đóng gói.', 'Thông tin nhà cung cấp, bên nhập khẩu và các chứng từ giao dịch đang có.', 'Yêu cầu hồ sơ của doanh nghiệp và thời điểm dự kiến thực hiện.'],
    boundaries: ['Tên hàng hoặc ảnh đơn lẻ có thể chưa đủ để kết luận phân loại hay yêu cầu hồ sơ.', 'Không cam kết phân luồng, thời gian thông quan chắc chắn hoặc kết quả kiểm tra của cơ quan có thẩm quyền.', 'Phạm vi đại diện và đơn vị thực hiện được xác nhận theo hồ sơ giao dịch; website không tự xác nhận tư cách đại lý hải quan.'],
    faqs: [
      { q: 'Vì sao cần thông số ngoài tên hàng?', a: 'Một tên gọi thương mại có thể dùng cho nhiều sản phẩm khác vật liệu, công dụng hoặc cấu tạo. Catalogue, model và ảnh nhãn giúp nhận diện chính xác hơn để bộ phận chuyên môn xác định nội dung cần kiểm tra.' },
      { q: 'Khi nào đủ dữ liệu để xem xét phân loại?', a: 'Sau khi đã có thông tin nhận diện và các đặc điểm kỹ thuật cần thiết cho sản phẩm cụ thể. Nếu còn thiếu, người phụ trách cần nêu rõ dữ liệu phải bổ sung. Không nên dùng một mã tham khảo của sản phẩm khác làm kết luận cho lô hàng.' },
      { q: 'Nhà cung cấp cần chuẩn bị thông tin gì?', a: 'Đề nghị cung cấp mô tả kỹ thuật, ảnh nhãn, catalogue và dữ liệu giao dịch thống nhất với hàng thực tế. Danh mục giấy tờ cụ thể cần được kiểm tra theo phương án nhập và sản phẩm, sau đó xác nhận với bên có trách nhiệm cung cấp.' },
      { q: 'Sale và bộ phận chuyên môn phối hợp thế nào?', a: 'Sale tiếp nhận nhu cầu và dữ liệu, tổng hợp điểm còn thiếu rồi chuyển nội dung cần kiểm tra. Kết quả phản hồi cần phân biệt phần đã xác minh với phần đang chờ thêm thông tin, đồng thời nêu bước tiếp theo và đầu mối phụ trách.' },
    ],
  },
]

export type Article = {
  slug: string
  title: string
  summary: string
  category: string
  categorySlug: string
  image: string
  sections: { heading: string; body: string[] }[]
}

export const articles: Article[] = [
  {
    slug: 'chuan-bi-thong-tin-lo-hang', title: 'Chuẩn bị thông tin lô hàng trước khi trao đổi với sale',
    summary: 'Năm nhóm dữ liệu giúp cuộc trao đổi đi đúng nhu cầu: sản phẩm, số lượng, điểm nhận, điểm giao và bộ hồ sơ.',
    category: 'Chuẩn bị nhập hàng', categorySlug: 'chuan-bi', image: '/images/marketing/containers.webp',
    sections: [
      { heading: 'Bắt đầu bằng một mô tả có thể đối chiếu', body: ['Thông tin càng cụ thể, người tiếp nhận càng dễ xác định phần việc cần kiểm tra. Anh/chị không cần có sẵn một bộ hồ sơ hoàn chỉnh, nhưng nên phân biệt dữ liệu đã xác nhận và thông tin đang ước tính. Một danh sách gọn, có cùng mã sản phẩm với nhà cung cấp, hữu ích hơn nhiều ảnh gửi rời không có chú thích.', 'Nêu ngay mục tiêu trao đổi: cần vận chuyển, gom hàng, kiểm tra hồ sơ hay xem xét toàn bộ phương án nhập. Nếu đã tự thực hiện một phần công việc, ghi rõ phần đó để tránh nhận một báo giá trùng phạm vi.'] },
      { heading: '1. Sản phẩm: nhận diện đúng mặt hàng', body: ['Chuẩn bị ảnh hoặc đường dẫn, tên sản phẩm, vật liệu, công dụng và thông số nhận diện. Với thiết bị, bổ sung model, catalogue và tình trạng mới hay đã qua sử dụng. Với một bộ sản phẩm, liệt kê thành phần chính và phụ kiện đi kèm.', 'Tên gọi trên sàn mua hàng thường chưa mô tả đủ cấu tạo hoặc mục đích sử dụng. Nếu chưa có thông số, hãy ghi “chưa có” và đề nghị nhà cung cấp bổ sung. Không đoán vật liệu hay dùng thông số của một sản phẩm nhìn tương tự để thay thế.'] },
      { heading: '2. Số lượng và đóng gói: tách dữ liệu thật khỏi ước tính', body: ['Ghi số lượng theo từng mã, đơn vị tính, số kiện dự kiến, kích thước và khối lượng sau đóng gói. Nếu nhập nhiều nhà cung cấp, chia danh sách theo từng đơn để người tiếp nhận đối chiếu hàng đến.', 'Ảnh đóng gói nên cho thấy bao bì ngoài, vật liệu đệm và cách xếp hàng khi có thể. Với hàng dễ vỡ, cồng kềnh hoặc có yêu cầu nâng hạ, nêu đặc điểm đó ngay. Khi chưa cân đo, báo rõ đây là ước tính và hỏi mốc xác nhận số đo thực tế.'] },
      { heading: '3. Điểm nhận: làm rõ phần việc của nhà cung cấp', body: ['Gửi địa điểm hàng sẵn sàng bàn giao, đầu mối nhà cung cấp và ngày dự kiến có hàng. Làm rõ nhà cung cấp giao đến đâu, đã bao gồm đóng gói hay vận chuyển nội địa chưa và bên nào chịu các khoản này.', 'Với nhiều điểm lấy hàng, ghi lịch sẵn hàng cho từng đơn. Việc một đơn đến muộn có thể ảnh hưởng điều kiện xuất gom, lưu giữ và kế hoạch giao. Nêu ưu tiên của doanh nghiệp: chờ đủ hàng hay xem xét chia chuyến theo phương án được xác nhận.'] },
      { heading: '4. Điểm giao và thời điểm cần hàng', body: ['Cung cấp địa điểm giao tại Việt Nam và người phối hợp nhận hàng. Nếu nơi giao có hạn chế xe vào, cần nâng hạ, đặt lịch hoặc giao vào vị trí cụ thể, phải ghi rõ để thống nhất phạm vi.', 'Phân biệt ngày mong muốn với hạn bắt buộc của đơn hàng hoặc dự án. Đề nghị người phụ trách xác nhận mốc bắt đầu tính thời gian và các điều kiện để đạt lịch dự kiến. Ngày hàng rời nhà cung cấp không tự động là mốc bắt đầu của mọi phần việc.'] },
      { heading: '5. Chủ thể giao dịch và nhu cầu hồ sơ', body: ['Nêu doanh nghiệp nào dự kiến đứng tên giao dịch, đã chọn phương án nhập hay cần trao đổi thêm. Liệt kê giấy tờ doanh nghiệp cần để đối chiếu hoặc hạch toán, cùng các chứng từ nhà cung cấp đang có.', 'Không chỉ nhắn “cần đủ chứng từ”. Hãy đề nghị xác nhận tên từng giấy tờ, chủ thể đứng tên, bên cung cấp, dạng bản nhận và thời điểm bàn giao. Với nội dung chuyên môn chưa đủ cơ sở kết luận, người tiếp nhận cần nêu rõ thông tin bổ sung và bước kiểm tra tiếp theo.'] },
      { heading: 'Trước khi gửi và sau cuộc trao đổi', body: ['Kiểm tra ảnh, bảng hàng và báo giá có cùng mã, số lượng và phiên bản hay không. Chỉ gửi thông tin cần thiết qua kênh đã xác nhận; che dữ liệu của khách hàng hoặc giao dịch khác không liên quan. Không cần cung cấp mật khẩu, mã xác thực hay dữ liệu tài khoản ngân hàng để bắt đầu tư vấn.', 'Kết thúc cuộc trao đổi bằng một danh sách ngắn: thông tin còn thiếu, người bổ sung, phần việc sẽ kiểm tra và mốc phản hồi được hai bên thống nhất. Khi nhà cung cấp đổi hàng hoặc số lượng, gửi phiên bản cập nhật cho cùng đầu mối để tránh dùng lại dữ liệu cũ.'] },
    ],
  },
  {
    slug: 'doc-bao-gia-nhap-khau', title: 'Đọc báo giá nhập khẩu: phạm vi, khoản phí và điều kiện áp dụng',
    summary: 'Đối chiếu cùng một phạm vi trước khi so sánh giá; phân biệt khoản đã xác định, khoản dự kiến và công việc chưa bao gồm.',
    category: 'Chi phí & chứng từ', categorySlug: 'chi-phi', image: '/images/marketing/transport.webp',
    sections: [
      { heading: 'Đọc phạm vi trước khi nhìn tổng tiền', body: ['Hai báo giá có tổng tiền khác nhau có thể đang mô tả hai phần việc khác nhau. Một bên báo đến điểm nhận trung gian, một bên gồm giao đến địa chỉ; một bên dùng số đo dự kiến, bên kia dùng số kiện thực tế. Vì vậy, tổng tiền chỉ có ý nghĩa khi đầu vào và phạm vi đủ tương đồng.', 'Trước tiên, kiểm tra báo giá dành cho sản phẩm nào, số lượng bao nhiêu, điểm nhận và giao ở đâu. Xác định đây là báo giá dịch vụ hay gồm cả giá hàng. Nếu một dữ liệu chưa xác nhận, yêu cầu ghi rõ giả định được sử dụng.'] },
      { heading: '1. Đối chiếu từng nhóm chi phí', body: ['Tách các nhóm: giá hàng nếu có; thu gom và giao nội địa tại Trung Quốc; kiểm đếm, lưu giữ, đóng gói; vận chuyển; phần xử lý hồ sơ; thuế và nghĩa vụ liên quan nếu được dự toán; giao nội địa tại Việt Nam; dịch vụ TBS. Không phải lô nào cũng phát sinh mọi nhóm.', 'Mỗi dòng nên cho biết công việc, đơn vị tính, số lượng tính và bên thanh toán. Các khoản chi hộ hoặc do nhà cung cấp thu cần được phân biệt với phí dịch vụ. Khi báo giá theo gói, đề nghị có danh sách việc đã gồm và chưa gồm để vẫn đối chiếu được.'] },
      { heading: '2. Kiểm tra cơ sở cân đo và điều kiện giao nhận', body: ['Với khoản phụ thuộc khối lượng hoặc thể tích, hỏi số liệu được lấy ở đâu và thời điểm nào. Kích thước sản phẩm chưa đóng gói có thể khác kích thước kiện. Bao bì bổ sung, khung bảo vệ hoặc thay đổi cách xếp hàng có thể làm thay đổi dữ liệu tính.', 'Điểm kết thúc dịch vụ cần cụ thể. Giao tại điểm tập kết, giao đến cổng kho và đưa hàng vào vị trí sử dụng không cùng phạm vi. Xác nhận riêng yêu cầu nâng hạ, hẹn giao và điều kiện tiếp cận địa điểm nếu chúng ảnh hưởng công việc.'] },
      { heading: '3. Phân biệt khoản xác định và khoản cần kiểm tra', body: ['Một báo giá cần nêu rõ khoản đã có căn cứ và khoản còn dự kiến. Nếu người phụ trách chưa đủ dữ liệu sản phẩm để kiểm tra hồ sơ hoặc nghĩa vụ liên quan, hỏi thông tin cần bổ sung và thời điểm có thể xác nhận lại.', 'Không tự diễn giải ô trống hoặc dòng “chưa gồm” là miễn phí. Cũng không suy ra rằng báo giá có một khoản thuế dự kiến đồng nghĩa mọi yêu cầu về sản phẩm đã được kết luận. Kết quả kiểm tra chuyên môn cần gắn với đúng hàng hóa và phương án.'] },
      { heading: '4. Đọc hiệu lực, tiền tệ và mốc thanh toán', body: ['Tìm ngày lập, thời hạn áp dụng và phiên bản báo giá. Nếu có nhiều đồng tiền, cần nêu rõ cách xác định tỷ giá áp dụng theo thỏa thuận và mốc đối chiếu. Kiểm tra các đợt thanh toán gắn với công việc hoặc hồ sơ nào.', 'Khi chốt đơn sau thời hạn áp dụng hoặc thay đổi số lượng, địa điểm, đóng gói và lịch giao, đề nghị xác nhận lại. Lưu phiên bản đã thống nhất cùng các trao đổi điều chỉnh để các bên sử dụng chung một cơ sở.'] },
      { heading: '5. Đối chiếu hồ sơ theo phương án giao dịch', body: ['Khách đứng tên nhập khẩu và khách giao ủy thác có cách phân công trách nhiệm khác nhau. Vì vậy, cần xác định ai cung cấp thông tin, ai đứng tên từng hồ sơ và ai nhận bản bàn giao. Nêu nhu cầu sử dụng chứng từ ngay khi xem phương án.', 'Danh mục giấy tờ phải phù hợp với giao dịch thực tế. Không coi một chuỗi ký hiệu như VAT, C/O hay chứng nhận chất lượng trên tài liệu quảng bá là cam kết tự động có đủ cho mọi lô. Hỏi tên giấy tờ cụ thể, điều kiện áp dụng và đầu mối xác nhận.'] },
      { heading: '6. Thống nhất cách xử lý phát sinh', body: ['Một nội dung phát sinh cần mô tả việc thay đổi, lý do, dữ liệu đối chiếu, tác động chi phí và tiến độ. Các bên nên chỉ định người có quyền chấp thuận cùng cách ghi nhận trước khi thực hiện phần việc mới.', 'Khi bàn giao, đối chiếu phạm vi đã hoàn thành với báo giá và các thay đổi được chấp thuận. Nếu có chênh lệch, giữ mã lô hàng, chứng từ liên quan và nội dung phản hồi để trao đổi với đúng đầu mối. Không chỉ đối chiếu một tổng tiền mà bỏ qua các công việc cấu thành.'] },
      { heading: 'Năm câu hỏi nên chốt với người phụ trách', body: ['Báo giá đang tính cho dữ liệu hàng hóa và phạm vi nào? Điểm giao cuối cùng ở đâu? Những khoản nào đang dự kiến hoặc chưa gồm? Hồ sơ bàn giao được xác nhận theo phương án nào? Nếu thay đổi, ai duyệt và dùng phiên bản báo giá nào?', 'Một báo giá rõ giúp cả hai bên biết việc cần làm và điều kiện để thực hiện. Các nội dung trên là khung trao đổi thực tế, không phải bảng giá, kết luận thuế hoặc thay thế hợp đồng cho một lô hàng cụ thể.'] },
    ],
  },
]

export const commonFAQs: (FAQ & { href: string })[] = [
  { q: 'Tôi cần gửi gì để được tư vấn?', a: 'Bắt đầu bằng ảnh hoặc đường dẫn sản phẩm, số lượng, điểm nhận tại Trung Quốc, điểm giao tại Việt Nam và nhu cầu hồ sơ. Nếu có, gửi thêm vật liệu, model, kích thước kiện và ngày sẵn hàng. Thông tin chưa chắc chắn nên ghi là dự kiến; người tiếp nhận sẽ trao đổi dữ liệu cần bổ sung theo mặt hàng.', href: '/kien-thuc/chuan-bi-thong-tin-lo-hang' },
  { q: 'Đã có nhà cung cấp thì TBS hỗ trợ gì?', a: 'Anh/chị có thể trao đổi phần việc cần hỗ trợ như nhận hàng, kiểm đếm, vận chuyển và hồ sơ. Nêu rõ việc nhà cung cấp hoặc doanh nghiệp đã tự thực hiện. Phạm vi tiếp nhận, bên thực hiện và kết quả bàn giao được xác nhận theo lô sau bước kiểm tra đầu vào.', href: '/dich-vu/nhap-khau-chinh-ngach' },
  { q: 'Chưa có nhà cung cấp thì bắt đầu ra sao?', a: 'Chuẩn bị tiêu chí sản phẩm, mẫu hoặc ảnh, quy mô đặt hàng và yêu cầu giao dịch. TBS trao đổi phạm vi tìm nguồn, đối chiếu thông tin và việc lấy mẫu nếu cần. Kết quả sàng lọc cần ghi rõ giới hạn kiểm tra, không thay thế tiêu chí nghiệm thu của đơn hàng.', href: '/dich-vu/tim-nguon-kiem-tra-nha-cung-cap' },
  { q: 'Chi phí được xác định trên cơ sở nào?', a: 'Chi phí phụ thuộc hàng hóa, số lượng, đóng gói, điểm nhận và giao, phạm vi thuê dịch vụ và thời điểm thực hiện. Báo giá cần thể hiện công việc đã gồm, chưa gồm, đơn vị tính và điều kiện áp dụng. Khoản còn dự kiến cần được nhận diện để kiểm tra lại trước khi chốt.', href: '/chi-phi-chung-tu' },
  { q: 'Bao lâu nhận được phương án hoặc báo giá?', a: 'Thời điểm phản hồi phụ thuộc mức độ đầy đủ của thông tin và các nội dung cần kiểm tra. Sau khi tiếp nhận, đề nghị đầu mối nêu phần còn thiếu, bước tiếp theo và mốc phản hồi phù hợp. Website không áp dụng một thời hạn báo giá cố định cho mọi sản phẩm.', href: '/quy-trinh' },
  { q: 'Khi nào dùng phương án ủy thác?', a: 'Đây là phương án cần xem xét khi doanh nghiệp muốn giao phần việc nhập khẩu theo hợp đồng ủy thác. Việc lựa chọn cần dựa trên chủ thể giao dịch, sản phẩm, trách nhiệm và nhu cầu hồ sơ. Hãy trao đổi trường hợp cụ thể để làm rõ vai trò trước khi ký.', href: '/dich-vu/uy-thac-nhap-khau' },
  { q: 'Bộ chứng từ bàn giao gồm những gì?', a: 'Danh mục phụ thuộc phương án giao dịch và lô hàng thực tế. Cần xác nhận tên giấy tờ, chủ thể đứng tên, bên cung cấp, dạng bản bàn giao và thời điểm nhận. Không có một danh sách giấy tờ mặc định áp dụng cho toàn bộ dịch vụ trên website.', href: '/chi-phi-chung-tu#chung-tu' },
  { q: 'Thay đổi hoặc phát sinh được xử lý thế nào?', a: 'Gửi nội dung thay đổi cho đầu mối phụ trách cùng mã lô hàng và dữ liệu đối chiếu. Các bên xem xét ảnh hưởng đến công việc, hồ sơ, chi phí và tiến độ, sau đó xác nhận phương án cập nhật theo thỏa thuận. Người có quyền phê duyệt cần được chỉ định ngay từ đầu.', href: '/chinh-sach/dich-vu' },
]

export const preparationBrief = [
  'Tôi muốn trao đổi phương án nhập hàng với TBS GROUP.',
  'Sản phẩm / đường dẫn / model:',
  'Vật liệu, công dụng và thông số:',
  'Số lượng / số kiện / kích thước / khối lượng:',
  'Nhà cung cấp và nơi nhận tại Trung Quốc:',
  'Nơi giao tại Việt Nam:',
  'Ngày sẵn hàng và thời điểm cần nhận:',
  'Chủ thể giao dịch và nhu cầu hồ sơ:',
  'Phần việc cần TBS hỗ trợ:',
  'Thông tin còn cần kiểm tra:',
].join('\n')

export const legacyServiceAliases: Record<string, string> = {
  'gom-hang-le-ghep-container': 'gom-hang-kiem-dem',
  'van-chuyen-quoc-te': 'van-chuyen-trung-viet',
  'uy-thac-xuat-nhap-khau': 'uy-thac-nhap-khau',
  'tu-van-phap-ly-thue-xnk': 'thu-tuc-hai-quan',
  'kiem-tra-nha-cung-cap': 'tim-nguon-kiem-tra-nha-cung-cap',
  'thanh-toan-ho-trung-quoc': 'nhap-khau-chinh-ngach',
  'thong-quan-chung-tu': 'thu-tuc-hai-quan',
  'dong-goi-bao-hiem-hang': 'van-chuyen-trung-viet',
  'kho-bai-trung-viet': 'gom-hang-kiem-dem',
  'canh-bao-rui-ro-xnk': 'thu-tuc-hai-quan',
  'xuat-khau-hang-hoa': 'nhap-khau-chinh-ngach',
  'van-chuyen-logistics': 'van-chuyen-trung-viet',
  'thong-quan-hai-quan': 'thu-tuc-hai-quan',
  'kiem-tra-chat-luong': 'gom-hang-kiem-dem',
  'bao-hiem-hang-hoa': 'van-chuyen-trung-viet',
  'tu-van-thuong-mai': 'tim-nguon-kiem-tra-nha-cung-cap',
  'dich-vu-kho-bai': 'gom-hang-kiem-dem',
}

export const publicPages = [
  { path: '/', title: 'TBS GROUP' },
  { path: '/gioi-thieu', title: 'Về TBS GROUP' },
  { path: '/nang-luc-van-hanh', title: 'Năng lực vận hành' },
  { path: '/dich-vu', title: 'Dịch vụ' },
  { path: '/nganh-hang', title: 'Ngành hàng' },
  { path: '/quy-trinh', title: 'Quy trình phối hợp' },
  { path: '/chi-phi-chung-tu', title: 'Chi phí & chứng từ' },
  { path: '/kien-thuc', title: 'Kiến thức nhập hàng' },
  { path: '/hoi-dap', title: 'Hỏi đáp' },
  { path: '/lien-he', title: 'Liên hệ' },
  { path: '/chinh-sach/bao-mat', title: 'Thông tin về dữ liệu và quyền riêng tư' },
  { path: '/chinh-sach/dieu-khoan', title: 'Điều khoản sử dụng website' },
  { path: '/chinh-sach/dich-vu', title: 'Nguyên tắc thỏa thuận dịch vụ' },
  ...services.map(item => ({ path: `/dich-vu/${item.slug}`, title: item.title })),
  ...industryCategories.map(item => ({
    path: `/nganh-hang/${item.slug}`,
    title: item.title,
  })),
  ...industries.map(item => ({
    path: `/nganh-hang/${item.categorySlug}/${item.slug}`,
    title: item.title,
  })),
  ...articles.map(item => ({ path: `/kien-thuc/${item.slug}`, title: item.title })),
]
