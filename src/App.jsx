import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Heart, Share2, 
  User, FileText, ChevronLeft, Volume2,
  FileDown, FileAudio, Disc, MessageSquare, Send, Sparkles, Search, Upload, PlusCircle, Calendar,
  Coffee
} from 'lucide-react';

import { supabase } from './supabaseClient';

const MOCK_TOPICS = ['Piano Solo', 'Classical', 'Anime', 'Nhạc Việt', 'Jazz', 'Soundtrack'];

const normalizeSearchText = (text) => {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
};

const explainDatabaseError = (error) => {
  if (typeof error === 'string') return error;
  if (!error || typeof error !== 'object') return String(error ?? 'Lỗi không xác định');

  const summary = error.message || 'Supabase trả về lỗi không xác định';
  const code = error.code ? `Mã: ${error.code}` : '';
  const details = error.details ? `Chi tiết: ${error.details}` : '';
  const hint = error.hint ? `Gợi ý: ${error.hint}` : '';

  return [summary, code, details, hint].filter(Boolean).join(' | ');
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  
  // Trạng thái phát nhạc & Thanh tiến trình
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const [sheets, setSheets] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likedSheetIds, setLikedSheetIds] = useState([]);
  const [authReady, setAuthReady] = useState(false);
  const [sheetsLoadError, setSheetsLoadError] = useState('');
  const [likesError, setLikesError] = useState('');
  const [isSavingLike, setIsSavingLike] = useState(false);

  // States tìm kiếm & lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Trạng thái bình luận
  const [newCommentText, setNewCommentText] = useState('');

  // Form Admin (Thêm Sheet)
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('Classical');
  const [newArtists, setNewArtists] = useState('');
  const [newLyrics, setNewLyrics] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [midiFile, setMidiFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  // Form Admin (Đăng bài viết)
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const isAdmin = profile?.role === 'admin' || user?.email === 'trphilong18@gmail.com';

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) console.error('Không khôi phục được phiên đăng nhập:', error);
        if (session) {
          setIsLoggedIn(true);
          setUser(session.user);
          fetchProfile(session.user.id);
          fetchUserLikes(session.user.id);
        }
      })
      .catch(error => console.error('Lỗi xác thực:', error))
      .finally(() => setAuthReady(true));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        setUser(session.user);
        await fetchProfile(session.user.id);
        fetchUserLikes(session.user.id);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setProfile(null);
        setLikedSheetIds([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Chỉ đọc bảng sau khi Supabase đã khôi phục phiên đăng nhập.
  // Hủy kết quả của lượt đọc cũ nếu người dùng đăng nhập/đăng xuất.
  useEffect(() => {
    if (!authReady) return;

    let active = true;
    const loadCatalog = async () => {
      const [sheetResult, postResult] = await Promise.all([
        supabase.from('sheets').select('*').order('created_at', { ascending: false }),
        supabase.from('posts').select('*').order('created_at', { ascending: false })
      ]);
      if (!active) return;

      if (sheetResult.error) {
        console.error('Không đọc được bảng sheets:', sheetResult.error);
        setSheetsLoadError(sheetResult.error.message);
      } else {
        setSheets(sheetResult.data ?? []);
        setSheetsLoadError('');
      }
      if (postResult.error) {
        console.error('Không đọc được bảng posts:', postResult.error);
      } else {
        setPosts(postResult.data ?? []);
      }
    };
    loadCatalog().catch(error => {
      if (!active) return;
      console.error('Lỗi tải danh sách:', error);
      setSheetsLoadError(error instanceof Error ? error.message : String(error));
    });

    return () => { active = false; };
  }, [authReady, user?.id]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log("Play error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const fetchProfile = async (userId) => {
    let { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error || !data) {
      const newProf = { id: userId, display_name: user?.user_metadata?.full_name || 'Trương Phi Long', role: 'user' };
      await supabase.from('profiles').upsert([newProf]);
      setProfile(newProf);
    } else {
      setProfile(data);
    }
  };

  const fetchUserLikes = async (userId) => {
    const { data, error } = await supabase.from('likes').select('sheet_id').eq('user_id', userId);
    if (error) {
      console.error('Không đọc được bài hát đã lưu:', error);
      setLikesError(explainDatabaseError(error));
      return;
    }
    setLikedSheetIds((data ?? []).map(item => item.sheet_id));
    setLikesError('');
  };

  const fetchComments = async (sheetId) => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('sheet_id', sheetId)
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setComments(data);
    } else {
      setComments([]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentView('home');
  };

  const dynamicGenres = ['All', ...new Set(sheets.map(s => s.genre).filter(Boolean))];

  
const searchKeywords = normalizeSearchText(searchTerm)
  .split(' ')
  .filter(Boolean);

const filteredSheets = sheets.filter(sheet => {
  // Tìm theo tên nhạc khúc, nghệ sĩ và ca từ
  const searchableText = normalizeSearchText(
    `${sheet.title ?? ''} ${sheet.artists ?? ''} ${sheet.description ?? ''}`
  );

  // Tất cả từ khóa phải xuất hiện trong dữ liệu
  const matchesSearch = searchKeywords.every(keyword =>
    searchableText.includes(keyword)
  );

  // Giữ nguyên tính năng lọc thể loại
  const matchesGenre =
    selectedGenre === 'All' || sheet.genre === selectedGenre;

  return matchesSearch && matchesGenre;
});


  const handlePlaySheet = (sheet) => {
    if (currentTrack?.id !== sheet.id) {
      setCurrentTrack(sheet);
      setIsPlaying(false);
      setCurrentTime(0);
    }
    setCurrentView('player');
    window.scrollTo(0, 0);
    fetchComments(sheet.id);
  };

  const handleReadPost = (post) => {
    setCurrentPost(post);
    setCurrentView('post');
    window.scrollTo(0, 0);
  };

  const togglePlay = () => {
    if (!currentTrack && sheets.length > 0) {
      setCurrentTrack(sheets[0]);
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Đã sao chép liên kết bài hát!');
  };

  const toggleLike = async () => {
    if (!isLoggedIn || !user?.id) return alert('Vui lòng đăng nhập!');
    if (!currentTrack || isSavingLike) return;

    const sheetId = currentTrack.id;
    const wasLiked = likedSheetIds.includes(sheetId);
    setIsSavingLike(true);
    setLikesError('');

    try {
      const { error: writeError } = wasLiked
        ? await supabase.from('likes').delete().eq('user_id', user.id).eq('sheet_id', sheetId)
        : await supabase.from('likes').insert([{ user_id: user.id, sheet_id: sheetId }]);

      if (writeError) throw writeError;

      // Xác nhận dữ liệu có thể đọc lại từ database, thay vì chỉ đổi trạng thái trên giao diện.
      const { data, error: readError } = await supabase
        .from('likes')
        .select('sheet_id')
        .eq('user_id', user.id);

      if (readError) throw readError;
      const savedIds = (data ?? []).map(item => item.sheet_id);
      setLikedSheetIds(savedIds);

      if (savedIds.includes(sheetId) === wasLiked) {
        throw new Error('Không đọc lại được thay đổi vừa lưu. Hãy kiểm tra quyền SELECT/INSERT/DELETE (RLS) của bảng likes trong Supabase.');
      }
    } catch (error) {
      const message = explainDatabaseError(error);
      console.error('Lỗi lưu bài hát:', error);
      setLikesError(message);
      alert('Không thể xác nhận thay đổi bài hát đã lưu: ' + message);
    } finally {
      setIsSavingLike(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !isLoggedIn) return;

    const newCmt = {
      sheet_id: currentTrack.id,
      user_id: user.id,
      user_name: profile?.display_name || user?.user_metadata?.full_name || user?.email || 'Người dùng',
      content: newCommentText
    };

    const { data, error } = await supabase.from('comments').insert([newCmt]).select();
    if (!error && data) {
      setComments([data[0], ...comments]);
      setNewCommentText('');
    } else {
      alert('Lỗi đăng bình luận: ' + error.message);
    }
  };

  const handleAddSheet = async (e) => {
    e.preventDefault();
    if (!newTitle) return alert('Vui lòng nhập tên bài!');

    let pdf_url = '', midi_url = '', audio_url = '';

    try {
      if (pdfFile) {
        const { data } = await supabase.storage.from('sheets-storage').upload(`pdf/${Date.now()}_${pdfFile.name}`, pdfFile);
        if (data) pdf_url = supabase.storage.from('sheets-storage').getPublicUrl(data.path).data.publicUrl;
      }
      if (midiFile) {
        const { data } = await supabase.storage.from('sheets-storage').upload(`midi/${Date.now()}_${midiFile.name}`, midiFile);
        if (data) midi_url = supabase.storage.from('sheets-storage').getPublicUrl(data.path).data.publicUrl;
      }
      if (audioFile) {
        const { data } = await supabase.storage.from('sheets-storage').upload(`audio/${Date.now()}_${audioFile.name}`, audioFile);
        if (data) audio_url = supabase.storage.from('sheets-storage').getPublicUrl(data.path).data.publicUrl;
      }
    } catch (err) {
      console.log(err);
    }

    const newItem = {
      title: newTitle.trim(),
      genre: newGenre,
      artists: newArtists.trim(),
      description: newLyrics,
      pdf_url, midi_url, audio_url,
      uploader_id: user.id
    };

    const { data, error } = await supabase.from('sheets').insert([newItem]).select();
    if (!error && data) {
      setSheets([data[0], ...sheets]);
      setNewTitle('');
      setNewArtists('');
      setNewLyrics('');
      setPdfFile(null); setMidiFile(null); setAudioFile(null);
      alert('Tải lên thành công!');
    } else {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) return;
    const newP = { title: newPostTitle, date: new Date().toLocaleDateString('vi-VN'), excerpt: newPostContent.slice(0, 80), content: newPostContent };
    const { data, error } = await supabase.from('posts').insert([newP]).select();
    if (!error && data) {
      setPosts([data[0], ...posts]);
      setNewPostTitle(''); setNewPostContent('');
      alert('Đăng bài thành công!');
    }
  };

  const isCurrentLiked = currentTrack ? likedSheetIds.includes(currentTrack.id) : false;
  const savedSheetsList = sheets.filter(s => likedSheetIds.includes(s.id));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#000000', fontFamily: "'Space Grotesk', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Phudu:wght@400;500;700;900&display=swap');

        * { border-radius: 0 !important; box-sizing: border-box; margin: 0; padding: 0; }
        button, input, textarea, select { font-family: inherit; }
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
        }
        .brutal-btn:active { transform: translate(4px, 4px); box-shadow: 0px 0px 0px 0px transparent !important; }
        .uppercase { text-transform: uppercase; }
        .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
      
      {currentTrack?.audio_url && (
        <audio 
          ref={audioRef} 
          src={currentTrack.audio_url} 
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <header className="brutal-border" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#fff', borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="font-title uppercase" style={{ fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setCurrentView('home')}>
          jang.logn18 nhạc chí
        </div>

        {currentTrack && (
          <div className="brutal-border" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#FACB54', padding: '0.35rem 1rem', boxShadow: '2px 2px 0px #000' }}>
            <button onClick={togglePlay} className="brutal-btn brutal-border" style={{ width: '2rem', height: '2rem', backgroundColor: '#3B2AA2', color: '#fff' }}>
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <div className="truncate" style={{ maxWidth: '180px', fontSize: '0.85rem', fontWeight: 'bold' }}>
              {currentTrack.title}
            </div>
            {currentView !== 'player' && (
              <button onClick={() => setCurrentView('player')} className="brutal-btn brutal-border uppercase" style={{ padding: '0.2rem 0.5rem', backgroundColor: '#fff', fontSize: '0.75rem' }}>
                Xem
              </button>
            )}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isLoggedIn ? (
            <button onClick={() => setCurrentView('profile')} className="brutal-btn brutal-border brutal-shadow-purple uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#FACB54', color: '#000', gap: '0.5rem' }}>
              <User size={16} /> {profile?.display_name || user?.email}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="brutal-border brutal-shadow-purple" style={{ padding: '1.5rem', backgroundColor: '#FACB54' }}>
                <h2 className="font-title uppercase" style={{ borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>Thống kê</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontWeight: '500' }}>
                  <p style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '0.25rem' }}><span>Tổng số nhạc phổ:</span> <strong>{sheets.length} bài</strong></p>
                  <p style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '0.25rem' }}><span>Tổng số võng chí:</span> <strong>{posts.length} bài</strong></p>
                  <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Bạn đã lưu:</span> <strong>{likedSheetIds.length} bài</strong></p>
                </div>
              </div>

              <div className="brutal-border brutal-shadow-mint" style={{ padding: '1.5rem', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h2 className="font-title uppercase" style={{ borderBottom: '2px solid #000', paddingBottom: '0.5rem', fontSize: '1.5rem' }}>Tra cứu</h2>
                <input 
                  type="text" 
                  placeholder="Tra cứu nhạc khúc, nghệ sĩ, ca từ" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="brutal-border"
                  style={{ padding: '0.65rem 1rem', fontSize: '0.95rem', width: '100%', fontWeight: 'bold' }}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {dynamicGenres.map((genre, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedGenre(genre)} 
                      className="brutal-btn brutal-border uppercase" 
                      style={{ padding: '0.4rem 0.75rem', backgroundColor: selectedGenre === genre ? '#39EFB2' : '#fff', fontSize: '0.8rem' }}
                    >
                      {genre === 'All' ? 'Tất cả' : genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="brutal-border brutal-shadow-yellow" style={{ padding: '2rem', backgroundColor: '#fff9e6', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <h2 className="font-title uppercase" style={{ borderBottom: '2px solid #000', paddingBottom: '0.5rem', fontSize: '1.75rem', color: '#b45309' }}>🛡️ Admin Dashboard (Trương Phi Long)</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  <form onSubmit={handleAddSheet} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 className="font-title uppercase" style={{ fontSize: '1.125rem' }}>Tải Lên Nhạc Phổ</h3>
                    <input type="text" placeholder="Tên bài hát..." value={newTitle} onChange={e => setNewTitle(e.target.value)} className="brutal-border" style={{ padding: '0.5rem', backgroundColor: '#fff' }} />
                    <input type="text" placeholder="Chủ đề / Thể loại (Genre)..." value={newGenre} onChange={e => setNewGenre(e.target.value)} className="brutal-border" style={{ padding: '0.5rem', backgroundColor: '#fff' }} />
                    <label htmlFor="sheet-artists" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Nghệ sĩ:</label>
                    <input id="sheet-artists" type="text" placeholder="Tên nghệ sĩ / nhóm nghệ sĩ..." value={newArtists} onChange={e => setNewArtists(e.target.value)} className="brutal-border" style={{ padding: '0.5rem', backgroundColor: '#fff' }} />
                    <label htmlFor="sheet-lyrics" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Ca từ / Lời bài hát:</label>
                    
                    <textarea id="sheet-lyrics"
                      placeholder="Nhập lời bài hát (có thể xuống dòng)..." 
                      value={newLyrics} 
                      onChange={e => setNewLyrics(e.target.value)} 
                      className="brutal-border" 
                      style={{ padding: '0.5rem', backgroundColor: '#fff', minHeight: '160px', resize: 'vertical' }}
                    ></textarea>

                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>PDF:</label>
                    <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])} />
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>MIDI:</label>
                    <input type="file" accept=".mid" onChange={e => setMidiFile(e.target.files[0])} />
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Audio (MP3):</label>
                    <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files[0])} />

                    <button type="submit" className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '0.5rem', backgroundColor: '#39EFB2', marginTop: '0.5rem' }}><Upload size={16} /> Lưu Lên Database</button>
                  </form>

                  <form onSubmit={handleAddPost} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 className="font-title uppercase" style={{ fontSize: '1.125rem' }}>Đăng Bài Viết Blog Mới</h3>
                    <input type="text" placeholder="Tiêu đề bài viết..." value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} className="brutal-border" style={{ padding: '0.5rem', backgroundColor: '#fff' }} />
                    <textarea placeholder="Nội dung chi tiết..." value={newPostContent} onChange={e => setNewPostContent(e.target.value)} className="brutal-border" style={{ padding: '0.5rem', backgroundColor: '#fff', minHeight: '130px', resize: 'vertical' }}></textarea>
                    <button type="submit" className="brutal-btn brutal-border brutal-shadow-purple uppercase" style={{ padding: '0.5rem', backgroundColor: '#3B2AA2', color: '#fff', marginTop: 'auto' }}><PlusCircle size={16} /> Đăng Bài Viết</button>
                  </form>
                </div>
              </div>
            )}

            <div>
              <h2 className="font-title uppercase brutal-border brutal-shadow-purple" style={{ display: 'inline-block', backgroundColor: '#39EFB2', padding: '0.25rem 1rem', marginBottom: '1.5rem', fontSize: '1.875rem' }}>
                Nhạc phổ ({filteredSheets.length})
              </h2>
              {sheetsLoadError && <p role="alert" style={{ color: '#991b1b', backgroundColor: '#fef2f2', padding: '0.75rem', marginBottom: '1rem', fontWeight: 'bold' }}>Không thể tải danh sách nhạc từ Supabase: {sheetsLoadError}</p>}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 320px))', gap: '1.5rem' }}>
                {filteredSheets.map(sheet => (
                  <div key={sheet.id} className="brutal-border brutal-shadow-mint" style={{ padding: '1rem', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 className="font-title uppercase truncate" style={{ fontSize: '1.125rem' }}>{sheet.title}</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 'bold', color: '#4b5563' }}>
                      <span className="uppercase">{sheet.genre}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} /> {formatDate(sheet.created_at)}
                      </span>
                    </div>

                    {sheet.artists && <p className="line-clamp-2" style={{ fontSize: '0.8rem', color: '#6b7280' }}>{sheet.artists}</p>}
                    
                    <button onClick={() => handlePlaySheet(sheet)} className="brutal-btn brutal-border uppercase" style={{ marginTop: 'auto', padding: '0.75rem', backgroundColor: '#fff', width: '100%' }}>
                      <Play size={16} /> Khán thính
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-title uppercase brutal-border brutal-shadow-yellow" style={{ display: 'inline-block', backgroundColor: '#3B2AA2', color: '#fff', padding: '0.25rem 1rem', marginBottom: '1.5rem', fontSize: '1.875rem' }}>
                Võng chí
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {posts.map(post => (
                  <div key={post.id} className="brutal-border brutal-shadow-mint" style={{ padding: '1.25rem', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <h3 className="font-title uppercase" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{post.title}</h3>
                      <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#4b5563', borderBottom: '2px solid #000', display: 'inline-block', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>{post.date}</div>
                      <p className="line-clamp-2" style={{ fontSize: '0.875rem', color: '#1f2937' }}>{post.excerpt}</p>
                    </div>
                    <button onClick={() => handleReadPost(post)} className="brutal-btn brutal-border brutal-shadow-purple uppercase" style={{ padding: '0.5rem 1.5rem', backgroundColor: '#fff', fontSize: '0.875rem' }}>Đọc</button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {currentView === 'post' && currentPost && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => setCurrentView('home')} className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', alignSelf: 'flex-start' }}><ChevronLeft size={18} /> Quy hồi</button>
            <div className="brutal-border brutal-shadow-yellow" style={{ padding: '2.5rem', backgroundColor: '#fff' }}>
              <h1 className="font-title uppercase" style={{ fontSize: '2.5rem', lineHeight: 1.2, marginBottom: '1rem' }}>{currentPost.title}</h1>
              <div className="uppercase" style={{ fontWeight: 'bold', color: '#4b5563', borderBottom: '4px solid #000', display: 'inline-block', paddingBottom: '1rem', marginBottom: '2rem' }}>Đăng ngày: {currentPost.date}</div>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, whiteSpace: 'pre-line', fontWeight: '500' }}>{currentPost.content}</div>
            </div>
          </div>
        )}

        {currentView === 'player' && currentTrack && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="brutal-border brutal-shadow-purple" style={{ padding: '2rem', backgroundColor: '#fff' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <button onClick={() => setCurrentView('home')} className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#39EFB2', gap: '0.5rem' }}>
                  <ChevronLeft size={18} /> Quy hồi
                </button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={toggleLike} disabled={isSavingLike} className="brutal-btn brutal-border brutal-shadow-yellow uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: isCurrentLiked ? '#ef4444' : '#fff', color: isCurrentLiked ? '#fff' : '#000', gap: '0.5rem' }}>
                    <Heart size={16} fill={isCurrentLiked ? '#fff' : 'none'} /> {isCurrentLiked ? 'Đã Lưu' : 'Lưu'}
                  </button>
                  <button onClick={handleShare} className="brutal-btn brutal-border uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', gap: '0.5rem' }}>
                    <Share2 size={16} /> Phức chế liên kết
                  </button>
                </div>
              </div>

              <h1 className="font-title uppercase" style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>{currentTrack.title}</h1>
             {currentTrack.artists && (
  <p style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>
    {currentTrack.artists}
  </p>
)}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#4b5563' }}>
                <p className="uppercase">Thể loại: {currentTrack.genre}</p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} /> Ngày đăng: {formatDateTime(currentTrack.created_at)}
                </p>
              </div>


              
              {currentTrack.audio_url ? (
                <div className="brutal-border" style={{ padding: '1.25rem', backgroundColor: '#f3f4f6', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={togglePlay} className="brutal-btn brutal-border" style={{ width: '3rem', height: '3rem', backgroundColor: '#3B2AA2', color: '#fff', flexShrink: 0 }}>
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        <span>Đang phát âm thanh trực tiếp</span>
                        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max={duration || 100} 
                        value={currentTime} 
                        onChange={handleSeek}
                        style={{ width: '100%', cursor: 'pointer', accentColor: '#3B2AA2' }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="brutal-border" style={{ padding: '0.75rem', backgroundColor: '#fef3c7', marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>
                  ⚠️ Bài hát này chưa có file Audio MP3 đính kèm.
                </div>
              )}

              {currentTrack.description?.trim() && (
                <details key={currentTrack.id} className="brutal-border" style={{ marginBottom: '1.5rem', backgroundColor: '#fff' }}>
                  <summary className="font-title uppercase" style={{ cursor: 'pointer', padding: '0.85rem 1rem', fontSize: '1.5rem' }}>
                    Ca từ
                  </summary>
                  <p style={{ padding: '1rem', borderTop: '2px solid #000', fontSize: '1rem', fontWeight: '500', color: '#1f2937', whiteSpace: 'pre-line', lineHeight: 1.8 }}>{currentTrack.description}</p>
                </details>
              )}

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '2px solid #000', paddingTop: '1.25rem' }}>
                {currentTrack.pdf_url && <a href={currentTrack.pdf_url} target="_blank" rel="noreferrer" className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '0.6rem 1.25rem', backgroundColor: '#3B2AA2', color: '#fff', textDecoration: 'none', gap: '0.5rem' }}><FileDown size={16} /> Tải PDF</a>}
                {currentTrack.midi_url && <a href={currentTrack.midi_url} target="_blank" rel="noreferrer" className="brutal-btn brutal-border brutal-shadow-yellow uppercase" style={{ padding: '0.6rem 1.25rem', backgroundColor: '#FACB54', color: '#000', textDecoration: 'none', gap: '0.5rem' }}><Disc size={16} /> Tải MIDI</a>}
                {currentTrack.audio_url && <a href={currentTrack.audio_url} target="_blank" rel="noreferrer" className="brutal-btn brutal-border uppercase" style={{ padding: '0.6rem 1.25rem', backgroundColor: '#fff', color: '#000', textDecoration: 'none', gap: '0.5rem' }}><FileAudio size={16} /> Tải MP3</a>}
              </div>

            </div>

            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 className="font-title uppercase" style={{ fontSize: '1.5rem' }}>Nhạc phổ</h2>
              {currentTrack.pdf_url ? (
                <div className="brutal-border brutal-shadow-purple" style={{ width: '100%', height: '700px', backgroundColor: '#fff' }}>
                  <iframe src={currentTrack.pdf_url} title={`Nhạc phổ: ${currentTrack.title}`} style={{ width: '100%', height: '100%', border: 'none' }} />
                </div>
              ) : (
                <div className="brutal-border brutal-shadow-purple" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f9fafb' }}>
                  <p className="font-title uppercase" style={{ color: '#9ca3af' }}>Chưa có file PDF xem trước cho bản nhạc này</p>
                </div>
              )}
            </section>

            <div className="brutal-border brutal-shadow-yellow" style={{ padding: '1.5rem', backgroundColor: '#fff' }}>
              <h2 className="font-title uppercase" style={{ marginBottom: '1rem' }}>Bình Luận ({comments.length})</h2>
              {isLoggedIn ? (
                <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <textarea value={newCommentText} onChange={e => setNewCommentText(e.target.value)} className="brutal-border" style={{ padding: '0.75rem', minHeight: '80px', backgroundColor: '#fff' }} placeholder="Nhập bình luận của bạn..."></textarea>
                  <button type="submit" className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#39EFB2', alignSelf: 'flex-end', gap: '0.5rem' }}><Send size={16} /> Đăng Bình Luận</button>
                </form>
              ) : <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Vui lòng đăng nhập để tham gia bình luận.</p>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {comments.map(cmt => (
                  <div key={cmt.id} className="brutal-border" style={{ padding: '1rem', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#3B2AA2' }}>
                        {cmt.user_name || 'Người dùng ẩn danh'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 'bold' }}>
                        {formatDateTime(cmt.created_at)}
                      </span>
                    </div>
                    <p style={{ fontWeight: '500', marginTop: '0.25rem' }}>{cmt.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => setCurrentView('home')} className="brutal-btn brutal-border brutal-shadow-mint uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', alignSelf: 'flex-start' }}><ChevronLeft size={18} /> Quy hồi</button>
            <div className="brutal-border brutal-shadow-purple" style={{ padding: '2.5rem', backgroundColor: '#39EFB2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 className="font-title uppercase" style={{ fontSize: '2rem' }}>{profile?.display_name}</h1>
                <p style={{ fontWeight: 'bold' }}>{user?.email}</p>
              </div>
              <button onClick={handleLogout} className="brutal-btn brutal-border uppercase" style={{ padding: '0.5rem 1rem', backgroundColor: '#fff' }}>Đăng Xuất</button>
            </div>

            <div className="brutal-border brutal-shadow-purple" style={{ padding: '1.5rem', backgroundColor: '#FACB54' }}>
              <h2 className="font-title uppercase" style={{ marginBottom: '1rem' }}>Nhạc khúc đã lưu ({savedSheetsList.length})</h2>
              {likesError && <p role="alert" style={{ color: '#991b1b', backgroundColor: '#fef2f2', padding: '0.75rem', marginBottom: '0.75rem', fontWeight: 'bold', overflowWrap: 'anywhere' }}>Lỗi đồng bộ bài hát đã lưu: {likesError}</p>}
              {savedSheetsList.map(sh => (
                <div key={sh.id} className="brutal-btn brutal-border" style={{ width: '100%', padding: '0.5rem', backgroundColor: '#fff', justifyContent: 'space-between', marginBottom: '0.5rem' }} onClick={() => handlePlaySheet(sh)}>
                  <span>{sh.title}</span> <Play size={16}/>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER ĐÃ KHÔI PHỤC ĐẦY ĐỦ AVATAR, Ô DONATE BÊN PHẢI VÀ CHỮ XUỐNG DÒNG ĐÚNG CHUẨN */}
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
    </div>
  );
}
