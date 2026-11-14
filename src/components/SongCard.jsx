import { Calendar, Play } from 'lucide-react';

// Thẻ nhạc chỉ hiển thị dữ liệu; App quản lý hành động chọn bài.
export default function SongCard({ sheet, formatDate, onPlay }) {
  return (
                  <div className="brutal-border brutal-shadow-mint" style={{ padding: '1rem', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 className="font-title uppercase truncate" style={{ fontSize: '1.125rem' }}>{sheet.title}</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 'bold', color: '#4b5563' }}>
                      <span className="uppercase">{sheet.genre}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} /> {formatDate(sheet.created_at)}
                      </span>
                    </div>

                    {sheet.artists && <p className="line-clamp-2" style={{ fontSize: '0.8rem', color: '#6b7280' }}>{sheet.artists}</p>}
                    
                    <button onClick={() => onPlay(sheet)} className="brutal-btn brutal-border uppercase" style={{ marginTop: 'auto', padding: '0.75rem', backgroundColor: '#fff', width: '100%' }}>
                      <Play size={16} /> Khán thính
                    </button>
                  </div>
  );
}
