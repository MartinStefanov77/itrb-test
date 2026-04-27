import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const res = await fetch('http://localhost:80/contact.php', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (err) {
    console.error('[contact] fetch error:', err);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again later.' },
      { status: 502 }
    );
  }
}

