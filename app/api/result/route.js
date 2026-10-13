import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'الرجاء إدخال البريد الإلكتروني' }, { status: 400 });
    }

    // تحديد مسار ملف الإكسيل داخل مجلد data
    const filePath = path.join(process.cwd(), 'data', 'results.xlsx');

    // التأكد من أن الملف موجود
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'ملف النتائج غير متوفر حالياً.' }, { status: 404 });
    }

    // قراءة ملف الإكسيل
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    
    // اختيار الشيت الأول
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // تحويل البيانات إلى مصفوفة (Array)
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    if (!rows || rows.length <= 1) {
      return NextResponse.json({ error: 'لا توجد بيانات في الملف.' }, { status: 404 });
    }

    // البحث عن الطالب بالإيميل (نتجاهل الصف الأول لأنه للعناوين)
    const student = rows.slice(1).find(
      row => row[1] && row[1].toString().trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (student) {
      return NextResponse.json({
        name: student[0] || 'غير مسجل',
        email: student[1],
        grade: student[2] || 'غير مسجلة'
      });
    } else {
      return NextResponse.json({ error: 'لم يتم العثور على نتيجة مسجلة لهذا البريد الإلكتروني.' }, { status: 404 });
    }

  } catch (error) {
    console.error("Error reading excel file:", error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم أثناء البحث.' }, { status: 500 });
  }
}
