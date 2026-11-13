import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Heart, Share2, 
  User, FileText, ChevronLeft, Volume2,
  FileDown, FileAudio, Disc, MessageSquare, Send, Sparkles
} from 'lucide-react';

import { supabase } from './supabaseClient';

const MOCK_STATS = { totalHours: 124, topSong: 'Nocturne Op. 9 No. 2', totalSheets: 45, streak: 12 };
const MOCK_TOPICS = ['Piano Solo', 'Classical', 'Anime', 'Nhạc Việt', 'Jazz', 'Soundtrack'];
const MOCK_SHEETS = [
  { id: '1', title: 'Nocturne Op. 9 No. 2', artist: 'Frédéric Chopin', genre: 'Classical', cover: 'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=400' },
  { id: '2', title: 'Gurenge (Demon Slayer)', artist: 'LiSA (Piano Cover)', genre: 'Anime', cover: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=400' },
  { id: '3', title: 'Nơi Này Có Anh', artist: 'Sơn Tùng M-TP', genre: 'Nhạc Việt', cover: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=400' },
  { id: '4', title: 'Interstellar Main Theme', artist: 'Hans Zimmer', genre: 'Soundtrack', cover: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=400' }
];

const MOCK_POSTS = [
  { id: '1', title: 'Hành trình chinh phục La Campanella', date: '24/10/2026', excerpt: 'Kinh nghiệm vượt qua những đoạn nhảy quãng khó nhằn...', content: 'Nội dung chi tiết bài viết...' },
  { id: '2', title: 'Tại sao mình thích dùng MuseScore hơn Sibelius?', date: '15/10/2026', excerpt: 'So sánh chi tiết 2 phần mềm viết nhạc...', content: 'MuseScore hoàn toàn miễn phí...' }
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) alert(error.message);
  };

  const filteredSheets = MOCK_SHEETS.filter(sheet => {
    const matchesSearch = sheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sheet.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || sheet.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

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
        @import url('https://fonts.googleapis.com/css2?family=Phudu:wght@400;500;700;900&display=swap');

        * { border-radius: 0 !important; box-sizing: border-box; margin: 0; padding: 0; }
        button, input, textarea { font-family: inherit; }
        .font-title { font-family: 'Phudu', system-ui, sans-serif !important; font-weight: bold; }
        .brutal-border { border: 2px solid #000; }
        .brutal-shadow-mint { box-shadow: 4px 4px 0px 0px #39EFB2; }
        .brutal-shadow-purple { box-shadow: 4px 4px 0px 0px #3B2AA2; }
        .brutal-shadow-yellow { box-shadow: 4px 4px 0px 0px #FACB54; }
        .brutal-btn { 
          transition: all 0.1s ease-in-out; 
          cursor: pointer; 
          display: inline-flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: bold;
          font-family: 'Space Grotesk', sans-serif !important;
        }
        .brutal-btn:active { transform: translate(4px, 4px); box-shadow: 0px 0px 0px 0px transparent !important; }
        .uppercase { text-transform: uppercase; }
        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      `}</style>
      
      <header className="brutal-border" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#fff', borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="font-title uppercase" style={{ fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setCurrentView('home')}>
          jang.logn18 music
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isLoggedIn ? (
            <button onClick={() => setCurrentView('profile')} className="brutal-btn brutal-border brutal-shadow-purple uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#FACB54', color: '#000', gap: '0.5rem' }}>
              <User size={16} /> Trương Phi Long
            </button>
          ) : (
            <button onClick={handleLogin} className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#3B2AA2', color: '#fff', gap: '0.5rem' }}>
              <User size={16} /> Đăng nhập
            </button>
          )}
        </div>
      </header>

      <main style={{ maxWidth: '1152px', margin: '0 auto', padding: '2rem 1rem', paddingBottom: '5rem' }}>
        {currentView === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Tìm kiếm bài hát, nghệ sĩ..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="brutal-border"
                style={{ padding: '0.75rem 1rem', fontSize: '1rem', width: '100%', fontWeight: 'bold', backgroundColor: '#fff' }}
              />

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setSelectedGenre('All')}
                  className="brutal-btn brutal-border uppercase"
                  style={{ padding: '0.5rem 1rem', backgroundColor: selectedGenre === 'All' ? '#39EFB2' : '#fff' }}
                >
                  Tất cả
                </button>
                {MOCK_TOPICS.map((topic, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedGenre(topic)}
                    className="brutal-btn brutal-border uppercase"
                    style={{ padding: '0.5rem 1rem', backgroundColor: selectedGenre === topic ? '#39EFB2' : '#fff', fontSize: '0.875rem' }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-title uppercase brutal-border brutal-shadow-purple" style={{ display: 'inline-block', backgroundColor: '#39EFB2', padding: '0.25rem 1rem', marginBottom: '1.5rem', fontSize: '1.875rem' }}>
                Bản Nhạc Mới ({filteredSheets.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {filteredSheets.map(sheet => (
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
          </div>
        )}
      </main>
    </div>
  );
}
