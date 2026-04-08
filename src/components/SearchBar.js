'use client'
import { useState } from 'react'
export default function SearchBar({ onSearch, loading }) {
  const [name, setName] = useState('')
  function handleSubmit(e) { e.preventDefault(); if(name.trim().length<2)return; onSearch(name.trim()) }
  const SAMPLES = ['노시환','류현진','김도영','구창모','양의지']
  return (
    <div>
      <form onSubmit={handleSubmit} style={{display:'flex',gap:8}}>
        <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="선수 이름 입력 (예: 류현진)" disabled={loading} style={{flex:1,background:'#18181b',border:'1px solid #3f3f46',borderRadius:12,padding:'12px 16px',color:'#fff',fontSize:14,outline:'none'}} />
        <button type="submit" disabled={loading||name.trim().length<2} style={{background:'#fff',color:'#000',border:'none',borderRadius:12,padding:'12px 20px',fontSize:14,fontWeight:700,cursor:loading||name.trim().length<2?'not-allowed':'pointer',opacity:loading||name.trim().length<2?0.4:1}}>평가</button>
      </form>
      <div style={{display:'flex',gap:8,marginTop:12,flexWrap:'wrap'}}>
        {SAMPLES.map(n=>(
          <button key={n} onClick={()=>{setName(n);onSearch(n)}} disabled={loading} style={{fontSize:12,color:'#71717a',background:'transparent',border:'1px solid #27272a',borderRadius:20,padding:'5px 14px',cursor:loading?'not-allowed':'pointer'}}>{n}</button>
        ))}
      </div>
    </div>
  )
}
