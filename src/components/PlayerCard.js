'use client'
import { useRef, useState } from 'react'

const GRADE_THEME = {
  S: { primary: '#16a34a', light: '#dcfce7', dark: '#14532d' },
  A: { primary: '#2563eb', light: '#dbeafe', dark: '#1e3a8a' },
  B: { primary: '#d97706', light: '#fef3c7', dark: '#78350f' },
  C: { primary: '#ea580c', light: '#ffedd5', dark: '#7c2d12' },
  D: { primary: '#dc2626', light: '#fee2e2', dark: '#7f1d1d' },
  '-': { primary: '#6b7280', light: '#f3f4f6', dark: '#1f2937' },
}
const STAMP = { S: '재계약 권고', A: '우수 인재', B: '확인 필', C: '특타 권고', D: '방출 검토' }

export default function PlayerCard({ data }) {
  const cardRef = useRef(null)
  const [saving, setSaving] = useState(false)
  const sg = data.season_grade || {}
  const tg = data.today_grade || {}
  const grade = sg.grade || '-'
  const th = GRADE_THEME[grade] || GRADE_THEME['-']

  const todayText = data.today_stats?.played
    ? Object.entries(data.today_stats).filter(([k])=>!['played','note','일자','상대'].includes(k)).slice(0,4).map(([k,v])=>`${k} ${v}`).join('  ')
    : data.today_stats?.note || '경기 없음'

  async function saveImage() {
    if (!cardRef.current) return
    setSaving(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: '#ffffff', useCORS: true, allowTaint: true })
      const a = document.createElement('a')
      a.download = `kbo_${data.name}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    } catch(e) { console.error(e) }
    finally { setSaving(false) }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <div ref={cardRef} style={{
        width: '100%',
        aspectRatio: '1/1',
        background: '#fffdf7',
        border: `4px solid #111`,
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Noto Sans KR', sans-serif",
        boxSizing: 'border-box',
      }}>

        {/* 등급 헤더 — 만화 스타일 */}
        <div style={{
          background: th.primary,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '4px solid #111',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.15em' }}>KBO 인사평가시스템</div>
            <div style={{ fontSize: 13, color: '#fff', fontWeight: 900 }}>{sg.grade_label}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>가성비 점수</div>
              <div style={{ fontSize: 16, color: '#fff', fontWeight: 900 }}>{Math.round(sg.score || 0)}점</div>
            </div>
            <div style={{
              width: 56, height: 56,
              borderRadius: '50%',
              border: '4px solid #fff',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '3px 3px 0px #111',
            }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: th.primary, lineHeight: 1 }}>{grade}</span>
            </div>
          </div>
        </div>

        {/* 선수 정보 */}
        <div style={{
          background: th.light,
          borderBottom: '3px solid #111',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        }}>
          <div style={{
            width: 64, height: 64,
            borderRadius: '50%',
            border: '4px solid #111',
            overflow: 'hidden',
            flexShrink: 0,
            background: '#fff',
            boxShadow: '3px 3px 0 #111',
          }}>
            {data.photo_url && (
              <img src={data.photo_url} alt={data.name} crossOrigin="anonymous"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                onError={e => e.target.style.display='none'}
              />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#111', lineHeight: 1.1, marginBottom: 3 }}>{data.name}</div>
            <div style={{ fontSize: 11, color: '#555', fontWeight: 700 }}>{data.team} · {data.position} · 연봉 {data.salary_display}</div>
          </div>
          <div style={{
            background: '#111',
            color: '#fff',
            borderRadius: 8,
            padding: '6px 10px',
            textAlign: 'center',
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 9, color: '#aaa', marginBottom: 1 }}>경기당 인건비</div>
            <div style={{ fontSize: 13, fontWeight: 900 }}>{data.daily_wage_display}</div>
          </div>
        </div>

        {/* 스탯 — 만화 뱃지 스타일 */}
        <div style={{
          background: '#fff',
          borderBottom: '3px solid #111',
          padding: '10px 16px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {Object.entries(data.season_stats || {}).slice(0, 6).map(([k, v]) => (
              <div key={k} style={{
                flex: 1,
                background: '#fffdf7',
                border: '3px solid #111',
                borderRadius: 10,
                padding: '6px 4px',
                textAlign: 'center',
                boxShadow: '2px 2px 0 #111',
              }}>
                <div style={{ fontSize: 9, color: th.primary, fontWeight: 900, marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#111' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI 총평 — 말풍선 스타일 */}
        <div style={{
          flex: 1,
          background: '#fff',
          padding: '12px 16px',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            background: th.light,
            border: '3px solid #111',
            borderRadius: 12,
            padding: '10px 14px',
            flex: 1,
            position: 'relative',
          }}>
            <div style={{
              display: 'inline-block',
              background: th.primary,
              color: '#fff',
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: '0.1em',
              padding: '2px 8px',
              borderRadius: 4,
              marginBottom: 7,
              border: '2px solid #111',
            }}>AI 인사팀 총평</div>
            <p style={{
              fontSize: 11.5,
              color: '#222',
              lineHeight: 1.7,
              margin: 0,
              fontWeight: 600,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
            }}>{data.ai_comment || '총평 데이터 없음'}</p>
          </div>
        </div>

        {/* 오늘 성적 + 푸터 */}
        <div style={{
          background: '#111',
          borderTop: '3px solid #111',
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 8, color: '#888', letterSpacing: '0.1em', marginBottom: 2 }}>TODAY</div>
            <div style={{ fontSize: 11, color: '#ddd', fontWeight: 700 }}>{todayText}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: '#555' }}>kbokpi-front.vercel.app</span>
            <span style={{
              fontSize: 10, fontWeight: 900,
              padding: '3px 10px',
              borderRadius: 6,
              background: th.light,
              color: th.dark,
              border: `2px solid ${th.primary}`,
            }}>{STAMP[grade] || '확인필'}</span>
          </div>
        </div>
      </div>

      <button onClick={saveImage} disabled={saving} style={{
        width: '100%', marginTop: 10, padding: '13px',
        background: '#111', border: 'none', borderRadius: 12,
        color: '#fff', fontSize: 14, fontWeight: 700,
        cursor: saving ? 'not-allowed' : 'pointer',
        opacity: saving ? 0.5 : 1,
      }}>
        {saving ? '저장 중...' : '이미지 저장 (공유용)'}
      </button>
      {data.cached && <p style={{ textAlign:'center', fontSize:11, color:'#999', marginTop:8 }}>캐시된 데이터 · {data.crawled_at}</p>}
    </div>
  )
}
