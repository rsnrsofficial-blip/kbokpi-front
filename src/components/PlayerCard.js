'use client'
import { useRef, useState } from 'react'

const GRADE_THEME = {
  S: { primary: '#16a34a', light: '#dcfce7', dark: '#14532d', emoji: '👑' },
  A: { primary: '#2563eb', light: '#dbeafe', dark: '#1e3a8a', emoji: '⭐' },
  B: { primary: '#d97706', light: '#fef3c7', dark: '#78350f', emoji: '📋' },
  C: { primary: '#ea580c', light: '#ffedd5', dark: '#7c2d12', emoji: '⚠️' },
  D: { primary: '#dc2626', light: '#fee2e2', dark: '#7f1d1d', emoji: '🚨' },
  '-': { primary: '#6b7280', light: '#f3f4f6', dark: '#1f2937', emoji: '—' },
}
const STAMP = { S: '재계약 권고', A: '우수 인재', B: '확인 필', C: '특타 권고', D: '방출 검토' }

function StatBox({ label, value, desc, borderColor, bgColor, darkColor }) {
  return (
    <div style={{
      background: bgColor,
      border: `3px solid #111`,
      borderRadius: 12,
      padding: '10px 10px 8px',
      boxShadow: '2px 2px 0 #111',
    }}>
      <div style={{ fontSize: 10, color: darkColor, fontWeight: 900, marginBottom: 4, letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: '#111', lineHeight: 1, marginBottom: 4 }}>{value}</div>
      {desc && <div style={{ fontSize: 10, color: '#555', lineHeight: 1.4 }}>{desc}</div>}
    </div>
  )
}

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
  const lastStats = data.last_season_stats || {}
  const stats = data.season_stats || {}

  const photoUrl = data.player_id
    ? `https://kbo-hr-api.onrender.com/photo/${data.player_id}`
    : data.photo_url

  const todayPlayed = data.today_stats?.played
  const todayText = todayPlayed
    ? Object.entries(data.today_stats)
        .filter(([k]) => !['played', 'note', '일자', '상대'].includes(k))
        .slice(0, 6).map(([k, v]) => `${labels[k] || k} ${v}`).join('  ')
    : schedule.scheduled
      ? schedule.note
      : data.today_stats?.note || '경기 없음'

  async function saveImage() {
    if (!cardRef.current) return
    setSaving(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, backgroundColor: '#fffdf7', useCORS: true, allowTaint: true
      })
      const a = document.createElement('a')
      a.download = `kbo_${data.name}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const border = '3px solid #111'
  const shadow = '3px 3px 0 #111'

  return (
    <div style={{ marginTop: 20 }}>
      <div ref={cardRef} style={{
        width: '100%',
        background: '#fffdf7',
        border: '4px solid #111',
        borderRadius: 20,
        overflow: 'hidden',
        fontFamily: "'Noto Sans KR', sans-serif",
      }}>

        {/* ① 등급 헤더 */}
        <div style={{
          background: th.primary,
          borderBottom: '4px solid #111',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.15em', marginBottom: 3 }}>
              KBO 인사평가시스템
            </div>
            <div style={{ fontSize: 15, color: '#fff', fontWeight: 900 }}>{sg.grade_label}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>가성비 점수</div>
              <div style={{ fontSize: 20, color: '#fff', fontWeight: 900 }}>{Math.round(sg.score || 0)}점</div>
            </div>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              border: '4px solid #fff', background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: shadow,
            }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: th.primary, lineHeight: 1 }}>{grade}</span>
            </div>
          </div>
        </div>

        {/* ② 선수 정보 */}
        <div style={{
          background: th.light,
          borderBottom: border,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            border: '4px solid #111', overflow: 'hidden', flexShrink: 0,
            background: '#fff', boxShadow: shadow,
          }}>
            {photoUrl && (
              <img src={photoUrl} alt={data.name} crossOrigin="anonymous"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                onError={e => e.target.style.display = 'none'}
              />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#111', lineHeight: 1.1, marginBottom: 4 }}>{data.name}</div>
            <div style={{ fontSize: 12, color: '#555', fontWeight: 700, marginBottom: 4 }}>
              {data.team} · {data.position} · 연봉 {data.salary_display}
            </div>
            <div style={{
              display: 'inline-block',
              background: '#111', color: '#fff',
              fontSize: 11, fontWeight: 900,
              padding: '3px 10px', borderRadius: 6,
            }}>
              경기당 인건비 {data.daily_wage_display}
            </div>
          </div>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            border: `3px solid #111`,
            background: th.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 28,
          }}>
            {th.emoji}
          </div>
        </div>

        {/* ③ 시즌 스탯 */}
        <div style={{ background: '#fff', borderBottom: border, padding: '14px 20px' }}>
          <div style={{
            fontSize: 11, fontWeight: 900, color: '#111',
            marginBottom: 10, letterSpacing: '0.1em',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{
              background: th.primary, color: '#fff',
              padding: '2px 8px', borderRadius: 4,
              border: '2px solid #111', fontSize: 10,
            }}>2026 시즌 성적</span>
            <span style={{ fontSize: 10, color: '#999' }}>({stats.G || 0}경기)</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {Object.entries(stats).filter(([k]) => k !== 'G').slice(0, 6).map(([k, v]) => (
              <StatBox
                key={k}
                label={labels[k] || k}
                value={v}
                desc={descs[k]}
                borderColor={th.primary}
                bgColor={th.light}
                darkColor={th.dark}
              />
            ))}
          </div>
        </div>

        {/* ④ 작년 대비 */}
        {interp.vs_last && (
          <div style={{ background: th.light, borderBottom: border, padding: '12px 20px' }}>
            <div style={{
              fontSize: 10, fontWeight: 900, color: th.dark,
              letterSpacing: '0.1em', marginBottom: 6,
            }}>📊 작년 대비 분석</div>
            <div style={{
              background: '#fff', border: border,
              borderRadius: 10, padding: '10px 14px',
              fontSize: 12, color: '#333', fontWeight: 600, lineHeight: 1.6,
              boxShadow: '2px 2px 0 #111',
            }}>
              {interp.vs_last}
            </div>
          </div>
        )}

        {/* ⑤ AI 총평 */}
        <div style={{ background: '#fff', borderBottom: border, padding: '14px 20px' }}>
          <div style={{
            background: th.light,
            border: border,
            borderRadius: 14,
            padding: '12px 16px',
            boxShadow: '3px 3px 0 #111',
          }}>
            <div style={{
              display: 'inline-block',
              background: th.primary, color: '#fff',
              fontSize: 10, fontWeight: 900,
              padding: '3px 10px', borderRadius: 5,
              marginBottom: 8, border: '2px solid #111',
              letterSpacing: '0.08em',
            }}>AI 인사팀 총평</div>
            <p style={{
              fontSize: 12, color: '#222',
              lineHeight: 1.8, margin: 0, fontWeight: 600,
            }}>
              {data.ai_comment || '총평 데이터 없음'}
            </p>
          </div>
        </div>

        {/* ⑥ 오늘 성적 / 예정 경기 */}
        <div style={{ background: th.light, borderBottom: border, padding: '12px 20px' }}>
          <div style={{
            fontSize: 10, fontWeight: 900, color: th.dark,
            letterSpacing: '0.1em', marginBottom: 6,
          }}>
            {todayPlayed ? '⚾ 오늘 성적' : schedule.scheduled ? '📅 오늘 예정 경기' : '⚾ 오늘'}
          </div>
          <div style={{
            background: '#111',
            borderRadius: 10, padding: '10px 14px',
            border: border,
          }}>
            <div style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>{todayText}</div>
            {todayPlayed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <span style={{
                  fontSize: 11, fontWeight: 900,
                  padding: '2px 10px', borderRadius: 5,
                  background: GRADE_THEME[tg.grade]?.light || '#f3f4f6',
                  color: GRADE_THEME[tg.grade]?.dark || '#333',
                  border: '2px solid #111',
                }}>오늘 {tg.grade}등급</span>
                <span style={{ fontSize: 11, color: '#aaa' }}>{tg.grade_label}</span>
              </div>
            )}
          </div>
        </div>

        {/* ⑦ 푸터 */}
        <div style={{
          background: '#111',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 10, color: '#555' }}>kbokpi-front.vercel.app</span>
          <span style={{
            fontSize: 11, fontWeight: 900,
            padding: '4px 12px', borderRadius: 6,
            background: th.light, color: th.dark,
            border: `2px solid ${th.primary}`,
          }}>{STAMP[grade] || '확인필'}</span>
        </div>
      </div>

      <button onClick={saveImage} disabled={saving} style={{
        width: '100%', marginTop: 10, padding: '14px',
        background: '#111', border: 'none', borderRadius: 12,
        color: '#fff', fontSize: 14, fontWeight: 700,
        cursor: saving ? 'not-allowed' : 'pointer',
        opacity: saving ? 0.5 : 1,
      }}>
        {saving ? '저장 중...' : '이미지 저장 (공유용)'}
      </button>
      {data.cached && (
        <p style={{ textAlign: 'center', fontSize: 11, color: '#999', marginTop: 8 }}>
          캐시된 데이터 · {data.crawled_at}
        </p>
      )}
    </div>
  )
}
