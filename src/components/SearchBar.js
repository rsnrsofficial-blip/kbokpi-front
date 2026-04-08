'use client'

import { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (name.trim().length < 2) return
    onSearch(name.trim())
  }

  const SAMPLES = ['노시환', '류현진', '김도영', '구창모', '양의지']

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="선수 이름 입력 (예: 류현진)"
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-zinc-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || name.trim().length < 2}
          className="bg-white text-black font-bold text-sm px-5 py-3 rounded-xl disabled:opacity-30 hover:bg-zinc-200 transition-colors"
        >
          평가
        </button>
      </form>

      <div className="flex gap-2 mt-3 flex-wrap">
        {SAMPLES.map(n => (
          <button
            key={n}
            onClick={() => { setName(n); onSearch(n); }}
            disabled={loading}
            className="text-xs text-zinc-500 border border-zinc-800 rounded-full px-3 py-1 hover:border-zinc-600 hover:text-zinc-300 transition-colors disabled:opacity-30"
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
