"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

type Status = 'idle' | 'ok' | 'error';

const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const phoneRegex = /^[+\d][\d\s\-()]{6,}$/;
// URL поле удалено для компактной версии формы на главной

const schema = z.object({
  name: z.string().min(2, 'Введите ваше имя'),
  email: z.string().regex(emailRegex, 'Введите корректный email'),
  phone: z.string().regex(phoneRegex, 'Введите корректный номер телефона'),
  service: z.enum(['web-development','smm','ppc','automation']),
  message: z.string().min(10, 'Опишите ваш проект'),
  consent: z.literal(true),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  timestamp: z.string().optional()
});

type FormData = z.infer<typeof schema>;

export function LeadForm() {
  const [status, setStatus] = useState<Status>('idle');
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      service: undefined,
    }
  });

  const utm = useMemo(() => {
    if (typeof window === 'undefined') return {} as Record<string,string>;
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined
    };
  }, []);

  useEffect(() => {
    Object.entries(utm).forEach(([k, v]) => v && setValue(k as keyof FormData, v as any));
    setValue('timestamp', new Date().toISOString());
  }, [utm, setValue]);

  const onSubmit = async (data: FormData) => {
    setStatus('idle');
    try {
      const body = { ...data };
      // Required path: send to Telegram first
      const tele = fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const crm = fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).catch((e) => console.warn('CRM error', e));

      const teleRes = await tele;
      // fire-and-forget crm
      crm.then(() => undefined).catch(() => undefined);
      if (!teleRes.ok) throw new Error('Telegram failed');

      setStatus('ok');
      reset();
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <form className="mt-3 max-w-xl" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Имя <span className="text-red-500">*</span>
            </label>
            <input 
              aria-invalid={!!errors.name} 
              {...register('name')} 
              placeholder="Иван Петров"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 shadow-sm focus:border-paleTeal focus:ring-1 focus:ring-paleTeal/30 transition-colors" 
            />
            {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input 
              aria-invalid={!!errors.email} 
              {...register('email')} 
              placeholder="ivan@example.ru"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 shadow-sm focus:border-paleTeal focus:ring-1 focus:ring-paleTeal/30 transition-colors" 
            />
            {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Телефон <span className="text-red-500">*</span>
            </label>
            <input 
              aria-invalid={!!errors.phone} 
              {...register('phone')} 
              placeholder="+7 (999) 123-45-67"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 shadow-sm focus:border-paleTeal focus:ring-1 focus:ring-paleTeal/30 transition-colors" 
            />
            {errors.phone && <p className="mt-1.5 text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          {/* Service */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Услуга <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                aria-invalid={!!errors.service}
                {...register('service')}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 appearance-none shadow-sm focus:border-paleTeal focus:ring-1 focus:ring-paleTeal/30 transition-colors"
              >
                <option value="">Выберите услугу...</option>
                <option value="web-development">Веб-разработка</option>
                <option value="smm">SMM и контент</option>
                <option value="ppc">Контекстная реклама</option>
                <option value="automation">Автоматизация</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon className="h-5 w-5 text-slate-400" />
              </div>
            </div>
            {errors.service && <p className="mt-1.5 text-sm text-red-600">{errors.service.message}</p>}
          </div>
        </div>

        

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Сообщение / Бриф <span className="text-red-500">*</span>
          </label>
          <textarea 
            aria-invalid={!!errors.message} 
            {...register('message')} 
            rows={3}
            placeholder="Опишите ваш проект..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 shadow-sm focus:border-paleTeal focus:ring-1 focus:ring-paleTeal/30 transition-colors resize-y min-h-[120px]" 
          />
          {errors.message && <p className="mt-1.5 text-sm text-red-600">{errors.message.message}</p>}
        </div>

        {/* Consent */}
        <div className="flex items-start gap-3">
          <input
            id="consent"
            type="checkbox"
            aria-invalid={!!errors.consent}
            {...register('consent')}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-paleTeal focus:ring-paleTeal/30"
          />
          <label htmlFor="consent" className="text-sm text-slate-600 leading-5">
            Я согласен с <Link href="/privacy" className="text-slate-800 underline hover:text-paleTeal transition-colors">Политикой конфиденциальности</Link>
          </label>
          {errors.consent && <p className="mt-1.5 text-sm text-red-600">{errors.consent.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto rounded-full bg-paleTeal px-8 py-3 text-slate-900 font-medium shadow-sm hover:bg-paleTeal/90 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? 'Отправка…' : 'Отправить заявку'}
          </button>
        </div>

        {/* Status Messages */}
        {status === 'ok' && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            Мы получили вашу заявку. Свяжемся с вами в ближайшее время.
          </div>
        )}
        {status === 'error' && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            Не удалось отправить. Пожалуйста, попробуйте еще раз или напишите нам в Telegram.
          </div>
        )}
      </div>
    </form>
  );
}