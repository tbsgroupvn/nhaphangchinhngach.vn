import Link from 'next/link';

export default function PhanTrang({
  trang, tongDong, soDongMoiTrang, query,
}: { trang: number; tongDong: number; soDongMoiTrang: number; query: Record<string, string> }) {
  const tongTrang = Math.max(1, Math.ceil(tongDong / soDongMoiTrang));
  if (tongTrang <= 1) return null;

  // `trang` truyền vào có thể lớn hơn tongTrang thật (vd người dùng gõ tay
  // ?page=99999 nhưng tab lọc chỉ còn 5 trang) -- không kẹp lại thì
  // Math.max(1, trang-dai) > Math.min(tongTrang, trang+dai), vòng lặp bên
  // dưới không chạy lần nào, cả dải số trang biến mất, không nút nào bấm
  // được. Kẹp về đúng khoảng [1, tongTrang] trước khi tính dải số.
  const trangAn = Math.min(Math.max(1, trang), tongTrang);

  const duong = (p: number) => {
    const q = new URLSearchParams(query);
    q.set('page', String(p));
    return '?' + q.toString();
  };

  const dai = 2;
  const dsTrang: number[] = [];
  for (let p = Math.max(1, trangAn - dai); p <= Math.min(tongTrang, trangAn + dai); p++) dsTrang.push(p);

  const lop = (dang: boolean) =>
    `min-w-9 rounded-md border px-3 py-1.5 text-sm ${
      dang ? 'border-primary-600 bg-primary-600 text-white'
           : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
    }`;

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1 px-4 py-4" aria-label="Phân trang">
      {trangAn > 1 && <Link href={duong(trangAn - 1)} className={lop(false)}>‹ Trước</Link>}
      {dsTrang[0] > 1 && (
        <>
          <Link href={duong(1)} className={lop(false)}>1</Link>
          {dsTrang[0] > 2 && <span className="px-1 text-gray-400">…</span>}
        </>
      )}
      {dsTrang.map((p) => (
        <Link key={p} href={duong(p)} className={lop(p === trangAn)}>{p}</Link>
      ))}
      {dsTrang[dsTrang.length - 1] < tongTrang && (
        <>
          {dsTrang[dsTrang.length - 1] < tongTrang - 1 && <span className="px-1 text-gray-400">…</span>}
          <Link href={duong(tongTrang)} className={lop(false)}>{tongTrang}</Link>
        </>
      )}
      {trangAn < tongTrang && <Link href={duong(trangAn + 1)} className={lop(false)}>Sau ›</Link>}
    </nav>
  );
}
