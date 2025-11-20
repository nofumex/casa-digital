"use client";
import Link from 'next/link';
import { LeadForm } from '@/components/forms/LeadForm';
import { motion } from 'framer-motion';
import { PortfolioClientGrid } from '@/components/PortfolioClientGrid';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [home, setHome] = useState<any>(null);
  useEffect(() => { (async () => {
    try {
      const r = await fetch(`/cms/home.json`, { cache: 'no-store' });
      if (r.ok) setHome(await r.json());
    } catch {}
  })(); }, []);

  const hero = home?.hero || {
    title: 'Создаем сайты, которые продают',
    subtitle: 'Casa Digital — веб-разработка, SMM и автоматизация бизнеса',
    ctaPrimary: 'Получить бесплатную консультацию',
    ctaSecondary: 'Посмотреть работы',
    stats: [
      { label: 'Проектов', value: '50+' },
      { label: 'лет опыта', value: '3+' },
      { label: 'Довольных клиентов', value: '95%' },
      { label: 'Поддержка', value: '24/7' }
    ]
  };
  const process = home?.process || [
    { number: '01', icon: '📊', title: 'Анализ', description: 'Изучаем ваш бизнес, конкурентов и целевую аудиторию', details: ['Анализ текущего состояния','Исследование конкурентов','Портрет клиента','Технический аудит'] },
    { number: '02', icon: '🎨', title: 'Дизайн', description: 'Создаем уникальный дизайн, который конвертирует посетителей в клиентов', details: ['UX/UI дизайн','Прототипирование','Адаптивная верстка','Брендинг'] },
    { number: '03', icon: '💻', title: 'Разработка', description: 'Создаем надежный сайт на современных технологиях', details: ['Frontend разработка','Backend интеграции','SEO оптимизация','Тестирование'] },
    { number: '04', icon: '🚀', title: 'Запуск и рост', description: 'Запускаем и улучшаем на основе метрик', details: ['Деплой и настройка','Обучение команды','Мониторинг метрик','Поддержка и улучшения'] },
  ];
  const services = home?.services || [
    { icon: '💻', title: 'Веб-разработка', description: 'Современные сайты на React/Next.js с SEO и молниеносной скоростью', features: ['React/Next.js','SEO оптимизация','Адаптивный дизайн','Интеграция CMS'], href: '/services/web-development' as const },
    { icon: '📄', title: 'SMM и контент', description: 'Ведение соцсетей, создание контента и таргетированная реклама', features: ['Контент-план','Таргетинг','Аналитика','Креативы'], href: '/services/smm' as const },
    { icon: '📈', title: 'Контекстная реклама', description: 'Настройка и оптимизация в Яндекс Директ, Google Ads и VK Ads', features: ['Яндекс Директ','Google Ads','VK Ads','A/B тесты'], href: '/services/ppc' as const },
    { icon: '⚙️', title: 'Автоматизация', description: 'CRM, интеграции, чат-боты и автоматизация процессов', features: ['Настройка CRM','Интеграции','Чат-боты','Zapier/Make'], href: '/services/automation' as const }
  ];
  const metrics = home?.metrics || [
    { n: '50+', d: 'Довольных клиентов' },
    { n: '3+', d: 'Лет опыта' },
    { n: '95%', d: 'Повторных обращений' },
    { n: '24/7', d: 'Поддержка' }
  ];
  const testimonials = Array.isArray(home?.testimonials) ? home.testimonials : [];
  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Hero */}
      <section data-gradient-key="hero" className="relative grid gap-10 py-16 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">{hero.title}</h1>
          <p className="mt-4 text-lg text-slate-600">{hero.subtitle}</p>
          {home?.hero?.description ? (
            <p className="mt-2 max-w-prose text-slate-600">{home.hero.description}</p>
          ) : (
            <p className="mt-2 max-w-prose text-slate-600">Красивые, быстрые и понятные сайты + реклама и автоматизация для высокой окупаемости</p>
          )}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/contact" className="w-full sm:w-auto text-center rounded-full bg-softBlueGray/30 px-5 py-3 font-medium hover:bg-softBlueGray/40 transition-colors">{hero.ctaPrimary || 'Получить бесплатную консультацию'}</Link>
            <Link href="#portfolio" className="w-full sm:w-auto text-center rounded-full border border-softBlueGray/50 px-5 py-3 font-medium hover:bg-white transition-colors">{hero.ctaSecondary || 'Посмотреть работы'}</Link>
          </div>
          {/* Statistics */}
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {hero.stats?.map((s:any, idx:number)=> (
              <div className="text-center" key={idx}>
                <div className="text-2xl font-bold text-slate-800">{s.value}</div>
                <div className="text-sm text-slate-600">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative"
        >
          <div className="blob absolute -left-10 -top-6 h-40 w-40 bg-paleTeal/40 blur-xl" />
          <div className="blob absolute -bottom-6 -right-10 h-48 w-48 bg-warmBeige/40 blur-xl" />
          <div className="relative rounded-[2rem] bg-white/70 p-5 shadow-xl ring-1 ring-black/5">
            <h2 id="lead" className="text-lg font-medium">Оставить заявку</h2>
            <p className="mt-1 text-sm text-slate-600">Ответим в течение рабочего дня</p>
            <LeadForm />
          </div>
        </motion.div>
      </section>

      {/* Services */}
      <section data-gradient-key="services" className="mt-16">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Наши услуги</h2>
          <p className="mt-2 text-lg text-slate-600">Полный цикл digital-услуг для роста вашего бизнеса</p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              icon: '💻', 
              title: 'Веб-разработка', 
              description: 'Современные сайты на React/Next.js с SEO и молниеносной скоростью',
              features: ['React/Next.js', 'SEO оптимизация', 'Адаптивный дизайн', 'Интеграция CMS'],
              href: '/services/web-development' as const 
            },
            { 
              icon: '📄', 
              title: 'SMM и контент', 
              description: 'Ведение соцсетей, создание контента и таргетированная реклама',
              features: ['Контент-план', 'Таргетинг', 'Аналитика', 'Креативы'],
              href: '/services/smm' as const 
            },
            { 
              icon: '📈', 
              title: 'Контекстная реклама', 
              description: 'Настройка и оптимизация в Яндекс Директ, Google Ads и VK Ads',
              features: ['Яндекс Директ', 'Google Ads', 'VK Ads', 'A/B тесты'],
              href: '/services/ppc' as const 
            },
            { 
              icon: '⚙️', 
              title: 'Автоматизация', 
              description: 'CRM, интеграции, чат-боты и автоматизация процессов',
              features: ['Настройка CRM', 'Интеграции', 'Чат-боты', 'Zapier/Make'],
              href: '/services/automation' as const 
            }
          ].map((s) => (
            <Link key={s.title} href={s.href} className="group rounded-[2rem] bg-white/70 p-6 ring-1 ring-black/5 transition hover:-translate-y-1">
              <div className="text-3xl mb-4">{s.icon}</div>
              <div className="text-lg font-semibold">{s.title}</div>
              <div className="mt-2 text-sm text-slate-600">{s.description}</div>
              <div className="mt-4 space-y-1">
                {s.features.map((feature, idx) => (
                  <div key={idx} className="text-xs text-slate-500">• {feature}</div>
                ))}
              </div>
              <div className="mt-6 h-1 w-24 rounded-full bg-paleTeal transition group-hover:w-32" />
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-slate-600">Не нашли нужную услугу? Мы создадим индивидуальное решение для вас.</p>
          <Link href="/contact" className="mt-4 inline-block w-full sm:w-auto text-center rounded-full border border-softBlueGray/50 px-5 py-3 font-medium hover:bg-white transition-colors">Обсудить проект</Link>
        </div>
      </section>

      {/* Process */}
      <section data-gradient-key="process" className="mt-16">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Как мы работаем</h2>
          <p className="mt-2 text-lg text-slate-600">Четкий процесс от идеи до измеримого результата</p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {process.map((s:any, i:number) => (
            <div key={s.number} className="rounded-[2rem] bg-white/70 p-6 ring-1 ring-black/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl font-bold text-paleTeal">{String((i+1)).padStart(2,'0')}</div>
                {s.icon && <div className="text-2xl">{s.icon}</div>}
              </div>
              <div className="text-lg font-semibold">{s.title}</div>
              <div className="mt-2 text-sm text-slate-600">{s.description}</div>
              <div className="mt-4 space-y-1">
                {(s.details||[]).map((detail: string, idx: number) => (
                  <div key={idx} className="text-xs text-slate-500">• {detail}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[2rem] bg-white/70 p-6 ring-1 ring-black/5">
          <div className="text-center">
            <h3 className="text-xl font-semibold">Готовы начать проект?</h3>
            <p className="mt-2 text-slate-600">Получите бесплатную консультацию и узнайте, как мы можем помочь вашему бизнесу расти</p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/contact" className="w-full sm:w-auto text-center rounded-full bg-softBlueGray/30 px-5 py-3 font-medium hover:bg-softBlueGray/40 transition-colors">Получить консультацию</Link>
              <a href="https://t.me/CasaAgency" target="_blank" rel="noreferrer" className="w-full sm:w-auto text-center rounded-full border border-softBlueGray/50 px-5 py-3 font-medium hover:bg-white transition-colors">Написать в Telegram</a>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section data-gradient-key="portfolio" id="portfolio" className="mt-16">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Наши работы</h2>
          <p className="mt-2 text-lg text-slate-600">Реальные результаты для наших клиентов</p>
        </div>
        <PortfolioClientGrid />
        <div className="mt-8 text-center">
          <p className="text-slate-600">Хотите такие же результаты?</p>
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/contact" className="w-full sm:w-auto text-center rounded-full bg-softBlueGray/30 px-5 py-3 font-medium hover:bg-softBlueGray/40 transition-colors">Обсудить проект</Link>
            <Link href="/portfolio" className="w-full sm:w-auto text-center rounded-full border border-softBlueGray/50 px-5 py-3 font-medium hover:bg-white transition-colors">Все кейсы</Link>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section data-gradient-key="clients" className="mt-16">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Нам доверяют компании</h2>
          <p className="mt-2 text-lg text-slate-600">Более 50 компаний уже выбрали Casa Digital для развития своего бизнеса</p>
        </div>
        {Array.isArray(home?.clients) && home.clients.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 text-2xl md:grid-cols-4 lg:grid-cols-8">
            {home.clients.map((client: any) => (
              <div key={client.name} className="grid place-items-center rounded-2xl bg-white/70 p-4 ring-1 ring-black/5">
                {client.logo ? (
                  <img src={client.logo} alt={client.name} className="h-8 object-contain" />
                ) : (
                  <div className="text-3xl mb-2">{client.emoji || '🤝'}</div>
                )}
                <div className="text-xs font-medium text-center">{client.name}</div>
                {client.industry && (
                  <div className="text-xs text-slate-500 text-center">{client.industry}</div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section data-gradient-key="testimonials" className="mt-16">
          <div className="text-center">
            <h2 className="text-3xl font-semibold">Отзывы клиентов</h2>
            <p className="mt-2 text-lg text-slate-600">Реальные отзывы наших довольных клиентов</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t:any, i:number) => (
              <div key={i} className="rounded-[2rem] bg-white/70 p-6 ring-1 ring-black/5">
                <div className="text-yellow-500">★★★★★</div>
                <p className="mt-3 text-sm text-slate-700">{t.text}</p>
                <div className="mt-4">
                  <div className="font-medium text-sm">{t.name}</div>
                  {t.position && <div className="text-xs text-slate-500">{t.position}</div>}
                  {t.project && <div className="text-xs text-slate-400 mt-1">Проект: {t.project}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-slate-600">Станьте нашей следующей историей успеха</p>
            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/contact" className="w-full sm:w-auto text-center rounded-full bg-softBlueGray/30 px-5 py-3 font-medium hover:bg-softBlueGray/40 transition-colors">Получить результаты</Link>
              <a href="https://t.me/CasaAgency" target="_blank" rel="noreferrer" className="w-full sm:w-auto text-center rounded-full border border-softBlueGray/50 px-5 py-3 font-medium hover:bg-white transition-colors">Задать вопрос</a>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section data-gradient-key="cta" className="mt-16 rounded-[2rem] bg-white/70 p-8 ring-1 ring-black/5">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Готовы увеличить прибыль?</h2>
          <p className="mt-2 text-lg text-slate-600">Получите бесплатную консультацию и узнайте, как мы можем помочь вашему бизнесу расти</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/contact" className="w-full sm:w-auto text-center rounded-full bg-paleTeal px-6 py-3 text-slate-900 font-medium hover:bg-paleTeal/90 transition-colors">Получить консультацию</Link>
            <a href="https://t.me/CasaAgency" target="_blank" rel="noreferrer" className="w-full sm:w-auto text-center rounded-full border border-softBlueGray/50 px-6 py-3 hover:bg-white font-medium transition-colors">Написать в Telegram</a>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-sm font-medium text-slate-800">Быстрый ответ</div>
              <div className="text-xs text-slate-600">Отвечаем в течение 2 рабочих часов</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-slate-800">Бесплатный аудит</div>
              <div className="text-xs text-slate-600">Проанализируем ваш сайт и дадим рекомендации</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-slate-800">Нацелены на результат</div>
              <div className="text-xs text-slate-600">Работаем до достижения ваших целей</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



