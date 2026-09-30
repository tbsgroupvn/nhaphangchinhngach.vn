export default function KhoiTrong({
  loai, chuThich, soCot,
}: { loai: 'rong' | 'loi'; chuThich?: string; soCot?: number }) {
  const chu = loai === 'loi'
    ? 'Không thể hiển thị dữ liệu. Vui lòng thử lại sau vài phút.'
    : (chuThich || 'Chưa có dữ liệu.');
  const lop = loai === 'loi' ? 'text-red-600' : 'text-gray-400';

  if (soCot) {
    return (
      <tr>
        <td colSpan={soCot} className={`px-4 py-6 text-center text-sm ${lop}`}>{chu}</td>
      </tr>
    );
  }
  return <div className={`px-4 py-6 text-center text-sm ${lop}`}>{chu}</div>;
}
