'use client'
import { useRef, useState } from 'react'

const GRADE_THEME = {
  S: { primary: '#16a34a', bg: '#f0fdf4', cardBg: '#dcfce7', accent: '#15803d', emoji: '👑' },
  A: { primary: '#2563eb', bg: '#eff6ff', cardBg: '#dbeafe', accent: '#1d4ed8', emoji: '⭐' },
  B: { primary: '#d97706', bg: '#fffbeb', cardBg: '#fef3c7', accent: '#b45309', emoji: '📋' },
  C: { primary: '#ea580c', bg: '#fff7ed', cardBg: '#ffedd5', accent: '#c2410c', emoji: '⚠️' },
  D: { primary: '#dc2626', bg: '#fef2f2', cardBg: '#fee2e2', accent: '#b91c1c', emoji: '🚨' },
  '-': { primary: '#6b7280', bg: '#f9fafb', cardBg: '#f3f4f6', accent: '#4b5563', emoji: '—' },
}

const STAMP = { S: '재계약 권고', A: '우수 인재', B: '확인 필', C: '특타 권고', D: '방출 검토' }

const STAT_ICON = {
  ERA: '㉢', G: 'Ⓖ', W: 'Ⓦ', L: 'Ⓛ', IP: 'ⓟ', SO: 'Ⓚ', WHIP: 'Ⓗ',
  AVG: '㉢', HR: 'Ⓗ', RBI: 'Ⓡ', OBP: 'Ⓞ', SLG: 'Ⓢ', PA: 'Ⓟ',
}

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

  // AI 총평 첫 문장만
  const shortComment = data.ai_comment
    ? data.ai_comment.split(/[.。]/)[0].trim() + '.'
    : '총평 없음'

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
        background: '#ffffff',
        border: `3px solid ${th.primary}`,
        borderRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Noto Sans KR', sans-serif",
      }}>
        {/* 등급 헤더 */}
        <div style={{
          background: th.cardBg,
          borderBottom: `2px solid ${th.primary}`,
          padding: '14px 18px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: th.accent }}>종합 인사등급</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: th.accent, fontWeight: 700 }}>{Math.round(sg.score || 0)}점</span>
            <div style={{
              width: 52, height: 52,
              borderRadius: '50%',
              border: `3px solid ${th.primary}`,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ fontSize: 30, fontWeight: 900, color: th.primary, lineHeight: 1 }}>{grade}</span>
            </div>
          </div>
        </div>

        {/* 선수 정보 */}
        <div style={{
          background: th.bg,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          borderBottom: `1px solid ${th.cardBg}`,
          flexShrink: 0,
        }}>
          <div style={{
            width: 62, height: 62,
            borderRadius: '50%',
            border: `3px solid ${th.primary}`,
            overflow: 'hidden',
            flexShrink: 0,
            background: th.cardBg,
          }}>
            {data.photo_url && (
              <img src={data.photo_url} alt={data.name} crossOrigin="anonymous"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                onError={e => e.target.style.display='none'}
              />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: th.accent, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 2 }}>KBO 인사평가시스템</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#111', lineHeight: 1.1, marginBottom: 3 }}>{data.name}</div>
            <div style={{ fontSize: 11, color: '#666' }}>{data.team} · {data.position} · 연봉 {data.salary_display}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 9, color: '#999', marginBottom: 2 }}>경기당 인건비</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: th.primary }}>{data.daily_wage_display}</div>
            <div style={{ fontSize: 9, color: '#999', marginTop: 3 }}>{sg.grade_label?.split(' ')[0]}</div>
          </div>
        </div>

        {/* 스탯 */}
        <div style={{
          background: '#fff',
          padding: '12px 18px',
          borderBottom: `1px solid ${th.cardBg}`,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {Object.entries(data.season_stats || {}).slice(0, 6).map(([k, v]) => (
              <div key={k} style={{
                flex: '1 0 calc(16% - 6px)',
                minWidth: 52,
                background: th.cardBg,
                border: `1.5px solid ${th.primary}`,
                borderRadius: 10,
                padding: '7px 4px 5px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 9, color: th.accent, fontWeight: 700, marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#111' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI 총평 */}
        <div style={{
          flex: 1,
          background: th.bg,
          padding: '12px 18px',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: th.accent, letterSpacing: '0.12em', marginBottom: 6 }}>AI 인사팀 총평</div>
          <p style={{
            fontSize: 12,
            color: '#333',
            lineHeight: 1.65,
            margin: 0,
            fontWeight: 500,
          }}>{data.ai_comment || '총평 데이터 없음'}</p>
        </div>

        {/* 오늘 성적 + 푸터 */}
        <div style={{
          background: '#111',
          padding: '8px 18px',
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
              background: th.cardBg,
              color: th.accent,
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
