// Chi tiết bài hát được đóng mặc định, mở khi người dùng nhấn tiêu đề.
// Component nhận key theo track.id từ App để đóng lại khi chuyển bài.
export default function LyricsSection({ track }) {
  if (!track?.description?.trim()) return null;

  return (
                <details className="brutal-border" style={{ marginBottom: '1.5rem', backgroundColor: '#fff' }}>
                  <summary className="font-title uppercase" style={{ cursor: 'pointer', padding: '0.85rem 1rem', fontSize: '1.5rem' }}>
                    Ca từ
                  </summary>
                  <p style={{ padding: '1rem', borderTop: '2px solid #000', fontSize: '1rem', fontWeight: '500', color: '#1f2937', whiteSpace: 'pre-line', lineHeight: 1.8 }}>{track.description}</p>
                </details>
  );
}
