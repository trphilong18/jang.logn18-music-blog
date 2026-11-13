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
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentPost, setCurrentPost] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        setUser(session.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('home');
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
        <div className="font-title uppercase" style={{ fontSize: '1.5rem', cursor: 'pointer'
