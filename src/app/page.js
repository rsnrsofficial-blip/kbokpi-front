'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import PlayerCard from '@/components/PlayerCard'

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function search(name) {
    setLoading(true)
    setError('')
    setData(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/player?name=${encodeURIComponent(name)}`)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || '선수를 찾을 수 없습니다')
      }
      setData(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            KBO 인사평가
          </h1>
          <p className="text-zinc-400 text-sm">
            연봉 대비 성과를 AI가 냉정하게 평가합니다
          </p>
        </div>

        <SearchBar onSearch={search} loading={loading} />

        {error && (
          <div className="mt-4 text-center text-red-400 text-sm">{error}</div>
        )}

        {loading && (
          <div className="mt-12 text-center">
            <div className="inline-block w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
            <p className="text-zinc-500 text-sm mt-3">평가서 작성 중...</p>
          </div>
        )}

        {data && !loading && (
          <div className="mt-8">
            <PlayerCard data={data} />
          </div>
        )}
      </div>
    </main>
  )
}
