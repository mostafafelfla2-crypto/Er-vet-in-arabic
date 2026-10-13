export const metadata = {
  title: 'Er Vet Results',
  description: 'نتائج الامتحانات',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f9f9f9' }}>
        {children}
      </body>
    </html>
  )
}
