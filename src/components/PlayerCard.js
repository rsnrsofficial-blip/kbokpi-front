'use client'

import { useRef, useState } from 'react'

const GRADE_COLOR = {
  S: { bg: '#d4f5e2', text: '#0a5c36', border: '#0a5c36' },
  A: { bg: '#d4e8ff', text: '#1a4a8a', border: '#1a4a8a' },
  B: { bg: '#fffad4', text: '#5a5a00', border: '#8a8a00' },
  C: { bg: '#ffe8d4', text: '#8a3d00', border: '#8a3d00' },
  D: { bg: '#ffd4d4', text: '#7a0000', border: '#7a0000' },
  '-': { bg: '#f0f0f0', text: '#888', border: '#ccc' },
}
const STAMP = { S: '재계약 권고', A: '우수 인재', B: '확인 필', C: '특타 권고', D: '방출 검토' }

export default function PlayerCard({ data }) {
  const cardRef = useRef(null)
  const [saving, setSaving] = useState(false)
  const sg = data.season_grade || {}
  const tg = data.today_grade || {}
  const grade = sg.grade || '-'
  const gc = GRADE_COLOR[grade] || GRADE_COLOR['-']
  const tgc = GRADE_COLOR[tg.grade] || GRADE_COLOR['-']
  const todayText = data.today_stats?.played
    ? Object.entries(data.today_stats).filter(([k])=>!['played','note','일자','상대'].includes(k)).slice(0,5).map(([k,v])=>`${k} ${v}`).join('  ')
    : data.today_stats?.note || '경기 없음'

  async function saveImage() {
    if (!cardRef.current) return
    setSaving(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const el = cardRef.current
      const canvas = await html2canvas(el, { scale: 3, backgroundColor: '#09090b', useCORS: true, allowTaint: true })
      const a = document.createElement('a')
      a.download = `kbo_${data.name}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    } catch(e) { console.error(e) }
    finally { setSaving(false) }
  }

  return (
    <div style={{marginTop:24}}>
      <div ref={cardRef} style={{width:'100%',aspectRatio:'1/1',background:'#09090b',border:'1px solid #27272a',borderRadius:16,overflow:'hidden',display:'flex',flexDirection:'column',fontFamily:"'Noto Sans KR',sans-serif"}}>
        <div style={{background:'#18181b',borderBottom:'1px solid #27272a',padding:'14px 18px',display:'flex',alignItems:'center',gap:14,flexShrink:0}}>
          <div style={{width:64,height:64,borderRadius:'50%',overflow:'hidden',border:'2px solid #3f3f46',flexShrink:0,background:'#27272a'}}>
            {data.photo_url && <img src={data.photo_url} alt={data.name} crossOrigin="anonymous" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}} onError={e=>e.target.style.display='none'} />}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,color:'#71717a',letterSpacing:'0.15em',marginBottom:2}}>KBO 인사평가시스템</div>
            <div style={{fontSize:22,fontWeight:900,color:'#fff',lineHeight:1,marginBottom:3}}>{data.name}</div>
            <div style={{fontSize:11,color:'#71717a'}}>{data.team} · {data.position} · 연봉 {data.salary_display}</div>
          </div>
          <div style={{width:56,height:56,borderRadius:'50%',border:`2px solid ${gc.border}`,background:gc.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <span style={{fontSize:28,fontWeight:900,color:gc.text,lineHeight:1}}>{grade}</span>
            <span style={{fontSize:10,color:gc.text}}>{Math.round(sg.score||0)}점</span>
          </div>
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',padding:'14px 18px 10px',minHeight:0}}>
          <div style={{fontSize:13,fontWeight:700,color:'#fff',marginBottom:2}}>{sg.grade_label}</div>
          <div style={{fontSize:11,color:'#71717a',marginBottom:14}}>경기당 인건비 {data.daily_wage_display}</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:12}}>
            {Object.entries(data.season_stats||{}).slice(0,6).map(([k,v])=>(
              <div key={k} style={{background:'#18181b',border:'1px solid #27272a',borderRadius:8,padding:'8px 6px 6px',textAlign:'center'}}>
                <div style={{fontSize:9,color:'#71717a',fontWeight:700,letterSpacing:'0.08em',marginBottom:3}}>{k}</div>
                <div style={{fontSize:16,fontWeight:900,color:'#fff'}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{flex:1,background:'#1c1400',border:'1px solid #854d0e',borderRadius:10,padding:'10px 14px',minHeight:0,overflow:'hidden'}}>
            <div style={{fontSize:9,fontWeight:700,color:'#f59e0b',letterSpacing:'0.12em',marginBottom:6}}>AI 인사팀 총평</div>
            <p style={{fontSize:11,color:'#fef3c7',lineHeight:1.6,margin:0,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:4,WebkitBoxOrient:'vertical'}}>{data.ai_comment||'총평 데이터 없음'}</p>
          </div>
        </div>
        <div style={{borderTop:'1px dashed #27272a',padding:'7px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
          <span style={{fontSize:9,color:'#52525b',fontWeight:700,letterSpacing:'0.12em'}}>TODAY</span>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:11,color:'#d4d4d8',fontWeight:700}}>{todayText}</span>
            <span style={{fontSize:11,fontWeight:900,padding:'2px 8px',borderRadius:4,background:tgc.bg,color:tgc.text}}>{tg.grade||'-'}</span>
          </div>
        </div>
        <div style={{background:'#18181b',borderTop:'1px solid #27272a',padding:'7px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
          <span style={{fontSize:9,color:'#52525b',letterSpacing:'0.08em'}}>kbokpi-front.vercel.app</span>
          <span style={{fontSize:10,fontWeight:900,padding:'3px 10px',borderRadius:4,background:gc.bg,color:gc.text}}>{STAMP[grade]||'확인필'}</span>
        </div>
      </div>
      <button onClick={saveImage} disabled={saving} style={{width:'100%',marginTop:10,padding:'12px',background:'#18181b',border:'1px solid #27272a',borderRadius:12,color:'#fff',fontSize:13,fontWeight:700,cursor:saving?'not-allowed':'pointer',opacity:saving?0.5:1}}>
        {saving ? '저장 중...' : '이미지 저장 (공유용)'}
      </button>
      {data.cached && <p style={{textAlign:'center',fontSize:11,color:'#52525b',marginTop:8}}>캐시된 데이터 · {data.crawled_at}</p>}
    </div>
  )
}
