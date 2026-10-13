'use client';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error);
    } catch (err) {
      setError('حدث خطأ في الاتصال.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px', maxWidth: '400px', margin: '50px auto', textAlign: 'center', border: '1px solid #ccc', borderRadius: '10px' }} dir="rtl">
      <h2 style={{ color: '#0056b3' }}>نتائج الامتحانات</h2>
      <form onSubmit={handleSearch}>
        <input 
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
          placeholder="أدخل بريدك الإلكتروني" 
          style={{ width: '90%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #aaa' }} 
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '5px', width: '100%' }}>
          {loading ? 'جاري البحث...' : 'عرض النتيجة'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
      {result && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px' }}>
          <p><strong>الاسم:</strong> {result.name}</p>
          <p><strong>الإيميل:</strong> {result.email}</p>
          <p><strong>الدرجة:</strong> {result.grade}</p>
        </div>
      )}
    </div>
  );
}
