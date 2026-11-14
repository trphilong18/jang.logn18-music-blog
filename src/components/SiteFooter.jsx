import { Coffee } from 'lucide-react';

// Tách khối giao diện tĩnh, không thay đổi nội dung hay tương tác.
export default function SiteFooter() {
  return (
      <footer style={{ marginTop: '5rem', borderTop: '4px solid #000', backgroundColor: '#3B2AA2', padding: '4rem 1rem', position: 'relative', overflow: 'hidden', color: '#fff' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* PHẦN 1: AVATAR, TIÊU ĐỀ, MÔ TẢ VÀ Ô DONATE BÊN PHẢI */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
            
            {/* CỤM BÊN TRÁI (AVATAR + TÊN + MÔ TẢ) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', flex: 1, minWidth: '280px' }}>
              <div className="brutal-border brutal-shadow-yellow" style={{ width: '8rem', height: '8rem', backgroundColor: '#39EFB2', overflow: 'hidden', flexShrink: 0 }}>
                <img src="/1794575745034.jpg" alt="Trương Phi Long" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: '220px', maxWidth: '450px' }}>
                <h2 className="font-title uppercase brutal-border brutal-shadow-mint" style={{ display: 'inline-block', backgroundColor: '#fff', color: '#000', padding: '0.5rem 1.25rem', fontSize: '2rem', marginBottom: '0.75rem' }}>
                  Trương Phi Long
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p className="uppercase brutal-border" style={{ display: 'inline-block', backgroundColor: '#000', color: '#fff', padding: '0.4rem 0.8rem', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    SOẠN GIẢ & TÁC GIẢ, SINH VIÊN KIẾN TRÚC TẠI HCMUT
                  </p>
                  <p style={{ color: '#fff', fontWeight: '500', fontSize: '0.9rem', wordWrap: 'break-word', overflowWrap: 'break-word', lineHeight: '1.4' }}>
                    Xin chào mọi người. Đây là nơi chia sẻ âm nhạc của mình. Mọi thứ ở đây đều miễn phí. Mọi người có thể ủng hộ mình bằng thông tin bên ô màu vàng bên cạnh nhé. Mình chân thành cảm ơn mọi người. Chúc một ngày tốt lành.
                  </p>
                </div>
              </div>
            </div>

            {/* CỤM BÊN PHẢI (Ô DONATE VÀNG) */}
            <div className="brutal-border brutal-shadow-mint" style={{ padding: '1.25rem', backgroundColor: '#FACB54', color: '#000', display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '320px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1rem' }}>
                <Coffee size={20} /> Ủng hộ mình
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '500', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div>
                  <span style={{ fontWeight: 'bold' }}>MoMo:</span><br/>
                  <strong>0817311006 (Trương Phi Long)</strong>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold' }}>Vietcombank:</span><br/>
                  <strong>1817311006 (TRUONG PHI LONG)</strong>
                </div>
              </div>
            </div>

          </div>

          {/* PHẦN 2: CÁC NÚT LIÊN KẾT MẠNG XÃ HỘI Ở DƯỚI */}
          <div style={{ borderTop: '2px dashed rgba(255,255,255,0.3)', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="brutal-btn brutal-border uppercase" style={{ padding: '0.5rem 1.25rem', backgroundColor: '#fff', color: '#000', fontSize: '0.85rem', textDecoration: 'none' }}>
              Instagram
            </a>
            <a href="https://facebook.com/jang.logn18" target="_blank" rel="noreferrer" className="brutal-btn brutal-border uppercase" style={{ padding: '0.5rem 1.25rem', backgroundColor: '#fff', color: '#000', fontSize: '0.85rem', textDecoration: 'none' }}>
              Facebook
            </a>
            <a href="https://tiktok.com/@jang.logn18" target="_blank" rel="noreferrer" className="brutal-btn brutal-border uppercase" style={{ padding: '0.5rem 1.25rem', backgroundColor: '#fff', color: '#000', fontSize: '0.85rem', textDecoration: 'none' }}>
              TikTok
            </a>
            <a href="https://soundcloud.com/jang_logn18" target="_blank" rel="noreferrer" className="brutal-btn brutal-border uppercase" style={{ padding: '0.5rem 1.25rem', backgroundColor: '#fff', color: '#000', fontSize: '0.85rem', textDecoration: 'none' }}>
              SoundCloud
            </a>
            <a href="https://youtube.com/@jang.logn18" target="_blank" rel="noreferrer" className="brutal-btn brutal-border uppercase" style={{ padding: '0.5rem 1.25rem', backgroundColor: '#fff', color: '#000', fontSize: '0.85rem', textDecoration: 'none' }}>
              YouTube
            </a>
          </div>

        </div>
      </footer>
  );
}
