'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const MUC = [
  { duong: '/khachhang', nhan: 'Dashboard', khop: (p: string) => p === '/khachhang' },
  { duong: '/khachhang/don-hang', nhan: 'Đơn hàng', khop: (p: string) => p.startsWith('/khachhang/don-hang') },
  { duong: '/khachhang/vi-cua-toi', nhan: 'Ví của tôi', khop: (p: string) => p === '/khachhang/vi-cua-toi' },
];

export default function ThanhDieuHuong({ ten, ma }: { ten: string; ma: string }) {
  const duongHienTai = usePathname();
  const [moMenu, datMoMenu] = useState(false);
  const [moMenuGon, datMoMenuGon] = useState(false);
  const boc = useRef<HTMLDivElement>(null);
  const trongTaiKhoan = duongHienTai === '/khachhang/thong-tin' || duongHienTai === '/khachhang/doi-mat-khau';

  useEffect(() => {
    function ngoai(e: MouseEvent) {
      if (boc.current && !boc.current.contains(e.target as Node)) {
        datMoMenu(false);
        datMoMenuGon(false);
      }
    }
    document.addEventListener('click', ngoai);
    return () => document.removeEventListener('click', ngoai);
  }, []);

  // Đổi trang thì đóng luôn menu đang mở (áp dụng cho cả bản gọn và bản đầy đủ).
  useEffect(() => {
    datMoMenu(false);
    datMoMenuGon(false);
  }, [duongHienTai]);

  async function dangXuat() {
    await fetch('/api/khachhang/dang-xuat', { method: 'POST' }).catch(() => null);
    window.location.href = '/khachhang/dang-nhap';
  }

  const lopMuc = (dang: boolean) =>
    `px-3 py-2 text-sm rounded-md transition-colors ${
      dang ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:text-primary-700'
    }`;

  const lopMucGon = (dang: boolean) =>
    `block px-3 py-2 text-sm rounded-md ${
      dang ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
    }`;

  return (
    <nav ref={boc}>
      {/*
        Khổ >= sm (640px): giữ NGUYÊN thanh ngang cũ (4 mục: Dashboard, Đơn hàng,
        Ví của tôi, menu Tài khoản sổ xuống) — không đổi hành vi/markup so với trước.
      */}
      <div className="hidden sm:flex items-center gap-1">
        {MUC.map((m) => (
          <Link key={m.duong} href={m.duong} className={lopMuc(m.khop(duongHienTai))}>
            {m.nhan}
          </Link>
        ))}
        <div className="relative">
          <button
            type="button"
            onClick={() => datMoMenu((v) => !v)}
            className={lopMuc(trongTaiKhoan)}
            aria-expanded={moMenu}
            aria-haspopup="menu"
          >
            Tài khoản ▾
          </button>
          {moMenu && (
            <div
              role="menu"
              className="absolute right-0 mt-1 w-52 rounded-md border border-gray-200 bg-white py-1 shadow-lg z-20"
            >
              <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                {ten} <span className="text-gray-400">({ma})</span>
              </div>
              <Link href="/khachhang/thong-tin" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Hồ sơ cá nhân
              </Link>
              <Link href="/khachhang/doi-mat-khau" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Đổi mật khẩu
              </Link>
              <button
                type="button"
                onClick={dangXuat}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {/*
        Khổ < sm (mobile, kể cả 375px): thanh ngang 267px+ không đủ chỗ (đo thật
        03/09/2026: tràn ~13px riêng thanh nav, kéo cả trang tràn ngang tới 22px,
        dashboard tràn tới 147px vì layout viewport bị đẩy rộng theo). Thay bằng
        MỘT nút menu gọn (hamburger) mở ra bảng dọc chứa ĐỦ cả 6 mục — không ẩn
        mục nào: Dashboard, Đơn hàng, Ví của tôi, Hồ sơ cá nhân, Đổi mật khẩu,
        Đăng xuất. Chọn cách này (thay vì cuộn ngang riêng cho nav, hoặc rút gọn
        nhãn) vì nav chỉ có 4 mục — hamburger quen thuộc, không cắt chữ, không
        cần khách phải biết "cuộn ngang" một thanh mà mắt thường không thấy dấu
        hiệu có thể cuộn.
      */}
      <div className="relative sm:hidden">
        <button
          type="button"
          onClick={() => datMoMenuGon((v) => !v)}
          aria-expanded={moMenuGon}
          aria-haspopup="menu"
          aria-label="Mở menu điều hướng"
          className="flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-primary-700"
        >
          {moMenuGon ? (
            <span className="block text-xl leading-none" aria-hidden="true">✕</span>
          ) : (
            <span className="block text-xl leading-none" aria-hidden="true">☰</span>
          )}
        </button>
        {moMenuGon && (
          <div
            role="menu"
            className="absolute right-0 mt-1 w-64 max-w-[calc(100vw-2rem)] rounded-md border border-gray-200 bg-white py-1 shadow-lg z-20"
          >
            <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
              {ten} <span className="text-gray-400">({ma})</span>
            </div>
            {MUC.map((m) => (
              <Link key={m.duong} href={m.duong} className={lopMucGon(m.khop(duongHienTai))}>
                {m.nhan}
              </Link>
            ))}
            <div className="my-1 border-t border-gray-100" />
            <Link href="/khachhang/thong-tin" className={lopMucGon(duongHienTai === '/khachhang/thong-tin')}>
              Hồ sơ cá nhân
            </Link>
            <Link href="/khachhang/doi-mat-khau" className={lopMucGon(duongHienTai === '/khachhang/doi-mat-khau')}>
              Đổi mật khẩu
            </Link>
            <button
              type="button"
              onClick={dangXuat}
              className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
