import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Heart, Share2, 
  User, FileText, ChevronLeft, Volume2,
  FileDown, FileAudio, Disc, MessageSquare, Send, Sparkles
} from 'lucide-react';

const MOCK_STATS = { totalHours: 124, topSong: 'Nocturne Op. 9 No. 2', totalSheets: 45, streak: 12 };
const MOCK_TOPICS = ['Piano Solo', 'Classical', 'Anime', 'Nhạc Việt', 'Jazz', 'Soundtrack'];
const MOCK_SHEETS = [
  { id: '1', title: 'Nocturne Op. 9 No. 2', artist: 'Frédéric Chopin', genre: 'Classical', cover: 'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=400' },
  { id: '2', title: 'Gurenge (Demon Slayer)', artist: 'LiSA (Piano Cover)', genre: 'Anime', cover: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=400' },
  { id: '3', title: 'Nơi Này Có Anh', artist: 'Sơn Tùng M-TP', genre: 'Nhạc Việt', cover: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=400' },
  { id: '4', title: 'Interstellar Main Theme', artist: 'Hans Zimmer', genre: 'Soundtrack', cover: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=400' }
];

const MOCK_POSTS = [
  { id: '1', title: 'Hành trình chinh phục La Campanella', date: '24/10/2026', excerpt: 'Một vài kinh nghiệm và bài tập ngón giúp bạn vượt qua những đoạn nhảy quãng khó nhằn. Bắt đầu từ việc tập chậm...', content: 'La Campanella là một trong những bản nhạc kinh điển đòi hỏi kỹ thuật nhảy quãng cực kỳ chuẩn xác.\n\nThứ nhất, hãy bắt đầu thật chậm. Thứ hai, sự thả lỏng cổ tay là yếu tố quyết định.' },
  { id: '2', title: 'Tại sao mình thích dùng MuseScore hơn Sibelius?', date: '15/10/2026', excerpt: 'So sánh chi tiết 2 phần mềm viết nhạc phổ biến nhất hiện nay dựa trên trải nghiệm cá nhân...', content: 'MuseScore hoàn toàn miễn phí và mã nguồn mở, đây là một điểm cộng rất lớn cho cộng đồng làm nhạc.\n\nTừ phiên bản 4.0, giao diện của MuseScore thực sự đã lột xác.' },
];

const MOCK_COMMENTS = [
  { id: 1, user: 'Hoàng Trần', text: 'Bản sheet này rất chi tiết, cảm ơn bạn nhiều nhé! Đánh rất sướng tay.', time: '2 giờ trước' },
  { id: 2, user: 'Linh Nguyễn', text: 'Cho mình hỏi đoạn tempo ở ô nhịp 32 đánh sao cho mượt ạ? Mình bị vấp hoài.', time: '5 giờ trước' }
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlaySheet = (sheet) => {
    setCurrentTrack(sheet);
    setCurrentView('player');
    window.scrollTo(0, 0);
    setIsPlaying(true);
    setProgress(0);
  };

  const handleReadPost = (post) => {
    setCurrentPost(post);
    setCurrentView('post');
    window.scrollTo(0, 0);
  };

  const togglePlay = () => {
    if (currentTrack) setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#000000', fontFamily: "'Space Grotesk', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

/* KHAI BÁO PHÔNG CHỮ TÙY CHỈNH TỪ THƯ MỤC PUBLIC */
@font-face {
  font-family: 'BD StreetSigns';
  src: url('/fonts/BDStreetSigns.ttf') format('truetype'); 
  /* Nếu đuôi file của bạn là .otf thì đổi format thành 'opentype' */
  font-weight: normal;
  font-style: normal;
}

* { border-radius: 0 !important; box-sizing: border-box; margin: 0; padding: 0; }
.brutal-border { border: 2px solid #000; }

/* Cập nhật lại class font-title */
.font-title { 
  font-family: 'BD StreetSigns', Impact, system-ui, sans-serif !important; 
  font-weight: normal; 
}
      `}</style>
      
      {/* HEADER */}
      <header className="brutal-border" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#fff', borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }} onClick={() => setCurrentView('home')}>
          jang.logn18 music
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isLoggedIn ? (
            <button onClick={() => setCurrentView('profile')} className="brutal-btn brutal-border brutal-shadow-purple uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#FACB54', color: '#000', gap: '0.5rem' }}>
              <User size={16} /> Trương Phi Long
            </button>
          ) : (
            <button onClick={() => setIsLoggedIn(true)} className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#3B2AA2', color: '#fff', gap: '0.5rem' }}>
              <User size={16} /> Đăng nhập
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: '1152px', margin: '0 auto', padding: '2rem 1rem', paddingBottom: '5rem' }}>
        {currentView === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            <button className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '1rem 2rem', backgroundColor: '#FACB54', fontSize: '1.25rem', alignSelf: 'flex-start', gap: '0.75rem' }}>
              <Sparkles size={24} /> Đề xuất bài hát
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="brutal-border brutal-shadow-purple" style={{ padding: '1.5rem', backgroundColor: '#FACB54' }}>
                <h2 className="uppercase" style={{ borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Dữ Liệu Nghe</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontWeight: '500' }}>
                  <p style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '0.25rem' }}>
                    <span>Tổng thời gian:</span> <strong>{MOCK_STATS.totalHours} giờ</strong>
                  </p>
                  <p style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '0.25rem' }}>
                    <span>Chuỗi nghe:</span> <strong>{MOCK_STATS.streak} ngày</strong>
                  </p>
                  <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tổng sheet:</span> <strong>{MOCK_STATS.totalSheets}</strong>
                  </p>
                </div>
              </div>

              <div className="brutal-border brutal-shadow-mint" style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
                <h2 className="uppercase" style={{ borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Chủ Đề</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {MOCK_TOPICS.map((topic, idx) => (
                    <button key={idx} className="brutal-btn brutal-border uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', fontSize: '0.875rem' }}>
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="uppercase brutal-border brutal-shadow-purple" style={{ display: 'inline-block', backgroundColor: '#39EFB2', padding: '0.25rem 1rem', marginBottom: '1.5rem', fontSize: '1.875rem' }}>
                Bản Nhạc Mới
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {MOCK_SHEETS.map(sheet => (
                  <div key={sheet.id} className="brutal-border brutal-shadow-mint" style={{ padding: '1rem', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
                    <div className="brutal-border" style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#000', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
                      <img src={sheet.cover} alt={sheet.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h3 className="uppercase" style={{ fontSize: '1.125rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sheet.title}</h3>
                    <p className="uppercase" style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem' }}>{sheet.artist}</p>
                    <button onClick={() => handlePlaySheet(sheet)} className="brutal-btn brutal-border uppercase" style={{ marginTop: 'auto', padding: '0.75rem', backgroundColor: '#fff', gap: '0.5rem', width: '100%' }}>
                      <Play size={16} /> Nghe & Xem
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'player' && currentTrack && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <button onClick={() => setCurrentView('home')} className="brutal-btn brutal-border brutal-shadow-purple uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#39EFB2', alignSelf: 'flex-start', gap: '0.5rem' }}>
              <ChevronLeft size={18} /> Quay Lại
            </button>

            <div className="brutal-border brutal-shadow-mint" style={{ padding: '1.5rem', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 className="uppercase" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{currentTrack.title}</h1>
                <p className="uppercase" style={{ fontWeight: 'bold', color: '#4b5563' }}>{currentTrack.artist}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button onClick={togglePlay} className="brutal-btn brutal-border" style={{ width: '3rem', height: '3rem', backgroundColor: '#3B2AA2', color: '#fff' }}>
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <div style={{ width: '150px', height: '0.75rem', backgroundColor: '#f3f4f6', border: '2px solid #000', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: '#39EFB2', width: `${progress}%`, borderRight: '2px solid #000', transition: 'width 0.3s' }}></div>
                </div>
              </div>
            </div>

            <div className="brutal-border brutal-shadow-purple" style={{ width: '100%', height: '500px', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <FileText size={64} color="#d1d5db" />
              <p className="uppercase" style={{ color: '#9ca3af', fontWeight: 'bold' }}>Khu vực hiển thị Sheet Music</p>
            </div>
          </div>
        )}

        {currentView === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => setCurrentView('home')} className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', alignSelf: 'flex-start', gap: '0.5rem' }}>
              <ChevronLeft size={18} /> Quay Lại
            </button>
            <div className="brutal-border brutal-shadow-purple" style={{ padding: '2rem', backgroundColor: '#39EFB2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 className="uppercase" style={{ fontSize: '2.5rem' }}>Trương Phi Long</h1>
                <p className="uppercase" style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Người nghe (jang.logn18)</p>
              </div>
              <button onClick={() => { setIsLoggedIn(false); setCurrentView('home'); }} className="brutal-btn brutal-border brutal-shadow-yellow uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#fff' }}>
                Đăng Xuất
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
