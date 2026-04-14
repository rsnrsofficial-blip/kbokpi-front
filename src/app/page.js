'use client'
import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import PlayerCard from '@/components/PlayerCard'

const TEAMS = ['전체', 'KIA', '삼성', 'LG', '두산', 'KT', 'SSG', '롯데', '한화', 'NC', '키움']

const POSITIONS = ['전체', '투수', '내야수', '외야수', '포수']

const PLAYERS = [
  // KIA
  { name: '네일', team: 'KIA', pos: '투수' },
  { name: '올러', team: 'KIA', pos: '투수' },
  { name: '이의리', team: 'KIA', pos: '투수' },
  { name: '황동하', team: 'KIA', pos: '투수' },
  { name: '최지민', team: 'KIA', pos: '투수' },
  { name: '김기훈', team: 'KIA', pos: '투수' },
  { name: '전상현', team: 'KIA', pos: '투수' },
  { name: '정해영', team: 'KIA', pos: '투수' },
  { name: '성영탁', team: 'KIA', pos: '투수' },
  { name: '홍민규', team: 'KIA', pos: '투수' },
  { name: '김범수', team: 'KIA', pos: '투수' },
  { name: '김시훈', team: 'KIA', pos: '투수' },
  { name: '김도영', team: 'KIA', pos: '내야수' },
  { name: '김선빈', team: 'KIA', pos: '내야수' },
  { name: '박민', team: 'KIA', pos: '내야수' },
  { name: '윤도현', team: 'KIA', pos: '내야수' },
  { name: '데일', team: 'KIA', pos: '내야수' },
  { name: '오선우', team: 'KIA', pos: '내야수' },
  { name: '정현창', team: 'KIA', pos: '내야수' },
  { name: '김규성', team: 'KIA', pos: '내야수' },
  { name: '나성범', team: 'KIA', pos: '외야수' },
  { name: '카스트로', team: 'KIA', pos: '외야수' },
  { name: '김호령', team: 'KIA', pos: '외야수' },
  { name: '이창진', team: 'KIA', pos: '외야수' },
  { name: '박재현', team: 'KIA', pos: '외야수' },
  { name: '박정우', team: 'KIA', pos: '외야수' },
  { name: '한준수', team: 'KIA', pos: '포수' },
  { name: '김태군', team: 'KIA', pos: '포수' },
  // 삼성
  { name: '원태인', team: '삼성', pos: '투수' },
  { name: '후라도', team: '삼성', pos: '투수' },
  { name: '오러클린', team: '삼성', pos: '투수' },
  { name: '최지광', team: '삼성', pos: '투수' },
  { name: '미야지', team: '삼성', pos: '투수' },
  { name: '양창섭', team: '삼성', pos: '투수' },
  { name: '이재익', team: '삼성', pos: '투수' },
  { name: '백정현', team: '삼성', pos: '투수' },
  { name: '류지혁', team: '삼성', pos: '내야수' },
  { name: '디아즈', team: '삼성', pos: '내야수' },
  { name: '김영웅', team: '삼성', pos: '내야수' },
  { name: '전병우', team: '삼성', pos: '내야수' },
  { name: '양우현', team: '삼성', pos: '내야수' },
  { name: '구자욱', team: '삼성', pos: '외야수' },
  { name: '윤정빈', team: '삼성', pos: '외야수' },
  { name: '김지찬', team: '삼성', pos: '외야수' },
  { name: '김헌곤', team: '삼성', pos: '외야수' },
  { name: '최형우', team: '삼성', pos: '외야수' },
  { name: '함수호', team: '삼성', pos: '외야수' },
  { name: '이성규', team: '삼성', pos: '외야수' },
  { name: '강민호', team: '삼성', pos: '포수' },
  { name: '박세혁', team: '삼성', pos: '포수' },
  { name: '장승현', team: '삼성', pos: '포수' },
  // LG
  { name: '치리노스', team: 'LG', pos: '투수' },
  { name: '톨허스트', team: 'LG', pos: '투수' },
  { name: '임찬규', team: 'LG', pos: '투수' },
  { name: '함덕주', team: 'LG', pos: '투수' },
  { name: '유영찬', team: 'LG', pos: '투수' },
  { name: '장현식', team: 'LG', pos: '투수' },
  { name: '백승현', team: 'LG', pos: '투수' },
  { name: '이정용', team: 'LG', pos: '투수' },
  { name: '우강훈', team: 'LG', pos: '투수' },
  { name: '이유찬', team: 'LG', pos: '투수' },
  { name: '김진성', team: 'LG', pos: '투수' },
  { name: '박시원', team: 'LG', pos: '투수' },
  { name: '오지환', team: 'LG', pos: '내야수' },
  { name: '문보경', team: 'LG', pos: '내야수' },
  { name: '신민재', team: 'LG', pos: '내야수' },
  { name: '오스틴', team: 'LG', pos: '내야수' },
  { name: '구본혁', team: 'LG', pos: '내야수' },
  { name: '천성호', team: 'LG', pos: '내야수' },
  { name: '이영빈', team: 'LG', pos: '내야수' },
  { name: '홍창기', team: 'LG', pos: '외야수' },
  { name: '박해민', team: 'LG', pos: '외야수' },
  { name: '문성주', team: 'LG', pos: '외야수' },
  { name: '최원영', team: 'LG', pos: '외야수' },
  { name: '이재원', team: 'LG', pos: '외야수' },
  { name: '송찬의', team: 'LG', pos: '외야수' },
  { name: '박동원', team: 'LG', pos: '포수' },
  { name: '이주헌', team: 'LG', pos: '포수' },
  // 두산
  { name: '플렉센', team: '두산', pos: '투수' },
  { name: '타무라', team: '두산', pos: '투수' },
  { name: '황희천', team: '두산', pos: '투수' },
  { name: '이영하', team: '두산', pos: '투수' },
  { name: '최승용', team: '두산', pos: '투수' },
  { name: '최민석', team: '두산', pos: '투수' },
  { name: '김택연', team: '두산', pos: '투수' },
  { name: '양재훈', team: '두산', pos: '투수' },
  { name: '정철원', team: '두산', pos: '투수' },
  { name: '노시형', team: '두산', pos: '투수' },
  { name: '강승호', team: '두산', pos: '내야수' },
  { name: '오명진', team: '두산', pos: '내야수' },
  { name: '로하스', team: '두산', pos: '내야수' },
  { name: '한다현', team: '두산', pos: '내야수' },
  { name: '김재환', team: '두산', pos: '외야수' },
  { name: '정수빈', team: '두산', pos: '외야수' },
  { name: '카메론', team: '두산', pos: '외야수' },
  { name: '홍성호', team: '두산', pos: '외야수' },
  { name: '양의지', team: '두산', pos: '포수' },
  { name: '도준석', team: '두산', pos: '포수' },
  // KT
  { name: '사우어', team: 'KT', pos: '투수' },
  { name: '보쉴리', team: 'KT', pos: '투수' },
  { name: '스기모토', team: 'KT', pos: '투수' },
  { name: '소형준', team: 'KT', pos: '투수' },
  { name: '박영현', team: 'KT', pos: '투수' },
  { name: '한승혁', team: 'KT', pos: '투수' },
  { name: '주권', team: 'KT', pos: '투수' },
  { name: '우규민', team: 'KT', pos: '투수' },
  { name: '전용주', team: 'KT', pos: '투수' },
  { name: '손동현', team: 'KT', pos: '투수' },
  { name: '김상수', team: 'KT', pos: '내야수' },
  { name: '허경민', team: 'KT', pos: '내야수' },
  { name: '힐리어드', team: 'KT', pos: '내야수' },
  { name: '이강민', team: 'KT', pos: '내야수' },
  { name: '오윤석', team: 'KT', pos: '내야수' },
  { name: '권동진', team: 'KT', pos: '내야수' },
  { name: '류현인', team: 'KT', pos: '내야수' },
  { name: '배정대', team: 'KT', pos: '외야수' },
  { name: '최원준', team: 'KT', pos: '외야수' },
  { name: '안현민', team: 'KT', pos: '외야수' },
  { name: '장진혁', team: 'KT', pos: '외야수' },
  { name: '안치영', team: 'KT', pos: '외야수' },
  { name: '이정훈', team: 'KT', pos: '외야수' },
  { name: '장성우', team: 'KT', pos: '포수' },
  { name: '조대현', team: 'KT', pos: '포수' },
  { name: '한승택', team: 'KT', pos: '포수' },
  // SSG
  { name: '화이트', team: 'SSG', pos: '투수' },
  { name: '베니지아노', team: 'SSG', pos: '투수' },
  { name: '타케다', team: 'SSG', pos: '투수' },
  { name: '노경은', team: 'SSG', pos: '투수' },
  { name: '문승원', team: 'SSG', pos: '투수' },
  { name: '조병현', team: 'SSG', pos: '투수' },
  { name: '장지훈', team: 'SSG', pos: '투수' },
  { name: '전영준', team: 'SSG', pos: '투수' },
  { name: '최민준', team: 'SSG', pos: '투수' },
  { name: '한두솔', team: 'SSG', pos: '투수' },
  { name: '최정', team: 'SSG', pos: '내야수' },
  { name: '박성한', team: 'SSG', pos: '내야수' },
  { name: '안상현', team: 'SSG', pos: '내야수' },
  { name: '정준재', team: 'SSG', pos: '내야수' },
  { name: '고명준', team: 'SSG', pos: '내야수' },
  { name: '최지훈', team: 'SSG', pos: '외야수' },
  { name: '에레디아', team: 'SSG', pos: '외야수' },
  { name: '한유섬', team: 'SSG', pos: '외야수' },
  { name: '채현우', team: 'SSG', pos: '외야수' },
  { name: '김성욱', team: 'SSG', pos: '외야수' },
  { name: '오태곤', team: 'SSG', pos: '외야수' },
  { name: '조형우', team: 'SSG', pos: '포수' },
  { name: '이지영', team: 'SSG', pos: '포수' },
  // 롯데
  { name: '박세웅', team: '롯데', pos: '투수' },
  { name: '레이예스', team: '롯데', pos: '투수' },
  { name: '현도훈', team: '롯데', pos: '투수' },
  { name: '홍민기', team: '롯데', pos: '투수' },
  { name: '김원중', team: '롯데', pos: '투수' },
  { name: '박진', team: '롯데', pos: '투수' },
  { name: '이인복', team: '롯데', pos: '투수' },
  { name: '나균안', team: '롯데', pos: '투수' },
  { name: '나승엽', team: '롯데', pos: '내야수' },
  { name: '고승민', team: '롯데', pos: '내야수' },
  { name: '한동희', team: '롯데', pos: '내야수' },
  { name: '전민재', team: '롯데', pos: '내야수' },
  { name: '한태양', team: '롯데', pos: '내야수' },
  { name: '황성빈', team: '롯데', pos: '외야수' },
  { name: '윤동희', team: '롯데', pos: '외야수' },
  { name: '전준우', team: '롯데', pos: '외야수' },
  { name: '손성빈', team: '롯데', pos: '포수' },
  { name: '정보근', team: '롯데', pos: '포수' },
  // 한화
  { name: '류현진', team: '한화', pos: '투수' },
  { name: '문동주', team: '한화', pos: '투수' },
  { name: '페냐', team: '한화', pos: '투수' },
  { name: '김서현', team: '한화', pos: '투수' },
  { name: '이태양', team: '한화', pos: '투수' },
  { name: '정우람', team: '한화', pos: '투수' },
  { name: '손승호', team: '한화', pos: '투수' },
  { name: '노시환', team: '한화', pos: '내야수' },
  { name: '강백호', team: '한화', pos: '내야수' },
  { name: '페라자', team: '한화', pos: '내야수' },
  { name: '황영묵', team: '한화', pos: '내야수' },
  { name: '허인서', team: '한화', pos: '내야수' },
  { name: '채은성', team: '한화', pos: '외야수' },
  { name: '문현빈', team: '한화', pos: '외야수' },
  { name: '최재훈', team: '한화', pos: '포수' },
  { name: '이도윤', team: '한화', pos: '포수' },
  // NC
  { name: '구창모', team: 'NC', pos: '투수' },
  { name: '톰슨', team: 'NC', pos: '투수' },
  { name: '테일러', team: 'NC', pos: '투수' },
  { name: '버하겐', team: 'NC', pos: '투수' },
  { name: '신민혁', team: 'NC', pos: '투수' },
  { name: '김영규', team: 'NC', pos: '투수' },
  { name: '배재환', team: 'NC', pos: '투수' },
  { name: '목지훈', team: 'NC', pos: '투수' },
  { name: '박민우', team: 'NC', pos: '내야수' },
  { name: '권희동', team: 'NC', pos: '내야수' },
  { name: '김주원', team: 'NC', pos: '내야수' },
  { name: '신재인', team: 'NC', pos: '내야수' },
  { name: '손아섭', team: 'NC', pos: '외야수' },
  { name: '박건우', team: 'NC', pos: '외야수' },
  { name: '고준휘', team: 'NC', pos: '외야수' },
  { name: '김녹원', team: 'NC', pos: '포수' },
  { name: '라일리', team: 'NC', pos: '포수' },
  // 키움
  { name: '안우진', team: '키움', pos: '투수' },
  { name: '하영민', team: '키움', pos: '투수' },
  { name: '와일스', team: '키움', pos: '투수' },
  { name: '알칸타라', team: '키움', pos: '투수' },
  { name: '한현희', team: '키움', pos: '투수' },
  { name: '손힘찬', team: '키움', pos: '투수' },
  { name: '이주형', team: '키움', pos: '내야수' },
  { name: '안치홍', team: '키움', pos: '내야수' },
  { name: '서건창', team: '키움', pos: '내야수' },
  { name: '송지후', team: '키움', pos: '내야수' },
  { name: '임병욱', team: '키움', pos: '외야수' },
  { name: '이용규', team: '키움', pos: '외야수' },
  { name: '브룩스', team: '키움', pos: '외야수' },
  { name: '김동헌', team: '키움', pos: '포수' },
]

const POS_COLOR = {
  '투수': '#e63946',
  '내야수': '#3b9eff',
  '외야수': '#22c55e',
  '포수': '#f59e0b',
}

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('전체')
  const [selectedPos, setSelectedPos] = useState('전체')

  async function search(name) {
    setLoading(true); setError(''); setData(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/player?name=${encodeURIComponent(name)}`)
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || '선수를 찾을 수 없습니다') }
      setData(await res.json())
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const filtered = PLAYERS.filter(p => {
    const teamOk = selectedTeam === '전체' || p.team === selectedTeam
    const posOk = selectedPos === '전체' || p.pos === selectedPos
    return teamOk && posOk
  })

  const grouped = POSITIONS.slice(1).reduce((acc, pos) => {
    const list = filtered.filter(p => p.pos === pos)
    if (list.length > 0) acc[pos] = list
    return acc
  }, {})

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        .team-btn:hover { background: rgba(59,158,255,0.15) !important; border-color: #3b9eff !important; color: #7ec8f7 !important; }
        .pos-btn:hover { opacity: 0.85; }
        .player-btn:hover { background: rgba(59,158,255,0.12) !important; border-color: #3b9eff !important; color: #fff !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(59,158,255,0.2) !important; }
        .player-btn { transition: all 0.15s ease !important; }
      `}</style>

      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0d1b3e 0%, #0a1628 50%, #0d1b3e 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '36px 16px 60px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* 배경 대각선 장식 */}
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '35%', height: '120%', background: 'linear-gradient(135deg, rgba(59,158,255,0.07) 0%, transparent 60%)', transform: 'skewX(-12deg)' }} />
          <div style={{ position: 'absolute', top: '-10%', left: '3%', width: '12%', height: '120%', background: 'linear-gradient(135deg, rgba(126,200,247,0.05) 0%, transparent 60%)', transform: 'skewX(-12deg)' }} />
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '35%', height: '120%', background: 'linear-gradient(225deg, rgba(230,57,70,0.06) 0%, rgba(59,158,255,0.04) 60%, transparent 100%)', transform: 'skewX(12deg)' }} />
          <div style={{ position: 'absolute', top: '-10%', right: '3%', width: '12%', height: '120%', background: 'linear-gradient(225deg, rgba(126,200,247,0.04) 0%, transparent 60%)', transform: 'skewX(12deg)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 760 }}>

          {/* 타이틀 */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <polygon points="4,4 24,4 24,18 14,26 4,18" fill="#e63946" />
                <polygon points="6,6 22,6 22,17 14,23 6,17" fill="#0d1b3e" />
              </svg>
              <h1 style={{
                fontSize: 'clamp(22px,5vw,34px)', fontWeight: 900, color: '#fff',
                letterSpacing: '-0.02em', margin: 0,
                textShadow: '0 2px 12px rgba(59,158,255,0.3)'
              }}>KBO 인사평가</h1>
            </div>
            <p style={{ fontSize: 13, color: '#7ec8f7', letterSpacing: '0.03em' }}>연봉 대비 성과를 AI가 냉정하게 평가합니다</p>
            <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg, #3b9eff, #e63946)', margin: '10px auto 0', borderRadius: 2 }} />
          </div>

          {/* 검색창 */}
          <div style={{ marginBottom: 32 }}>
            <SearchBar onSearch={search} loading={loading} />
            {error && <div style={{ marginTop: 12, textAlign: 'center', color: '#f87171', fontSize: 13 }}>{error}</div>}
            {loading && (
              <div style={{ marginTop: 36, textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
                <div style={{ width: 30, height: 30, border: '2px solid rgba(59,158,255,0.2)', borderTopColor: '#3b9eff', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ fontSize: 13, color: '#7ec8f7' }}>평가서 작성 중...</p>
              </div>
            )}
            {data && !loading && (
              <div style={{ animation: 'fadeIn 0.4s ease' }}>
                <PlayerCard data={data} />
              </div>
            )}
          </div>

          {/* 구단 탭 */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(59,158,255,0.15)',
            borderRadius: 16, padding: '16px 14px', marginBottom: 12
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#3b9eff', letterSpacing: '0.1em', marginBottom: 10 }}>TEAM</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {TEAMS.map(t => (
                <button key={t} className="team-btn" onClick={() => setSelectedTeam(t)} style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: selectedTeam === t ? 700 : 400,
                  background: selectedTeam === t ? '#3b9eff' : 'rgba(255,255,255,0.05)',
                  color: selectedTeam === t ? '#fff' : '#a0b4cc',
                  border: `1px solid ${selectedTeam === t ? '#3b9eff' : 'rgba(255,255,255,0.08)'}`,
                  cursor: 'pointer',
                  boxShadow: selectedTeam === t ? '0 2px 12px rgba(59,158,255,0.4)' : 'none'
                }}>{t}</button>
              ))}
            </div>
          </div>

          {/* 포지션 필터 */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
            {POSITIONS.map(p => {
              const isAll = p === '전체'
              const active = selectedPos === p
              const color = isAll ? '#7ec8f7' : POS_COLOR[p]
              return (
                <button key={p} className="pos-btn" onClick={() => setSelectedPos(p)} style={{
                  padding: '5px 18px', borderRadius: 8, fontSize: 12, fontWeight: active ? 700 : 500,
                  background: active ? color : 'transparent',
                  color: active ? '#fff' : color,
                  border: `1.5px solid ${color}`,
                  cursor: 'pointer',
                  boxShadow: active ? `0 2px 10px ${color}55` : 'none'
                }}>{p}</button>
              )
            })}
          </div>

          {/* 선수 목록 */}
          {Object.entries(grouped).map(([pos, players]) => (
            <div key={pos} style={{ marginBottom: 22, animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 3, height: 16, borderRadius: 2, background: POS_COLOR[pos] }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: POS_COLOR[pos], letterSpacing: '0.08em' }}>{pos}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {players.map(p => (
                  <button key={p.name} className="player-btn" onClick={() => search(p.name)} disabled={loading} style={{
                    padding: '7px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                    background: 'rgba(255,255,255,0.05)',
                    color: '#d4e8ff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.4 : 1,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                  }}>{p.name}</button>
                ))}
              </div>
            </div>
          ))}

        </div>
      </main>
    </>
  )
}
