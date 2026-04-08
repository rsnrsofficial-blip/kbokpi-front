import './globals.css'

export const metadata = {
  title: 'KBO 인사평가 — 연봉 대비 성과 분석',
  description: 'KBO 선수들의 연봉 대비 성과를 AI가 냉정하게 평가합니다',
  openGraph: {
    title: 'KBO 인사평가',
    description: '내 팀 선수 먹튀 검증기',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
