# Kế hoạch hoàn thiện nội dung demo nhaphangchinhngach.vn

> **For agentic workers:** Khi chủ dự án duyệt phạm vi, dùng superpowers:executing-plans để thực hiện từng hạng mục. Đây là kế hoạch biên tập, không phải lệnh sửa mã, xuất bản hay triển khai ngay. Checklist chưa đánh dấu là công việc chưa thực hiện.

**Goal:** Hoàn thiện 24 trang demo thành bộ nội dung giới thiệu TBS đáng tin, giúp khách chọn đúng dịch vụ và chuẩn bị tốt cho cuộc trao đổi trực tiếp với sale.

**Architecture:** Lấy thông tin doanh nghiệp được xác nhận làm nền; mỗi trang giải quyết một nhu cầu chính và chỉ dùng các khẳng định có căn cứ. Soạn, duyệt nghiệp vụ, đưa vào bản nháp TBS Studio, xem trước rồi mới duyệt hiển thị trên demo. Giữ thiết kế, URL và luồng gọi/Zalo hiện có.

**Tech Stack:** TBS Studio hiện có, Next.js/React, dữ liệu nội dung SQLite; Markdown cho hồ sơ biên tập, CSV cho kiểm kê và nghiên cứu. Không cần mua công cụ hoặc kết nối AI trả phí để bắt đầu.

**Spec:** Kế thừa mục tiêu và ma trận nội dung trong `F:/01_TBS_GROUP/docs/superpowers/specs/2026-09-26-tbs-website-content.md` và quy tắc bán hàng trong `F:/01_TBS_GROUP/docs/superpowers/specs/2026-09-26-tbs-website-sales-acceptance.md`. Tài liệu này cụ thể hóa đợt hoàn thiện 24 trang đang chạy, không tự mở rộng sang toàn bộ 33 trang từng đề xuất.

**Trạng thái:** Đề xuất chờ anh duyệt, ngày 27/09/2026. Đã kiểm kê HTML của 24 URL demo và đọc sâu các trang giới thiệu, năng lực, liên hệ cùng cấu trúc dữ liệu. Chưa sửa nội dung CMS; chưa thực hiện nghiên cứu 100 doanh nghiệp; chưa xác minh nghiệp vụ hoặc năng lực TBS.

**Cập nhật từ anh ngày 27/09:** Ưu tiên nghiên cứu kênh [TikTok @tbslogistics](https://www.tiktok.com/@tbslogistics) làm nguồn nội dung TBS trước khi viết lại website. Đã đọc hồ sơ và danh sách 14 playlist qua trình duyệt. Sau đó anh cung cấp 4 video gốc ngày 23-25/09/2026; đã xử lý cục bộ đủ 4 video, tổng 314,14 giây, tạo phụ đề/ảnh tổng quan và bản phân tích tại `F:/01_TBS_GROUP/11.Du_An/tbs-content-sources/tiktok/2026-09-23-25/`. Kết quả nhận dạng còn lỗi tên riêng/thuật ngữ và các claim chưa được nghiệp vụ duyệt, nên chưa dùng trực tiếp làm nội dung public. Quy trình khai thác được bổ sung ở mục 7A; nghiên cứu đối thủ là lớp đối chiếu bổ sung, không thay tiếng nói và tư liệu thật của TBS.

## 1. Phạm vi và nguyên tắc

- Đích làm việc là demo `http://127.0.0.1:4173/`, không phải website production đang phục vụ khách. Không đổi DNS, triển khai, bật index hoặc thay ngân sách quảng cáo.
- Không thêm form thu lead. Điện thoại/Zalo là kênh chính; website chuẩn bị thông tin và tạo niềm tin trước khi khách liên hệ.
- Tạm ưu tiên doanh nghiệp vừa và nhỏ nhập hàng thường xuyên; có hướng dẫn riêng cho khách mới nhập lần đầu. Đây là giả định chờ anh xác nhận, không phải kết quả nghiên cứu khách hàng.
- Giữ màu logo, bố cục tổng thể và hiệu ứng đã có. Chỉ đề xuất thay cấu trúc khối khi nội dung cần mà mẫu hiện tại không đáp ứng.
- Không bịa số năm kinh nghiệm, số khách hàng, sản lượng, kho, đội xe, tuyến vận chuyển, đối tác, đánh giá, case hoặc thời gian phản hồi.
- Không tự công bố mức phí, thuế, mã HS, giấy phép, thời gian thông quan, mức bồi thường hay khả năng nhận hàng. Nội dung này cần nguồn phù hợp, điều kiện áp dụng và người duyệt chuyên môn.
- Ảnh minh họa không phải bằng chứng hoạt động TBS. Ảnh khách hàng, con người, hồ sơ và đối tác phải có quyền công bố; che dữ liệu nhạy cảm trước khi đưa vào bản public.
- Không coi lượt bấm gọi/Zalo là cuộc trao đổi hoặc khách hàng mới. Không hứa thứ hạng, lưu lượng hay tăng trưởng khi chưa có dữ liệu cơ sở.
- Không sửa trực tiếp SQLite, không ghi đè bản nháp của người khác, không thay nội dung đang dùng chỉ bằng sửa seed trong mã nguồn.
- Không commit, push, gọi AI trả phí hoặc xuất bản production trong phạm vi kế hoạch này.

## 2. Nhận xét về demo hiện tại

Kiểm tra ngày 27/09/2026: cả 24 URL trong danh mục hiện có trả HTTP 200. Đây là bằng chứng truy cập được, không phải kết luận nội dung đúng nghiệp vụ hoặc đã đạt chuẩn phát hành.

| Quan sát | Nhận định biên tập | Hướng xử lý |
| --- | --- | --- |
| Có 13 trang cố định, 6 dịch vụ, 3 ngành hàng, 2 bài kiến thức | Khung đã đủ để xây nội dung có chiều sâu | Làm kỹ bộ hiện có trước khi mở rộng số lượng |
| Sáu trang dịch vụ đã có đối tượng, phạm vi, đầu vào, giới hạn và FAQ | Nền thông tin hữu ích, không phải trang trống | Giữ phần đúng; tăng ví dụ, đầu ra cụ thể và sự khác biệt giữa dịch vụ |
| Các cụm “trao đổi”, “phối hợp”, “xác nhận theo lô” xuất hiện nhiều | Văn phong thận trọng nhưng lợi ích và năng lực riêng của TBS chưa nổi bật | Viết theo nhu cầu, hành động và kết quả; đặt điều kiện ở đúng chỗ, giảm lặp |
| Trang giới thiệu chủ yếu nói nguyên tắc làm việc | Chưa đủ thông tin để khách kiểm tra TBS là doanh nghiệp nào | Bổ sung hồ sơ pháp nhân, con người và bối cảnh doanh nghiệp được xác nhận |
| Trang năng lực mô tả quy trình; ảnh đang mang tính minh họa | Chưa có bộ bằng chứng vận hành được đối chiếu trong lần rà soát này | Thu ảnh thật, đầu mối, mẫu đầu ra và phạm vi trực tiếp/đối tác |
| Trang liên hệ có điện thoại, Zalo, email và mẫu chuẩn bị thông tin | Có luồng liên hệ; trong nội dung đã đọc chưa thấy địa chỉ, lịch trực được xác nhận | Xác minh đầu mối, giờ tiếp nhận và địa điểm có thể công bố |
| Ba trang ngành hàng nói về dữ liệu cần chuẩn bị | Hữu ích nhưng còn thiếu tình huống và hình sản phẩm đặc thù | Viết riêng theo rủi ro và cách phối hợp của từng nhóm |
| Hai bài kiến thức đã có nhiều mục và nội dung thực chất | Vấn đề không chỉ là viết dài hơn | Bổ sung ví dụ, công cụ đối chiếu, nguồn và người duyệt phù hợp |

Chưa thực hiện kiểm toán toàn bộ website production, Search Console, từ khóa, quảng cáo hoặc hệ thống sale. Không dùng nhận xét trên để kết luận hiệu quả kinh doanh hiện tại.

## 3. Hướng làm đề xuất

| Phương án | Lợi ích | Giới hạn |
| --- | --- | --- |
| Chỉ chỉnh câu chữ trên 24 trang | Nhanh, ít phụ thuộc tài liệu | Không giải quyết thiếu bằng chứng và thông tin doanh nghiệp |
| **Nghiên cứu, xác minh rồi làm sâu 24 trang** | Phục vụ đồng thời khách hàng, sale và SEO; kiểm soát được chất lượng | Cần đầu mối TBS duyệt và cung cấp tư liệu; đây là phương án đề xuất |
| Mở rộng ngay nhiều bài SEO/ngành hàng | Có thêm chủ đề để khai thác | Dễ lặp và loãng nếu nền doanh nghiệp chưa rõ; để đợt sau |

Định hướng biên tập đề xuất: **giúp doanh nghiệp biết việc cần làm, biết ai phụ trách và biết căn cứ để quyết định**. Giữ “Rõ phương án. Rõ chi phí. Rõ trách nhiệm.” nếu anh vẫn chọn thông điệp này, nhưng mỗi ý phải đi kèm cách làm và bằng chứng thay vì chỉ lặp khẩu hiệu.

## 4. Tài liệu đầu vào cần TBS xác nhận

| Bộ tài liệu | Nội dung tối thiểu | Người xác nhận | Khi chưa có |
| --- | --- | --- | --- |
| Doanh nghiệp | Tên pháp nhân, MST, tên thương hiệu, địa chỉ, kênh liên hệ, phạm vi được công bố | Anh/đại diện doanh nghiệp | Không suy diễn từ tên TBS hoặc doanh nghiệp trùng tên |
| Dịch vụ | Những việc đang nhận, việc không nhận, trực tiếp hay qua đối tác, đầu ra bàn giao | Vận hành/XNK | Chỉ giữ mô tả đã được duyệt; không mở rộng năng lực |
| Chi phí và hồ sơ | Một mẫu báo giá, một danh mục hồ sơ và cách duyệt phát sinh đã bỏ dữ liệu khách | Sales, kế toán, XNK | Dùng khung câu hỏi; không tự điền giá, thuế hoặc danh sách giấy tờ bắt buộc |
| Con người và hoạt động | Ảnh gốc, vai trò, địa điểm, thời điểm chụp, quyền sử dụng | Vận hành/Marketing | Giữ nhãn minh họa, không ghi ảnh là cơ sở TBS |
| Kinh nghiệm thực tế | Ba hồ sơ lô hàng ứng viên, việc đã làm, vấn đề, kết quả có thể chứng minh | Chủ hồ sơ/khách hàng khi cần | Không xuất bản case hoặc testimonial |
| Sale | Khoảng 20 cuộc trao đổi đã ẩn danh hoặc tổng hợp câu hỏi, lý do khách do dự, lý do mất cơ hội | Trưởng sale | Phỏng vấn sale để tạo giả thuyết, không gọi đó là dữ liệu thị trường |
| Pháp lý và dữ liệu | Điều kiện dịch vụ đang dùng, người xử lý khiếu nại/dữ liệu, công cụ thực tế trên web | Người phụ trách tương ứng | Chưa nghiệm thu chính sách để phát hành công khai |

Tư liệu chưa ẩn danh giữ trong thư mục riêng được kiểm soát, không đưa vào Git hoặc thư viện public. Hồ sơ biên tập chỉ lưu mã bằng chứng và bản được phép sử dụng.

## 5. Ma trận làm kỹ 24 trang

P1 là đợt trọng tâm sau khi duyệt mẫu; P2 là phần hoàn thiện tiếp theo. P2 không có nghĩa được bỏ qua để phát hành.

| # | URL hiện có | Nhiệm vụ cần hoàn thiện | Bằng chứng/đầu ra cần có | Ưu tiên |
| --- | --- | --- | --- | --- |
| 01 | `/` | Trong lượt đọc đầu khách hiểu TBS, nhu cầu phù hợp, lý do trao đổi và bước tiếp theo | Thông điệp ngắn, 4 lối vào nhu cầu, bằng chứng đã duyệt, CTA trực tiếp | Mẫu/P1 |
| 02 | `/gioi-thieu/` | Giới thiệu doanh nghiệp cụ thể, tránh bài “sứ mệnh” chung chung | Pháp nhân, bối cảnh, vai trò đội ngũ, cách hợp tác, thông tin đối chiếu | P1 |
| 03 | `/nang-luc-van-hanh/` | Chứng minh TBS tổ chức công việc ra sao | Phân biệt trực tiếp/đối tác; ảnh thật và mẫu đầu ra có ngữ cảnh | P1 |
| 04 | `/dich-vu/` | Giúp khách phân biệt sáu dịch vụ và chọn điểm bắt đầu | Mỗi dịch vụ có tình huống, phạm vi và liên kết chi tiết khác nhau | P1 |
| 05 | `/nganh-hang/` | Giúp khách nhận diện nhóm sản phẩm và thông tin cần chuẩn bị | Ba nhóm đã xác minh, điểm khác biệt, hướng trao đổi ngoài danh mục | P2 |
| 06 | `/quy-trinh/` | Mỗi bước trả lời khách làm gì, TBS làm gì, nhận được gì | Năm bước, đầu vào/đầu ra, điều kiện chuyển bước và cách xử lý thay đổi | P1 |
| 07 | `/chi-phi-chung-tu/` | Giúp khách đọc và so sánh báo giá cùng phạm vi | Mẫu báo giá đã ẩn danh hoặc ví dụ giả định ghi rõ; phân biệt xác định/dự kiến/chưa gồm | Mẫu/P1 |
| 08 | `/kien-thuc/` | Đưa khách tới câu trả lời phù hợp thay vì danh sách bài ngẫu nhiên | Nhóm chủ đề theo nhu cầu, giới thiệu rõ từng bài, chỉ liên kết nội dung có thật | P2 |
| 09 | `/hoi-dap/` | Giải quyết những câu hỏi lặp lại trong tư vấn | Bộ câu hỏi từ sale, câu trả lời ngắn trước, điều kiện và link chi tiết sau | P1 |
| 10 | `/lien-he/` | Khách biết gọi ai, gửi gì, tiếp theo sẽ được xử lý thế nào | Kênh đã xác nhận, lịch tiếp nhận/địa chỉ nếu có, brief gọn, không hứa SLA chưa duyệt | P1 |
| 11 | `/chinh-sach/bao-mat/` | Mô tả đúng việc thu thập và sử dụng dữ liệu thực tế | Kiểm kê công cụ, mục đích xử lý, kênh thực hiện quyền, người duyệt | P2 |
| 12 | `/chinh-sach/dieu-khoan/` | Phân biệt thông tin tham khảo với thỏa thuận giao dịch | Điều kiện sử dụng và giới hạn đúng; không mâu thuẫn dịch vụ/hợp đồng | P2 |
| 13 | `/chinh-sach/dich-vu/` | Giải thích nguyên tắc làm việc và xử lý phát sinh | Phạm vi, phê duyệt, bàn giao, phản hồi; đối chiếu tài liệu dịch vụ đang dùng | P2 |
| 14 | `/dich-vu/nhap-khau-chinh-ngach/` | Trang dịch vụ chủ lực, tổng hợp phương án theo nhu cầu | Khách phù hợp, việc TBS nhận, đầu ra, ví dụ có điều kiện và FAQ | Mẫu/P1 |
| 15 | `/dich-vu/uy-thac-nhap-khau/` | Làm rõ vai trò và trách nhiệm khi xem xét ủy thác | Bên nào làm gì, hồ sơ/phê duyệt, tình huống cần chuyên môn xác nhận | P1 |
| 16 | `/dich-vu/van-chuyen-trung-viet/` | Giải thích phạm vi giao nhận và cơ sở tính cước | Điểm đầu/cuối, quy cách kiện, cách tính, mốc cập nhật theo vận hành thực tế | P1 |
| 17 | `/dich-vu/gom-hang-kiem-dem/` | Làm rõ gom nhiều NCC và mức độ kiểm đếm | Bảng nhận diện đơn, mẫu báo lệch, ảnh nhận/đóng kiện; phân biệt kiểm đếm với QC | P1 |
| 18 | `/dich-vu/tim-nguon-kiem-tra-nha-cung-cap/` | Giải thích việc kiểm tra có thể và không thể kết luận | Tiêu chí nguồn, mẫu báo cáo, lấy mẫu, giới hạn và bước khách quyết định | P1 |
| 19 | `/dich-vu/thu-tuc-hai-quan/` | Giúp khách chuẩn bị đúng dữ liệu và hiểu phạm vi hỗ trợ | Mẫu thông tin kỹ thuật, phân công chuyên môn, nguồn chính thức cho nội dung pháp lý | P1 |
| 20 | `/nganh-hang/gia-dung-khong-dien/` | Tập trung vật liệu, công dụng và đóng gói của nhóm sản phẩm | Ví dụ sản phẩm rõ, điểm cần kiểm tra riêng, checklist theo nhóm | P2 |
| 21 | `/nganh-hang/noi-that-phu-kien/` | Tập trung cấu kiện, vật liệu, đóng kiện và bảo vệ bề mặt | Ảnh sản phẩm/kiện có quyền dùng, ví dụ danh sách phụ kiện, điều kiện giao nhận | P2 |
| 22 | `/nganh-hang/may-moc-moi/` | Tập trung model, catalogue, thông số và nâng hạ | Bộ dữ liệu mẫu đã duyệt, giới hạn với máy cũ/thiết bị đặc thù nếu đề cập | P2 |
| 23 | `/kien-thuc/chuan-bi-thong-tin-lo-hang/` | Trở thành tài liệu sale có thể gửi ngay cho khách | Ví dụ “thông tin thiếu/thông tin đủ”, checklist, brief ngắn không chứa PII | P1 |
| 24 | `/kien-thuc/doc-bao-gia-nhap-khau/` | Giúp khách tự đối chiếu một báo giá | Ví dụ hai phạm vi khác nhau, câu hỏi đối chiếu, khoản chưa xác định và mốc xác nhận | P1 |

## 6. Chuẩn một trang nội dung hoàn chỉnh

Mỗi trang có một hồ sơ biên tập gồm: URL, nhóm khách, ý định chính, câu hỏi cần trả lời, thông điệp, dàn ý, bản viết, bằng chứng, ảnh/quyền sử dụng, SEO, liên kết nội bộ, CTA, người duyệt và lịch sử sửa.

### Trang dịch vụ

1. Mở đầu: khách đang gặp việc gì, TBS có thể nhận phần nào trong phạm vi được xác nhận.
2. Trường hợp phù hợp và trường hợp cần kiểm tra thêm; tránh nhận mọi loại hàng.
3. Việc khách cần làm, việc TBS nhận và phần đối tác thực hiện.
4. Kết quả bàn giao cụ thể: thông tin, báo giá, hình ảnh, báo cáo hoặc hồ sơ nào đã được phê duyệt là đầu ra của dịch vụ.
5. Trình tự và điểm khách phải xác nhận, không chỉ danh sách “bước 1, bước 2”.
6. Cơ sở chi phí, phần chưa bao gồm, điều kiện thay đổi; dẫn tới trang chi phí thay vì chép lại toàn bộ.
7. Tình huống thực tế có bằng chứng hoặc tình huống giả định được ghi rõ; không biến giả định thành case TBS.
8. Khoảng 4-6 câu hỏi đặc thù của dịch vụ, trả lời trực tiếp rồi mới nêu giới hạn cần thiết.
9. Bước liên hệ với danh sách thông tin ngắn, ưu tiên dữ liệu tối thiểu để bắt đầu.

Đây là cấu trúc biên tập, không bắt buộc tạo chín khối giao diện mới. Ánh xạ vào các trường hiện có trước; nhu cầu cấu trúc vượt mẫu được ghi nhận riêng.

### Trang thương hiệu và năng lực

“TBS là ai” phải có dữ liệu nhận diện doanh nghiệp. “TBS làm tốt điều gì” cần việc thực tế hoặc tài liệu được phép công bố. “TBS làm thế nào” thể hiện trách nhiệm và đầu ra. Không dùng ảnh cảng, container hoặc bản đồ làm bằng chứng sở hữu cơ sở, tuyến hay đội xe.

### Trang ngành hàng và kiến thức

Mở bằng tình huống/sản phẩm cụ thể, trả lời câu hỏi chính trước, giải thích thuật ngữ khi cần. Một nhóm hàng phải có thông tin khác biệt thực chất; không thay tên sản phẩm trong cùng một bài. Không gộp kết luận cho mọi mặt hàng cùng tên thương mại. Nội dung có yếu tố thuế, hải quan và chính sách phải được rà soát riêng theo ngày áp dụng.

### Giọng văn

- Chuyên nghiệp, rõ và có chủ thể: ai làm, làm gì, để giải quyết việc gì.
- Chuyển thuật ngữ nội bộ thành câu khách dễ dùng; giải thích NCC, catalogue, model hoặc chứng từ khi cần.
- Câu mở ưu tiên nhu cầu/lợi ích thực, không mở hàng loạt đoạn bằng “TBS cam kết”.
- Điều kiện phải cụ thể và đặt cạnh điều được giới hạn; không xóa cảnh báo cần thiết để câu nghe mạnh hơn.
- Không chạy theo số từ hay mật độ từ khóa. Đo mức đủ bằng câu hỏi đã giải quyết và dữ liệu đã kiểm tra.

Ví dụ minh họa cách viết, chưa phải nội dung được duyệt: thay “Trao đổi để xác định các phần việc cần phối hợp” bằng “Đã có nhà cung cấp tại Trung Quốc? Chuẩn bị thông tin hàng, nơi nhận và nơi giao để TBS kiểm tra phần việc có thể tiếp nhận, dữ liệu còn thiếu và cơ sở lập phương án.” Khi đã có bằng chứng về đầu ra thực tế, mới viết cụ thể hơn về kết quả khách sẽ nhận.

## 7. Nghiên cứu 100 doanh nghiệp và câu hỏi khách hàng

Yêu cầu nghiên cứu 100 doanh nghiệp trước đây **chưa có bộ dữ liệu hoàn tất được xác minh**. Kế hoạch này đưa nghiên cứu thành một hạng mục riêng, không gọi nhận xét hiện tại là kết quả khảo sát đó.

- Lập danh sách ứng viên rộng hơn 100; nghiệm thu 100 doanh nghiệp độc lập có bằng chứng công khai đang giới thiệu dịch vụ phù hợp với hành trình nhập hàng Trung Quốc - Việt Nam. Phân biệt doanh nghiệp dịch vụ với doanh nghiệp chỉ nhập hàng để bán/sản xuất.
- Chia nhóm chức năng: dịch vụ tổng thể/ủy thác, vận chuyển, gom hàng/kiểm đếm, tìm nguồn, thủ tục/chuyên ngành. Nhãn nhóm có thể trùng; không đặt quota khiến phải điền doanh nghiệp không phù hợp.
- Mỗi doanh nghiệp có tên, domain, thông tin định danh có thể kiểm tra, nhóm dịch vụ, trang nguồn, ngày truy cập, thông điệp, bằng chứng trình bày, câu hỏi khách được giải quyết và điểm thiếu.
- Một doanh nghiệp nhiều domain chỉ tính một; tách thương hiệu, chi nhánh và công ty độc lập. Tên gần giống không được tự gộp. `nhapkhauchinhngach.vn` không phải domain TBS đang làm.
- Loại bản trùng, directory tổng hợp và website không đủ bằng chứng hoạt động trong phạm vi. Dòng thiếu chứng cứ giữ ở danh sách ứng viên, không cộng vào 100 đã kiểm chứng.
- Website đối thủ chỉ chứng minh họ đang công bố thông tin đó, không tự chứng minh năng lực, giá, giấy phép hay kết quả là đúng. Không dùng làm nguồn pháp lý.
- Đọc sâu 20 doanh nghiệp liên quan nhất về phân khúc, dịch vụ và mức độ nội dung; lưu tiêu chí chọn. Không chép bài, ảnh hoặc lời hứa thương mại.
- Tổng hợp thành khoảng 10 khoảng trống nội dung có nguồn đối chiếu, rồi ưu tiên theo dịch vụ TBS thực sự cung cấp và câu hỏi sale gặp. Không chỉ chấm giao diện đẹp.
- Kết hợp buổi trao đổi với sale và vận hành. Từ khóa/tình huống chưa có dữ liệu nhu cầu được gắn nhãn giả thuyết; không bịa volume, traffic hoặc mức cạnh tranh.

Đầu ra: danh mục có nguồn và trạng thái xác minh, 20 bản phân tích sâu, bảng khoảng trống và bản đồ chủ đề/URL. Không liên hệ hoặc gửi tin cho doanh nghiệp được nghiên cứu.

## 7A. Khai thác TikTok TBS trước khi viết ba trang mẫu

### Kết quả truy cập ban đầu, không phải phân tích video

Ngày 27/09/2026, trình duyệt đọc được tên tài khoản doanh nghiệp, mô tả định hướng vận tải Trung Quốc - Việt Nam và 14 playlist tại [kênh anh cung cấp](https://www.tiktok.com/@tbslogistics). Các nhóm chủ đề thấy được gồm hoạt động container/kho, làm việc với nhà máy và nhà cung cấp, nhập khẩu và lưu ý nghiệp vụ, đội ngũ, nội dung theo địa bàn và nhóm hàng. Đây mới là tên nhóm nội dung; chưa xác minh điều gì xuất hiện trong từng clip.

Nguồn liên kết đối chiếu: [website TBS](https://xuatnhapkhautbs.vn/giai-phap-van-chuyen-trung-viet-bang-duong-sat.html) có dẫn tới cùng tài khoản. Việc có liên kết chỉ hỗ trợ nhận diện kênh, không xác minh mọi tuyên bố trong bài hoặc video. Bằng chứng giao diện của lần truy cập được lưu tại `artifacts/tbs-tiktok-profile-2026-09-27.png`.

Công cụ đọc web bị robots chặn; trình duyệt đọc được hồ sơ/playlist nhưng TikTok đưa CAPTCHA trước danh sách video. Đã dừng ở rào xác minh, không tự giải hoặc vượt CAPTCHA. Anh sau đó cung cấp 4 file local. Bốn file đã được tách âm thanh, nhận dạng tiếng Việt và kiểm tra contact sheet; không đọc bình luận và không khẳng định hiệu quả kênh. Đây là mẫu ban đầu, không đại diện toàn bộ kênh.

Kết quả mẫu đầu tiên: video Thổ Tang xác định nhóm câu hỏi trước khi chuyển sang chính ngạch; video hồ sơ nhấn mạnh chuẩn bị dữ liệu trước khi mua; video “thực chiến” cho thấy mối liên hệ giữa văn phòng và hiện trường; video mở kiện đặt ra yêu cầu mô tả rõ quyền/phạm vi kiểm đếm. Chi tiết và sổ claim nằm trong `analysis.md` và `source-register.csv` ở thư mục nguồn nói trên.

### Cập nhật thư viện Creator TBS 2026

Anh đã cung cấp thêm thư mục `F:/tbs video/Creator_tbslogistics`. Đã kiểm kê 140 video, tổng 12.515,44 giây, khoảng 208,6 phút. Kết quả phân nhóm và danh sách 35 video ưu tiên nằm tại `F:/01_TBS_GROUP/11.Du_An/tbs-content-sources/tiktok/creator-library-2026/analysis.md`; bảng nguồn đầy đủ nằm tại `source-register.csv` cùng thư mục.

Kết luận mới: thư viện đủ dày để xây website bằng chất liệu TBS thật. Trục nội dung nên chia thành sáu lớp: bằng chứng vận hành thật; giáo dục nhập khẩu chính ngạch; cảnh báo rủi ro; trang ngành hàng/SEO; nguồn hàng và nhà cung cấp Trung Quốc; con người/văn hóa TBS. Nhóm visual mạnh nhất để đưa lên trang chủ/năng lực là các clip sang tải, container, xe thùng, pallet, pin, máy móc và kho. Nhóm ngồi nói về thuế, QCVN, ủy thác, hóa đơn rất tốt cho FAQ/blog/sales script nhưng không nên làm visual đầu trang.

Các video nên ưu tiên khai thác sâu trước khi viết lại demo: `20260922_7688137766668111111` cho sang tải/hàng thật; `20260506_7636604665626610964` cho pin/lithium; `20260512_7638849986385497365` cho hàng gia dụng; `20260516_7640303863655828756` cho máy móc/linh kiện; `20260730_7668285234558995732`, `20260911_7684127670883323144`, `20260403_7624540261116431636`, `20260716_7663106233225776404`, `20260918_7686842136712580373` cho cảnh báo và FAQ nghiệp vụ. Chưa dùng các claim như “trọn gói”, “đứng tên”, “chịu trách nhiệm pháp lý”, “20 tỷ”, “150m3” hoặc nội dung pháp lý/thông tư nếu chưa được người phụ trách TBS duyệt.

### Cách nghiên cứu khi có video truy cập được

- [ ] Kiểm kê video theo URL/ID hoặc tên file; lưu ngày đăng nếu biết, thời lượng và playlist. Một clip ở nhiều playlist chỉ tính một lần. Không suy ra tổng video bằng cộng số bài của playlist.
- [ ] Chọn mẫu khởi đầu 20 video nếu nguồn đủ, phủ cả vận hành, nghiệp vụ, nhà cung cấp và con người. Ghi tiêu chí và số thực có; mẫu này không đại diện toàn bộ kênh và không được gọi là đã xem hết.
- [ ] Xem/nghe đầy đủ từng clip được chọn; chép lời và kiểm tra lại tên người/địa điểm, số liệu, đơn vị, thuật ngữ. Đoạn không rõ phải đánh dấu, không đoán.
- [ ] Tách ba lớp: người nói tuyên bố gì; hình/âm thanh thực sự thể hiện gì; cần tài liệu nào xác minh thêm. Quay tại một kho/nhà máy không tự chứng minh TBS sở hữu nơi đó.
- [ ] Ghi mốc thời gian cho câu nói/cảnh quay có ích và giới hạn ngữ cảnh. Không dùng đoạn cắt khiến ý nghĩa khác bản gốc.
- [ ] Chỉ đọc và tổng hợp câu hỏi bình luận khi có quyền truy cập; không suy luận câu hỏi khách hàng từ tên video. Ẩn danh người bình luận và không đưa thông tin liên hệ khách vào hồ sơ public.
- [ ] Đối chiếu các thông tin thay đổi theo thời gian: địa chỉ, đầu mối, tuyến, thời gian, phí và quy định. Video cũ là nguồn lịch sử, không tự thành cam kết hiện tại.
- [ ] Kiểm tra quyền dùng hình người, khách hàng, đối tác và âm nhạc trước khi nhúng/tái sử dụng trên website; quyền đăng TikTok không mặc nhiên bao gồm mọi hình thức tái sử dụng.
- [ ] Tạo bảng ánh xạ video → ý chính → bằng chứng → claim cần duyệt → trang website → kiểu sử dụng. Chỉ dùng nội dung đã được duyệt để viết ba trang mẫu.

**Đầu ra dự kiến:** `docs/content/2026-09/tiktok-source-register.csv`, `tiktok-to-website-map.md` và bản mô tả giọng văn rút ra từ video đã thực sự xem. File video gốc và bản chép lời có dữ liệu riêng giữ ở nơi được kiểm soát, không mặc định đưa vào Git, AI bên ngoài hoặc thư viện public.

### Hướng ánh xạ cần kiểm tra bằng video

| Nhóm chủ đề quan sát từ playlist | Trang có thể sử dụng | Việc phải xác minh trước |
| --- | --- | --- |
| Container, tiếp nhận/giao hàng tại kho | Năng lực vận hành, vận chuyển, gom hàng | Địa điểm, thời điểm, vai trò TBS, phạm vi công việc và quyền dùng ảnh |
| Nhà máy, nhà sản xuất và nhà cung cấp | Tìm nguồn, ngành hàng, giới thiệu cách làm việc | Có chuyến làm việc thật nào, kiểm tra gì, đầu ra gì; không suy diễn sở hữu/độc quyền |
| Giải thích nhập khẩu và lưu ý nghiệp vụ | Hỏi đáp, quy trình, chi phí/chứng từ, kiến thức | Nội dung còn đúng ở thời điểm viết, phạm vi áp dụng và người duyệt chuyên môn |
| Đội ngũ và hoạt động kinh doanh | Giới thiệu, liên hệ, cách tổ chức công việc | Danh tính/vai trò được phép công bố và thông tin còn hiện hành |

Đây là giả thuyết phân bổ nội dung dựa trên tên nhóm, chưa phải kết luận sau xem video. Ưu tiên mới: tư liệu TBS/video → phỏng vấn và xác nhận → ba trang mẫu; nghiên cứu 100 doanh nghiệp có thể làm song song và bổ sung sau, không bắt buộc chờ đủ 100 mới viết được mẫu từ nguồn TBS đã duyệt.

## 8. SEO phục vụ nội dung

- Một URL có một ý định chính; dịch vụ tổng thể, ủy thác, vận chuyển và bài hướng dẫn có vai trò riêng, không viết nhiều bài cùng trả lời một câu hỏi.
- Mỗi trang có title, mô tả, H1 và đoạn mở phản ánh đúng nội dung; kiểm tra cách hiển thị thay vì xem giới hạn ký tự là bảo đảm Google sẽ dùng nguyên văn.
- Liên kết theo đường đi thực tế: câu hỏi khách → hướng dẫn/ngành hàng → dịch vụ phù hợp → thông tin cần chuẩn bị → gọi/Zalo.
- Liên kết nội bộ phải đúng đích đã hiển thị, không dẫn khách tới bài dự kiến hoặc bản nháp. Giữ URL hiện có; đổi slug phải có lý do và phương án chuyển hướng được duyệt.
- Alt mô tả đúng ảnh; tiêu đề chia sẻ và ảnh đại diện thống nhất nội dung. Không nhồi từ khóa trong alt hoặc giả danh ảnh TBS.
- Structured data chỉ mô tả thông tin thật có trên trang và kiểm tra hướng dẫn hiện hành khi triển khai. Không hứa FAQ sẽ có rich result, không tạo đánh giá/số sao giả.
- Hồ sơ biên tập phải lưu người viết/người duyệt, nguồn và ngày rà soát. Chỉ hiển thị tên/chức danh với sự đồng ý; nếu CMS chưa có trường phù hợp, ghi nhận là yêu cầu phát triển riêng.
- AI có thể hỗ trợ dàn ý, diễn đạt và kiểm tra tính nhất quán từ tài liệu được phép dùng; không là nguồn chứng minh năng lực hoặc kết luận pháp lý, không tự xuất bản. Không cần chờ kết nối AI để làm kế hoạch nội dung.

Tham chiếu đã đọc ngày 27/09/2026: Google ưu tiên nội dung hữu ích cho người đọc, có giá trị riêng và căn cứ đáng tin; không quy định một số từ tối ưu. Xem [hướng dẫn nội dung hữu ích](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). Việc dùng AI không thay thế yêu cầu về độ chính xác và giá trị; tạo nhiều trang ít giá trị có thể vi phạm chính sách. Xem [hướng dẫn nội dung AI](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content).

## 9. Triển khai trong CMS và giới hạn kỹ thuật

Nguồn hiển thị hiện tại là bản đã xuất bản trong TBS Studio, không chỉ `src/data/marketing.ts`. Bản nháp và bản đã xuất bản được tách biệt. Các trang cố định có tập trường được khai báo sẵn; sửa nội dung không đồng nghĩa thêm được khối giao diện bất kỳ.

| Nội dung | Nơi xử lý hiện có | Giới hạn cần giữ |
| --- | --- | --- |
| 13 trang cố định | Trường của trang trong Studio | Giữ ID, URL, danh mục trường và liên kết bắt buộc |
| 6 dịch vụ | Đối tượng, phạm vi, đầu vào, giới hạn, FAQ | Mẫu không có sẵn mô hình case/gallery/bảng tùy ý |
| 3 ngành hàng | Chi tiết, đầu vào, liên kết dịch vụ | Không mặc định có trường FAQ/nguồn/tác giả riêng |
| Bài kiến thức | Chuyên mục, các tiêu đề mục, đoạn nội dung | Không chèn Markdown/HTML vào chuỗi rồi cho rằng đã có link, bảng hoặc khối ảnh |
| Nhãn, CTA, footer, thông tin dùng chung | Cấu hình website và nội dung mẫu | Thay đổi dùng chung tác động nhiều trang, phải xem trước các trang liên quan |
| Hình ảnh | Thư viện media, alt và tham chiếu nội dung | Ảnh còn ở nháp không tự trở thành ảnh public |

Những phần **cần đặc tả và duyệt riêng nếu lựa chọn**: gallery bằng chứng có chú thích, bảng báo giá tương tác, mục nguồn/tác giả có trường dữ liệu riêng, download PDF, mẫu brief riêng từng dịch vụ, loại nội dung case và route `/lo-hang-thuc-te/`. Giai đoạn nội dung không lén mở rộng các tính năng này.

Quy trình từng trang: chụp lại phiên bản hiện tại → soạn theo brief → duyệt nguồn/nghiệp vụ → lưu nháp qua Studio → xem trước desktop/mobile → kiểm tra chênh lệch và link → người có quyền duyệt hiển thị trên demo. Khi gặp xung đột phiên bản, đối chiếu bản mới, không ép ghi đè. Việc cập nhật các seed mặc định cho cài đặt mới, nếu cần, là hạng mục đồng bộ riêng sau khi bộ nội dung được duyệt.

## 10. Checklist thực hiện và bàn giao

### Hạng mục 1: Khóa phạm vi và kiểm kê

**Đầu vào:** 24 URL hiện có, yêu cầu no-form, nhóm khách và danh mục dịch vụ được TBS xác nhận.

**Đầu ra dự kiến:** `docs/content/2026-09/content-inventory.csv`, `editorial-brief.md`.

- [ ] Chốt nhóm khách ưu tiên, ba dịch vụ cần dẫn khách nhất và điều không được công bố.
- [ ] Kiểm kê đủ 24 URL với nhiệm vụ, đoạn cần giữ/sửa, nguồn còn thiếu và người duyệt; không chỉ kiểm tra HTTP.
- [ ] Đánh dấu các khẳng định về doanh nghiệp, dịch vụ, giá, thời gian, pháp lý và quyền ảnh cần xác minh.
- [ ] Chốt danh sách nội dung dùng chung để tránh sửa một chỗ nhưng mâu thuẫn chỗ khác.
- [ ] Nghiệm thu: 24/24 URL có brief và trách nhiệm duyệt, mỗi thiếu hụt có hành động rõ.

### Hạng mục 2: Nguồn doanh nghiệp và nghiên cứu thị trường

**Đầu vào:** Phạm vi từ hạng mục 1; tư liệu TBS được phép xử lý; nguồn công khai của các doanh nghiệp liên quan.

**Đầu ra dự kiến:** `docs/content/2026-09/claims-register.csv`, `assets-register.csv`, `competitor-register.csv`, `benchmark-findings.md`, `sales-questions.md`.

- [ ] Tổng hợp cuộc trao đổi với sale, vận hành/XNK và người phụ trách doanh nghiệp; ghi rõ người xác nhận từng ý.
- [ ] Tạo sổ căn cứ: mã khẳng định, nội dung, nguồn, phạm vi áp dụng, ngày kiểm tra, người duyệt, trạng thái, trang sử dụng.
- [ ] Tạo sổ ảnh: chủ sở hữu, quyền dùng, ảnh thật/minh họa, đối tượng/địa điểm/ngày chụp nếu được biết, phần đã che và trang sử dụng.
- [ ] Nghiên cứu 100 doanh nghiệp theo mục 7 và phân tích sâu 20 doanh nghiệp được chọn; báo số thực đạt nếu chưa đủ.
- [ ] Nghiệm thu: không trùng doanh nghiệp; mỗi dòng đạt có URL bằng chứng và ngày kiểm tra; mỗi claim dùng trong bản mẫu có người chịu trách nhiệm xác nhận.

### Hạng mục 3: Ba trang mẫu để duyệt chất lượng

**Đầu vào:** Brief, thông tin TBS đã được duyệt, bảng khai thác video ở mục 7A và các phát hiện có nguồn. Không cần chờ hoàn thành toàn bộ nghiên cứu đối thủ để viết mẫu; không coi playlist chưa xem là nguồn nội dung video.

**Đầu ra dự kiến:** `docs/content/2026-09/pages/home.md`, `pages/nhap-khau-chinh-ngach.md`, `pages/chi-phi-chung-tu.md`, `approval-log.csv`.

- [ ] Soạn trang chủ để duyệt cách kể thương hiệu và dẫn đúng nhu cầu.
- [ ] Soạn dịch vụ nhập khẩu chính ngạch để duyệt mức độ chi tiết, lợi ích, đầu ra và giọng văn.
- [ ] Soạn chi phí/chứng từ để duyệt cách giải thích nội dung nhạy cảm, ví dụ và giới hạn áp dụng.
- [ ] Với mỗi trang bàn giao đủ bản viết, dàn ý, ảnh đề xuất, nguồn, SEO, link và CTA; đánh dấu nội dung chưa được phép công bố trong hồ sơ nội bộ.
- [ ] Anh duyệt hướng thương hiệu; sales/XNK/kế toán duyệt phần thuộc trách nhiệm. Chỉ nhân rộng khi ba mẫu đạt, không dùng im lặng làm phê duyệt.

### Hạng mục 4: Hoàn thiện 21 trang còn lại

**Đầu vào:** Ba mẫu đã duyệt, ma trận 24 trang, sổ căn cứ.

**Đầu ra dự kiến:** 21 hồ sơ dưới `docs/content/2026-09/pages/`, bản đồ SEO/link `seo-map.csv`, danh sách tư liệu còn thiếu.

- [ ] Hoàn thiện nhóm P1 trước, giữ sự khác biệt giữa từng dịch vụ và giữa trang dịch vụ với bài hướng dẫn.
- [ ] Hoàn thiện ngành hàng, danh mục và chính sách; không để chính sách là văn bản chung không khớp website.
- [ ] Đối chiếu thuật ngữ, pháp nhân, đầu mối, phạm vi, số liệu và điều kiện xuyên toàn bộ 24 trang.
- [ ] Gán metadata, ảnh/alt và liên kết đúng trang đích cho từng hồ sơ.
- [ ] Nghiệm thu: mỗi trang giải quyết đúng nhiệm vụ, không có claim chưa duyệt trong phần sẵn sàng xuất bản; phần bị chặn có lý do cụ thể.

### Hạng mục 5: Đưa bản duyệt vào demo và kiểm tra

**Đầu vào:** Chỉ các hồ sơ đã được duyệt; quyền thao tác CMS được cho phép ở giai đoạn thực hiện.

**Đầu ra dự kiến:** Bản nháp trên Studio, sau đó bản demo được duyệt; `docs/content/2026-09/content-qa.md` ghi phiên bản, kết quả và tồn đọng.

- [ ] Tạo bản sao lưu website theo quy trình Studio trước đợt cập nhật; xác minh bản xuất dùng được trong môi trường kiểm thử riêng, không restore lên demo để thử.
- [ ] Nhập từng trang qua giao diện/API chuẩn với phiên bản mong đợi; giữ thay đổi của người khác. Không sử dụng seed để ghi đè dữ liệu đang vận hành.
- [ ] Kiểm tra bản xem trước trên 390px, 768px và 1440px; kiểm tra thêm 320px và zoom 200% ở tiêu đề dài/bảng/CTA.
- [ ] Kiểm tra gọi/Zalo đúng địa chỉ mà không thực hiện cuộc gọi hay gửi tin thật; kiểm tra link nội bộ, neo và hiển thị ảnh.
- [ ] Dùng phiên ẩn danh xác nhận bản nháp không lộ; sau khi được duyệt hiển thị demo, đối chiếu lại nội dung và toàn bộ nhãn dùng chung.
- [ ] Chạy các kiểm tra tự động hiện có liên quan nội dung, metadata và luồng public; ghi kết quả mới, không chép lại số test cũ thành kết quả đợt này. Nếu không đổi mã thì không tuyên bố đã build/lint mới.
- [ ] Ghi nhận các phần chưa đủ tư liệu hoặc chưa kiểm tra trên thiết bị thật. Giữ demo noindex và không đưa lên production.

## 11. Các rủi ro phải kiểm tra riêng

| Rủi ro | Hạng mục kiểm tra | Kết quả phải đạt |
| --- | --- | --- |
| Khẳng định TBS sở hữu kho/xe/nhà máy chỉ dựa vào ảnh hoặc lời quảng cáo đối thủ | 2, 3, 4 | Có căn cứ TBS riêng; nếu thiếu thì không công bố claim |
| Case “thực tế” chứa số liệu giả hoặc lộ thông tin khách | 2, 4, 5 | Hồ sơ thật được duyệt, ảnh/file đã che; giả định được gọi đúng là giả định |
| Sáu dịch vụ đều có cùng nội dung, khách không biết chọn | 3, 4 | Mỗi trang có đối tượng, phạm vi và ví dụ đặc thù; trang danh mục giúp phân biệt |
| Bản viết tốt nhưng không vừa mẫu CMS hoặc làm vỡ bố cục mobile | 3, 5 | Đã ánh xạ trường và preview; thiếu khả năng trình bày được tách thành yêu cầu kỹ thuật |
| Bản duyệt bị ghi đè hoặc nội dung dùng chung mâu thuẫn sau cập nhật | 1, 5 | Có phiên bản, log phê duyệt, đối chiếu xung đột và kiểm tra các trang liên quan |

## 12. Tiêu chí nghiệm thu nội dung

**Điều kiện bắt buộc, không được bù bằng điểm đẹp:** đúng thông tin doanh nghiệp/liên hệ; không bịa năng lực/kết quả; không lộ dữ liệu; nội dung pháp lý được người phù hợp duyệt; không mâu thuẫn hợp đồng; không lỗi link/CTA chặn khách.

**Thang điểm biên tập nội bộ đề xuất:** đúng và có căn cứ 30; giải quyết câu hỏi khách 25; khác biệt và bằng chứng 20; dễ đọc và có bước tiếp theo 15; SEO/link/metadata 10. Mỗi trang đạt tối thiểu 85/100 và vượt các điều kiện bắt buộc. Đây là rubric của dự án, không phải điểm Google hoặc chứng nhận độc lập.

**Thử với người đọc:** mời ba người đại diện nhóm khách, không tham gia viết, thực hiện: tìm đúng dịch vụ; tìm thông tin cần gửi; phân biệt phạm vi chi phí; tìm kênh liên hệ. Đề xuất yêu cầu ít nhất 2/3 người làm được cả bốn việc mà không cần người viết giải thích. Mẫu nhỏ chỉ phát hiện điểm khó hiểu, không chứng minh tỷ lệ chuyển đổi toàn thị trường.

**Thử với sale:** lấy năm tình huống từ dữ liệu đã ẩn danh, chọn trang cần gửi cho từng tình huống và kiểm tra khách có nhận được câu trả lời/bước tiếp theo. Sales và XNK không được phải sửa thông tin sai trên website để tiếp tục tư vấn.

## 13. Lịch dự kiến và trách nhiệm

Ước tính **15-20 ngày làm việc** cho đợt nền 24 trang, gồm nghiên cứu 100 doanh nghiệp, với một người phụ trách nội dung/nghiên cứu toàn thời gian, đầu mối TBS phản hồi đều và hỗ trợ CMS/QA. Đây là ước lượng để phân bổ nguồn lực, không phải cam kết đã đặt lịch; chốt lại sau kiểm kê. Thời gian chờ hồ sơ, quyền sử dụng hoặc duyệt chuyên môn nằm ngoài ước tính.

Ước tính trên được lập trước yêu cầu khai thác TikTok. Cần kiểm kê số video và thời lượng thực có để chốt lại nguồn lực/thời gian; không mặc định phân tích cả kênh đã nằm trong 15-20 ngày. Có thể viết mẫu sớm hơn từ nhóm video và tài liệu TBS đủ căn cứ trong khi nghiên cứu đối thủ tiếp tục.

| Chặng | Công việc | Ước lượng | Mốc duyệt |
| --- | --- | --- | --- |
| 1 | Brief, kiểm kê, danh mục dữ liệu TBS | 2 ngày | Anh duyệt nhóm khách và ưu tiên |
| 2 | Nghiên cứu 100 doanh nghiệp, nguồn TBS, câu hỏi sale | 4-6 ngày | Nguồn đủ để viết và các khoảng trống được xác định |
| 3 | Ba trang mẫu | 2 ngày | Anh và người phụ trách nghiệp vụ duyệt mẫu |
| 4 | 21 trang còn lại, SEO và liên kết | 5-7 ngày | Duyệt theo nhóm trang |
| 5 | CMS, preview, kiểm tra và bàn giao | 2-3 ngày | Duyệt bản demo nội dung |

Vai trò: anh chốt định vị và ưu tiên kinh doanh; người biên tập tổ chức và viết; trưởng sale duyệt tính hữu ích khi tư vấn; vận hành/XNK/kế toán duyệt nghiệp vụ tương ứng; người phụ trách pháp lý/dữ liệu duyệt chính sách; kỹ thuật kiểm tra khả năng trình bày và xuất bản. Một người có thể kiêm vai trò nếu đủ thẩm quyền; không tự gán người duyệt không có thật.

## 14. Đợt mở rộng sau nền tảng

Không tính vào 24 trang và lịch trên. Chỉ chọn sau khi thấy nhu cầu thực và đủ tư liệu.

- Tám bài ứng viên: tự nhập hay xem xét ủy thác; nhận diện nhà cung cấp; kiểm đếm khác kiểm tra chất lượng; gom nhiều nhà cung cấp; chuẩn bị dữ liệu cân đo; đọc catalogue máy móc; đóng gói nội thất; đối chiếu chứng từ xuất xứ. Chốt tiêu đề/phạm vi sau nghiên cứu, không mở tám bài nếu trùng ý định đã có.
- Ba hồ sơ lô hàng thật từ bộ ứng viên đã duyệt; ưu tiên một case chứng minh một năng lực cụ thể thay vì kể chung chung. Route/mẫu case chỉ làm sau đặc tả kỹ thuật riêng.
- Bộ tài liệu tự tải, không bắt điền form: hồ sơ năng lực, checklist chuẩn bị lô, khung đọc báo giá. Chỉ làm khi có nội dung được duyệt và cơ chế phục vụ file phù hợp.
- Sau khi được phép phát hành production, đo riêng lượt liên hệ trên web và cuộc trao đổi thực tế của sale; so sánh cùng nguồn khách trong 2-4 tuần. Đây là đề xuất theo dõi, chưa tạo lịch tự động hoặc triển khai tracking mới.

## 15. Quyết định cần anh chốt

1. Nhóm khách ưu tiên: đề xuất doanh nghiệp vừa và nhỏ nhập hàng thường xuyên; hướng dẫn bổ trợ cho người mới.
2. Phạm vi: làm sâu 24 trang, ưu tiên khai thác TikTok TBS rồi dùng nghiên cứu 100 doanh nghiệp để đối chiếu; chưa mở thêm route/tính năng. Chốt số video xem sâu sau khi có nguồn truy cập được.
3. Cách triển khai: đề xuất làm trong task này, duyệt ba trang mẫu trước, sau đó duyệt theo từng nhóm; không nhập hàng loạt nội dung chưa xác nhận vào bản hiển thị.

Sau khi được duyệt, bắt đầu hạng mục 1 và danh sách tư liệu cần TBS cung cấp. Không cần chờ cấu hình AI trả phí để bắt đầu công việc biên tập.
