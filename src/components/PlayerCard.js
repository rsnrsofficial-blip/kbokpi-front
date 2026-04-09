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
  const interp = data.stat_interpretation || {}
  const labels = interp.labels || {}
  const descs = interp.descs || {}
  const schedule = data.today_schedule || {}

  const todayText = data.today_stats?.played
    ? Object.entries(data.today_stats).filter(([k])=>!['played','note','일자','상대'].includes(k)).slice(0,5).map(([k,v])=>`${k} ${v}`).join('  ')
    : schedule.scheduled
      ? schedule.note
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

  const photoUrl = data.player_id
    ? `https://kbo-hr-api.onrender.com/photo/${data.player_id}`
    : data.photo_url

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
      }}>

        {/* 등급 헤더 */}
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
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.15em' }}>KBO 인사평가시스템</div>
            <div style={{ fontSize: 13, color: '#fff', fontWeight: 900 }}>{sg.grade_label}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>가성비 점수</div>
              <div style={{ fontSize: 16, color: '#fff', fontWeight: 900 }}>{Math.round(sg.score || 0)}점</div>
            </div>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              border: '4px solid #fff', background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '3px 3px 0px #111',
            }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: th.primary, lineHeight: 1 }}>{grade}</span>
            </div>
          </div>
        </div>

        {/* 선수 정보 */}
        <div style={{
          background: th.light,
          borderBottom: '3px solid #111',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        }}>
          <div style={{
            width: 58, height: 58, borderRadius: '50%',
            border: '4px solid #111', overflow: 'hidden', flexShrink: 0,
            background: '#fff', boxShadow: '3px 3px 0 #111',
          }}>
            {photoUrl && (
              <img src={photoUrl} alt={data.name} crossOrigin="anonymous"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                onError={e => e.target.style.display='none'}
              />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#111', lineHeight: 1.1, marginBottom: 3 }}>{data.name}</div>
            <div style={{ fontSize: 11, color: '#555', fontWeight: 700 }}>{data.team} · {data.position} · 연봉 {data.salary_display}</div>
            {interp.vs_last && (
              <div style={{ fontSize: 10, color: th.dark, marginTop: 3, fontWeight: 600 }}>
                📊 {interp.vs_last}
              </div>
            )}
          </div>
          <div style={{
            background: '#111', color: '#fff',
            borderRadius: 8, padding: '6px 10px',
            textAlign: 'center', flexShrink: 0,
          }}>
            <div style={{ fontSize: 9, color: '#aaa', marginBottom: 1 }}>경기당 인건비</div>
            <div style={{ fontSize: 13, fontWeight: 900 }}>{data.daily_wage_display}</div>
          </div>
        </div>

        {/* 스탯 — 한글 레이블 + 해석 */}
        <div style={{
          background: '#fff',
          borderBottom: '3px solid #111',
          padding: '8px 16px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {Object.entries(data.season_stats || {}).slice(0, 6).map(([k, v]) => (
              <div key={k} style={{
                flex: '1 0 calc(16% - 5px)', minWidth: 50,
                background: th.light,
                border: `2px solid #111`,
                borderRadius: 10, padding: '5px 4px 4px',
                textAlign: 'center',
                boxShadow: '2px 2px 0 #111',
              }}>
                <div style={{ fontSize: 8, color: th.dark, fontWeight: 900, marginBottom: 1 }}>
                  {labels[k] || k}
                </div>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#111' }}>{v}</div>
                {descs[k] && (
                  <div style={{ fontSize: 8, color: '#666', marginTop: 1, lineHeight: 1.2 }}>
                    {descs[k]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI 총평 */}
        <div style={{
          flex: 1,
          background: '#fff',
          padding: '10px 16px',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            background: th.light,
            border: '3px solid #111',
            borderRadius: 12,
            padding: '9px 13px',
            flex: 1,
          }}>
            <div style={{
              display: 'inline-block',
              background: th.primary, color: '#fff',
              fontSize: 9, fontWeight: 900,
              letterSpacing: '0.1em',
              padding: '2px 8px', borderRadius: 4,
              marginBottom: 6, border: '2px solid #111',
            }}>AI 인사팀 총평</div>
            <p style={{
              fontSize: 11, color: '#222',
              lineHeight: 1.65, margin: 0, fontWeight: 600,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
            }}>{data.ai_comment || '총평 데이터 없음'}</p>
          </div>
        </div>

        {/* TODAY / 예정 경기 */}
        <div style={{
          background: '#111',
          borderTop: '3px solid #111',
          padding: '7px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 8, color: '#888', letterSpacing: '0.1em', marginBottom: 2 }}>
              {data.today_stats?.played ? 'TODAY' : schedule.scheduled ? '오늘 예정' : 'TODAY'}
            </div>
            <div style={{ fontSize: 11, color: '#ddd', fontWeight: 700 }}>{todayText}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: '#555' }}>kbokpi-front.vercel.app</span>
            <span style={{
              fontSize: 10, fontWeight: 900,
              padding: '3px 10px', borderRadius: 6,
              background: th.light, color: th.dark,
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
      {data.cached && (
        <p style={{ textAlign:'center', fontSize:11, color:'#999', marginTop:8 }}>
          캐시된 데이터 · {data.crawled_at}
        </p>
      )}
    </div>
  )
}
