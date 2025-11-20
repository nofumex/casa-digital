import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

type ContactBody = {
  name: string;
  email: string;
  phone: string;
  message: string;
  service?: string;
  website?: string;
  consent?: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

const verifyEnvironmentVars = () => {
  const requiredVars = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_ADMIN_ID'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

export async function POST(req: Request) {
  try {
    // Verify environment variables
    verifyEnvironmentVars();
    
    const body = (await req.json()) as ContactBody;
    const { name, email, phone, message } = body;
    
    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Необходимо заполнить все обязательные поля' }, 
        { status: 400 }
      );
    }

    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const adminId = process.env.TELEGRAM_ADMIN_ID!;

    // Get request metadata
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'Unknown';

    // Format message for Telegram
    const lines = [
      `🎯 Новая заявка с сайта`,
      `\n📋 Контактная информация:`,
      `• Имя: ${name}`,
      `• Email: ${email}`,
      `• Телефон: ${phone}`,
      body.service ? `• Услуга: ${body.service}` : undefined,
      body.website ? `• Сайт: ${body.website}` : undefined,
      `\n💬 Сообщение:`,
      message,
      `\n📊 Метаданные:`,
      body.utm_source ? `• UTM источник: ${body.utm_source}` : undefined,
      body.utm_medium ? `• UTM канал: ${body.utm_medium}` : undefined,
      body.utm_campaign ? `• UTM кампания: ${body.utm_campaign}` : undefined,
      `• User Agent: ${userAgent}`,
      `• IP: ${ip}`,
      `• Дата: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`,
      body.consent ? `\n✅ Согласие на обработку: Получено` : undefined
    ].filter(Boolean).join('\n');

    // Send to Telegram
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: adminId, 
        text: lines
        // parse_mode removed to avoid HTML parsing errors with special characters
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Telegram API error:', errorText);
      return NextResponse.json(
        { error: 'Не удалось отправить сообщение. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.' }, 
        { status: 503 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ 
      success: true, 
      messageId: data?.result?.message_id 
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    // Check if it's a missing env vars error
    if (error instanceof Error && error.message.includes('Missing required environment variables')) {
      return NextResponse.json(
        { error: 'Сервис временно недоступен. Пожалуйста, свяжитесь с нами напрямую через Telegram или WhatsApp.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.' },
      { status: 500 }
    );
  }
}
