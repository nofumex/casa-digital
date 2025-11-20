"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: '',
          consent: false
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold">Связаться с нами</h1>
        <p className="mt-4 text-xl text-slate-600">Обсудим ваш проект и найдем лучший путь к росту</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        {/* Contact Form */}
        <section>
          <div className="rounded-[2rem] bg-white/70 p-8 ring-1 ring-black/5">
            <h2 className="text-2xl font-semibold mb-6">Отправить сообщение</h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 rounded-2xl bg-green-100 text-green-800 text-sm">
                Спасибо! Мы свяжемся с вами в течение 2 рабочих часов.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 rounded-2xl bg-red-100 text-red-800 text-sm">
                Что-то пошло не так. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Имя *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-paleTeal focus:border-transparent"
                    placeholder="Иван Петров"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-paleTeal focus:border-transparent"
                    placeholder="ivan@example.ru"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-paleTeal focus:border-transparent"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-2">
                    Услуга *
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-paleTeal focus:border-transparent"
                  >
                    <option value="">Выберите услугу</option>
                    <option value="website">Веб-разработка</option>
                    <option value="smm">SMM и контент</option>
                    <option value="ppc">Контекстная реклама</option>
                    <option value="automation">Автоматизация</option>
                    <option value="other">Другое</option>
                  </select>
                </div>
              </div>

              

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Сообщение / Бриф
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-paleTeal focus:border-transparent"
                  placeholder="Расскажите о вашем проекте, целях и требованиях..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    required
                    checked={formData.consent}
                    onChange={handleInputChange}
                    className="rounded border-slate-300 text-paleTeal focus:ring-paleTeal"
                  />
                  <label htmlFor="consent" className="ml-2 text-sm text-slate-600">
                    Я согласен на обработку моих персональных данных в соответствии с{' '}
                    <Link href="/privacy" className="text-paleTeal hover:underline">
                      Политикой конфиденциальности
                    </Link>{' '}
                    *
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-paleTeal px-6 py-4 text-slate-900 font-medium hover:bg-paleTeal/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
              </button>
            </form>
          </div>
        </section>

        {/* Contact Info & Free Audit */}
        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-white/70 p-6 ring-1 ring-black/5">
            <h3 className="text-xl font-semibold mb-4">Контактные данные</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-slate-500">Email</div>
                <a href="mailto:hello@casadigital.ru" className="text-slate-700 hover:text-paleTeal">
                  hello@casadigital.ru
                </a>
                <div className="text-xs text-slate-500 mt-1">Отвечаем в течение 2 рабочих часов</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-slate-500">Телефон</div>
                <a href="tel:+79964287975" className="text-slate-700 hover:text-paleTeal">
                  +7 (996) 428-79-75
                </a>
                <div className="text-xs text-slate-500 mt-1">Звонки принимаются с 10:00 до 19:00 МСК</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-slate-500">Telegram</div>
                <a href="https://t.me/CasaAgency" target="_blank" rel="noreferrer" className="text-slate-700 hover:text-paleTeal">
                  @CasaAgency
                </a>
                <div className="text-xs text-slate-500 mt-1">Быстрые ответы и удобное общение</div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/70 p-6 ring-1 ring-black/5">
            <h3 className="text-xl font-semibold mb-4">Бесплатный аудит</h3>
            <p className="text-sm text-slate-600 mb-4">Получите бесплатный анализ вашего текущего сайта</p>
            <ul className="space-y-2 text-sm text-slate-700 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-paleTeal text-xs mt-1">•</span>
                Анализ производительности
              </li>
              <li className="flex items-start gap-2">
                <span className="text-paleTeal text-xs mt-1">•</span>
                SEO аудит и рекомендации
              </li>
              <li className="flex items-start gap-2">
                <span className="text-paleTeal text-xs mt-1">•</span>
                Анализ конверсии
              </li>
              <li className="flex items-start gap-2">
                <span className="text-paleTeal text-xs mt-1">•</span>
                План улучшений
              </li>
            </ul>
            <Link href="/contact" className="inline-block rounded-full bg-paleTeal px-4 py-2 text-slate-900 text-sm font-medium">
              Заказать аудит
            </Link>
          </div>

          <div className="rounded-[2rem] bg-white/70 p-6 ring-1 ring-black/5">
            <h3 className="text-xl font-semibold mb-4">Режим работы</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div>Понедельник — Пятница: 10:00 — 19:00 МСК</div>
              <div>Суббота: 11:00 — 17:00 МСК</div>
              <div>Воскресенье: Выходной</div>
              <div className="text-xs text-slate-500 mt-2">
                Срочные проекты: работаем в выходные и праздники по предварительной договоренности
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}





