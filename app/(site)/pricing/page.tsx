export const metadata = { 
  title: 'Цены - Прозрачные пакеты услуг',
  description: 'Выберите подходящий пакет услуг или запросите индивидуальный расчет. Веб-разработка, SMM, реклама и автоматизация с четкими сроками и объемом работ.'
};

// Принудительно делаем страницу динамической, чтобы данные всегда обновлялись
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import { readFileSync } from 'fs';
import { join } from 'path';

async function getPricingData() {
  try {
    // Читаем файл напрямую с диска для гарантированно свежих данных
    const filePath = join(process.cwd(), 'public', 'cms', 'pricing.json');
    const fileContents = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading pricing.json:', error);
    return { packages: [], addons: [] };
  }
}

const defaultPackages = [
  {
    name: 'Старт',
    price: 'от 84 000 ₽',
    timeline: '2–4 недели',
    target: 'стартапы и малый бизнес',
    popular: false,
    includes: [
      'Лендинг до 5 страниц',
      'Адаптивный дизайн',
      'SEO-оптимизация',
      'Интеграция аналитики',
      '1 месяц тех. поддержки',
      'Обучение работе с сайтом'
    ],
    process: [
      'Анализ конкурентов',
      'Создание дизайна',
      'Разработка и тестирование',
      'Запуск и настройка'
    ]
  },
  {
    name: 'Бизнес',
    price: 'от 245 000 ₽',
    timeline: '4–8 недель',
    target: 'растущий бизнес',
    popular: true,
    includes: [
      'Сайт до 15 страниц',
      'Современный дизайн',
      'CMS для управления контентом',
      'Интеграция с CRM',
      'SEO + контент-план',
      '3 месяца поддержки',
      'Обучение команды',
      'Аналитика и отчетность'
    ],
    process: [
      'Полный аудит бизнеса',
      'Стратегия роста',
      'Дизайн и прототипирование',
      'Разработка и интеграции',
      'Контент и SEO',
      'Запуск и оптимизация'
    ]
  },
  {
    name: 'Рост',
    price: 'от 490 000 ₽',
    timeline: '6–12 недель',
    target: 'масштабирование',
    popular: false,
    includes: [
      'Многостраничный сайт',
      'Интернет-магазин',
      'Автоматизация процессов',
      'Интеграция сервисов',
      'SMM + контент',
      'Настройка рекламы',
      '6 месяцев поддержки',
      'Выделенный менеджер'
    ],
    process: [
      'Комплексный аудит',
      'Стратегия роста',
      'Разработка платформы',
      'Автоматизация',
      'Маркетинговая кампания',
      'Запуск и масштабирование'
    ]
  },
  {
    name: 'Энтерпрайз',
    price: 'индивидуально',
    timeline: '8–16 недель',
    target: 'индивидуальные решения',
    popular: false,
    includes: [
      'Сложные интеграции',
      'Индивидуальная разработка',
      'Микросервисная архитектура',
      'Готовность к высоким нагрузкам',
      'Корпоративная безопасность',
      'Поддержка 24/7',
      'Выделенная команда',
      'Гарантии по SLA'
    ],
    process: [
      'Техническое консультирование',
      'Проектирование решения',
      'Полный цикл разработки',
      'Интеграции и миграции',
      'Тестирование и безопасность',
      'Запуск и сопровождение'
    ]
  }
];

const defaultAddons = [
  {
    name: 'Дополнительная страница',
    price: '42 000 ₽',
    description: 'Добавление страницы с уникальным дизайном и контентом'
  },
  {
    name: 'Настройка блога',
    price: '67 000 ₽',
    description: 'Полная настройка блога с интеграцией CMS и начальным контентом'
  },
  {
    name: 'Дополнительный язык',
    price: '50 000 ₽',
    description: 'Добавление дополнительной языковой версии сайта'
  },
  {
    name: 'Ежемесячное обслуживание',
    price: '12 500 ₽/месяц',
    description: 'Регулярные обновления, резервное копирование и техподдержка'
  },
  {
    name: 'Оптимизация скорости',
    price: '34 000 ₽',
    description: 'Аудит производительности и оптимизация для более быстрой загрузки'
  },
  {
    name: 'SEO пакет',
    price: '59 000 ₽',
    description: 'Полная настройка SEO с исследованием ключевых слов и оптимизацией'
  }
];

const faqs = [
  { 
    question: 'Что входит в стоимость?', 
    answer: 'Все пакеты включают дизайн, разработку, тестирование и базовую поддержку. Пакеты более высокого уровня включают дополнительные услуги, такие как создание контента, SEO и расширенную поддержку.' 
  },
  { 
    question: 'Можно ли изменить пакет после начала работы?', 
    answer: 'Да, мы можем обновить или изменить ваш пакет в процессе разработки. Мы соответствующим образом скорректируем сроки и стоимость.' 
  },
  { 
    question: 'Что если мне нужны изменения после запуска?', 
    answer: 'Мы предоставляем пакеты поддержки и обслуживания. Небольшие изменения часто включены в поддержку, крупные обновления оцениваются отдельно.' 
  },
  { 
    question: 'Предоставляете ли вы гарантии?', 
    answer: 'Да, мы гарантируем качество работы и исправляем ошибки в течение 30 дней после запуска. Также мы предлагаем гарантии по конкретным показателям эффективности.' 
  },
  { 
    question: 'Как происходит оплата?', 
    answer: 'Обычно мы работаем по схеме 50% предоплата и 50% по завершении. Для крупных проектов возможна оплата по этапам.' 
  }
];

function normalizePackages(input: any): Array<any> {
  const base = defaultPackages;
  const raw = Array.isArray(input) ? input : (input && Array.isArray(input.packages) ? input.packages : []);
  if (!raw.length) return base;
  return raw.map((item: any, idx: number) => {
    const fallback = base[idx] || {} as any;
    const name = item.name || item.title || fallback.name || `Пакет ${idx + 1}`;
    const price = item.price || fallback.price || 'индивидуально';
    const timeline = item.timeline || fallback.timeline || '';
    const target = item.target || fallback.target || '';
    const popular = (item.popular !== undefined) ? !!item.popular : !!fallback.popular;
    const includes = Array.isArray(item.includes) ? item.includes : (fallback.includes || []);
    const process = Array.isArray(item.process) ? item.process : (fallback.process || []);
    const cta = item.cta || (name === 'Энтерпрайз' ? 'Получить расчет' : `Выбрать ${name}`);
    return { name, price, timeline, target, popular, includes, process, cta };
  });
}

export default async function PricingPage() {
  const pricingData = await getPricingData();
  const packages = normalizePackages(pricingData.packages || pricingData);
  const addons = Array.isArray(pricingData.addons) && pricingData.addons.length > 0 ? pricingData.addons : defaultAddons;
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl font-semibold">Наши цены</h1>
        <p className="mt-4 text-xl text-slate-600">Прозрачные цены. Выберите пакет или запросите индивидуальный расчет.</p>
      </div>

      {/* Packages */}
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {packages.map((pkg) => (
          <div key={pkg.name} className={`rounded-[2rem] bg-white/70 p-6 ring-1 ring-black/5 relative flex flex-col ${pkg.popular ? 'ring-2 ring-paleTeal' : ''}`}>
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="rounded-full bg-paleTeal px-4 py-1 text-xs font-medium text-slate-900">ПОПУЛЯРНЫЙ</div>
              </div>
            )}
            
            <div className="text-center">
              <h3 className="text-xl font-semibold">{pkg.name}</h3>
              <div className="mt-2 text-3xl font-bold">{pkg.price}</div>
              {pkg.timeline && (<div className="text-sm text-slate-600">{pkg.timeline}</div>)}
              {pkg.target && (<div className="text-xs text-slate-500 mt-1">Для {pkg.target}</div>)}
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-sm text-slate-800 mb-3">Что входит:</h4>
              <ul className="space-y-2">
                {pkg.includes.map((item: string, idx: number) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-paleTeal text-xs mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {Array.isArray(pkg.process) && pkg.process.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-sm text-slate-800 mb-3">Процесс:</h4>
                <ul className="space-y-1">
                  {pkg.process.map((step: string, idx: number) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="text-paleTeal">{String(idx + 1)}.</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto pt-6 text-center">
              <Link 
                href="/contact" 
                className={`inline-block rounded-full px-6 py-3 font-medium ${
                  pkg.popular 
                    ? 'bg-paleTeal text-slate-900 hover:bg-paleTeal/90' 
                    : 'border border-softBlueGray/50 text-slate-800 hover:bg-white'
                }`}
              >
                {pkg.cta || (pkg.name === 'Энтерпрайз' ? 'Получить расчет' : `Выбрать ${pkg.name}`)}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add-ons */}
            {/* Add-ons */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-center">Дополнительные услуги</h2>
        <p className="mt-2 text-center text-slate-600">
          Опциональные услуги, которые можно добавить к любому пакету
        </p>
        
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {addons.map((addon: any) => (
            <div key={addon.name} className="rounded-[2rem] bg-white/70 p-6 ring-1 ring-black/5">
              <h3 className="font-semibold">{addon.name}</h3>
              <div className="mt-1 font-bold">{addon.price}</div>
              <p className="mt-2 text-sm text-slate-600">{addon.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-center">Частые вопросы о ценах</h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-semibold">Что входит в ваши пакеты?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Наши пакеты включают все необходимое для успешного цифрового присутствия. От начальной 
              консультации и разработки стратегии до дизайна, разработки и поддержки после запуска. 
              Каждый пакет адаптирован под разные размеры бизнеса и потребности.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold">Как происходит оплата?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Обычно мы разделяем платежи на этапы: 50% авансом для начала работы и 50% после завершения. 
              Для более крупных проектов мы можем организовать более гибкий график платежей. Мы принимаем 
              банковские переводы и основные кредитные карты.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold">Могу ли я обновить пакет позже?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Да, вы можете обновить свой пакет в любое время. Мы оценим вашу текущую настройку и 
              порекомендуем лучший способ масштабировать ваше цифровое присутствие. Разница в стоимости 
              будет рассчитана пропорционально вашему текущему пакету.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold">Предлагаете ли вы индивидуальные решения?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Безусловно! Если наши стандартные пакеты не соответствуют вашим потребностям, мы можем создать 
              индивидуальное решение. Свяжитесь с нами, чтобы обсудить ваши требования, и мы предоставим 
              индивидуальный расчет на основе ваших конкретных целей и объема работ.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-3xl font-semibold text-center">Frequently asked questions</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-[2rem] bg-white/70 p-6 ring-1 ring-black/5">
              <h3 className="font-semibold text-slate-800">{faq.question}</h3>
              <p className="text-sm text-slate-600 mt-2">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16">
        <div className="rounded-[2rem] bg-white/70 p-8 ring-1 ring-black/5 text-center">
          <h2 className="text-2xl font-semibold">Need a custom quote?</h2>
          <p className="mt-2 text-slate-600">We'll estimate scope, timeline, and budget for your specific project</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="rounded-full bg-paleTeal px-6 py-3 text-slate-900 font-medium">Get a quote</Link>
            <a href="https://t.me/CasaAgency" target="_blank" rel="noreferrer" className="rounded-full border border-softBlueGray/50 px-6 py-3 hover:bg-white font-medium">Consultation</a>
          </div>
        </div>
      </section>
    </div>
  );
}





