import './App.css'
import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Heart, Share2, Music, 
  Upload, User, FileText, ChevronLeft, Volume2,
  FileDown, FileAudio, Disc, MessageSquare, Send, Sparkles
} from 'lucide-react';

// --- MOCK DATA (Tiếng Việt) ---
const MOCK_STATS = {
  totalHours: 124,
  topSong: 'Nocturne Op. 9 No. 2',
  totalSheets: 45,
  streak: 12
};

const MOCK_TOPICS = ['Piano Solo', 'Classical', 'Anime', 'Nhạc Việt', 'Jazz', 'Soundtrack'];

const MOCK_SHEETS = [
  {
    id: '1',
    title: 'Nocturne Op. 9 No. 2',
    artist: 'Frédéric Chopin',
    genre: 'Classical',
    cover: 'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    title: 'Gurenge (Demon Slayer)',
    artist: 'LiSA (Piano Cover)',
    genre: 'Anime',
    cover: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '3',
    title: 'Nơi Này Có Anh',
    artist: 'Sơn Tùng M-TP',
    genre: 'Nhạc Việt',
    cover: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '4',
    title: 'Interstellar Main Theme',
    artist: 'Hans Zimmer',
    genre: 'Soundtrack',
    cover: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=400',
  }
];

const MOCK_POSTS = [
  { 
    id: '1', 
    title: 'Hành trình chinh phục La Campanella', 
    date: '24/10/2026', 
    excerpt: 'Một vài kinh nghiệm và bài tập ngón giúp bạn vượt qua những đoạn nhảy quãng khó nhằn. Bắt đầu từ việc tập chậm...',
    content: 'Nội dung chi tiết của bài viết sẽ nằm ở đây...\n\nLa Campanella là một trong những bản nhạc kinh điển đòi hỏi kỹ thuật nhảy quãng cực kỳ chuẩn xác. Để bắt đầu, bạn không nên nôn nóng đánh đúng tempo ngay lập tức.\n\nThứ nhất, hãy bắt đầu thật chậm, định hình rõ khoảng cách của quãng 8, quãng 10 trên phím đàn. Thứ hai, sự thả lỏng cổ tay là yếu tố quyết định để tay không bị mỏi khi chơi ở tốc độ cao.'
  },
  { 
    id: '2', 
    title: 'Tại sao mình thích dùng MuseScore hơn Sibelius?', 
    date: '15/10/2026', 
    excerpt: 'So sánh chi tiết 2 phần mềm viết nhạc phổ biến nhất hiện nay dựa trên trải nghiệm cá nhân...',
    content: 'MuseScore hoàn toàn miễn phí và mã nguồn mở, đây là một điểm cộng rất lớn cho cộng đồng làm nhạc.\n\nTừ phiên bản 4.0, giao diện của MuseScore thực sự đã lột xác, mang lại cảm giác hiện đại, tối giản và chuyên nghiệp không kém gì các phần mềm trả phí hàng ngàn đô la. Hệ thống playback cũng được nâng cấp đáng kể với Muse Sounds, giúp các bản nhạc giao hưởng nghe chân thực hơn bao giờ hết.'
  },
];

const MOCK_COMMENTS = [
  { id: 1, user: 'Hoàng Trần', text: 'Bản sheet này rất chi tiết, cảm ơn bạn nhiều nhé! Đánh rất sướng tay.', time: '2 giờ trước' },
  { id: 2, user: 'Linh Nguyễn', text: 'Cho mình hỏi đoạn tempo ở ô nhịp 32 đánh sao cho mượt ạ? Mình bị vấp hoài.', time: '5 giờ trước' }
];

const BRUTALIST_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
  
  .font-space { font-family: 'Space Grotesk', sans-serif; }
  /* Fallback sang sans-serif siêu dày nếu không tải được font BD StreetSigns */
  .font-title { font-family: 'BD StreetSign Sans Standard', 'BD StreetSigns', Impact, system-ui, sans-serif; font-weight: normal; }
  
  .brutal-border { border: 2px solid #000; border-radius: 0px !important; }
  .brutal-shadow-mint { box-shadow: 4px 4px 0px 0px #39EFB2; }
  .brutal-shadow-purple { box-shadow: 4px 4px 0px 0px #3B2AA2; }
  .brutal-shadow-yellow { box-shadow: 4px 4px 0px 0px #FACB54; }
  
  .brutal-btn {
    transition: all 0.1s ease-in-out;
    cursor: pointer;
  }
  .brutal-btn:active {
    transform: translate(4px, 4px);
    box-shadow: 0px 0px 0px 0px transparent !important;
  }
  
  /* Ẩn thanh cuộn cho khu vực hiển thị PDF mô phỏng */
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

export default function PhiLongMusicApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'player' | 'post'
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Xử lý tiến trình nhạc giả lập
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
    setProgress(0); // Reset progress khi chọn bài mới
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
    <div className="min-h-screen bg-white text-black font-space selection:bg-[#39EFB2] pb-20">
      <style>{BRUTALIST_STYLES}</style>
      
      {/* HEADER TỔNG */}
      <header className="sticky top-0 z-50 bg-white brutal-border border-x-0 border-t-0 px-4 md:px-6 py-4 flex justify-between items-center">
        {/* Title */}
        <div 
          className="font-title text-2xl md:text-3xl cursor-pointer hover:bg-[#39EFB2] px-2 transition-colors brutal-border border-transparent hover:border-black"
          onClick={() => setCurrentView('home')}
        >
          jang.logn18 music blog
        </div>
        
        <div className="flex items-center gap-4">
          {/* Mini Player (Chỉ hiển thị trên Header khi có bài hát) */}
          {currentTrack && (
            <div className="hidden md:flex items-center gap-3 brutal-border px-3 py-1 bg-white brutal-shadow-mint">
              <button onClick={togglePlay} className="hover:text-[#3B2AA2]">
                {isPlaying ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
              </button>
              <div className="flex flex-col w-32 cursor-pointer" onClick={() => setCurrentView('player')}>
                <span className="text-xs font-bold truncate uppercase">{currentTrack.title}</span>
                <div className="w-full h-1.5 bg-gray-200 brutal-border border-x-0 border-b-0 mt-1">
                  <div className="h-full bg-[#FACB54] border-r-2 border-black transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {/* User Actions */}
          {isLoggedIn ? (
            <button
              onClick={() => setCurrentView('profile')}
              className="brutal-btn brutal-border px-4 py-1.5 bg-[#FACB54] text-black brutal-shadow-purple font-bold flex items-center gap-2 uppercase text-sm"
            >
              <User size={16} /> Trương Phi Long
            </button>
          ) : (
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="brutal-btn brutal-border px-4 py-1.5 bg-[#3B2AA2] text-white brutal-shadow-mint font-bold flex items-center gap-2 uppercase text-sm"
            >
              <User size={16} /> Đăng nhập
            </button>
          )}
        </div>
      </header>

      {/* NỘI DUNG CHÍNH (Dựa vào State để render Home hoặc Player) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {/* --- TRANG CHỦ --- */}
        {currentView === 'home' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Nút Đề xuất bài hát */}
            <div className="flex justify-start">
               <button className="brutal-btn brutal-border px-6 py-3 bg-[#FACB54] text-black brutal-shadow-mint font-title text-xl sm:text-2xl uppercase flex items-center gap-3 hover:bg-black hover:text-white transition-colors">
                 <Sparkles size={28} /> Đề xuất bài hát
               </button>
            </div>

            {/* Dữ liệu nghe & Chủ đề */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Dữ liệu nghe giả lập */}
              <div className="md:col-span-1 brutal-border p-5 bg-[#FACB54] brutal-shadow-purple">
                <h2 className="font-title text-2xl uppercase border-b-2 border-black pb-2 mb-4">Dữ Liệu Nghe</h2>
                <div className="space-y-3 font-medium">
                  <p className="flex justify-between border-b-2 border-black/20 pb-1">
                    <span>Tổng thời gian:</span> <span className="font-bold">{MOCK_STATS.totalHours} giờ</span>
                  </p>
                  <p className="flex justify-between border-b-2 border-black/20 pb-1">
                    <span>Bài hát tuần:</span> <span className="font-bold truncate max-w-[120px]">{MOCK_STATS.topSong}</span>
                  </p>
                  <p className="flex justify-between border-b-2 border-black/20 pb-1">
                    <span>Chuỗi nghe:</span> <span className="font-bold">{MOCK_STATS.streak} ngày</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Tổng sheet:</span> <span className="font-bold">{MOCK_STATS.totalSheets}</span>
                  </p>
                </div>
              </div>

              {/* Chủ đề */}
              <div className="md:col-span-2 brutal-border p-5 bg-white brutal-shadow-mint">
                <h2 className="font-title text-2xl uppercase border-b-2 border-black pb-2 mb-4">Chủ Đề</h2>
                <div className="flex flex-wrap gap-3">
                  {MOCK_TOPICS.map((topic, idx) => (
                    <button key={idx} className="brutal-btn brutal-border px-4 py-2 bg-white hover:bg-gray-100 font-bold uppercase text-sm">
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bản nhạc mới */}
            <div>
              <h2 className="font-title text-3xl uppercase mb-6 inline-block bg-[#39EFB2] px-3 py-1 brutal-border brutal-shadow-purple">
                Bản Nhạc Mới
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_SHEETS.map(sheet => (
                  <div key={sheet.id} className="brutal-border bg-white p-3 brutal-shadow-mint flex flex-col group transition-all">
                    <div className="w-full aspect-square brutal-border overflow-hidden relative mb-3 bg-black">
                      <img src={sheet.cover} alt={sheet.title} className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                      <div className="absolute top-2 right-2 bg-white text-black px-2 py-0.5 text-xs font-bold brutal-border uppercase">
                        {sheet.genre}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-title uppercase mb-1 line-clamp-1" title={sheet.title}>{sheet.title}</h3>
                    <p className="text-sm font-medium mb-4 uppercase text-gray-600 line-clamp-1">{sheet.artist}</p>
                    
                    <button 
                      onClick={() => handlePlaySheet(sheet)}
                      className="mt-auto w-full brutal-btn brutal-border py-2 bg-white hover:bg-[#39EFB2] font-bold flex items-center justify-center gap-2 uppercase text-sm"
                    >
                      <Play size={16} /> Nghe & Xem Sheet
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bài viết Blog */}
            <div>
              <h2 className="font-title text-3xl uppercase mb-6 inline-block bg-[#3B2AA2] text-white px-3 py-1 brutal-border brutal-shadow-yellow">
                Bài Viết (Blog)
              </h2>
              <div className="flex flex-col gap-4">
                {MOCK_POSTS.map(post => (
                  <div key={post.id} className="brutal-border bg-white p-4 sm:p-5 brutal-shadow-mint hover:bg-[#FACB54] transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group">
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-title uppercase mb-1 group-hover:underline decoration-4 underline-offset-4">{post.title}</h3>
                      <div className="text-sm font-bold text-gray-600 mb-3 border-b-2 border-black inline-block pb-1">
                        {post.date}
                      </div>
                      <p className="text-sm text-gray-800 line-clamp-2">{post.excerpt}</p>
                    </div>
                    <button 
                      onClick={() => handleReadPost(post)}
                      className="brutal-btn brutal-border bg-white px-6 py-2 font-bold uppercase text-sm brutal-shadow-purple shrink-0 mt-2 md:mt-0"
                    >
                      Đọc
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* --- TRANG BÀI VIẾT (POST) --- */}
        {currentView === 'post' && currentPost && (
          <div className="animate-in slide-in-from-bottom-8 duration-300 space-y-6 max-w-4xl mx-auto">
            <button 
              onClick={() => setCurrentView('home')}
              className="brutal-btn brutal-border px-4 py-2 bg-white brutal-shadow-mint font-bold flex items-center gap-2 uppercase text-sm mb-6"
            >
              <ChevronLeft size={18} /> Quay Lại
            </button>
            
            <div className="brutal-border bg-white p-6 sm:p-10 brutal-shadow-yellow">
              <h1 className="font-title text-3xl sm:text-5xl uppercase leading-tight mb-4">{currentPost.title}</h1>
              
              <div className="font-bold text-gray-600 mb-8 pb-4 border-b-4 border-black inline-block uppercase">
                Đăng ngày: {currentPost.date}
              </div>
              
              <div className="space-y-4 text-lg leading-relaxed whitespace-pre-line font-medium text-gray-900">
                {currentPost.content}
              </div>
            </div>
          </div>
        )}

        {/* --- TRANG TRÌNH PHÁT (PLAYER) --- */}
        {currentView === 'player' && currentTrack && (
          <div className="animate-in slide-in-from-right-8 duration-300 flex flex-col">
            
            {/* CONTROL PANEL - Đưa lên đầu và Sticky */}
            <div className="sticky top-[73px] z-40 bg-white py-4 mb-8 border-b-4 border-black brutal-shadow-mint space-y-4 px-2 -mx-2 sm:mx-0 sm:px-4 mt-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button 
                  onClick={() => setCurrentView('home')}
                  className="brutal-btn brutal-border px-4 py-2 bg-[#39EFB2] brutal-shadow-purple font-bold flex items-center gap-2 uppercase text-sm shrink-0"
                >
                  <ChevronLeft size={18} /> Quay Lại
                </button>
                
                <div className="flex-1 text-left sm:text-right overflow-hidden w-full">
                  <h1 className="font-title text-2xl sm:text-4xl uppercase leading-none mb-1 truncate">{currentTrack.title}</h1>
                  <p className="font-bold text-gray-600 uppercase text-sm truncate">{currentTrack.artist}</p>
                </div>
              </div>

              {/* AUDIO CONTROLS & ACTIONS */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Thanh điều khiển */}
                <div className="flex-1 brutal-border bg-white p-3 brutal-shadow-yellow flex flex-col justify-center">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={togglePlay}
                      className="brutal-btn brutal-border w-10 h-10 flex items-center justify-center bg-[#3B2AA2] text-white hover:bg-[#FACB54] hover:text-black shrink-0"
                    >
                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                    
                    {/* Progress Bar */}
                    <div className="flex-1">
                      <div className="w-full h-3 brutal-border bg-gray-100 cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-[#39EFB2] border-r-2 border-black transition-all duration-300" style={{ width: `${progress}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold mt-1 uppercase">
                        <span>0:{progress < 10 ? `0${progress}` : progress}</span>
                        <span>3:45</span>
                      </div>
                    </div>

                    {/* Volume */}
                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                      <Volume2 size={18} />
                      <div className="w-16 h-2 brutal-border bg-gray-100">
                        <div className="w-2/3 h-full bg-black border-r-2 border-black"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nhóm Nút Tương tác & Tải xuống */}
                <div className="flex flex-wrap lg:flex-nowrap items-stretch gap-3 shrink-0">
                  <div className="flex gap-3">
                    <button className="brutal-btn brutal-border p-2 px-3 bg-white hover:bg-[#fc88a1] brutal-shadow-purple text-black flex items-center justify-center" title="Yêu thích">
                      <Heart size={18} />
                    </button>
                    <button className="brutal-btn brutal-border p-2 px-3 bg-white hover:bg-gray-100 brutal-shadow-purple text-black flex items-center justify-center" title="Chia sẻ">
                      <Share2 size={18} />
                    </button>
                  </div>

                  <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                    <button className="brutal-btn brutal-border px-3 py-2 bg-[#3B2AA2] text-white hover:text-black hover:bg-white brutal-shadow-mint font-bold uppercase flex items-center gap-2 text-xs">
                      <FileDown size={14} /> PDF
                    </button>
                    <button className="brutal-btn brutal-border px-3 py-2 bg-[#FACB54] hover:bg-white brutal-shadow-purple font-bold uppercase flex items-center gap-2 text-xs">
                      <Disc size={14} /> MIDI
                    </button>
                    <button className="brutal-btn brutal-border px-3 py-2 bg-[#39EFB2] hover:bg-white brutal-shadow-yellow font-bold uppercase flex items-center gap-2 text-xs">
                      <FileAudio size={14} /> MP3
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* KHU VỰC HIỂN THỊ SHEET (PDF/MUSICXML) */}
            <div className="w-full aspect-[1/1.4] md:aspect-[3/4] brutal-border bg-gray-50 brutal-shadow-purple flex flex-col items-center justify-center relative overflow-hidden mb-12">
              <div className="absolute inset-0 opacity-10 pointer-events-none" 
                   style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #000 20px)', backgroundSize: '100% 20px'}}
              ></div>
              <FileText size={64} strokeWidth={1} className="text-gray-300 mb-4" />
              <p className="font-title text-xl text-gray-400 uppercase text-center px-4">
                Khu vực hiển thị Sheet Music / PDF<br/>(Sẽ nhúng OpenSheetMusicDisplay hoặc iframe PDF vào đây)
              </p>
            </div>

            {/* PHẦN BÌNH LUẬN */}
            <div className="brutal-border bg-white p-6 brutal-shadow-yellow mt-4">
              <h2 className="font-title text-2xl uppercase border-b-2 border-black pb-2 mb-6 flex items-center gap-2">
                <MessageSquare size={24} /> Bình Luận
              </h2>
              
              {/* Form Bình luận */}
              <div className="mb-8">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-3">
                    <textarea 
                      className="w-full brutal-border p-3 font-medium focus:outline-none focus:bg-gray-50 resize-y min-h-[100px]" 
                      placeholder="Nhập bình luận của bạn..."
                    ></textarea>
                    <button className="brutal-btn brutal-border px-6 py-2 bg-[#39EFB2] hover:bg-[#3B2AA2] hover:text-white brutal-shadow-mint font-bold uppercase self-end flex items-center gap-2">
                      <Send size={16} /> Gửi Bình Luận
                    </button>
                  </div>
                ) : (
                  <div className="brutal-border bg-gray-100 p-6 text-center">
                    <p className="font-bold text-gray-600 mb-4 uppercase text-lg">Vui lòng đăng nhập để bình luận</p>
                    <button 
                      onClick={() => setIsLoggedIn(true)}
                      className="brutal-btn brutal-border px-6 py-3 bg-[#3B2AA2] text-white hover:bg-white hover:text-black brutal-shadow-mint font-bold uppercase inline-flex items-center gap-2"
                    >
                      <User size={18} /> Đăng Nhập Ngay
                    </button>
                  </div>
                )}
              </div>

              {/* Danh sách bình luận */}
              <div className="space-y-4">
                {MOCK_COMMENTS.map(cmt => (
                  <div key={cmt.id} className="brutal-border bg-gray-50 p-4">
                    <div className="flex justify-between items-center mb-2 border-b-2 border-black/10 pb-2">
                      <span className="font-bold uppercase text-sm">{cmt.user}</span>
                      <span className="text-xs font-bold text-gray-500">{cmt.time}</span>
                    </div>
                    <p className="font-medium text-gray-800">{cmt.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* --- TRANG HỒ SƠ CÁ NHÂN (PROFILE) --- */}
        {currentView === 'profile' && (
          <div className="animate-in slide-in-from-bottom-8 duration-300 space-y-8 max-w-4xl mx-auto">
            <button 
              onClick={() => setCurrentView('home')}
              className="brutal-btn brutal-border px-4 py-2 bg-white brutal-shadow-mint font-bold flex items-center gap-2 uppercase text-sm mb-2"
            >
              <ChevronLeft size={18} /> Quay Lại
            </button>
            
            <div className="brutal-border bg-[#39EFB2] p-6 sm:p-10 brutal-shadow-purple flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-title text-4xl uppercase">Trương Phi Long</h1>
                <p className="font-bold uppercase mt-2">Người nghe (jang.logn18)</p>
              </div>
              <button 
                onClick={() => {
                  setIsLoggedIn(false);
                  setCurrentView('home');
                }}
                className="brutal-btn brutal-border px-6 py-2 bg-white hover:bg-gray-100 brutal-shadow-yellow font-bold uppercase text-sm"
              >
                Đăng Xuất
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dữ liệu cá nhân */}
              <div className="brutal-border bg-white p-6 brutal-shadow-mint">
                <h2 className="font-title text-2xl uppercase border-b-2 border-black pb-2 mb-4">Dữ Liệu Nghe</h2>
                <div className="space-y-3 font-medium">
                  <p className="flex justify-between border-b-2 border-black/20 pb-1">
                    <span>Tổng thời gian:</span> <span className="font-bold">25 giờ</span>
                  </p>
                  <p className="flex justify-between border-b-2 border-black/20 pb-1">
                    <span>Bài hát hay nghe:</span> <span className="font-bold truncate max-w-[120px]">Gurenge</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Sheet đã tải:</span> <span className="font-bold">14</span>
                  </p>
                </div>
              </div>

              {/* Bài hát đã lưu */}
              <div className="brutal-border bg-[#FACB54] p-6 brutal-shadow-purple">
                <h2 className="font-title text-2xl uppercase border-b-2 border-black pb-2 mb-4">Bài Hát Đã Lưu</h2>
                <ul className="space-y-2 font-bold uppercase text-sm">
                  <li className="brutal-border bg-white p-2 flex justify-between items-center brutal-btn hover:bg-[#39EFB2]" onClick={() => handlePlaySheet(MOCK_SHEETS[0])}>
                    <span>Nocturne Op. 9 No. 2</span> <Play size={16}/>
                  </li>
                  <li className="brutal-border bg-white p-2 flex justify-between items-center brutal-btn hover:bg-[#39EFB2]" onClick={() => handlePlaySheet(MOCK_SHEETS[3])}>
                    <span>Interstellar Main Theme</span> <Play size={16}/>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t-4 border-black bg-[#3B2AA2] py-16 px-4 md:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 19px, #000 20px)', backgroundSize: '100% 28px'}}>
        </div>
        
        <div className="max-w-6xl mx-auto flex flex-col items-start text-left space-y-6 relative z-10">
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 w-full">
            {/* Avatar */}
            <div className="w-32 h-32 bg-[#39EFB2] brutal-border brutal-shadow-yellow relative overflow-hidden p-0 shrink-0">
              <img 
                src="1794575745034.jpg" 
                alt="Trương Phi Long" 
                className="w-full h-full object-cover brutal-border border-0" 
              />
            </div>
            
            {/* Thông tin */}
            <div className="flex flex-col items-start gap-2">
              <h2 className="font-title text-3xl md:text-5xl uppercase bg-white text-black brutal-border inline-block px-5 py-2 brutal-shadow-mint">
                Trương Phi Long
              </h2>
              <p className="font-bold text-sm sm:text-base bg-black text-white px-4 py-2 brutal-border inline-block max-w-2xl mt-1">
                [Tiểu sử sẽ được cập nhật sau...]
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-start gap-4 mt-2">
            {['Facebook', 'Instagram', 'YouTube', 'SoundCloud', 'TikTok'].map(social => (
              <button 
                key={social} 
                className="brutal-btn px-4 h-12 brutal-border bg-white text-black hover:bg-[#FACB54] hover:text-black brutal-shadow-mint flex items-center justify-center font-bold text-sm uppercase"
              >
                {social}
              </button>
            ))}
          </div>

          {/* Donate Section */}
          <div className="mt-8 border-t-4 border-white/20 pt-8 w-full max-w-2xl">
            <h3 className="font-title text-2xl uppercase bg-[#FACB54] text-black brutal-border inline-block px-4 py-2 brutal-shadow-mint mb-5">
              Donate / Ủng hộ
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 font-bold text-sm sm:text-base">
              <div className="bg-white text-black px-4 py-3 brutal-border brutal-shadow-purple flex-1">
                <span className="text-[#3B2AA2] uppercase block mb-1">VCB Digibank</span> 
                1012345678<br/>TRUONG PHI LONG
              </div>
              <div className="bg-white text-black px-4 py-3 brutal-border brutal-shadow-mint flex-1">
                <span className="text-[#a50064] uppercase block mb-1">MoMo</span> 
                0987654321<br/>TRUONG PHI LONG
              </div>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
