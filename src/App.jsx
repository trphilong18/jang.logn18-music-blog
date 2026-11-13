import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Heart, Share2, 
  User, FileText, ChevronLeft, Volume2,
  FileDown, FileAudio, Disc, MessageSquare, Send, Sparkles, Search, Upload, PlusCircle
} from 'lucide-react';

import { supabase } from './supabaseClient';

const MOCK_TOPICS = ['Piano Solo', 'Classical', 'Anime', 'Nhạc Việt', 'Jazz', 'Soundtrack'];

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

  // States tìm kiếm & lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Trạng thái bình luận
  const [newCommentText, setNewCommentText] = useState('');

  // Form Admin (Thêm Sheet)
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('Classical');
  const [newDescription, setNewDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [midiFile, setMidiFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  // Form Admin (Đăng bài viết)
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const isAdmin = profile?.role === 'admin' || user?.email === 'trphilong18@gmail.com';

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setUser(session.user);
        await fetchProfile(session.user.id);
        fetchUserLikes(session.user.id);
      }
    });

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

    fetchSheets();
    fetchPosts();

    return () => subscription.unsubscribe();
  }, []);

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

  const fetchSheets = async () => {
    const { data, error } = await supabase.from('sheets').select('*').order('created_at', { ascending: false });
    if (!error && data) setSheets(data);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (!error && data) setPosts(data);
  };

  const fetchUserLikes = async (userId) => {
    const { data, error } = await supabase.from('likes').select('sheet_id').eq('user_id', userId);
    if (!error && data) {
      setLikedSheetIds(data.map(item => item.sheet_id));
    }
  };

  // Lấy bình luận an toàn không dùng join bảng
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

  const filteredSheets = sheets.filter(sheet => {
    const matchesSearch = sheet.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || sheet.genre === selectedGenre;
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
    if (!isLoggedIn) return alert('Vui lòng đăng nhập!');
    const sheetId = currentTrack.id;
    const isLiked = likedSheetIds.includes(sheetId);

    if (isLiked) {
      await supabase.from('likes').delete().eq('user_id', user.id).eq('sheet_id', sheetId);
      setLikedSheetIds(likedSheetIds.filter(id => id !== sheetId));
    } else {
      await supabase.from('likes').insert([{ user_id: user.id, sheet_id: sheetId }]);
      setLikedSheetIds([...likedSheetIds, sheetId]);
    }
  };

  // Gửi bình luận lưu trực tiếp tên người dùng
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
      alert('Lỗi gửi bình luận: ' + error.message);
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
      title: newTitle,
      genre: newGenre,
      description: newDescription,
      pdf_url, midi_url, audio_url,
      uploader_id: user.id
    };

    const { data, error } = await supabase.from('sheets').insert([newItem]).select();
    if (!error && data) {
      setSheets([data[0], ...sheets]);
      setNewTitle('');
      setNewDescription('');
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
        .
