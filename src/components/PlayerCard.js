'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

const GRADE_STYLE = {
  S: { bg: 'bg-emerald-900', text: 'text-emerald-300', border: 'border-emerald-600', stamp: 'bg-emerald-900 text-emerald-300' },
  A: { bg: 'bg-blue-900', text: 'text-blue-300', border: 'border-blue-600', stamp: 'bg-blue-900 text-blue-300' },
  B: { bg: 'bg-yellow-900', text: 'text-yellow-300', border: 'border-yellow-600', stamp: 'bg-yellow-900 text-yellow-300' },
  C: { bg: 'bg-orange-900', text: 'text-orange-300', border: 'border-orange-600', stamp: 'bg-orange-900 text-orange-300' },
  D: { bg: 'bg-red-900', text: 'text-red-300', border: 'border-red-600', stamp: 'bg-red-900 text-red-300' },
}

const STAMP_TEXT = { S: '재계약 권고', A: '우수 인재', B: '확인 필', C: '특타 권고', D: '방출 검토' }

export default function PlayerCard({ data }) {
  const cardRef = useRef(null)
  const [saving, setSaving] = useState(false)

  const sg = data.season_grade || {}
  const tg = data.today_grade || {}
  const grade = sg.grade || '-'
  const gs = GRADE_STYLE[grade] || GRADE_STYLE['B']

  const todayText = data.today_stats?.played
    ? Object.entries(data.today_stats)
        .filter(([k]) => !['played', 'note', '일자', '상대'].includes(k))
        .slice(0, 4).map(([k, v]) => `${k} ${v}`).join('  ')
    : data.today_stats?.note || '경기 없음'

  async function saveImage() {
    if (!cardRef.current) return
    setSaving(true)
    try {
      const el = cardRef.current
      const size = el.offsetWidth
      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: '#09090b',
        width: size,
        height: size,
        useCORS: true,
        allowTaint: true,
      })
      const a = document.createElement('a')
      a.download = `kbo_${data.name}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* 공유용 카드 — 1:1 정사각형 */}
      <div
        ref={cardRef}
        className="w-full aspect-square bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col"
        style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
      >
        {/* 헤더 */}
        <div className="bg-zinc-900 border-b border-zinc-800 px-5 py-4 flex items-center gap-4 flex-shrink-0">
          {/* 선수 사진 */}
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700 flex-shrink-0 bg-zinc-800">
            {data.photo_url ? (
              <img
                src={data.photo_url}
                alt={data.name}
                className="w-full h-full object-cover object-top"
                onError={e => { e.target.style.display = 'none' }}
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xl font-black">
                {data.name?.[0]}
              </div>
            )}
          </div>

          {/* 이름 + 정보 */}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-zinc-600 tracking-widest mb-1">KBO 인사평가시스템</div>
            <div className="text-2xl font-black text-white leading-none mb-1">{data.name}</div>
            <div className="text-xs text-zinc-500">{data.team} · {data.position} · 연봉 {data.salary_display}</div>
          </div>

          {/* 등급 뱃지 */}
          <div className={`w-14 h-14 rounded-full border-2 ${gs.border} ${gs.bg} flex flex-col items-center justify-center flex-shrink-0`}>
            <span className={`text-3xl font-black leading-none ${gs.text}`}>{grade}</span>
            <span className={`text-xs ${gs.text} opacity-80`}>{Math.round(sg.score || 0)}점</span>
          </div>
        </div>

        {/* 본문 */}
        <div className="flex-1 flex flex-col px-5 py-4 min-h-0">
          {/* 등급 설명 */}
          <div className="text-sm font-bold text-white mb-1">{sg.grade_label}</div>
          <div className="text-xs text-zinc-500 mb-4">경기당 인건비 {data.daily_wage_display}</div>

          {/* 스탯 그리드 */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {Object.entries(data.season_stats || {}).slice(0, 6).map(([k, v]) => (
              <div key={k} className="bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-2 text-center">
                <div className="text-xs text-zinc-600 font-bold tracking-wider mb-1">{k}</div>
                <div className="text-base font-black text-white">{v}</div>
              </div>
            ))}
          </div>

          {/* AI 총평 */}
          <div className="flex-1 bg-amber-950 border border-amber-800 rounded-xl px-4 py-3 min-h-0 overflow-hidden">
            <div className="text-xs font-bold text-amber-500 tracking-widest mb-2">AI 인사팀 총평</div>
            <p className="text-xs text-amber-100 leading-relaxed line-clamp-4">
              {data.ai_comment || '총평을 불러오는 중...'}
            </p>
          </div>
        </div>

        {/* 오늘 성적 */}
        <div className="border-t border-dashed border-zinc-800 px-5 py-2 flex justify-between items-center flex-shrink-0">
          <span className="text-xs text-zinc-600 font-bold tracking-widest">TODAY</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-300 font-bold">{todayText}</span>
            <span className={`text-xs font-black px-2 py-0.5 rounded ${(GRADE_STYLE[tg.grade] || GRADE_STYLE['B']).stamp}`}>
              {tg.grade || '-'}
            </span>
          </div>
        </div>

        {/* 푸터 */}
        <div className="bg-zinc-900 border-t border-zinc-800 px-5 py-2 flex justify-between items-center flex-shrink-0">
          <span className="text-xs text-zinc-600 tracking-wider">kboin.sa.xyz</span>
          <span className={`text-xs font-black px-3 py-1 rounded ${gs.stamp}`}>
            {STAMP_TEXT[grade] || '확인 필'}
          </span>
        </div>
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={saveImage}
        disabled={saving}
        className="w-full mt-3 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
      >
        {saving ? '저장 중...' : '이미지 저장 (공유용)'}
      </button>

      {data.cached && (
        <p className="text-center text-xs text-zinc-700 mt-2">캐시된 데이터 · {data.crawled_at}</p>
      )}
    </div>
  )
}
