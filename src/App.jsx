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
  { id: '1', title: 'Hành trình chinh phục La Campanella', date: '24/10/2026', excerpt: 'Một vài kinh nghiệm và bài tập ngón giúp bạn vượt qua những đoạn nhảy quãng khó nhằn. Bắt đầu từ việc tập chậm...', content: 'Nội dung chi tiết của bài viết sẽ nằm ở đây...\n\nLa Campanella là một trong những bản nhạc kinh điển đòi hỏi kỹ thuật nhảy quãng cực kỳ chuẩn xác. Để bắt đầu, bạn không nên nôn nóng đánh đúng tempo ngay lập tức.\n\nThứ nhất, hãy bắt đầu thật chậm, định hình rõ khoảng cách của quãng 8, quãng 10 trên phím đàn. Thứ hai, sự thả lỏng cổ tay là yếu tố quyết định để tay không bị mỏi khi chơi ở tốc độ cao.' },
  { id: '2', title: 'Tại sao mình thích dùng MuseScore hơn Sibelius?', date: '15/10/2026', excerpt: 'So sánh chi tiết 2 phần mềm viết nhạc phổ biến nhất hiện nay dựa trên trải nghiệm cá nhân...', content: 'MuseScore hoàn toàn miễn phí và mã nguồn mở, đây là một điểm cộng rất lớn cho cộng đồng làm nhạc.\n\nTừ phiên bản 4.0, giao diện của MuseScore thực sự đã lột xác, mang lại cảm giác hiện đại, tối giản và chuyên nghiệp không kém gì các phần mềm trả phí hàng ngàn đô la. Hệ thống playback cũng được nâng cấp đáng kể với Muse Sounds, giúp các bản nhạc giao hưởng nghe chân thực hơn bao giờ hết.' },
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
        
        @import url('https://fonts.googleapis.com/css2?family=Phudu:wght@400;500;700&display=swap');
        }

        /* BẮT BUỘC CÁC NÚT VÀ Ô NHẬP LIỆU PHẢI KẾ THỪA FONT CHỮ CỦA WEB */
        button, input, textarea { font-family: inherit; }

        .font-title { font-family: 'Phudu', system-ui, sans-serif !important; font-weight: normal; }
        .brutal-border { border: 2px solid #000; }
        /* ... (giữ nguyên các phần class brutalist bên dưới) ... */

        * { border-radius: 0 !important; box-sizing: border-box; margin: 0; padding: 0; }
        .font-title { font-family: 'Phudu', system-ui, sans-serif !important; font-weight: bold; }
        .brutal-border { border: 2px solid #000; }
        .brutal-shadow-mint { box-shadow: 4px 4px 0px 0px #39EFB2; }
        .brutal-shadow-purple { box-shadow: 4px 4px 0px 0px #3B2AA2; }
        .brutal-shadow-yellow { box-shadow: 4px 4px 0px 0px #FACB54; }
        .brutal-btn { transition: all 0.1s ease-in-out; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; }
        .brutal-btn:active { transform: translate(4px, 4px); box-shadow: 0px 0px 0px 0px transparent !important; }
        .uppercase { text-transform: uppercase; }
        
        /* Layout Helpers */
        .flex { display: flex; }
        .flex-col { display: flex; flexDirection: column; }
        .items-center { alignItems: center; }
        .justify-between { justifyContent: space-between; }
        .gap-2 { gap: 0.5rem; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        .w-full { width: 100%; }
        
        /* Utils */
        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
      
      {/* HEADER */}
      <header className="brutal-border" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#fff', borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="font-title uppercase" style={{ fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setCurrentView('home')}>
          jang.logn18 music
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {currentTrack && (
             <div className="brutal-border brutal-shadow-mint" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 0.75rem', backgroundColor: '#fff', display: window.innerWidth > 768 ? 'flex' : 'none' }}>
               <button onClick={togglePlay} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                 {isPlaying ? <Pause size={18} /> : <Play size={18} />}
               </button>
               <div style={{ display: 'flex', flexDirection: 'column', width: '128px', cursor: 'pointer' }} onClick={() => setCurrentView('player')}>
                 <span className="uppercase truncate" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{currentTrack.title}</span>
                 <div className="brutal-border" style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', marginTop: '4px' }}>
                   <div style={{ height: '100%', backgroundColor: '#FACB54', borderRight: '2px solid #000', width: `${progress}%`, transition: 'width 0.3s' }}></div>
                 </div>
               </div>
             </div>
          )}

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
        
        {/* --- TRANG CHỦ --- */}
        {currentView === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <button className="brutal-btn brutal-border brutal-shadow-mint uppercase font-title" style={{ padding: '1rem 2rem', backgroundColor: '#FACB54', fontSize: '1.25rem', alignSelf: 'flex-start', gap: '0.75rem' }}>
              <Sparkles size={24} /> Đề xuất bài hát
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="brutal-border brutal-shadow-purple" style={{ padding: '1.5rem', backgroundColor: '#FACB54' }}>
                <h2 className="font-title uppercase" style={{ borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Dữ Liệu Nghe</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontWeight: '500' }}>
                  <p style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '0.25rem' }}>
                    <span>Tổng thời gian:</span> <strong>{MOCK_STATS.totalHours} giờ</strong>
                  </p>
                  <p style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '0.25rem' }}>
                    <span>Bài hát tuần:</span> <strong className="truncate" style={{ maxWidth: '120px' }}>{MOCK_STATS.topSong}</strong>
                  </p>
                  <p style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '0.25rem' }}>
                    <span>Chuỗi nghe:</span> <strong>{MOCK_STATS.streak} ngày</strong>
                  </p>
                  <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tổng sheet:</span> <strong>{MOCK_STATS.totalSheets}</strong>
                  </p>
                </div>
              </div>

              <div className="brutal-border brutal-shadow-mint" style={{ gridColumn: 'span 2', padding: '1.5rem', backgroundColor: '#fff' }}>
                <h2 className="font-title uppercase" style={{ borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Chủ Đề</h2>
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
              <h2 className="font-title uppercase brutal-border brutal-shadow-purple" style={{ display: 'inline-block', backgroundColor: '#39EFB2', padding: '0.25rem 1rem', marginBottom: '1.5rem', fontSize: '1.875rem' }}>
                Bản Nhạc Mới
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {MOCK_SHEETS.map(sheet => (
                  <div key={sheet.id} className="brutal-border brutal-shadow-mint" style={{ padding: '1rem', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
                    <div className="brutal-border" style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#000', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
                      <img src={sheet.cover} alt={sheet.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div className="brutal-border font-title uppercase" style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: '#fff', padding: '0.125rem 0.5rem', fontSize: '0.75rem' }}>
                        {sheet.genre}
                      </div>
                    </div>
                    <h3 className="font-title uppercase truncate" style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{sheet.title}</h3>
                    <p className="uppercase truncate" style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem' }}>{sheet.artist}</p>
                    <button onClick={() => handlePlaySheet(sheet)} className="brutal-btn brutal-border uppercase" style={{ marginTop: 'auto', padding: '0.75rem', backgroundColor: '#fff', gap: '0.5rem', width: '100%' }}>
                      <Play size={16} /> Nghe & Xem Sheet
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-title uppercase brutal-border brutal-shadow-yellow" style={{ display: 'inline-block', backgroundColor: '#3B2AA2', color: '#fff', padding: '0.25rem 1rem', marginBottom: '1.5rem', fontSize: '1.875rem' }}>
                Bài Viết (Blog)
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {MOCK_POSTS.map(post => (
                  <div key={post.id} className="brutal-border brutal-shadow-mint" style={{ padding: '1.25rem', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <h3 className="font-title uppercase" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{post.title}</h3>
                      <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#4b5563', borderBottom: '2px solid #000', display: 'inline-block', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>
                        {post.date}
                      </div>
                      <p className="line-clamp-2" style={{ fontSize: '0.875rem', color: '#1f2937' }}>{post.excerpt}</p>
                    </div>
                    <button onClick={() => handleReadPost(post)} className="brutal-btn brutal-border brutal-shadow-purple uppercase" style={{ padding: '0.5rem 1.5rem', backgroundColor: '#fff', fontSize: '0.875rem' }}>
                      Đọc
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TRANG BÀI VIẾT (BLOG) --- */}
        {currentView === 'post' && currentPost && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => setCurrentView('home')} className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', alignSelf: 'flex-start', gap: '0.5rem' }}>
              <ChevronLeft size={18} /> Quay Lại
            </button>
            <div className="brutal-border brutal-shadow-yellow" style={{ padding: '2.5rem', backgroundColor: '#fff' }}>
              <h1 className="font-title uppercase" style={{ fontSize: '2.5rem', lineHeight: 1.2, marginBottom: '1rem' }}>{currentPost.title}</h1>
              <div className="uppercase" style={{ fontWeight: 'bold', color: '#4b5563', borderBottom: '4px solid #000', display: 'inline-block', paddingBottom: '1rem', marginBottom: '2rem' }}>
                Đăng ngày: {currentPost.date}
              </div>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, whiteSpace: 'pre-line', fontWeight: '500' }}>
                {currentPost.content}
              </div>
            </div>
          </div>
        )}

        {/* --- TRANG TRÌNH PHÁT NHẠC & SHEET --- */}
        {currentView === 'player' && currentTrack && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div className="brutal-shadow-mint" style={{ position: 'sticky', top: '70px', zIndex: 40, backgroundColor: '#fff', padding: '1rem 0', marginBottom: '2rem', borderBottom: '4px solid #000' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <button onClick={() => setCurrentView('home')} className="brutal-btn brutal-border brutal-shadow-purple uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#39EFB2', gap: '0.5rem' }}>
                  <ChevronLeft size={18} /> Quay Lại
                </button>
                <div style={{ textAlign: 'right', flex: 1, overflow: 'hidden' }}>
                  <h1 className="font-title uppercase truncate" style={{ fontSize: '2rem', lineHeight: 1 }}>{currentTrack.title}</h1>
                  <p className="uppercase truncate" style={{ fontWeight: 'bold', color: '#4b5563', fontSize: '0.875rem' }}>{currentTrack.artist}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="brutal-border brutal-shadow-yellow" style={{ flex: 1, backgroundColor: '#fff', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '300px' }}>
                  <button onClick={togglePlay} className="brutal-btn brutal-border" style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#3B2AA2', color: '#fff', flexShrink: 0 }}>
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div className="brutal-border" style={{ width: '100%', height: '0.75rem', backgroundColor: '#f3f4f6', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: '#39EFB2', width: `${progress}%`, borderRight: '2px solid #000', transition: 'width 0.3s' }}></div>
                    </div>
                    <div className="uppercase" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', fontWeight: 'bold', marginTop: '0.25rem' }}>
                      <span>0:{progress < 10 ? `0${progress}` : progress}</span>
                      <span>3:45</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Volume2 size={18} />
                    <div className="brutal-border" style={{ width: '4rem', height: '0.5rem', backgroundColor: '#f3f4f6' }}>
                      <div style={{ width: '66%', height: '100%', backgroundColor: '#000', borderRight: '2px solid #000' }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="brutal-btn brutal-border brutal-shadow-purple" style={{ padding: '0.5rem 0.75rem', backgroundColor: '#fff' }}><Heart size={18} /></button>
                    <button className="brutal-btn brutal-border brutal-shadow-purple" style={{ padding: '0.5rem 0.75rem', backgroundColor: '#fff' }}><Share2 size={18} /></button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '0.5rem 0.75rem', backgroundColor: '#3B2AA2', color: '#fff', fontSize: '0.75rem', gap: '0.5rem' }}><FileDown size={14} /> PDF</button>
                    <button className="brutal-btn brutal-border brutal-shadow-purple uppercase" style={{ padding: '0.5rem 0.75rem', backgroundColor: '#FACB54', fontSize: '0.75rem', gap: '0.5rem' }}><Disc size={14} /> MIDI</button>
                    <button className="brutal-btn brutal-border brutal-shadow-yellow uppercase" style={{ padding: '0.5rem 0.75rem', backgroundColor: '#39EFB2', fontSize: '0.75rem', gap: '0.5rem' }}><FileAudio size={14} /> MP3</button>
                  </div>
                </div>
              </div>
            </div>

            {/* KHU VỰC HIỂN THỊ SHEET (PDF/MUSICXML) */}
            <div className="brutal-border brutal-shadow-purple" style={{ width: '100%', aspectRatio: '3/4', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #000 20px)', backgroundSize: '100% 20px' }}></div>
              <FileText size={64} style={{ color: '#d1d5db', marginBottom: '1rem', strokeWidth: 1 }} />
              <p className="font-title uppercase" style={{ fontSize: '1.25rem', color: '#9ca3af', textAlign: 'center', padding: '0 1rem' }}>
                Khu vực hiển thị Sheet Music / PDF
              </p>
            </div>

            {/* PHẦN BÌNH LUẬN */}
            <div className="brutal-border brutal-shadow-yellow" style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
              <h2 className="font-title uppercase" style={{ borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={24} /> Bình Luận
              </h2>
              
              <div style={{ marginBottom: '2rem' }}>
                {isLoggedIn ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <textarea className="brutal-border" style={{ width: '100%', padding: '0.75rem', fontWeight: '500', minHeight: '100px', resize: 'vertical' }} placeholder="Nhập bình luận của bạn..."></textarea>
                    <button className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '0.5rem 1.5rem', backgroundColor: '#39EFB2', alignSelf: 'flex-end', gap: '0.5rem' }}>
                      <Send size={16} /> Gửi Bình Luận
                    </button>
                  </div>
                ) : (
                  <div className="brutal-border" style={{ padding: '1.5rem', backgroundColor: '#f3f4f6', textAlign: 'center' }}>
                    <p className="uppercase" style={{ fontWeight: 'bold', color: '#4b5563', marginBottom: '1rem' }}>Vui lòng đăng nhập để bình luận</p>
                    <button onClick={() => setIsLoggedIn(true)} className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#3B2AA2', color: '#fff', gap: '0.5rem' }}>
                      <User size={18} /> Đăng Nhập Ngay
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {MOCK_COMMENTS.map(cmt => (
                  <div key={cmt.id} className="brutal-border" style={{ padding: '1rem', backgroundColor: '#f9fafb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                      <span className="uppercase" style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{cmt.user}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b7280' }}>{cmt.time}</span>
                    </div>
                    <p style={{ fontWeight: '500', color: '#1f2937' }}>{cmt.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TRANG HỒ SƠ (PROFILE) --- */}
        {currentView === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => setCurrentView('home')} className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', alignSelf: 'flex-start', gap: '0.5rem' }}>
              <ChevronLeft size={18} /> Quay Lại
            </button>
            <div className="brutal-border brutal-shadow-purple" style={{ padding: '2.5rem', backgroundColor: '#39EFB2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 className="font-title uppercase" style={{ fontSize: '2.5rem' }}>Trương Phi Long</h1>
                <p className="uppercase" style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Người nghe (jang.logn18)</p>
              </div>
              <button onClick={() => { setIsLoggedIn(false); setCurrentView('home'); }} className="brutal-btn brutal-border brutal-shadow-yellow uppercase" style={{ padding: '0.5rem 1.5rem', backgroundColor: '#fff' }}>
                Đăng Xuất
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="brutal-border brutal-shadow-mint" style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
                <h2 className="font-title uppercase" style={{ borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Dữ Liệu Nghe</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontWeight: '500' }}>
                  <p style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '0.25rem' }}><span>Tổng thời gian:</span> <strong>25 giờ</strong></p>
                  <p style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '0.25rem' }}><span>Bài hát hay nghe:</span> <strong>Gurenge</strong></p>
                  <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sheet đã tải:</span> <strong>14</strong></p>
                </div>
              </div>
              <div className="brutal-border brutal-shadow-purple" style={{ padding: '1.5rem', backgroundColor: '#FACB54' }}>
                <h2 className="font-title uppercase" style={{ borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Bài Hát Đã Lưu</h2>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li className="brutal-btn brutal-border" style={{ width: '100%', padding: '0.5rem', backgroundColor: '#fff', justifyContent: 'space-between', fontSize: '0.875rem' }} onClick={() => handlePlaySheet(MOCK_SHEETS[0])}>
                    <span className="uppercase">Nocturne Op. 9 No. 2</span> <Play size={16}/>
                  </li>
                  <li className="brutal-btn brutal-border" style={{ width: '100%', padding: '0.5rem', backgroundColor: '#fff', justifyContent: 'space-between', fontSize: '0.875rem' }} onClick={() => handlePlaySheet(MOCK_SHEETS[3])}>
                    <span className="uppercase">Interstellar Main Theme</span> <Play size={16}/>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ marginTop: '5rem', borderTop: '4px solid #000', backgroundColor: '#3B2AA2', padding: '4rem 1rem', position: 'relative', overflow: 'hidden', color: '#fff' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div className="brutal-border brutal-shadow-yellow" style={{ width: '8rem', height: '8rem', backgroundColor: '#39EFB2', overflow: 'hidden', flexShrink: 0 }}>
              <img src="/1794575745034.jpg" alt="Trương Phi Long" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h2 className="font-title uppercase brutal-border brutal-shadow-mint" style={{ display: 'inline-block', backgroundColor: '#fff', color: '#000', padding: '0.5rem 1.25rem', fontSize: '2.25rem' }}>
                Trương Phi Long
              </h2>
              <div style={{ marginTop: '0.25rem' }}>
                <p className="uppercase brutal-border" style={{ display: 'inline-block', backgroundColor: '#000', color: '#fff', padding: '0.5rem 1rem', fontWeight: 'bold', fontSize: '0.875rem' }}>
                  [Tiểu sử sẽ được cập nhật sau...]
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {['Facebook', 'Instagram', 'YouTube', 'SoundCloud'].map(social => (
              <button key={social} className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '0 1rem', height: '3rem', backgroundColor: '#fff', color: '#000', fontSize: '0.875rem' }}>
                {social}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '2rem', borderTop: '4px solid rgba(255,255,255,0.2)', paddingTop: '2rem', maxWidth: '600px' }}>
            <h3 className="font-title uppercase brutal-border brutal-shadow-mint" style={{ display: 'inline-block', backgroundColor: '#FACB54', color: '#000', padding: '0.5rem 1rem', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              Donate / Ủng hộ
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="brutal-border brutal-shadow-purple" style={{ flex: 1, backgroundColor: '#fff', color: '#000', padding: '0.75rem 1rem', fontWeight: 'bold', fontSize: '0.875rem', minWidth: '200px' }}>
                <span className="uppercase" style={{ color: '#3B2AA2', display: 'block', marginBottom: '0.25rem' }}>VCB Digibank</span> 
                1012345678<br/>TRUONG PHI LONG
              </div>
              <div className="brutal-border brutal-shadow-mint" style={{ flex: 1, backgroundColor: '#fff', color: '#000', padding: '0.75rem 1rem', fontWeight: 'bold', fontSize: '0.875rem', minWidth: '200px' }}>
                <span className="uppercase" style={{ color: '#a50064', display: 'block', marginBottom: '0.25rem' }}>MoMo</span> 
                0987654321<br/>TRUONG PHI LONG
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
