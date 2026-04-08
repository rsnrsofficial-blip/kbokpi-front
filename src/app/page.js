'use client'
import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import PlayerCard from '@/components/PlayerCard'
export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function search(name) {
    setLoading(true); setError(''); setData(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/player?name=${encodeURIComponent(name)}`)
      if(!res.ok){const err=await res.json();throw new Error(err.detail||'선수를 찾을 수 없습니다')}
      setData(await res.json())
    } catch(e){setError(e.message)}
    finally{setLoading(false)}
  }
  return (
    <main style={{minHeight:'100vh',background:'#09090b',display:'flex',flexDirection:'column',alignItems:'center',padding:'48px 16px'}}>
      <div style={{width:'100%',maxWidth:480}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <h1 style={{fontSize:32,fontWeight:900,color:'#fff',letterSpacing:'-0.02em',marginBottom:8}}>KBO 인사평가</h1>
          <p style={{fontSize:14,color:'#71717a'}}>연봉 대비 성과를 AI가 냉정하게 평가합니다</p>
        </div>
        <SearchBar onSearch={search} loading={loading} />
        {error && <div style={{marginTop:16,textAlign:'center',color:'#f87171',fontSize:14}}>{error}</div>}
        {loading && (
          <div style={{marginTop:48,textAlign:'center'}}>
            <div style={{width:32,height:32,border:'2px solid #3f3f46',borderTopColor:'#fff',borderRadius:'50%',margin:'0 auto 12px',animation:'spin 0.8s linear infinite'}} />
            <p style={{fontSize:13,color:'#52525b'}}>평가서 작성 중...</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}
        {data && !loading && <PlayerCard data={data} />}
      </div>
    </main>
  )
}
