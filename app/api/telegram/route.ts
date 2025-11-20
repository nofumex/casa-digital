import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

type Body = {
  name: string;
  email: string;
  phone: string;
  service: string;
  consent: boolean;
  website?: string;
  message?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  timestamp?: string;
};

const verifyEnvironmentVars = () => {
  const requiredVars = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_ADMIN_ID'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

export async function POST(req: Request) {
  try {
    // Verify environment variables
    verifyEnvironmentVars();
    
    const body = (await req.json()) as Body;
    const { name, email, phone, service, consent } = body;
    
    // Validate required fields
    if (!name || !email || !phone || !service || !consent) {
      return NextResponse.json({ error: 'Необходимо заполнить все обязательные поля' }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const adminId = process.env.TELEGRAM_ADMIN_ID!;

    // Get request metadata
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'Unknown';

    const lines = [
      `🎯 Новая заявка с сайта`,
      `\n📋 Основная информация:`,
      `• Имя: ${body.name}`,
      `• Email: ${body.email}`,
      `• Телефон: ${body.phone}`,
      `• Услуга: ${body.service}`,
      body.website ? `• Сайт: ${body.website}` : undefined,
      body.message ? `\n💬 Сообщение:\n${body.message}` : undefined,
      `\n📊 Дополнительная информация:`,
      body.utm_source ? `• UTM источник: ${body.utm_source}` : undefined,
      body.utm_medium ? `• UTM канал: ${body.utm_medium}` : undefined,
      body.utm_campaign ? `• UTM кампания: ${body.utm_campaign}` : undefined,
      `• User Agent: ${userAgent}`,
      `• IP: ${ip}`,
      `• Дата: ${body.timestamp || new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`,
      `\n✅ Согласие на обработку: ${body.consent ? 'Получено' : 'Нет'}`
    ].filter(Boolean).join('\n');

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: adminId, text: lines })
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'Ошибка Telegram', details: text }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, messageId: data?.result?.message_id });
  } catch (e) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}








