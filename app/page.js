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
      setError('حدث خطأ في الاتصال، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  // دالة ذكية لتحليل الدرجة من ملف الإكسيل وحساب النسبة واللون
  const parseGrade = (gradeStr) => {
    if (!gradeStr || typeof gradeStr !== 'string' || !gradeStr.includes('/')) {
      return { text: gradeStr, percent: null, color: '#6c757d', status: '' };
    }
    
    const parts = gradeStr.split('/');
    const studentScore = parseFloat(parts[0].trim());
    const totalScore = parseFloat(parts[1].trim());

    if (isNaN(studentScore) || isNaN(totalScore) || totalScore === 0) {
      return { text: gradeStr, percent: null, color: '#6c757d', status: '' };
    }

    const percent = Math.round((studentScore / totalScore) * 100);
    let color = '';
    let status = '';

    if (percent < 60) {
      color = '#e74c3c'; // أحمر
      status = 'ضعيف ⚠️';
    } else if (percent < 75) {
      color = '#f39c12'; // برتقالي
      status = 'جيد 👍';
    } else if (percent < 85) {
      color = '#3498db'; // أزرق
      status = 'جيد جداً ✨';
    } else {
      color = '#2ecc71'; // أخضر
      status = 'ممتاز 🏆';
    }

    return { text: gradeStr, percent, color, status };
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f7f6', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }} dir="rtl">
      <div style={{ width: '100%', maxWidth: '450px', backgroundColor: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2c3e50', fontSize: '26px', margin: '0 0 8px 0', fontWeight: 'bold' }}>بوابة نتائج الامتحانات</h1>
          <p style={{ color: '#7f8c8d', margin: 0, fontSize: '15px' }}>أدخل بريدك الإلكتروني لمعرفة نتيجتك</p>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="example@student.com" 
              style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '15px', outline: 'none', transition: 'border-color 0.3s', boxSizing: 'border-box' }} 
              dir="ltr"
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            style={{ width: '100%', padding: '14px', backgroundColor: loading ? '#95a5a6' : '#2c3e50', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.3s, transform 0.1s' }}
          >
            {loading ? 'جاري البحث...' : 'عرض النتيجة'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fdf3f2', color: '#e74c3c', borderRadius: '10px', textAlign: 'center', fontSize: '15px', border: '1px solid #fadbd8' }}>
            {error}
          </div>
        )}

        {result && (() => {
          const gradeInfo = parseGrade(result.grade);
          return (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#ffffff', border: '1px solid #edf2f7', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #edf2f7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                  <span style={{ color: '#718096' }}>اسم الطالب:</span>
                  <strong style={{ color: '#2d3748' }}>{result.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                  <span style={{ color: '#718096' }}>الإيميل:</span>
                  <strong style={{ color: '#2d3748', direction: 'ltr' }}>{result.email}</strong>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ display: 'block', color: '#718096', marginBottom: '8px', fontSize: '14px' }}>الدرجة المستحقة</span>
                <strong style={{ display: 'block', fontSize: '26px', color: '#1a202c', direction: 'ltr', letterSpacing: '1px' }}>
                  {gradeInfo.text}
                </strong>
                
                {gradeInfo.percent !== null && (
                  <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: gradeInfo.color }}>
                      <span>{gradeInfo.status}</span>
                      <span>{gradeInfo.percent}%</span>
                    </div>
                    {/* شريط التقدم (Progress Bar) */}
                    <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '20px', height: '12px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${gradeInfo.percent}%`, 
                        backgroundColor: gradeInfo.color, 
                        height: '100%', 
                        borderRadius: '20px',
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
                      }}></div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })()}
      </div>
    </div>
  );
}
