import type { Metadata } from 'next';
import Link from 'next/link';
import { layPhien } from '@/lib/khachhang-phien';
import ThanhDieuHuong from '@/components/khachhang/ThanhDieuHuong';

export const metadata: Metadata = {
  title: 'Cổng khách hàng | TBS GROUP',
  robots: { index: false, follow: false },
};

export default async function KhachHangLayout({ children }: { children: React.ReactNode }) {
  const phien = await layPhien();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {phien && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
            <Link href="/khachhang" className="font-bold text-primary-700 whitespace-nowrap">
              TBS GROUP
            </Link>
            <ThanhDieuHuong ten={phien.name || phien.code} ma={phien.code} />
          </div>
        </header>
      )}
      <main>{children}</main>
    </div>
  );
}
